/**
 * TheMealDB API Integration & Recipe Match Scoring Engine
 */

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

// In-memory cache for meal details to avoid redundant network lookups
const mealCache = new Map();

/**
 * Filter recipes by a single main ingredient
 */
export async function fetchRecipesByIngredient(ingredient) {
  if (!ingredient) return [];
  try {
    const formatted = ingredient.trim().replace(/\s+/g, '_');
    const response = await fetch(`${BASE_URL}/filter.php?i=${encodeURIComponent(formatted)}`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error(`Error filtering recipes by ingredient "${ingredient}":`, error);
    return [];
  }
}

/**
 * Fetch full recipe details by meal ID
 */
export async function fetchMealDetails(idMeal) {
  if (!idMeal) return null;
  if (mealCache.has(idMeal)) {
    return mealCache.get(idMeal);
  }

  try {
    const response = await fetch(`${BASE_URL}/lookup.php?i=${encodeURIComponent(idMeal)}`);
    if (!response.ok) return null;
    const data = await response.json();
    if (data.meals && data.meals.length > 0) {
      const meal = data.meals[0];
      const parsed = formatMealData(meal);
      mealCache.set(idMeal, parsed);
      return parsed;
    }
    return null;
  } catch (error) {
    console.error(`Error looking up meal ID "${idMeal}":`, error);
    return null;
  }
}

/**
 * Extract ingredients and clean up meal data
 */
export function formatMealData(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ing && ing.trim() !== '') {
      ingredients.push({
        ingredient: ing.trim(),
        measure: measure ? measure.trim() : ''
      });
    }
  }

  // Format YouTube embed URL if standard watch url is present
  let youtubeEmbedUrl = null;
  if (meal.strYoutube) {
    const ytMatch = meal.strYoutube.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (ytMatch && ytMatch[1]) {
      youtubeEmbedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
    }
  }

  return {
    idMeal: meal.idMeal,
    strMeal: meal.strMeal,
    strCategory: meal.strCategory || 'General',
    strArea: meal.strArea || 'International',
    strInstructions: meal.strInstructions || '',
    strMealThumb: meal.strMealThumb,
    strTags: meal.strTags ? meal.strTags.split(',').map(t => t.trim()).filter(Boolean) : [],
    strYoutube: meal.strYoutube,
    youtubeEmbedUrl,
    strSource: meal.strSource,
    ingredients
  };
}

/**
 * Check if a user ingredient matches any ingredient in the recipe
 */
function isIngredientMatched(userIng, recipeIngredients) {
  const u = userIng.toLowerCase().trim();
  return recipeIngredients.some(item => {
    const r = item.ingredient.toLowerCase();
    // Substring match in either direction (e.g. "chicken" in "chicken breast", or "garlic" in "garlic clove")
    return r.includes(u) || u.includes(r);
  });
}

/**
 * Calculate match score for a recipe against user's ingredients
 */
export function calculateMatch(recipe, userIngredients) {
  if (!userIngredients || userIngredients.length === 0) {
    return {
      matched: [],
      missing: [],
      matchCount: 0,
      totalCount: 0,
      percentage: 0,
      isFullMatch: false
    };
  }

  const matched = [];
  const missing = [];

  for (const userIng of userIngredients) {
    if (isIngredientMatched(userIng, recipe.ingredients)) {
      matched.push(userIng);
    } else {
      missing.push(userIng);
    }
  }

  const matchCount = matched.length;
  const totalCount = userIngredients.length;
  const percentage = Math.round((matchCount / totalCount) * 100);

  return {
    matched,
    missing,
    matchCount,
    totalCount,
    percentage,
    isFullMatch: matchCount === totalCount && totalCount > 0
  };
}

/**
 * Core Search Orchestrator:
 * 1. Takes parsed ingredients (caps parallel queries to first 4).
 * 2. Fetches candidate meals for all 4 ingredients in parallel.
 * 3. Unions and deduplicates candidate IDs, prioritizing meals appearing in multiple queries.
 * 4. Batches full details lookup.
 * 5. Computes match scores.
 * 6. Ranks 100% matches first, then sorts descending by match count.
 */
export async function searchRecipesByIngredients(userIngredients, offset = 0, limit = 12) {
  if (!userIngredients || userIngredients.length === 0) {
    return {
      recipes: [],
      totalCandidates: 0,
      hasMore: false,
      allCandidateIds: []
    };
  }

  // Cap to first 4 ingredients for API querying as agreed
  const queryIngredients = userIngredients.slice(0, 4);

  // Parallel fetch for each ingredient
  const queryResults = await Promise.all(
    queryIngredients.map(ing => fetchRecipesByIngredient(ing))
  );

  // Track frequency of each meal ID across queried ingredients
  const mealFrequency = new Map();
  const mealBasicInfo = new Map();

  queryResults.forEach(meals => {
    (meals || []).forEach(meal => {
      const id = meal.idMeal;
      mealFrequency.set(id, (mealFrequency.get(id) || 0) + 1);
      if (!mealBasicInfo.has(id)) {
        mealBasicInfo.set(id, meal);
      }
    });
  });

  // Sort candidate meal IDs descending by how many queried ingredients they matched initially
  const sortedCandidateIds = Array.from(mealFrequency.keys()).sort((a, b) => {
    return mealFrequency.get(b) - mealFrequency.get(a);
  });

  if (sortedCandidateIds.length === 0) {
    return {
      recipes: [],
      totalCandidates: 0,
      hasMore: false,
      allCandidateIds: []
    };
  }

  // Slice candidate batch
  const currentBatchIds = sortedCandidateIds.slice(offset, offset + limit);

  // Fetch full details for the batch
  const detailPromises = currentBatchIds.map(id => fetchMealDetails(id));
  const fullMeals = (await Promise.all(detailPromises)).filter(Boolean);

  // Calculate detailed match score for each recipe against ALL user ingredients
  const scoredRecipes = fullMeals.map(recipe => {
    const match = calculateMatch(recipe, userIngredients);
    return {
      ...recipe,
      match
    };
  });

  // Rank: 100% matches first, then by matchCount descending, then alphabetical
  scoredRecipes.sort((a, b) => {
    if (a.match.isFullMatch && !b.match.isFullMatch) return -1;
    if (!a.match.isFullMatch && b.match.isFullMatch) return 1;
    if (b.match.matchCount !== a.match.matchCount) {
      return b.match.matchCount - a.match.matchCount;
    }
    return a.strMeal.localeCompare(b.strMeal);
  });

  const nextOffset = offset + limit;
  const hasMore = nextOffset < sortedCandidateIds.length;

  return {
    recipes: scoredRecipes,
    totalCandidates: sortedCandidateIds.length,
    hasMore,
    nextOffset,
    allCandidateIds: sortedCandidateIds
  };
}

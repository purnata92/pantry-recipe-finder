/**
 * LocalStorage Favorites System
 * Key: 'pantry_chef_favorites'
 */

const STORAGE_KEY = 'pantry_chef_favorites';

export function getStoredFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to parse favorites from localStorage:', error);
    return [];
  }
}

export function saveFavorite(recipe) {
  if (!recipe || !recipe.idMeal) return;
  try {
    const favorites = getStoredFavorites();
    const exists = favorites.some(item => item.idMeal === recipe.idMeal);
    if (!exists) {
      const updated = [recipe, ...favorites];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('favorites-updated'));
    }
  } catch (error) {
    console.error('Failed to save recipe to favorites:', error);
  }
}

export function removeFavorite(idMeal) {
  if (!idMeal) return;
  try {
    const favorites = getStoredFavorites();
    const updated = favorites.filter(item => item.idMeal !== idMeal);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('favorites-updated'));
  } catch (error) {
    console.error('Failed to remove recipe from favorites:', error);
  }
}

export function isFavorite(idMeal) {
  if (!idMeal) return false;
  const favorites = getStoredFavorites();
  return favorites.some(item => item.idMeal === idMeal);
}

export function toggleFavorite(recipe) {
  if (!recipe || !recipe.idMeal) return false;
  if (isFavorite(recipe.idMeal)) {
    removeFavorite(recipe.idMeal);
    return false;
  } else {
    saveFavorite(recipe);
    return true;
  }
}

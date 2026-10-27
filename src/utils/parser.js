/**
 * Natural Language Ingredient Parser
 * Extracts clean, normalized culinary ingredients from natural language sentences.
 */

// Common English filler words & prepositions in cooking queries
const FILLER_WORDS = new Set([
  'i', 'have', 'some', 'and', 'with', 'a', 'an', 'the', 'in', 'my', 'got', 'of',
  'there', 'are', 'is', 'need', 'to', 'use', 'up', 'leftover', 'leftovers', 'kitchen',
  'pantry', 'fridge', 'refrigerator', 'we', 'you', 'for', 'about', 'just', 'also',
  'only', 'please', 'find', 'make', 'cook', 'recipe', 'recipes', 'using', 'from',
  'or', 'any', 'that', 'this', 'fresh', 'frozen', 'raw', 'cooked', 'diced', 'chopped',
  'sliced', 'minced', 'canned', 'dry', 'dried', 'warm', 'cold', 'hot',
  'boneless', 'skinless', 'ground', 'shredded', 'grated', 'crushed', 'whole',
  'lean', 'organic', 'extra', 'virgin', 'baby', 'sweet'
]);

// Common culinary units & packaging words to strip
const CULINARY_UNITS = [
  'tablespoons', 'tablespoon', 'tbsp', 'tbs',
  'teaspoons', 'teaspoon', 'tsp',
  'ounces', 'ounce', 'oz',
  'pounds', 'pound', 'lbs', 'lb',
  'kilograms', 'kilogram', 'kg',
  'grams', 'gram', 'g',
  'cups', 'cup',
  'pints', 'pint', 'pt',
  'quarts', 'quart', 'qt',
  'gallons', 'gallon',
  'milliliters', 'milliliter', 'ml',
  'liters', 'liter', 'l',
  'cloves', 'clove',
  'cans', 'can', 'can of',
  'bottles', 'bottle',
  'packets', 'packet', 'pkg',
  'slices', 'slice',
  'pieces', 'piece',
  'bunches', 'bunch',
  'heads', 'head',
  'stalks', 'stalk',
  'sprigs', 'sprig',
  'dashes', 'dash',
  'pinches', 'pinch',
  'handfuls', 'handful',
  'strips', 'strip',
  'fillets', 'fillet',
  'breasts', 'breast'
];

// Plural normalizations specific to common ingredients in TheMealDB
const PLURAL_MAP = {
  tomatoes: 'tomato',
  potatoes: 'potato',
  onions: 'onion',
  eggs: 'egg',
  mushrooms: 'mushroom',
  carrots: 'carrot',
  peppers: 'pepper',
  lemons: 'lemon',
  limes: 'lime',
  apples: 'apple',
  oranges: 'orange',
  bananas: 'banana',
  strawberries: 'strawberry',
  blueberries: 'blueberry',
  raspberries: 'raspberry',
  avocados: 'avocado',
  cucumbers: 'cucumber',
  zucchinis: 'zucchini',
  sausages: 'sausage',
  shrimps: 'shrimp',
  prawns: 'prawn',
  noodles: 'noodle',
  beans: 'bean',
  lentils: 'lentil',
  chickpeas: 'chickpea',
  peas: 'pea',
  scallions: 'scallion',
  shallots: 'shallot',
  garlics: 'garlic',
  steaks: 'steak',
  ribs: 'rib',
  wings: 'wing',
  leaves: 'leaf',
  herbs: 'herb',
  chillies: 'chilli',
  chiles: 'chile',
  chilis: 'chili',
  olives: 'olive',
  nuts: 'nut',
  walnuts: 'walnut',
  almonds: 'almond',
  peanuts: 'peanut'
};

/**
 * Normalizes an ingredient token (stemming plurals, lowercase)
 */
export function normalizeIngredient(word) {
  if (!word) return '';
  const cleaned = word.toLowerCase().trim();
  
  if (PLURAL_MAP[cleaned]) {
    return PLURAL_MAP[cleaned];
  }
  
  // Generic plural handling if ends in 's' and longer than 3 chars (e.g. spices -> spice)
  if (cleaned.endsWith('s') && !cleaned.endsWith('ss') && cleaned.length > 3) {
    const singular = cleaned.slice(0, -1);
    if (PLURAL_MAP[singular]) return PLURAL_MAP[singular];
  }

  return cleaned;
}

/**
 * Parse natural language string into a clean array of ingredient keywords.
 * Example inputs:
 *  - "I have chicken, garlic, and rice" -> ["chicken", "garlic", "rice"]
 *  - "2 lbs of boneless chicken breasts, 3 cloves garlic, 1 cup rice" -> ["chicken", "garlic", "rice"]
 *  - "eggs, tomato, spinach" -> ["egg", "tomato", "spinach"]
 */
export function parseIngredients(input) {
  if (!input || typeof input !== 'string') return [];

  let text = input.toLowerCase();

  // Replace common separators with commas for consistent segmenting
  text = text.replace(/(\band\b|\bwith\b|\s*&\s*|\s*\+\s*|\s*;\s*|\s*\n\s*)/gi, ',');

  // Split into segments by comma
  const segments = text.split(',');

  const ingredients = [];

  for (let segment of segments) {
    let s = segment.trim();
    if (!s) continue;

    // Strip numbers, fractions, decimal values (e.g. 500, 2.5, 1/2, 2)
    s = s.replace(/[\d/.]+/g, ' ');

    // Strip unit words
    const unitRegex = new RegExp(`\\b(${CULINARY_UNITS.join('|')})\\b`, 'gi');
    s = s.replace(unitRegex, ' ');

    // Split remaining words in this segment
    const words = s
      .replace(/[^a-zA-Z\s-]/g, ' ')
      .split(/\s+/)
      .map(w => w.trim())
      .filter(w => w.length > 1 && !FILLER_WORDS.has(w));

    if (words.length > 0) {
      // Reassemble compound ingredients if appropriate (e.g. "olive oil", "cheddar cheese")
      // or normalize individual words
      const candidate = words.map(normalizeIngredient).join(' ');
      
      // Basic sanity check to avoid single nonsense characters
      if (candidate.length >= 2 && !ingredients.includes(candidate)) {
        ingredients.push(candidate);
      }
    }
  }

  return ingredients;
}

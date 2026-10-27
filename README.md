# 🍳 Pantry Recipe Finder (PantryChef)

A modern single-page web application built with **React**, **Tailwind CSS**, and **Lucide React** icons that finds delicious recipes based on random ingredients currently in your kitchen pantry or fridge.

---

## ✨ Key Features

1. **Natural Language Ingredient Search**:
   * Type in plain English sentences (e.g. *"I have chicken, garlic, and rice"* or *"2 lbs of chicken breasts, 3 cloves garlic, 1 cup rice"*).
   * Smart NLP parser strips filler words (`have`, `some`, `with`), culinary units (`lbs`, `cloves`, `tbsp`, `cups`), and numbers.
   * Automatically normalizes common plurals (`tomatoes` $\rightarrow$ `tomato`, `eggs` $\rightarrow$ `egg`, `onions` $\rightarrow$ `onion`).
   * Renders interactive ingredient chips (`[chicken ×]`, `[garlic ×]`) with one-click removal and inline addition.

2. **Smart API Integration & Ranking (TheMealDB)**:
   * Queries TheMealDB's `filter.php?i=` for up to 4 ingredients in parallel.
   * Merges and deduplicates candidate recipes.
   * Batches `lookup.php?i=` detail queries for top recipes to prevent API throttling.
   * **Custom Match Scoring**: Ranks **100% pantry matches** first, followed by recipes sorted descending by number of matching ingredients.

3. **Interactive Recipe Cards & Match Badge**:
   * High-resolution meal images, cuisine tags, and category badges.
   * **Interactive Match Score Badge**: Click or hover to open a popover breakdown showing pantry-matched ingredients (green check) vs missing items.

4. **Centered Modal Recipe Details**:
   * Step-by-step instructions.
   * Interactive Ingredient Checklist allowing users to check off items as they prep.
   * Embedded YouTube video player or direct link.
   * Links to original source recipes.

5. **Favorites & Persistence**:
   * One-click heart icon on any card or modal.
   * Persists complete recipe objects to browser `localStorage` under `'pantry_chef_favorites'`.
   * Slide-over **Saved Recipes Drawer** with counter badge and instant offline access.

6. **Polish & Fallback States**:
   * Animated shimmering skeleton cards during loading.
   * Dedicated empty states for:
     * *"No ingredients entered yet"* (with 1-click starter prompts)
     * *"Loading delicious recipes..."* (with animated chef spinner)
     * *"No recipes found for those ingredients"* (with troubleshooting tips)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation & Run

```bash
# Navigate to the project directory
cd pantry-recipe-finder

# Install dependencies (already installed)
npm install

# Start the local development server
npm run dev
```

Open the displayed localhost URL (typically `http://localhost:5173`) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

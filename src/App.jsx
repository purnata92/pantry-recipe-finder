import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import RecipeCard from './components/RecipeCard';
import RecipeModal from './components/RecipeModal';
import FavoritesDrawer from './components/FavoritesDrawer';
import SkeletonLoader from './components/SkeletonLoader';
import EmptyState from './components/EmptyState';
import { parseIngredients } from './utils/parser';
import { searchRecipesByIngredients } from './utils/api';
import { getStoredFavorites } from './utils/storage';
import { Sparkles, UtensilsCrossed, ChevronDown, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [userIngredients, setUserIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [nextOffset, setNextOffset] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [favorites, setFavorites] = useState(() => getStoredFavorites());

  // Keep favorites state synchronized
  const refreshFavorites = useCallback(() => {
    setFavorites(getStoredFavorites());
  }, []);

  useEffect(() => {
    window.addEventListener('favorites-updated', refreshFavorites);
    return () => window.removeEventListener('favorites-updated', refreshFavorites);
  }, [refreshFavorites]);

  // Execute Search
  const handleSearch = async (ingredients) => {
    if (!ingredients || ingredients.length === 0) {
      setRecipes([]);
      setHasSearched(false);
      setHasMore(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const result = await searchRecipesByIngredients(ingredients, 0, 12);
      setRecipes(result.recipes);
      setHasMore(result.hasMore);
      setNextOffset(result.nextOffset || 12);
    } catch (error) {
      console.error('Search failed:', error);
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Pagination: Load next batch
  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const result = await searchRecipesByIngredients(userIngredients, nextOffset, 12);
      setRecipes((prev) => [...prev, ...result.recipes]);
      setHasMore(result.hasMore);
      setNextOffset(result.nextOffset);
    } catch (error) {
      console.error('Load more failed:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Quick prompt handler for initial screen suggestions
  const handleQuickSearch = (query) => {
    const parsed = parseIngredients(query);
    setUserIngredients(parsed);
    handleSearch(parsed);
  };

  // Clear all favorites
  const handleClearFavorites = () => {
    if (window.confirm('Are you sure you want to remove all saved recipes?')) {
      localStorage.removeItem('pantry_chef_favorites');
      setFavorites([]);
    }
  };

  const perfectMatchCount = recipes.filter((r) => r.match?.isFullMatch).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-amber-100 selection:text-amber-900">
      {/* Top Navigation */}
      <Navbar
        favoritesCount={favorites.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
        
        {/* Hero Section */}
        <section className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/70 border border-amber-200 text-amber-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Zero Food Waste Recipe Engine
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Cook what’s already in your kitchen.
          </h1>

          <p className="text-sm sm:text-base text-slate-600">
            Type anything in plain English or list ingredients. We’ll find matching recipes and rank them by how many of your ingredients they use.
          </p>
        </section>

        {/* Search Bar Component */}
        <SearchBar
          userIngredients={userIngredients}
          onIngredientsChange={setUserIngredients}
          onSearch={handleSearch}
          isLoading={isLoading}
        />

        {/* Results Area */}
        <section className="pt-4">
          {/* Loading Skeleton */}
          {isLoading ? (
            <div className="space-y-6">
              <EmptyState type="loading" />
              <SkeletonLoader count={6} />
            </div>
          ) : !hasSearched ? (
            /* Initial State */
            <EmptyState
              type="initial"
              onQuickSearch={handleQuickSearch}
            />
          ) : recipes.length === 0 ? (
            /* No Results Fallback */
            <EmptyState
              type="no-results"
              userIngredients={userIngredients}
            />
          ) : (
            /* Results Grid */
            <div className="space-y-6">
              {/* Results Summary Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                    <UtensilsCrossed className="w-5 h-5 text-amber-600" />
                    Recipes Matching Your Pantry
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Found {recipes.length} recipes — ranked by highest pantry match
                  </p>
                </div>

                {perfectMatchCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    {perfectMatchCount} {perfectMatchCount === 1 ? 'recipe has' : 'recipes have'} 100% of your ingredients!
                  </span>
                )}
              </div>

              {/* Recipe Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.idMeal}
                    recipe={recipe}
                    onSelectRecipe={setSelectedRecipe}
                    onFavoriteChange={refreshFavorites}
                  />
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="pt-6 text-center">
                  <button
                    type="button"
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm bg-white hover:bg-slate-50 text-slate-800 border border-slate-300/80 shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    {isLoadingMore ? (
                      <>
                        <div className="w-4 h-4 border-2 border-slate-400 border-t-slate-800 rounded-full animate-spin" />
                        <span>Loading more recipes...</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                        <span>Load More Delicious Recipes</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-600 space-y-1">
        <p>
          <span className="font-semibold text-slate-700">Pantry Recipe Finder</span> — Powered by TheMealDB API, React & Tailwind CSS
        </p>
        <p className="text-[11px] text-slate-600">
          Built for zero-waste cooking • Favorites saved in browser localStorage
        </p>
      </footer>

      {/* Centered Recipe Modal */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          userIngredients={userIngredients}
          onClose={() => setSelectedRecipe(null)}
          onFavoriteChange={refreshFavorites}
        />
      )}

      {/* Slide-over Favorites Drawer */}
      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onSelectRecipe={(recipe) => {
          setSelectedRecipe(recipe);
          setIsFavoritesOpen(false);
        }}
        onClearAll={handleClearFavorites}
      />
    </div>
  );
}

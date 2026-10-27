import React from 'react';
import { X, Heart, Trash2, ArrowRight, Utensils, ChefHat } from 'lucide-react';
import { removeFavorite } from '../utils/storage';

export default function FavoritesDrawer({
  isOpen,
  onClose,
  favorites,
  onSelectRecipe,
  onClearAll
}) {
  if (!isOpen) return null;

  const handleRemove = (e, idMeal) => {
    e.stopPropagation();
    removeFavorite(idMeal);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
          
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                <Heart className="w-5 h-5 fill-rose-500" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-lg">Saved Recipes</h2>
                <p className="text-xs text-slate-500">
                  {favorites.length} {favorites.length === 1 ? 'recipe' : 'recipes'} stored in your kitchen
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {favorites.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-400">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-800 text-base">
                  No Saved Recipes Yet
                </h3>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                  Click the heart icon on any recipe card to save it here for quick access, even after reloading the page!
                </p>
              </div>
            ) : (
              favorites.map((recipe) => (
                <div
                  key={recipe.idMeal}
                  onClick={() => {
                    onSelectRecipe(recipe);
                  }}
                  className="group flex items-center gap-3.5 p-3 rounded-2xl border border-slate-200/80 hover:border-amber-400 hover:bg-amber-50/30 transition-all cursor-pointer shadow-xs"
                >
                  <img
                    src={recipe.strMealThumb}
                    alt={recipe.strMeal}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 shadow-xs"
                  />

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-semibold text-amber-700 uppercase tracking-wider block">
                      {recipe.strCategory}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm truncate group-hover:text-amber-600 transition-colors">
                      {recipe.strMeal}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <ChefHat className="w-3 h-3 text-slate-400" />
                      {recipe.ingredients?.length || 0} ingredients
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleRemove(e, recipe.idMeal)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Remove from favorites"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="p-1 text-slate-300 group-hover:text-amber-600 transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {favorites.length > 0 && (
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <button
                type="button"
                onClick={onClearAll}
                className="text-xs font-semibold text-rose-600 hover:text-rose-800 hover:underline cursor-pointer"
              >
                Clear all favorites
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

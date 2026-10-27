import React, { useState } from 'react';
import { Heart, Sparkles, Check, AlertCircle, ArrowUpRight, ChefHat, Globe } from 'lucide-react';
import { isFavorite, toggleFavorite } from '../utils/storage';

export default function RecipeCard({
  recipe,
  onSelectRecipe,
  onFavoriteChange
}) {
  const [isSaved, setIsSaved] = useState(() => isFavorite(recipe.idMeal));
  const [showMatchPopover, setShowMatchPopover] = useState(false);

  const handleHeartClick = (e) => {
    e.stopPropagation();
    const nextState = toggleFavorite(recipe);
    setIsSaved(nextState);
    if (onFavoriteChange) onFavoriteChange(recipe, nextState);
  };

  const match = recipe.match || {
    matched: [],
    missing: [],
    matchCount: 0,
    totalCount: 0,
    percentage: 0,
    isFullMatch: false
  };

  return (
    <article
      onClick={() => onSelectRecipe(recipe)}
      className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-amber-300/80 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer hover:-translate-y-1.5"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
        <img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-80" />

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={handleHeartClick}
          className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 backdrop-blur-md text-slate-700 hover:text-rose-500 hover:bg-white shadow-md transition-all active:scale-90 cursor-pointer z-10"
          title={isSaved ? 'Remove from Saved Recipes' : 'Save to Favorites'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isSaved ? 'fill-rose-500 text-rose-500 scale-110' : 'text-slate-600'
            }`}
          />
        </button>

        {/* Category & Cuisine Tags on Image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
          <span className="px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-md font-medium border border-white/10 flex items-center gap-1">
            <ChefHat className="w-3 h-3 text-amber-400" />
            {recipe.strCategory}
          </span>
          {recipe.strArea && (
            <span className="px-2 py-1 rounded-lg bg-black/40 backdrop-blur-md font-medium text-slate-200 text-[11px] flex items-center gap-1">
              <Globe className="w-3 h-3 text-slate-400" />
              {recipe.strArea}
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Meal Title */}
          <h2 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-2 text-base sm:text-lg leading-snug">
            {recipe.strMeal}
          </h2>

          {/* Recipe Ingredients count snippet */}
          <p className="text-xs text-slate-500 mt-1">
            Requires {recipe.ingredients?.length || 0} ingredients
          </p>
        </div>

        {/* Match Score Badge with Interactive Popover */}
        <div className="relative pt-1 border-t border-slate-100">
          <div
            className="inline-block w-full"
            onMouseEnter={() => setShowMatchPopover(true)}
            onMouseLeave={() => setShowMatchPopover(false)}
            onClick={(e) => {
              e.stopPropagation();
              setShowMatchPopover(!showMatchPopover);
            }}
          >
            {match.totalCount > 0 ? (
              <div
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                  match.isFullMatch
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : match.matchCount > 0
                    ? 'bg-amber-50 text-amber-900 border-amber-200'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  {match.isFullMatch ? (
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Check className="w-3.5 h-3.5 text-amber-600" />
                  )}
                  <span>
                    {match.isFullMatch
                      ? '100% Pantry Match!'
                      : `${match.matchCount} of ${match.totalCount} pantry items (${match.percentage}%)`}
                  </span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-75 underline decoration-dotted">
                  Inspect
                </span>
              </div>
            ) : (
              <div className="text-xs text-slate-400 py-1 flex items-center gap-1">
                <span>Click to view recipe details</span>
              </div>
            )}

            {/* Interactive Popover Breakdown */}
            {showMatchPopover && match.totalCount > 0 && (
              <div
                className="absolute bottom-full left-0 right-0 mb-2 p-3 bg-slate-900/95 text-white text-xs rounded-xl shadow-2xl backdrop-blur-md z-20 border border-slate-700/80 animate-in fade-in slide-in-from-bottom-2 duration-150"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="font-semibold text-slate-200 pb-1.5 mb-2 border-b border-slate-800 flex items-center justify-between">
                  <span>Pantry Match Breakdown</span>
                  <span className="text-amber-400">{match.percentage}% match</span>
                </div>

                {/* Matched items */}
                {match.matched.length > 0 && (
                  <div className="mb-2">
                    <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
                      In Your Pantry ({match.matched.length})
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {match.matched.map((ing) => (
                        <span
                          key={ing}
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-900/50 text-emerald-200 border border-emerald-700/50 text-[11px]"
                        >
                          <Check className="w-2.5 h-2.5 text-emerald-400" />
                          <span className="capitalize">{ing}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing user items */}
                {match.missing.length > 0 && (
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Not Used in Recipe ({match.missing.length})
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {match.missing.map((ing) => (
                        <span
                          key={ing}
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 text-[11px]"
                        >
                          <AlertCircle className="w-2.5 h-2.5 text-slate-500" />
                          <span className="capitalize">{ing}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* View Details Button */}
          <div className="mt-3 pt-2 flex items-center justify-between text-xs font-semibold text-amber-600 group-hover:text-amber-700">
            <span>View Full Recipe & Instructions</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </div>
    </article>
  );
}

import React from 'react';
import { CookingPot, Heart, Sparkles } from 'lucide-react';

export default function Navbar({ favoritesCount, onOpenFavorites }) {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-md shadow-amber-500/20 text-white">
            <CookingPot className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                Pantry<span className="text-amber-600">Chef</span>
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                <Sparkles className="w-3 h-3 text-amber-500" /> TheMealDB
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Find delicious recipes with what you have in your kitchen
            </p>
          </div>
        </div>

        {/* Favorites Trigger */}
        <button
          type="button"
          onClick={onOpenFavorites}
          className="relative inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition-all active:scale-95 cursor-pointer border border-slate-200/60 shadow-xs"
          title="View Saved Favorite Recipes"
        >
          <Heart className={`w-4 h-4 transition-colors ${favoritesCount > 0 ? 'fill-rose-500 text-rose-500' : 'text-slate-500'}`} />
          <span className="hidden xs:inline">Saved Recipes</span>
          {favoritesCount > 0 && (
            <span className="px-1.5 py-0.5 text-xs font-bold rounded-full bg-rose-500 text-white min-w-5 text-center leading-none">
              {favoritesCount}
            </span>
          )}
        </button>

      </div>
    </header>
  );
}

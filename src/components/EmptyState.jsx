import React from 'react';
import { CookingPot, SearchX, Sparkles, ChefHat } from 'lucide-react';

export default function EmptyState({ type, userIngredients = [], onQuickSearch }) {
  if (type === 'initial') {
    return (
      <div className="text-center py-16 px-4 max-w-lg mx-auto space-y-5 animate-in fade-in duration-300">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-100 to-orange-100 border border-amber-200/60 flex items-center justify-center mx-auto text-amber-600 shadow-sm">
          <CookingPot className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-800">
            No ingredients entered yet
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Tell us what random ingredients are sitting in your fridge or pantry, and we'll discover delicious recipes you can cook right now.
          </p>
        </div>

        <div className="pt-2">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">
            Or try one of these common combinations:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              'Chicken, garlic, rice',
              'Eggs, tomato, spinach',
              'Pasta, olive oil, basil',
              'Beef, onion, potato'
            ].map((combo) => (
              <button
                key={combo}
                type="button"
                onClick={() => onQuickSearch && onQuickSearch(combo)}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-amber-50 text-xs font-semibold text-slate-700 hover:text-amber-800 border border-slate-200 hover:border-amber-300 shadow-xs transition-all cursor-pointer active:scale-95"
              >
                + {combo}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'loading') {
    return (
      <div className="text-center py-20 px-4 space-y-4 animate-in fade-in duration-200">
        <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-amber-200 border-t-amber-500 animate-spin" />
          <ChefHat className="w-7 h-7 text-amber-600 animate-bounce" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-800">
            Loading delicious recipes...
          </h2>
          <p className="text-xs text-slate-500">
            Scanning TheMealDB and calculating pantry match scores
          </p>
        </div>
      </div>
    );
  }

  if (type === 'no-results') {
    return (
      <div className="text-center py-16 px-4 max-w-md mx-auto space-y-4 animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <SearchX className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-800">
            No recipes found for those ingredients.
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            We searched for recipes using <span className="font-semibold text-slate-700">{userIngredients.join(', ')}</span> but couldn't find any direct matches in TheMealDB.
          </p>
        </div>

        <div className="pt-2 text-xs text-slate-500 bg-slate-50 border border-slate-200/80 p-4 rounded-2xl text-left space-y-1.5">
          <p className="font-semibold text-slate-700 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Tips to find more recipes:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-600">
            <li>Try searching for broader primary staples (e.g. "chicken", "beef", "egg", "pasta")</li>
            <li>Remove overly specific brand names or rare spices</li>
            <li>Try using fewer ingredients at once</li>
          </ul>
        </div>
      </div>
    );
  }

  return null;
}

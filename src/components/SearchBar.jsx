import React, { useState, useRef } from 'react';
import { Search, Sparkles, X, Plus, ChefHat } from 'lucide-react';
import { parseIngredients, normalizeIngredient } from '../utils/parser';

const QUICK_SUGGESTIONS = [
  { label: '🍗 Chicken, Garlic & Rice', query: 'I have chicken, garlic, and rice' },
  { label: '🥚 Eggs, Tomato & Spinach', query: 'eggs, tomato, spinach' },
  { label: '🍝 Pasta, Olive Oil & Basil', query: 'pasta with olive oil and fresh basil' },
  { label: '🥔 Potato, Onion & Cheese', query: 'some potatoes, cheddar cheese, and onions' }
];

export default function SearchBar({
  userIngredients,
  onIngredientsChange,
  onSearch,
  isLoading
}) {
  const [inputText, setInputText] = useState('');
  const [newChipInput, setNewChipInput] = useState('');
  const [isAddingChip, setIsAddingChip] = useState(false);
  const newChipInputRef = useRef(null);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const parsed = parseIngredients(inputText);
    if (parsed.length > 0) {
      // Merge with existing ingredients avoiding duplicates
      const merged = Array.from(new Set([...userIngredients, ...parsed]));
      onIngredientsChange(merged);
      setInputText('');
      onSearch(merged);
    }
  };

  const handleSuggestionClick = (query) => {
    setInputText('');
    const parsed = parseIngredients(query);
    onIngredientsChange(parsed);
    onSearch(parsed);
  };

  const handleRemoveChip = (ingredientToRemove) => {
    const updated = userIngredients.filter(item => item !== ingredientToRemove);
    onIngredientsChange(updated);
    if (updated.length > 0) {
      onSearch(updated);
    }
  };

  const handleClearAll = () => {
    onIngredientsChange([]);
    setInputText('');
  };

  const handleAddChipSubmit = (e) => {
    e?.preventDefault();
    const clean = normalizeIngredient(newChipInput.trim());
    if (clean && !userIngredients.includes(clean)) {
      const updated = [...userIngredients, clean];
      onIngredientsChange(updated);
      onSearch(updated);
    }
    setNewChipInput('');
    setIsAddingChip(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {/* Search Input Box */}
      <form onSubmit={handleFormSubmit} className="relative">
        <div className="relative flex items-center shadow-lg shadow-slate-200/50 rounded-2xl bg-white border border-slate-200/80 transition-all focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/10">
          <div className="pl-4 sm:pl-5 text-slate-400">
            <Search className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
          </div>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="What's in your pantry? (e.g. 'I have chicken, garlic, and rice' or 'eggs, tomato')"
            className="w-full py-4 px-3 sm:py-4.5 sm:px-4 text-sm sm:text-base text-slate-800 placeholder-slate-400 bg-transparent outline-none font-medium"
            disabled={isLoading}
          />

          {inputText && (
            <button
              type="button"
              onClick={() => setInputText('')}
              className="p-2 mr-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer rounded-lg"
              title="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="pr-2 sm:pr-2.5">
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-md shadow-amber-500/20 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span className="hidden sm:inline">Find Recipes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Extracted Ingredient Chips */}
      {userIngredients.length > 0 && (
        <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-3 sm:p-4 transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900 uppercase tracking-wider">
              <ChefHat className="w-3.5 h-3.5 text-amber-600" />
              Your Kitchen Pantry ({userIngredients.length})
            </div>
            <button
              type="button"
              onClick={handleClearAll}
              className="text-xs text-amber-700 hover:text-amber-900 hover:underline font-medium cursor-pointer"
            >
              Clear all
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {userIngredients.map((ingredient, idx) => (
              <span
                key={ingredient}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-white text-slate-800 border border-amber-200/80 shadow-xs hover:border-amber-300 transition-all animate-fadeIn"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="capitalize">{ingredient}</span>
                {idx < 4 && (
                  <span className="text-[10px] text-amber-600/80 font-normal px-1 bg-amber-50 rounded" title="Used in search query">
                    Q{idx + 1}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveChip(ingredient)}
                  className="p-0.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors cursor-pointer ml-0.5"
                  title={`Remove ${ingredient}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}

            {/* Inline Add Chip Form */}
            {isAddingChip ? (
              <form onSubmit={handleAddChipSubmit} className="inline-flex items-center">
                <input
                  ref={newChipInputRef}
                  type="text"
                  value={newChipInput}
                  onChange={(e) => setNewChipInput(e.target.value)}
                  onBlur={() => {
                    if (!newChipInput.trim()) setIsAddingChip(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setIsAddingChip(false);
                  }}
                  autoFocus
                  placeholder="Ingredient name..."
                  className="px-2.5 py-1 text-xs sm:text-sm rounded-lg border border-amber-400 bg-white text-slate-800 outline-none w-32 shadow-xs"
                />
              </form>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsAddingChip(true);
                  setTimeout(() => newChipInputRef.current?.focus(), 50);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-amber-800 bg-amber-100/70 hover:bg-amber-200/70 transition-colors cursor-pointer border border-dashed border-amber-300"
              >
                <Plus className="w-3 h-3" />
                Add Item
              </button>
            )}
          </div>
        </div>
      )}

      {/* Quick Starter Suggestions */}
      {userIngredients.length === 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
          <span className="text-slate-600 font-medium mr-1">Quick ideas:</span>
          {QUICK_SUGGESTIONS.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleSuggestionClick(item.query)}
              className="px-3 py-1.5 rounded-full bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-800 border border-slate-200/80 hover:border-amber-300 shadow-xs transition-all active:scale-95 cursor-pointer font-medium"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

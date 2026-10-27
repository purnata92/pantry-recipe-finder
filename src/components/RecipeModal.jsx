import React, { useState, useEffect } from 'react';
import {
  X,
  Heart,
  Video,
  Play,
  ExternalLink,
  Check,
  ChefHat,
  Globe,
  Tag,
  ListChecks,
  BookOpen
} from 'lucide-react';
import { isFavorite, toggleFavorite } from '../utils/storage';

export default function RecipeModal({
  recipe,
  userIngredients = [],
  onClose,
  onFavoriteChange
}) {
  const [isSaved, setIsSaved] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState({});

  useEffect(() => {
    if (recipe) {
      setIsSaved(isFavorite(recipe.idMeal));
      setCheckedIngredients({});
    }
  }, [recipe]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!recipe) return null;

  const handleHeartToggle = () => {
    const next = toggleFavorite(recipe);
    setIsSaved(next);
    if (onFavoriteChange) onFavoriteChange(recipe, next);
  };

  const toggleIngredientCheck = (index) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Determine if this recipe ingredient matched the user's pantry search
  const isPantryMatched = (ingName) => {
    if (!userIngredients || userIngredients.length === 0) return false;
    const nameLower = ingName.toLowerCase();
    return userIngredients.some((u) => {
      const uLower = u.toLowerCase();
      return nameLower.includes(uLower) || uLower.includes(nameLower);
    });
  };

  // Format instructions into clean readable steps
  const instructionParagraphs = recipe.strInstructions
    ? recipe.strInstructions
        .split(/\r?\n+/)
        .map((p) => p.trim())
        .filter((p) => p.length > 0)
    : [];

  const checkedCount = Object.values(checkedIngredients).filter(Boolean).length;
  const totalIngredients = recipe.ingredients?.length || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Content */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                <ChefHat className="w-3 h-3 text-amber-700" />
                {recipe.strCategory}
              </span>
              {recipe.strArea && (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  <Globe className="w-3 h-3 text-slate-500" />
                  {recipe.strArea}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">
              {recipe.strMeal}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleHeartToggle}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-rose-600 transition-colors cursor-pointer"
              title={isSaved ? 'Remove from favorites' : 'Save to favorites'}
            >
              <Heart
                className={`w-5 h-5 ${
                  isSaved ? 'fill-rose-500 text-rose-500' : 'text-slate-600'
                }`}
              />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              title="Close modal (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-7 space-y-7">
          {/* Top Banner / Image & YouTube Player */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Meal Image */}
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-100 shadow-sm border border-slate-200/60">
              <img
                src={recipe.strMealThumb}
                alt={recipe.strMeal}
                className="w-full h-full object-cover"
              />
            </div>

            {/* YouTube Video or Visual Showcase */}
            {recipe.youtubeEmbedUrl ? (
              <div className="relative rounded-2xl overflow-hidden aspect-video bg-black shadow-sm border border-slate-800">
                <iframe
                  src={recipe.youtubeEmbedUrl}
                  title={`${recipe.strMeal} Recipe Video`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : recipe.strYoutube ? (
              <div className="rounded-2xl p-6 bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center space-y-3 aspect-video">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 shadow-sm">
                  <Play className="w-6 h-6 fill-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm">
                    Video Tutorial Available
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Watch step-by-step preparation on YouTube
                  </p>
                </div>
                <a
                  href={recipe.strYoutube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-all shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-white" /> Watch on YouTube
                </a>
              </div>
            ) : (
              <div className="rounded-2xl p-6 bg-amber-50/50 border border-amber-200/60 flex flex-col justify-center aspect-video">
                <h3 className="font-bold text-slate-800 text-base mb-1">
                  Ready to Cook?
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Follow the interactive checklist below to mark ingredients as you prep.
                  Ingredients matching your pantry search are highlighted in amber.
                </p>
              </div>
            )}
          </div>

          {/* 2-Column: Ingredients Checklist & Cooking Instructions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Ingredients Checklist Column */}
            <div className="lg:col-span-1 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <ListChecks className="w-4 h-4 text-amber-600" />
                  <h3 className="font-bold text-slate-900 text-base">
                    Ingredients ({totalIngredients})
                  </h3>
                </div>
                {totalIngredients > 0 && (
                  <span className="text-xs font-semibold text-slate-500">
                    {checkedCount}/{totalIngredients} prepped
                  </span>
                )}
              </div>

              <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
                {recipe.ingredients?.map((item, idx) => {
                  const isChecked = !!checkedIngredients[idx];
                  const matched = isPantryMatched(item.ingredient);

                  return (
                    <div
                      key={idx}
                      onClick={() => toggleIngredientCheck(idx)}
                      className={`flex items-start gap-2.5 p-2 rounded-xl text-xs sm:text-sm transition-all cursor-pointer select-none border ${
                        isChecked
                          ? 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                          : matched
                          ? 'bg-amber-50/90 text-amber-950 border-amber-200/90 font-medium'
                          : 'bg-white text-slate-700 border-slate-200/60 hover:bg-slate-50'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border transition-colors ${
                          isChecked
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : matched
                            ? 'border-amber-400 bg-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-3" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className="font-semibold capitalize">
                          {item.ingredient}
                        </span>
                        {item.measure && (
                          <span className="text-slate-500 ml-1 font-normal">
                            — {item.measure}
                          </span>
                        )}
                      </div>

                      {matched && !isChecked && (
                        <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded shrink-0">
                          Pantry
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step-by-Step Cooking Instructions Column */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <BookOpen className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Step-by-Step Instructions
                </h3>
              </div>

              <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed max-h-[380px] overflow-y-auto pr-2">
                {instructionParagraphs.length > 0 ? (
                  instructionParagraphs.map((paragraph, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3"
                    >
                      <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="flex-1 leading-relaxed text-slate-800">
                        {paragraph}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 italic">
                    No detailed instructions provided for this meal.
                  </p>
                )}
              </div>

              {/* Tags & External Source footer */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                {recipe.strTags && recipe.strTags.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Tag className="w-3.5 h-3.5 text-slate-400" />
                    {recipe.strTags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {recipe.strSource && (
                  <a
                    href={recipe.strSource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-800 hover:underline font-semibold ml-auto"
                  >
                    View Original Source <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

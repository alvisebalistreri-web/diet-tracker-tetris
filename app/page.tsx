'use client';

import { useState, useEffect } from 'react';

interface FoodItem {
  id: number;
  repas: string;
  nom: string;
  quantite: string;
}

const foodData: FoodItem[] = [
  { id: 1, repas: 'Meal 1', nom: 'Farine d\'avoine (Brownie/Choco)', quantite: 'X g' },
  { id: 2, repas: 'Meal 1', nom: 'Œufs entiers', quantite: 'X' },
  { id: 3, repas: 'Meal 1', nom: 'Blancs d\'œufs', quantite: 'X g' },
  { id: 4, repas: 'Meal 1', nom: 'Fruits rouges', quantite: '100 g' },
  { id: 5, repas: 'Meal 1', nom: 'Beurre d\'amande', quantite: 'X g' },
  { id: 6, repas: 'Autour de l\'entrainement', nom: 'Whey Protein', quantite: '1 dose' },
  { id: 7, repas: 'Autour de l\'entrainement', nom: 'Crème de riz', quantite: 'X g' },
  { id: 8, repas: 'Meal 2 / Déjeuner', nom: 'Poulet ou Poisson', quantite: 'X g' },
  { id: 9, repas: 'Meal 2 / Déjeuner', nom: 'Patate douce ou Riz', quantite: 'X g' },
  { id: 10, repas: 'Meal 2 / Déjeuner', nom: 'Huile d\'olive', quantite: '1 CàS' },
  { id: 11, repas: 'Meal 3 / Collation', nom: 'Skyr', quantite: 'X g' },
  { id: 12, repas: 'Meal 3 / Collation', nom: 'Ananas', quantite: 'X g' },
];

const mealColors: Record<string, string> = {
  'Meal 1': 'from-blue-500 to-blue-600',
  'Autour de l\'entrainement': 'from-purple-500 to-purple-600',
  'Meal 2 / Déjeuner': 'from-orange-500 to-orange-600',
  'Meal 3 / Collation': 'from-green-500 to-green-600',
};

const mealBadges: Record<string, string> = {
  'Meal 1': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Autour de l\'entrainement': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Meal 2 / Déjeuner': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Meal 3 / Collation': 'bg-green-500/20 text-green-400 border-green-500/30',
};

export default function Home() {
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('diet-tracker-checked');
    if (saved) {
      setCheckedItems(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage when checkedItems changes
  useEffect(() => {
    localStorage.setItem('diet-tracker-checked', JSON.stringify(checkedItems));
    const percentage = Math.round((checkedItems.length / foodData.length) * 100);
    setProgress(percentage);
  }, [checkedItems]);

  const toggleItem = (id: number) => {
    setCheckedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const resetDay = () => {
    if (confirm('Reset all items for today?')) {
      setCheckedItems([]);
    }
  };

  const checkedFood = foodData.filter(item => checkedItems.includes(item.id));
  const uncheckedFood = foodData.filter(item => !checkedItems.includes(item.id));

  // Group by meal
  const groupByMeal = (items: FoodItem[]) => {
    return items.reduce((acc, item) => {
      if (!acc[item.repas]) acc[item.repas] = [];
      acc[item.repas].push(item);
      return acc;
    }, {} as Record<string, FoodItem[]>);
  };

  const checkedByMeal = groupByMeal(checkedFood);
  const uncheckedByMeal = groupByMeal(uncheckedFood);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                🎮 Diet Tracker Tetris
              </h1>
              <p className="text-gray-400 text-sm mt-1">Coche tes aliments, suis ta progression</p>
            </div>
            <button
              onClick={resetDay}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg font-semibold transition text-sm"
            >
              🔄 Reset
            </button>
          </div>

          {/* Progress Bar */}
          <div className="bg-gray-800 rounded-full h-6 overflow-hidden border border-gray-700">
            <div
              className={`h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500 ease-out flex items-center justify-center`}
              style={{ width: `${progress}%` }}
            >
              {progress >= 10 && (
                <span className="text-xs font-bold text-white drop-shadow-lg">
                  {progress}%
                </span>
              )}
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>{checkedItems.length} / {foodData.length} aliments</span>
            <span>{progress === 100 ? '🎉 Objectif atteint !' : `${foodData.length - checkedItems.length} restants`}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Remaining to Eat Section */}
        <section className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="text-3xl">🍽️</div>
            <h2 className="text-2xl font-bold text-white">
              Reste à manger aujourd'hui
            </h2>
            <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-full text-sm font-semibold">
              {uncheckedFood.length}
            </span>
          </div>

          {uncheckedFood.length === 0 ? (
            <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-green-400 mb-2">Félicitations !</h3>
              <p className="text-gray-400">Tu as mangé tous tes aliments aujourd'hui !</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(uncheckedByMeal).map(([meal, items]) => (
                <div key={meal} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden">
                  <div className={`bg-gradient-to-r ${mealColors[meal]} px-6 py-3`}>
                    <h3 className="font-bold text-white">{meal}</h3>
                  </div>
                  <div className="p-6 space-y-3">
                    {items.map(item => (
                      <label
                        key={item.id}
                        className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl border border-gray-700 hover:border-gray-600 cursor-pointer transition group"
                      >
                        <div className="flex items-center space-x-4">
                          <input
                            type="checkbox"
                            checked={checkedItems.includes(item.id)}
                            onChange={() => toggleItem(item.id)}
                            className="w-6 h-6 rounded-lg border-2 border-gray-600 bg-gray-800 text-green-500 focus:ring-green-500 focus:ring-2 cursor-pointer"
                          />
                          <div>
                            <p className="font-semibold text-white group-hover:text-gray-200 transition">{item.nom}</p>
                            <p className="text-sm text-gray-400">{item.quantite}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${mealBadges[meal]}`}>
                          {meal.split('/')[0].trim()}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Already Eaten Section */}
        {checkedFood.length > 0 && (
          <section>
            <div className="flex items-center space-x-3 mb-6">
              <div className="text-3xl">✅</div>
              <h2 className="text-2xl font-bold text-white">
                Déjà mangé
              </h2>
              <span className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-sm font-semibold">
                {checkedFood.length}
              </span>
            </div>

            <div className="space-y-6">
              {Object.entries(checkedByMeal).map(([meal, items]) => (
                <div key={meal} className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden opacity-75 hover:opacity-100 transition">
                  <div className={`bg-gradient-to-r ${mealColors[meal]} px-6 py-3 opacity-75`}>
                    <h3 className="font-bold text-white">{meal}</h3>
                  </div>
                  <div className="p-6 space-y-3">
                    {items.map(item => (
                      <label
                        key={item.id}
                        className="flex items-center justify-between p-4 bg-gray-900/30 rounded-xl border border-gray-700/50 cursor-pointer transition"
                      >
                        <div className="flex items-center space-x-4">
                          <input
                            type="checkbox"
                            checked={true}
                            onChange={() => toggleItem(item.id)}
                            className="w-6 h-6 rounded-lg border-2 border-green-500 bg-green-500/20 text-green-500 focus:ring-green-500 focus:ring-2 cursor-pointer"
                          />
                          <div>
                            <p className="font-semibold text-gray-400 line-through">{item.nom}</p>
                            <p className="text-sm text-gray-500">{item.quantite}</p>
                          </div>
                        </div>
                        <span className="text-green-400 text-xl">✓</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>Diet Tracker Tetris — Suis ta progression jour après jour 💪</p>
          <p className="mt-2">Les données sont sauvegardées localement dans ton navigateur</p>
        </div>
      </footer>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';

interface FoodItem {
  id: number;
  repas: string;
  nom: string;
  quantite: string;
  kcal: string;
  prot: string;
  glu: string;
  lip: string;
  jour: 'LES DEUX' | 'ON';
}

const foodData: FoodItem[] = [
  { id: 1, repas: 'Meal 1', nom: 'Farine d\'avoine (Brownie/Choco)', quantite: 'X g', kcal: 'X', prot: 'X', glu: 'X', lip: 'X', jour: 'LES DEUX' },
  { id: 2, repas: 'Meal 1', nom: 'Œufs entiers', quantite: 'X', kcal: 'X', prot: 'X', glu: 'X', lip: 'X', jour: 'LES DEUX' },
  { id: 3, repas: 'Meal 1', nom: 'Blancs d\'œufs', quantite: 'X g', kcal: 'X', prot: 'X', glu: 'X', lip: 'X', jour: 'LES DEUX' },
  { id: 4, repas: 'Meal 1', nom: 'Fruits rouges', quantite: '100 g', kcal: 'X', prot: 'X', glu: 'X', lip: 'X', jour: 'LES DEUX' },
  { id: 5, repas: 'Meal 1', nom: 'Beurre d\'amande', quantite: 'X g', kcal: 'X', prot: 'X', glu: 'X', lip: 'X', jour: 'LES DEUX' },
  { id: 6, repas: 'Autour de l\'entrainement', nom: 'Whey Protein', quantite: '1 dose', kcal: 'X', prot: 'X', glu: 'X', lip: 'X', jour: 'ON' },
  { id: 7, repas: 'Autour de l\'entrainement', nom: 'Crème de riz', quantite: 'X g', kcal: 'X', prot: 'X', glu: 'X', lip: 'X', jour: 'ON' },
  { id: 8, repas: 'Meal 2', nom: 'Poulet / Poisson', quantite: 'X g', kcal: 'X', prot: 'X', glu: 'X', lip: 'X', jour: 'LES DEUX' },
  { id: 9, repas: 'Meal 2', nom: 'Riz / Patate douce', quantite: 'X g', kcal: 'X', prot: 'X', glu: 'X', lip: 'X', jour: 'ON' },
  { id: 10, repas: 'Meal 2', nom: 'Légumes verts', quantite: 'X g', kcal: 'X', prot: 'X', glu: 'X', lip: 'X', jour: 'LES DEUX' },
  { id: 11, repas: 'Meal 2', nom: 'Huile d\'olive', quantite: '1 CàS', kcal: 'X', prot: 'X', glu: 'X', lip: 'X', jour: 'LES DEUX' },
  { id: 12, repas: 'Collation', nom: 'Skyr', quantite: 'X g', kcal: 'X', prot: 'X', glu: 'X', lip: 'X', jour: 'LES DEUX' },
  { id: 13, repas: 'Collation', nom: 'Ananas', quantite: 'X g', kcal: 'X', prot: 'X', glu: 'X', lip: 'X', jour: 'LES DEUX' },
];

const mealColors: Record<string, string> = {
  'Meal 1': 'from-blue-500 to-blue-600',
  'Autour de l\'entrainement': 'from-purple-500 to-purple-600',
  'Meal 2': 'from-orange-500 to-orange-600',
  'Collation': 'from-green-500 to-green-600',
};

const mealBadges: Record<string, string> = {
  'Meal 1': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Autour de l\'entrainement': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Meal 2': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Collation': 'bg-green-500/20 text-green-400 border-green-500/30',
};

export default function Home() {
  const [isTrainingDay, setIsTrainingDay] = useState(true);
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [totals, setTotals] = useState({ kcal: 0, prot: 0, glu: 0, lip: 0 });

  // Load from localStorage on mount
  useEffect(() => {
    const savedChecked = localStorage.getItem('diet-tracker-checked');
    const savedDay = localStorage.getItem('diet-tracker-day');
    if (savedChecked) {
      setCheckedItems(JSON.parse(savedChecked));
    }
    if (savedDay) {
      setIsTrainingDay(savedDay === 'ON');
    }
  }, []);

  // Save to localStorage and calculate totals
  useEffect(() => {
    localStorage.setItem('diet-tracker-checked', JSON.stringify(checkedItems));
    localStorage.setItem('diet-tracker-day', isTrainingDay ? 'ON' : 'OFF');
    
    // Calculate totals
    const newTotals = { kcal: 0, prot: 0, glu: 0, lip: 0 };
    checkedItems.forEach(id => {
      const item = foodData.find(f => f.id === id);
      if (item) {
        if (item.kcal !== 'X') newTotals.kcal += parseInt(item.kcal) || 0;
        if (item.prot !== 'X') newTotals.prot += parseInt(item.prot) || 0;
        if (item.glu !== 'X') newTotals.glu += parseInt(item.glu) || 0;
        if (item.lip !== 'X') newTotals.lip += parseInt(item.lip) || 0;
      }
    });
    setTotals(newTotals);
  }, [checkedItems, isTrainingDay]);

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

  // Filter foods based on training day
  const availableFoods = foodData.filter(item => 
    item.jour === 'LES DEUX' || (isTrainingDay && item.jour === 'ON')
  );

  const checkedFood = availableFoods.filter(item => checkedItems.includes(item.id));
  const uncheckedFood = availableFoods.filter(item => !checkedItems.includes(item.id));

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
      {/* Header with Toggle and Macros */}
      <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Title and Toggle */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                🎮 Diet Tracker Tetris
              </h1>
              <p className="text-gray-400 text-sm mt-1">Suis tes macros en temps réel</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Toggle Switch */}
              <button
                onClick={() => setIsTrainingDay(!isTrainingDay)}
                className={`relative w-20 h-10 rounded-full transition-colors duration-300 ${
                  isTrainingDay 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-500'
                }`}
              >
                <div
                  className={`absolute top-1 w-8 h-8 bg-white rounded-full transition-transform duration-300 shadow-lg ${
                    isTrainingDay ? 'left-11' : 'left-1'
                  }`}
                />
              </button>
              <div className="text-right">
                <p className="text-xs text-gray-400">Mode</p>
                <p className={`font-bold ${isTrainingDay ? 'text-orange-400' : 'text-blue-400'}`}>
                  {isTrainingDay ? '🏋️ Jour ON' : '😌 Jour OFF'}
                </p>
              </div>
              <button
                onClick={resetDay}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg font-semibold transition text-sm"
              >
                🔄 Reset
              </button>
            </div>
          </div>

          {/* Macro Progress Bars */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {/* Calories */}
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-400">🔥 Calories</span>
                <span className="text-sm font-bold text-green-400">{totals.kcal} kcal</span>
              </div>
              <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500" style={{ width: `${Math.min((totals.kcal / 2500) * 100, 100)}%` }} />
              </div>
            </div>

            {/* Protein */}
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-400">💪 Protéines</span>
                <span className="text-sm font-bold text-blue-400">{totals.prot}g</span>
              </div>
              <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-500" style={{ width: `${Math.min((totals.prot / 180) * 100, 100)}%` }} />
              </div>
            </div>

            {/* Carbs */}
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-400">🍚 Glucides</span>
                <span className="text-sm font-bold text-orange-400">{totals.glu}g</span>
              </div>
              <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-500" style={{ width: `${Math.min((totals.glu / 250) * 100, 100)}%` }} />
              </div>
            </div>

            {/* Fat */}
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-400">🥑 Lipides</span>
                <span className="text-sm font-bold text-yellow-400">{totals.lip}g</span>
              </div>
              <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-500" style={{ width: `${Math.min((totals.lip / 80) * 100, 100)}%` }} />
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="flex justify-between text-xs text-gray-400">
            <span>{checkedItems.length} / {availableFoods.length} aliments cochés</span>
            <span>{availableFoods.length - checkedItems.length} restants</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
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
                        <div className="flex items-center space-x-4 flex-1">
                          <input
                            type="checkbox"
                            checked={checkedItems.includes(item.id)}
                            onChange={() => toggleItem(item.id)}
                            className="w-6 h-6 rounded-lg border-2 border-gray-600 bg-gray-800 text-green-500 focus:ring-green-500 focus:ring-2 cursor-pointer"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-white group-hover:text-gray-200 transition">{item.nom}</p>
                            <p className="text-sm text-gray-400">{item.quantite}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          {/* Macros Display */}
                          <div className="text-right hidden sm:block">
                            <p className="text-xs text-gray-400">
                              <span className="text-green-400">{item.kcal} kcal</span> • 
                              <span className="text-blue-400 ml-1">{item.prot}g P</span> • 
                              <span className="text-orange-400 ml-1">{item.glu}g G</span> • 
                              <span className="text-yellow-400 ml-1">{item.lip}g L</span>
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${mealBadges[meal]}`}>
                            {meal.split('/')[0].trim()}
                          </span>
                        </div>
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
                        <div className="flex items-center space-x-4 flex-1">
                          <input
                            type="checkbox"
                            checked={true}
                            onChange={() => toggleItem(item.id)}
                            className="w-6 h-6 rounded-lg border-2 border-green-500 bg-green-500/20 text-green-500 focus:ring-green-500 focus:ring-2 cursor-pointer"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-400 line-through">{item.nom}</p>
                            <p className="text-sm text-gray-500">{item.quantite}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right hidden sm:block">
                            <p className="text-xs text-gray-500">
                              <span className="text-green-500">{item.kcal} kcal</span> • 
                              <span className="text-blue-500 ml-1">{item.prot}g P</span> • 
                              <span className="text-orange-500 ml-1">{item.glu}g G</span> • 
                              <span className="text-yellow-500 ml-1">{item.lip}g L</span>
                            </p>
                          </div>
                          <span className="text-green-400 text-xl">✓</span>
                        </div>
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
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>Diet Tracker Tetris — Suis tes macros jour après jour 💪</p>
          <p className="mt-2">Les données sont sauvegardées localement dans ton navigateur</p>
          <p className="mt-1 text-xs text-gray-600">Remplace les "X" par tes valeurs dans le code</p>
        </div>
      </footer>
    </div>
  );
}

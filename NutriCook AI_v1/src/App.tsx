import React, { useState } from 'react';
import { Activity, Camera } from 'lucide-react';
import NutritionGoals from './components/NutritionGoals';
import MealEntry from './components/MealEntry';
import ProgressTracker from './components/ProgressTracker';
import DailySummary from './components/DailySummary';
import { Meal, NutritionData } from './types';

function App() {
  const [goals, setGoals] = useState<NutritionData>({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fats: 70
  });

  const [meals, setMeals] = useState<Meal[]>([]);
  const [activeSection, setActiveSection] = useState<'goals' | 'entry' | 'progress' | 'summary'>('entry');

  const addMeal = (meal: Meal) => {
    setMeals([...meals, meal]);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'goals':
        return <NutritionGoals goals={goals} onSave={setGoals} />;
      case 'entry':
        return <MealEntry onAddMeal={addMeal} />;
      case 'progress':
        return <ProgressTracker goals={goals} meals={meals} />;
      case 'summary':
        return <DailySummary goals={goals} meals={meals} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-2 bg-white rounded-full shadow-lg mb-4">
            <Camera className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">NutriCook1</h1>
          <p className="text-gray-600">AI-Powered Food Recognition & Nutrition Tracking</p>
        </header>

        <nav className="bg-white rounded-2xl shadow-lg p-2 mb-8">
          <ul className="flex justify-between items-center">
            <li>
              <button
                onClick={() => setActiveSection('entry')}
                className={`flex items-center px-6 py-3 rounded-xl transition-all ${
                  activeSection === 'entry' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Camera className="w-5 h-5 mr-2" />
                Snap Meal
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection('goals')}
                className={`flex items-center px-6 py-3 rounded-xl transition-all ${
                  activeSection === 'goals' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Goals
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection('progress')}
                className={`flex items-center px-6 py-3 rounded-xl transition-all ${
                  activeSection === 'progress' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Activity className="w-5 h-5 mr-2" />
                Progress
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection('summary')}
                className={`flex items-center px-6 py-3 rounded-xl transition-all ${
                  activeSection === 'summary' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Summary
              </button>
            </li>
          </ul>
        </nav>

        <main className="bg-white rounded-3xl shadow-xl p-8">
          {renderSection()}
        </main>

        <footer className="mt-12 text-center text-gray-600">
          <p>Powered by AI - Making nutrition tracking effortless 🌟</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
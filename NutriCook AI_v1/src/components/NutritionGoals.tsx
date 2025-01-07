import React, { useState } from 'react';
import { Target } from 'lucide-react';
import { NutritionData } from '../types';

interface Props {
  goals: NutritionData;
  onSave: (goals: NutritionData) => void;
}

const PRESETS = {
  weightLoss: {
    calories: 1800,
    protein: 140,
    carbs: 180,
    fats: 60
  },
  maintenance: {
    calories: 2200,
    protein: 150,
    carbs: 250,
    fats: 70
  },
  muscleGain: {
    calories: 2800,
    protein: 180,
    carbs: 350,
    fats: 80
  }
};

export default function NutritionGoals({ goals, onSave }: Props) {
  const [formData, setFormData] = useState(goals);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseInt(value)
    }));
  };

  const applyPreset = (preset: keyof typeof PRESETS) => {
    setFormData(PRESETS[preset]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <Target className="w-12 h-12 text-purple-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Set Your Daily Goals</h2>
        <p className="text-gray-600">Choose a preset or customize your own nutrition targets</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {Object.entries(PRESETS).map(([key, preset]) => (
          <button
            key={key}
            onClick={() => applyPreset(key as keyof typeof PRESETS)}
            className="p-4 rounded-xl border-2 border-purple-100 hover:border-purple-500 transition-all"
          >
            <h3 className="font-semibold text-gray-800 capitalize mb-2">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
            <ul className="text-sm text-gray-600">
              <li>Calories: {preset.calories}</li>
              <li>Protein: {preset.protein}g</li>
              <li>Carbs: {preset.carbs}g</li>
              <li>Fats: {preset.fats}g</li>
            </ul>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Daily Calories
            </label>
            <input
              type="number"
              name="calories"
              value={formData.calories}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Protein (g)
            </label>
            <input
              type="number"
              name="protein"
              value={formData.protein}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Carbs (g)
            </label>
            <input
              type="number"
              name="carbs"
              value={formData.carbs}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fats (g)
            </label>
            <input
              type="number"
              name="fats"
              value={formData.fats}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-3 px-6 rounded-xl hover:bg-purple-700 transition-colors font-semibold"
        >
          Save Goals
        </button>
      </form>
    </div>
  );
}
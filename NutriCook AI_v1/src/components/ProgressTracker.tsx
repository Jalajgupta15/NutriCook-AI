import React from 'react';
import { Activity } from 'lucide-react';
import { Meal, NutritionData } from '../types';

interface Props {
  goals: NutritionData;
  meals: Meal[];
}

export default function ProgressTracker({ goals, meals }: Props) {
  const totals = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.food.calories,
      protein: acc.protein + meal.food.protein,
      carbs: acc.carbs + meal.food.carbs,
      fats: acc.fats + meal.food.fats
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  const getPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const getColorClass = (percentage: number) => {
    if (percentage < 25) return 'bg-red-500';
    if (percentage < 50) return 'bg-orange-500';
    if (percentage < 75) return 'bg-yellow-500';
    if (percentage <= 100) return 'bg-green-500';
    return 'bg-red-500';
  };

  const nutrients = [
    { label: 'Calories', current: totals.calories, goal: goals.calories },
    { label: 'Protein', current: totals.protein, goal: goals.protein },
    { label: 'Carbs', current: totals.carbs, goal: goals.carbs },
    { label: 'Fats', current: totals.fats, goal: goals.fats }
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <Activity className="w-12 h-12 text-purple-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Daily Progress</h2>
        <p className="text-gray-600">Track your nutrition goals in real-time</p>
      </div>

      <div className="space-y-6">
        {nutrients.map(nutrient => {
          const percentage = getPercentage(nutrient.current, nutrient.goal);
          return (
            <div key={nutrient.label} className="bg-gray-50 p-6 rounded-xl">
              <div className="flex justify-between mb-2">
                <span className="font-medium text-gray-700">{nutrient.label}</span>
                <span className="text-gray-600">
                  {nutrient.current.toFixed(1)} / {nutrient.goal}
                  {nutrient.label === 'Calories' ? ' kcal' : 'g'}
                </span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${getColorClass(percentage)}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="mt-2 text-sm text-gray-500">
                {percentage > 100
                  ? 'Exceeded goal!'
                  : percentage === 100
                  ? 'Goal achieved!'
                  : `${percentage.toFixed(1)}% of daily goal`}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <h3 className="font-semibold text-gray-800 mb-4">Today's Meals</h3>
        <div className="space-y-4">
          {meals.map((meal, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-800 capitalize">{meal.type}</h4>
                  <p className="text-gray-600">{meal.food.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-800">{meal.food.calories} kcal</p>
                  <p className="text-sm text-gray-500">
                    P: {meal.food.protein}g • C: {meal.food.carbs}g • F: {meal.food.fats}g
                  </p>
                </div>
              </div>
            </div>
          ))}
          {meals.length === 0 && (
            <p className="text-gray-500 text-center py-4">No meals logged yet today</p>
          )}
        </div>
      </div>
    </div>
  );
}
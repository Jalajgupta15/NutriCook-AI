import React from 'react';
import { Award } from 'lucide-react';
import { Meal, NutritionData } from '../types';

interface Props {
  goals: NutritionData;
  meals: Meal[];
}

const MOTIVATIONAL_MESSAGES = {
  high: [
    "Incredible work today! You're crushing your nutrition goals! 🌟",
    "Outstanding effort! Your dedication is truly inspiring! 💪",
    "You're absolutely crushing it! Keep up the amazing work! 🏆"
  ],
  medium: [
    "You're on the right track! Keep pushing forward! 🎯",
    "Solid progress today! Tomorrow will be even better! 🌱",
    "Good job staying committed to your goals! 🌟"
  ],
  low: [
    "Every step counts! You've made progress today! 🌱",
    "Tomorrow is a new opportunity to crush your goals! 💫",
    "Keep going! Small progress is still progress! 🌟"
  ]
};

export default function DailySummary({ goals, meals }: Props) {
  const totals = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.food.calories,
      protein: acc.protein + meal.food.protein,
      carbs: acc.carbs + meal.food.carbs,
      fats: acc.fats + meal.food.fats
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  const calculateScore = () => {
    const metrics = [
      totals.calories / goals.calories,
      totals.protein / goals.protein,
      totals.carbs / goals.carbs,
      totals.fats / goals.fats
    ];

    const score = metrics.reduce((acc, curr) => {
      const percentage = Math.min(curr, 1);
      return acc + percentage;
    }, 0) / metrics.length * 100;

    return Math.round(score);
  };

  const score = calculateScore();
  const getMessage = () => {
    const messages = score >= 80 ? MOTIVATIONAL_MESSAGES.high :
                    score >= 50 ? MOTIVATIONAL_MESSAGES.medium :
                    MOTIVATIONAL_MESSAGES.low;
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <Award className="w-12 h-12 text-purple-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Daily Summary</h2>
        <p className="text-gray-600">Your nutrition journey for today</p>
      </div>

      <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-8 text-white mb-8">
        <div className="text-center">
          <div className="text-6xl font-bold mb-2">{score}%</div>
          <div className="text-xl opacity-90 mb-4">Daily Goal Achievement</div>
          <div className="text-lg">{getMessage()}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Macronutrient Balance</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Protein</span>
                <span>{Math.round((totals.protein * 4 / totals.calories) * 100)}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{
                    width: `${Math.min(
                      (totals.protein * 4 / totals.calories) * 100,
                      100
                    )}%`
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Carbs</span>
                <span>{Math.round((totals.carbs * 4 / totals.calories) * 100)}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{
                    width: `${Math.min(
                      (totals.carbs * 4 / totals.calories) * 100,
                      100
                    )}%`
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Fats</span>
                <span>{Math.round((totals.fats * 9 / totals.calories) * 100)}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div
                  className="h-full bg-yellow-500 rounded-full"
                  style={{
                    width: `${Math.min(
                      (totals.fats * 9 / totals.calories) * 100,
                      100
                    )}%`
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Goal Comparison</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-gray-600">Calories</span>
                <div className="text-xl font-semibold">
                  {totals.calories} / {goals.calories}
                </div>
              </div>
              <div className={`text-sm ${
                totals.calories <= goals.calories ? 'text-green-600' : 'text-red-600'
              }`}>
                {totals.calories <= goals.calories
                  ? 'Within target'
                  : `${Math.round((totals.calories / goals.calories - 1) * 100)}% over`}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <span className="text-gray-600">Protein</span>
                <div className="text-xl font-semibold">
                  {totals.protein}g / {goals.protein}g
                </div>
              </div>
              <div className={`text-sm ${
                totals.protein >= goals.protein ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {Math.round((totals.protein / goals.protein) * 100)}% achieved
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <span className="text-gray-600">Carbs</span>
                <div className="text-xl font-semibold">
                  {totals.carbs}g / {goals.carbs}g
                </div>
              </div>
              <div className={`text-sm ${
                totals.carbs <= goals.carbs ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {Math.round((totals.carbs / goals.carbs) * 100)}% achieved
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <span className="text-gray-600">Fats</span>
                <div className="text-xl font-semibold">
                  {totals.fats}g / {goals.fats}g
                </div>
              </div>
              <div className={`text-sm ${
                totals.fats <= goals.fats ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {Math.round((totals.fats / goals.fats) * 100)}% achieved
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">Meal Breakdown</h3>
        <div className="space-y-4">
          {meals.map((meal, index) => (
            <div key={index} className="flex justify-between items-start p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-800 capitalize">{meal.type}</div>
                <div className="text-gray-600">{meal.food.name}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {new Date(meal.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-800">{meal.food.calories} kcal</div>
                <div className="text-sm text-gray-600">
                  P: {meal.food.protein}g • C: {meal.food.carbs}g • F: {meal.food.fats}g
                </div>
              </div>
            </div>
          ))}
          {meals.length === 0 && (
            <p className="text-gray-500 text-center py-4">No meals logged today</p>
          )}
        </div>
      </div>
    </div>
  );
}
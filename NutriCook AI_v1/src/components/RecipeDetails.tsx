import React from 'react';
import { ChefHat } from 'lucide-react';
import { Food } from '../types';

interface Props {
  food: Food;
}

export default function RecipeDetails({ food }: Props) {
  if (!food.recipe) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
      <div className="flex items-center space-x-4">
        <ChefHat className="w-8 h-8 text-purple-600" />
        <h3 className="text-2xl font-bold text-gray-800">Recipe Details</h3>
      </div>

      {food.recipe.image && (
        <img 
          src={food.recipe.image} 
          alt={food.name} 
          className="w-full h-48 object-cover rounded-lg"
        />
      )}

      <div>
        <h4 className="font-semibold text-gray-800 mb-2">Ingredients</h4>
        <ul className="grid grid-cols-2 gap-2">
          {food.recipe.ingredients.map((ingredient, index) => (
            <li key={index} className="text-gray-600">
              • {ingredient.name} ({ingredient.measure})
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-semibold text-gray-800 mb-2">Instructions</h4>
        <div className="text-gray-600 space-y-2">
          {food.recipe.instructions.split('\n').map((step, index) => (
            <p key={index}>{step}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
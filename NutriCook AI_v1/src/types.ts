export type MealType = 'breakfast' | 'lunch' | 'snack' | 'dinner';

export interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface Food extends NutritionData {
  name: string;
  recipe?: {
    instructions: string;
    ingredients: Array<{
      name: string;
      measure: string;
    }>;
    image?: string;
  };
}

export interface Meal {
  type: MealType;
  food: Food;
  timestamp: Date;
}
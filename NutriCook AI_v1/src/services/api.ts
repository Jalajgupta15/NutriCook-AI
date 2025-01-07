import axios from 'axios';

const CLARIFAI_PAT = '5a2c5e444b9b40ab9e4f60f950e71bfd';
const CLARIFAI_USER_ID = 'clarifai';
const CLARIFAI_APP_ID = 'main';
const CLARIFAI_MODEL_ID = 'food-item-recognition';

const THEMEALDB_API_KEY = '1';

interface ClarifaiResponse {
  outputs: Array<{
    data: {
      concepts: Array<{
        name: string;
        value: number;
      }>;
    };
  }>;
}

interface MealDBResponse {
  meals: Array<{
    strMeal: string;
    strInstructions: string;
    strMealThumb: string;
    [key: string]: string | null;
  }> | null;
}

export const recognizeFood = async (imageData: string): Promise<string> => {
  try {
    const raw = JSON.stringify({
      "user_app_id": {
        "user_id": CLARIFAI_USER_ID,
        "app_id": CLARIFAI_APP_ID
      },
      "inputs": [
        {
          "data": {
            "image": {
              "base64": imageData.split(',')[1]
            }
          }
        }
      ]
    });

    const response = await axios.post<ClarifaiResponse>(
      `https://api.clarifai.com/v2/models/${CLARIFAI_MODEL_ID}/outputs`,
      raw,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Key ${CLARIFAI_PAT}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.outputs[0].data.concepts[0].name;
  } catch (error) {
    console.error('Error recognizing food:', error);
    throw new Error('Failed to recognize food');
  }
};

export const getRecipeDetails = async (dishName: string) => {
  try {
    const response = await axios.get<MealDBResponse>(
      `https://www.themealdb.com/api/json/v1/${THEMEALDB_API_KEY}/search.php?s=${dishName}`
    );

    if (response.data.meals) {
      const meal = response.data.meals[0];
      const ingredients: { name: string; measure: string }[] = [];

      // Extract ingredients and measurements
      for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        
        if (ingredient && ingredient.trim()) {
          ingredients.push({
            name: ingredient,
            measure: measure || ''
          });
        }
      }

      return {
        name: meal.strMeal,
        instructions: meal.strInstructions,
        ingredients,
        image: meal.strMealThumb
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching recipe:', error);
    throw new Error('Failed to fetch recipe details');
  }
};
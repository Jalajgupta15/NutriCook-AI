import React, { useRef, useState, useCallback } from 'react';
import { Camera, RefreshCw, Check, Upload, X } from 'lucide-react';
import Webcam from 'react-webcam';
import { Meal, MealType, Food } from '../types';
import { recognizeFood, getRecipeDetails } from '../services/api';
import RecipeDetails from './RecipeDetails';

interface Props {
  onAddMeal: (meal: Meal) => void;
}

const MEAL_TYPES: { type: MealType; label: string }[] = [
  { type: 'breakfast', label: 'Breakfast' },
  { type: 'lunch', label: 'Lunch' },
  { type: 'snack', label: 'Snack' },
  { type: 'dinner', label: 'Dinner' }
];

// Estimated nutrition values for common foods
const NUTRITION_ESTIMATES: Record<string, Omit<Food, 'name'>> = {
  'pizza': { calories: 266, protein: 11, carbs: 33, fats: 10 },
  'salad': { calories: 100, protein: 3, carbs: 11, fats: 7 },
  'burger': { calories: 354, protein: 20, carbs: 29, fats: 17 },
  'pasta': { calories: 288, protein: 12, carbs: 57, fats: 2 },
  'sushi': { calories: 228, protein: 9, carbs: 38, fats: 4 }
};

export default function MealEntry({ onAddMeal }: Props) {
  const [selectedType, setSelectedType] = useState<MealType>('breakfast');
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureMethod, setCaptureMethod] = useState<'camera' | 'upload' | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [recognizedFood, setRecognizedFood] = useState<Food | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFood = async (imageData: string) => {
    setIsProcessing(true);
    setError(null);
    try {
      const dishName = await recognizeFood(imageData);
      const recipeDetails = await getRecipeDetails(dishName);
      
      const nutritionInfo = NUTRITION_ESTIMATES[dishName.toLowerCase()] || {
        calories: 250,
        protein: 10,
        carbs: 30,
        fats: 8
      };

      setRecognizedFood({
        name: dishName,
        ...nutritionInfo,
        recipe: recipeDetails
      });
    } catch (error) {
      setError('Failed to recognize food. Please try again.');
      console.error('Error processing food:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
        processFood(imageSrc);
      }
    }
  }, [webcamRef]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        setCapturedImage(imageData);
        processFood(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const retake = () => {
    setCapturedImage(null);
    setRecognizedFood(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (recognizedFood) {
      const meal: Meal = {
        type: selectedType,
        food: recognizedFood,
        timestamp: new Date()
      };
      onAddMeal(meal);
      setIsCapturing(false);
      setCaptureMethod(null);
      setCapturedImage(null);
      setRecognizedFood(null);
      setError(null);
    }
  };

  const resetCapture = () => {
    setIsCapturing(false);
    setCaptureMethod(null);
    setCapturedImage(null);
    setRecognizedFood(null);
    setError(null);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <Camera className="w-12 h-12 text-purple-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Snap Your Meal</h2>
        <p className="text-gray-600">Take a photo or upload an image of your food</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {MEAL_TYPES.map(({ type, label }) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`p-4 rounded-xl border-2 transition-all ${
              selectedType === type
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-purple-300'
            }`}
          >
            <span className={`font-medium ${selectedType === type ? 'text-purple-700' : 'text-gray-700'}`}>
              {label}
            </span>
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
        {!isCapturing ? (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => {
                setIsCapturing(true);
                setCaptureMethod('camera');
              }}
              className="bg-purple-600 text-white py-4 px-6 rounded-xl hover:bg-purple-700 transition-colors font-semibold flex items-center justify-center"
            >
              <Camera className="w-5 h-5 mr-2" />
              Take Photo
            </button>
            <button
              onClick={() => {
                setIsCapturing(true);
                setCaptureMethod('upload');
              }}
              className="bg-indigo-600 text-white py-4 px-6 rounded-xl hover:bg-indigo-700 transition-colors font-semibold flex items-center justify-center"
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload Image
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {!capturedImage ? (
              <div className="relative">
                {captureMethod === 'camera' ? (
                  <>
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      className="w-full rounded-lg"
                    />
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                      <button
                        onClick={capture}
                        className="bg-purple-600 text-white py-2 px-6 rounded-full hover:bg-purple-700 transition-colors"
                      >
                        Take Photo
                      </button>
                      <button
                        onClick={resetCapture}
                        className="bg-gray-600 text-white py-2 px-6 rounded-full hover:bg-gray-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      ref={fileInputRef}
                      className="hidden"
                      id="food-image-upload"
                    />
                    <label
                      htmlFor="food-image-upload"
                      className="inline-block bg-indigo-600 text-white py-3 px-6 rounded-xl hover:bg-indigo-700 transition-colors cursor-pointer"
                    >
                      <Upload className="w-5 h-5 inline-block mr-2" />
                      Choose Image
                    </label>
                    <button
                      onClick={resetCapture}
                      className="ml-4 bg-gray-600 text-white py-3 px-6 rounded-xl hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <img src={capturedImage} alt="Captured food" className="w-full rounded-lg" />
                <div className="flex justify-center gap-4">
                  <button
                    onClick={retake}
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retake
                  </button>
                  {recognizedFood && (
                    <button
                      onClick={handleSubmit}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Confirm
                    </button>
                  )}
                </div>
              </div>
            )}

            {isProcessing && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
                <p className="text-gray-600">Analyzing your food...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
                {error}
              </div>
            )}

            {recognizedFood && !isProcessing && (
              <>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Recognized Food</h3>
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-purple-600">{recognizedFood.name}</p>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <div>Calories: {recognizedFood.calories} kcal</div>
                      <div>Protein: {recognizedFood.protein}g</div>
                      <div>Carbs: {recognizedFood.carbs}g</div>
                      <div>Fats: {recognizedFood.fats}g</div>
                    </div>
                  </div>
                </div>
                {recognizedFood.recipe && (
                  <RecipeDetails food={recognizedFood} />
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
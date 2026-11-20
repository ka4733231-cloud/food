/**
 * NutriBite AI — Shared Domain TypeScript Definitions
 * Shared across Next.js Web, React Native Expo Mobile, and Backend API contracts.
 */

export type SubscriptionTier = 'free' | 'plus' | 'pro';
export type BillingPeriod = 'monthly' | 'annual';
export type PaymentProvider = 'stripe' | 'revenuecat' | 'apple_iap' | 'google_play';

export interface UserProfile {
  id: string | number;
  name: string;
  email: string;
  avatar: string;
  goal: string;
  calorieTarget: number;
  dietaryPreferences: string[];
  allergies: string[];
  isGuest?: boolean;
}

export interface MacroNutrients {
  calories: number;
  protein: number;
  carbohydrates: number;
  totalFat: number;
  fiber: number;
  sugar?: number;
  sodiumMg?: number;
}

export interface DailyValuesPct {
  calories: number;
  protein: number;
  carbohydrates: number;
  totalFat: number;
  fiber: number;
  sodium: number;
}

export interface ExerciseBurnEstimates {
  lightStrollMinutes: number;
  briskWalkingMinutes: number;
  cyclingMinutes: number;
  joggingMinutes: number;
}

export interface FoodItemRecord {
  id: string;
  name: string;
  category: string;
  cuisine: string;
  standardServingUnit: string;
  standardServingGrams: number;
  per100g: MacroNutrients;
  isCustom?: boolean;
}

export interface BoundingBox2D {
  label: string;
  confidence: number;
  box2d: [number, number, number, number]; // [ymin, xmin, ymax, xmax]
}

export interface FoodVisionCandidate {
  foodId: string;
  name: string;
  category: string;
  cuisine?: string;
  confidence: number;
  typicalGrams: number;
}

export interface FoodScanResult {
  imageUrl: string;
  foodId: string;
  predictedFoodName: string;
  category: string;
  cuisine: string;
  confidence: number;
  detectedIngredients: string[];
  boundingBox: [number, number, number, number];
  topCandidates: FoodVisionCandidate[];
  estimatedGrams: number;
  source: string;
}

export interface RecipeIngredient {
  name: string;
  amount: number;
  unit: string;
  category: string;
}

export interface Recipe {
  id: number | string;
  title: string;
  category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
  cuisine: 'Pakistani' | 'Italian' | 'Mediterranean' | 'Japanese' | 'American' | 'International';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  prepTime: number;
  cookTime: number;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  rating: number;
  image: string;
  videoUrl?: string;
  description: string;
  ingredients: RecipeIngredient[];
  instructions: string[];
}

export interface GroceryItem {
  id: string | number;
  name: string;
  qty: string;
  category: 'Fruits' | 'Vegetables' | 'Dairy' | 'Meat and protein' | 'Grains' | 'Spices' | 'Other groceries';
  checked: boolean;
}

export interface DailyMealSlot {
  Breakfast: string;
  Lunch: string;
  Dinner: string;
  Snack: string;
}

export type WeeklyMealPlan = Record<
  'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday',
  DailyMealSlot
>;

export interface SubscriptionFeatureLimits {
  dailyFoodScans: number;
  dailyAiMessages: number;
  maxFavoriteRecipes: number;
  fullWeeklyPlanner: boolean;
  multipleGroceryLists: boolean;
  advancedNutritionReports: boolean;
  exportDataFormats: boolean;
  multiFoodDetection: boolean;
}

export interface SubscriptionPlanConfig {
  id: SubscriptionTier;
  name: string;
  tagline: string;
  monthlyPriceUsd: number;
  annualPriceUsd: number;
  annualSavingsPercent: number;
  isPopular?: boolean;
  features: string[];
  limits: SubscriptionFeatureLimits;
}

export interface UserSubscriptionState {
  tier: SubscriptionTier;
  billingPeriod: BillingPeriod;
  status: 'active' | 'trialing' | 'cancelled' | 'past_due';
  startedAt: string;
  expiresAt: string;
  cancelAtPeriodEnd: boolean;
  provider: PaymentProvider;
  dailyUsage: {
    scansUsedToday: number;
    messagesUsedToday: number;
    lastResetDate: string;
  };
}

export interface BillingTransaction {
  id: string;
  date: string;
  planName: string;
  amountUsd: number;
  billingPeriod: BillingPeriod;
  status: 'paid' | 'pending' | 'refunded';
  invoicePdfUrl?: string;
}

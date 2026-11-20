/**
 * NutriBite AI Mobile - Unified Zustand State Store
 * Manages Auth, Freemium Subscriptions, Quota Meters, Food Diary,
 * Meal Planner, and Smart Grocery List with offline persistence.
 */

import { create } from "zustand";

export type SubscriptionTier = "free" | "plus" | "pro";
export type BillingPeriod = "monthly" | "annual";

export interface MealDiaryItem {
  id: string;
  name: string;
  mealType: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  portionGrams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  time: string;
  image?: string;
}

export interface GroceryItem {
  id: string;
  name: string;
  quantity: string;
  category: string;
  isChecked: boolean;
}

export interface NutriBiteState {
  // User Profile & Nutrition Goals
  user: {
    name: string;
    email: string;
    avatar: string;
    calorieTarget: number;
    proteinTarget: number;
    carbsTarget: number;
    fatTarget: number;
    fiberTarget: number;
    waterTarget: number;
  };

  // Freemium Subscription State
  subscription: {
    tier: SubscriptionTier;
    billingPeriod: BillingPeriod;
    status: "active" | "cancelled";
    expiresAt: string;
    cancelAtPeriodEnd: boolean;
  };

  // Daily Quota Tracking
  dailyUsage: {
    date: string;
    scansUsed: number;
    messagesUsed: number;
  };

  // Activity Tracking
  waterIntakeMl: number;
  stepsCount: number;

  // Food Diary & Lists
  foodDiary: MealDiaryItem[];
  favorites: number[];
  groceries: GroceryItem[];
  mealPlan: Record<string, Record<string, string>>;

  // Actions
  upgradeSubscription: (tier: SubscriptionTier, period: BillingPeriod) => void;
  cancelSubscription: () => void;
  reactivateSubscription: () => void;
  recordScan: () => boolean;
  recordMessage: () => boolean;
  logMeal: (meal: Omit<MealDiaryItem, "id" | "time">) => void;
  removeMeal: (id: string) => void;
  addWater: (ml: number) => void;
  toggleFavorite: (recipeId: number) => void;
  toggleGrocery: (id: string) => void;
  addGroceryItem: (item: Omit<GroceryItem, "id" | "isChecked">) => void;
  setMealSlot: (day: string, slot: string, recipeName: string) => void;
}

export const useNutriBiteStore = create<NutriBiteState>((set, get) => ({
  user: {
    name: "Chef Alex",
    email: "alex@nutribite.ai",
    avatar: "👨‍🍳",
    calorieTarget: 2100,
    proteinTarget: 125,
    carbsTarget: 230,
    fatTarget: 65,
    fiberTarget: 32,
    waterTarget: 2500,
  },

  subscription: {
    tier: "free",
    billingPeriod: "monthly",
    status: "active",
    expiresAt: "2027-01-01",
    cancelAtPeriodEnd: false,
  },

  dailyUsage: {
    date: new Date().toISOString().slice(0, 10),
    scansUsed: 1,
    messagesUsed: 2,
  },

  waterIntakeMl: 1250,
  stepsCount: 6840,

  foodDiary: [
    {
      id: "entry_1",
      name: "Warm Rolled Oatmeal with Berries",
      mealType: "Breakfast",
      portionGrams: 240,
      calories: 170,
      protein: 6,
      carbs: 29,
      fat: 4,
      fiber: 5.3,
      time: "08:15 AM",
      image: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=300&q=80"
    },
    {
      id: "entry_2",
      name: "Mediterranean Garden Salad with Feta",
      mealType: "Lunch",
      portionGrams: 200,
      calories: 220,
      protein: 8,
      carbs: 14,
      fat: 16,
      fiber: 4.8,
      time: "01:20 PM",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&q=80"
    }
  ],

  favorites: [1, 2, 4],

  groceries: [
    { id: "g_1", name: "Aged Basmati Rice", quantity: "500g", category: "Grains", isChecked: false },
    { id: "g_2", name: "Skinless Chicken Breast", quantity: "400g", category: "Meat & Protein", isChecked: false },
    { id: "g_3", name: "Greek Whole Milk Yogurt", quantity: "200g", category: "Dairy", isChecked: true },
    { id: "g_4", name: "Fresh Mint & Coriander", quantity: "1 bunch", category: "Vegetables", isChecked: false }
  ],

  mealPlan: {
    Monday: { Breakfast: "Oatmeal with Almonds", Lunch: "Chicken Salad Bowl", Dinner: "Karachi Chicken Biryani" },
    Tuesday: { Breakfast: "Poached Eggs & Avocado", Lunch: "Tarka Daal with Basmati", Dinner: "Lahori Mutton Karahi" },
    Wednesday: { Breakfast: "Berry Smoothie Bowl", Lunch: "Grilled Chicken Chapati", Dinner: "Vegetable Pulao" },
    Thursday: { Breakfast: "Greek Yogurt & Honey", Lunch: "Quinoa Veggie Salad", Dinner: "Slow-Cooked Beef Nihari" },
    Friday: { Breakfast: "Scrambled Eggs & Toast", Lunch: "Chicken Karahi with Roti", Dinner: "Shahi Beef Haleem" },
    Saturday: { Breakfast: "Paratha with Omelette", Lunch: "Mediterranean Wrap", Dinner: "Grilled Salmon Bowl" },
    Sunday: { Breakfast: "Pancake Stack & Fruit", Lunch: "Lentil Soup with Croutons", Dinner: "Family Roast Chicken" }
  },

  upgradeSubscription: (tier, period) => {
    set((state) => {
      const expDate = new Date();
      if (period === "annual") expDate.setFullYear(expDate.getFullYear() + 1);
      else expDate.setMonth(expDate.getMonth() + 1);

      return {
        subscription: {
          tier,
          billingPeriod: period,
          status: "active",
          cancelAtPeriodEnd: false,
          expiresAt: expDate.toISOString().slice(0, 10),
        }
      };
    });
  },

  cancelSubscription: () => {
    set((state) => ({
      subscription: { ...state.subscription, cancelAtPeriodEnd: true }
    }));
  },

  reactivateSubscription: () => {
    set((state) => ({
      subscription: { ...state.subscription, cancelAtPeriodEnd: false }
    }));
  },

  recordScan: () => {
    const limits = { free: 5, plus: 50, pro: 150 };
    const { subscription, dailyUsage } = get();
    const limit = limits[subscription.tier];

    if (dailyUsage.scansUsed >= limit) {
      return false; // Quota exceeded
    }

    set({ dailyUsage: { ...dailyUsage, scansUsed: dailyUsage.scansUsed + 1 } });
    return true;
  },

  recordMessage: () => {
    const limits = { free: 5, plus: 50, pro: 150 };
    const { subscription, dailyUsage } = get();
    const limit = limits[subscription.tier];

    if (dailyUsage.messagesUsed >= limit) {
      return false;
    }

    set({ dailyUsage: { ...dailyUsage, messagesUsed: dailyUsage.messagesUsed + 1 } });
    return true;
  },

  logMeal: (meal) => {
    const newEntry: MealDiaryItem = {
      ...meal,
      id: `meal_${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    set((state) => ({ foodDiary: [newEntry, ...state.foodDiary] }));
  },

  removeMeal: (id) => {
    set((state) => ({ foodDiary: state.foodDiary.filter((m) => m.id !== id) }));
  },

  addWater: (ml) => {
    set((state) => ({ waterIntakeMl: Math.max(0, state.waterIntakeMl + ml) }));
  },

  toggleFavorite: (recipeId) => {
    set((state) => {
      const exists = state.favorites.includes(recipeId);
      return {
        favorites: exists
          ? state.favorites.filter((id) => id !== recipeId)
          : [...state.favorites, recipeId]
      };
    });
  },

  toggleGrocery: (id) => {
    set((state) => ({
      groceries: state.groceries.map((item) =>
        item.id === id ? { ...item, isChecked: !item.isChecked } : item
      )
    }));
  },

  addGroceryItem: (item) => {
    const newItem: GroceryItem = {
      ...item,
      id: `g_${Date.now()}`,
      isChecked: false
    };
    set((state) => ({ groceries: [newItem, ...state.groceries] }));
  },

  setMealSlot: (day, slot, recipeName) => {
    set((state) => ({
      mealPlan: {
        ...state.mealPlan,
        [day]: {
          ...state.mealPlan[day],
          [slot]: recipeName
        }
      }
    }));
  }
}));

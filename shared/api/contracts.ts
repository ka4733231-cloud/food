/**
 * NutriBite AI — Shared API Route & Payload Contracts
 */

export const API_ROUTES = {
  // Health & System
  HEALTH: '/health',
  DB_STATUS: '/api/db/status',
  VISION_MODEL_INFO: '/api/vision/model-info',

  // Authentication
  AUTH_REGISTER: '/api/auth/register',
  AUTH_LOGIN: '/api/auth/login',
  AUTH_LOGOUT: '/api/auth/logout',

  // Computer Vision & Food Scanner
  FOOD_SCAN: '/api/food/scan',
  FOOD_PORTION_ADJUST: '/api/food/portion-adjust',
  FOOD_SEARCH: '/api/food/search',
  FOOD_CUSTOM_CREATE: '/api/food/custom',

  // Verified Nutrition Library
  NUTRITION_DATABASE: '/api/nutrition/database',
  NUTRITION_CATEGORIES: '/api/nutrition/categories',
  NUTRITION_ITEM: (id: string) => `/api/nutrition/food/${id}`,

  // Recipes & Discovery
  RECIPES_LIST: '/api/recipes',
  RECIPE_DETAIL: (id: string | number) => `/api/recipes/${id}`,
  RECIPES_FAVORITES: '/api/recipes/favorites',

  // Meal Planner & Groceries
  MEAL_PLANS: '/api/meal-plans',
  GROCERY_LISTS: '/api/grocery-lists',
  GROCERY_GENERATE: '/api/grocery-lists/generate',

  // AI Assistant
  ASSISTANT_CHAT: '/api/assistant/chat',

  // Freemium Subscriptions & Billing
  SUBSCRIPTION_PLANS: '/api/subscriptions/plans',
  SUBSCRIPTION_CURRENT: '/api/subscriptions/current',
  SUBSCRIPTION_USAGE: '/api/subscriptions/usage',
  SUBSCRIPTION_CHECKOUT: '/api/subscriptions/checkout',
  SUBSCRIPTION_CANCEL: '/api/subscriptions/cancel',
  SUBSCRIPTION_RESTORE: '/api/subscriptions/restore',
  SUBSCRIPTION_WEBHOOK_STRIPE: '/api/subscriptions/webhook/stripe',

  // Administrator Controls
  ADMIN_METRICS: '/api/admin/metrics',
  ADMIN_PLAN_UPDATE: '/api/admin/plans/update'
} as const;

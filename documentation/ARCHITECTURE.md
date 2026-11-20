# NutriBite AI — Architecture & Technical Specifications

NutriBite AI is an intelligent culinary companion combining MOB's recipe experience with Calz's nutrition intelligence. It is built as a unified cross-platform product supporting Web (Next.js), Mobile (React Native / Expo), Tablets (Adaptive split-view), and a FastAPI + PostgreSQL backend.

---

## 1. System Topology

```
┌────────────────────────────────────────────────────────────────────────┐
│                        UNIFIED CLIENT APPLICATIONS                     │
├─────────────────────┬───────────────────────────┬──────────────────────┤
│   Next.js 14 Web    │  React Native Expo Mobile │  Adaptive Tablet UI  │
│   (Desktop & Mobile)│  (iOS & Android Native)   │  (iPad & Android Tab)│
└──────────┬──────────┴─────────────┬─────────────┴───────────┬──────────┘
           │                        │                         │
           └────────────────────────┼─────────────────────────┘
                                    │
                         ┌──────────▼──────────┐
                         │   Shared Contracts  │
                         │   Types & Tokens    │
                         └──────────┬──────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       FASTAPI BACKEND SERVICE                          │
├─────────────────────┬───────────────────────────┬──────────────────────┤
│ 1. Vision Engine    │ 2. Nutrition Service      │ 3. Freemium Gateway  │
│ • Food-101 Taxonomy │ • USDA FoodData Central   │ • Daily Quota Guard  │
│ • Saliency Bounding │ • 35+ PK / World Staples  │ • Stripe Checkout    │
│ • Softmax Top-5     │ • Dynamic Grams Scaler    │ • RevenueCat Mobile  │
└──────────┬──────────┴─────────────┬─────────────┴───────────┬──────────┘
           │                        │                         │
           ▼                        ▼                         ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        PERSISTENT DATA LAYER                           │
│  PostgreSQL (Relational Storage) · SQLAlchemy ORM · Alembic Migrations │
│  Tables: users, subscriptions, plans, usage_records, food_items,       │
│  nutrition_records, recipes, meal_plans, grocery_lists, food_diary     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Subscription Plans & Daily Feature Limits

| Feature | Free ($0) | NutriBite Plus ($4.99/mo) | NutriBite Pro ($9.99/mo) |
| :--- | :---: | :---: | :---: |
| **Daily AI Food Scans** | 5 / day | 50 / day | 150 / day |
| **Daily AI Assistant Messages**| 5 / day | 50 / day | 150 / day |
| **Favorite Recipes** | Max 10 | Unlimited | Unlimited |
| **Weekly Meal Planner** | Basic (Current Day) | Full 7-Day Multi-Plan | Advanced AI Optimizer |
| **Smart Grocery Lists** | 1 Active List | Multiple Lists + Sync | Export & Share |
| **Nutrition Analytics** | Daily + Weekly | Full Historical & Trends| Downloadable PDF Reports|
| **Multi-Food Bounding Boxes** | Single Dish | Multi-Item Saliency | Detailed Ingredient Mask|

---

## 3. Core Principles
1. **Separation of Computer Vision and Nutrition Calculation**: Photographs estimate food classes, ingredients, and plate coverage. Exact mass is user-calibrated via grams slider (80g–600g). Standard laboratory values per 100g calculate exact nutrients.
2. **Offline Resilience**: Both web and mobile applications run on-device computer vision and local verified nutritional database caches, guaranteeing 0ms latency even during network disconnects.
3. **Ethical Monetization**: The core food diary, manual food logging, water tracking, and basic recipe discovery remain 100% free forever.

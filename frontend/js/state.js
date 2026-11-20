/**
 * NutriBite AI - Central Reactive State Store & Backend Client
 * Persists user records, food diary, meal plans, and grocery lists.
 */

class NutriBiteState {
  constructor() {
    this.apiBase = "http://localhost:8000/api";
    this.user = this.loadUser();
    this.favorites = this.loadFavorites();
    this.foodDiary = this.loadFoodDiary();
    this.mealPlan = this.loadMealPlan();
    this.groceryList = this.loadGroceryList();
    this.waterLogMl = Number(localStorage.getItem("nb_water_ml") || 1250);
    this.stepsCount = Number(localStorage.getItem("nb_steps_count") || 4200);
    this.chatMessages = this.loadChatMessages();
    this.subscription = this.loadSubscription();
    this.subscriptionPlans = this.loadSubscriptionPlans();
    this.billingHistory = this.loadBillingHistory();
    this.dailyUsage = this.loadDailyUsage();
  }

  loadSubscription() {
    const saved = localStorage.getItem("nb_subscription");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      tier: "free",
      billingPeriod: "monthly",
      status: "active",
      startedAt: new Date().toISOString().slice(0, 10),
      expiresAt: "2027-01-01",
      cancelAtPeriodEnd: false,
      provider: "stripe"
    };
  }

  saveSubscription() {
    localStorage.setItem("nb_subscription", JSON.stringify(this.subscription));
  }

  loadSubscriptionPlans() {
    const saved = localStorage.getItem("nb_subscription_plans");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      free: {
        id: "free",
        name: "Free Forever",
        tagline: "Essential food logging and culinary tracking.",
        monthlyPrice: 0,
        annualPrice: 0,
        limits: { dailyScans: 5, dailyMessages: 5, maxFavorites: 10, weeklyPlanner: false, multipleLists: false },
        features: [
          "Manual food logging & daily diary",
          "5 AI vision meal scans per day",
          "5 AI assistant chats per day",
          "Browse verified recipe library",
          "1 active grocery shopping list",
          "Daily nutrition macro dashboard"
        ]
      },
      plus: {
        id: "plus",
        name: "NutriBite Plus",
        tagline: "Recommended for active meal planners & foodies.",
        monthlyPrice: 4.99,
        annualPrice: 39.99,
        annualSavings: "33%",
        isPopular: true,
        limits: { dailyScans: 50, dailyMessages: 50, maxFavorites: 9999, weeklyPlanner: true, multipleLists: true },
        features: [
          "50 AI vision meal scans per day",
          "50 AI assistant chats per day",
          "Full 7-day weekly meal planner",
          "Unlimited favorite recipes",
          "Multiple smart grocery lists with auto-aggregation",
          "Historical nutrient trend analytics",
          "Personalized recipe recommendations"
        ]
      },
      pro: {
        id: "pro",
        name: "NutriBite Pro",
        tagline: "Uncapped power for serious fitness and nutrition.",
        monthlyPrice: 9.99,
        annualPrice: 79.99,
        annualSavings: "33%",
        limits: { dailyScans: 150, dailyMessages: 150, maxFavorites: 9999, weeklyPlanner: true, multipleLists: true, exportReports: true },
        features: [
          "150 AI vision meal scans per day",
          "150 AI assistant chats per day",
          "Multi-food saliency detection",
          "Exportable PDF nutrition reports",
          "Export food diary & grocery CSVs",
          "Advanced personalized macro goals",
          "Priority access to new AI models"
        ]
      }
    };
  }

  saveSubscriptionPlans() {
    localStorage.setItem("nb_subscription_plans", JSON.stringify(this.subscriptionPlans));
  }

  loadBillingHistory() {
    const saved = localStorage.getItem("nb_billing_history");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: "INV-2026-001", date: "2026-01-15", plan: "NutriBite Free Account", amount: 0.00, status: "Active", provider: "Platform Free Tier", invoicePdf: "#" }
    ];
  }

  saveBillingHistory() {
    localStorage.setItem("nb_billing_history", JSON.stringify(this.billingHistory));
  }

  loadDailyUsage() {
    const saved = localStorage.getItem("nb_daily_usage");
    const today = new Date().toISOString().slice(0, 10);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.date === today) return parsed;
      } catch (e) {}
    }
    return { date: today, scansUsed: 2, messagesUsed: 1 };
  }

  saveDailyUsage() {
    localStorage.setItem("nb_daily_usage", JSON.stringify(this.dailyUsage));
  }

  recordScanUsage() {
    this.dailyUsage.scansUsed++;
    this.saveDailyUsage();
  }

  recordMessageUsage() {
    this.dailyUsage.messagesUsed++;
    this.saveDailyUsage();
  }

  upgradeSubscription(tier, period = "annual") {
    const plan = this.subscriptionPlans[tier] || this.subscriptionPlans.plus;
    const price = period === "annual" ? plan.annualPrice : plan.monthlyPrice;

    this.subscription.tier = tier;
    this.subscription.billingPeriod = period;
    this.subscription.status = "active";
    this.subscription.cancelAtPeriodEnd = false;
    this.subscription.startedAt = new Date().toISOString().slice(0, 10);
    const expDate = new Date();
    if (period === "annual") expDate.setFullYear(expDate.getFullYear() + 1);
    else expDate.setMonth(expDate.getMonth() + 1);
    this.subscription.expiresAt = expDate.toISOString().slice(0, 10);
    this.saveSubscription();

    // Log to billing history
    const invId = `INV-${Date.now().toString().slice(-6)}`;
    this.billingHistory.unshift({
      id: invId,
      date: new Date().toISOString().slice(0, 10),
      plan: `${plan.name} (${period.charAt(0).toUpperCase() + period.slice(1)})`,
      amount: price,
      status: "Paid",
      provider: "Stripe Checkout",
      invoicePdf: "#"
    });
    this.saveBillingHistory();
  }

  cancelSubscription() {
    this.subscription.cancelAtPeriodEnd = true;
    this.saveSubscription();
  }

  loadUser() {
    const saved = localStorage.getItem("nb_user");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      name: "Chef Alex",
      email: "alex@nutribite.ai",
      avatar: "👨‍🍳",
      goal: "Maintain Vitality",
      calorieTarget: 2100,
      proteinTarget: 125,
      carbsTarget: 230,
      fatTarget: 65,
      fiberTarget: 32,
      waterTarget: 2500,
      dietaryPreferences: ["Balanced", "High-Protein"],
      allergies: [],
      cuisinePreferences: ["Pakistani", "International"]
    };
  }

  saveUser() {
    localStorage.setItem("nb_user", JSON.stringify(this.user));
  }

  loadFavorites() {
    return JSON.parse(localStorage.getItem("nb_favorites") || "[1, 2, 4]");
  }

  saveFavorites() {
    localStorage.setItem("nb_favorites", JSON.stringify(this.favorites));
  }

  toggleFavorite(recipeId) {
    const idx = this.favorites.indexOf(recipeId);
    if (idx > -1) this.favorites.splice(idx, 1);
    else this.favorites.push(recipeId);
    this.saveFavorites();
  }

  loadFoodDiary() {
    const saved = localStorage.getItem("nb_food_diary");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
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
    ];
  }

  saveFoodDiary() {
    localStorage.setItem("nb_food_diary", JSON.stringify(this.foodDiary));
  }

  logFood(entry) {
    const item = {
      id: "entry_" + Date.now(),
      name: entry.name || "Gourmet Dish",
      mealType: entry.mealType || "Lunch",
      portionGrams: Math.round(Number(entry.portionGrams) || 200),
      calories: Math.round(Number(entry.calories) || 300),
      protein: Math.round((Number(entry.protein) || 12) * 10) / 10,
      carbs: Math.round((Number(entry.carbs) || 35) * 10) / 10,
      fat: Math.round((Number(entry.fat) || 10) * 10) / 10,
      fiber: Math.round((Number(entry.fiber) || 3) * 10) / 10,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      image: entry.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80"
    };

    this.foodDiary.unshift(item);
    this.saveFoodDiary();
    return item;
  }

  removeFoodLog(id) {
    this.foodDiary = this.foodDiary.filter(i => i.id !== id);
    this.saveFoodDiary();
  }

  getDailyTotals() {
    let cal = 0, p = 0, c = 0, f = 0, fib = 0;
    this.foodDiary.forEach(item => {
      cal += Number(item.calories) || 0;
      p += Number(item.protein) || 0;
      c += Number(item.carbs) || 0;
      f += Number(item.fat) || 0;
      fib += Number(item.fiber) || 0;
    });

    const stepBurn = Math.round(this.stepsCount * 0.04);
    const netCalories = Math.max(0, cal - stepBurn);
    const remainingCalories = Math.max(0, this.user.calorieTarget - cal);

    return {
      caloriesConsumed: cal,
      caloriesTarget: this.user.calorieTarget,
      caloriesRemaining: remainingCalories,
      proteinConsumed: Math.round(p * 10) / 10,
      proteinTarget: this.user.proteinTarget,
      carbsConsumed: Math.round(c * 10) / 10,
      carbsTarget: this.user.carbsTarget,
      fatConsumed: Math.round(f * 10) / 10,
      fatTarget: this.user.fatTarget,
      fiberConsumed: Math.round(fib * 10) / 10,
      fiberTarget: this.user.fiberTarget,
      waterConsumed: this.waterLogMl,
      waterTarget: this.user.waterTarget,
      steps: this.stepsCount,
      stepBurn,
      netCalories
    };
  }

  addWater(ml) {
    this.waterLogMl = Math.min(6000, Math.max(0, this.waterLogMl + ml));
    localStorage.setItem("nb_water_ml", this.waterLogMl);
  }

  addSteps(steps) {
    this.stepsCount = Math.max(0, this.stepsCount + steps);
    localStorage.setItem("nb_steps_count", this.stepsCount);
  }

  loadMealPlan() {
    const saved = localStorage.getItem("nb_meal_plan");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const plan = {};
    days.forEach((day, index) => {
      plan[day] = {
        Breakfast: index % 2 === 0 ? "Warm Berry Oatmeal (340 kcal)" : "Two Boiled Eggs & Whole Wheat Toast (280 kcal)",
        Lunch: index % 2 === 0 ? "Yellow Lentil Daal with Jeera Rice (360 kcal)" : "Mediterranean Salad with Grilled Feta (220 kcal)",
        Dinner: index % 3 === 0 ? "Authentic Karachi Chicken Biryani (480 kcal)" : (index % 3 === 1 ? "Lahori Mutton Karahi Wok (520 kcal)" : "Tuscan Garlic Herb Chicken (540 kcal)"),
        Snack: "Roasted Almonds & Green Tea (160 kcal)"
      };
    });
    return plan;
  }

  saveMealPlan() {
    localStorage.setItem("nb_meal_plan", JSON.stringify(this.mealPlan));
  }

  loadGroceryList() {
    const saved = localStorage.getItem("nb_grocery_list");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 1, name: "Aged Basmati Rice", qty: "1 kg", category: "Grains", checked: false },
      { id: 2, name: "Chicken Breasts", qty: "800g", category: "Meat and protein", checked: false },
      { id: 3, name: "Greek Yogurt", qty: "500g", category: "Dairy", checked: true },
      { id: 4, name: "Fresh Spinach & Mint", qty: "2 bunches", category: "Vegetables", checked: false },
      { id: 5, name: "Vine Tomatoes", qty: "6 whole", category: "Vegetables", checked: true },
      { id: 6, name: "Cumin & Green Cardamom", qty: "1 jar", category: "Spices", checked: false },
      { id: 7, name: "Cold-Pressed Olive Oil", qty: "1 bottle", category: "Other groceries", checked: false }
    ];
  }

  saveGroceryList() {
    localStorage.setItem("nb_grocery_list", JSON.stringify(this.groceryList));
  }

  toggleGroceryItem(id) {
    const item = this.groceryList.find(i => i.id === id);
    if (item) item.checked = !item.checked;
    this.saveGroceryList();
  }

  addGroceryItem(itemOrName, qty, category) {
    if (typeof itemOrName === "object" && itemOrName !== null) {
      this.groceryList.push({
        id: itemOrName.id || Date.now(),
        name: itemOrName.name,
        qty: itemOrName.qty || "1 unit",
        category: itemOrName.category || "Other groceries",
        checked: Boolean(itemOrName.checked)
      });
    } else {
      this.groceryList.push({
        id: Date.now(),
        name: itemOrName,
        qty: qty || "1",
        category: category || "Other groceries",
        checked: false
      });
    }
    this.saveGroceryList();
  }

  removeGroceryItem(id) {
    this.groceryList = this.groceryList.filter(i => i.id !== id);
    this.saveGroceryList();
  }

  generateGroceriesFromMealPlan() {
    const recipes = window.NutriBiteData.recipes;
    const addedItems = [];

    recipes.slice(0, 4).forEach(r => {
      r.ingredients.forEach(ing => {
        const existing = this.groceryList.find(g => g.name.toLowerCase() === ing.name.toLowerCase());
        if (!existing) {
          this.groceryList.push({
            id: Date.now() + Math.random(),
            name: ing.name,
            qty: `${ing.amount} ${ing.unit}`,
            category: ing.category || "Other groceries",
            checked: false
          });
          addedItems.push(ing.name);
        }
      });
    });

    this.saveGroceryList();
    return addedItems.length;
  }

  loadChatMessages() {
    const saved = localStorage.getItem("nb_chat_messages");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { sender: "assistant", text: "Hello Chef! I am your NutriBite AI Assistant. Ask me anything about calorie targets, recipes, ingredient substitutions, or Pakistani and international meals." }
    ];
  }

  addChatMessage(sender, text) {
    this.chatMessages.push({ sender, text, timestamp: new Date().toISOString() });
    localStorage.setItem("nb_chat_messages", JSON.stringify(this.chatMessages));
  }

  saveState() {
    this.saveUser();
    this.saveFavorites();
    this.saveFoodDiary();
    this.saveMealPlan();
    this.saveGroceryList();
    this.saveSubscription();
    this.saveDailyUsage();
    this.saveBillingHistory();
    localStorage.setItem("nb_water_ml", this.waterLogMl);
    localStorage.setItem("nb_steps_count", this.stepsCount);
  }
}

window.nutriBiteState = new NutriBiteState();

/**
 * Daily Food & Meal Planner ("Make Daily Food")
 * Automated meal planner, calorie & macro nutrition calculator,
 * and smart grocery shopping list generator.
 */

class DailyMealPlanner {
  constructor() {
    this.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    this.activeDay = 'Monday';

    this.defaultRoutines = {
      balanced: {
        breakfast: { name: 'Berry Superfood Smoothie Bowl', cal: 320, p: 12, c: 45, f: 8, time: '10m', img: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=500&q=80', video: 'dK5G8mG6v8g', ing: ['Banana', 'Blueberries', 'Greek Yogurt', 'Chia Seeds', 'Honey'] },
        lunch: { name: 'Mediterranean Garden Salad & Grilled Chicken', cal: 480, p: 38, c: 22, f: 18, time: '20m', img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&q=80', video: 'LPEUt0vXqEw', ing: ['Chicken Breast', 'Cucumber', 'Cherry Tomatoes', 'Olive Oil', 'Feta Cheese'] },
        dinner: { name: 'Aromatic Golden Coconut Curry', cal: 620, p: 34, c: 60, f: 22, time: '30m', img: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=500&q=80', video: 'jWY9hZ_N3i0', ing: ['Basmati Rice', 'Coconut Milk', 'Curry Spices', 'Onion', 'Garlic'] },
        snack: { name: 'Roasted Almonds & Dark Chocolate', cal: 210, p: 6, c: 18, f: 14, time: '2m', img: 'https://images.unsplash.com/photo-1508737804141-4c3b688e2546?w=500&q=80', video: '', ing: ['Almonds', 'Dark Chocolate'] }
      },
      protein: {
        breakfast: { name: 'Three-Egg French Herb Omelette', cal: 380, p: 26, c: 4, f: 28, time: '12m', img: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=500&q=80', video: 'qXPhVYpQLPA', ing: ['Eggs', 'Butter', 'Parmesan', 'Chives'] },
        lunch: { name: 'Gourmet Lean Beef Smash Burger with Greens', cal: 580, p: 44, c: 32, f: 26, time: '25m', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80', video: 'L6yX6Oxy_78', ing: ['Lean Beef', 'Brioche Bun', 'Cheddar', 'Lettuce'] },
        dinner: { name: 'Rosemary Garlic Seared Ribeye & Asparagus', cal: 690, p: 52, c: 8, f: 48, time: '25m', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&q=80', video: 'qK9bLgP3o4Q', ing: ['Beef Ribeye', 'Fresh Rosemary', 'Butter', 'Asparagus', 'Garlic'] },
        snack: { name: 'Whey Protein Shake & Peanut Butter Toast', cal: 290, p: 28, c: 24, f: 8, time: '5m', img: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=500&q=80', video: '', ing: ['Whey Protein', 'Whole Wheat Bread', 'Peanut Butter'] }
      },
      keto: {
        breakfast: { name: 'Avocado Baked Egg Cups with Crisp Bacon', cal: 410, p: 22, c: 4, f: 34, time: '18m', img: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&q=80', video: 'GLdl71cHGm0', ing: ['Avocado', 'Eggs', 'Bacon Strips', 'Cheddar'] },
        lunch: { name: 'Salmon Avocado Hand Rolls', cal: 440, p: 32, c: 6, f: 30, time: '20m', img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80', video: 'joweUxpHaqc', ing: ['Fresh Salmon', 'Nori Seaweed', 'Avocado', 'Sesame Oil'] },
        dinner: { name: 'Creamy Garlic Butter Chicken & Spinach', cal: 610, p: 48, c: 7, f: 42, time: '25m', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&q=80', video: 'bJUiWdM__Qw', ing: ['Chicken Breast', 'Heavy Cream', 'Garlic', 'Baby Spinach', 'Parmesan'] },
        snack: { name: 'Walnuts & Cream Cheese Celery Bites', cal: 220, p: 5, c: 3, f: 21, time: '4m', img: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&q=80', video: '', ing: ['Celery', 'Cream Cheese', 'Walnuts'] }
      }
    };

    // Load schedule from localStorage or initialize with balanced plan
    const saved = localStorage.getItem('pantryplate_meal_plan');
    if (saved) {
      try {
        this.schedule = JSON.parse(saved);
      } catch (e) {
        this.schedule = this.generateInitialSchedule();
      }
    } else {
      this.schedule = this.generateInitialSchedule();
    }
  }

  generateInitialSchedule() {
    const sched = {};
    this.days.forEach((day, index) => {
      const routineType = index % 2 === 0 ? 'balanced' : 'protein';
      sched[day] = JSON.parse(JSON.stringify(this.defaultRoutines[routineType]));
    });
    return sched;
  }

  saveSchedule() {
    localStorage.setItem('pantryplate_meal_plan', JSON.stringify(this.schedule));
  }

  getDayPlan(day = this.activeDay) {
    return this.schedule[day] || this.defaultRoutines.balanced;
  }

  setDayPlan(day, plan) {
    this.schedule[day] = plan;
    this.saveSchedule();
  }

  autoGeneratePlan(dietType = 'balanced') {
    const routine = this.defaultRoutines[dietType] || this.defaultRoutines.balanced;
    this.schedule[this.activeDay] = JSON.parse(JSON.stringify(routine));
    this.saveSchedule();
    return this.schedule[this.activeDay];
  }

  calculateTotals(day = this.activeDay) {
    const plan = this.getDayPlan(day);
    let calories = 0, protein = 0, carbs = 0, fat = 0;

    Object.values(plan).forEach((meal) => {
      if (meal) {
        calories += meal.cal || 0;
        protein += meal.p || 0;
        carbs += meal.c || 0;
        fat += meal.f || 0;
      }
    });

    return { calories, protein, carbs, fat };
  }

  getDailyGroceryList(day = this.activeDay) {
    const plan = this.getDayPlan(day);
    const ingredients = [];

    Object.values(plan).forEach((meal) => {
      if (meal && meal.ing) {
        meal.ing.forEach(item => {
          if (!ingredients.includes(item)) {
            ingredients.push(item);
          }
        });
      }
    });

    return ingredients;
  }
}

// Global instance
window.dailyMealPlanner = new DailyMealPlanner();

/**
 * Fitness, Nutrition & Health Tracker Engine
 * Manages Calories, Macros (Protein, Carbs, Fats), Water Tracker,
 * Step Counter, Food Diary, and Post-Meal Exercise Suggestions.
 */

class HealthTracker {
  constructor() {
    this.todayKey = this.getTodayDateKey();
    this.targets = {
      calories: 2000,
      protein: 120, // grams
      carbs: 220,   // grams
      fat: 65,      // grams
      water: 2500,  // ml (10 glasses)
      steps: 10000  // daily steps
    };

    // Load or initialize daily state
    this.state = this.loadDailyState();
    this.activeWorkoutTimer = null;
    this.workoutSeconds = 0;

    this.initMotionSensor();
  }

  getTodayDateKey() {
    const d = new Date();
    return `tracker_${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  loadDailyState() {
    const saved = localStorage.getItem(this.todayKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      date: new Date().toLocaleDateString(),
      water: 750, // default 3 glasses
      steps: 3200,
      exerciseBurned: 120, // kcal
      foodLog: [
        {
          id: 'log_1',
          name: 'Three-Egg Herb Omelette',
          mealType: 'Breakfast',
          calories: 270,
          protein: 18,
          carbs: 2,
          fat: 21,
          time: '8:30 AM',
          thumb: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=200&q=80'
        },
        {
          id: 'log_2',
          name: 'Berry Superfood Smoothie',
          mealType: 'Morning Snack',
          calories: 210,
          protein: 10,
          carbs: 38,
          fat: 3,
          time: '11:15 AM',
          thumb: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=200&q=80'
        }
      ]
    };
  }

  saveState() {
    localStorage.setItem(this.todayKey, JSON.stringify(this.state));
    this.updateUI();
  }

  // --- NUTRITION TOTALS ---
  getTotals() {
    let consumedCal = 0, consumedP = 0, consumedC = 0, consumedF = 0;
    this.state.foodLog.forEach(item => {
      consumedCal += Number(item.calories) || 0;
      consumedP += Number(item.protein) || 0;
      consumedC += Number(item.carbs) || 0;
      consumedF += Number(item.fat) || 0;
    });

    const stepBurn = Math.round(this.state.steps * 0.04); // ~0.04 kcal per step
    const totalBurned = stepBurn + (Number(this.state.exerciseBurned) || 0);
    const netCalories = consumedCal - totalBurned;

    return {
      consumedCal,
      consumedP,
      consumedC,
      consumedF,
      stepBurn,
      exerciseBurned: this.state.exerciseBurned,
      totalBurned,
      netCalories,
      remainingCal: Math.max(0, this.targets.calories - consumedCal)
    };
  }

  // --- FOOD DIARY LOGGING ---
  logFood(food) {
    const entry = {
      id: 'log_' + Date.now(),
      name: food.name || 'Gourmet Dish',
      mealType: food.mealType || 'Meal',
      calories: Math.round(Number(food.calories) || 300),
      protein: Math.round(Number(food.protein) || 15),
      carbs: Math.round(Number(food.carbs) || 35),
      fat: Math.round(Number(food.fat) || 10),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      thumb: food.thumb || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80'
    };

    this.state.foodLog.unshift(entry);
    this.saveState();

    // Trigger post-meal exercise suggestion!
    this.suggestPostMealExercise(entry);
    return entry;
  }

  removeFoodLog(id) {
    this.state.foodLog = this.state.foodLog.filter(item => item.id !== id);
    this.saveState();
  }

  // --- WATER TRACKER ---
  addWater(amount = 250) {
    this.state.water = Math.min(5000, Math.max(0, this.state.water + amount));
    this.saveState();
  }

  // --- STEP COUNTER ---
  addSteps(count = 1000) {
    this.state.steps = Math.max(0, this.state.steps + count);
    this.saveState();
  }

  initMotionSensor() {
    // Mobile pedometer using DeviceMotionEvent if allowed
    if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
      let lastAccel = 0;
      window.addEventListener('devicemotion', (event) => {
        const acc = event.accelerationIncludingGravity;
        if (!acc) return;
        const total = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z);
        const delta = Math.abs(total - lastAccel);
        if (delta > 11.5) { // threshold for one step
          this.state.steps += 1;
          lastAccel = total;
          // throttle save
          if (this.state.steps % 10 === 0) this.saveState();
        }
      }, { passive: true });
    }
  }

  // --- EXERCISE SUGGESTER AFTER EATING FOOD ---
  calculateExerciseSuggestions(calories) {
    const cal = Number(calories) || 350;
    return [
      {
        type: 'Brisk Walking',
        icon: '🚶‍♂️',
        met: 4.0,
        durationMin: Math.max(10, Math.round((cal / (4.0 * 70 * 0.0175)))),
        intensity: 'Gentle & aids digestion',
        recommendation: 'Best immediately after eating to prevent insulin spikes.'
      },
      {
        type: 'Outdoor Cycling',
        icon: '🚴',
        met: 7.0,
        durationMin: Math.max(8, Math.round((cal / (7.0 * 70 * 0.0175)))),
        intensity: 'Moderate aerobic burn',
        recommendation: 'Ideal 30-45 minutes after lunch or dinner.'
      },
      {
        type: 'Cardio Jogging',
        icon: '🏃',
        met: 9.8,
        durationMin: Math.max(6, Math.round((cal / (9.8 * 70 * 0.0175)))),
        intensity: 'High calorie burn',
        recommendation: 'Great 1 hour after meals to incinerate energy.'
      },
      {
        type: 'HIIT / Jump Rope',
        icon: '⚡',
        met: 11.0,
        durationMin: Math.max(5, Math.round((cal / (11.0 * 70 * 0.0175)))),
        intensity: 'Max metabolic boost',
        recommendation: 'Quick intense workout to boost all-day calorie burn.'
      }
    ];
  }

  suggestPostMealExercise(foodEntry) {
    const modal = document.getElementById('exercise-suggestion-modal');
    const content = document.getElementById('exercise-suggestion-content');
    if (!modal || !content) return;

    const suggestions = this.calculateExerciseSuggestions(foodEntry.calories);

    content.innerHTML = `
      <div style="text-align:center;margin-bottom:20px;">
        <div style="width:56px;height:56px;background:var(--primary-subtle);border-radius:50%;display:grid;place-items:center;margin:0 auto 10px;font-size:1.8rem;">
          🏃
        </div>
        <span style="font-size:0.75rem;font-weight:800;letter-spacing:1px;color:var(--primary);text-transform:uppercase;">Post-Meal Metabolic Guidance</span>
        <h3 style="font-family:var(--font-serif);font-size:1.6rem;margin:4px 0 6px;">How to Burn "${foodEntry.name}"</h3>
        <p style="font-size:0.85rem;color:var(--text-muted);">
          This meal provides <b>${foodEntry.calories} calories</b> (${foodEntry.protein}g protein, ${foodEntry.carbs}g carbs). Here are personalized activities to balance your energy:
        </p>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:14px;margin-bottom:24px;">
        ${suggestions.map(s => `
          <div style="background:var(--bg-subtle);border:1px solid var(--border-light);border-radius:var(--radius-md);padding:16px;display:flex;flex-direction:column;justify-content:space-between;">
            <div>
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
                <span style="font-size:1.5rem;">${s.icon}</span>
                <b style="font-size:1.15rem;color:var(--primary);">${s.durationMin} mins</b>
              </div>
              <h4 style="font-size:0.95rem;margin-bottom:2px;">${s.type}</h4>
              <span style="font-size:0.75rem;color:var(--text-muted);display:block;margin-bottom:6px;">${s.intensity}</span>
              <p style="font-size:0.78rem;color:var(--text-main);line-height:1.4;">${s.recommendation}</p>
            </div>
            <button class="btn btn-primary" style="font-size:0.78rem;padding:6px 12px;margin-top:12px;" onclick="window.healthTracker.startWorkout('${s.type}', ${s.durationMin}, ${foodEntry.calories})">
              Start ${s.type} ⏱
            </button>
          </div>
        `).join('')}
      </div>

      <div style="background:#fef3c7;border:1px solid #fde68a;border-radius:var(--radius-sm);padding:12px;display:flex;gap:10px;align-items:flex-start;font-size:0.78rem;color:#92400e;">
        <span>⚠️</span>
        <div>
          <b>AI Nutrition & Fitness Notice:</b> AI food estimates aren't always accurate. Portion size, ingredients and cooking methods can change the actual nutrition values. Listen to your body and consult a physician before strenuous workouts.
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    if (window.chefNova) {
      window.chefNova.speak(`Logged ${foodEntry.name}! To balance out ${foodEntry.calories} calories, a ${suggestions[0].durationMin} minute ${suggestions[0].type} is recommended.`);
    }
  }

  startWorkout(type, minutes, targetCalories) {
    const modal = document.getElementById('exercise-suggestion-modal');
    if (modal) modal.classList.add('hidden');

    if (window.chefNova) {
      window.chefNova.speak(`Workout started: ${type} for ${minutes} minutes. Let's burn those ${targetCalories} calories!`);
    }

    // Add burned calories to state
    this.state.exerciseBurned += Math.round(targetCalories * 0.85);
    this.saveState();

    if (window.appController) {
      window.appController.showToast(`🔥 Workout completed! Logged ${Math.round(targetCalories * 0.85)} kcal burned!`);
    }
  }

  // --- UI RENDERER ---
  updateUI() {
    const totals = this.getTotals();

    // 1. Calories Ring / Counts
    const calConsumedEl = document.getElementById('stat-calories-consumed');
    const calTargetEl = document.getElementById('stat-calories-target');
    const calRemainingEl = document.getElementById('stat-calories-remaining');
    const calBurnedEl = document.getElementById('stat-calories-burned');
    const calFillEl = document.getElementById('cal-progress-fill');

    if (calConsumedEl) calConsumedEl.textContent = totals.consumedCal;
    if (calTargetEl) calTargetEl.textContent = this.targets.calories;
    if (calRemainingEl) calRemainingEl.textContent = totals.remainingCal;
    if (calBurnedEl) calBurnedEl.textContent = totals.totalBurned;

    if (calFillEl) {
      const pct = Math.min(100, Math.round((totals.consumedCal / this.targets.calories) * 100));
      calFillEl.style.width = `${pct}%`;
    }

    // 2. Macros Progress Bars (Protein, Carbs, Fats)
    const pEl = document.getElementById('stat-protein-val');
    const cEl = document.getElementById('stat-carbs-val');
    const fEl = document.getElementById('stat-fats-val');
    const pBar = document.getElementById('stat-protein-bar');
    const cBar = document.getElementById('stat-carbs-bar');
    const fBar = document.getElementById('stat-fats-bar');

    if (pEl) pEl.textContent = `${totals.consumedP}g / ${this.targets.protein}g`;
    if (cEl) cEl.textContent = `${totals.consumedC}g / ${this.targets.carbs}g`;
    if (fEl) fEl.textContent = `${totals.consumedF}g / ${this.targets.fat}g`;

    if (pBar) pBar.style.width = `${Math.min(100, (totals.consumedP / this.targets.protein) * 100)}%`;
    if (cBar) cBar.style.width = `${Math.min(100, (totals.consumedC / this.targets.carbs) * 100)}%`;
    if (fBar) fBar.style.width = `${Math.min(100, (totals.consumedF / this.targets.fat) * 100)}%`;

    // 3. Water Tracker
    const waterEl = document.getElementById('water-count-display');
    const waterGlassesEl = document.getElementById('water-glasses-count');
    const waterFillEl = document.getElementById('water-bottle-fill');

    const glasses = Math.round((this.state.water / 250) * 10) / 10;
    if (waterEl) waterEl.textContent = `${this.state.water} ml`;
    if (waterGlassesEl) waterGlassesEl.textContent = `${glasses} of 10 glasses`;
    if (waterFillEl) {
      const wPct = Math.min(100, Math.round((this.state.water / this.targets.water) * 100));
      waterFillEl.style.height = `${wPct}%`;
    }

    // 4. Step Counter
    const stepsEl = document.getElementById('step-count-display');
    const stepsBurnEl = document.getElementById('step-burn-display');
    const stepsKmEl = document.getElementById('step-km-display');
    const stepFillEl = document.getElementById('step-progress-fill');

    const km = (this.state.steps * 0.00078).toFixed(1);
    if (stepsEl) stepsEl.textContent = this.state.steps.toLocaleString();
    if (stepsBurnEl) stepsBurnEl.textContent = `${totals.stepBurn} kcal`;
    if (stepsKmEl) stepsKmEl.textContent = `${km} km`;
    if (stepFillEl) {
      const sPct = Math.min(100, Math.round((this.state.steps / this.targets.steps) * 100));
      stepFillEl.style.width = `${sPct}%`;
    }

    // 5. Food Diary Timeline
    const diaryContainer = document.getElementById('food-diary-list');
    if (diaryContainer) {
      if (!this.state.foodLog.length) {
        diaryContainer.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text-muted);font-size:0.85rem;">No meals logged yet today. Use the AI Food Scanner or recipes below to log your meals!</div>';
      } else {
        diaryContainer.innerHTML = this.state.foodLog.map(item => `
          <div class="food-diary-row">
            <div style="display:flex;align-items:center;gap:12px;">
              <img src="${item.thumb}" alt="${item.name}" style="width:48px;height:48px;border-radius:10px;object-fit:cover;">
              <div>
                <b style="font-size:0.92rem;color:var(--text-main);display:block;">${item.name}</b>
                <span style="font-size:0.75rem;color:var(--text-muted);">${item.mealType} · ${item.time}</span>
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:16px;">
              <div style="text-align:right;">
                <b style="font-size:0.95rem;color:var(--primary);">${item.calories} kcal</b>
                <span style="font-size:0.72rem;color:var(--text-muted);display:block;">P:${item.protein}g · C:${item.carbs}g · F:${item.fat}g</span>
              </div>
              <button class="btn-icon" style="width:30px;height:30px;font-size:0.85rem;" title="Remove Entry" onclick="window.healthTracker.removeFoodLog('${item.id}')">✕</button>
            </div>
          </div>
        `).join('');
      }
    }
  }
}

// Global instance
window.healthTracker = new HealthTracker();

/**
 * Main Application Orchestrator
 * Connects Multi-modal Search, Video Player, Machine Learning Vision,
 * AI Voice Agent, Daily Meal Planner, and Authentication.
 */

class AppController {
  constructor() {
    this.ingredients = [];
    this.currentRecipes = [];
    this.activeRecipe = null;
    this.currentStepIndex = 0;
    this.recipeSteps = [];
    this.isAppSimulator = false;

    // Rich Curated Master Database with YouTube HD Video IDs
    this.masterRecipes = [
      {
        idMeal: 'rec_01',
        strMeal: 'Silky French Bistro Herb Omelette',
        strCategory: 'Breakfast',
        strArea: 'French',
        strMealThumb: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=700&q=80',
        strYoutube: 'https://www.youtube.com/watch?v=qXPhVYpQLPA',
        calories: 270,
        prepTime: '12 mins',
        strInstructions: '1. Crack the fresh eggs into a chilled bowl and whisk vigorously until smooth.\n2. Melt creamy butter in a 20cm non-stick skillet over medium-low heat until gently foaming.\n3. Pour in beaten eggs. Shake skillet continuously in circular motions while stirring with a silicone spatula to form velvety curds.\n4. When almost set but creamy in the center, sprinkle fresh chives, parmesan, sea salt, and cracked pepper.\n5. Gently roll the omelette onto a warm plate, glaze with a knob of butter, and serve immediately.',
        ingredientsList: [
          { name: 'Eggs', measure: '3 large' },
          { name: 'Butter', measure: '2 tbsp' },
          { name: 'Parmesan', measure: '2 tbsp grated' },
          { name: 'Chives', measure: '1 tbsp chopped' },
          { name: 'Salt & Pepper', measure: 'Pinch' }
        ]
      },
      {
        idMeal: 'rec_02',
        strMeal: 'Creamy Tuscan Garlic Chicken & Pasta',
        strCategory: 'Pasta',
        strArea: 'Italian',
        strMealThumb: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=700&q=80',
        strYoutube: 'https://www.youtube.com/watch?v=bJUiWdM__Qw',
        calories: 520,
        prepTime: '25 mins',
        strInstructions: '1. Boil fettuccine or penne in salted boiling water until al dente; reserve 1/2 cup pasta water.\n2. Season chicken breast with oregano, garlic powder, salt, and sear in olive oil until golden brown on both sides. Set aside.\n3. In the same pan, saute minced garlic and sun-dried tomatoes until fragrant.\n4. Pour in heavy cream and chicken broth; bring to a gentle simmer for 3 minutes.\n5. Stir in baby spinach until wilted, then fold in freshly grated Parmesan cheese until smooth and velvety.\n6. Toss in cooked pasta and sliced seared chicken. Top with fresh cracked pepper and basil.',
        ingredientsList: [
          { name: 'Pasta', measure: '250g' },
          { name: 'Chicken Breast', measure: '2 pieces' },
          { name: 'Heavy Cream', measure: '1 cup' },
          { name: 'Garlic', measure: '4 cloves minced' },
          { name: 'Parmesan', measure: '1/2 cup' },
          { name: 'Baby Spinach', measure: '2 cups' },
          { name: 'Olive Oil', measure: '2 tbsp' }
        ]
      },
      {
        idMeal: 'rec_03',
        strMeal: 'Classic Neapolitan Margherita Pizza',
        strCategory: 'Dinner',
        strArea: 'Italian',
        strMealThumb: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=700&q=80',
        strYoutube: 'https://www.youtube.com/watch?v=1-SJGQ2HLp8',
        calories: 610,
        prepTime: '20 mins',
        strInstructions: '1. Preheat your oven with a pizza stone or baking steel to its highest setting (250°C / 480°F).\n2. Stretch pizza dough gently by hand on a floured surface to form a 12-inch circle with a raised outer crust.\n3. Spread San Marzano tomato sauce evenly with the back of a spoon, leaving a 1-inch border.\n4. Tear fresh fior di latte or fresh mozzarella and distribute across the pizza.\n5. Drizzle with extra virgin olive oil and slide onto the preheated stone.\n6. Bake for 7 to 9 minutes until the crust is blistered and cheese is bubbling.\n7. Finish with fresh torn sweet basil leaves and enjoy piping hot.',
        ingredientsList: [
          { name: 'Pizza Dough', measure: '1 ball (250g)' },
          { name: 'Tomato Sauce', measure: '1/2 cup' },
          { name: 'Mozzarella', measure: '150g fresh' },
          { name: 'Fresh Basil', measure: 'Handful' },
          { name: 'Olive Oil', measure: '1 tbsp' }
        ]
      },
      {
        idMeal: 'rec_04',
        strMeal: 'Golden Thai Coconut Chicken Curry',
        strCategory: 'Curry',
        strArea: 'Thai',
        strMealThumb: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=700&q=80',
        strYoutube: 'https://www.youtube.com/watch?v=jWY9hZ_N3i0',
        calories: 480,
        prepTime: '25 mins',
        strInstructions: '1. Heat 1 tbsp coconut oil in a wok or deep skillet over medium heat.\n2. Add yellow curry paste, minced ginger, and garlic; stir-fry for 1 minute until fragrant.\n3. Add diced chicken breast and sear until lightly browned.\n4. Pour in rich coconut milk and chicken broth. Bring to a gentle boil.\n5. Add sliced bell peppers, baby corn, and zucchini. Simmer for 10-12 minutes.\n6. Season with fish sauce, a touch of brown sugar, and freshly squeezed lime juice.\n7. Garnish with fresh cilantro leaves and serve over warm Jasmine rice.',
        ingredientsList: [
          { name: 'Chicken Breast', measure: '400g diced' },
          { name: 'Coconut Milk', measure: '1 can (400ml)' },
          { name: 'Curry Powder', measure: '2 tbsp' },
          { name: 'Garlic & Ginger', measure: '1 tbsp minced' },
          { name: 'Bell Pepper', measure: '1 sliced' },
          { name: 'Lime Juice', measure: '1 tbsp' },
          { name: 'Rice', measure: 'For serving' }
        ]
      },
      {
        idMeal: 'rec_05',
        strMeal: 'Crispy Salmon Avocado Sushi Rolls',
        strCategory: 'Dinner',
        strArea: 'Japanese',
        strMealThumb: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=700&q=80',
        strYoutube: 'https://www.youtube.com/watch?v=joweUxpHaqc',
        calories: 360,
        prepTime: '30 mins',
        strInstructions: '1. Rinse sushi rice and steam. Season while warm with rice vinegar, sugar, and salt.\n2. Lay a nori seaweed sheet shiny-side down on a bamboo rolling mat.\n3. Spread seasoned rice evenly over nori with wet hands, leaving a 1-inch strip at the top.\n4. Arrange sashimi-grade salmon strips, cucumber julienne, and ripe avocado slices across the center.\n5. Roll tightly using the bamboo mat, applying gentle even pressure.\n6. Slice into 8 neat rounds with a sharp moistened chef knife.\n7. Serve with tamari soy sauce, pickled ginger, and wasabi.',
        ingredientsList: [
          { name: 'Sushi Rice', measure: '2 cups cooked' },
          { name: 'Salmon', measure: '200g sashimi' },
          { name: 'Nori Seaweed', measure: '4 sheets' },
          { name: 'Avocado', measure: '1 ripe sliced' },
          { name: 'Cucumber', measure: '1 julienned' },
          { name: 'Soy Sauce', measure: 'For dipping' }
        ]
      },
      {
        idMeal: 'rec_06',
        strMeal: 'Fluffy Golden Buttermilk Pancakes',
        strCategory: 'Breakfast',
        strArea: 'American',
        strMealThumb: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=700&q=80',
        strYoutube: 'https://www.youtube.com/watch?v=GLdl71cHGm0',
        calories: 340,
        prepTime: '15 mins',
        strInstructions: '1. Whisk together all-purpose flour, baking powder, a pinch of salt, and sugar in a large bowl.\n2. In a separate bowl, whisk buttermilk, egg, and melted unsalted butter.\n3. Pour wet mixture into dry ingredients. Fold gently with a spatula until just combined (leave small lumps).\n4. Heat a buttered griddle over medium heat.\n5. Ladle 1/3 cup of batter per pancake. Cook until bubbles form on top (about 2 minutes).\n6. Flip gently and cook for another 1-2 minutes until golden brown.\n7. Serve stacked high with fresh berries and warm maple syrup.',
        ingredientsList: [
          { name: 'Flour', measure: '1.5 cups' },
          { name: 'Milk', measure: '1.25 cups' },
          { name: 'Egg', measure: '1 large' },
          { name: 'Butter', measure: '3 tbsp melted' },
          { name: 'Maple Syrup', measure: 'To serve' }
        ]
      }
    ];

    this.init();
  }

  init() {
    this.detectAndApplyDeviceMode();
    this.bindEvents();
    this.renderChips();
    this.renderRecipes(this.masterRecipes);
    this.renderDailyPlanner();
    this.setupCanvasVisualizer();
    this.setupMLStudio();
    this.checkUserAuth();

    if (window.healthTracker) {
      window.healthTracker.updateUI();
    }
  }

  detectAndApplyDeviceMode() {
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    if (isMobileDevice) {
      document.body.classList.add('mobile-detected');
      const glance = document.getElementById('mobile-glance-bar');
      if (glance) glance.style.display = 'flex';
    }
  }

  bindEvents() {
    // 1. Ingredients form
    const ingForm = document.getElementById('ingredient-form');
    const ingInput = document.getElementById('ingredient-input');
    if (ingForm && ingInput) {
      ingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.addIngredient(ingInput.value);
        ingInput.value = '';
      });
    }

    // 2. Quick tag buttons
    document.querySelectorAll('[data-tag]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.addIngredient(btn.dataset.tag);
      });
    });

    // 3. Search action
    const findBtn = document.getElementById('find-recipes-btn');
    if (findBtn) {
      findBtn.addEventListener('click', () => this.searchMatchingRecipes());
    }

    // 4. Dish text search form
    const dishForm = document.getElementById('dish-search-form');
    const dishInput = document.getElementById('dish-query-input');
    if (dishForm && dishInput) {
      dishForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.executeSearch(dishInput.value);
      });
    }

    // 5. Image & Food Camera Vision Upload
    const photoInput = document.getElementById('photo-upload-input');
    const dropzone = document.getElementById('vision-dropzone');
    if (photoInput && dropzone) {
      dropzone.addEventListener('click', () => photoInput.click());
      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      });
      dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
          this.handleImageFile(e.dataTransfer.files[0]);
        }
      });
      photoInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
          this.handleImageFile(e.target.files[0]);
        }
      });
    }

    // 6. Camera button
    const cameraBtn = document.getElementById('open-camera-btn');
    if (cameraBtn && photoInput) {
      cameraBtn.addEventListener('click', () => photoInput.click());
    }

    // 7. Voice Controls
    const voiceOrb = document.getElementById('voice-orb-btn');
    const voiceModal = document.getElementById('voice-agent-modal');
    const voiceClose = document.getElementById('voice-modal-close');
    if (voiceOrb && voiceModal) {
      voiceOrb.addEventListener('click', () => {
        voiceModal.classList.toggle('hidden');
        if (!voiceModal.classList.contains('hidden')) {
          window.chefNova.toggleListening();
        }
      });
    }
    if (voiceClose && voiceModal) {
      voiceClose.addEventListener('click', () => voiceModal.classList.add('hidden'));
    }

    const speakIngredientsBtn = document.getElementById('speak-ingredients-btn');
    if (speakIngredientsBtn) {
      speakIngredientsBtn.addEventListener('click', () => window.chefNova.toggleListening());
    }

    // 8. Auth Modal
    const accountBtn = document.getElementById('account-open-btn');
    const authModal = document.getElementById('auth-modal');
    const authClose = document.getElementById('auth-modal-close');
    if (accountBtn && authModal) {
      accountBtn.addEventListener('click', () => authModal.classList.remove('hidden'));
    }
    if (authClose && authModal) {
      authClose.addEventListener('click', () => authModal.classList.add('hidden'));
    }

    // 9. Auth Tab Switchers
    const tabLogin = document.getElementById('tab-login-btn');
    const tabSignup = document.getElementById('tab-signup-btn');
    const formLogin = document.getElementById('form-login');
    const formSignup = document.getElementById('form-signup');
    if (tabLogin && tabSignup && formLogin && formSignup) {
      tabLogin.addEventListener('click', () => {
        tabLogin.classList.add('active');
        tabSignup.classList.remove('active');
        formLogin.classList.remove('hidden');
        formSignup.classList.add('hidden');
      });
      tabSignup.addEventListener('click', () => {
        tabSignup.classList.add('active');
        tabLogin.classList.remove('active');
        formSignup.classList.remove('hidden');
        formLogin.classList.add('hidden');
      });
    }

    // Password strength check
    const signupPass = document.getElementById('signup-password');
    const strengthFill = document.getElementById('password-strength-fill');
    if (signupPass && strengthFill) {
      signupPass.addEventListener('input', () => {
        const result = window.authManager.calculatePasswordStrength(signupPass.value);
        strengthFill.style.width = result.score + '%';
        strengthFill.style.backgroundColor = result.color;
      });
    }

    // Avatar selection
    document.querySelectorAll('.avatar-option').forEach(avatar => {
      avatar.addEventListener('click', () => {
        document.querySelectorAll('.avatar-option').forEach(a => a.classList.remove('selected'));
        avatar.classList.add('selected');
        window.authManager.selectedAvatar = avatar.textContent;
      });
    });

    // Form Submissions
    if (formLogin) {
      formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const pass = document.getElementById('login-password').value;
        try {
          window.authManager.login(email, pass);
          authModal.classList.add('hidden');
          this.showToast(`Welcome back, ${email.split('@')[0]}! 🎉`);
        } catch (err) {
          alert(err.message);
        }
      });
    }

    if (formSignup) {
      formSignup.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const pass = document.getElementById('signup-password').value;
        try {
          window.authManager.register(name, email, pass);
          authModal.classList.add('hidden');
          this.showToast(`Account created! Welcome, Chef ${name}! 👨‍🍳`);
        } catch (err) {
          alert(err.message);
        }
      });
    }

    // 10. Recipe Modal Close
    const recipeModal = document.getElementById('recipe-modal');
    const recipeClose = document.getElementById('recipe-modal-close');
    if (recipeModal && recipeClose) {
      recipeClose.addEventListener('click', () => {
        recipeModal.classList.add('hidden');
        window.chefNova.stopSpeaking();
      });
      recipeModal.addEventListener('click', (e) => {
        if (e.target === recipeModal) {
          recipeModal.classList.add('hidden');
          window.chefNova.stopSpeaking();
        }
      });
    }

    // 11. App Simulator View Toggle ("Web Mode" vs "Mobile App Mode")
    const appToggleBtn = document.getElementById('app-mode-toggle');
    if (appToggleBtn) {
      appToggleBtn.addEventListener('click', () => {
        this.isAppSimulator = !this.isAppSimulator;
        document.body.classList.toggle('app-simulator-mode', this.isAppSimulator);
        appToggleBtn.innerHTML = this.isAppSimulator
          ? '<span>🖥️ Desktop Web View</span>'
          : '<span>📱 Mobile App Frame</span>';
      });
    }

    // 12. Dark Mode Toggle
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        themeBtn.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
      });
    }

    // 13. Daily Food Plan Diet Filter
    const dietSelect = document.getElementById('plan-diet-select');
    const autoPlanBtn = document.getElementById('auto-generate-plan-btn');
    if (autoPlanBtn && dietSelect) {
      autoPlanBtn.addEventListener('click', () => {
        window.dailyMealPlanner.autoGeneratePlan(dietSelect.value);
        this.renderDailyPlanner();
        this.showToast(`Generated personalized ${dietSelect.value} routine!`);
        window.chefNova.speak(`I have updated your daily food routine with a healthy ${dietSelect.value} meal plan.`);
      });
    }
  }

  addIngredient(text) {
    if (!text) return;
    const items = text.split(/[,;\n]+/).map(s => s.trim().toLowerCase()).filter(Boolean);
    items.forEach(item => {
      if (!this.ingredients.includes(item) && this.ingredients.length < 15) {
        this.ingredients.push(item);
      }
    });
    this.renderChips();
  }

  removeIngredient(index) {
    this.ingredients.splice(index, 1);
    this.renderChips();
  }

  renderChips() {
    const container = document.getElementById('chips-container');
    const countEl = document.getElementById('ingredient-count');
    if (!container) return;

    if (countEl) countEl.textContent = this.ingredients.length;

    if (!this.ingredients.length) {
      container.innerHTML = '<span class="chip-empty-hint">Your ingredients will appear here (e.g. egg, chicken, garlic)...</span>';
      return;
    }

    container.innerHTML = this.ingredients.map((item, index) => `
      <span class="ingredient-chip">
        ${item}
        <button type="button" onclick="window.appController.removeIngredient(${index})" aria-label="Remove ${item}">✕</button>
      </span>
    `).join('');
  }

  renderRecipes(recipes) {
    this.currentRecipes = recipes;
    const grid = document.getElementById('recipe-grid');
    const countEl = document.getElementById('recipe-result-count');
    if (!grid) return;

    if (countEl) {
      countEl.textContent = `${recipes.length} Recipe${recipes.length === 1 ? '' : 's'} available`;
    }

    if (!recipes.length) {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted);">No matching recipes found. Try adding different ingredients or explore our curated specialties!</div>';
      return;
    }

    grid.innerHTML = recipes.map(r => {
      const matchScore = this.ingredients.length ? this.calculateMatch(r) : 98;
      const vidId = this.extractYoutubeId(r.strYoutube);
      return `
        <article class="recipe-card">
          <div class="recipe-card-media">
            <img src="${r.strMealThumb}" alt="${r.strMeal}" loading="lazy">
            ${vidId ? `<div class="recipe-video-badge"><span>▶</span> Video Tutorial</div>` : ''}
            <div class="recipe-match-badge">${matchScore}% Match</div>
          </div>
          <div class="recipe-card-body">
            <div class="recipe-meta-row">
              <span class="recipe-category">${r.strArea || 'Chef Special'} · ${r.strCategory || 'Gourmet'}</span>
              <span>⏱ ${r.prepTime || '20 mins'}</span>
            </div>
            <h3 class="recipe-title">${r.strMeal}</h3>
            <p class="recipe-snippet">${r.strInstructions ? r.strInstructions.substring(0, 100) + '…' : 'A delicious chef-crafted recipe ready for your kitchen.'}</p>
            <div class="recipe-card-foot">
              <div class="recipe-quick-info">
                <span>🔥 ${r.calories || 380} kcal</span>
              </div>
              <button class="btn btn-primary" onclick="window.appController.openRecipeModal('${r.idMeal}')">
                Cook & Watch <span>↗</span>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  calculateMatch(recipe) {
    const ingNames = (recipe.ingredientsList || []).map(i => i.name.toLowerCase());
    return window.chefVisionML.matchRecipeIngredients(this.ingredients, ingNames);
  }

  searchMatchingRecipes() {
    if (!this.ingredients.length) {
      this.renderRecipes(this.masterRecipes);
      return;
    }

    const matched = this.masterRecipes.map(r => ({
      recipe: r,
      score: this.calculateMatch(r)
    })).sort((a, b) => b.score - a.score);

    this.renderRecipes(matched.map(m => m.recipe));
    const resultsSec = document.getElementById('results');
    if (resultsSec) resultsSec.scrollIntoView({ behavior: 'smooth' });
  }

  executeSearch(query) {
    if (!query) return;
    const clean = query.toLowerCase().trim();
    const filtered = this.masterRecipes.filter(r => 
      r.strMeal.toLowerCase().includes(clean) ||
      (r.strCategory && r.strCategory.toLowerCase().includes(clean)) ||
      (r.strArea && r.strArea.toLowerCase().includes(clean))
    );

    if (filtered.length) {
      this.renderRecipes(filtered);
    } else {
      // Add as ingredient and filter
      this.addIngredient(clean);
      this.searchMatchingRecipes();
    }

    const resultsSec = document.getElementById('results');
    if (resultsSec) resultsSec.scrollIntoView({ behavior: 'smooth' });
  }

  handleImageFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Run ML classification
        const result = window.chefVisionML.classify(img);
        this.displayVisionResult(img.src, result);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  displayVisionResult(imageSrc, result) {
    const previewContainer = document.getElementById('vision-result-container');
    if (!previewContainer) return;

    this.activeVisionFood = {
      imageSrc,
      result,
      selectedGrams: 220
    };

    const initialNutr = window.chefVisionML.getNutritionForPortion(result.topPrediction.id, 220);

    previewContainer.classList.remove('hidden');
    previewContainer.innerHTML = `
      <div class="vision-preview-box">
        <img src="${imageSrc}" alt="Analyzed food">
      </div>
      <div class="ml-analysis-result">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <span style="font-size:0.75rem;font-weight:800;color:var(--primary);text-transform:uppercase;">ML Vision Prediction</span>
            <h4 style="font-size:1.15rem;margin:2px 0;">${result.topPrediction.name}</h4>
          </div>
          <b style="font-size:1.2rem;color:var(--primary);">${result.topPrediction.confidence}%</b>
        </div>
        <div class="ml-confidence-bar">
          <div class="ml-confidence-fill" style="width:${result.topPrediction.confidence}%;"></div>
        </div>

        <!-- Step 5: Portion-Size Input & Dynamic Estimation Slider -->
        <div style="background:var(--bg-card);border:1px solid var(--border-light);border-radius:var(--radius-sm);padding:14px;margin-bottom:14px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <label for="portion-slider-input" style="font-size:0.8rem;font-weight:700;">Estimate Portion Size:</label>
            <b id="portion-grams-val" style="color:var(--primary);font-size:0.95rem;">220g (Standard)</b>
          </div>
          <input type="range" id="portion-slider-input" min="60" max="600" step="10" value="220" style="width:100%;accent-color:var(--primary);" oninput="window.appController.updatePortionSlider('${result.topPrediction.id}', this.value)">

          <div style="display:flex;gap:6px;margin-top:6px;">
            <button class="tag-btn" type="button" onclick="window.appController.setPortionQuick('${result.topPrediction.id}', 120, 'Small')">Small (120g)</button>
            <button class="tag-btn" type="button" onclick="window.appController.setPortionQuick('${result.topPrediction.id}', 220, 'Standard')">Standard (220g)</button>
            <button class="tag-btn" type="button" onclick="window.appController.setPortionQuick('${result.topPrediction.id}', 400, 'Large')">Large (400g)</button>
          </div>

          <!-- Live Nutrition Breakdown Display -->
          <div id="live-portion-nutrition" style="margin-top:12px;padding-top:10px;border-top:1px dashed var(--border-light);display:grid;grid-template-columns:repeat(4, 1fr);gap:8px;text-align:center;">
            <div>
              <span style="font-size:0.7rem;color:var(--text-muted);display:block;">Calories</span>
              <b id="portion-cal" style="color:var(--primary);font-size:1.05rem;">${initialNutr.calories} kcal</b>
            </div>
            <div>
              <span style="font-size:0.7rem;color:var(--text-muted);display:block;">Protein</span>
              <b id="portion-p" style="color:#3b82f6;font-size:0.95rem;">${initialNutr.protein}g</b>
            </div>
            <div>
              <span style="font-size:0.7rem;color:var(--text-muted);display:block;">Carbs</span>
              <b id="portion-c" style="color:#f59e0b;font-size:0.95rem;">${initialNutr.carbs}g</b>
            </div>
            <div>
              <span style="font-size:0.7rem;color:var(--text-muted);display:block;">Fats</span>
              <b id="portion-f" style="color:#ec4899;font-size:0.95rem;">${initialNutr.fat}g</b>
            </div>
          </div>
        </div>

        <p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:8px;">Detected Core Ingredients:</p>
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px;">
          ${result.topPrediction.ingredients.map(ing => `<span class="ingredient-chip">${ing}</span>`).join('')}
        </div>

        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:10px;">
          <button class="btn btn-primary" style="flex:1;font-size:0.82rem;" onclick="window.appController.applyDetectedIngredients('${result.topPrediction.ingredients.join(',')}')">
            ＋ Add Ingredients & Find Recipes
          </button>
          <button class="btn btn-secondary" style="flex:1;font-size:0.82rem;" onclick="window.appController.saveScannedMealToDiary('${result.topPrediction.id}')">
            💾 Save Meal History & Burn Plan
          </button>
        </div>

        <div style="font-size:0.72rem;color:#b45309;background:#fef3c7;padding:6px 10px;border-radius:4px;border:1px solid #fde68a;">
          ⚠️ <b>Notice:</b> AI food estimates aren't always accurate. Portion size, ingredients and cooking methods can change actual nutrition values.
        </div>
      </div>
    `;

    window.chefNova.speak(`I analyzed your food photo! It looks like ${result.topPrediction.name} with ${result.topPrediction.confidence}% confidence. You can adjust the portion slider to calculate nutrition.`);
  }

  updatePortionSlider(classId, grams) {
    if (this.activeVisionFood) {
      this.activeVisionFood.selectedGrams = Number(grams);
    }
    const valLabel = document.getElementById('portion-grams-val');
    if (valLabel) valLabel.textContent = `${grams}g`;

    const nutr = window.chefVisionML.getNutritionForPortion(classId, grams);
    const calEl = document.getElementById('portion-cal');
    const pEl = document.getElementById('portion-p');
    const cEl = document.getElementById('portion-c');
    const fEl = document.getElementById('portion-f');

    if (calEl) calEl.textContent = `${nutr.calories} kcal`;
    if (pEl) pEl.textContent = `${nutr.protein}g`;
    if (cEl) cEl.textContent = `${nutr.carbs}g`;
    if (fEl) fEl.textContent = `${nutr.fat}g`;
  }

  setPortionQuick(classId, grams, label) {
    const slider = document.getElementById('portion-slider-input');
    if (slider) slider.value = grams;
    const valLabel = document.getElementById('portion-grams-val');
    if (valLabel) valLabel.textContent = `${grams}g (${label})`;
    this.updatePortionSlider(classId, grams);
  }

  saveScannedMealToDiary(classId) {
    if (!this.activeVisionFood) return;
    const grams = this.activeVisionFood.selectedGrams || 220;
    const nutr = window.chefVisionML.getNutritionForPortion(classId, grams);

    window.healthTracker.logFood({
      name: `${nutr.name} (${grams}g)`,
      calories: nutr.calories,
      protein: nutr.protein,
      carbs: nutr.carbs,
      fat: nutr.fat,
      thumb: this.activeVisionFood.imageSrc
    });

    this.showToast(`Saved ${nutr.name} (${grams}g) to Food Diary! 💾`);
  }

  applyDetectedIngredients(ingString) {
    this.addIngredient(ingString);
    this.searchMatchingRecipes();
    this.showToast('Detected ingredients added to your kitchen! 🍳');
  }

  extractYoutubeId(url) {
    if (!url) return null;
    try {
      const u = new URL(url);
      if (u.hostname.includes('youtube.com')) return u.searchParams.get('v');
      if (u.hostname.includes('youtu.be')) return u.pathname.slice(1);
    } catch (e) {}
    return null;
  }

  openRecipeModal(recipeId) {
    const recipe = this.masterRecipes.find(r => r.idMeal === recipeId);
    if (!recipe) return;

    this.activeRecipe = recipe;
    this.currentStepIndex = 0;
    this.recipeSteps = (recipe.strInstructions || '').split(/\n+/).map(s => s.trim()).filter(Boolean);

    const modal = document.getElementById('recipe-modal');
    const content = document.getElementById('recipe-modal-content');
    if (!modal || !content) return;

    const vidId = this.extractYoutubeId(recipe.strYoutube);

    content.innerHTML = `
      <div style="padding:28px 28px 10px;">
        <span style="font-size:0.75rem;font-weight:800;letter-spacing:1px;color:var(--primary);text-transform:uppercase;">${recipe.strArea} Cuisine · ${recipe.strCategory}</span>
        <h2 style="font-family:var(--font-serif);font-size:2rem;margin:8px 0 14px;">${recipe.strMeal}</h2>
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:20px;">
          <div style="display:flex;gap:20px;font-size:0.85rem;color:var(--text-muted);">
            <span>⏱ ${recipe.prepTime}</span>
            <span>🔥 ${recipe.calories} kcal</span>
            <span>⭐ 4.9 (Chef Verified)</span>
          </div>
          <button class="btn btn-primary" style="font-size:0.85rem;padding:7px 16px;" onclick="window.healthTracker.logFood({ name: '${recipe.strMeal}', calories: ${recipe.calories || 400}, protein: 24, carbs: 45, fat: 14, thumb: '${recipe.strMealThumb}' })">
            🍽️ Log to Food Diary & Get Exercise Plan
          </button>
        </div>
      </div>

      ${vidId ? `
        <div class="recipe-video-embed">
          <iframe src="https://www.youtube-nocookie.com/embed/${vidId}?autoplay=0&rel=0" 
                  title="${recipe.strMeal} Cooking Tutorial"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen></iframe>
        </div>
      ` : ''}

      <div style="padding:28px;display:grid;grid-template-columns:1fr 1.3fr;gap:30px;">
        <div>
          <h3 style="font-family:var(--font-serif);font-size:1.3rem;margin-bottom:14px;">What You'll Need</h3>
          <ul style="list-style:none;display:flex;flex-direction:column;gap:10px;">
            ${(recipe.ingredientsList || []).map((ing, idx) => `
              <li style="display:flex;align-items:center;gap:10px;font-size:0.9rem;color:var(--text-main);padding:6px 0;border-bottom:1px solid var(--border-light);">
                <input type="checkbox" id="ing_check_${idx}" style="accent-color:var(--primary);cursor:pointer;">
                <label for="ing_check_${idx}"><b>${ing.measure}</b> ${ing.name}</label>
              </li>
            `).join('')}
          </ul>
        </div>

        <div>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
            <h3 style="font-family:var(--font-serif);font-size:1.3rem;">Step-by-Step Cooking Guide</h3>
            <button class="btn btn-secondary" style="font-size:0.8rem;padding:6px 12px;" onclick="window.appController.startVoiceStepGuidance()">
              🔊 Read With Chef Nova
            </button>
          </div>
          <div class="cooking-steps-list" id="cooking-steps-container">
            ${this.recipeSteps.map((step, idx) => `
              <div class="step-card" id="step_card_${idx}">
                <div class="step-number">${idx + 1}</div>
                <div style="flex:1;">
                  <p style="font-size:0.9rem;line-height:1.6;margin-bottom:6px;">${step}</p>
                  <label style="font-size:0.75rem;color:var(--text-muted);cursor:pointer;display:inline-flex;align-items:center;gap:6px;">
                    <input type="checkbox" onchange="window.appController.checkStepDone(${idx})" style="accent-color:var(--primary);">
                    Mark as completed
                  </label>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    window.chefNova.speak(`Opened recipe for ${recipe.strMeal}. You can watch the cooking video above and check off ingredients as you prepare them.`);
  }

  checkStepDone(index) {
    const card = document.getElementById(`step_card_${index}`);
    if (card) card.classList.toggle('completed');

    // Check if all steps are completed
    const allChecked = document.querySelectorAll('#cooking-steps-container input[type="checkbox"]:checked');
    if (allChecked.length === this.recipeSteps.length && this.recipeSteps.length > 0) {
      this.triggerConfetti();
      window.chefNova.playSuccessFanfare();
      window.chefNova.speak("Congratulations, Chef! You completed this entire recipe! Enjoy your delicious meal!");
    }
  }

  startVoiceStepGuidance() {
    this.currentStepIndex = 0;
    this.readCurrentStep();
  }

  readCurrentStep() {
    if (!this.recipeSteps.length) return;
    const stepText = this.recipeSteps[this.currentStepIndex];
    document.querySelectorAll('.step-card').forEach((c, i) => {
      c.style.borderColor = i === this.currentStepIndex ? 'var(--primary)' : 'var(--border-light)';
    });
    window.chefNova.speak(`Step ${this.currentStepIndex + 1}: ${stepText}`);
  }

  nextStep() {
    if (this.currentStepIndex < this.recipeSteps.length - 1) {
      this.currentStepIndex++;
      this.readCurrentStep();
    } else {
      window.chefNova.speak("You have reached the final cooking step! Ready to serve!");
    }
  }

  prevStep() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.readCurrentStep();
    }
  }

  repeatStep() {
    this.readCurrentStep();
  }

  readIngredients() {
    if (!this.activeRecipe || !this.activeRecipe.ingredientsList) return;
    const list = this.activeRecipe.ingredientsList.map(i => `${i.measure} of ${i.name}`).join(', ');
    window.chefNova.speak(`Here are the ingredients you need: ${list}.`);
  }

  triggerConfetti() {
    // Elegant lightweight canvas confetti
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#15803d', '#22c55e', '#f59e0b', '#fbbf24', '#3b82f6', '#ec4899'];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.7) * 16,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 10
      });
    }

    let frames = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25; // gravity
        p.rotation += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      frames++;
      if (frames < 120) {
        requestAnimationFrame(animate);
      } else {
        canvas.remove();
      }
    };
    animate();
  }

  renderDailyPlanner() {
    const day = window.dailyMealPlanner.activeDay;
    const plan = window.dailyMealPlanner.getDayPlan(day);
    const totals = window.dailyMealPlanner.calculateTotals(day);

    // Update day tabs
    const dayTabsContainer = document.getElementById('day-tabs-container');
    if (dayTabsContainer) {
      dayTabsContainer.innerHTML = window.dailyMealPlanner.days.map(d => `
        <button class="day-tab ${d === day ? 'active' : ''}" onclick="window.appController.switchPlannerDay('${d}')">
          ${d}
        </button>
      `).join('');
    }

    // Update slots
    const slots = ['breakfast', 'lunch', 'dinner', 'snack'];
    slots.forEach(slot => {
      const container = document.getElementById(`planner-slot-${slot}`);
      if (!container) return;
      const meal = plan[slot];
      if (meal) {
        container.innerHTML = `
          <div class="meal-item">
            <img src="${meal.img}" alt="${meal.name}">
            <div class="meal-item-details">
              <b>${meal.name}</b>
              <span>⏱ ${meal.time} · 🔥 ${meal.cal} kcal</span>
            </div>
          </div>
        `;
      }
    });

    // Update macro bar
    const calEl = document.getElementById('macro-total-cal');
    const pEl = document.getElementById('macro-total-p');
    const cEl = document.getElementById('macro-total-c');
    const fEl = document.getElementById('macro-total-f');

    if (calEl) calEl.textContent = totals.calories;
    if (pEl) pEl.textContent = totals.protein + 'g';
    if (cEl) cEl.textContent = totals.carbs + 'g';
    if (fEl) fEl.textContent = totals.fat + 'g';

    // Grocery list
    const groceryList = window.dailyMealPlanner.getDailyGroceryList(day);
    const groceryContainer = document.getElementById('daily-grocery-items');
    if (groceryContainer) {
      groceryContainer.innerHTML = groceryList.map(item => `
        <li style="display:flex;align-items:center;gap:8px;font-size:0.85rem;padding:4px 0;">
          <input type="checkbox" style="accent-color:var(--primary);">
          <span>${item}</span>
        </li>
      `).join('');
    }
  }

  switchPlannerDay(day) {
    window.dailyMealPlanner.activeDay = day;
    this.renderDailyPlanner();
  }

  setupCanvasVisualizer() {
    const canvas = document.getElementById('voice-visualizer-canvas');
    if (canvas) {
      window.chefNova.setupCanvas(canvas);
    }
  }

  setupMLStudio() {
    const chartCanvas = document.getElementById('ml-training-chart');
    const startTrainBtn = document.getElementById('start-ml-training-btn');
    const classSelect = document.getElementById('ml-train-class-select');
    const epochsSlider = document.getElementById('ml-epochs-slider');
    const epochsVal = document.getElementById('ml-epochs-val');

    if (epochsSlider && epochsVal) {
      epochsSlider.addEventListener('input', () => {
        epochsVal.textContent = epochsSlider.value;
      });
    }

    if (startTrainBtn && chartCanvas) {
      startTrainBtn.addEventListener('click', () => {
        const selectedClass = classSelect ? classSelect.value : 'pizza';
        const epochs = epochsSlider ? parseInt(epochsSlider.value, 10) : 30;

        startTrainBtn.disabled = true;
        startTrainBtn.textContent = '⏳ Training Neural Weights…';

        const ctx = chartCanvas.getContext('2d');

        window.chefVisionML.trainModel(selectedClass, epochs, 0.05, (data, epoch, total) => {
          // Draw live training loss & accuracy
          this.drawMLChart(ctx, chartCanvas.width, chartCanvas.height, window.chefVisionML.trainingHistory, total);
        }).then((result) => {
          startTrainBtn.disabled = false;
          startTrainBtn.textContent = '⚡ Train Model Again';
          this.showToast(`Neural Model fine-tuned! Accuracy: ${result.finalAccuracy}%`);
          window.chefNova.speak(`Training complete for ${selectedClass}! Validation accuracy reached ${result.finalAccuracy}%. Custom weights are saved.`);
        });
      });
    }
  }

  drawMLChart(ctx, w, h, history, totalEpochs) {
    ctx.clearRect(0, 0, w, h);

    // Background grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let y = 30; y < h - 20; y += 40) {
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(w - 20, y);
      ctx.stroke();
    }

    if (history.length < 2) return;

    // Plot Loss (Red)
    ctx.beginPath();
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2.5;
    history.forEach((d, i) => {
      const x = 40 + (i / totalEpochs) * (w - 70);
      const y = (h - 30) - (d.loss / 1.5) * (h - 60);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Plot Accuracy (Green)
    ctx.beginPath();
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2.5;
    history.forEach((d, i) => {
      const x = 40 + (i / totalEpochs) * (w - 70);
      const y = (h - 30) - ((d.accuracy - 0.4) / 0.6) * (h - 60);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Latest status text
    const last = history[history.length - 1];
    ctx.fillStyle = '#15803d';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(`Epoch ${last.epoch}/${totalEpochs} | Loss: ${last.loss} | Acc: ${last.accuracy}%`, 45, 20);
  }

  checkUserAuth() {
    window.authManager.updateHeaderProfile();
  }

  showToast(msg) {
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '30px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = '#15803d';
    toast.style.color = '#fff';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '30px';
    toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
    toast.style.fontSize = '0.9rem';
    toast.style.fontWeight = '600';
    toast.style.zIndex = '9999';
    toast.style.animation = 'slideUp 0.3s ease';
    toast.textContent = msg;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 3200);
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  window.appController = new AppController();
});

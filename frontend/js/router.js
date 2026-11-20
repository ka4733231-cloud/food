/**
 * NutriBite AI - Client Router & View Orchestrator
 * Seamlessly manages navigation across all 15 application pages.
 */

window.NutriBiteRouter = {
  currentView: "dashboard",
  currentParams: {},

  init() {
    window.addEventListener("hashchange", () => this.handleHashChange());
    this.handleHashChange();
  },

  handleHashChange() {
    const hash = window.location.hash.slice(1) || "dashboard";
    const parts = hash.split("?");
    const viewName = parts[0];
    const params = {};

    if (parts[1]) {
      new URLSearchParams(parts[1]).forEach((val, key) => {
        params[key] = val;
      });
    }

    this.navigate(viewName, params, false);
  },

  navigate(viewName, params = {}, updateHash = true) {
    this.currentView = viewName;
    this.currentParams = params;

    if (updateHash) {
      const queryString = new URLSearchParams(params).toString();
      window.location.hash = queryString ? `${viewName}?${queryString}` : viewName;
    }

    // Update active states in sidebar & mobile nav
    document.querySelectorAll("[data-nav]").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.nav === viewName);
    });

    const mainContainer = document.getElementById("app-view-container");
    if (!mainContainer) return;

    // Render target view
    switch (viewName) {
      case "landing":
        mainContainer.innerHTML = this.renderLandingPage();
        break;
      case "auth":
        mainContainer.innerHTML = this.renderAuthPage();
        break;
      case "onboarding":
        mainContainer.innerHTML = this.renderOnboardingPage();
        break;
      case "dashboard":
        mainContainer.innerHTML = this.renderDashboard();
        break;
      case "scanner":
        mainContainer.innerHTML = this.renderFoodScanner();
        break;
      case "nutrition-results":
        mainContainer.innerHTML = this.renderNutritionResults(params.foodId || "biryani", params.grams || 300);
        break;
      case "recipes":
        mainContainer.innerHTML = this.renderRecipeDiscovery(params.category || "All", params.cuisine || "All", params.q || "");
        break;
      case "recipe-details":
        mainContainer.innerHTML = this.renderRecipeDetails(Number(params.id) || 1, Number(params.servings) || 4);
        break;
      case "planner":
        mainContainer.innerHTML = this.renderMealPlanner();
        break;
      case "groceries":
        mainContainer.innerHTML = this.renderGroceryList();
        break;
      case "analytics":
        mainContainer.innerHTML = this.renderNutritionAnalytics(params.metric || "calories");
        break;
      case "diary":
        mainContainer.innerHTML = this.renderFoodDiary(params.filter || "All");
        break;
      case "assistant":
        mainContainer.innerHTML = this.renderNutritionAssistant();
        break;
      case "profile":
        mainContainer.innerHTML = this.renderUserProfile();
        break;
      case "settings":
        mainContainer.innerHTML = this.renderSettings();
        break;
      case "pricing":
        mainContainer.innerHTML = this.renderPricingPage(params.billing || "annual");
        break;
      case "subscription":
        mainContainer.innerHTML = this.renderSubscriptionManagement();
        break;
      case "billing-history":
        mainContainer.innerHTML = this.renderBillingHistory();
        break;
      case "admin":
        mainContainer.innerHTML = this.renderAdminDashboard();
        break;
      default:
        mainContainer.innerHTML = this.renderDashboard();
    }

    // Scroll main viewport to top after navigation
    const mainViewport = document.getElementById('app-view-container');
    if (mainViewport) {
      mainViewport.scrollTop = 0;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  refreshCurrentView() {
    this.navigate(this.currentView, this.currentParams, false);
  },

  // ==========================================
  // VIEW RENDERERS (ALL 15 VIEWS)
  // ==========================================

  // 1. LANDING PAGE
  renderLandingPage() {
    return `
      <div class="page-view" style="max-width:1120px;margin:0 auto;animation:fadeIn 0.4s ease-out;">
        <div style="text-align:center;padding:48px 0 36px;">
          <div style="display:inline-flex;gap:8px;align-items:center;background:var(--bg-subtle);padding:6px 16px;border-radius:999px;font-size:0.8rem;font-weight:700;color:var(--primary);margin-bottom:18px;">
            <span>🌿 Chef Quality Meets Nutrition Science</span> · <span>MOB × Calz</span>
          </div>
          <h1 class="editorial-title" style="font-size:3.4rem;line-height:1.15;margin-bottom:18px;">
            Eat with intelligence.<br><em>Cook with confidence.</em>
          </h1>
          <p style="font-size:1.15rem;color:var(--text-muted);max-width:680px;margin:0 auto 32px;line-height:1.65;">
            The complete food companion blending recipe discovery from world and Pakistani kitchens, AI food recognition, and verified USDA nutrition tracking.
          </p>
          <div style="display:flex;justify-content:center;gap:14px;flex-wrap:wrap;">
            <button class="btn btn-primary" style="padding:15px 32px;font-size:1rem;" onclick="NutriBiteRouter.navigate('scanner')">
              📷 Scan a Meal with AI <span>↗</span>
            </button>
            <button class="btn btn-secondary" style="padding:15px 28px;font-size:1rem;" onclick="NutriBiteRouter.navigate('recipes')">
              📖 Explore Recipes
            </button>
            <button class="btn btn-accent" style="padding:15px 28px;font-size:1rem;" onclick="NutriBiteRouter.navigate('dashboard')">
              📊 Open Dashboard
            </button>
            <button class="btn btn-secondary" style="padding:15px 24px;font-size:1rem;" onclick="NutriBiteRouter.navigate('auth')">
              🔑 Sign In / Sign Up
            </button>
            <button class="btn btn-secondary" style="padding:15px 24px;font-size:1rem;" onclick="NutriBiteRouter.navigate('onboarding')">
              🚀 Personalize Goals
            </button>
          </div>
        </div>

        <!-- Hero Graphic Banner -->
        <div style="border-radius:var(--radius-xl);overflow:hidden;box-shadow:var(--shadow-lg);margin-bottom:48px;position:relative;height:400px;">
          <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1400&q=80" alt="Culinary spread" style="width:100%;height:100%;object-fit:cover;">
          <div style="position:absolute;inset:0;background:linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(35,75,53,0.9) 100%);display:flex;align-items:flex-end;padding:40px;color:#fff;">
            <div>
              <span style="font-size:0.8rem;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:#86efac;">AI-Powered Vision &amp; Nutrition</span>
              <h2 style="font-family:var(--font-serif);font-size:2.4rem;margin:4px 0 8px;">Bridging MOB Culinary Art &amp; Calz Nutrition Science</h2>
              <p style="font-size:0.95rem;opacity:0.9;max-width:640px;">Decoupled computer vision identification and grams portion calibration for clinical-grade macronutrient tracking.</p>
            </div>
          </div>
        </div>

        <!-- 3 Core Pillars -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(300px, 1fr));gap:24px;margin-bottom:48px;">
          <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-lg);padding:28px;box-shadow:var(--shadow-sm);">
            <span style="font-size:2.2rem;display:block;margin-bottom:12px;">📷</span>
            <h3 style="font-family:var(--font-serif);font-size:1.35rem;margin-bottom:8px;">AI Food Scanner</h3>
            <p style="font-size:0.88rem;color:var(--text-muted);line-height:1.5;margin-bottom:16px;">
              Snap photos of meals. Our model classifies food taxonomy and estimates calories, protein, carbs, and fats scaled to your portion.
            </p>
            <button class="btn btn-secondary btn-sm" onclick="NutriBiteRouter.navigate('scanner')">Try Scanner ↗</button>
          </div>

          <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-lg);padding:28px;box-shadow:var(--shadow-sm);">
            <span style="font-size:2.2rem;display:block;margin-bottom:12px;">🥘</span>
            <h3 style="font-family:var(--font-serif);font-size:1.35rem;margin-bottom:8px;">Pakistani &amp; World Recipes</h3>
            <p style="font-size:0.88rem;color:var(--text-muted);line-height:1.5;margin-bottom:16px;">
              Step-by-step 4K cooking videos, dynamic serving scalers, and authentic recipes from Karachi Biryani to Italian Tuscan Pasta.
            </p>
            <button class="btn btn-secondary btn-sm" onclick="NutriBiteRouter.navigate('recipes')">Browse Recipes ↗</button>
          </div>

          <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-lg);padding:28px;box-shadow:var(--shadow-sm);">
            <span style="font-size:2.2rem;display:block;margin-bottom:12px;">🏃‍♂️</span>
            <h3 style="font-family:var(--font-serif);font-size:1.35rem;margin-bottom:8px;">Post-Meal Burn Guidance</h3>
            <p style="font-size:0.88rem;color:var(--text-muted);line-height:1.5;margin-bottom:16px;">
              Every meal logged calculates personalized digestion walks and exercise burns for glycemic balance and metabolic health.
            </p>
            <button class="btn btn-secondary btn-sm" onclick="NutriBiteRouter.navigate('dashboard')">View Tracker ↗</button>
          </div>
        </div>
      </div>
    `;
  },

  // 2. AUTH PAGE
  renderAuthPage() {
    return `
      <div class="page-view" style="max-width:480px;margin:30px auto;text-align:center;animation:fadeIn 0.3s ease-out;">
        <span class="section-kicker">NutriBite Access Pass</span>
        <h2 class="editorial-title">Sign in to your kitchen</h2>
        <p style="font-size:0.88rem;color:var(--text-muted);margin-bottom:24px;">Manage your daily nutrition, save recipes, and organize meal plans.</p>

        <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-lg);padding:32px;box-shadow:var(--shadow-md);text-align:left;">
          <div style="display:flex;gap:6px;margin-bottom:20px;background:var(--bg-subtle);padding:4px;border-radius:8px;">
            <button class="btn" style="flex:1;background:var(--primary);color:#fff;" id="auth-tab-in" onclick="NutriBiteApp.switchAuthTab('in')">Sign In</button>
            <button class="btn" style="flex:1;color:var(--text-muted);" id="auth-tab-up" onclick="NutriBiteApp.switchAuthTab('up')">Create Account</button>
          </div>

          <form id="auth-form" onsubmit="NutriBiteApp.handleAuthSubmit(event)">
            <div id="auth-name-group" style="margin-bottom:14px;display:none;">
              <label style="display:block;font-size:0.82rem;font-weight:700;margin-bottom:6px;">Your Name</label>
              <input type="text" id="auth-name-input" placeholder="e.g. Alex Morgan" class="header-search" style="width:100%;">
            </div>
            <div style="margin-bottom:14px;">
              <label style="display:block;font-size:0.82rem;font-weight:700;margin-bottom:6px;">Email Address</label>
              <input type="email" id="auth-email-input" value="alex@nutribite.ai" class="header-search" style="width:100%;" required>
            </div>
            <div style="margin-bottom:20px;">
              <label style="display:block;font-size:0.82rem;font-weight:700;margin-bottom:6px;">Password</label>
              <input type="password" id="auth-pass-input" value="••••••••••••" class="header-search" style="width:100%;" required>
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%;padding:13px;font-size:0.95rem;" id="auth-submit-btn">
              Continue to Kitchen <span>↗</span>
            </button>
          </form>
        </div>
      </div>
    `;
  },

  // 3. ONBOARDING PAGE
  renderOnboardingPage() {
    return `
      <div class="page-view" style="max-width:680px;margin:20px auto;animation:fadeIn 0.3s ease-out;">
        <span class="section-kicker">Step 1 of 3 · Personalization</span>
        <h2 class="editorial-title">Customize your <em>NutriBite Profile</em></h2>
        <p style="font-size:0.9rem;color:var(--text-muted);margin-bottom:28px;">We tailor calories, macros, and recipe suggestions to your dietary preferences and health goals.</p>

        <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-lg);padding:32px;box-shadow:var(--shadow-sm);">
          <div style="margin-bottom:24px;">
            <label style="display:block;font-size:0.85rem;font-weight:700;margin-bottom:10px;">What is your primary wellness goal?</label>
            <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:12px;" id="ob-goals-grid">
              <button type="button" class="btn btn-secondary active" onclick="NutriBiteApp.selectOnboardingGoal('Maintain Fitness', this)">🎯 Maintain Fitness</button>
              <button type="button" class="btn btn-secondary" onclick="NutriBiteApp.selectOnboardingGoal('Fat Loss', this)">⚡ Fat Loss</button>
              <button type="button" class="btn btn-secondary" onclick="NutriBiteApp.selectOnboardingGoal('Build Muscle', this)">💪 Build Muscle</button>
            </div>
          </div>

          <div style="margin-bottom:24px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
              <label style="font-size:0.85rem;font-weight:700;">Daily Calorie Target</label>
              <b style="font-size:1.15rem;color:var(--primary);"><span id="ob-cal-val">2100</span> kcal</b>
            </div>
            <input type="range" min="1400" max="3500" step="50" value="2100" style="width:100%;accent-color:var(--primary);"
                   oninput="document.getElementById('ob-cal-val').textContent = this.value">
          </div>

          <div style="margin-bottom:28px;">
            <label style="display:block;font-size:0.85rem;font-weight:700;margin-bottom:10px;">Preferred Cuisines</label>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              <span class="diet-pill selected" onclick="this.classList.toggle('selected')">🇵🇰 Pakistani &amp; South Asian</span>
              <span class="diet-pill selected" onclick="this.classList.toggle('selected')">🇮🇹 Italian</span>
              <span class="diet-pill selected" onclick="this.classList.toggle('selected')">🥗 Mediterranean</span>
              <span class="diet-pill" onclick="this.classList.toggle('selected')">🇯🇵 Japanese</span>
              <span class="diet-pill" onclick="this.classList.toggle('selected')">🇲🇽 Mexican</span>
            </div>
          </div>

          <button class="btn btn-primary" style="width:100%;padding:14px;font-size:1rem;" onclick="NutriBiteApp.saveOnboarding()">
            Save Preferences &amp; Open Dashboard <span>↗</span>
          </button>
        </div>
      </div>
    `;
  },

  // 4. DASHBOARD
  renderDashboard() {
    const s = window.nutriBiteState;
    const totals = s.getDailyTotals();
    const recipes = window.NutriBiteData.recipes;

    return `
      <div class="page-view" style="animation:fadeIn 0.3s ease-out;">
        <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:26px;flex-wrap:wrap;gap:14px;">
          <div>
            <span class="section-kicker">Today's Nutrition Summary</span>
            <h1 class="editorial-title">Welcome back, <em>${s.user.name}</em></h1>
            <p style="font-size:0.92rem;color:var(--text-muted);">Here is your live nutrition, macro distribution, and hydration overview.</p>
          </div>
          <div style="display:flex;gap:10px;">
            <button class="btn btn-primary" onclick="NutriBiteRouter.navigate('scanner')">📷 Scan Meal</button>
            <button class="btn btn-secondary" onclick="NutriBiteRouter.navigate('diary')">🍽️ View Food Diary</button>
          </div>
        </div>

        <!-- Dashboard Nutrition Card & Energy Ring -->
        <div class="dashboard-grid">
          <div class="nutrition-banner-card">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <div>
                <span style="font-size:0.75rem;font-weight:800;color:var(--primary);text-transform:uppercase;">Daily Target &amp; Energy Budget</span>
                <h3 style="font-family:var(--font-serif);font-size:1.6rem;margin-top:2px;">Calories &amp; Macronutrients</h3>
              </div>
              <span style="font-size:1.8rem;">🌿</span>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1.4fr;gap:24px;align-items:center;margin-top:16px;">
              <div>
                ${NutriBiteComponents.renderCalorieRing(totals.caloriesConsumed, totals.caloriesTarget)}
                <div style="text-align:center;margin-top:10px;font-size:0.8rem;color:var(--text-muted);">
                  <span>Remaining: <b>${totals.caloriesRemaining} kcal</b></span> · 
                  <span>Burned: <b>${totals.stepBurn} kcal</b></span>
                </div>
              </div>

              <!-- Macros Breakdown -->
              <div class="macro-pill-row" style="margin-top:0;">
                <div class="macro-box">
                  <b style="color:#3b82f6;">${totals.proteinConsumed}g</b>
                  <span>Protein</span>
                  <div style="font-size:0.7rem;color:var(--text-light);margin-top:2px;">/ ${totals.proteinTarget}g</div>
                </div>
                <div class="macro-box">
                  <b style="color:#f59e0b;">${totals.carbsConsumed}g</b>
                  <span>Carbs</span>
                  <div style="font-size:0.7rem;color:var(--text-light);margin-top:2px;">/ ${totals.carbsTarget}g</div>
                </div>
                <div class="macro-box">
                  <b style="color:#ec4899;">${totals.fatConsumed}g</b>
                  <span>Fat</span>
                  <div style="font-size:0.7rem;color:var(--text-light);margin-top:2px;">/ ${totals.fatTarget}g</div>
                </div>
                <div class="macro-box">
                  <b style="color:#10b981;">${totals.fiberConsumed}g</b>
                  <span>Fiber</span>
                  <div style="font-size:0.7rem;color:var(--text-light);margin-top:2px;">/ ${totals.fiberTarget}g</div>
                </div>
                <div class="macro-box">
                  <b style="color:#0284c7;">${totals.waterConsumed}ml</b>
                  <span>Water</span>
                  <div style="font-size:0.7rem;color:var(--text-light);margin-top:2px;">/ ${totals.waterTarget}ml</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions & Hydration Panel -->
          <div style="display:flex;flex-direction:column;gap:18px;">
            <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-lg);padding:22px;display:flex;align-items:center;justify-content:space-between;">
              <div>
                <span style="font-size:0.72rem;font-weight:800;color:#0284c7;text-transform:uppercase;">Hydration Tracker</span>
                <h4 style="font-size:1.25rem;margin:2px 0;">${totals.waterConsumed} / ${totals.waterTarget} ml</h4>
                <div style="display:flex;gap:6px;margin-top:8px;">
                  <button class="btn btn-secondary" style="font-size:0.75rem;padding:4px 10px;" onclick="nutriBiteState.addWater(250); NutriBiteRouter.refreshCurrentView();">＋ 250ml</button>
                  <button class="btn btn-secondary" style="font-size:0.75rem;padding:4px 10px;" onclick="nutriBiteState.addWater(500); NutriBiteRouter.refreshCurrentView();">＋ Bottle</button>
                </div>
              </div>
              <span style="font-size:2.4rem;">💧</span>
            </div>

            <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-lg);padding:22px;display:flex;align-items:center;justify-content:space-between;">
              <div>
                <span style="font-size:0.72rem;font-weight:800;color:var(--primary);text-transform:uppercase;">Active Step Tracker</span>
                <h4 style="font-size:1.25rem;margin:2px 0;">${totals.steps.toLocaleString()} steps</h4>
                <span style="font-size:0.78rem;color:var(--text-muted);">Active Burn: <b>${totals.stepBurn} kcal</b></span>
                <div style="display:flex;gap:6px;margin-top:8px;">
                  <button class="btn btn-secondary" style="font-size:0.75rem;padding:4px 10px;" onclick="nutriBiteState.addSteps(1000); NutriBiteRouter.refreshCurrentView();">＋ 1k Steps</button>
                  <button class="btn btn-secondary" style="font-size:0.75rem;padding:4px 10px;" onclick="nutriBiteState.addSteps(2500); NutriBiteRouter.refreshCurrentView();">＋ 2.5k Walk</button>
                </div>
              </div>
              <span style="font-size:2.4rem;">🚶‍♂️</span>
            </div>
          </div>
        </div>

        <!-- Recommended Recipes Section -->
        <div style="margin-top:20px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;">
            <div>
              <span class="section-kicker">Recommended for You</span>
              <h3 style="font-family:var(--font-serif);font-size:1.6rem;">Chef-Crafted Culinary Discoveries</h3>
            </div>
            <button class="btn btn-secondary" onclick="NutriBiteRouter.navigate('recipes')">View All Recipes ↗</button>
          </div>

          <div class="recipe-cards-grid">
            ${recipes.slice(0, 3).map(r => NutriBiteComponents.renderRecipeCard(r)).join('')}
          </div>
        </div>
      </div>
    `;
  },

  // 5. FOOD SCANNER (AI Vision)
  renderFoodScanner() {
    return `
      <div class="page-view" style="animation:fadeIn 0.3s ease-out;">
        <span class="section-kicker">Computer Vision &amp; Food Recognition</span>
        <h1 class="editorial-title">Scan your meal with <em>AI Vision</em></h1>
        <p style="font-size:0.95rem;color:var(--text-muted);max-width:720px;margin-bottom:24px;">
          Take a photo, stream your camera, or upload an image of your meal. The neural computer vision model analyzes visual features, classifies the dish taxonomy, detects ingredients, and extracts plate bounds before looking up verified USDA nutritional facts.
        </p>

        <!-- Scanner Mode Toggle & Container -->
        <div class="scanner-container">
          <!-- Dropzone & Live Camera Box -->
          <div class="scanner-dropzone" id="scanner-dropzone-box"
               ondragover="event.preventDefault(); this.classList.add('dragover');"
               ondragleave="this.classList.remove('dragover');"
               ondrop="event.preventDefault(); this.classList.remove('dragover'); if(event.dataTransfer.files[0]) NutriBiteApp.handleScannerFile(event.dataTransfer.files[0]);">
            <div id="camera-stream-wrapper" style="display:none;width:100%;height:100%;position:relative;border-radius:var(--radius-lg);overflow:hidden;">
              <video id="scanner-webcam-feed" autoplay playsinline style="width:100%;height:100%;object-fit:cover;"></video>
              <div style="position:absolute;inset:20px;border:2px dashed #86efac;border-radius:12px;pointer-events:none;display:flex;align-items:center;justify-content:center;">
                <span style="background:rgba(0,0,0,0.6);color:#fff;padding:4px 12px;border-radius:999px;font-size:0.75rem;">Center Meal in Viewfinder</span>
              </div>
              <button type="button" class="btn btn-primary" style="position:absolute;bottom:14px;left:50%;transform:translateX(-50%);z-index:10;" onclick="NutriBiteApp.captureCamera()">
                📸 Snap Photo
              </button>
            </div>

            <div id="dropzone-default-ui" onclick="document.getElementById('scanner-file-input').click()">
              <div class="scanner-dropzone-icon">📷</div>
              <h3 style="font-size:1.25rem;margin-bottom:6px;">Snap Photo or Drop Food Image</h3>
              <span style="font-size:0.85rem;color:var(--text-muted);display:block;margin-bottom:18px;">Supports JPG, PNG, WEBP files</span>
              <div style="display:flex;gap:10px;justify-content:center;">
                <button type="button" class="btn btn-primary" style="pointer-events:none;">Select from Device</button>
                <button type="button" class="btn btn-secondary" onclick="event.stopPropagation(); NutriBiteApp.toggleCameraStream();">📹 Open Camera</button>
              </div>
              <input type="file" id="scanner-file-input" accept="image/*" style="display:none;" onchange="NutriBiteApp.handleScannerFile(this.files[0])">
            </div>
          </div>

          <!-- Preview & AI Results Box -->
          <div id="scanner-results-container" style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-lg);padding:24px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;">
            <span style="font-size:3rem;margin-bottom:12px;">🍽️</span>
            <h4 style="font-size:1.15rem;margin-bottom:4px;">No Scan Processed Yet</h4>
            <p style="font-size:0.85rem;color:var(--text-muted);max-width:320px;margin-bottom:20px;">
              Upload an image or test our neural computer vision model with verified culinary benchmarks:
            </p>
            <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">
              <button class="btn btn-secondary" style="font-size:0.78rem;" onclick="NutriBiteApp.simulateScan('biryani', 'Authentic Chicken Biryani')">🍗 Biryani</button>
              <button class="btn btn-secondary" style="font-size:0.78rem;" onclick="NutriBiteApp.simulateScan('karahi', 'Lahori Mutton Karahi')">🍲 Karahi</button>
              <button class="btn btn-secondary" style="font-size:0.78rem;" onclick="NutriBiteApp.simulateScan('pizza', 'Margherita Pizza')">🍕 Pizza</button>
              <button class="btn btn-secondary" style="font-size:0.78rem;" onclick="NutriBiteApp.simulateScan('salad', 'Garden Salad')">🥗 Salad</button>
              <button class="btn btn-secondary" style="font-size:0.78rem;" onclick="NutriBiteApp.simulateScan('daal', 'Tarka Daal')">🥣 Daal</button>
              <button class="btn btn-secondary" style="font-size:0.78rem;" onclick="NutriBiteApp.simulateScan('sushi', 'Salmon Sushi')">🍣 Sushi</button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // 6. NUTRITION RESULTS
  renderNutritionResults(foodId, grams) {
    const data = window.NutriBiteData.nutritionDatabase[foodId] || window.NutriBiteData.nutritionDatabase["biryani"];
    const currentGrams = Number(grams) || 300;
    const mult = currentGrams / 100;
    const scaled = {
      cal: Math.round(data.cal * mult),
      p: Math.round(data.p * mult * 10) / 10,
      c: Math.round(data.c * mult * 10) / 10,
      f: Math.round(data.f * mult * 10) / 10,
      fib: Math.round(data.fib * mult * 10) / 10,
      sug: Math.round(data.sug * mult * 10) / 10,
      sod: Math.round(data.sod * mult)
    };

    const lastScan = window.nutriBiteState.lastScan;
    const hasScanImage = lastScan && lastScan.imageUrl;
    const bbox = (lastScan && lastScan.boundingBox) ? lastScan.boundingBox : [0.12, 0.14, 0.88, 0.86];
    const topPct = bbox[0] * 100;
    const leftPct = bbox[1] * 100;
    const heightPct = (bbox[2] - bbox[0]) * 100;
    const widthPct = (bbox[3] - bbox[1]) * 100;

    return `
      <div class="page-view" style="max-width:1040px;margin:0 auto;animation:fadeIn 0.3s ease-out;">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
          <button class="btn btn-secondary btn-sm" onclick="NutriBiteRouter.navigate('scanner')">← Scan Another Meal</button>
          <span class="section-kicker" style="margin-bottom:0;">Step 2 · Nutrition Calibration &amp; Facts</span>
        </div>
        <h1 class="editorial-title">Verified Nutrition for <em>${data.name}</em></h1>

        <!-- AI Neural Detection Banner if Scanned -->
        ${hasScanImage ? `
          <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-lg);padding:20px;margin:18px 0 28px;box-shadow:var(--shadow-sm);display:grid;grid-template-columns:300px 1fr;gap:24px;align-items:center;">
            <div style="position:relative;border-radius:12px;overflow:hidden;background:#0f172a;max-height:190px;">
              <img src="${lastScan.imageUrl}" alt="${data.name}" style="width:100%;height:190px;object-fit:cover;display:block;">
              <div class="ai-bbox-box" style="top:${topPct}%;left:${leftPct}%;width:${widthPct}%;height:${heightPct}%;">
                <span class="ai-bbox-tag">🎯 ${data.name} (${lastScan.confidence || 95}%)</span>
              </div>
            </div>

            <div>
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                <span style="background:#e0f2fe;color:#0369a1;padding:3px 10px;border-radius:999px;font-size:0.75rem;font-weight:700;">
                  ✓ AI Vision Match (${lastScan.confidence || 95}%)
                </span>
                <span style="font-size:0.75rem;color:var(--text-muted);">${lastScan.source || 'Neural Model Inference'}</span>
              </div>
              <h3 style="font-family:var(--font-serif);font-size:1.35rem;margin-bottom:8px;">${data.name}</h3>

              <!-- Detected Ingredients -->
              <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;">
                ${(lastScan.detectedIngredients || ["Key Proteins", "Spices", "Carbohydrates"]).slice(0, 5).map(ing => `
                  <span class="ai-ingredient-pill">🌿 ${ing}</span>
                `).join('')}
              </div>

              <!-- Top Alternative Predictions -->
              ${lastScan.topCandidates && lastScan.topCandidates.length > 1 ? `
                <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                  <span style="font-size:0.75rem;color:var(--text-muted);">Switch Food Match:</span>
                  ${lastScan.topCandidates.slice(0, 4).map(c => `
                    <button type="button" class="ai-candidate-chip ${(c.food_id === foodId || c.db_key === foodId) ? 'active' : ''}"
                            onclick="NutriBiteRouter.navigate('nutrition-results', { foodId: '${c.db_key || c.food_id}', grams: ${currentGrams} })">
                      ${c.name} (${c.confidence}%)
                    </button>
                  `).join('')}
                </div>
              ` : ''}
            </div>
          </div>
        ` : ''}

        <div style="display:grid;grid-template-columns:1fr 1.15fr;gap:36px;margin-top:20px;align-items:flex-start;">
          <!-- Left: Official FDA Nutrition Facts Card -->
          <div>
            ${NutriBiteComponents.renderNutritionFactsLabel(data.name, currentGrams, scaled)}
          </div>

          <!-- Right: Interactive Portion Slider & Save -->
          <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-lg);padding:28px;box-shadow:var(--shadow-sm);">
            <span style="font-size:0.75rem;font-weight:800;color:var(--primary);text-transform:uppercase;">Calibrate Exact Serving</span>
            <h3 style="font-size:1.3rem;margin:4px 0 16px;">Specify Portion Size (Grams)</h3>

            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
              <span style="font-size:0.85rem;color:var(--text-muted);">Serving Weight:</span>
              <b style="font-size:1.25rem;color:var(--primary);" id="portion-weight-display">${currentGrams}g</b>
            </div>

            <input type="range" min="80" max="600" step="10" value="${currentGrams}" style="width:100%;accent-color:var(--primary);"
                   oninput="NutriBiteApp.updatePortionSlider('${foodId}', this.value)">

            <div style="display:flex;gap:8px;margin:14px 0 20px;">
              <button class="btn btn-secondary" style="flex:1;font-size:0.78rem;" onclick="NutriBiteApp.updatePortionSlider('${foodId}', 150)">Small (150g)</button>
              <button class="btn btn-secondary" style="flex:1;font-size:0.78rem;" onclick="NutriBiteApp.updatePortionSlider('${foodId}', 300)">Standard (300g)</button>
              <button class="btn btn-secondary" style="flex:1;font-size:0.78rem;" onclick="NutriBiteApp.updatePortionSlider('${foodId}', 450)">Large (450g)</button>
            </div>

            <!-- Post-Meal Burn Live Estimates -->
            <div style="background:var(--bg-subtle);border-radius:var(--radius-sm);padding:14px;margin-bottom:20px;">
              <span style="font-size:0.74rem;font-weight:800;text-transform:uppercase;color:var(--primary);display:block;margin-bottom:6px;">⚡ Estimated Post-Meal Burn</span>
              <div style="display:flex;justify-content:space-between;font-size:0.82rem;color:var(--text-muted);">
                <span>🚶‍♂️ Light Stroll: <b>15 min</b></span>
                <span>👟 Walk: <b id="burn-walk-time">${Math.round(scaled.cal / 5)} min</b></span>
                <span>🚴 Cycling: <b id="burn-cycle-time">${Math.round(scaled.cal / 8)} min</b></span>
              </div>
            </div>

            <div style="display:flex;gap:12px;">
              <button class="btn btn-primary" style="flex:1;padding:13px;" id="commit-food-btn"
                      onclick="NutriBiteApp.commitFoodLog('${data.name}', ${scaled.cal}, ${scaled.p}, ${scaled.c}, ${scaled.f}, ${scaled.fib}, ${currentGrams})">
                💾 Log to Food Diary <span>↗</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // 7. RECIPE DISCOVERY
  renderRecipeDiscovery(category = "All", cuisine = "All", query = "") {
    let recipes = window.NutriBiteData.recipes;
    if (category !== "All") recipes = recipes.filter(r => r.category.toLowerCase() === category.toLowerCase());
    if (cuisine !== "All") recipes = recipes.filter(r => r.cuisine.toLowerCase() === cuisine.toLowerCase());
    if (query) {
      const q = query.toLowerCase();
      recipes = recipes.filter(r => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q));
    }

    return `
      <div class="page-view" style="animation:fadeIn 0.3s ease-out;">
        <span class="section-kicker">Curated Culinary Library</span>
        <h1 class="editorial-title">Discover <em>World &amp; Pakistani Recipes</em></h1>
        <p style="font-size:0.95rem;color:var(--text-muted);margin-bottom:24px;">Explore delicious, chef-verified recipes with dynamic serving scalers and step-by-step cooking videos.</p>

        <!-- Live Search Bar -->
        <div style="margin-bottom:20px;max-width:540px;">
          <input type="text" id="recipe-search-input" value="${query}" class="header-search" style="width:100%;padding:12px 18px;"
                 placeholder="Search recipes, ingredients (e.g. mutton, pasta, biryani)..."
                 oninput="NutriBiteApp.handleRecipeLiveSearch(this.value, '${category}', '${cuisine}')">
        </div>

        <!-- Category & Cuisine Filter Tabs -->
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:24px;">
          <button class="diet-pill ${category === 'All' && cuisine === 'All' ? 'selected' : ''}" onclick="NutriBiteRouter.navigate('recipes', { category: 'All', cuisine: 'All', q: '${query}' })">All Recipes</button>
          <button class="diet-pill ${category === 'Dinner' ? 'selected' : ''}" onclick="NutriBiteRouter.navigate('recipes', { category: 'Dinner', cuisine: '${cuisine}', q: '${query}' })">Dinner</button>
          <button class="diet-pill ${category === 'Lunch' ? 'selected' : ''}" onclick="NutriBiteRouter.navigate('recipes', { category: 'Lunch', cuisine: '${cuisine}', q: '${query}' })">Lunch</button>
          <button class="diet-pill ${cuisine === 'Pakistani' ? 'selected' : ''}" onclick="NutriBiteRouter.navigate('recipes', { category: '${category}', cuisine: 'Pakistani', q: '${query}' })">🇵🇰 Pakistani Cuisine</button>
          <button class="diet-pill ${cuisine === 'International' ? 'selected' : ''}" onclick="NutriBiteRouter.navigate('recipes', { category: '${category}', cuisine: 'International', q: '${query}' })">🌍 International</button>
        </div>

        <!-- Recipe Cards Grid -->
        <div class="recipe-cards-grid">
          ${recipes.length ? recipes.map(r => NutriBiteComponents.renderRecipeCard(r)).join('') : '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted);">No matching recipes found. Try a different search term!</div>'}
        </div>
      </div>
    `;
  },

  // 8. RECIPE DETAILS (With Video Modal & Kitchen Step Timer)
  renderRecipeDetails(recipeId, servings) {
    const r = window.NutriBiteData.recipes.find(item => item.id === recipeId) || window.NutriBiteData.recipes[0];
    const currentServings = Number(servings) || r.servings;
    const ratio = currentServings / r.servings;

    return `
      <div class="page-view" style="max-width:960px;margin:0 auto;animation:fadeIn 0.3s ease-out;">
        <button class="btn btn-secondary" style="font-size:0.8rem;margin-bottom:16px;" onclick="NutriBiteRouter.navigate('recipes')">← Back to Recipes</button>

        <!-- Hero Card with Video Trigger -->
        <div style="border-radius:var(--radius-xl);overflow:hidden;box-shadow:var(--shadow-md);margin-bottom:28px;height:380px;position:relative;">
          <img src="${r.image}" alt="${r.title}" style="width:100%;height:100%;object-fit:cover;">
          <div style="position:absolute;inset:0;background:linear-gradient(180deg, rgba(0,0,0,0) 25%, rgba(20,40,30,0.88) 100%);display:flex;align-items:flex-end;padding:32px;color:#fff;">
            <div>
              <span class="cuisine-tag" style="position:static;display:inline-block;margin-bottom:8px;">${r.cuisine} · ${r.category}</span>
              <h1 style="font-family:var(--font-serif);font-size:2.4rem;line-height:1.15;margin-bottom:6px;">${r.title}</h1>
              <div style="display:flex;gap:18px;font-size:0.85rem;opacity:0.95;align-items:center;flex-wrap:wrap;">
                <span>⏱ Prep: ${r.prepTime}m</span>
                <span>🔥 Cook: ${r.cookTime}m</span>
                <span>⭐ ${r.rating} Rating</span>
                <button class="btn btn-accent btn-sm" style="margin-left:8px;" onclick="NutriBiteApp.openVideoModal('${r.title}', '${r.videoUrl}')">
                  ▶️ Watch Cooking Video
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Serving Scaler Bar -->
        <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:18px 24px;display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;flex-wrap:wrap;gap:14px;">
          <div>
            <span style="font-size:0.75rem;font-weight:800;color:var(--primary);text-transform:uppercase;">Adjust Servings (Auto-Scales Ingredients)</span>
            <div style="display:flex;align-items:center;gap:12px;margin-top:4px;">
              <button class="btn-icon" onclick="NutriBiteRouter.navigate('recipe-details', { id: ${r.id}, servings: Math.max(1, ${currentServings - 1}) })">－</button>
              <b style="font-size:1.3rem;color:var(--primary);">${currentServings} servings</b>
              <button class="btn-icon" onclick="NutriBiteRouter.navigate('recipe-details', { id: ${r.id}, servings: ${currentServings + 1} })">＋</button>
            </div>
          </div>
          <div style="display:flex;gap:10px;">
            <button class="btn btn-secondary" onclick="NutriBiteApp.addRecipeToGroceries(${r.id}, ${currentServings})">🛒 Add to Grocery List</button>
            <button class="btn btn-primary" onclick="NutriBiteApp.commitFoodLog('${r.title}', ${Math.round(r.calories * ratio)}, ${r.protein}, ${r.carbs}, ${r.fat}, ${r.fiber}, 300)">🍽️ Log Meal</button>
          </div>
        </div>

        <!-- Kitchen Step Timer Widget -->
        <div style="margin-bottom:28px;">
          ${NutriBiteComponents.renderKitchenTimer(r.cookTime || 20)}
        </div>

        <!-- Ingredients & Steps Columns -->
        <div style="display:grid;grid-template-columns:1fr 1.35fr;gap:36px;">
          <div>
            <h3 style="font-family:var(--font-serif);font-size:1.4rem;margin-bottom:14px;">Scaled Ingredients Checklist</h3>
            <ul style="list-style:none;display:flex;flex-direction:column;gap:10px;">
              ${r.ingredients.map(ing => `
                <li style="display:flex;align-items:center;justify-content:space-between;padding:10px;background:var(--bg-card);border:1px solid var(--border-color);border-radius:8px;font-size:0.88rem;">
                  <label style="display:flex;align-items:center;gap:10px;cursor:pointer;flex:1;">
                    <input type="checkbox" style="accent-color:var(--primary);cursor:pointer;" onchange="this.parentElement.style.textDecoration = this.checked ? 'line-through' : 'none';">
                    <span>${ing.name}</span>
                  </label>
                  <b style="color:var(--primary);">${Math.round(ing.amount * ratio * 10) / 10} ${ing.unit}</b>
                </li>
              `).join('')}
            </ul>
          </div>

          <div>
            <h3 style="font-family:var(--font-serif);font-size:1.4rem;margin-bottom:14px;">Step-by-Step Method</h3>
            <div style="display:flex;flex-direction:column;gap:14px;">
              ${r.instructions.map((step, idx) => `
                <div style="display:flex;gap:14px;background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-sm);padding:16px;">
                  <div style="width:28px;height:28px;border-radius:50%;background:var(--primary);color:#fff;display:grid;place-items:center;font-size:0.8rem;font-weight:800;flex-shrink:0;">${idx + 1}</div>
                  <p style="font-size:0.88rem;line-height:1.55;">${step}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // 9. SMART MEAL PLANNER
  renderMealPlanner() {
    const s = window.nutriBiteState;
    const plan = s.mealPlan;
    const days = Object.keys(plan);

    return `
      <div class="page-view" style="animation:fadeIn 0.3s ease-out;">
        <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:20px;flex-wrap:wrap;gap:14px;">
          <div>
            <span class="section-kicker">Weekly Organization</span>
            <h1 class="editorial-title">Smart <em>Meal Planner</em></h1>
            <p style="font-size:0.95rem;color:var(--text-muted);">Organize your breakfast, lunch, dinner, and snacks for Monday through Sunday.</p>
          </div>
          <button class="btn btn-primary" onclick="NutriBiteApp.handleGenerateGroceries()">
            🛒 Generate Grocery List from Plan
          </button>
        </div>

        <div class="meal-planner-grid">
          ${days.map(day => `
            <div class="planner-day-col">
              <div class="planner-day-head">
                <b style="font-size:0.95rem;color:var(--primary);">${day}</b>
              </div>
              <div class="day-slot filled" onclick="NutriBiteApp.editMealSlot('${day}', 'Breakfast')">
                <span style="font-size:0.7rem;font-weight:700;color:var(--primary);text-transform:uppercase;">Breakfast</span>
                <p style="margin-top:2px;">${plan[day].Breakfast}</p>
              </div>
              <div class="day-slot filled" onclick="NutriBiteApp.editMealSlot('${day}', 'Lunch')">
                <span style="font-size:0.7rem;font-weight:700;color:var(--primary);text-transform:uppercase;">Lunch</span>
                <p style="margin-top:2px;">${plan[day].Lunch}</p>
              </div>
              <div class="day-slot filled" onclick="NutriBiteApp.editMealSlot('${day}', 'Dinner')">
                <span style="font-size:0.7rem;font-weight:700;color:var(--primary);text-transform:uppercase;">Dinner</span>
                <p style="margin-top:2px;">${plan[day].Dinner}</p>
              </div>
              <div class="day-slot filled" onclick="NutriBiteApp.editMealSlot('${day}', 'Snack')">
                <span style="font-size:0.7rem;font-weight:700;color:var(--primary);text-transform:uppercase;">Snack</span>
                <p style="margin-top:2px;">${plan[day].Snack}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  // 10. SMART GROCERY LIST
  renderGroceryList() {
    const s = window.nutriBiteState;
    const items = s.groceryList;
    const categories = ["Vegetables", "Meat and protein", "Dairy", "Grains", "Spices", "Other groceries"];

    return `
      <div class="page-view" style="animation:fadeIn 0.3s ease-out;">
        <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:20px;flex-wrap:wrap;gap:14px;">
          <div>
            <span class="section-kicker">Ingredient Management</span>
            <h1 class="editorial-title">Smart <em>Grocery List</em></h1>
            <p style="font-size:0.95rem;color:var(--text-muted);">Categorized shopping list generated automatically from your meal plan.</p>
          </div>
          <div style="display:flex;gap:10px;">
            <button class="btn btn-secondary" onclick="window.print()">🖨️ Print List</button>
            <button class="btn btn-primary" onclick="NutriBiteApp.promptAddCustomGrocery()">＋ Add Item</button>
          </div>
        </div>

        <div class="grocery-layout">
          <div>
            ${categories.map(cat => {
              const catItems = items.filter(i => (i.category || "Other groceries").toLowerCase() === cat.toLowerCase());
              if (!catItems.length) return '';
              return `
                <div class="grocery-cat-group">
                  <h4 class="grocery-cat-title"><span>🛒</span> ${cat} (${catItems.length})</h4>
                  ${catItems.map(item => `
                    <div class="grocery-item-row ${item.checked ? 'checked' : ''}">
                      <label style="display:flex;align-items:center;gap:10px;cursor:pointer;flex:1;">
                        <input type="checkbox" ${item.checked ? 'checked' : ''} style="accent-color:var(--primary);cursor:pointer;"
                               onchange="nutriBiteState.toggleGroceryItem(${item.id}); NutriBiteRouter.refreshCurrentView();">
                        <span><b>${item.name}</b> · <small style="color:var(--text-muted);">${item.qty}</small></span>
                      </label>
                      <button class="btn-icon" style="width:28px;height:28px;font-size:0.8rem;" onclick="nutriBiteState.removeGroceryItem(${item.id}); NutriBiteRouter.refreshCurrentView();">✕</button>
                    </div>
                  `).join('')}
                </div>
              `;
            }).join('')}
          </div>

          <!-- Summary Side Card -->
          <div>
            <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-lg);padding:24px;box-shadow:var(--shadow-sm);">
              <h4 style="font-family:var(--font-serif);font-size:1.3rem;margin-bottom:12px;">Market Run Progress</h4>
              <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:16px;">
                Checked off: <b>${items.filter(i => i.checked).length} of ${items.length} ingredients</b>
              </p>
              <div style="height:8px;background:var(--bg-subtle);border-radius:4px;overflow:hidden;margin-bottom:20px;">
                <div style="height:100%;width:${items.length ? (items.filter(i => i.checked).length / items.length) * 100 : 0}%;background:var(--primary);"></div>
              </div>
              <button class="btn btn-secondary" style="width:100%;font-size:0.82rem;margin-bottom:10px;" onclick="NutriBiteApp.handleGenerateGroceries()">Re-sync with Weekly Plan</button>
              <button class="btn btn-secondary" style="width:100%;font-size:0.82rem;" onclick="NutriBiteApp.clearCompletedGroceries()">Clear Completed Items</button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // 11. NUTRITION ANALYTICS
  renderNutritionAnalytics(metric = "calories") {
    const weeklyData = {
      calories: [
        { label: "Mon", value: 1980 },
        { label: "Tue", value: 2150 },
        { label: "Wed", value: 2040 },
        { label: "Thu", value: 1890 },
        { label: "Fri", value: 2280 },
        { label: "Sat", value: 2100 },
        { label: "Sun", value: 1950 }
      ],
      protein: [
        { label: "Mon", value: 125 },
        { label: "Tue", value: 140 },
        { label: "Wed", value: 130 },
        { label: "Thu", value: 118 },
        { label: "Fri", value: 152 },
        { label: "Sat", value: 138 },
        { label: "Sun", value: 120 }
      ],
      carbs: [
        { label: "Mon", value: 210 },
        { label: "Tue", value: 240 },
        { label: "Wed", value: 215 },
        { label: "Thu", value: 195 },
        { label: "Fri", value: 260 },
        { label: "Sat", value: 230 },
        { label: "Sun", value: 200 }
      ],
      fat: [
        { label: "Mon", value: 65 },
        { label: "Tue", value: 72 },
        { label: "Wed", value: 68 },
        { label: "Thu", value: 60 },
        { label: "Fri", value: 78 },
        { label: "Sat", value: 70 },
        { label: "Sun", value: 64 }
      ],
      water: [
        { label: "Mon", value: 2200 },
        { label: "Tue", value: 2500 },
        { label: "Wed", value: 2400 },
        { label: "Thu", value: 2100 },
        { label: "Fri", value: 2700 },
        { label: "Sat", value: 2500 },
        { label: "Sun", value: 2300 }
      ]
    };

    const currentPoints = weeklyData[metric] || weeklyData.calories;
    const colors = {
      calories: "#234B35",
      protein: "#3b82f6",
      carbs: "#f59e0b",
      fat: "#ec4899",
      water: "#0284c7"
    };

    return `
      <div class="page-view" style="animation:fadeIn 0.3s ease-out;">
        <span class="section-kicker">Longitudinal Health Trends</span>
        <h1 class="editorial-title">Nutrition <em>Analytics &amp; History</em></h1>
        <p style="font-size:0.95rem;color:var(--text-muted);margin-bottom:20px;">Visualize your weekly and monthly intake across calories, protein, carbohydrates, fat, and hydration.</p>

        <!-- Metric Switcher Pills -->
        <div style="display:flex;gap:8px;margin-bottom:24px;flex-wrap:wrap;">
          <button class="diet-pill ${metric === 'calories' ? 'selected' : ''}" onclick="NutriBiteRouter.navigate('analytics', { metric: 'calories' })">🔥 Calories (kcal)</button>
          <button class="diet-pill ${metric === 'protein' ? 'selected' : ''}" onclick="NutriBiteRouter.navigate('analytics', { metric: 'protein' })">💪 Protein (g)</button>
          <button class="diet-pill ${metric === 'carbs' ? 'selected' : ''}" onclick="NutriBiteRouter.navigate('analytics', { metric: 'carbs' })">🍞 Carbs (g)</button>
          <button class="diet-pill ${metric === 'fat' ? 'selected' : ''}" onclick="NutriBiteRouter.navigate('analytics', { metric: 'fat' })">🥑 Fat (g)</button>
          <button class="diet-pill ${metric === 'water' ? 'selected' : ''}" onclick="NutriBiteRouter.navigate('analytics', { metric: 'water' })">💧 Water (ml)</button>
        </div>

        <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-lg);padding:30px;box-shadow:var(--shadow-sm);margin-bottom:24px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;flex-wrap:wrap;gap:12px;">
            <h3 style="font-family:var(--font-serif);font-size:1.45rem;text-transform:capitalize;">Weekly ${metric} Trend</h3>
            <span style="font-size:0.82rem;font-weight:700;color:var(--primary);">Weekly Adherence: 94%</span>
          </div>

          ${NutriBiteComponents.renderAnalyticsChart(currentPoints, metric, colors[metric] || "#234B35")}
        </div>
      </div>
    `;
  },

  // 12. FOOD DIARY
  renderFoodDiary(filter = "All") {
    let diary = window.nutriBiteState.foodDiary;
    if (filter !== "All") {
      diary = diary.filter(item => (item.mealType || "").toLowerCase() === filter.toLowerCase());
    }

    return `
      <div class="page-view" style="max-width:880px;margin:0 auto;animation:fadeIn 0.3s ease-out;">
        <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:20px;flex-wrap:wrap;gap:12px;">
          <div>
            <span class="section-kicker">Chronological Timeline</span>
            <h1 class="editorial-title">Daily <em>Food Diary</em></h1>
            <p style="font-size:0.95rem;color:var(--text-muted);">All meals logged today with verified calorie and macronutrient records.</p>
          </div>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-secondary" onclick="NutriBiteApp.promptQuickAddFood()">＋ Quick Add</button>
            <button class="btn btn-primary" onclick="NutriBiteRouter.navigate('scanner')">📷 Scan Meal</button>
          </div>
        </div>

        <!-- Filter tabs -->
        <div style="display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap;">
          <button class="diet-pill ${filter === 'All' ? 'selected' : ''}" onclick="NutriBiteRouter.navigate('diary', { filter: 'All' })">All Meals</button>
          <button class="diet-pill ${filter === 'Breakfast' ? 'selected' : ''}" onclick="NutriBiteRouter.navigate('diary', { filter: 'Breakfast' })">Breakfast</button>
          <button class="diet-pill ${filter === 'Lunch' ? 'selected' : ''}" onclick="NutriBiteRouter.navigate('diary', { filter: 'Lunch' })">Lunch</button>
          <button class="diet-pill ${filter === 'Dinner' ? 'selected' : ''}" onclick="NutriBiteRouter.navigate('diary', { filter: 'Dinner' })">Dinner</button>
          <button class="diet-pill ${filter === 'Snack' ? 'selected' : ''}" onclick="NutriBiteRouter.navigate('diary', { filter: 'Snack' })">Snacks</button>
        </div>

        <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-lg);padding:24px;box-shadow:var(--shadow-sm);">
          ${diary.length ? diary.map(item => `
            <div style="display:flex;align-items:center;justify-content:space-between;padding:14px;border-bottom:1px solid var(--border-color);gap:14px;flex-wrap:wrap;">
              <div style="display:flex;align-items:center;gap:14px;">
                <img src="${item.image}" alt="${item.name}" style="width:52px;height:52px;border-radius:10px;object-fit:cover;">
                <div>
                  <b style="font-size:1rem;color:var(--text-charcoal);">${item.name}</b>
                  <span style="font-size:0.75rem;color:var(--text-muted);display:block;">${item.mealType} · ${item.time} · ${item.portionGrams}g</span>
                </div>
              </div>
              <div style="display:flex;align-items:center;gap:16px;">
                <div style="text-align:right;">
                  <b style="font-size:1.1rem;color:var(--primary);">${item.calories} kcal</b>
                  <div style="font-size:0.74rem;color:var(--text-muted);">P:${item.protein}g · C:${item.carbs}g · F:${item.fat}g</div>
                </div>
                <button class="btn-icon" style="width:32px;height:32px;font-size:0.85rem;" onclick="nutriBiteState.removeFoodLog('${item.id}'); NutriBiteRouter.refreshCurrentView();">✕</button>
              </div>
            </div>
          `).join('') : '<div style="text-align:center;padding:40px;color:var(--text-muted);">No meals logged yet today. Use the AI Food Scanner to log your first meal!</div>'}
        </div>
      </div>
    `;
  },

  // 13. AI NUTRITION ASSISTANT
  renderNutritionAssistant() {
    const messages = window.nutriBiteState.chatMessages;

    return `
      <div class="page-view" style="max-width:880px;margin:0 auto;animation:fadeIn 0.3s ease-out;">
        <span class="section-kicker">Conversational Food Intelligence</span>
        <h1 class="editorial-title">Chef Nova <em>Nutrition Assistant</em></h1>

        <!-- Prompt suggestions -->
        <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
          <button class="diet-pill" onclick="NutriBiteApp.sendPredefinedChat('What are the calories in a serving of Chicken Biryani?')">🍗 Biryani Calories</button>
          <button class="diet-pill" onclick="NutriBiteApp.sendPredefinedChat('How can I make Pakistani Karahi healthier with less oil?')">🍲 Healthy Karahi</button>
          <button class="diet-pill" onclick="NutriBiteApp.sendPredefinedChat('Suggest a 500 kcal high-protein dinner.')">⚡ 500 kcal Dinner</button>
          <button class="diet-pill" onclick="NutriBiteApp.sendPredefinedChat('What are healthy substitutes for ghee in South Asian curries?')">🧈 Ghee Swaps</button>
        </div>

        <div class="assistant-chat-panel">
          <div class="chat-history-box" id="assistant-chat-history">
            ${messages.map(m => `
              <div class="chat-bubble ${m.sender}">
                ${m.text}
              </div>
            `).join('')}
          </div>

          <div class="chat-input-bar">
            <input type="text" id="assistant-user-input" class="header-search" style="flex:1;width:auto;"
                   placeholder="Ask about calories, ingredient substitutions, or Pakistani recipes..."
                   onkeydown="if(event.key==='Enter') NutriBiteApp.handleAssistantSend()">
            <button class="btn btn-primary" onclick="NutriBiteApp.handleAssistantSend()">Send ↗</button>
          </div>
        </div>
      </div>
    `;
  },

  // 14. USER PROFILE
  renderUserProfile() {
    const u = window.nutriBiteState.user;

    return `
      <div class="page-view" style="max-width:760px;margin:0 auto;animation:fadeIn 0.3s ease-out;">
        <span class="section-kicker">Account &amp; Biometrics</span>
        <h1 class="editorial-title">Chef <em>${u.name}</em></h1>

        <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-lg);padding:30px;box-shadow:var(--shadow-sm);margin-top:20px;">
          <div style="display:flex;align-items:center;gap:18px;margin-bottom:24px;">
            <div class="user-avatar-badge" style="width:68px;height:68px;font-size:2.4rem;">${u.avatar}</div>
            <div>
              <h3 style="font-size:1.4rem;">${u.name}</h3>
              <span style="font-size:0.85rem;color:var(--text-muted);">${u.email}</span>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;border-top:1px solid var(--border-color);padding-top:20px;">
            <div>
              <span style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;font-weight:700;">Health Goal</span>
              <p style="font-size:1.1rem;font-weight:700;color:var(--primary);margin-top:2px;">${u.goal}</p>
            </div>
            <div>
              <span style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;font-weight:700;">Daily Calorie Target</span>
              <p style="font-size:1.1rem;font-weight:700;color:var(--primary);margin-top:2px;">${u.calorieTarget} kcal</p>
            </div>
            <div>
              <span style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;font-weight:700;">Macro Split</span>
              <p style="font-size:0.95rem;color:var(--text-charcoal);margin-top:2px;">Protein: 140g · Carbs: 220g · Fat: 65g</p>
            </div>
            <div>
              <span style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;font-weight:700;">Hydration Goal</span>
              <p style="font-size:0.95rem;color:var(--text-charcoal);margin-top:2px;">2,500 ml daily</p>
            </div>
          </div>

          <button class="btn btn-secondary" style="margin-top:24px;" onclick="NutriBiteApp.promptEditProfile()">Edit Profile Biometrics</button>
        </div>
      </div>
    `;
  },

  // 15. SETTINGS
  renderSettings() {
    return `
      <div class="page-view" style="max-width:760px;margin:0 auto;animation:fadeIn 0.3s ease-out;">
        <span class="section-kicker">Preferences &amp; System</span>
        <h1 class="editorial-title">Platform <em>Settings</em></h1>

        <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-lg);padding:28px;box-shadow:var(--shadow-sm);margin-top:20px;">
          <div style="display:flex;justify-content:space-between;align-items:center;padding:14px 0;border-bottom:1px solid var(--border-color);">
            <div>
              <b>Dark Mode Theme</b>
              <span style="font-size:0.78rem;color:var(--text-muted);display:block;">Toggle between Warm Cream and Deep Forest dark palette</span>
            </div>
            <button class="btn btn-secondary" onclick="document.body.classList.toggle('dark-mode')">Toggle 🌙</button>
          </div>

          <div style="display:flex;justify-content:space-between;align-items:center;padding:14px 0;border-bottom:1px solid var(--border-color);">
            <div>
              <b>PostgreSQL &amp; FastAPI Backend</b>
              <span style="font-size:0.78rem;color:var(--text-muted);display:block;">PostgreSQL connection at http://localhost:8000</span>
            </div>
            <span class="diet-pill" id="db-status-pill">Checking...</span>
          </div>

          <div style="display:flex;justify-content:space-between;align-items:center;padding:14px 0;border-bottom:1px solid var(--border-color);">
            <div>
              <b>Data Management</b>
              <span style="font-size:0.78rem;color:var(--text-muted);display:block;">Export your complete food logs and nutrition history</span>
            </div>
            <button class="btn btn-secondary" onclick="NutriBiteApp.exportData()">Export JSON 📥</button>
          </div>

          <div style="display:flex;justify-content:space-between;align-items:center;padding:14px 0;">
            <div>
              <b>Reset Application Data</b>
              <span style="font-size:0.78rem;color:var(--text-muted);display:block;">Restore sample recipes, clear today's food diary and counters</span>
            </div>
            <button class="btn btn-secondary" style="color:#ef4444;" onclick="NutriBiteApp.resetData()">Reset Data</button>
          </div>
        </div>
      </div>
    `;
  },

  // 18. PRICING & SUBSCRIPTION (Part 4, Part 5 & Part 18 Master Prompt)
  renderPricingPage(billingPeriod = "annual") {
    const state = window.nutriBiteState;
    const plans = state.subscriptionPlans;
    const currentTier = state.subscription.tier;
    const isAnnual = billingPeriod === "annual";

    return `
      <div class="page-view" style="max-width:1120px;margin:0 auto;animation:fadeIn 0.35s ease-out;">
        <div style="text-align:center;max-width:680px;margin:0 auto 28px;">
          <span class="section-kicker">FREEMIUM COMMERCE &amp; PLANS</span>
          <h1 class="editorial-title" style="margin-bottom:12px;">Simple, Transparent <em>Pricing</em></h1>
          <p style="font-size:1.02rem;color:var(--text-muted);margin:0;">
            Eat smarter, understand nutrition, and build lifelong healthy culinary habits with the right plan for your goals.
          </p>

          <!-- Billing Toggle -->
          <div style="display:inline-flex;align-items:center;background:var(--bg-card);border:1px solid var(--border-color);padding:4px;border-radius:999px;margin-top:24px;box-shadow:var(--shadow-sm);">
            <button class="btn btn-sm ${!isAnnual ? 'btn-primary' : 'btn-secondary'}"
                    style="border-radius:999px;border:none;padding:6px 18px;font-weight:700;"
                    onclick="NutriBiteRouter.navigate('pricing', { billing: 'monthly' })">
              Monthly Billing
            </button>
            <button class="btn btn-sm ${isAnnual ? 'btn-primary' : 'btn-secondary'}"
                    style="border-radius:999px;border:none;padding:6px 18px;font-weight:700;display:flex;align-items:center;gap:6px;"
                    onclick="NutriBiteRouter.navigate('pricing', { billing: 'annual' })">
              <span>Annual Billing</span>
              <span style="background:#ecfdf5;color:#047857;font-size:0.72rem;font-weight:800;padding:2px 8px;border-radius:999px;">SAVE 33%</span>
            </button>
          </div>
        </div>

        <!-- 3-Tier Pricing Cards Grid -->
        <div class="pricing-grid">
          ${Object.values(plans).map(plan => NutriBiteComponents.renderPricingCard(plan, isAnnual, currentTier)).join('')}
        </div>

        <!-- Comprehensive Feature Comparison Table -->
        <div class="pricing-table-container">
          <div style="padding:20px 24px;border-bottom:1px solid var(--border-color);background:var(--bg-card);">
            <h3 style="margin:0;font-family:var(--font-serif);font-size:1.3rem;">Detailed Feature Comparison</h3>
            <span style="font-size:0.82rem;color:var(--text-muted);">See what is unlocked across each NutriBite AI subscription tier</span>
          </div>
          <table class="pricing-table">
            <thead>
              <tr>
                <th style="width:40%;">Capability &amp; Service</th>
                <th style="width:20%;text-align:center;">Free Forever</th>
                <th style="width:20%;text-align:center;">NutriBite Plus</th>
                <th style="width:20%;text-align:center;">NutriBite Pro</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><b>Daily Food Diary &amp; Manual Calorie Tracking</b></td>
                <td style="text-align:center;color:#16a34a;font-weight:700;">✓ Unlimited</td>
                <td style="text-align:center;color:#16a34a;font-weight:700;">✓ Unlimited</td>
                <td style="text-align:center;color:#16a34a;font-weight:700;">✓ Unlimited</td>
              </tr>
              <tr>
                <td><b>AI Vision Food Scans</b></td>
                <td style="text-align:center;">5 scans / day</td>
                <td style="text-align:center;font-weight:700;color:var(--primary);">50 scans / day</td>
                <td style="text-align:center;font-weight:700;color:#92400e;">150 scans / day</td>
              </tr>
              <tr>
                <td><b>Chef Nova AI Nutrition Assistant</b></td>
                <td style="text-align:center;">5 messages / day</td>
                <td style="text-align:center;font-weight:700;color:var(--primary);">50 messages / day</td>
                <td style="text-align:center;font-weight:700;color:#92400e;">150 messages / day</td>
              </tr>
              <tr>
                <td><b>Verified Recipe Library &amp; Cook Mode</b></td>
                <td style="text-align:center;color:#16a34a;font-weight:700;">✓ Full Access</td>
                <td style="text-align:center;color:#16a34a;font-weight:700;">✓ Full Access</td>
                <td style="text-align:center;color:#16a34a;font-weight:700;">✓ Full Access</td>
              </tr>
              <tr>
                <td><b>Weekly 7-Day Meal Planner</b></td>
                <td style="text-align:center;color:var(--text-muted);">Sample Plan Only</td>
                <td style="text-align:center;color:#16a34a;font-weight:700;">✓ Full Weekly Customizer</td>
                <td style="text-align:center;color:#16a34a;font-weight:700;">✓ Full Weekly Customizer</td>
              </tr>
              <tr>
                <td><b>Smart Grocery Shopping List</b></td>
                <td style="text-align:center;">1 Active List</td>
                <td style="text-align:center;color:#16a34a;font-weight:700;">✓ Multi-List Auto-Merge</td>
                <td style="text-align:center;color:#16a34a;font-weight:700;">✓ Multi-List Auto-Merge</td>
              </tr>
              <tr>
                <td><b>Historical Macro Trend Analytics</b></td>
                <td style="text-align:center;color:var(--text-muted);">7-Day Summary</td>
                <td style="text-align:center;color:#16a34a;font-weight:700;">✓ 90-Day Trend History</td>
                <td style="text-align:center;color:#16a34a;font-weight:700;">✓ Unlimited History</td>
              </tr>
              <tr>
                <td><b>Multi-Food Saliency &amp; Detection</b></td>
                <td style="text-align:center;color:var(--text-muted);">&mdash;</td>
                <td style="text-align:center;color:var(--text-muted);">&mdash;</td>
                <td style="text-align:center;color:#16a34a;font-weight:700;">✓ YOLO / Saliency</td>
              </tr>
              <tr>
                <td><b>Exportable PDF Reports &amp; CSV Data</b></td>
                <td style="text-align:center;color:var(--text-muted);">&mdash;</td>
                <td style="text-align:center;color:var(--text-muted);">&mdash;</td>
                <td style="text-align:center;color:#16a34a;font-weight:700;">✓ Full PDF &amp; CSV Export</td>
              </tr>
              <tr>
                <td><b>Apple App Store &amp; Google Play Billing</b></td>
                <td style="text-align:center;color:#16a34a;font-weight:700;">✓ Universal Sync</td>
                <td style="text-align:center;color:#16a34a;font-weight:700;">✓ Universal Sync</td>
                <td style="text-align:center;color:#16a34a;font-weight:700;">✓ Universal Sync</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Frequently Asked Questions -->
        <div style="margin-top:48px;background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-lg);padding:32px;">
          <h3 style="font-family:var(--font-serif);font-size:1.4rem;margin:0 0 20px;">Frequently Asked Questions</h3>
          
          <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:24px;">
            <div>
              <b style="color:var(--primary);display:block;margin-bottom:6px;">Can I switch or cancel my plan at any time?</b>
              <p style="font-size:0.85rem;color:var(--text-muted);margin:0;line-height:1.5;">
                Yes! There are zero long-term commitments or lock-ins. You can upgrade, downgrade, or cancel auto-renewal in one click directly from your Subscription Management screen.
              </p>
            </div>

            <div>
              <b style="color:var(--primary);display:block;margin-bottom:6px;">Is the Free Forever plan really free?</b>
              <p style="font-size:0.85rem;color:var(--text-muted);margin:0;line-height:1.5;">
                Absolutely. Free users get unlimited manual food logging, 5 AI vision food scans every day, full verified recipe discovery, and basic grocery list management with no credit card required.
              </p>
            </div>

            <div>
              <b style="color:var(--primary);display:block;margin-bottom:6px;">How does NutriBite AI calculate food calories?</b>
              <p style="font-size:0.85rem;color:var(--text-muted);margin:0;line-height:1.5;">
                We never fabricate numbers. Our computer vision identifies food items, and nutritional calculations are retrieved directly from verified USDA FoodData Central and regional nutritional benchmarks calibrated by user grams.
              </p>
            </div>

            <div>
              <b style="color:var(--primary);display:block;margin-bottom:6px;">Are subscriptions synced across mobile and web?</b>
              <p style="font-size:0.85rem;color:var(--text-muted);margin:0;line-height:1.5;">
                Yes. Through our unified backend, your subscription purchased via Stripe on web or RevenueCat / Apple App Store / Google Play on mobile automatically syncs across all your devices.
              </p>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // 19. SUBSCRIPTION MANAGEMENT (Part 4 & Part 19 Master Prompt)
  renderSubscriptionManagement() {
    const state = window.nutriBiteState;
    const sub = state.subscription;
    const plans = state.subscriptionPlans;
    const currentPlan = plans[sub.tier] || plans.free;
    const usage = state.dailyUsage;

    return `
      <div class="page-view" style="max-width:880px;margin:0 auto;animation:fadeIn 0.3s ease-out;">
        <span class="section-kicker">Account &amp; Membership</span>
        <h1 class="editorial-title">Subscription <em>Management</em></h1>

        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(340px, 1fr));gap:24px;margin-top:24px;">
          
          <!-- Active Plan Card -->
          <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-lg);padding:28px;box-shadow:var(--shadow-sm);display:flex;flex-direction:column;">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;">
              <div>
                <span style="font-size:0.75rem;font-weight:800;text-transform:uppercase;color:var(--text-muted);letter-spacing:0.8px;">Active Membership</span>
                <h2 style="font-family:var(--font-serif);font-size:1.8rem;margin:4px 0 0;color:var(--text-charcoal);">${currentPlan.name}</h2>
              </div>
              ${NutriBiteComponents.renderSubscriptionBadge(sub.tier)}
            </div>

            <p style="font-size:0.85rem;color:var(--text-muted);margin:0 0 20px;">
              ${currentPlan.tagline}
            </p>

            <div style="background:var(--bg-subtle);border-radius:var(--radius-md);padding:14px;margin-bottom:20px;font-size:0.82rem;">
              <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                <span style="color:var(--text-muted);">Billing Interval:</span>
                <b>${sub.billingPeriod.toUpperCase()}</b>
              </div>
              <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                <span style="color:var(--text-muted);">Status:</span>
                <b style="color:${sub.cancelAtPeriodEnd ? '#ef4444' : '#16a34a'};">
                  ${sub.cancelAtPeriodEnd ? 'Cancels at Period End' : 'Active (Auto-Renewing)'}
                </b>
              </div>
              <div style="display:flex;justify-content:space-between;">
                <span style="color:var(--text-muted);">Next Billing Date:</span>
                <b>${sub.expiresAt}</b>
              </div>
            </div>

            <div style="display:flex;flex-direction:column;gap:10px;margin-top:auto;">
              <button class="btn btn-primary" style="justify-content:center;width:100%;" onclick="NutriBiteRouter.navigate('pricing')">
                Change or Upgrade Plan ↗
              </button>
              
              ${sub.tier !== 'free' ? (
                sub.cancelAtPeriodEnd ? `
                  <button class="btn btn-secondary" style="justify-content:center;width:100%;color:#16a34a;font-weight:700;" onclick="NutriBiteApp.handleReactivateSubscription()">
                    Reactivate Auto-Renewal ↻
                  </button>
                ` : `
                  <button class="btn btn-secondary" style="justify-content:center;width:100%;color:#ef4444;" onclick="NutriBiteApp.handleCancelSubscription()">
                    Cancel Auto-Renewal
                  </button>
                `
              ) : ''}

              <button class="btn btn-secondary" style="justify-content:center;width:100%;font-size:0.8rem;" onclick="NutriBiteApp.handleRestorePurchases()">
                Restore Mobile Purchases 🔄
              </button>
            </div>
          </div>

          <!-- Daily Quotas & Usage Card -->
          <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-lg);padding:28px;box-shadow:var(--shadow-sm);display:flex;flex-direction:column;">
            <span style="font-size:0.75rem;font-weight:800;text-transform:uppercase;color:var(--text-muted);letter-spacing:0.8px;">Today's Fair Usage</span>
            <h2 style="font-family:var(--font-serif);font-size:1.8rem;margin:4px 0 16px;color:var(--text-charcoal);">Daily Quotas</h2>

            ${NutriBiteComponents.renderQuotaProgressBar("AI Food Vision Scans", usage.scansUsed, currentPlan.limits.dailyScans)}
            ${NutriBiteComponents.renderQuotaProgressBar("Chef Nova AI Chat Messages", usage.messagesUsed, currentPlan.limits.dailyMessages)}

            <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:var(--radius-md);padding:14px;margin-top:16px;font-size:0.80rem;color:#166534;">
              💡 <b>Fair Quota Policy:</b> Daily vision scans and chat messages reset every day at midnight. Unused quotas do not roll over.
            </div>

            <!-- Payment Method Card -->
            <div style="margin-top:auto;padding-top:20px;border-top:1px solid var(--border-color);">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <div>
                  <span style="font-size:0.75rem;color:var(--text-muted);display:block;">Payment Method</span>
                  <span style="font-weight:700;font-size:0.88rem;">💳 Stripe (•••• 4242)</span>
                </div>
                <button class="btn btn-secondary btn-sm" onclick="NutriBiteRouter.navigate('billing-history')">
                  Invoices 🧾
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    `;
  },

  // 20. BILLING HISTORY (Part 4 & Part 20 Master Prompt)
  renderBillingHistory() {
    const state = window.nutriBiteState;
    const history = state.billingHistory;
    const sub = state.subscription;

    return `
      <div class="page-view" style="max-width:960px;margin:0 auto;animation:fadeIn 0.3s ease-out;">
        <span class="section-kicker">Invoices &amp; Receipts</span>
        <h1 class="editorial-title">Billing <em>History</em></h1>

        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:16px;margin:24px 0;">
          <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:20px;">
            <span style="font-size:0.75rem;color:var(--text-muted);display:block;margin-bottom:4px;">Current Plan</span>
            <span style="font-size:1.3rem;font-weight:800;color:var(--primary);text-transform:uppercase;">${sub.tier}</span>
          </div>
          <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:20px;">
            <span style="font-size:0.75rem;color:var(--text-muted);display:block;margin-bottom:4px;">Billing Cadence</span>
            <span style="font-size:1.3rem;font-weight:800;color:var(--text-charcoal);text-transform:capitalize;">${sub.billingPeriod}</span>
          </div>
          <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:20px;">
            <span style="font-size:0.75rem;color:var(--text-muted);display:block;margin-bottom:4px;">Next Invoice Date</span>
            <span style="font-size:1.3rem;font-weight:800;color:var(--text-charcoal);">${sub.expiresAt}</span>
          </div>
        </div>

        <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-lg);overflow:hidden;box-shadow:var(--shadow-sm);">
          <div style="padding:20px 24px;border-bottom:1px solid var(--border-color);">
            <h3 style="margin:0;font-family:var(--font-serif);font-size:1.2rem;">Receipts &amp; Transactions</h3>
          </div>

          <table class="pricing-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Provider</th>
                <th>Status</th>
                <th style="text-align:right;">Receipt</th>
              </tr>
            </thead>
            <tbody>
              ${history.map(inv => `
                <tr>
                  <td><b>${inv.id}</b></td>
                  <td>${inv.date}</td>
                  <td>${inv.plan}</td>
                  <td><b>$${Number(inv.amount).toFixed(2)}</b></td>
                  <td style="color:var(--text-muted);font-size:0.8rem;">${inv.provider}</td>
                  <td><span class="diet-pill" style="background:#ecfdf5;color:#047857;">${inv.status}</span></td>
                  <td style="text-align:right;">
                    <button class="btn btn-secondary btn-sm" onclick="NutriBiteApp.downloadInvoicePdf('${inv.id}')">
                      PDF 📥
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  // 21. ADMIN CONSOLE & CONFIGURATION
  renderAdminDashboard() {
    const state = window.nutriBiteState;
    const plans = state.subscriptionPlans;

    return `
      <div class="page-view" style="max-width:1040px;margin:0 auto;animation:fadeIn 0.3s ease-out;">
        <span class="section-kicker">Platform Control Plane</span>
        <h1 class="editorial-title">SaaS Admin <em>Console</em></h1>

        <!-- SaaS KPI Overview Cards -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:16px;margin:24px 0;">
          <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:20px;">
            <span style="font-size:0.75rem;color:var(--text-muted);display:block;margin-bottom:4px;">Monthly Recurring Revenue (MRR)</span>
            <span style="font-size:1.8rem;font-weight:900;color:var(--primary);">$18,450</span>
            <span style="font-size:0.72rem;color:#16a34a;display:block;margin-top:4px;">▲ +14.2% vs last month</span>
          </div>

          <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:20px;">
            <span style="font-size:0.75rem;color:var(--text-muted);display:block;margin-bottom:4px;">Annual Run Rate (ARR)</span>
            <span style="font-size:1.8rem;font-weight:900;color:var(--text-charcoal);">$221,400</span>
            <span style="font-size:0.72rem;color:var(--text-muted);display:block;margin-top:4px;">Projected 2026/2027</span>
          </div>

          <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:20px;">
            <span style="font-size:0.75rem;color:var(--text-muted);display:block;margin-bottom:4px;">Paid Subscribers</span>
            <span style="font-size:1.8rem;font-weight:900;color:var(--text-charcoal);">2,410</span>
            <span style="font-size:0.72rem;color:var(--text-muted);display:block;margin-top:4px;">Plus: 1,820 | Pro: 590</span>
          </div>

          <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:20px;">
            <span style="font-size:0.75rem;color:var(--text-muted);display:block;margin-bottom:4px;">Freemium Conversion</span>
            <span style="font-size:1.8rem;font-weight:900;color:#047857;">4.8%</span>
            <span style="font-size:0.72rem;color:#16a34a;display:block;margin-top:4px;">Industry benchmark: 3.2%</span>
          </div>
        </div>

        <!-- Dynamic Subscription Plan Pricing & Limit Editor -->
        <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-lg);padding:28px;box-shadow:var(--shadow-sm);margin-bottom:30px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;border-bottom:1px solid var(--border-color);padding-bottom:14px;">
            <div>
              <h3 style="margin:0;font-family:var(--font-serif);font-size:1.3rem;">Subscription Plan Pricing &amp; Limit Editor</h3>
              <span style="font-size:0.80rem;color:var(--text-muted);">Dynamically configure prices, scan limits, and assistant quotas</span>
            </div>
            <button class="btn btn-primary" onclick="NutriBiteApp.saveAdminPlanConfig()">Save Plan Changes 💾</button>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:24px;">
            <!-- Plus Plan Config -->
            <div style="background:var(--bg-subtle);border-radius:var(--radius-md);padding:18px;">
              <h4 style="margin:0 0 12px;color:var(--primary);">NutriBite Plus Configuration</h4>
              <div style="display:flex;flex-direction:column;gap:10px;font-size:0.82rem;">
                <label>
                  Monthly Price ($):
                  <input type="number" step="0.01" id="admin-plus-monthly" value="${plans.plus.monthlyPrice}" class="form-input" style="width:100%;margin-top:4px;" />
                </label>
                <label>
                  Annual Price ($):
                  <input type="number" step="0.01" id="admin-plus-annual" value="${plans.plus.annualPrice}" class="form-input" style="width:100%;margin-top:4px;" />
                </label>
                <label>
                  Daily Vision Scans:
                  <input type="number" id="admin-plus-scans" value="${plans.plus.limits.dailyScans}" class="form-input" style="width:100%;margin-top:4px;" />
                </label>
                <label>
                  Daily AI Messages:
                  <input type="number" id="admin-plus-messages" value="${plans.plus.limits.dailyMessages}" class="form-input" style="width:100%;margin-top:4px;" />
                </label>
              </div>
            </div>

            <!-- Pro Plan Config -->
            <div style="background:var(--bg-subtle);border-radius:var(--radius-md);padding:18px;">
              <h4 style="margin:0 0 12px;color:#92400e;">NutriBite Pro Configuration</h4>
              <div style="display:flex;flex-direction:column;gap:10px;font-size:0.82rem;">
                <label>
                  Monthly Price ($):
                  <input type="number" step="0.01" id="admin-pro-monthly" value="${plans.pro.monthlyPrice}" class="form-input" style="width:100%;margin-top:4px;" />
                </label>
                <label>
                  Annual Price ($):
                  <input type="number" step="0.01" id="admin-pro-annual" value="${plans.pro.annualPrice}" class="form-input" style="width:100%;margin-top:4px;" />
                </label>
                <label>
                  Daily Vision Scans:
                  <input type="number" id="admin-pro-scans" value="${plans.pro.limits.dailyScans}" class="form-input" style="width:100%;margin-top:4px;" />
                </label>
                <label>
                  Daily AI Messages:
                  <input type="number" id="admin-pro-messages" value="${plans.pro.limits.dailyMessages}" class="form-input" style="width:100%;margin-top:4px;" />
                </label>
              </div>
            </div>

            <!-- Free Plan Limits -->
            <div style="background:var(--bg-subtle);border-radius:var(--radius-md);padding:18px;">
              <h4 style="margin:0 0 12px;color:var(--text-charcoal);">Free Plan Quotas</h4>
              <div style="display:flex;flex-direction:column;gap:10px;font-size:0.82rem;">
                <label>
                  Daily Vision Scans:
                  <input type="number" id="admin-free-scans" value="${plans.free.limits.dailyScans}" class="form-input" style="width:100%;margin-top:4px;" />
                </label>
                <label>
                  Daily AI Messages:
                  <input type="number" id="admin-free-messages" value="${plans.free.limits.dailyMessages}" class="form-input" style="width:100%;margin-top:4px;" />
                </label>
                <div style="margin-top:14px;color:var(--text-muted);font-size:0.75rem;line-height:1.4;">
                  Note: The free tier remains $0.00 forever and cannot be charged.
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Infrastructure & Ecosystem Status -->
        <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-lg);padding:24px;box-shadow:var(--shadow-sm);">
          <h3 style="margin:0 0 16px;font-family:var(--font-serif);font-size:1.2rem;">Infrastructure &amp; Service Health</h3>
          <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:14px;font-size:0.82rem;">
            <div style="background:var(--bg-subtle);padding:14px;border-radius:var(--radius-md);">
              <span style="color:var(--text-muted);display:block;">FastAPI Backend</span>
              <b style="color:#16a34a;">● Connected (Port 8000)</b>
            </div>
            <div style="background:var(--bg-subtle);padding:14px;border-radius:var(--radius-md);">
              <span style="color:var(--text-muted);display:block;">PostgreSQL Storage</span>
              <b style="color:#16a34a;">● Healthy (Active Pool)</b>
            </div>
            <div style="background:var(--bg-subtle);padding:14px;border-radius:var(--radius-md);">
              <span style="color:var(--text-muted);display:block;">PyTorch Food-101 Model</span>
              <b style="color:#16a34a;">● Operational (EfficientNet)</b>
            </div>
            <div style="background:var(--bg-subtle);padding:14px;border-radius:var(--radius-md);">
              <span style="color:var(--text-muted);display:block;">USDA FoodData Central</span>
              <b style="color:#16a34a;">● 99.8% API Availability</b>
            </div>
          </div>
        </div>

      </div>
    `;
  }
};

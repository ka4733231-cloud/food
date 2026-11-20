/**
 * NutriBite AI - Reusable UI Components
 * Renders SVG Nutrition Rings, FDA Nutrition Labels, Recipe Cards,
 * Cooking Timers, Video Modals, and Analytics Charts.
 */

window.NutriBiteComponents = {
  /**
   * Renders Circular Calorie Energy Ring
   */
  renderCalorieRing(consumed, target) {
    const pct = Math.min(100, Math.round((consumed / target) * 100)) || 0;
    const radius = 64;
    const circ = 2 * Math.PI * radius;
    const strokeDash = circ - (pct / 100) * circ;

    return `
      <div style="position:relative;width:160px;height:160px;margin:0 auto;display:grid;place-items:center;">
        <svg width="160" height="160" style="transform:rotate(-90deg);">
          <circle cx="80" cy="80" r="${radius}" stroke="var(--bg-subtle)" stroke-width="12" fill="none" />
          <circle cx="80" cy="80" r="${radius}" stroke="var(--primary)" stroke-width="12" fill="none"
                  stroke-dasharray="${circ}" stroke-dashoffset="${strokeDash}" stroke-linecap="round"
                  style="transition:stroke-dashoffset 0.8s ease;" />
        </svg>
        <div style="position:absolute;text-align:center;">
          <b style="font-size:1.8rem;color:var(--primary);line-height:1;display:block;">${consumed}</b>
          <span style="font-size:0.75rem;color:var(--text-muted);font-weight:700;">/ ${target} kcal</span>
        </div>
      </div>
    `;
  },

  /**
   * Official FDA/USDA Format Nutrition Facts Panel
   */
  renderNutritionFactsLabel(foodName, portionGrams, n) {
    const cal = Math.round(n.calories || n.cal || 0);
    const p = Math.round((n.protein || n.p || 0) * 10) / 10;
    const c = Math.round((n.carbohydrates || n.carbs || n.c || 0) * 10) / 10;
    const f = Math.round((n.total_fat || n.fat || n.f || 0) * 10) / 10;
    const fib = Math.round((n.fiber || n.fib || 0) * 10) / 10;
    const sug = Math.round((n.sugar || n.sug || 0) * 10) / 10;
    const sod = Math.round(n.sodium_mg || n.sodium || n.sod || 0);

    return `
      <div class="nutrition-facts-card" id="fda-facts-card">
        <div class="nf-title">Nutrition Facts</div>
        <div class="nf-serving">
          <span>Serving Size</span>
          <b id="nf-serving-text">${portionGrams}g (${foodName})</b>
        </div>
        <div class="nf-calories-row">
          <div>
            <span style="font-size:0.75rem;font-weight:700;display:block;">Amount per serving</span>
            <b style="font-size:1.1rem;">Calories</b>
          </div>
          <div class="nf-calories-val" id="nf-cal-val">${cal}</div>
        </div>
        <div style="text-align:right;font-size:0.75rem;font-weight:700;padding:2px 0;border-bottom:1px solid #000;">% Daily Value*</div>
        
        <div class="nf-nutrient-row">
          <span><b>Total Fat</b> <span id="nf-fat-val">${f}</span>g</span>
          <b id="nf-fat-pct">${Math.round((f / 78) * 100)}%</b>
        </div>
        <div class="nf-nutrient-row">
          <span><b>Sodium</b> <span id="nf-sod-val">${sod}</span>mg</span>
          <b id="nf-sod-pct">${Math.round((sod / 2300) * 100)}%</b>
        </div>
        <div class="nf-nutrient-row">
          <span><b>Total Carbohydrate</b> <span id="nf-carbs-val">${c}</span>g</span>
          <b id="nf-carbs-pct">${Math.round((c / 275) * 100)}%</b>
        </div>
        <div class="nf-nutrient-row indent">
          <span>Dietary Fiber <span id="nf-fib-val">${fib}</span>g</span>
          <b id="nf-fib-pct">${Math.round((fib / 28) * 100)}%</b>
        </div>
        <div class="nf-nutrient-row indent">
          <span>Total Sugars <span id="nf-sug-val">${sug}</span>g</span>
          <span></span>
        </div>
        <div class="nf-nutrient-row thick">
          <span><b>Protein</b> <span id="nf-protein-val">${p}</span>g</span>
          <b id="nf-protein-pct">${Math.round((p / 50) * 100)}%</b>
        </div>
        <div style="font-size:0.65rem;line-height:1.3;padding-top:6px;color:#475569;">
          * The % Daily Value tells you how much a nutrient in a serving of food contributes to a daily diet of 2,000 calories.
        </div>
      </div>
    `;
  },

  /**
   * Renders Recipe Card with Servings, Prep Time, and Cuisine Tags
   */
  renderRecipeCard(r) {
    const isFav = window.nutriBiteState.favorites.includes(r.id);
    return `
      <article class="recipe-card" onclick="window.NutriBiteRouter.navigate('recipe-details', { id: ${r.id} })">
        <div class="recipe-card-img">
          <img src="${r.image}" alt="${r.title}" loading="lazy">
          <span class="cuisine-tag">${r.cuisine}</span>
          <span class="calorie-tag">🔥 ${r.calories} kcal</span>
        </div>
        <div class="recipe-card-body">
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.78rem;color:var(--text-light);margin-bottom:6px;">
            <span style="font-weight:700;color:var(--primary);">${r.category}</span>
            <span>⏱ ${r.prepTime + r.cookTime} mins · ⭐ ${r.rating}</span>
          </div>
          <h3 class="recipe-card-title">${r.title}</h3>
          <p style="font-size:0.82rem;color:var(--text-muted);line-height:1.4;margin-bottom:14px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">
            ${r.description}
          </p>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:auto;padding-top:12px;border-top:1px solid var(--border-color);">
            <div style="font-size:0.76rem;color:var(--text-muted);">
              <span>P: <b>${r.protein}g</b></span> · <span>C: <b>${r.carbs}g</b></span> · <span>F: <b>${r.fat}g</b></span>
            </div>
            <button class="btn-icon" title="Save Favorite" onclick="event.stopPropagation(); window.nutriBiteState.toggleFavorite(${r.id}); window.NutriBiteRouter.refreshCurrentView();">
              ${isFav ? '❤️' : '🤍'}
            </button>
          </div>
        </div>
      </article>
    `;
  },

  /**
   * Interactive Kitchen Step Timer
   */
  renderKitchenTimer(minutes = 15) {
    return `
      <div class="kitchen-timer-widget" style="background:var(--bg-subtle);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:16px 20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
        <div style="display:flex;align-items:center;gap:12px;">
          <span style="font-size:1.8rem;">⏱️</span>
          <div>
            <b style="font-size:0.85rem;color:var(--primary);display:block;text-transform:uppercase;">Kitchen Step Timer</b>
            <span id="timer-display" style="font-family:monospace;font-size:1.4rem;font-weight:800;color:var(--text-charcoal);">${minutes}:00</span>
          </div>
        </div>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-primary btn-sm" id="timer-start-btn" onclick="NutriBiteApp.startKitchenTimer(${minutes})">Start</button>
          <button class="btn btn-secondary btn-sm" onclick="NutriBiteApp.pauseKitchenTimer()">Pause</button>
          <button class="btn btn-secondary btn-sm" onclick="NutriBiteApp.resetKitchenTimer(${minutes})">Reset</button>
        </div>
      </div>
    `;
  },

  /**
   * Recharts-Quality Interactive SVG Multi-Metric Analytics Chart
   */
  renderAnalyticsChart(points, metricName = "Calories", color = "#234B35") {
    const values = points.map(p => p.value);
    const maxVal = Math.max(...values, 10);
    const minVal = 0;
    const w = 680;
    const h = 240;
    const paddingLeft = 50;
    const paddingRight = 30;
    const paddingTop = 25;
    const paddingBottom = 40;
    const chartW = w - paddingLeft - paddingRight;
    const chartH = h - paddingTop - paddingBottom;

    const barW = Math.max(24, Math.floor(chartW / points.length) - 16);

    const bars = points.map((p, idx) => {
      const x = paddingLeft + idx * (chartW / points.length) + (chartW / points.length - barW) / 2;
      const barH = (p.value / maxVal) * chartH;
      const y = paddingTop + (chartH - barH);
      return { x, y, barH, label: p.label, val: p.value };
    });

    return `
      <div style="width:100%;overflow-x:auto;">
        <svg viewBox="0 0 ${w} ${h}" style="width:100%;max-width:${w}px;height:auto;display:block;">
          <!-- Horizontal Grid Lines -->
          <line x1="${paddingLeft}" y1="${paddingTop + chartH}" x2="${w - paddingRight}" y2="${paddingTop + chartH}" stroke="var(--border-color)" stroke-width="1" />
          <line x1="${paddingLeft}" y1="${paddingTop + chartH / 2}" x2="${w - paddingRight}" y2="${paddingTop + chartH / 2}" stroke="var(--border-color)" stroke-width="1" stroke-dasharray="4" />
          <line x1="${paddingLeft}" y1="${paddingTop}" x2="${w - paddingRight}" y2="${paddingTop}" stroke="var(--border-color)" stroke-width="1" stroke-dasharray="4" />

          <!-- Y-Axis Labels -->
          <text x="${paddingLeft - 10}" y="${paddingTop + chartH}" fill="var(--text-light)" font-size="11" font-weight="600" text-anchor="end">${minVal}</text>
          <text x="${paddingLeft - 10}" y="${paddingTop + chartH / 2 + 4}" fill="var(--text-light)" font-size="11" font-weight="600" text-anchor="end">${Math.round(maxVal / 2)}</text>
          <text x="${paddingLeft - 10}" y="${paddingTop + 4}" fill="var(--text-light)" font-size="11" font-weight="600" text-anchor="end">${maxVal}</text>

          <!-- SVG Bars with Rounded Tops -->
          ${bars.map(b => `
            <g class="chart-bar-group">
              <rect x="${b.x}" y="${b.y}" width="${barW}" height="${b.barH}" rx="6" fill="${color}" opacity="0.88" style="transition:all 0.3s ease;">
                <title>${b.label}: ${b.val} ${metricName}</title>
              </rect>
              <text x="${b.x + barW / 2}" y="${b.y - 6}" fill="var(--text-charcoal)" font-size="11" font-weight="700" text-anchor="middle">${b.val}</text>
              <text x="${b.x + barW / 2}" y="${paddingTop + chartH + 20}" fill="var(--text-muted)" font-size="11" font-weight="600" text-anchor="middle">${b.label}</text>
            </g>
          `).join('')}
        </svg>
      </div>
    `;
  },

  /**
   * Renders Subscription Tier Badge
   */
  renderSubscriptionBadge(tier = "free") {
    const t = (tier || "free").toLowerCase();
    if (t === "pro") {
      return `<span class="plan-pill pro">★ PRO</span>`;
    }
    if (t === "plus") {
      return `<span class="plan-pill plus">✦ PLUS</span>`;
    }
    return `<span class="plan-pill free">FREE</span>`;
  },

  /**
   * Renders Daily Quota Progress Bar
   */
  renderQuotaProgressBar(label, used, max) {
    const pct = Math.min(100, Math.round((used / max) * 100));
    const isNearLimit = pct >= 80;
    const barColor = isNearLimit ? "var(--accent-orange)" : "var(--primary)";

    return `
      <div style="margin-bottom: 14px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 6px; font-size: 0.82rem;">
          <span style="font-weight: 700; color: var(--text-charcoal);">${label}</span>
          <span style="color: var(--text-muted); font-size: 0.78rem;"><b>${used}</b> / ${max} used</span>
        </div>
        <div style="height: 8px; width: 100%; background: var(--bg-subtle); border-radius: 999px; overflow: hidden;">
          <div style="height: 100%; width: ${pct}%; background: ${barColor}; border-radius: 999px; transition: width 0.5s ease;"></div>
        </div>
      </div>
    `;
  },

  /**
   * Renders Pricing Card for Pricing & Subscription View
   */
  renderPricingCard(plan, isAnnual, currentTier) {
    const isCurrent = currentTier === plan.id;
    const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
    const periodText = plan.id === "free" ? "forever" : (isAnnual ? "/year" : "/month");

    return `
      <div class="pricing-card ${plan.isPopular ? 'popular' : ''} ${isCurrent ? 'current' : ''}" style="animation: fadeIn 0.4s ease-out;">
        ${plan.isPopular ? `<div class="pricing-card-badge">MOST POPULAR</div>` : ''}
        ${isCurrent ? `<div class="pricing-card-current-tag">CURRENT PLAN</div>` : ''}

        <div style="margin-bottom: 16px;">
          <h3 style="font-family: var(--font-serif); font-size: 1.6rem; color: var(--text-charcoal); margin: 0 0 6px;">
            ${plan.name}
          </h3>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0; min-height: 38px;">
            ${plan.tagline}
          </p>
        </div>

        <div style="display: flex; align-items: baseline; gap: 4px; margin-bottom: 20px;">
          <span style="font-size: 2.5rem; font-weight: 900; color: var(--primary); line-height: 1;">
            $${price}
          </span>
          <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">
            ${periodText}
          </span>
          ${isAnnual && plan.annualSavings ? `
            <span style="background: #ecfdf5; color: #047857; font-size: 0.72rem; font-weight: 800; padding: 2px 8px; border-radius: 999px; margin-left: auto;">
              Save ${plan.annualSavings}
            </span>
          ` : ''}
        </div>

        <div style="border-top: 1px solid var(--border-color); padding-top: 18px; margin-bottom: 24px;">
          <span style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: var(--text-muted); display: block; margin-bottom: 12px;">
            Included Features
          </span>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; font-size: 0.85rem;">
            ${plan.features.map(f => `
              <li style="display: flex; align-items: flex-start; gap: 8px; color: var(--text-charcoal);">
                <span style="color: #16a34a; font-weight: 800;">✓</span>
                <span>${f}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <div style="margin-top: auto;">
          ${isCurrent ? `
            <button class="btn btn-secondary" style="width: 100%; padding: 12px; justify-content: center;" disabled>
              ✓ Active Plan
            </button>
          ` : `
            <button class="btn ${plan.isPopular ? 'btn-primary' : 'btn-secondary'}"
                    style="width: 100%; padding: 12px; justify-content: center; font-weight: 700;"
                    onclick="NutriBiteApp.handleUpgradeClick('${plan.id}', '${isAnnual ? 'annual' : 'monthly'}')">
              ${plan.id === 'free' ? 'Switch to Free' : `Upgrade to ${plan.name}`} <span>↗</span>
            </button>
          `}
        </div>
      </div>
    `;
  }
};

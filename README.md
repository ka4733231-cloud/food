# 🌿 NutriBite AI — Intelligent Food, Recipe & Nutrition Platform

NutriBite AI is a modern, production-quality culinary and nutrition intelligence platform combining the best of **MOB** (recipe discovery, meal planning, cooking instructions, smart grocery lists) and **Calz** (computer vision food scanning, USDA nutritional analysis, calorie and macronutrient tracking).

---

## 🐘 Connecting FastAPI and PostgreSQL

The backend has been configured with production-grade PostgreSQL support, including **connection pooling (`pool_size=10, max_overflow=20`)**, **pool pre-ping**, and automatic 18-table schema generation.

### 1. Configure PostgreSQL Connection String
Edit [backend/.env](file:///H:/Files/food/backend/.env) and set your `DATABASE_URL`:

```ini
# Local PostgreSQL instance (default user/password: postgres/postgres)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nutribite_db

# Or Free Cloud PostgreSQL (e.g. Supabase, Neon, Railway):
# DATABASE_URL=postgresql://postgres:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
# DATABASE_URL=postgresql://[user]:[password]@[endpoint].neon.tech/neondb?sslmode=require
```

---

### 2. Install Backend Python Dependencies
Open your terminal in `H:\Files\food\backend`:
```bash
cd H:\Files\food\backend
pip install -r requirements.txt
```
*(Includes `fastapi`, `uvicorn`, `sqlalchemy>=2.0`, `psycopg2-binary`, `asyncpg`, and `python-dotenv`)*

---

### 3. Provision PostgreSQL Tables & Seed Data
Run the automated PostgreSQL provisioning script:
```bash
python init_postgres.py
```
This utility:
- Checks if the `nutribite_db` database exists on PostgreSQL and creates it if needed.
- Creates all **18 relational tables** (Users, Recipes, Meals, GroceryLists, WaterLogs, etc.).
- Pre-seeds authentic dishes (Karachi Chicken Biryani, Lahori Mutton Karahi, Tarka Daal, Neapolitan Pizza, Tuscan Pasta).

---

### 4. Start the FastAPI Server
```bash
uvicorn app.main:app --reload --port 8000
```

---

### 5. Verify Database Connection
Once running, check your PostgreSQL connection:
- **API Status:** `http://localhost:8000/api/db/status`
- **Health Check:** `http://localhost:8000/health`
- **Interactive Swagger Docs:** `http://localhost:8000/docs`

When connected, `/api/db/status` will report:
```json
{
  "status": "connected",
  "dialect": "postgresql",
  "target": "localhost:5432/nutribite_db",
  "error": null,
  "total_tables": 18
}
```

---

## 🚀 How to Run the Frontend in VS Code

1. **Open the project in VS Code:**
   - Launch VS Code.
   - Go to `File` > `Open Folder...`
   - Select `H:\Files\food`.

2. **Launch with Live Server (Recommended):**
   - In VS Code, right-click on [frontend/index.html](file:///H:/Files/food/frontend/index.html) or [index.html](file:///H:/Files/food/index.html).
   - Select **"Open with Live Server"**.
   - Your browser will open `http://127.0.0.1:5500/frontend/index.html`.

3. **Or Open Directly in Browser:**
   - Double-click `H:\Files\food\frontend\index.html` in Windows Explorer to open it in Google Chrome, Microsoft Edge, or Firefox.

---

## 📱 15 Application Pages Included

| # | Page / Feature | Description |
|---|----------------|-------------|
| 1 | **Landing Page** | Product hero, culinary photography, and feature highlights. |
| 2 | **Sign Up / Login** | Elegant authentication interface with Sign In / Sign Up tab switching. |
| 3 | **Onboarding** | 3-step biometric setup (Goal, Calorie Target, Cuisines). |
| 4 | **Dashboard** | Dynamic SVG Calorie Ring, macro distribution (P/C/F/Fiber), water tracker, and step counter. |
| 5 | **AI Food Scanner** | Live Webcam support (`📹 Open Camera`) and image drag-and-drop. |
| 6 | **Nutrition Results** | Official FDA Nutrition Facts Label with interactive portion slider (80g–600g). |
| 7 | **Recipe Discovery** | Pakistani & International cuisines with category filters and cooking videos. |
| 8 | **Recipe Details** | Dynamic ingredient scaler, kitchen countdown timer, and embedded chef video tutorial. |
| 9 | **Meal Planner** | 7-day weekly interactive meal planning grid (Monday through Sunday). |
| 10 | **Smart Grocery List** | Auto-generated categorized shopping list (Vegetables, Meat, Dairy, Grains, Spices). |
| 11 | **Nutrition Analytics** | SVG bar visualization tracking longitudinal daily and weekly caloric and macro intake against targets. |
| 12 | **Food Diary** | Chronological timeline of logged meals with thumbnail, exact grams, calories, and macronutrient badges. |
| 13 | **AI Nutrition Assistant** | Chef Nova conversational agent for culinary ideas, ingredient substitutions, and safety guardrails. |
| 14 | **User Profile** | User avatar, biometric indicators, fitness goals, and daily calorie targets. |
| 15 | **Settings** | Theme toggle (Warm Cream & Deep Forest Dark Mode) and live PostgreSQL status. |

---

## 🎨 Design System
- **Primary:** Deep Forest Green (`#234B35`)
- **Secondary:** Sage Green (`#9CAF88`)
- **Background:** Warm Cream (`#FAF8F2`)
- **Accent:** Orange (`#F2A65A`)
- **Text:** Dark Charcoal (`#252A25`)
- **Cards:** Pure White (`#FFFFFF`)

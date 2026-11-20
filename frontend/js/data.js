/**
 * NutriBite AI - Core Seed & Reference Dataset
 * High-quality culinary assets with verified nutritional breakdowns,
 * serving scalers, and Pakistani & International cuisines.
 */

window.NutriBiteData = {
  recipes: [
    {
      id: 1,
      title: "Authentic Karachi Chicken Biryani",
      category: "Dinner",
      cuisine: "Pakistani",
      difficulty: "Medium",
      prepTime: 25,
      cookTime: 40,
      servings: 6,
      calories: 480,
      protein: 32,
      carbs: 58,
      fat: 14,
      fiber: 2.8,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80",
      videoUrl: "https://www.youtube.com/watch?v=0kH8fM6-KGE",
      description: "Aromatic basmati rice layered with spiced chicken, golden fried onions, fresh mint leaves, and a touch of saffron milk.",
      ingredients: [
        { name: "Aged Basmati Rice", amount: 500, unit: "g", category: "Grains" },
        { name: "Chicken Pieces", amount: 750, unit: "g", category: "Meat and protein" },
        { name: "Greek Yogurt", amount: 200, unit: "g", category: "Dairy" },
        { name: "Onions (Sliced)", amount: 3, unit: "medium", category: "Vegetables" },
        { name: "Ginger & Garlic Paste", amount: 2, unit: "tbsp", category: "Vegetables" },
        { name: "Pure Ghee", amount: 3, unit: "tbsp", category: "Dairy" },
        { name: "Biryani Spices (Cardamom, Cumin, Cloves)", amount: 2, unit: "tbsp", category: "Spices" }
      ],
      instructions: [
        "Rinse basmati rice thoroughly until water runs clear; soak in cold water for 30 minutes.",
        "Heat ghee in a deep pot. Fry sliced onions until crisp and golden brown; set half aside for garnish.",
        "Add ginger-garlic paste and chicken; sear on high heat for 5 minutes until sealed.",
        "Stir in yogurt, biryani spices, salt, and diced tomatoes. Simmer until chicken is cooked and oil separates.",
        "Parboil soaked rice in boiling salted water with whole spices until 70% tender (5 minutes).",
        "Layer rice over chicken gravy, top with fried onions, fresh mint, and saffron. Seal pot and steam (Dum) for 15 minutes."
      ]
    },
    {
      id: 2,
      title: "Lahori Mutton Karahi Wok",
      category: "Dinner",
      cuisine: "Pakistani",
      difficulty: "Medium",
      prepTime: 15,
      cookTime: 45,
      servings: 4,
      calories: 520,
      protein: 42,
      carbs: 10,
      fat: 34,
      fiber: 2.0,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1545247181-516773cae754?w=800&q=80",
      videoUrl: "https://www.youtube.com/watch?v=qXPhVYpQLPA",
      description: "Succulent bone-in mutton stir-fried in a cast-iron wok with ripe tomatoes, cracked black pepper, and ginger juliennes.",
      ingredients: [
        { name: "Bone-in Mutton", amount: 800, unit: "g", category: "Meat and protein" },
        { name: "Fresh Tomatoes", amount: 5, unit: "medium", category: "Vegetables" },
        { name: "Ginger (Julienned)", amount: 2, unit: "tbsp", category: "Vegetables" },
        { name: "Green Chilies", amount: 4, unit: "pieces", category: "Vegetables" },
        { name: "Crushed Black Pepper", amount: 1, unit: "tbsp", category: "Spices" },
        { name: "Desi Ghee", amount: 3, unit: "tbsp", category: "Dairy" }
      ],
      instructions: [
        "Simmer mutton with 1 cup water, salt, and garlic paste until 80% tender.",
        "Transfer mutton to a high-heat karahi wok. Add ghee and halved tomatoes face down.",
        "Cover for 5 minutes to loosen tomato skins; remove skins with tongs and mash pulp into a rich gravy.",
        "Stir-fry vigorously on high heat (Bhunai) until moisture reduces and glistening oil surfaces.",
        "Finish with coarsely crushed black pepper, julienned ginger, and fresh cilantro. Serve with tandoori roti."
      ]
    },
    {
      id: 3,
      title: "Classic Neapolitan Margherita Pizza",
      category: "Dinner",
      cuisine: "International",
      difficulty: "Easy",
      prepTime: 20,
      cookTime: 8,
      servings: 2,
      calories: 570,
      protein: 24,
      carbs: 72,
      fat: 21,
      fiber: 4.5,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
      videoUrl: "https://www.youtube.com/watch?v=1-SJGQ2HLp8",
      description: "Airy fermented artisan crust topped with crushed San Marzano tomatoes, fresh buffalo mozzarella, and sweet basil.",
      ingredients: [
        { name: "Pizza Dough Ball", amount: 250, unit: "g", category: "Grains" },
        { name: "San Marzano Tomatoes", amount: 100, unit: "g", category: "Vegetables" },
        { name: "Fresh Mozzarella", amount: 125, unit: "g", category: "Dairy" },
        { name: "Sweet Basil", amount: 8, unit: "leaves", category: "Vegetables" },
        { name: "Extra Virgin Olive Oil", amount: 1, unit: "tbsp", category: "Other groceries" }
      ],
      instructions: [
        "Preheat your oven with a pizza steel to 250°C (480°F) for 40 minutes.",
        "Gently stretch dough on a floured surface from center out, leaving a puffy rim.",
        "Spread crushed tomatoes evenly, tear mozzarella pieces across surface, and drizzle with olive oil.",
        "Bake 7-9 minutes until bubbly and blistered. Garnish with fresh basil leaves."
      ]
    },
    {
      id: 4,
      title: "Yellow Lentil Daal with Jeera Rice",
      category: "Lunch",
      cuisine: "Pakistani",
      difficulty: "Easy",
      prepTime: 10,
      cookTime: 25,
      servings: 4,
      calories: 360,
      protein: 16,
      carbs: 62,
      fat: 6,
      fiber: 9.5,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80",
      videoUrl: "https://www.youtube.com/watch?v=bJUiWdM__Qw",
      description: "Hearty yellow moong and masoor lentils tempered with sizzling cumin, garlic, and dried red chilies over fragrant rice.",
      ingredients: [
        { name: "Yellow Moong Lentils", amount: 150, unit: "g", category: "Meat and protein" },
        { name: "Red Masoor Lentils", amount: 100, unit: "g", category: "Meat and protein" },
        { name: "Basmati Rice", amount: 300, unit: "g", category: "Grains" },
        { name: "Cumin Seeds", amount: 1, unit: "tbsp", category: "Spices" },
        { name: "Garlic Cloves (Sliced)", amount: 5, unit: "cloves", category: "Vegetables" },
        { name: "Ghee for Tadka", amount: 2, unit: "tbsp", category: "Dairy" }
      ],
      instructions: [
        "Boil washed lentils with turmeric, minced garlic, and water until tender and creamy.",
        "Steam basmati rice with toasted cumin seeds and a pinch of salt.",
        "Prepare tempering (Tadka): heat ghee in a ladle, fry sliced garlic, cumin, and dried red chilies until golden.",
        "Pour sizzling tempering over the simmering lentils with a lid to trap the aroma. Serve over cumin rice."
      ]
    },
    {
      id: 5,
      title: "Tuscan Garlic Herb Chicken & Fettuccine",
      category: "Dinner",
      cuisine: "International",
      difficulty: "Easy",
      prepTime: 10,
      cookTime: 20,
      servings: 4,
      calories: 540,
      protein: 38,
      carbs: 52,
      fat: 20,
      fiber: 3.2,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80",
      videoUrl: "https://www.youtube.com/watch?v=bJUiWdM__Qw",
      description: "Pan-seared chicken fillets tossed in a velvety parmesan garlic cream with baby spinach and sun-dried tomatoes.",
      ingredients: [
        { name: "Fettuccine Pasta", amount: 300, unit: "g", category: "Grains" },
        { name: "Chicken Breast", amount: 450, unit: "g", category: "Meat and protein" },
        { name: "Heavy Cream", amount: 200, unit: "ml", category: "Dairy" },
        { name: "Parmigiano-Reggiano", amount: 60, unit: "g", category: "Dairy" },
        { name: "Baby Spinach", amount: 100, unit: "g", category: "Vegetables" }
      ],
      instructions: [
        "Boil fettuccine in salted water until al dente.",
        "Season chicken breasts, sear in olive oil until golden brown on both sides, slice into ribbons.",
        "Saute garlic in pan drippings, pour in heavy cream and simmer for 3 minutes.",
        "Melt parmesan cheese into sauce, fold in fresh spinach, and toss with warm fettuccine and chicken."
      ]
    },
    {
      id: 6,
      title: "Mediterranean Garden Salad with Feta",
      category: "Lunch",
      cuisine: "International",
      difficulty: "Easy",
      prepTime: 12,
      cookTime: 0,
      servings: 2,
      calories: 220,
      protein: 8,
      carbs: 14,
      fat: 16,
      fiber: 4.8,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80",
      videoUrl: "https://www.youtube.com/watch?v=LPEUt0vXqEw",
      description: "Crisp cucumbers, vine-ripened cherry tomatoes, Kalamata olives, and crumbly feta cheese tossed in Greek lemon-herb vinaigrette.",
      ingredients: [
        { name: "Crisp Romaine Lettuce", amount: 200, unit: "g", category: "Vegetables" },
        { name: "English Cucumber", amount: 1, unit: "whole", category: "Vegetables" },
        { name: "Cherry Tomatoes", amount: 150, unit: "g", category: "Vegetables" },
        { name: "Greek Feta Cheese", amount: 80, unit: "g", category: "Dairy" },
        { name: "Cold-Pressed Olive Oil", amount: 2, unit: "tbsp", category: "Other groceries" }
      ],
      instructions: [
        "Chop crisp romaine, slice cucumber, and halve cherry tomatoes.",
        "Toss fresh greens in a wide bowl with extra virgin olive oil, fresh lemon juice, oregano, and sea salt.",
        "Top with crumbled Greek feta cheese and pitted Kalamata olives."
      ]
    }
  ],

  // Verified Nutrition Reference Database per 100g (USDA & South Asian standards)
  nutritionDatabase: {
    // 🇵🇰 Pakistani & South Asian Dishes
    "biryani": { name: "Chicken Biryani", cal: 185, p: 11.2, c: 24.5, f: 4.8, fib: 1.2, sug: 0.8, sod: 460 },
    "chicken_biryani": { name: "Chicken Biryani", cal: 185, p: 11.2, c: 24.5, f: 4.8, fib: 1.2, sug: 0.8, sod: 460 },
    "karahi": { name: "Mutton Karahi", cal: 210, p: 18.5, c: 3.8, f: 13.5, fib: 1.1, sug: 1.4, sod: 520 },
    "mutton_karahi": { name: "Mutton Karahi", cal: 210, p: 18.5, c: 3.8, f: 13.5, fib: 1.1, sug: 1.4, sod: 520 },
    "chicken_karahi": { name: "Chicken Karahi", cal: 175, p: 19.2, c: 3.2, f: 9.5, fib: 1.0, sug: 1.2, sod: 480 },
    "nihari": { name: "Slow-Cooked Beef Nihari", cal: 225, p: 19.8, c: 6.2, f: 14.0, fib: 0.8, sug: 0.4, sod: 680 },
    "haleem": { name: "Shahi Beef & Lentil Haleem", cal: 160, p: 13.5, c: 16.8, f: 5.2, fib: 4.1, sug: 0.6, sod: 490 },
    "daal": { name: "Tarka Daal (Yellow Lentil)", cal: 115, p: 7.5, c: 17.2, f: 2.1, fib: 4.2, sug: 0.8, sod: 320 },
    "daal_chawal": { name: "Yellow Lentil Daal with Rice", cal: 142, p: 6.8, c: 23.5, f: 2.4, fib: 3.8, sug: 0.5, sod: 380 },
    "daal_makhani": { name: "Creamy Black Lentil Daal", cal: 155, p: 6.2, c: 18.0, f: 7.0, fib: 4.5, sug: 1.1, sod: 410 },
    "palak_paneer": { name: "Creamy Palak Paneer", cal: 178, p: 9.4, c: 5.2, f: 13.8, fib: 2.9, sug: 1.8, sod: 410 },
    "chapati_roti": { name: "Whole Wheat Tandoori Roti", cal: 248, p: 8.5, c: 49.0, f: 1.8, fib: 6.5, sug: 1.2, sod: 180 },
    "roti": { name: "Whole Wheat Tandoori Roti", cal: 248, p: 8.5, c: 49.0, f: 1.8, fib: 6.5, sug: 1.2, sod: 180 },
    "naan": { name: "Tandoori Naan Bread", cal: 285, p: 8.8, c: 52.0, f: 5.0, fib: 2.4, sug: 3.0, sod: 460 },
    "paratha": { name: "Crispy Layered Ghee Paratha", cal: 320, p: 6.5, c: 44.0, f: 13.5, fib: 3.8, sug: 1.5, sod: 310 },
    "seekh_kabab": { name: "Charcoal Beef Seekh Kabab", cal: 215, p: 21.0, c: 3.5, f: 13.0, fib: 1.2, sug: 0.8, sod: 520 },
    "chicken_tikka": { name: "Tandoori Chicken Tikka", cal: 165, p: 25.4, c: 2.8, f: 5.8, fib: 0.9, sug: 0.7, sod: 470 },
    "shami_kabab": { name: "Beef Shami Kabab", cal: 195, p: 16.5, c: 10.2, f: 9.8, fib: 2.5, sug: 0.6, sod: 430 },
    "aloo_gobi": { name: "Spiced Aloo Gobi", cal: 95, p: 2.8, c: 14.5, f: 3.2, fib: 3.5, sug: 2.6, sod: 310 },
    "chana_chaat": { name: "Tangy Chickpea Chana Chaat", cal: 138, p: 6.8, c: 22.4, f: 2.6, fib: 5.1, sug: 3.8, sod: 390 },
    "samosa": { name: "Crispy Spiced Potato Samosa", cal: 260, p: 4.5, c: 32.0, f: 13.0, fib: 2.8, sug: 1.8, sod: 360 },
    "lassi": { name: "Chilled Sweet Mango Lassi", cal: 88, p: 3.2, c: 15.5, f: 1.6, fib: 0.8, sug: 13.5, sod: 65 },
    "gulab_jamun": { name: "Gulab Jamun in Rose Syrup", cal: 310, p: 4.2, c: 54.0, f: 9.0, fib: 0.5, sug: 46.0, sod: 120 },

    // 🌍 International & USDA Whole Food Staples
    "pizza": { name: "Margherita Pizza", cal: 266, p: 11.4, c: 33.3, f: 9.8, fib: 2.3, sug: 3.6, sod: 598 },
    "salad": { name: "Mediterranean Garden Salad", cal: 68, p: 2.6, c: 5.4, f: 4.5, fib: 2.1, sug: 2.2, sod: 142 },
    "pasta": { name: "Tuscan Garlic Pasta", cal: 195, p: 7.2, c: 26.5, f: 6.8, fib: 1.8, sug: 1.5, sod: 320 },
    "sushi": { name: "Salmon Avocado Sushi", cal: 158, p: 6.8, c: 22.0, f: 4.6, fib: 1.9, sug: 2.1, sod: 410 },
    "chicken": { name: "Grilled Chicken Breast", cal: 165, p: 31.0, c: 0.0, f: 3.6, fib: 0.0, sug: 0.0, sod: 74 },
    "chicken_breast": { name: "Grilled Chicken Breast", cal: 165, p: 31.0, c: 0.0, f: 3.6, fib: 0.0, sug: 0.0, sod: 74 },
    "oatmeal": { name: "Warm Berry Oatmeal", cal: 71, p: 2.5, c: 12.0, f: 1.5, fib: 2.2, sug: 4.2, sod: 49 },
    "greek_yogurt": { name: "Plain Greek Yogurt (2% Fat)", cal: 73, p: 10.0, c: 4.0, f: 2.0, fib: 0.0, sug: 4.0, sod: 45 },
    "egg": { name: "Hard Boiled Egg", cal: 155, p: 12.6, c: 1.1, f: 10.6, fib: 0.0, sug: 1.1, sod: 124 },
    "avocado": { name: "Fresh Hass Avocado", cal: 160, p: 2.0, c: 8.5, f: 14.7, fib: 6.7, sug: 0.7, sod: 7 },
    "rice": { name: "Steamed Brown Rice", cal: 111, p: 2.6, c: 23.0, f: 0.9, fib: 1.8, sug: 0.4, sod: 5 },
    "salmon": { name: "Wild Atlantic Grilled Salmon", cal: 206, p: 22.1, c: 0.0, f: 12.3, fib: 0.0, sug: 0.0, sod: 60 },
    "sweet_potato": { name: "Baked Sweet Potato", cal: 90, p: 2.0, c: 20.7, f: 0.1, fib: 3.3, sug: 6.5, sod: 36 },
    "almonds": { name: "Raw Whole Almonds", cal: 579, p: 21.2, c: 21.6, f: 49.9, fib: 12.5, sug: 4.4, sod: 1 },
    "apple": { name: "Fresh Crisp Apple", cal: 52, p: 0.3, c: 13.8, f: 0.2, fib: 2.4, sug: 10.4, sod: 1 },
    "banana": { name: "Fresh Ripe Banana", cal: 89, p: 1.1, c: 22.8, f: 0.3, fib: 2.6, sug: 12.2, sod: 1 }
  }
};

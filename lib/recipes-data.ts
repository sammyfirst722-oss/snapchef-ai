export type IngredientCategory = 'Proteins' | 'Produce' | 'Dairy' | 'Pantry & Grains' | 'Spices & Sauces'

export interface Ingredient {
  item: string
  amount: string
  category: IngredientCategory
  standardKey: string
}

export interface Recipe {
  id: string
  title: string
  category: string
  prepTime: string
  cookTime: string
  servings: number
  difficulty: string
  description: string
  ingredients: Ingredient[]
  instructions: string[]
  tags: string[]
  imageUrl: string
  likes: number
}

export const INGREDIENT_CATEGORY_COLORS: Record<string, string> = {
  Proteins: 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-2 border-rose-500/50 font-bold',
  Produce: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-2 border-emerald-500/50 font-bold',
  Dairy: 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-2 border-amber-500/50 font-bold',
  'Pantry & Grains': 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-2 border-blue-500/50 font-bold',
  'Spices & Sauces': 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-2 border-purple-500/50 font-bold',
}

export const RECIPES_DATA: Recipe[] = [
  {
    "id": "rec-001",
    "title": "Garlic Butter Chicken Bites",
    "category": "15-Min Meals",
    "prepTime": "5 mins",
    "cookTime": "10 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Tender golden chicken breast cubes pan-seared in rich garlic herb butter.",
    "ingredients": [
      {
        "item": "Chicken breast (cubed)",
        "amount": "1.5 lbs",
        "category": "Proteins",
        "standardKey": "chicken"
      },
      {
        "item": "Garlic (minced)",
        "amount": "4 cloves",
        "category": "Produce",
        "standardKey": "garlic"
      },
      {
        "item": "Butter",
        "amount": "3 tbsp",
        "category": "Dairy",
        "standardKey": "butter"
      },
      {
        "item": "Olive oil",
        "amount": "1 tbsp",
        "category": "Pantry & Grains",
        "standardKey": "olive oil"
      },
      {
        "item": "Fresh parsley",
        "amount": "2 tbsp",
        "category": "Produce",
        "standardKey": "parsley"
      },
      {
        "item": "Salt & black pepper",
        "amount": "To taste",
        "category": "Spices & Sauces",
        "standardKey": "salt"
      }
    ],
    "instructions": [
      "Cut chicken into bite-sized 1-inch cubes and season with salt and pepper.",
      "Heat olive oil and 1 tbsp butter in a large skillet over medium-high heat.",
      "Sear chicken cubes for 3-4 minutes undisturbed until golden brown.",
      "Flip and cook 3 minutes. Add remaining butter and garlic; baste for 1 minute.",
      "Garnish with chopped parsley and serve hot."
    ],
    "tags": [
      "high-protein",
      "low-carb",
      "quick-dinner",
      "keto"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
    "likes": 181
  },
  {
    "id": "rec-002",
    "title": "10-Minute Classic Fried Rice",
    "category": "15-Min Meals",
    "prepTime": "5 mins",
    "cookTime": "5 mins",
    "servings": 2,
    "difficulty": "Super Easy",
    "description": "The ultimate quick fridge cleanup meal using cold leftover rice and eggs.",
    "ingredients": [
      {
        "item": "Cooked rice (chilled)",
        "amount": "3 cups",
        "category": "Pantry & Grains",
        "standardKey": "rice"
      },
      {
        "item": "Eggs",
        "amount": "3 large",
        "category": "Proteins",
        "standardKey": "egg"
      },
      {
        "item": "Green onions (scallions)",
        "amount": "3 stalks",
        "category": "Produce",
        "standardKey": "green onion"
      },
      {
        "item": "Soy sauce",
        "amount": "2 tbsp",
        "category": "Spices & Sauces",
        "standardKey": "soy sauce"
      },
      {
        "item": "Sesame oil",
        "amount": "1 tsp",
        "category": "Spices & Sauces",
        "standardKey": "sesame oil"
      },
      {
        "item": "Butter or oil",
        "amount": "1 tbsp",
        "category": "Dairy",
        "standardKey": "butter"
      }
    ],
    "instructions": [
      "Whisk eggs. Scramble lightly in a hot skillet with half the butter; set aside.",
      "Add remaining butter and cold rice to skillet, breaking up clumps.",
      "Drizzle soy sauce and sesame oil; stir-fry over high heat for 3 minutes.",
      "Fold in scrambled eggs and chopped green onions. Toss 1 minute and serve."
    ],
    "tags": [
      "budget-friendly",
      "quick",
      "vegetarian",
      "pantry-staple"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80",
    "likes": 229
  },
  {
    "id": "rec-003",
    "title": "Honey Garlic Glazed Salmon",
    "category": "15-Min Meals",
    "prepTime": "5 mins",
    "cookTime": "10 mins",
    "servings": 2,
    "difficulty": "Easy",
    "description": "Pan-seared salmon fillets in a sweet, sticky honey-soy-garlic glaze.",
    "ingredients": [
      {
        "item": "Salmon fillets",
        "amount": "2 fillets (6 oz each)",
        "category": "Proteins",
        "standardKey": "salmon"
      },
      {
        "item": "Honey",
        "amount": "3 tbsp",
        "category": "Pantry & Grains",
        "standardKey": "honey"
      },
      {
        "item": "Soy sauce",
        "amount": "2 tbsp",
        "category": "Spices & Sauces",
        "standardKey": "soy sauce"
      },
      {
        "item": "Garlic (minced)",
        "amount": "3 cloves",
        "category": "Produce",
        "standardKey": "garlic"
      },
      {
        "item": "Lemon juice",
        "amount": "1 tbsp",
        "category": "Produce",
        "standardKey": "lemon"
      },
      {
        "item": "Olive oil",
        "amount": "1 tbsp",
        "category": "Pantry & Grains",
        "standardKey": "olive oil"
      }
    ],
    "instructions": [
      "Whisk honey, soy sauce, minced garlic, and lemon juice in a small bowl.",
      "Heat olive oil in skillet. Sear salmon skin-side up for 4 minutes until golden.",
      "Flip salmon and pour glaze around it. Simmer 3 minutes until thickened.",
      "Spoon bubbly sauce over salmon and serve immediately."
    ],
    "tags": [
      "omega-3",
      "healthy",
      "seafood",
      "date-night"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
    "likes": 49
  },
  {
    "id": "rec-004",
    "title": "15-Minute Creamy Carbonara",
    "category": "Pasta",
    "prepTime": "5 mins",
    "cookTime": "10 mins",
    "servings": 2,
    "difficulty": "Easy",
    "description": "Silky authentic Italian Roman carbonara with crispy bacon, eggs, and parmesan.",
    "ingredients": [
      {
        "item": "Spaghetti",
        "amount": "8 oz",
        "category": "Pantry & Grains",
        "standardKey": "pasta"
      },
      {
        "item": "Bacon or pancetta",
        "amount": "4 slices",
        "category": "Proteins",
        "standardKey": "bacon"
      },
      {
        "item": "Eggs",
        "amount": "2 whole + 1 yolk",
        "category": "Proteins",
        "standardKey": "egg"
      },
      {
        "item": "Parmesan cheese (grated)",
        "amount": "1/2 cup",
        "category": "Dairy",
        "standardKey": "parmesan"
      },
      {
        "item": "Black pepper (coarse)",
        "amount": "1 tsp",
        "category": "Spices & Sauces",
        "standardKey": "black pepper"
      },
      {
        "item": "Garlic",
        "amount": "1 clove",
        "category": "Produce",
        "standardKey": "garlic"
      }
    ],
    "instructions": [
      "Boil pasta in salted water until al dente; reserve 1/2 cup pasta water.",
      "Whisk eggs, yolk, grated parmesan, and black pepper in a bowl.",
      "Crisp diced bacon with garlic in a skillet; turn heat completely OFF.",
      "Toss hot drained pasta in skillet, then pour egg mixture while tossing rapidly.",
      "Add splash of pasta water until silky smooth and serve immediately."
    ],
    "tags": [
      "italian",
      "comfort-food",
      "classic",
      "quick-dinner"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=800&q=80",
    "likes": 86
  },
  {
    "id": "rec-005",
    "title": "Loaded Cheddar Cheese Quesadillas",
    "category": "15-Min Meals",
    "prepTime": "3 mins",
    "cookTime": "7 mins",
    "servings": 2,
    "difficulty": "Super Easy",
    "description": "Golden crispy flour tortillas loaded with gooey melted cheddar and salsa.",
    "ingredients": [
      {
        "item": "Flour tortillas",
        "amount": "2 large",
        "category": "Pantry & Grains",
        "standardKey": "tortilla"
      },
      {
        "item": "Cheddar cheese (shredded)",
        "amount": "1.5 cups",
        "category": "Dairy",
        "standardKey": "cheese"
      },
      {
        "item": "Butter",
        "amount": "1 tbsp",
        "category": "Dairy",
        "standardKey": "butter"
      },
      {
        "item": "Salsa or sour cream",
        "amount": "2 tbsp",
        "category": "Spices & Sauces",
        "standardKey": "salsa"
      }
    ],
    "instructions": [
      "Melt butter in a skillet over medium heat.",
      "Place tortilla flat, cover half with cheese, fold other half over.",
      "Cook 3-4 minutes until crispy golden, then flip and cook 2 minutes.",
      "Slice into wedges and serve with salsa."
    ],
    "tags": [
      "quick",
      "kid-friendly",
      "vegetarian",
      "budget-friendly"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1618040996337-56904b7850b9?auto=format&fit=crop&w=800&q=80",
    "likes": 200
  },
  {
    "id": "rec-006",
    "title": "Avocado & Jammy Soft-Boiled Egg Toast",
    "category": "Breakfast",
    "prepTime": "5 mins",
    "cookTime": "6 mins",
    "servings": 2,
    "difficulty": "Super Easy",
    "description": "Creamy seasoned mashed avocado on rustic sourdough topped with a 6-minute egg.",
    "ingredients": [
      {
        "item": "Sourdough bread",
        "amount": "2 slices",
        "category": "Pantry & Grains",
        "standardKey": "bread"
      },
      {
        "item": "Ripe avocado",
        "amount": "1 large",
        "category": "Produce",
        "standardKey": "avocado"
      },
      {
        "item": "Eggs",
        "amount": "2 large",
        "category": "Proteins",
        "standardKey": "egg"
      },
      {
        "item": "Lemon juice",
        "amount": "1 tsp",
        "category": "Produce",
        "standardKey": "lemon"
      },
      {
        "item": "Red pepper flakes",
        "amount": "1/4 tsp",
        "category": "Spices & Sauces",
        "standardKey": "chili flakes"
      },
      {
        "item": "Olive oil",
        "amount": "1 tsp",
        "category": "Pantry & Grains",
        "standardKey": "olive oil"
      }
    ],
    "instructions": [
      "Boil eggs for exactly 6.5 minutes, then plunge into cold ice water and peel.",
      "Toast bread. Mash avocado with lemon juice, salt, and pepper.",
      "Spread avocado over toast, top with halved jammy eggs and red pepper flakes."
    ],
    "tags": [
      "healthy",
      "breakfast",
      "cafe-style",
      "vegetarian"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
    "likes": 86
  },
  {
    "id": "rec-007",
    "title": "Sheet-Pan Lemon Garlic Chicken & Broccoli",
    "category": "Dinner",
    "prepTime": "10 mins",
    "cookTime": "20 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "One-pan dinner with juicy roasted chicken breasts and crispy caramelized broccoli florets.",
    "ingredients": [
      {
        "item": "Chicken breast",
        "amount": "1.5 lbs",
        "category": "Proteins",
        "standardKey": "chicken"
      },
      {
        "item": "Broccoli florets",
        "amount": "4 cups",
        "category": "Produce",
        "standardKey": "broccoli"
      },
      {
        "item": "Olive oil",
        "amount": "3 tbsp",
        "category": "Pantry & Grains",
        "standardKey": "olive oil"
      },
      {
        "item": "Garlic powder",
        "amount": "1 tsp",
        "category": "Spices & Sauces",
        "standardKey": "garlic powder"
      },
      {
        "item": "Lemon",
        "amount": "1 whole",
        "category": "Produce",
        "standardKey": "lemon"
      },
      {
        "item": "Parmesan cheese",
        "amount": "1/4 cup",
        "category": "Dairy",
        "standardKey": "parmesan"
      }
    ],
    "instructions": [
      "Preheat oven to 400\u00b0F (200\u00b0C).",
      "Toss chicken and broccoli with olive oil, garlic powder, salt, and lemon juice.",
      "Spread on sheet pan and roast 20 minutes until chicken reaches 165\u00b0F.",
      "Sprinkle parmesan over hot roasted broccoli and serve."
    ],
    "tags": [
      "healthy",
      "sheet-pan",
      "meal-prep",
      "gluten-free"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=800&q=80",
    "likes": 167
  },
  {
    "id": "rec-008",
    "title": "Creamy Tomato Basil Penne",
    "category": "Pasta",
    "prepTime": "5 mins",
    "cookTime": "12 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Luxurious pink sauce pasta with crushed tomatoes, garlic, heavy cream, and fresh basil.",
    "ingredients": [
      {
        "item": "Penne pasta",
        "amount": "12 oz",
        "category": "Pantry & Grains",
        "standardKey": "pasta"
      },
      {
        "item": "Canned crushed tomatoes",
        "amount": "14 oz",
        "category": "Pantry & Grains",
        "standardKey": "tomato"
      },
      {
        "item": "Heavy cream",
        "amount": "1/2 cup",
        "category": "Dairy",
        "standardKey": "heavy cream"
      },
      {
        "item": "Garlic (minced)",
        "amount": "3 cloves",
        "category": "Produce",
        "standardKey": "garlic"
      },
      {
        "item": "Butter",
        "amount": "2 tbsp",
        "category": "Dairy",
        "standardKey": "butter"
      },
      {
        "item": "Parmesan cheese",
        "amount": "1/3 cup",
        "category": "Dairy",
        "standardKey": "parmesan"
      },
      {
        "item": "Fresh basil",
        "amount": "1/4 cup",
        "category": "Produce",
        "standardKey": "basil"
      }
    ],
    "instructions": [
      "Boil penne pasta in salted water until al dente.",
      "Saut\u00e9 garlic in butter for 1 minute; pour in crushed tomatoes and simmer 5 mins.",
      "Stir in heavy cream and parmesan until rich and pink.",
      "Toss cooked pasta and fresh basil in sauce and serve."
    ],
    "tags": [
      "comfort-food",
      "vegetarian",
      "pasta-night"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=800&q=80",
    "likes": 223
  },
  {
    "id": "rec-009",
    "title": "Classic Shakshuka",
    "category": "Breakfast",
    "prepTime": "5 mins",
    "cookTime": "15 mins",
    "servings": 3,
    "difficulty": "Easy",
    "description": "Eggs gently poached in a simmering skillet of spiced tomatoes, onions, bell peppers, and feta.",
    "ingredients": [
      {
        "item": "Eggs",
        "amount": "4 large",
        "category": "Proteins",
        "standardKey": "egg"
      },
      {
        "item": "Canned diced tomatoes",
        "amount": "14 oz",
        "category": "Pantry & Grains",
        "standardKey": "tomato"
      },
      {
        "item": "Onion (diced)",
        "amount": "1 medium",
        "category": "Produce",
        "standardKey": "onion"
      },
      {
        "item": "Bell pepper (chopped)",
        "amount": "1 medium",
        "category": "Produce",
        "standardKey": "bell pepper"
      },
      {
        "item": "Garlic (minced)",
        "amount": "2 cloves",
        "category": "Produce",
        "standardKey": "garlic"
      },
      {
        "item": "Cumin & paprika",
        "amount": "1 tsp each",
        "category": "Spices & Sauces",
        "standardKey": "cumin"
      },
      {
        "item": "Feta cheese",
        "amount": "1/4 cup",
        "category": "Dairy",
        "standardKey": "cheese"
      }
    ],
    "instructions": [
      "Saut\u00e9 onion and bell pepper in olive oil until tender (5 mins).",
      "Add garlic, cumin, and paprika; cook 1 min. Add canned tomatoes and simmer.",
      "Create 4 hollows in sauce and crack in eggs.",
      "Cover and simmer on low for 6 minutes until whites set. Top with feta."
    ],
    "tags": [
      "mediterranean",
      "brunch",
      "one-pan",
      "vegetarian"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&w=800&q=80",
    "likes": 172
  },
  {
    "id": "rec-010",
    "title": "15-Minute Beef & Broccoli Stir-Fry",
    "category": "Dinner",
    "prepTime": "5 mins",
    "cookTime": "10 mins",
    "servings": 3,
    "difficulty": "Easy",
    "description": "Tender thinly-sliced flank steak and crisp broccoli coated in a savory ginger soy glaze.",
    "ingredients": [
      {
        "item": "Flank steak (sliced)",
        "amount": "1 lb",
        "category": "Proteins",
        "standardKey": "beef"
      },
      {
        "item": "Broccoli florets",
        "amount": "3 cups",
        "category": "Produce",
        "standardKey": "broccoli"
      },
      {
        "item": "Soy sauce",
        "amount": "3 tbsp",
        "category": "Spices & Sauces",
        "standardKey": "soy sauce"
      },
      {
        "item": "Brown sugar",
        "amount": "1 tbsp",
        "category": "Pantry & Grains",
        "standardKey": "brown sugar"
      },
      {
        "item": "Garlic & ginger",
        "amount": "1 tbsp each",
        "category": "Produce",
        "standardKey": "garlic"
      },
      {
        "item": "Cornstarch",
        "amount": "1 tbsp",
        "category": "Pantry & Grains",
        "standardKey": "cornstarch"
      },
      {
        "item": "Sesame oil",
        "amount": "1 tsp",
        "category": "Spices & Sauces",
        "standardKey": "sesame oil"
      }
    ],
    "instructions": [
      "Whisk soy sauce, brown sugar, cornstarch, sesame oil, and 1/4 cup water.",
      "Sear beef slices in a hot wok 2-3 minutes; remove to a plate.",
      "Steam broccoli in skillet with a splash of water for 2 minutes.",
      "Add garlic, ginger, beef, and sauce; toss 1 minute until sauce glazes."
    ],
    "tags": [
      "takeout-fakeout",
      "high-protein",
      "asian",
      "quick-dinner"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80",
    "likes": 201
  },
  {
    "id": "rec-011",
    "title": "One-Pot Cheesy Taco Pasta",
    "category": "One-Pot",
    "prepTime": "5 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Ground beef, salsa, shells, and melted cheddar all cooked in a single pot.",
    "ingredients": [
      {
        "item": "Ground beef",
        "amount": "1 lb",
        "category": "Proteins",
        "standardKey": "ground beef"
      },
      {
        "item": "Pasta shells",
        "amount": "8 oz",
        "category": "Pantry & Grains",
        "standardKey": "pasta"
      },
      {
        "item": "Taco seasoning",
        "amount": "1 packet",
        "category": "Spices & Sauces",
        "standardKey": "taco seasoning"
      },
      {
        "item": "Salsa",
        "amount": "1 cup",
        "category": "Produce",
        "standardKey": "salsa"
      },
      {
        "item": "Beef or chicken broth",
        "amount": "2 cups",
        "category": "Pantry & Grains",
        "standardKey": "broth"
      },
      {
        "item": "Cheddar cheese (shredded)",
        "amount": "1.5 cups",
        "category": "Dairy",
        "standardKey": "cheese"
      }
    ],
    "instructions": [
      "Brown ground beef in a deep pot and drain excess fat.",
      "Stir in taco seasoning, pasta shells, salsa, and broth.",
      "Bring to boil, cover, and simmer 10-12 minutes until pasta is tender.",
      "Stir in shredded cheddar until creamy and melted."
    ],
    "tags": [
      "one-pot",
      "family-favorite",
      "easy-cleanup"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80",
    "likes": 139
  },
  {
    "id": "rec-012",
    "title": "Crispy Parmesan Crusted Pork Chops",
    "category": "Dinner",
    "prepTime": "5 mins",
    "cookTime": "12 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Juicy boneless pork chops with a crunchy golden parmesan and garlic coating.",
    "ingredients": [
      {
        "item": "Boneless pork chops",
        "amount": "4 chops",
        "category": "Proteins",
        "standardKey": "pork"
      },
      {
        "item": "Parmesan cheese (grated)",
        "amount": "1/2 cup",
        "category": "Dairy",
        "standardKey": "parmesan"
      },
      {
        "item": "Breadcrumbs",
        "amount": "1/2 cup",
        "category": "Pantry & Grains",
        "standardKey": "breadcrumbs"
      },
      {
        "item": "Garlic powder & paprika",
        "amount": "1 tsp each",
        "category": "Spices & Sauces",
        "standardKey": "paprika"
      },
      {
        "item": "Egg (beaten)",
        "amount": "1 large",
        "category": "Proteins",
        "standardKey": "egg"
      },
      {
        "item": "Olive oil",
        "amount": "2 tbsp",
        "category": "Pantry & Grains",
        "standardKey": "olive oil"
      }
    ],
    "instructions": [
      "Mix parmesan, breadcrumbs, garlic powder, paprika, salt, and pepper on a plate.",
      "Dip pork chops into beaten egg, then press firmly into parmesan crumb mixture.",
      "Heat olive oil in skillet over medium heat.",
      "Cook pork chops 4-5 minutes per side until crispy golden and cooked through."
    ],
    "tags": [
      "crispy",
      "high-protein",
      "comfort-food"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    "likes": 80
  },
  {
    "id": "rec-013",
    "title": "Mediterranean Greek Salad with Feta",
    "category": "Soups & Salads",
    "prepTime": "10 mins",
    "cookTime": "0 mins",
    "servings": 3,
    "difficulty": "Super Easy",
    "description": "Crisp cucumbers, juicy cherry tomatoes, kalamata olives, red onion, and tangy feta blocks.",
    "ingredients": [
      {
        "item": "Cucumber (diced)",
        "amount": "1 English",
        "category": "Produce",
        "standardKey": "cucumber"
      },
      {
        "item": "Cherry tomatoes (halved)",
        "amount": "1 pint",
        "category": "Produce",
        "standardKey": "tomato"
      },
      {
        "item": "Red onion (sliced)",
        "amount": "1/2 small",
        "category": "Produce",
        "standardKey": "onion"
      },
      {
        "item": "Feta cheese",
        "amount": "4 oz block",
        "category": "Dairy",
        "standardKey": "cheese"
      },
      {
        "item": "Kalamata olives",
        "amount": "1/2 cup",
        "category": "Produce",
        "standardKey": "olives"
      },
      {
        "item": "Olive oil & red wine vinegar",
        "amount": "3 tbsp & 1 tbsp",
        "category": "Pantry & Grains",
        "standardKey": "olive oil"
      },
      {
        "item": "Dried oregano",
        "amount": "1 tsp",
        "category": "Spices & Sauces",
        "standardKey": "oregano"
      }
    ],
    "instructions": [
      "Combine cucumber, tomatoes, red onion, and olives in a shallow serving bowl.",
      "Whisk olive oil, red wine vinegar, dried oregano, salt, and pepper.",
      "Pour dressing over vegetables and toss gently.",
      "Top with blocks or crumbled feta cheese and serve chilled."
    ],
    "tags": [
      "no-cook",
      "vegetarian",
      "mediterranean",
      "healthy"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    "likes": 128
  },
  {
    "id": "rec-014",
    "title": "10-Minute Egg Roll in a Bowl",
    "category": "15-Min Meals",
    "prepTime": "5 mins",
    "cookTime": "10 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "All the flavor of crispy egg rolls without the wrapper; ground turkey or pork with coleslaw.",
    "ingredients": [
      {
        "item": "Ground pork or turkey",
        "amount": "1 lb",
        "category": "Proteins",
        "standardKey": "ground pork"
      },
      {
        "item": "Coleslaw mix (shredded cabbage)",
        "amount": "1 bag (14 oz)",
        "category": "Produce",
        "standardKey": "cabbage"
      },
      {
        "item": "Soy sauce",
        "amount": "3 tbsp",
        "category": "Spices & Sauces",
        "standardKey": "soy sauce"
      },
      {
        "item": "Sesame oil",
        "amount": "1 tbsp",
        "category": "Spices & Sauces",
        "standardKey": "sesame oil"
      },
      {
        "item": "Garlic & ginger",
        "amount": "1 tbsp each",
        "category": "Produce",
        "standardKey": "garlic"
      },
      {
        "item": "Sriracha",
        "amount": "1 tbsp",
        "category": "Spices & Sauces",
        "standardKey": "hot sauce"
      }
    ],
    "instructions": [
      "Brown ground pork in large skillet with garlic and ginger until cooked.",
      "Dump in whole bag of shredded coleslaw mix.",
      "Add soy sauce, sesame oil, and sriracha.",
      "Saut\u00e9 4-5 minutes until cabbage is tender-crisp. Drizzle with sriracha and serve."
    ],
    "tags": [
      "keto",
      "low-carb",
      "meal-prep",
      "quick"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&w=800&q=80",
    "likes": 88
  },
  {
    "id": "rec-015",
    "title": "Creamy Tuscan Garlic Shrimp",
    "category": "Dinner",
    "prepTime": "5 mins",
    "cookTime": "10 mins",
    "servings": 3,
    "difficulty": "Easy",
    "description": "Plump juicy shrimp swimming in a rich garlic cream sauce with sun-dried tomatoes and baby spinach.",
    "ingredients": [
      {
        "item": "Shrimp (peeled & deveined)",
        "amount": "1 lb",
        "category": "Proteins",
        "standardKey": "shrimp"
      },
      {
        "item": "Garlic (minced)",
        "amount": "4 cloves",
        "category": "Produce",
        "standardKey": "garlic"
      },
      {
        "item": "Sun-dried tomatoes (sliced)",
        "amount": "1/3 cup",
        "category": "Produce",
        "standardKey": "tomato"
      },
      {
        "item": "Baby spinach",
        "amount": "2 cups",
        "category": "Produce",
        "standardKey": "spinach"
      },
      {
        "item": "Heavy cream",
        "amount": "3/4 cup",
        "category": "Dairy",
        "standardKey": "heavy cream"
      },
      {
        "item": "Parmesan cheese",
        "amount": "1/3 cup",
        "category": "Dairy",
        "standardKey": "parmesan"
      },
      {
        "item": "Butter",
        "amount": "2 tbsp",
        "category": "Dairy",
        "standardKey": "butter"
      }
    ],
    "instructions": [
      "Sear seasoned shrimp in 1 tbsp butter for 2 mins per side; set aside on plate.",
      "Melt remaining butter; cook garlic and sun-dried tomatoes for 1 minute.",
      "Pour in heavy cream and parmesan; bring to simmer until thickened.",
      "Stir in fresh baby spinach until wilted.",
      "Return shrimp to pan, toss in sauce for 1 minute, and serve over pasta or rice."
    ],
    "tags": [
      "seafood",
      "restaurant-quality",
      "low-carb",
      "dinner-party"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&w=800&q=80",
    "likes": 114
  },
  {
    "id": "rec-016",
    "title": "Fluffy Diner-Style Buttermilk Pancakes",
    "category": "Breakfast",
    "prepTime": "5 mins",
    "cookTime": "10 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Pillowy, golden, thick homemade pancakes made with kitchen staple ingredients.",
    "ingredients": [
      {
        "item": "All-purpose flour",
        "amount": "2 cups",
        "category": "Pantry & Grains",
        "standardKey": "flour"
      },
      {
        "item": "Milk + 1 tbsp vinegar (or buttermilk)",
        "amount": "1.75 cups",
        "category": "Dairy",
        "standardKey": "milk"
      },
      {
        "item": "Eggs",
        "amount": "2 large",
        "category": "Proteins",
        "standardKey": "egg"
      },
      {
        "item": "Melted butter",
        "amount": "3 tbsp",
        "category": "Dairy",
        "standardKey": "butter"
      },
      {
        "item": "Baking powder",
        "amount": "2 tsp",
        "category": "Pantry & Grains",
        "standardKey": "baking powder"
      },
      {
        "item": "Sugar & salt",
        "amount": "2 tbsp & 1/2 tsp",
        "category": "Pantry & Grains",
        "standardKey": "sugar"
      },
      {
        "item": "Maple syrup",
        "amount": "For serving",
        "category": "Pantry & Grains",
        "standardKey": "syrup"
      }
    ],
    "instructions": [
      "Whisk flour, baking powder, sugar, and salt in a bowl.",
      "Whisk milk, eggs, and melted butter together in separate bowl.",
      "Gently fold wet ingredients into dry until just combined (leave small lumps).",
      "Cook 1/4 cup batter scoops on buttered griddle over medium heat until bubbles pop.",
      "Flip and cook 2 minutes until golden. Serve with warm maple syrup."
    ],
    "tags": [
      "breakfast",
      "kid-friendly",
      "weekend",
      "comfort-food"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80",
    "likes": 77
  },
  {
    "id": "rec-017",
    "title": "Sheet-Pan Smoked Sausage, Peppers & Onions",
    "category": "Dinner",
    "prepTime": "10 mins",
    "cookTime": "20 mins",
    "servings": 4,
    "difficulty": "Super Easy",
    "description": "Caramelized bell peppers, sweet red onions, and browned smoked sausage slices roasted to perfection.",
    "ingredients": [
      {
        "item": "Smoked sausage or kielbasa (sliced)",
        "amount": "1 lb",
        "category": "Proteins",
        "standardKey": "sausage"
      },
      {
        "item": "Bell peppers (sliced)",
        "amount": "3 assorted",
        "category": "Produce",
        "standardKey": "bell pepper"
      },
      {
        "item": "Red onion (thick wedges)",
        "amount": "1 large",
        "category": "Produce",
        "standardKey": "onion"
      },
      {
        "item": "Olive oil",
        "amount": "2 tbsp",
        "category": "Pantry & Grains",
        "standardKey": "olive oil"
      },
      {
        "item": "Italian seasoning",
        "amount": "1 tbsp",
        "category": "Spices & Sauces",
        "standardKey": "italian seasoning"
      },
      {
        "item": "Garlic powder",
        "amount": "1 tsp",
        "category": "Spices & Sauces",
        "standardKey": "garlic powder"
      }
    ],
    "instructions": [
      "Preheat oven to 400\u00b0F (200\u00b0C).",
      "Toss sliced sausage, bell peppers, and onion wedges with olive oil and spices.",
      "Spread evenly across baking sheet in a single layer.",
      "Roast for 20-25 minutes, tossing halfway, until veggies are tender and sausage edges are caramelized."
    ],
    "tags": [
      "sheet-pan",
      "meal-prep",
      "gluten-free",
      "quick-cleanup"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1585325701165-351af916e581?auto=format&fit=crop&w=800&q=80",
    "likes": 158
  },
  {
    "id": "rec-018",
    "title": "Cheesy Garlic French Bread Pizza",
    "category": "Snacks & Quick Bites",
    "prepTime": "5 mins",
    "cookTime": "12 mins",
    "servings": 4,
    "difficulty": "Super Easy",
    "description": "Crispy on the outside, soft on the inside French bread loaded with garlic butter, marinara, and mozzarella.",
    "ingredients": [
      {
        "item": "French bread loaf (halved lengthwise)",
        "amount": "1 loaf",
        "category": "Pantry & Grains",
        "standardKey": "bread"
      },
      {
        "item": "Marinara or pizza sauce",
        "amount": "1 cup",
        "category": "Pantry & Grains",
        "standardKey": "tomato sauce"
      },
      {
        "item": "Mozzarella cheese (shredded)",
        "amount": "2 cups",
        "category": "Dairy",
        "standardKey": "cheese"
      },
      {
        "item": "Butter (softened)",
        "amount": "3 tbsp",
        "category": "Dairy",
        "standardKey": "butter"
      },
      {
        "item": "Garlic powder & oregano",
        "amount": "1 tsp each",
        "category": "Spices & Sauces",
        "standardKey": "garlic powder"
      },
      {
        "item": "Pepperoni (optional)",
        "amount": "20 slices",
        "category": "Proteins",
        "standardKey": "pepperoni"
      }
    ],
    "instructions": [
      "Preheat oven to 425\u00b0F (220\u00b0C).",
      "Mix softened butter with garlic powder and spread over cut sides of French bread.",
      "Bake bread for 5 minutes until lightly toasted.",
      "Spread marinara sauce over bread, top with mozzarella and pepperoni.",
      "Bake 8-10 minutes until cheese is bubbly and starting to brown."
    ],
    "tags": [
      "kid-friendly",
      "pizza-night",
      "comfort-food",
      "quick-snack"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    "likes": 85
  },
  {
    "id": "rec-019",
    "title": "Lemon Herb Baked Cod",
    "category": "Dinner",
    "prepTime": "5 mins",
    "cookTime": "15 mins",
    "servings": 3,
    "difficulty": "Easy",
    "description": "Delicate, tender white fish baked with melted lemon garlic butter and herbs.",
    "ingredients": [
      {
        "item": "Cod fillets",
        "amount": "3 fillets",
        "category": "Proteins",
        "standardKey": "cod"
      },
      {
        "item": "Butter (melted)",
        "amount": "3 tbsp",
        "category": "Dairy",
        "standardKey": "butter"
      },
      {
        "item": "Lemon juice & zest",
        "amount": "1 lemon",
        "category": "Produce",
        "standardKey": "lemon"
      },
      {
        "item": "Garlic (minced)",
        "amount": "2 cloves",
        "category": "Produce",
        "standardKey": "garlic"
      },
      {
        "item": "Paprika",
        "amount": "1/2 tsp",
        "category": "Spices & Sauces",
        "standardKey": "paprika"
      },
      {
        "item": "Fresh parsley",
        "amount": "2 tbsp",
        "category": "Produce",
        "standardKey": "parsley"
      }
    ],
    "instructions": [
      "Preheat oven to 400\u00b0F (200\u00b0C). Place cod fillets in greased baking dish.",
      "Mix melted butter, lemon juice, lemon zest, garlic, paprika, salt, and pepper.",
      "Pour lemon garlic butter all over cod fillets.",
      "Bake for 12-15 minutes until fish flakes easily with a fork.",
      "Garnish with chopped fresh parsley."
    ],
    "tags": [
      "healthy",
      "low-calorie",
      "keto",
      "seafood"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
    "likes": 185
  },
  {
    "id": "rec-020",
    "title": "Quick Spinach & Mushroom Frittata",
    "category": "Breakfast",
    "prepTime": "5 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Fluffy baked egg skillet packed with saut\u00e9ed mushrooms, fresh baby spinach, and melted cheese.",
    "ingredients": [
      {
        "item": "Eggs",
        "amount": "6 large",
        "category": "Proteins",
        "standardKey": "egg"
      },
      {
        "item": "Baby spinach",
        "amount": "2 cups",
        "category": "Produce",
        "standardKey": "spinach"
      },
      {
        "item": "Sliced mushrooms",
        "amount": "1 cup",
        "category": "Produce",
        "standardKey": "mushroom"
      },
      {
        "item": "Milk or cream",
        "amount": "1/4 cup",
        "category": "Dairy",
        "standardKey": "milk"
      },
      {
        "item": "Cheddar or goat cheese",
        "amount": "1/2 cup",
        "category": "Dairy",
        "standardKey": "cheese"
      },
      {
        "item": "Olive oil",
        "amount": "1 tbsp",
        "category": "Pantry & Grains",
        "standardKey": "olive oil"
      },
      {
        "item": "Garlic (minced)",
        "amount": "1 clove",
        "category": "Produce",
        "standardKey": "garlic"
      }
    ],
    "instructions": [
      "Preheat oven to 375\u00b0F (190\u00b0C). Whisk eggs, milk, salt, and pepper in a bowl.",
      "Heat olive oil in an oven-safe skillet. Saut\u00e9 mushrooms and garlic 4 minutes.",
      "Add spinach and cook 1 minute until wilted.",
      "Pour whisked eggs into skillet and scatter cheese on top.",
      "Bake in oven for 12-14 minutes until center is puffed and set."
    ],
    "tags": [
      "brunch",
      "vegetarian",
      "low-carb",
      "meal-prep"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&w=800&q=80",
    "likes": 170
  },
  {
    "id": "rec-021",
    "title": "Creamy Fettuccine Alfredo",
    "category": "Pasta",
    "prepTime": "5 mins",
    "cookTime": "12 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Classic restaurant Alfredo sauce with real butter, heavy cream, garlic, and parmesan.",
    "ingredients": [
      {
        "item": "Fettuccine pasta",
        "amount": "12 oz",
        "category": "Pantry & Grains",
        "standardKey": "pasta"
      },
      {
        "item": "Butter",
        "amount": "4 tbsp",
        "category": "Dairy",
        "standardKey": "butter"
      },
      {
        "item": "Heavy cream",
        "amount": "1 cup",
        "category": "Dairy",
        "standardKey": "heavy cream"
      },
      {
        "item": "Garlic (minced)",
        "amount": "3 cloves",
        "category": "Produce",
        "standardKey": "garlic"
      },
      {
        "item": "Parmesan cheese (freshly grated)",
        "amount": "1 cup",
        "category": "Dairy",
        "standardKey": "parmesan"
      },
      {
        "item": "Nutmeg & black pepper",
        "amount": "Pinch each",
        "category": "Spices & Sauces",
        "standardKey": "black pepper"
      }
    ],
    "instructions": [
      "Boil fettuccine pasta in salted water until al dente.",
      "In a wide skillet, melt butter over medium heat. Saut\u00e9 garlic 1 minute.",
      "Pour in heavy cream and simmer gently for 3-4 minutes until slightly thickened.",
      "Turn heat to low. Whisk in grated parmesan until completely smooth.",
      "Toss pasta directly in the rich sauce until thoroughly coated."
    ],
    "tags": [
      "italian",
      "indulgent",
      "classic",
      "comfort-food"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=800&q=80",
    "likes": 119
  },
  {
    "id": "rec-022",
    "title": "Korean Ground Beef Rice Bowl",
    "category": "Dinner",
    "prepTime": "5 mins",
    "cookTime": "10 mins",
    "servings": 3,
    "difficulty": "Easy",
    "description": "Sweet, savory, and spicy ground beef cooked in soy, brown sugar, garlic, and sesame oil over rice.",
    "ingredients": [
      {
        "item": "Ground beef",
        "amount": "1 lb",
        "category": "Proteins",
        "standardKey": "ground beef"
      },
      {
        "item": "Soy sauce",
        "amount": "1/4 cup",
        "category": "Spices & Sauces",
        "standardKey": "soy sauce"
      },
      {
        "item": "Brown sugar",
        "amount": "2 tbsp",
        "category": "Pantry & Grains",
        "standardKey": "brown sugar"
      },
      {
        "item": "Sesame oil",
        "amount": "1 tbsp",
        "category": "Spices & Sauces",
        "standardKey": "sesame oil"
      },
      {
        "item": "Garlic (minced)",
        "amount": "3 cloves",
        "category": "Produce",
        "standardKey": "garlic"
      },
      {
        "item": "Fresh ginger",
        "amount": "1 tsp",
        "category": "Produce",
        "standardKey": "ginger"
      },
      {
        "item": "Cooked white rice",
        "amount": "3 cups",
        "category": "Pantry & Grains",
        "standardKey": "rice"
      },
      {
        "item": "Green onions & sesame seeds",
        "amount": "For garnish",
        "category": "Produce",
        "standardKey": "green onion"
      }
    ],
    "instructions": [
      "Whisk soy sauce, brown sugar, and sesame oil in a small bowl.",
      "Brown ground beef with minced garlic and ginger in a skillet until fully cooked.",
      "Drain excess grease. Pour sauce over beef and simmer 2-3 minutes until glazed.",
      "Scoop hot white rice into bowls, top with Korean beef, green onions, and sesame seeds."
    ],
    "tags": [
      "asian",
      "high-protein",
      "budget-friendly",
      "quick"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80",
    "likes": 189
  },
  {
    "id": "rec-023",
    "title": "Loaded Baked Potato Soup",
    "category": "Soups & Salads",
    "prepTime": "10 mins",
    "cookTime": "20 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Thick, velvety potato soup packed with crispy bacon, melted cheddar, and green onions.",
    "ingredients": [
      {
        "item": "Russet potatoes (diced)",
        "amount": "4 large",
        "category": "Produce",
        "standardKey": "potato"
      },
      {
        "item": "Bacon (diced)",
        "amount": "5 slices",
        "category": "Proteins",
        "standardKey": "bacon"
      },
      {
        "item": "Butter",
        "amount": "3 tbsp",
        "category": "Dairy",
        "standardKey": "butter"
      },
      {
        "item": "Flour",
        "amount": "3 tbsp",
        "category": "Pantry & Grains",
        "standardKey": "flour"
      },
      {
        "item": "Chicken broth",
        "amount": "3 cups",
        "category": "Pantry & Grains",
        "standardKey": "broth"
      },
      {
        "item": "Milk or cream",
        "amount": "1 cup",
        "category": "Dairy",
        "standardKey": "milk"
      },
      {
        "item": "Cheddar cheese",
        "amount": "1.5 cups",
        "category": "Dairy",
        "standardKey": "cheese"
      },
      {
        "item": "Sour cream",
        "amount": "1/2 cup",
        "category": "Dairy",
        "standardKey": "sour cream"
      },
      {
        "item": "Green onions",
        "amount": "3 stalks",
        "category": "Produce",
        "standardKey": "green onion"
      }
    ],
    "instructions": [
      "Crisp bacon in large soup pot; remove bacon and leave drippings.",
      "Add butter to drippings, whisk in flour for 1 minute.",
      "Slowly pour in chicken broth and milk, whisking constantly.",
      "Add diced potatoes; simmer 15 minutes until fork-tender.",
      "Mash some potatoes to thicken. Stir in cheese and sour cream. Top with bacon and green onions."
    ],
    "tags": [
      "comfort-food",
      "soup",
      "winter",
      "crowd-pleaser"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=800&q=80",
    "likes": 182
  },
  {
    "id": "rec-024",
    "title": "Classic BLT with Garlic Herb Mayo",
    "category": "Snacks & Quick Bites",
    "prepTime": "5 mins",
    "cookTime": "5 mins",
    "servings": 2,
    "difficulty": "Super Easy",
    "description": "Crispy thick-cut bacon, juicy ripe tomatoes, and crisp romaine on toasted rustic sourdough with garlic aioli.",
    "ingredients": [
      {
        "item": "Bacon",
        "amount": "6 slices",
        "category": "Proteins",
        "standardKey": "bacon"
      },
      {
        "item": "Sourdough bread",
        "amount": "4 slices",
        "category": "Pantry & Grains",
        "standardKey": "bread"
      },
      {
        "item": "Ripe tomato (thickly sliced)",
        "amount": "1 large",
        "category": "Produce",
        "standardKey": "tomato"
      },
      {
        "item": "Romaine lettuce",
        "amount": "4 leaves",
        "category": "Produce",
        "standardKey": "lettuce"
      },
      {
        "item": "Mayonnaise",
        "amount": "3 tbsp",
        "category": "Spices & Sauces",
        "standardKey": "mayonnaise"
      },
      {
        "item": "Garlic powder & black pepper",
        "amount": "1/2 tsp each",
        "category": "Spices & Sauces",
        "standardKey": "garlic powder"
      }
    ],
    "instructions": [
      "Fry bacon in skillet until crispy; drain on paper towels.",
      "Toast bread slices until golden brown.",
      "Mix mayonnaise with garlic powder and black pepper.",
      "Spread garlic mayo on toast, layer with lettuce, juicy salted tomato slices, and bacon."
    ],
    "tags": [
      "classic",
      "lunch",
      "sandwich",
      "quick"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=800&q=80",
    "likes": 123
  },
  {
    "id": "rec-025",
    "title": "Honey Sriracha Glazed Meatballs",
    "category": "Dinner",
    "prepTime": "5 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Juicy meatballs tossed in a spicy-sweet honey sriracha glaze with sesame seeds.",
    "ingredients": [
      {
        "item": "Meatballs (beef or turkey, cooked)",
        "amount": "1 bag (16 oz)",
        "category": "Proteins",
        "standardKey": "meatballs"
      },
      {
        "item": "Honey",
        "amount": "1/3 cup",
        "category": "Pantry & Grains",
        "standardKey": "honey"
      },
      {
        "item": "Sriracha hot sauce",
        "amount": "3 tbsp",
        "category": "Spices & Sauces",
        "standardKey": "hot sauce"
      },
      {
        "item": "Soy sauce",
        "amount": "2 tbsp",
        "category": "Spices & Sauces",
        "standardKey": "soy sauce"
      },
      {
        "item": "Garlic (minced)",
        "amount": "2 cloves",
        "category": "Produce",
        "standardKey": "garlic"
      },
      {
        "item": "Sesame seeds",
        "amount": "1 tsp",
        "category": "Spices & Sauces",
        "standardKey": "sesame oil"
      }
    ],
    "instructions": [
      "Whisk honey, sriracha, soy sauce, and minced garlic in a saucepan.",
      "Simmer sauce over medium-low heat for 3 minutes until bubbling and glossy.",
      "Add meatballs to the sauce, tossing until thoroughly coated and heated through.",
      "Sprinkle with sesame seeds and serve over jasmine rice or as an appetizer."
    ],
    "tags": [
      "spicy-sweet",
      "appetizer",
      "party-food",
      "quick"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=800&q=80",
    "likes": 138
  },
  {
    "id": "rec-026",
    "title": "Garlic Butter Steak Bites with Golden Potatoes",
    "category": "Dinner",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 3,
    "difficulty": "Easy",
    "description": "Seared sirloin steak bites and crispy pan-fried baby potatoes bathed in garlic thyme butter.",
    "ingredients": [
      {
        "item": "Sirloin steak (cubed)",
        "amount": "1 lb",
        "category": "Proteins",
        "standardKey": "beef"
      },
      {
        "item": "Baby yellow potatoes (quartered)",
        "amount": "1 lb",
        "category": "Produce",
        "standardKey": "potato"
      },
      {
        "item": "Butter",
        "amount": "4 tbsp",
        "category": "Dairy",
        "standardKey": "butter"
      },
      {
        "item": "Olive oil",
        "amount": "2 tbsp",
        "category": "Pantry & Grains",
        "standardKey": "olive oil"
      },
      {
        "item": "Garlic (minced)",
        "amount": "4 cloves",
        "category": "Produce",
        "standardKey": "garlic"
      },
      {
        "item": "Fresh thyme or rosemary",
        "amount": "2 sprigs",
        "category": "Produce",
        "standardKey": "parsley"
      }
    ],
    "instructions": [
      "Heat 1 tbsp olive oil and 1 tbsp butter in large skillet. Cook quartered potatoes 10 mins until golden and soft; remove.",
      "Turn skillet to high heat. Add remaining oil and sear steak cubes 3-4 minutes until nicely browned.",
      "Return potatoes to pan. Add remaining butter, minced garlic, and thyme.",
      "Baste everything together for 1-2 minutes until fragrant and coated in butter."
    ],
    "tags": [
      "steakhouse",
      "hearty",
      "high-protein",
      "one-pan"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    "likes": 145
  },
  {
    "id": "rec-027",
    "title": "15-Minute Chicken Teriyaki Skillet",
    "category": "15-Min Meals",
    "prepTime": "5 mins",
    "cookTime": "10 mins",
    "servings": 3,
    "difficulty": "Easy",
    "description": "Tender bite-sized chicken thighs simmered in a glossy homemade sweet teriyaki sauce.",
    "ingredients": [
      {
        "item": "Chicken thighs (boneless, diced)",
        "amount": "1.25 lbs",
        "category": "Proteins",
        "standardKey": "chicken"
      },
      {
        "item": "Soy sauce",
        "amount": "1/4 cup",
        "category": "Spices & Sauces",
        "standardKey": "soy sauce"
      },
      {
        "item": "Honey or brown sugar",
        "amount": "3 tbsp",
        "category": "Pantry & Grains",
        "standardKey": "honey"
      },
      {
        "item": "Garlic & ginger (minced)",
        "amount": "1 tsp each",
        "category": "Produce",
        "standardKey": "garlic"
      },
      {
        "item": "Cornstarch",
        "amount": "1 tsp",
        "category": "Pantry & Grains",
        "standardKey": "cornstarch"
      },
      {
        "item": "Sesame seeds",
        "amount": "1 tsp",
        "category": "Spices & Sauces",
        "standardKey": "sesame oil"
      }
    ],
    "instructions": [
      "Whisk soy sauce, honey, minced garlic, ginger, cornstarch, and 2 tbsp water.",
      "Sear chicken thigh pieces in hot skillet with 1 tbsp oil for 5-6 minutes until browned.",
      "Pour teriyaki sauce over chicken; simmer 3 minutes until thick, glossy glaze clings to chicken.",
      "Serve over steamed rice with broccoli."
    ],
    "tags": [
      "takeout",
      "sweet-savory",
      "meal-prep",
      "quick"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
    "likes": 50
  },
  {
    "id": "rec-028",
    "title": "White Bean & Crispy Sausage Skillet",
    "category": "One-Pot",
    "prepTime": "5 mins",
    "cookTime": "15 mins",
    "servings": 3,
    "difficulty": "Easy",
    "description": "Italian sausage and tender white cannellini beans stewed with tomatoes, garlic, and wilted spinach.",
    "ingredients": [
      {
        "item": "Italian sausage (ground or sliced)",
        "amount": "1 lb",
        "category": "Proteins",
        "standardKey": "sausage"
      },
      {
        "item": "Cannellini white beans (rinsed)",
        "amount": "1 can (15 oz)",
        "category": "Pantry & Grains",
        "standardKey": "beans"
      },
      {
        "item": "Canned diced tomatoes",
        "amount": "1 can (14 oz)",
        "category": "Pantry & Grains",
        "standardKey": "tomato"
      },
      {
        "item": "Baby spinach",
        "amount": "2 cups",
        "category": "Produce",
        "standardKey": "spinach"
      },
      {
        "item": "Garlic (minced)",
        "amount": "3 cloves",
        "category": "Produce",
        "standardKey": "garlic"
      },
      {
        "item": "Parmesan cheese",
        "amount": "1/4 cup",
        "category": "Dairy",
        "standardKey": "parmesan"
      }
    ],
    "instructions": [
      "Brown sausage in a skillet over medium heat, breaking into chunks.",
      "Add garlic and cook 1 minute. Pour in diced tomatoes and rinsed cannellini beans.",
      "Simmer for 8 minutes to let flavors meld.",
      "Fold in spinach until wilted. Top with grated parmesan and crusty bread."
    ],
    "tags": [
      "one-pan",
      "high-fiber",
      "rustic",
      "italian"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1585325701165-351af916e581?auto=format&fit=crop&w=800&q=80",
    "likes": 98
  },
  {
    "id": "rec-029",
    "title": "Ultimate Crispy Grilled Cheese",
    "category": "Snacks & Quick Bites",
    "prepTime": "2 mins",
    "cookTime": "6 mins",
    "servings": 1,
    "difficulty": "Super Easy",
    "description": "The secret to the crispiest golden crust: mayo on the outside, two kinds of cheddar inside.",
    "ingredients": [
      {
        "item": "Sourdough or white bread",
        "amount": "2 slices",
        "category": "Pantry & Grains",
        "standardKey": "bread"
      },
      {
        "item": "Cheddar cheese (sharp sliced)",
        "amount": "2 slices",
        "category": "Dairy",
        "standardKey": "cheese"
      },
      {
        "item": "American or Swiss cheese",
        "amount": "1 slice",
        "category": "Dairy",
        "standardKey": "cheese"
      },
      {
        "item": "Mayonnaise",
        "amount": "1.5 tbsp",
        "category": "Spices & Sauces",
        "standardKey": "mayonnaise"
      },
      {
        "item": "Butter",
        "amount": "1 tbsp",
        "category": "Dairy",
        "standardKey": "butter"
      }
    ],
    "instructions": [
      "Spread mayonnaise evenly on the outside of each bread slice (creates a crunchy golden crust).",
      "Layer cheddar and swiss cheese between the bread.",
      "Melt butter in skillet over medium-low heat.",
      "Cook sandwich gently for 3-4 minutes per side until deeply golden and cheese is molten."
    ],
    "tags": [
      "classic",
      "comfort-food",
      "kid-friendly",
      "nostalgic"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
    "likes": 80
  },
  {
    "id": "rec-030",
    "title": "Lemon Butter Herb Tilapia",
    "category": "15-Min Meals",
    "prepTime": "3 mins",
    "cookTime": "8 mins",
    "servings": 2,
    "difficulty": "Super Easy",
    "description": "Tender mild white tilapia fillets pan-seared with golden garlic lemon butter.",
    "ingredients": [
      {
        "item": "Tilapia fillets",
        "amount": "2 fillets",
        "category": "Proteins",
        "standardKey": "tilapia"
      },
      {
        "item": "Butter",
        "amount": "3 tbsp",
        "category": "Dairy",
        "standardKey": "butter"
      },
      {
        "item": "Lemon juice",
        "amount": "2 tbsp",
        "category": "Produce",
        "standardKey": "lemon"
      },
      {
        "item": "Garlic powder",
        "amount": "1 tsp",
        "category": "Spices & Sauces",
        "standardKey": "garlic powder"
      },
      {
        "item": "Paprika",
        "amount": "1/2 tsp",
        "category": "Spices & Sauces",
        "standardKey": "paprika"
      },
      {
        "item": "Olive oil",
        "amount": "1 tbsp",
        "category": "Pantry & Grains",
        "standardKey": "olive oil"
      }
    ],
    "instructions": [
      "Season tilapia on both sides with garlic powder, paprika, salt, and pepper.",
      "Heat olive oil and 1 tbsp butter in skillet over medium-high heat.",
      "Sear tilapia 3-4 minutes per side until opaque and flaky.",
      "Melt remaining butter with lemon juice in pan; spoon bubbling lemon sauce over fish and serve."
    ],
    "tags": [
      "healthy",
      "budget-seafood",
      "quick",
      "keto"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
    "likes": 62
  },
  {
    "id": "rec-031",
    "title": "Velvety Butternut Squash Soup",
    "category": "Soups & Salads",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying velvety butternut squash soup prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Squash",
        "amount": "1 portion",
        "category": "Produce",
        "standardKey": "squash"
      },
      {
        "item": "Garlic (minced)",
        "amount": "3 cloves",
        "category": "Produce",
        "standardKey": "garlic"
      },
      {
        "item": "Onion (diced)",
        "amount": "1 medium",
        "category": "Produce",
        "standardKey": "onion"
      },
      {
        "item": "Chicken or Veggie Broth",
        "amount": "2 cups",
        "category": "Pantry & Grains",
        "standardKey": "broth"
      },
      {
        "item": "Heavy Cream",
        "amount": "1/2 cup",
        "category": "Dairy",
        "standardKey": "heavy cream"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for velvety butternut squash soup.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "soups-&-salads"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
    "likes": 143
  },
  {
    "id": "rec-032",
    "title": "Loaded Bacon & Egg Breakfast Burritos",
    "category": "Breakfast",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying loaded bacon & egg breakfast burritos prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Flour Tortillas",
        "amount": "4 large",
        "category": "Pantry & Grains",
        "standardKey": "tortilla"
      },
      {
        "item": "Eggs",
        "amount": "3 large",
        "category": "Proteins",
        "standardKey": "egg"
      },
      {
        "item": "Crispy Bacon",
        "amount": "5 slices",
        "category": "Proteins",
        "standardKey": "bacon"
      },
      {
        "item": "Cheddar or Mozzarella",
        "amount": "1 cup",
        "category": "Dairy",
        "standardKey": "cheese"
      },
      {
        "item": "Fresh Salsa",
        "amount": "1/2 cup",
        "category": "Spices & Sauces",
        "standardKey": "salsa"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for loaded bacon & egg breakfast burritos.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "breakfast"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80",
    "likes": 73
  },
  {
    "id": "rec-033",
    "title": "Tomato Basil Mozzarella Caprese",
    "category": "Soups & Salads",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying tomato basil mozzarella caprese prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Tomatoes (diced)",
        "amount": "2 medium",
        "category": "Produce",
        "standardKey": "tomato"
      },
      {
        "item": "Cheddar or Mozzarella",
        "amount": "1 cup",
        "category": "Dairy",
        "standardKey": "cheese"
      },
      {
        "item": "Fresh Basil",
        "amount": "1/4 cup",
        "category": "Produce",
        "standardKey": "basil"
      },
      {
        "item": "Olive Oil",
        "amount": "2 tbsp",
        "category": "Pantry & Grains",
        "standardKey": "olive oil"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for tomato basil mozzarella caprese.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "soups-&-salads"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
    "likes": 44
  },
  {
    "id": "rec-034",
    "title": "Crispy Roasted Garlic Asparagus",
    "category": "15-Min Meals",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying crispy roasted garlic asparagus prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Fresh Asparagus",
        "amount": "1 bunch",
        "category": "Produce",
        "standardKey": "asparagus"
      },
      {
        "item": "Garlic (minced)",
        "amount": "3 cloves",
        "category": "Produce",
        "standardKey": "garlic"
      },
      {
        "item": "Olive Oil",
        "amount": "2 tbsp",
        "category": "Pantry & Grains",
        "standardKey": "olive oil"
      },
      {
        "item": "Parmesan cheese",
        "amount": "1/3 cup",
        "category": "Dairy",
        "standardKey": "parmesan"
      },
      {
        "item": "Fresh Lemon",
        "amount": "1 whole",
        "category": "Produce",
        "standardKey": "lemon"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for crispy roasted garlic asparagus.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "15-min-meals"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
    "likes": 81
  },
  {
    "id": "rec-035",
    "title": "Crispy Baked Honey Mustard Chicken Tenders",
    "category": "Dinner",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying crispy baked honey mustard chicken tenders prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Chicken",
        "amount": "1 lb",
        "category": "Proteins",
        "standardKey": "chicken"
      },
      {
        "item": "Breadcrumbs",
        "amount": "1/2 cup",
        "category": "Pantry & Grains",
        "standardKey": "breadcrumbs"
      },
      {
        "item": "Honey",
        "amount": "2 tbsp",
        "category": "Pantry & Grains",
        "standardKey": "honey"
      },
      {
        "item": "Dijon or Yellow Mustard",
        "amount": "1 tbsp",
        "category": "Spices & Sauces",
        "standardKey": "mustard"
      },
      {
        "item": "Eggs",
        "amount": "3 large",
        "category": "Proteins",
        "standardKey": "egg"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for crispy baked honey mustard chicken tenders.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "dinner"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80",
    "likes": 44
  },
  {
    "id": "rec-036",
    "title": "One-Skillet Cheesy Beef Enchiladas",
    "category": "One-Pot",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying one-skillet cheesy beef enchiladas prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Lean Ground Beef",
        "amount": "1 lb",
        "category": "Proteins",
        "standardKey": "ground beef"
      },
      {
        "item": "Flour Tortillas",
        "amount": "4 large",
        "category": "Pantry & Grains",
        "standardKey": "tortilla"
      },
      {
        "item": "Cheddar or Mozzarella",
        "amount": "1 cup",
        "category": "Dairy",
        "standardKey": "cheese"
      },
      {
        "item": "Marinara / Tomato Sauce",
        "amount": "1 cup",
        "category": "Pantry & Grains",
        "standardKey": "tomato sauce"
      },
      {
        "item": "Onion (diced)",
        "amount": "1 medium",
        "category": "Produce",
        "standardKey": "onion"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for one-skillet cheesy beef enchiladas.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "one-pot"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    "likes": 188
  },
  {
    "id": "rec-037",
    "title": "Creamy Mushroom & Parmesan Risotto",
    "category": "One-Pot",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying creamy mushroom & parmesan risotto prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Jasmine or White Rice",
        "amount": "2 cups cooked",
        "category": "Pantry & Grains",
        "standardKey": "rice"
      },
      {
        "item": "Sliced Mushrooms",
        "amount": "1 cup",
        "category": "Produce",
        "standardKey": "mushroom"
      },
      {
        "item": "Garlic (minced)",
        "amount": "3 cloves",
        "category": "Produce",
        "standardKey": "garlic"
      },
      {
        "item": "Butter",
        "amount": "2 tbsp",
        "category": "Dairy",
        "standardKey": "butter"
      },
      {
        "item": "Parmesan cheese",
        "amount": "1/3 cup",
        "category": "Dairy",
        "standardKey": "parmesan"
      },
      {
        "item": "Chicken or Veggie Broth",
        "amount": "2 cups",
        "category": "Pantry & Grains",
        "standardKey": "broth"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for creamy mushroom & parmesan risotto.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "one-pot"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
    "likes": 225
  },
  {
    "id": "rec-038",
    "title": "Loaded Crunchy Taco Salad Bowl",
    "category": "Soups & Salads",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying loaded crunchy taco salad bowl prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Lean Ground Beef",
        "amount": "1 lb",
        "category": "Proteins",
        "standardKey": "ground beef"
      },
      {
        "item": "Romaine Lettuce",
        "amount": "1 head",
        "category": "Produce",
        "standardKey": "lettuce"
      },
      {
        "item": "Cheddar or Mozzarella",
        "amount": "1 cup",
        "category": "Dairy",
        "standardKey": "cheese"
      },
      {
        "item": "Tomatoes (diced)",
        "amount": "2 medium",
        "category": "Produce",
        "standardKey": "tomato"
      },
      {
        "item": "Fresh Salsa",
        "amount": "1/2 cup",
        "category": "Spices & Sauces",
        "standardKey": "salsa"
      },
      {
        "item": "Tortilla Chips",
        "amount": "1 bag",
        "category": "Pantry & Grains",
        "standardKey": "chips"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for loaded crunchy taco salad bowl.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "soups-&-salads"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80",
    "likes": 218
  },
  {
    "id": "rec-039",
    "title": "Crispy Rosemary Smashed Baby Potatoes",
    "category": "15-Min Meals",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying crispy rosemary smashed baby potatoes prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Potatoes",
        "amount": "3 medium",
        "category": "Produce",
        "standardKey": "potato"
      },
      {
        "item": "Garlic (minced)",
        "amount": "3 cloves",
        "category": "Produce",
        "standardKey": "garlic"
      },
      {
        "item": "Olive Oil",
        "amount": "2 tbsp",
        "category": "Pantry & Grains",
        "standardKey": "olive oil"
      },
      {
        "item": "Rosemary",
        "amount": "1 portion",
        "category": "Produce",
        "standardKey": "rosemary"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for crispy rosemary smashed baby potatoes.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "15-min-meals"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=800&q=80",
    "likes": 137
  },
  {
    "id": "rec-040",
    "title": "Chicken Piccata with Lemon & Capers",
    "category": "Dinner",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying chicken piccata with lemon & capers prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Chicken",
        "amount": "1 lb",
        "category": "Proteins",
        "standardKey": "chicken"
      },
      {
        "item": "Fresh Lemon",
        "amount": "1 whole",
        "category": "Produce",
        "standardKey": "lemon"
      },
      {
        "item": "Butter",
        "amount": "2 tbsp",
        "category": "Dairy",
        "standardKey": "butter"
      },
      {
        "item": "Capers",
        "amount": "1 portion",
        "category": "Produce",
        "standardKey": "capers"
      },
      {
        "item": "Garlic (minced)",
        "amount": "3 cloves",
        "category": "Produce",
        "standardKey": "garlic"
      },
      {
        "item": "Chicken or Veggie Broth",
        "amount": "2 cups",
        "category": "Pantry & Grains",
        "standardKey": "broth"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for chicken piccata with lemon & capers.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "dinner"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
    "likes": 152
  },
  {
    "id": "rec-041",
    "title": "10-Minute Spicy Sesame Peanut Noodles",
    "category": "15-Min Meals",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying 10-minute spicy sesame peanut noodles prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Pasta (any shape)",
        "amount": "8 oz",
        "category": "Pantry & Grains",
        "standardKey": "pasta"
      },
      {
        "item": "Peanut Butter",
        "amount": "1 portion",
        "category": "Produce",
        "standardKey": "peanut butter"
      },
      {
        "item": "Soy Sauce",
        "amount": "2 tbsp",
        "category": "Spices & Sauces",
        "standardKey": "soy sauce"
      },
      {
        "item": "Garlic (minced)",
        "amount": "3 cloves",
        "category": "Produce",
        "standardKey": "garlic"
      },
      {
        "item": "Sesame Oil",
        "amount": "1 tsp",
        "category": "Spices & Sauces",
        "standardKey": "sesame oil"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for 10-minute spicy sesame peanut noodles.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "15-min-meals"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
    "likes": 211
  },
  {
    "id": "rec-042",
    "title": "Loaded Skillet Breakfast Hash",
    "category": "Breakfast",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying loaded skillet breakfast hash prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Potatoes",
        "amount": "3 medium",
        "category": "Produce",
        "standardKey": "potato"
      },
      {
        "item": "Crispy Bacon",
        "amount": "5 slices",
        "category": "Proteins",
        "standardKey": "bacon"
      },
      {
        "item": "Eggs",
        "amount": "3 large",
        "category": "Proteins",
        "standardKey": "egg"
      },
      {
        "item": "Onion (diced)",
        "amount": "1 medium",
        "category": "Produce",
        "standardKey": "onion"
      },
      {
        "item": "Cheddar or Mozzarella",
        "amount": "1 cup",
        "category": "Dairy",
        "standardKey": "cheese"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for loaded skillet breakfast hash.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "breakfast"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80",
    "likes": 160
  },
  {
    "id": "rec-043",
    "title": "Warm Creamy Spinach Artichoke Dip",
    "category": "Snacks & Quick Bites",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying warm creamy spinach artichoke dip prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Fresh Baby Spinach",
        "amount": "2 cups",
        "category": "Produce",
        "standardKey": "spinach"
      },
      {
        "item": "Cream Cheese",
        "amount": "4 oz",
        "category": "Dairy",
        "standardKey": "cream cheese"
      },
      {
        "item": "Parmesan cheese",
        "amount": "1/3 cup",
        "category": "Dairy",
        "standardKey": "parmesan"
      },
      {
        "item": "Garlic (minced)",
        "amount": "3 cloves",
        "category": "Produce",
        "standardKey": "garlic"
      },
      {
        "item": "Tortilla Chips",
        "amount": "1 bag",
        "category": "Pantry & Grains",
        "standardKey": "chips"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for warm creamy spinach artichoke dip.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "snacks-&-quick-bites"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=800&q=80",
    "likes": 46
  },
  {
    "id": "rec-044",
    "title": "Crispy Garlic Chili Cucumber Salad",
    "category": "Soups & Salads",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying crispy garlic chili cucumber salad prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Cucumber",
        "amount": "1 whole",
        "category": "Produce",
        "standardKey": "cucumber"
      },
      {
        "item": "Soy Sauce",
        "amount": "2 tbsp",
        "category": "Spices & Sauces",
        "standardKey": "soy sauce"
      },
      {
        "item": "Sesame Oil",
        "amount": "1 tsp",
        "category": "Spices & Sauces",
        "standardKey": "sesame oil"
      },
      {
        "item": "Garlic (minced)",
        "amount": "3 cloves",
        "category": "Produce",
        "standardKey": "garlic"
      },
      {
        "item": "Red Pepper Flakes",
        "amount": "1/2 tsp",
        "category": "Spices & Sauces",
        "standardKey": "chili flakes"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for crispy garlic chili cucumber salad.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "soups-&-salads"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
    "likes": 94
  },
  {
    "id": "rec-045",
    "title": "Sheet-Pan Pesto Salmon with Green Beans",
    "category": "Dinner",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying sheet-pan pesto salmon with green beans prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Salmon Fillets",
        "amount": "2 fillets",
        "category": "Proteins",
        "standardKey": "salmon"
      },
      {
        "item": "Fresh Green Beans",
        "amount": "1/2 lb",
        "category": "Produce",
        "standardKey": "green beans"
      },
      {
        "item": "Basil Pesto",
        "amount": "1/4 cup",
        "category": "Pantry & Grains",
        "standardKey": "pesto"
      },
      {
        "item": "Fresh Lemon",
        "amount": "1 whole",
        "category": "Produce",
        "standardKey": "lemon"
      },
      {
        "item": "Olive Oil",
        "amount": "2 tbsp",
        "category": "Pantry & Grains",
        "standardKey": "olive oil"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for sheet-pan pesto salmon with green beans.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "dinner"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
    "likes": 186
  },
  {
    "id": "rec-046",
    "title": "Creamy Classic Egg Salad Sandwich",
    "category": "Breakfast",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying creamy classic egg salad sandwich prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Eggs",
        "amount": "3 large",
        "category": "Proteins",
        "standardKey": "egg"
      },
      {
        "item": "Mayonnaise",
        "amount": "2 tbsp",
        "category": "Spices & Sauces",
        "standardKey": "mayonnaise"
      },
      {
        "item": "Dijon or Yellow Mustard",
        "amount": "1 tbsp",
        "category": "Spices & Sauces",
        "standardKey": "mustard"
      },
      {
        "item": "Green Onions",
        "amount": "3 stalks",
        "category": "Produce",
        "standardKey": "green onion"
      },
      {
        "item": "Bread slices",
        "amount": "2-4 slices",
        "category": "Pantry & Grains",
        "standardKey": "bread"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for creamy classic egg salad sandwich.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "breakfast"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80",
    "likes": 157
  },
  {
    "id": "rec-047",
    "title": "Brown Sugar Glazed Pork Tenderloin",
    "category": "Dinner",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying brown sugar glazed pork tenderloin prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Pork Cutlets",
        "amount": "1 lb",
        "category": "Proteins",
        "standardKey": "pork"
      },
      {
        "item": "Brown Sugar",
        "amount": "1 portion",
        "category": "Produce",
        "standardKey": "brown sugar"
      },
      {
        "item": "Garlic (minced)",
        "amount": "3 cloves",
        "category": "Produce",
        "standardKey": "garlic"
      },
      {
        "item": "Soy Sauce",
        "amount": "2 tbsp",
        "category": "Spices & Sauces",
        "standardKey": "soy sauce"
      },
      {
        "item": "Olive Oil",
        "amount": "2 tbsp",
        "category": "Pantry & Grains",
        "standardKey": "olive oil"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for brown sugar glazed pork tenderloin.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "dinner"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80",
    "likes": 205
  },
  {
    "id": "rec-048",
    "title": "10-Minute Margherita Pita Pizzas",
    "category": "Snacks & Quick Bites",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying 10-minute margherita pita pizzas prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Pita Bread",
        "amount": "1 portion",
        "category": "Produce",
        "standardKey": "pita bread"
      },
      {
        "item": "Marinara / Tomato Sauce",
        "amount": "1 cup",
        "category": "Pantry & Grains",
        "standardKey": "tomato sauce"
      },
      {
        "item": "Cheddar or Mozzarella",
        "amount": "1 cup",
        "category": "Dairy",
        "standardKey": "cheese"
      },
      {
        "item": "Fresh Basil",
        "amount": "1/4 cup",
        "category": "Produce",
        "standardKey": "basil"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for 10-minute margherita pita pizzas.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "snacks-&-quick-bites"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    "likes": 220
  },
  {
    "id": "rec-049",
    "title": "Turkey & Melted Swiss Sandwich",
    "category": "Snacks & Quick Bites",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying turkey & melted swiss sandwich prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Sliced Turkey",
        "amount": "1/2 lb",
        "category": "Proteins",
        "standardKey": "turkey"
      },
      {
        "item": "Cheddar or Mozzarella",
        "amount": "1 cup",
        "category": "Dairy",
        "standardKey": "cheese"
      },
      {
        "item": "Bread slices",
        "amount": "2-4 slices",
        "category": "Pantry & Grains",
        "standardKey": "bread"
      },
      {
        "item": "Butter",
        "amount": "2 tbsp",
        "category": "Dairy",
        "standardKey": "butter"
      },
      {
        "item": "Dijon or Yellow Mustard",
        "amount": "1 tbsp",
        "category": "Spices & Sauces",
        "standardKey": "mustard"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for turkey & melted swiss sandwich.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "snacks-&-quick-bites"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
    "likes": 235
  },
  {
    "id": "rec-050",
    "title": "Honey Garlic Roasted Rainbow Carrots",
    "category": "15-Min Meals",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying honey garlic roasted rainbow carrots prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Carrots",
        "amount": "2 whole",
        "category": "Produce",
        "standardKey": "carrots"
      },
      {
        "item": "Honey",
        "amount": "2 tbsp",
        "category": "Pantry & Grains",
        "standardKey": "honey"
      },
      {
        "item": "Garlic (minced)",
        "amount": "3 cloves",
        "category": "Produce",
        "standardKey": "garlic"
      },
      {
        "item": "Butter",
        "amount": "2 tbsp",
        "category": "Dairy",
        "standardKey": "butter"
      },
      {
        "item": "Fresh Parsley",
        "amount": "2 tbsp",
        "category": "Produce",
        "standardKey": "parsley"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for honey garlic roasted rainbow carrots.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "15-min-meals"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
    "likes": 143
  },
  {
    "id": "rec-051",
    "title": "Sesame Ginger Crispy Tofu Stir-Fry",
    "category": "Dinner",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying sesame ginger crispy tofu stir-fry prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Firm Tofu",
        "amount": "1 block",
        "category": "Proteins",
        "standardKey": "tofu"
      },
      {
        "item": "Soy Sauce",
        "amount": "2 tbsp",
        "category": "Spices & Sauces",
        "standardKey": "soy sauce"
      },
      {
        "item": "Broccoli florets",
        "amount": "3 cups",
        "category": "Produce",
        "standardKey": "broccoli"
      },
      {
        "item": "Garlic (minced)",
        "amount": "3 cloves",
        "category": "Produce",
        "standardKey": "garlic"
      },
      {
        "item": "Sesame Oil",
        "amount": "1 tsp",
        "category": "Spices & Sauces",
        "standardKey": "sesame oil"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for sesame ginger crispy tofu stir-fry.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "dinner"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
    "likes": 158
  },
  {
    "id": "rec-052",
    "title": "Panera-Style Creamy Broccoli Cheddar Soup",
    "category": "Soups & Salads",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying panera-style creamy broccoli cheddar soup prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Broccoli florets",
        "amount": "3 cups",
        "category": "Produce",
        "standardKey": "broccoli"
      },
      {
        "item": "Cheddar Cheese",
        "amount": "1 portion",
        "category": "Produce",
        "standardKey": "cheddar cheese"
      },
      {
        "item": "Milk",
        "amount": "1 cup",
        "category": "Dairy",
        "standardKey": "milk"
      },
      {
        "item": "Butter",
        "amount": "2 tbsp",
        "category": "Dairy",
        "standardKey": "butter"
      },
      {
        "item": "Chicken or Veggie Broth",
        "amount": "2 cups",
        "category": "Pantry & Grains",
        "standardKey": "broth"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for panera-style creamy broccoli cheddar soup.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "soups-&-salads"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
    "likes": 77
  },
  {
    "id": "rec-053",
    "title": "Grandma's Homestyle Chicken Noodle Soup",
    "category": "Soups & Salads",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying grandma's homestyle chicken noodle soup prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Chicken",
        "amount": "1 lb",
        "category": "Proteins",
        "standardKey": "chicken"
      },
      {
        "item": "Pasta (any shape)",
        "amount": "8 oz",
        "category": "Pantry & Grains",
        "standardKey": "pasta"
      },
      {
        "item": "Carrots",
        "amount": "2 whole",
        "category": "Produce",
        "standardKey": "carrots"
      },
      {
        "item": "Celery stalks",
        "amount": "2 stalks",
        "category": "Produce",
        "standardKey": "celery"
      },
      {
        "item": "Chicken or Veggie Broth",
        "amount": "2 cups",
        "category": "Pantry & Grains",
        "standardKey": "broth"
      },
      {
        "item": "Onion (diced)",
        "amount": "1 medium",
        "category": "Produce",
        "standardKey": "onion"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for grandma's homestyle chicken noodle soup.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "soups-&-salads"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
    "likes": 92
  },
  {
    "id": "rec-054",
    "title": "Warm Street Corn (Elote) Dip",
    "category": "Snacks & Quick Bites",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying warm street corn (elote) dip prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Sweet Corn",
        "amount": "1 can",
        "category": "Produce",
        "standardKey": "corn"
      },
      {
        "item": "Mayonnaise",
        "amount": "2 tbsp",
        "category": "Spices & Sauces",
        "standardKey": "mayonnaise"
      },
      {
        "item": "Sour Cream",
        "amount": "1/3 cup",
        "category": "Dairy",
        "standardKey": "sour cream"
      },
      {
        "item": "Cheddar or Mozzarella",
        "amount": "1 cup",
        "category": "Dairy",
        "standardKey": "cheese"
      },
      {
        "item": "Chili Powder",
        "amount": "1 portion",
        "category": "Produce",
        "standardKey": "chili powder"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for warm street corn (elote) dip.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "snacks-&-quick-bites"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=800&q=80",
    "likes": 203
  },
  {
    "id": "rec-055",
    "title": "Golden French Crepes with Berries",
    "category": "Breakfast",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying golden french crepes with berries prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "All-Purpose Flour",
        "amount": "2 tbsp",
        "category": "Pantry & Grains",
        "standardKey": "flour"
      },
      {
        "item": "Milk",
        "amount": "1 cup",
        "category": "Dairy",
        "standardKey": "milk"
      },
      {
        "item": "Eggs",
        "amount": "3 large",
        "category": "Proteins",
        "standardKey": "egg"
      },
      {
        "item": "Butter",
        "amount": "2 tbsp",
        "category": "Dairy",
        "standardKey": "butter"
      },
      {
        "item": "Berries",
        "amount": "1 portion",
        "category": "Produce",
        "standardKey": "berries"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for golden french crepes with berries.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "breakfast"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80",
    "likes": 100
  },
  {
    "id": "rec-056",
    "title": "Honey Butter Glazed Sweet Potato Wedges",
    "category": "15-Min Meals",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying honey butter glazed sweet potato wedges prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Potatoes",
        "amount": "3 medium",
        "category": "Produce",
        "standardKey": "potato"
      },
      {
        "item": "Honey",
        "amount": "2 tbsp",
        "category": "Pantry & Grains",
        "standardKey": "honey"
      },
      {
        "item": "Butter",
        "amount": "2 tbsp",
        "category": "Dairy",
        "standardKey": "butter"
      },
      {
        "item": "Cinnamon",
        "amount": "1 portion",
        "category": "Produce",
        "standardKey": "cinnamon"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for honey butter glazed sweet potato wedges.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "15-min-meals"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=800&q=80",
    "likes": 203
  },
  {
    "id": "rec-057",
    "title": "Garlic Lemon Butter Green Beans",
    "category": "15-Min Meals",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying garlic lemon butter green beans prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Fresh Green Beans",
        "amount": "1/2 lb",
        "category": "Produce",
        "standardKey": "green beans"
      },
      {
        "item": "Garlic (minced)",
        "amount": "3 cloves",
        "category": "Produce",
        "standardKey": "garlic"
      },
      {
        "item": "Butter",
        "amount": "2 tbsp",
        "category": "Dairy",
        "standardKey": "butter"
      },
      {
        "item": "Fresh Lemon",
        "amount": "1 whole",
        "category": "Produce",
        "standardKey": "lemon"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for garlic lemon butter green beans.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "15-min-meals"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
    "likes": 152
  },
  {
    "id": "rec-058",
    "title": "Crispy Ground Beef Tater Tot Casserole",
    "category": "One-Pot",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying crispy ground beef tater tot casserole prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Lean Ground Beef",
        "amount": "1 lb",
        "category": "Proteins",
        "standardKey": "ground beef"
      },
      {
        "item": "Potatoes",
        "amount": "3 medium",
        "category": "Produce",
        "standardKey": "potato"
      },
      {
        "item": "Cheddar or Mozzarella",
        "amount": "1 cup",
        "category": "Dairy",
        "standardKey": "cheese"
      },
      {
        "item": "Onion (diced)",
        "amount": "1 medium",
        "category": "Produce",
        "standardKey": "onion"
      },
      {
        "item": "Soup",
        "amount": "1 portion",
        "category": "Produce",
        "standardKey": "soup"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for crispy ground beef tater tot casserole.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "one-pot"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    "likes": 71
  },
  {
    "id": "rec-059",
    "title": "Greek Chicken Souvlaki Rice Bowls",
    "category": "Dinner",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying greek chicken souvlaki rice bowls prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Chicken",
        "amount": "1 lb",
        "category": "Proteins",
        "standardKey": "chicken"
      },
      {
        "item": "Jasmine or White Rice",
        "amount": "2 cups cooked",
        "category": "Pantry & Grains",
        "standardKey": "rice"
      },
      {
        "item": "Cucumber",
        "amount": "1 whole",
        "category": "Produce",
        "standardKey": "cucumber"
      },
      {
        "item": "Tomatoes (diced)",
        "amount": "2 medium",
        "category": "Produce",
        "standardKey": "tomato"
      },
      {
        "item": "Tzatziki",
        "amount": "1 portion",
        "category": "Produce",
        "standardKey": "tzatziki"
      },
      {
        "item": "Fresh Lemon",
        "amount": "1 whole",
        "category": "Produce",
        "standardKey": "lemon"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for greek chicken souvlaki rice bowls.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "dinner"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80",
    "likes": 53
  },
  {
    "id": "rec-060",
    "title": "Browned Butter Sausage & Kale Gnocchi",
    "category": "One-Pot",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying browned butter sausage & kale gnocchi prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Gnocchi",
        "amount": "1 portion",
        "category": "Produce",
        "standardKey": "gnocchi"
      },
      {
        "item": "Italian or Smoked Sausage",
        "amount": "1 lb",
        "category": "Proteins",
        "standardKey": "sausage"
      },
      {
        "item": "Kale",
        "amount": "1 portion",
        "category": "Produce",
        "standardKey": "kale"
      },
      {
        "item": "Butter",
        "amount": "2 tbsp",
        "category": "Dairy",
        "standardKey": "butter"
      },
      {
        "item": "Parmesan cheese",
        "amount": "1/3 cup",
        "category": "Dairy",
        "standardKey": "parmesan"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for browned butter sausage & kale gnocchi.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "one-pot"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1585325701165-351af916e581?auto=format&fit=crop&w=800&q=80",
    "likes": 134
  },
  {
    "id": "rec-061",
    "title": "Classic Baked Ziti with Melted Mozzarella",
    "category": "Pasta",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying classic baked ziti with melted mozzarella prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Pasta (any shape)",
        "amount": "8 oz",
        "category": "Pantry & Grains",
        "standardKey": "pasta"
      },
      {
        "item": "Lean Ground Beef",
        "amount": "1 lb",
        "category": "Proteins",
        "standardKey": "ground beef"
      },
      {
        "item": "Marinara / Tomato Sauce",
        "amount": "1 cup",
        "category": "Pantry & Grains",
        "standardKey": "tomato sauce"
      },
      {
        "item": "Cheddar or Mozzarella",
        "amount": "1 cup",
        "category": "Dairy",
        "standardKey": "cheese"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for classic baked ziti with melted mozzarella.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "pasta"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
    "likes": 215
  },
  {
    "id": "rec-062",
    "title": "Crispy Fish Tacos with Lime Crema",
    "category": "Dinner",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying crispy fish tacos with lime crema prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Cod",
        "amount": "1 portion",
        "category": "Produce",
        "standardKey": "cod"
      },
      {
        "item": "Flour Tortillas",
        "amount": "4 large",
        "category": "Pantry & Grains",
        "standardKey": "tortilla"
      },
      {
        "item": "Shredded Cabbage",
        "amount": "2 cups",
        "category": "Produce",
        "standardKey": "cabbage"
      },
      {
        "item": "Fresh Lime",
        "amount": "1 whole",
        "category": "Produce",
        "standardKey": "lime"
      },
      {
        "item": "Sour Cream",
        "amount": "1/3 cup",
        "category": "Dairy",
        "standardKey": "sour cream"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for crispy fish tacos with lime crema.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "dinner"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80",
    "likes": 164
  },
  {
    "id": "rec-063",
    "title": "Creamy Chicken Tortilla Chowder",
    "category": "Soups & Salads",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying creamy chicken tortilla chowder prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Chicken",
        "amount": "1 lb",
        "category": "Proteins",
        "standardKey": "chicken"
      },
      {
        "item": "Canned Black or White Beans",
        "amount": "1 can",
        "category": "Pantry & Grains",
        "standardKey": "beans"
      },
      {
        "item": "Sweet Corn",
        "amount": "1 can",
        "category": "Produce",
        "standardKey": "corn"
      },
      {
        "item": "Cheddar or Mozzarella",
        "amount": "1 cup",
        "category": "Dairy",
        "standardKey": "cheese"
      },
      {
        "item": "Chicken or Veggie Broth",
        "amount": "2 cups",
        "category": "Pantry & Grains",
        "standardKey": "broth"
      },
      {
        "item": "Flour Tortillas",
        "amount": "4 large",
        "category": "Pantry & Grains",
        "standardKey": "tortilla"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for creamy chicken tortilla chowder.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "soups-&-salads"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
    "likes": 179
  },
  {
    "id": "rec-064",
    "title": "Classic French Herb Rolled Omelette",
    "category": "Breakfast",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying classic french herb rolled omelette prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Eggs",
        "amount": "3 large",
        "category": "Proteins",
        "standardKey": "egg"
      },
      {
        "item": "Butter",
        "amount": "2 tbsp",
        "category": "Dairy",
        "standardKey": "butter"
      },
      {
        "item": "Cheddar or Mozzarella",
        "amount": "1 cup",
        "category": "Dairy",
        "standardKey": "cheese"
      },
      {
        "item": "Fresh Parsley",
        "amount": "2 tbsp",
        "category": "Produce",
        "standardKey": "parsley"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for classic french herb rolled omelette.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "breakfast"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&w=800&q=80",
    "likes": 65
  },
  {
    "id": "rec-065",
    "title": "Sweet Thai Chili Chicken Bites",
    "category": "15-Min Meals",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying sweet thai chili chicken bites prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Chicken",
        "amount": "1 lb",
        "category": "Proteins",
        "standardKey": "chicken"
      },
      {
        "item": "Sweet Chili Sauce",
        "amount": "1 portion",
        "category": "Produce",
        "standardKey": "sweet chili sauce"
      },
      {
        "item": "Soy Sauce",
        "amount": "2 tbsp",
        "category": "Spices & Sauces",
        "standardKey": "soy sauce"
      },
      {
        "item": "Garlic (minced)",
        "amount": "3 cloves",
        "category": "Produce",
        "standardKey": "garlic"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for sweet thai chili chicken bites.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "15-min-meals"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
    "likes": 47
  },
  {
    "id": "rec-066",
    "title": "Crispy Garlic Parmesan Brussels Sprouts",
    "category": "15-Min Meals",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying crispy garlic parmesan brussels sprouts prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Brussels Sprouts",
        "amount": "1 portion",
        "category": "Produce",
        "standardKey": "brussels sprouts"
      },
      {
        "item": "Parmesan cheese",
        "amount": "1/3 cup",
        "category": "Dairy",
        "standardKey": "parmesan"
      },
      {
        "item": "Olive Oil",
        "amount": "2 tbsp",
        "category": "Pantry & Grains",
        "standardKey": "olive oil"
      },
      {
        "item": "Garlic (minced)",
        "amount": "3 cloves",
        "category": "Produce",
        "standardKey": "garlic"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for crispy garlic parmesan brussels sprouts.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "15-min-meals"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
    "likes": 183
  },
  {
    "id": "rec-067",
    "title": "Balsamic Glazed Caprese Chicken Breasts",
    "category": "Dinner",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying balsamic glazed caprese chicken breasts prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Chicken",
        "amount": "1 lb",
        "category": "Proteins",
        "standardKey": "chicken"
      },
      {
        "item": "Tomatoes (diced)",
        "amount": "2 medium",
        "category": "Produce",
        "standardKey": "tomato"
      },
      {
        "item": "Cheddar or Mozzarella",
        "amount": "1 cup",
        "category": "Dairy",
        "standardKey": "cheese"
      },
      {
        "item": "Fresh Basil",
        "amount": "1/4 cup",
        "category": "Produce",
        "standardKey": "basil"
      },
      {
        "item": "Balsamic",
        "amount": "1 portion",
        "category": "Produce",
        "standardKey": "balsamic"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for balsamic glazed caprese chicken breasts.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "dinner"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
    "likes": 220
  },
  {
    "id": "rec-068",
    "title": "Bacon-Wrapped Tender Asparagus",
    "category": "Snacks & Quick Bites",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying bacon-wrapped tender asparagus prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Fresh Asparagus",
        "amount": "1 bunch",
        "category": "Produce",
        "standardKey": "asparagus"
      },
      {
        "item": "Crispy Bacon",
        "amount": "5 slices",
        "category": "Proteins",
        "standardKey": "bacon"
      },
      {
        "item": "Black Pepper",
        "amount": "1 portion",
        "category": "Produce",
        "standardKey": "black pepper"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for bacon-wrapped tender asparagus.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "snacks-&-quick-bites"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80",
    "likes": 158
  },
  {
    "id": "rec-069",
    "title": "Hearty Classic Beef Chili Con Carne",
    "category": "One-Pot",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying hearty classic beef chili con carne prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Lean Ground Beef",
        "amount": "1 lb",
        "category": "Proteins",
        "standardKey": "ground beef"
      },
      {
        "item": "Canned Black or White Beans",
        "amount": "1 can",
        "category": "Pantry & Grains",
        "standardKey": "beans"
      },
      {
        "item": "Tomatoes (diced)",
        "amount": "2 medium",
        "category": "Produce",
        "standardKey": "tomato"
      },
      {
        "item": "Onion (diced)",
        "amount": "1 medium",
        "category": "Produce",
        "standardKey": "onion"
      },
      {
        "item": "Chili Powder",
        "amount": "1 portion",
        "category": "Produce",
        "standardKey": "chili powder"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for hearty classic beef chili con carne.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "one-pot"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    "likes": 55
  },
  {
    "id": "rec-070",
    "title": "Creamy Garlic Avocado Pasta",
    "category": "Pasta",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying creamy garlic avocado pasta prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Pasta (any shape)",
        "amount": "8 oz",
        "category": "Pantry & Grains",
        "standardKey": "pasta"
      },
      {
        "item": "Ripe Avocado",
        "amount": "1 large",
        "category": "Produce",
        "standardKey": "avocado"
      },
      {
        "item": "Garlic (minced)",
        "amount": "3 cloves",
        "category": "Produce",
        "standardKey": "garlic"
      },
      {
        "item": "Fresh Lemon",
        "amount": "1 whole",
        "category": "Produce",
        "standardKey": "lemon"
      },
      {
        "item": "Olive Oil",
        "amount": "2 tbsp",
        "category": "Pantry & Grains",
        "standardKey": "olive oil"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for creamy garlic avocado pasta.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "pasta"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=800&q=80",
    "likes": 199
  },
  {
    "id": "rec-071",
    "title": "Slow-Cooker Pulled BBQ Chicken Sliders",
    "category": "Dinner",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying slow-cooker pulled bbq chicken sliders prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Chicken",
        "amount": "1 lb",
        "category": "Proteins",
        "standardKey": "chicken"
      },
      {
        "item": "BBQ Sauce",
        "amount": "1/3 cup",
        "category": "Spices & Sauces",
        "standardKey": "bbq sauce"
      },
      {
        "item": "Bread slices",
        "amount": "2-4 slices",
        "category": "Pantry & Grains",
        "standardKey": "bread"
      },
      {
        "item": "Coleslaw",
        "amount": "1 portion",
        "category": "Produce",
        "standardKey": "coleslaw"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for slow-cooker pulled bbq chicken sliders.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "dinner"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
    "likes": 162
  },
  {
    "id": "rec-072",
    "title": "Cheesy Broccoli Rice Bake",
    "category": "One-Pot",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying cheesy broccoli rice bake prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Jasmine or White Rice",
        "amount": "2 cups cooked",
        "category": "Pantry & Grains",
        "standardKey": "rice"
      },
      {
        "item": "Broccoli florets",
        "amount": "3 cups",
        "category": "Produce",
        "standardKey": "broccoli"
      },
      {
        "item": "Cheddar or Mozzarella",
        "amount": "1 cup",
        "category": "Dairy",
        "standardKey": "cheese"
      },
      {
        "item": "Milk",
        "amount": "1 cup",
        "category": "Dairy",
        "standardKey": "milk"
      },
      {
        "item": "Butter",
        "amount": "2 tbsp",
        "category": "Dairy",
        "standardKey": "butter"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for cheesy broccoli rice bake.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "one-pot"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80",
    "likes": 56
  },
  {
    "id": "rec-073",
    "title": "Crispy Breaded Eggplant Cutlets",
    "category": "15-Min Meals",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying crispy breaded eggplant cutlets prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Eggplant",
        "amount": "1 portion",
        "category": "Produce",
        "standardKey": "eggplant"
      },
      {
        "item": "Breadcrumbs",
        "amount": "1/2 cup",
        "category": "Pantry & Grains",
        "standardKey": "breadcrumbs"
      },
      {
        "item": "Parmesan cheese",
        "amount": "1/3 cup",
        "category": "Dairy",
        "standardKey": "parmesan"
      },
      {
        "item": "Eggs",
        "amount": "3 large",
        "category": "Proteins",
        "standardKey": "egg"
      },
      {
        "item": "Olive Oil",
        "amount": "2 tbsp",
        "category": "Pantry & Grains",
        "standardKey": "olive oil"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for crispy breaded eggplant cutlets.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "15-min-meals"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80",
    "likes": 159
  },
  {
    "id": "rec-074",
    "title": "Chilled Sesame Soba Noodle Salad",
    "category": "Soups & Salads",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying chilled sesame soba noodle salad prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Noodles",
        "amount": "1 portion",
        "category": "Produce",
        "standardKey": "noodles"
      },
      {
        "item": "Cucumber",
        "amount": "1 whole",
        "category": "Produce",
        "standardKey": "cucumber"
      },
      {
        "item": "Soy Sauce",
        "amount": "2 tbsp",
        "category": "Spices & Sauces",
        "standardKey": "soy sauce"
      },
      {
        "item": "Sesame Oil",
        "amount": "1 tsp",
        "category": "Spices & Sauces",
        "standardKey": "sesame oil"
      },
      {
        "item": "Green Onions",
        "amount": "3 stalks",
        "category": "Produce",
        "standardKey": "green onion"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for chilled sesame soba noodle salad.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "soups-&-salads"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
    "likes": 207
  },
  {
    "id": "rec-075",
    "title": "Golden Roasted Garlic Cauliflower",
    "category": "15-Min Meals",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying golden roasted garlic cauliflower prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Cauliflower",
        "amount": "1 portion",
        "category": "Produce",
        "standardKey": "cauliflower"
      },
      {
        "item": "Garlic (minced)",
        "amount": "3 cloves",
        "category": "Produce",
        "standardKey": "garlic"
      },
      {
        "item": "Olive Oil",
        "amount": "2 tbsp",
        "category": "Pantry & Grains",
        "standardKey": "olive oil"
      },
      {
        "item": "Parmesan cheese",
        "amount": "1/3 cup",
        "category": "Dairy",
        "standardKey": "parmesan"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for golden roasted garlic cauliflower.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "15-min-meals"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
    "likes": 60
  },
  {
    "id": "rec-076",
    "title": "15-Minute Chicken Noodle Skillet",
    "category": "One-Pot",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying 15-minute chicken noodle skillet prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Chicken",
        "amount": "1 lb",
        "category": "Proteins",
        "standardKey": "chicken"
      },
      {
        "item": "Pasta (any shape)",
        "amount": "8 oz",
        "category": "Pantry & Grains",
        "standardKey": "pasta"
      },
      {
        "item": "Chicken or Veggie Broth",
        "amount": "2 cups",
        "category": "Pantry & Grains",
        "standardKey": "broth"
      },
      {
        "item": "Garlic (minced)",
        "amount": "3 cloves",
        "category": "Produce",
        "standardKey": "garlic"
      },
      {
        "item": "Parmesan cheese",
        "amount": "1/3 cup",
        "category": "Dairy",
        "standardKey": "parmesan"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for 15-minute chicken noodle skillet.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "one-pot"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
    "likes": 86
  },
  {
    "id": "rec-077",
    "title": "Cinnamon Vanilla French Toast",
    "category": "Breakfast",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying cinnamon vanilla french toast prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Bread slices",
        "amount": "2-4 slices",
        "category": "Pantry & Grains",
        "standardKey": "bread"
      },
      {
        "item": "Eggs",
        "amount": "3 large",
        "category": "Proteins",
        "standardKey": "egg"
      },
      {
        "item": "Milk",
        "amount": "1 cup",
        "category": "Dairy",
        "standardKey": "milk"
      },
      {
        "item": "Cinnamon",
        "amount": "1 portion",
        "category": "Produce",
        "standardKey": "cinnamon"
      },
      {
        "item": "Syrup",
        "amount": "1 portion",
        "category": "Produce",
        "standardKey": "syrup"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for cinnamon vanilla french toast.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "breakfast"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=800&q=80",
    "likes": 90
  },
  {
    "id": "rec-078",
    "title": "Pan-Seared Ribeye with Rosemary Butter",
    "category": "Dinner",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying pan-seared ribeye with rosemary butter prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Steak or Beef",
        "amount": "1 lb",
        "category": "Proteins",
        "standardKey": "beef"
      },
      {
        "item": "Butter",
        "amount": "2 tbsp",
        "category": "Dairy",
        "standardKey": "butter"
      },
      {
        "item": "Garlic (minced)",
        "amount": "3 cloves",
        "category": "Produce",
        "standardKey": "garlic"
      },
      {
        "item": "Rosemary",
        "amount": "1 portion",
        "category": "Produce",
        "standardKey": "rosemary"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for pan-seared ribeye with rosemary butter.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "dinner"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
    "likes": 226
  },
  {
    "id": "rec-079",
    "title": "Mediterranean Hummus & Feta Platter",
    "category": "Snacks & Quick Bites",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying mediterranean hummus & feta platter prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Hummus",
        "amount": "1 portion",
        "category": "Produce",
        "standardKey": "hummus"
      },
      {
        "item": "Cucumber",
        "amount": "1 whole",
        "category": "Produce",
        "standardKey": "cucumber"
      },
      {
        "item": "Tomatoes (diced)",
        "amount": "2 medium",
        "category": "Produce",
        "standardKey": "tomato"
      },
      {
        "item": "Feta",
        "amount": "1 portion",
        "category": "Produce",
        "standardKey": "feta"
      },
      {
        "item": "Pita",
        "amount": "1 portion",
        "category": "Produce",
        "standardKey": "pita"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for mediterranean hummus & feta platter.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "snacks-&-quick-bites"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=800&q=80",
    "likes": 230
  },
  {
    "id": "rec-080",
    "title": "Burst Tomato & Whipped Ricotta Toast",
    "category": "Breakfast",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying burst tomato & whipped ricotta toast prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Bread slices",
        "amount": "2-4 slices",
        "category": "Pantry & Grains",
        "standardKey": "bread"
      },
      {
        "item": "Tomatoes (diced)",
        "amount": "2 medium",
        "category": "Produce",
        "standardKey": "tomato"
      },
      {
        "item": "Cheddar or Mozzarella",
        "amount": "1 cup",
        "category": "Dairy",
        "standardKey": "cheese"
      },
      {
        "item": "Garlic (minced)",
        "amount": "3 cloves",
        "category": "Produce",
        "standardKey": "garlic"
      },
      {
        "item": "Olive Oil",
        "amount": "2 tbsp",
        "category": "Pantry & Grains",
        "standardKey": "olive oil"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for burst tomato & whipped ricotta toast.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "breakfast"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80",
    "likes": 83
  },
  {
    "id": "rec-081",
    "title": "Buffalo Chicken Lettuce Cups",
    "category": "15-Min Meals",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying buffalo chicken lettuce cups prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Chicken",
        "amount": "1 lb",
        "category": "Proteins",
        "standardKey": "chicken"
      },
      {
        "item": "Sriracha or Hot Sauce",
        "amount": "2 tbsp",
        "category": "Spices & Sauces",
        "standardKey": "hot sauce"
      },
      {
        "item": "Romaine Lettuce",
        "amount": "1 head",
        "category": "Produce",
        "standardKey": "lettuce"
      },
      {
        "item": "Ranch",
        "amount": "1 portion",
        "category": "Produce",
        "standardKey": "ranch"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for buffalo chicken lettuce cups.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "15-min-meals"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
    "likes": 227
  },
  {
    "id": "rec-082",
    "title": "Cheesy Skillet Meatballs in Marinara",
    "category": "One-Pot",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying cheesy skillet meatballs in marinara prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Meatballs",
        "amount": "12 pcs",
        "category": "Proteins",
        "standardKey": "meatballs"
      },
      {
        "item": "Marinara / Tomato Sauce",
        "amount": "1 cup",
        "category": "Pantry & Grains",
        "standardKey": "tomato sauce"
      },
      {
        "item": "Cheddar or Mozzarella",
        "amount": "1 cup",
        "category": "Dairy",
        "standardKey": "cheese"
      },
      {
        "item": "Fresh Basil",
        "amount": "1/4 cup",
        "category": "Produce",
        "standardKey": "basil"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for cheesy skillet meatballs in marinara.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "one-pot"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80",
    "likes": 157
  },
  {
    "id": "rec-083",
    "title": "Honey Mustard Sheet-Pan Pork Chops",
    "category": "Dinner",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying honey mustard sheet-pan pork chops prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Pork Cutlets",
        "amount": "1 lb",
        "category": "Proteins",
        "standardKey": "pork"
      },
      {
        "item": "Honey",
        "amount": "2 tbsp",
        "category": "Pantry & Grains",
        "standardKey": "honey"
      },
      {
        "item": "Dijon or Yellow Mustard",
        "amount": "1 tbsp",
        "category": "Spices & Sauces",
        "standardKey": "mustard"
      },
      {
        "item": "Fresh Green Beans",
        "amount": "1/2 lb",
        "category": "Produce",
        "standardKey": "green beans"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for honey mustard sheet-pan pork chops.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "dinner"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    "likes": 172
  },
  {
    "id": "rec-084",
    "title": "Crispy Black Bean Quesadillas",
    "category": "15-Min Meals",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying crispy black bean quesadillas prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Canned Black or White Beans",
        "amount": "1 can",
        "category": "Pantry & Grains",
        "standardKey": "beans"
      },
      {
        "item": "Flour Tortillas",
        "amount": "4 large",
        "category": "Pantry & Grains",
        "standardKey": "tortilla"
      },
      {
        "item": "Cheddar or Mozzarella",
        "amount": "1 cup",
        "category": "Dairy",
        "standardKey": "cheese"
      },
      {
        "item": "Fresh Salsa",
        "amount": "1/2 cup",
        "category": "Spices & Sauces",
        "standardKey": "salsa"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for crispy black bean quesadillas.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "15-min-meals"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1618040996337-56904b7850b9?auto=format&fit=crop&w=800&q=80",
    "likes": 154
  },
  {
    "id": "rec-085",
    "title": "Loaded Party Sheet-Pan Nachos",
    "category": "Snacks & Quick Bites",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying loaded party sheet-pan nachos prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Tortilla Chips",
        "amount": "1 bag",
        "category": "Pantry & Grains",
        "standardKey": "chips"
      },
      {
        "item": "Lean Ground Beef",
        "amount": "1 lb",
        "category": "Proteins",
        "standardKey": "ground beef"
      },
      {
        "item": "Cheddar or Mozzarella",
        "amount": "1 cup",
        "category": "Dairy",
        "standardKey": "cheese"
      },
      {
        "item": "Jalapeno",
        "amount": "1 portion",
        "category": "Produce",
        "standardKey": "jalapeno"
      },
      {
        "item": "Sour Cream",
        "amount": "1/3 cup",
        "category": "Dairy",
        "standardKey": "sour cream"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for loaded party sheet-pan nachos.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "snacks-&-quick-bites"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=800&q=80",
    "likes": 191
  },
  {
    "id": "rec-086",
    "title": "Sausage Egg & Cheese English Muffins",
    "category": "Breakfast",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying sausage egg & cheese english muffins prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Italian or Smoked Sausage",
        "amount": "1 lb",
        "category": "Proteins",
        "standardKey": "sausage"
      },
      {
        "item": "Eggs",
        "amount": "3 large",
        "category": "Proteins",
        "standardKey": "egg"
      },
      {
        "item": "Cheddar or Mozzarella",
        "amount": "1 cup",
        "category": "Dairy",
        "standardKey": "cheese"
      },
      {
        "item": "Bread slices",
        "amount": "2-4 slices",
        "category": "Pantry & Grains",
        "standardKey": "bread"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for sausage egg & cheese english muffins.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "breakfast"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1585325701165-351af916e581?auto=format&fit=crop&w=800&q=80",
    "likes": 110
  },
  {
    "id": "rec-087",
    "title": "Crispy Lemon Herb Chicken Thighs",
    "category": "Dinner",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying crispy lemon herb chicken thighs prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Chicken",
        "amount": "1 lb",
        "category": "Proteins",
        "standardKey": "chicken"
      },
      {
        "item": "Fresh Lemon",
        "amount": "1 whole",
        "category": "Produce",
        "standardKey": "lemon"
      },
      {
        "item": "Garlic (minced)",
        "amount": "3 cloves",
        "category": "Produce",
        "standardKey": "garlic"
      },
      {
        "item": "Olive Oil",
        "amount": "2 tbsp",
        "category": "Pantry & Grains",
        "standardKey": "olive oil"
      },
      {
        "item": "Rosemary",
        "amount": "1 portion",
        "category": "Produce",
        "standardKey": "rosemary"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for crispy lemon herb chicken thighs.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "dinner"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
    "likes": 103
  },
  {
    "id": "rec-088",
    "title": "Creamy Garlic Mashed Potatoes",
    "category": "15-Min Meals",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying creamy garlic mashed potatoes prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Potatoes",
        "amount": "3 medium",
        "category": "Produce",
        "standardKey": "potato"
      },
      {
        "item": "Butter",
        "amount": "2 tbsp",
        "category": "Dairy",
        "standardKey": "butter"
      },
      {
        "item": "Milk",
        "amount": "1 cup",
        "category": "Dairy",
        "standardKey": "milk"
      },
      {
        "item": "Garlic (minced)",
        "amount": "3 cloves",
        "category": "Produce",
        "standardKey": "garlic"
      },
      {
        "item": "Cream Cheese",
        "amount": "4 oz",
        "category": "Dairy",
        "standardKey": "cream cheese"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for creamy garlic mashed potatoes.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "15-min-meals"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=800&q=80",
    "likes": 107
  },
  {
    "id": "rec-089",
    "title": "Raw Pesto Zucchini Ribbon Salad",
    "category": "Soups & Salads",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying raw pesto zucchini ribbon salad prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Zucchini",
        "amount": "1 medium",
        "category": "Produce",
        "standardKey": "zucchini"
      },
      {
        "item": "Basil Pesto",
        "amount": "1/4 cup",
        "category": "Pantry & Grains",
        "standardKey": "pesto"
      },
      {
        "item": "Pine Nuts",
        "amount": "1 portion",
        "category": "Produce",
        "standardKey": "pine nuts"
      },
      {
        "item": "Parmesan cheese",
        "amount": "1/3 cup",
        "category": "Dairy",
        "standardKey": "parmesan"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for raw pesto zucchini ribbon salad.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "soups-&-salads"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    "likes": 166
  },
  {
    "id": "rec-090",
    "title": "Classic Spaghetti Aglio e Olio",
    "category": "Pasta",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying classic spaghetti aglio e olio prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Pasta (any shape)",
        "amount": "8 oz",
        "category": "Pantry & Grains",
        "standardKey": "pasta"
      },
      {
        "item": "Garlic (minced)",
        "amount": "3 cloves",
        "category": "Produce",
        "standardKey": "garlic"
      },
      {
        "item": "Olive Oil",
        "amount": "2 tbsp",
        "category": "Pantry & Grains",
        "standardKey": "olive oil"
      },
      {
        "item": "Fresh Parsley",
        "amount": "2 tbsp",
        "category": "Produce",
        "standardKey": "parsley"
      },
      {
        "item": "Red Pepper Flakes",
        "amount": "1/2 tsp",
        "category": "Spices & Sauces",
        "standardKey": "chili flakes"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for classic spaghetti aglio e olio.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "pasta"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80",
    "likes": 192
  },
  {
    "id": "rec-091",
    "title": "Berry Burst Acai Smoothie Bowl",
    "category": "Breakfast",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying berry burst acai smoothie bowl prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Berries",
        "amount": "1 portion",
        "category": "Produce",
        "standardKey": "berries"
      },
      {
        "item": "Banana",
        "amount": "1 portion",
        "category": "Produce",
        "standardKey": "banana"
      },
      {
        "item": "Milk",
        "amount": "1 cup",
        "category": "Dairy",
        "standardKey": "milk"
      },
      {
        "item": "Rolled Oats",
        "amount": "1 cup",
        "category": "Pantry & Grains",
        "standardKey": "oats"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for berry burst acai smoothie bowl.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "breakfast"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80",
    "likes": 229
  },
  {
    "id": "rec-092",
    "title": "Cinnamon Apple Baked Oatmeal",
    "category": "Breakfast",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying cinnamon apple baked oatmeal prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Rolled Oats",
        "amount": "1 cup",
        "category": "Pantry & Grains",
        "standardKey": "oats"
      },
      {
        "item": "Milk",
        "amount": "1 cup",
        "category": "Dairy",
        "standardKey": "milk"
      },
      {
        "item": "Apples",
        "amount": "1 portion",
        "category": "Produce",
        "standardKey": "apples"
      },
      {
        "item": "Cinnamon",
        "amount": "1 portion",
        "category": "Produce",
        "standardKey": "cinnamon"
      },
      {
        "item": "Honey",
        "amount": "2 tbsp",
        "category": "Pantry & Grains",
        "standardKey": "honey"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for cinnamon apple baked oatmeal.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "breakfast"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=800&q=80",
    "likes": 49
  },
  {
    "id": "rec-093",
    "title": "Crispy Baked Zucchini Fries with Aioli",
    "category": "Snacks & Quick Bites",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying crispy baked zucchini fries with aioli prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Zucchini",
        "amount": "1 medium",
        "category": "Produce",
        "standardKey": "zucchini"
      },
      {
        "item": "Breadcrumbs",
        "amount": "1/2 cup",
        "category": "Pantry & Grains",
        "standardKey": "breadcrumbs"
      },
      {
        "item": "Parmesan cheese",
        "amount": "1/3 cup",
        "category": "Dairy",
        "standardKey": "parmesan"
      },
      {
        "item": "Eggs",
        "amount": "3 large",
        "category": "Proteins",
        "standardKey": "egg"
      },
      {
        "item": "Garlic (minced)",
        "amount": "3 cloves",
        "category": "Produce",
        "standardKey": "garlic"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for crispy baked zucchini fries with aioli.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "snacks-&-quick-bites"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=800&q=80",
    "likes": 196
  },
  {
    "id": "rec-094",
    "title": "Honey Sriracha Roasted Crunchy Chickpeas",
    "category": "Snacks & Quick Bites",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying honey sriracha roasted crunchy chickpeas prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Chickpeas",
        "amount": "1 portion",
        "category": "Produce",
        "standardKey": "chickpeas"
      },
      {
        "item": "Honey",
        "amount": "2 tbsp",
        "category": "Pantry & Grains",
        "standardKey": "honey"
      },
      {
        "item": "Sriracha or Hot Sauce",
        "amount": "2 tbsp",
        "category": "Spices & Sauces",
        "standardKey": "hot sauce"
      },
      {
        "item": "Olive Oil",
        "amount": "2 tbsp",
        "category": "Pantry & Grains",
        "standardKey": "olive oil"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for honey sriracha roasted crunchy chickpeas.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "snacks-&-quick-bites"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=800&q=80",
    "likes": 60
  },
  {
    "id": "rec-095",
    "title": "5-Minute Microwave Chocolate Mug Cake",
    "category": "Snacks & Quick Bites",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying 5-minute microwave chocolate mug cake prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "All-Purpose Flour",
        "amount": "2 tbsp",
        "category": "Pantry & Grains",
        "standardKey": "flour"
      },
      {
        "item": "Cocoa Powder",
        "amount": "1 portion",
        "category": "Produce",
        "standardKey": "cocoa powder"
      },
      {
        "item": "Sugar",
        "amount": "1 portion",
        "category": "Produce",
        "standardKey": "sugar"
      },
      {
        "item": "Milk",
        "amount": "1 cup",
        "category": "Dairy",
        "standardKey": "milk"
      },
      {
        "item": "Butter",
        "amount": "2 tbsp",
        "category": "Dairy",
        "standardKey": "butter"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for 5-minute microwave chocolate mug cake.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "snacks-&-quick-bites"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=800&q=80",
    "likes": 64
  },
  {
    "id": "rec-096",
    "title": "Classic Shredded Chicken Quesadillas",
    "category": "15-Min Meals",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying classic shredded chicken quesadillas prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Chicken",
        "amount": "1 lb",
        "category": "Proteins",
        "standardKey": "chicken"
      },
      {
        "item": "Cheddar or Mozzarella",
        "amount": "1 cup",
        "category": "Dairy",
        "standardKey": "cheese"
      },
      {
        "item": "Flour Tortillas",
        "amount": "4 large",
        "category": "Pantry & Grains",
        "standardKey": "tortilla"
      },
      {
        "item": "Fresh Salsa",
        "amount": "1/2 cup",
        "category": "Spices & Sauces",
        "standardKey": "salsa"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for classic shredded chicken quesadillas.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "15-min-meals"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1618040996337-56904b7850b9?auto=format&fit=crop&w=800&q=80",
    "likes": 90
  },
  {
    "id": "rec-097",
    "title": "Crispy Bacon & Sharp Cheddar Omelet",
    "category": "Breakfast",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying crispy bacon & sharp cheddar omelet prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Eggs",
        "amount": "3 large",
        "category": "Proteins",
        "standardKey": "egg"
      },
      {
        "item": "Crispy Bacon",
        "amount": "5 slices",
        "category": "Proteins",
        "standardKey": "bacon"
      },
      {
        "item": "Cheddar or Mozzarella",
        "amount": "1 cup",
        "category": "Dairy",
        "standardKey": "cheese"
      },
      {
        "item": "Butter",
        "amount": "2 tbsp",
        "category": "Dairy",
        "standardKey": "butter"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for crispy bacon & sharp cheddar omelet.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "breakfast"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&w=800&q=80",
    "likes": 116
  },
  {
    "id": "rec-098",
    "title": "Lemon Garlic Butter Shrimp & Rice",
    "category": "Dinner",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying lemon garlic butter shrimp & rice prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Raw Shrimp (peeled)",
        "amount": "1 lb",
        "category": "Proteins",
        "standardKey": "shrimp"
      },
      {
        "item": "Garlic (minced)",
        "amount": "3 cloves",
        "category": "Produce",
        "standardKey": "garlic"
      },
      {
        "item": "Butter",
        "amount": "2 tbsp",
        "category": "Dairy",
        "standardKey": "butter"
      },
      {
        "item": "Fresh Lemon",
        "amount": "1 whole",
        "category": "Produce",
        "standardKey": "lemon"
      },
      {
        "item": "Jasmine or White Rice",
        "amount": "2 cups cooked",
        "category": "Pantry & Grains",
        "standardKey": "rice"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for lemon garlic butter shrimp & rice.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "dinner"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80",
    "likes": 131
  },
  {
    "id": "rec-099",
    "title": "Spicy Sriracha Mayo Tuna Bowl",
    "category": "15-Min Meals",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying spicy sriracha mayo tuna bowl prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Canned Tuna",
        "amount": "2 cans",
        "category": "Proteins",
        "standardKey": "tuna"
      },
      {
        "item": "Jasmine or White Rice",
        "amount": "2 cups cooked",
        "category": "Pantry & Grains",
        "standardKey": "rice"
      },
      {
        "item": "Mayonnaise",
        "amount": "2 tbsp",
        "category": "Spices & Sauces",
        "standardKey": "mayonnaise"
      },
      {
        "item": "Sriracha or Hot Sauce",
        "amount": "2 tbsp",
        "category": "Spices & Sauces",
        "standardKey": "hot sauce"
      },
      {
        "item": "Green Onions",
        "amount": "3 stalks",
        "category": "Produce",
        "standardKey": "green onion"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for spicy sriracha mayo tuna bowl.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "15-min-meals"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1535400255456-984241443b29?auto=format&fit=crop&w=800&q=80",
    "likes": 124
  },
  {
    "id": "rec-100",
    "title": "Skillet Cheeseburger Macaroni",
    "category": "One-Pot",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying skillet cheeseburger macaroni prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Lean Ground Beef",
        "amount": "1 lb",
        "category": "Proteins",
        "standardKey": "ground beef"
      },
      {
        "item": "Pasta (any shape)",
        "amount": "8 oz",
        "category": "Pantry & Grains",
        "standardKey": "pasta"
      },
      {
        "item": "Cheddar or Mozzarella",
        "amount": "1 cup",
        "category": "Dairy",
        "standardKey": "cheese"
      },
      {
        "item": "Onion (diced)",
        "amount": "1 medium",
        "category": "Produce",
        "standardKey": "onion"
      },
      {
        "item": "Milk",
        "amount": "1 cup",
        "category": "Dairy",
        "standardKey": "milk"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for skillet cheeseburger macaroni.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "one-pot"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80",
    "likes": 161
  },
  {
    "id": "rec-101",
    "title": "Honey Glazed Brussels Sprouts with Bacon",
    "category": "15-Min Meals",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying honey glazed brussels sprouts with bacon prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Brussels Sprouts",
        "amount": "1 portion",
        "category": "Produce",
        "standardKey": "brussels sprouts"
      },
      {
        "item": "Crispy Bacon",
        "amount": "5 slices",
        "category": "Proteins",
        "standardKey": "bacon"
      },
      {
        "item": "Honey",
        "amount": "2 tbsp",
        "category": "Pantry & Grains",
        "standardKey": "honey"
      },
      {
        "item": "Olive Oil",
        "amount": "2 tbsp",
        "category": "Pantry & Grains",
        "standardKey": "olive oil"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for honey glazed brussels sprouts with bacon.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "15-min-meals"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
    "likes": 124
  },
  {
    "id": "rec-102",
    "title": "Crispy Sunny Egg Breakfast Tacos",
    "category": "Breakfast",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying crispy sunny egg breakfast tacos prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Eggs",
        "amount": "3 large",
        "category": "Proteins",
        "standardKey": "egg"
      },
      {
        "item": "Flour Tortillas",
        "amount": "4 large",
        "category": "Pantry & Grains",
        "standardKey": "tortilla"
      },
      {
        "item": "Cheddar or Mozzarella",
        "amount": "1 cup",
        "category": "Dairy",
        "standardKey": "cheese"
      },
      {
        "item": "Fresh Salsa",
        "amount": "1/2 cup",
        "category": "Spices & Sauces",
        "standardKey": "salsa"
      },
      {
        "item": "Ripe Avocado",
        "amount": "1 large",
        "category": "Produce",
        "standardKey": "avocado"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for crispy sunny egg breakfast tacos.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "breakfast"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80",
    "likes": 73
  },
  {
    "id": "rec-103",
    "title": "Creamy Garlic Parmesan Chicken Skillet",
    "category": "Dinner",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying creamy garlic parmesan chicken skillet prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Chicken",
        "amount": "1 lb",
        "category": "Proteins",
        "standardKey": "chicken"
      },
      {
        "item": "Garlic (minced)",
        "amount": "3 cloves",
        "category": "Produce",
        "standardKey": "garlic"
      },
      {
        "item": "Heavy Cream",
        "amount": "1/2 cup",
        "category": "Dairy",
        "standardKey": "heavy cream"
      },
      {
        "item": "Parmesan cheese",
        "amount": "1/3 cup",
        "category": "Dairy",
        "standardKey": "parmesan"
      },
      {
        "item": "Fresh Baby Spinach",
        "amount": "2 cups",
        "category": "Produce",
        "standardKey": "spinach"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for creamy garlic parmesan chicken skillet.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "dinner"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
    "likes": 176
  },
  {
    "id": "rec-104",
    "title": "Toasted Caprese Chicken Panini",
    "category": "Snacks & Quick Bites",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying toasted caprese chicken panini prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Chicken",
        "amount": "1 lb",
        "category": "Proteins",
        "standardKey": "chicken"
      },
      {
        "item": "Bread slices",
        "amount": "2-4 slices",
        "category": "Pantry & Grains",
        "standardKey": "bread"
      },
      {
        "item": "Cheddar or Mozzarella",
        "amount": "1 cup",
        "category": "Dairy",
        "standardKey": "cheese"
      },
      {
        "item": "Tomatoes (diced)",
        "amount": "2 medium",
        "category": "Produce",
        "standardKey": "tomato"
      },
      {
        "item": "Basil Pesto",
        "amount": "1/4 cup",
        "category": "Pantry & Grains",
        "standardKey": "pesto"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for toasted caprese chicken panini.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "snacks-&-quick-bites"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
    "likes": 125
  },
  {
    "id": "rec-105",
    "title": "Sheet-Pan Sausage & Sweet Potato Hash",
    "category": "Dinner",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying sheet-pan sausage & sweet potato hash prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Italian or Smoked Sausage",
        "amount": "1 lb",
        "category": "Proteins",
        "standardKey": "sausage"
      },
      {
        "item": "Potatoes",
        "amount": "3 medium",
        "category": "Produce",
        "standardKey": "potato"
      },
      {
        "item": "Onion (diced)",
        "amount": "1 medium",
        "category": "Produce",
        "standardKey": "onion"
      },
      {
        "item": "Olive Oil",
        "amount": "2 tbsp",
        "category": "Pantry & Grains",
        "standardKey": "olive oil"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for sheet-pan sausage & sweet potato hash.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "dinner"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1585325701165-351af916e581?auto=format&fit=crop&w=800&q=80",
    "likes": 44
  },
  {
    "id": "rec-106",
    "title": "Warm Cinnamon Honey Butter Toast",
    "category": "Breakfast",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying warm cinnamon honey butter toast prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Bread slices",
        "amount": "2-4 slices",
        "category": "Pantry & Grains",
        "standardKey": "bread"
      },
      {
        "item": "Butter",
        "amount": "2 tbsp",
        "category": "Dairy",
        "standardKey": "butter"
      },
      {
        "item": "Honey",
        "amount": "2 tbsp",
        "category": "Pantry & Grains",
        "standardKey": "honey"
      },
      {
        "item": "Cinnamon",
        "amount": "1 portion",
        "category": "Produce",
        "standardKey": "cinnamon"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for warm cinnamon honey butter toast.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "breakfast"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80",
    "likes": 221
  },
  {
    "id": "rec-107",
    "title": "10-Minute Egg Drop Soup with Green Onions",
    "category": "Soups & Salads",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying 10-minute egg drop soup with green onions prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Eggs",
        "amount": "3 large",
        "category": "Proteins",
        "standardKey": "egg"
      },
      {
        "item": "Chicken or Veggie Broth",
        "amount": "2 cups",
        "category": "Pantry & Grains",
        "standardKey": "broth"
      },
      {
        "item": "Green Onions",
        "amount": "3 stalks",
        "category": "Produce",
        "standardKey": "green onion"
      },
      {
        "item": "Soy Sauce",
        "amount": "2 tbsp",
        "category": "Spices & Sauces",
        "standardKey": "soy sauce"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for 10-minute egg drop soup with green onions.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "soups-&-salads"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
    "likes": 162
  },
  {
    "id": "rec-108",
    "title": "Classic Garlic Butter Parmesan Noodles",
    "category": "Pasta",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying classic garlic butter parmesan noodles prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Pasta (any shape)",
        "amount": "8 oz",
        "category": "Pantry & Grains",
        "standardKey": "pasta"
      },
      {
        "item": "Butter",
        "amount": "2 tbsp",
        "category": "Dairy",
        "standardKey": "butter"
      },
      {
        "item": "Garlic (minced)",
        "amount": "3 cloves",
        "category": "Produce",
        "standardKey": "garlic"
      },
      {
        "item": "Parmesan cheese",
        "amount": "1/3 cup",
        "category": "Dairy",
        "standardKey": "parmesan"
      },
      {
        "item": "Fresh Parsley",
        "amount": "2 tbsp",
        "category": "Produce",
        "standardKey": "parsley"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for classic garlic butter parmesan noodles.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "pasta"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
    "likes": 166
  },
  {
    "id": "rec-109",
    "title": "Crispy Breaded Mozzarella Bites",
    "category": "Snacks & Quick Bites",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying crispy breaded mozzarella bites prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Cheddar or Mozzarella",
        "amount": "1 cup",
        "category": "Dairy",
        "standardKey": "cheese"
      },
      {
        "item": "Breadcrumbs",
        "amount": "1/2 cup",
        "category": "Pantry & Grains",
        "standardKey": "breadcrumbs"
      },
      {
        "item": "Eggs",
        "amount": "3 large",
        "category": "Proteins",
        "standardKey": "egg"
      },
      {
        "item": "Marinara / Tomato Sauce",
        "amount": "1 cup",
        "category": "Pantry & Grains",
        "standardKey": "tomato sauce"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for crispy breaded mozzarella bites.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "snacks-&-quick-bites"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=800&q=80",
    "likes": 126
  },
  {
    "id": "rec-110",
    "title": "Roasted Garlic Tomato Basil Soup",
    "category": "Soups & Salads",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "description": "Quick, easy, and satisfying roasted garlic tomato basil soup prepared with simple fresh ingredients.",
    "ingredients": [
      {
        "item": "Tomatoes (diced)",
        "amount": "2 medium",
        "category": "Produce",
        "standardKey": "tomato"
      },
      {
        "item": "Garlic (minced)",
        "amount": "3 cloves",
        "category": "Produce",
        "standardKey": "garlic"
      },
      {
        "item": "Heavy Cream",
        "amount": "1/2 cup",
        "category": "Dairy",
        "standardKey": "heavy cream"
      },
      {
        "item": "Fresh Basil",
        "amount": "1/4 cup",
        "category": "Produce",
        "standardKey": "basil"
      },
      {
        "item": "Chicken or Veggie Broth",
        "amount": "2 cups",
        "category": "Pantry & Grains",
        "standardKey": "broth"
      }
    ],
    "instructions": [
      "Prepare all ingredients: chop produce and measure out seasonings.",
      "Heat skillet, pot, or preheat oven as required for roasted garlic tomato basil soup.",
      "Cook according to step-by-step method ensuring ingredients brown evenly and flavors meld.",
      "Season to taste with salt and black pepper.",
      "Serve hot and fresh immediately."
    ],
    "tags": [
      "quick",
      "easy",
      "fridge-staple",
      "soups-&-salads"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
    "likes": 174
  }
];

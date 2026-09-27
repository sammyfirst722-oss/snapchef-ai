import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetFile = path.join(__dirname, '..', 'lib', 'recipes-data.ts');
let content = fs.readFileSync(targetFile, 'utf8');

const match = content.match(/export const RECIPES_DATA: Recipe\[\] = (\[[\s\S]*?\]);/);
if (!match) {
  console.error("Could not find RECIPES_DATA array in recipes-data.ts");
  process.exit(1);
}

// We will generate 65 simple comfort recipes with everyday 2-4 staples
const SIMPLE_MEALS = [
  {
    title: "Silky Cheddar Scrambled Eggs",
    category: "Breakfast",
    prepTime: "2 mins",
    cookTime: "4 mins",
    servings: 2,
    difficulty: "Easy",
    description: "Soft, custardy scrambled eggs folded with melted sharp cheddar cheese and fresh chives.",
    ingredients: [
      { item: "Eggs", amount: "4 large", category: "Proteins", standardKey: "eggs" },
      { item: "Cheddar Cheese (shredded)", amount: "1/2 cup", category: "Dairy", standardKey: "cheese" },
      { item: "Butter", amount: "1 tbsp", category: "Dairy", standardKey: "butter" },
      { item: "Black Pepper", amount: "1/4 tsp", category: "Spices & Sauces", standardKey: "pepper" }
    ],
    instructions: [
      "Whisk eggs in a bowl with a pinch of black pepper until completely smooth.",
      "Melt butter in a non-stick skillet over gentle medium-low heat.",
      "Pour in eggs and let set for 20 seconds, then gently push curds from the edges toward the center.",
      "Remove pan from heat while eggs are still glossy; fold in shredded cheddar until gooey and warm."
    ],
    tags: ["breakfast", "eggs", "cheese", "quick", "easy", "keto-friendly"],
    imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
    likes: 312
  },
  {
    title: "Crispy Golden Grilled Cheese",
    category: "15-Min Meals",
    prepTime: "2 mins",
    cookTime: "6 mins",
    servings: 1,
    difficulty: "Easy",
    description: "Buttery, golden toasted bread stuffed with bubbling melted cheddar cheese.",
    ingredients: [
      { item: "Sliced Bread", amount: "2 slices", category: "Pantry & Grains", standardKey: "bread" },
      { item: "Cheddar or American Cheese", amount: "2-3 slices", category: "Dairy", standardKey: "cheese" },
      { item: "Butter", amount: "1.5 tbsp softened", category: "Dairy", standardKey: "butter" }
    ],
    instructions: [
      "Spread softened butter generously on one side of each bread slice.",
      "Place one slice butter-side-down in a skillet over medium heat.",
      "Layer cheese slices on top, then cap with the second slice butter-side-up.",
      "Cook for 3 minutes until golden brown, flip gently, and cook 2-3 more minutes until cheese is fully melted."
    ],
    tags: ["lunch", "comfort-food", "cheese", "quick", "kid-friendly"],
    imageUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
    likes: 420
  },
  {
    title: "10-Minute Egg Fried Rice",
    category: "Quick Dinners",
    prepTime: "3 mins",
    cookTime: "7 mins",
    servings: 2,
    difficulty: "Easy",
    description: "Fluffy leftover rice stir-fried with golden scrambled eggs, soy sauce, and garlic.",
    ingredients: [
      { item: "Cooked White or Brown Rice", amount: "2 cups cold/leftover", category: "Pantry & Grains", standardKey: "rice" },
      { item: "Eggs", amount: "2 large, beaten", category: "Proteins", standardKey: "eggs" },
      { item: "Soy Sauce", amount: "2 tbsp", category: "Spices & Sauces", standardKey: "soy sauce" },
      { item: "Butter or Cooking Oil", amount: "1.5 tbsp", category: "Dairy", standardKey: "butter" },
      { item: "Garlic (minced)", amount: "2 cloves", category: "Produce", standardKey: "garlic" }
    ],
    instructions: [
      "Heat half the butter/oil in a skillet over high heat, scramble the eggs quickly until soft, and remove to a plate.",
      "Add remaining oil to the pan, toss in minced garlic for 30 seconds until fragrant.",
      "Add cold rice and press flat with spatula to crisp up, frying for 3-4 minutes.",
      "Drizzle soy sauce over rice, fold the scrambled eggs back in, and toss vigorously for 1 minute before serving."
    ],
    tags: ["dinner", "rice", "eggs", "asian", "leftovers", "budget"],
    imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80",
    likes: 388
  },
  {
    title: "Classic Garlic Butter Parmesan Pasta",
    category: "15-Min Meals",
    prepTime: "2 mins",
    cookTime: "10 mins",
    servings: 2,
    difficulty: "Easy",
    description: "Tender pasta swirled in an aromatic sauce of melted butter, minced garlic, and savory parmesan.",
    ingredients: [
      { item: "Pasta (Spaghetti or Penne)", amount: "8 oz", category: "Pantry & Grains", standardKey: "pasta" },
      { item: "Garlic (sliced or minced)", amount: "4 cloves", category: "Produce", standardKey: "garlic" },
      { item: "Butter", amount: "3 tbsp", category: "Dairy", standardKey: "butter" },
      { item: "Parmesan or Shredded Cheese", amount: "1/3 cup", category: "Dairy", standardKey: "cheese" }
    ],
    instructions: [
      "Boil pasta in salted water until al dente. Reserve 1/4 cup of starchy pasta water before draining.",
      "Melt butter in a skillet over medium heat; add garlic and cook for 1 minute until fragrant but not browned.",
      "Add drained pasta and reserved pasta water to the garlic butter skillet.",
      "Stir in cheese vigorously until a glossy, creamy sauce coats every noodle."
    ],
    tags: ["pasta", "italian", "dinner", "vegetarian", "quick"],
    imageUrl: "https://images.unsplash.com/photo-1621996346565-e3d5d6281691?auto=format&fit=crop&w=800&q=80",
    likes: 295
  },
  {
    title: "Crispy Cheesy Chicken Quesadilla",
    category: "15-Min Meals",
    prepTime: "3 mins",
    cookTime: "6 mins",
    servings: 1,
    difficulty: "Easy",
    description: "Crisp flour tortilla packed with shredded chicken, gooey melted cheese, and a hint of butter.",
    ingredients: [
      { item: "Flour Tortillas", amount: "2 large", category: "Pantry & Grains", standardKey: "tortilla" },
      { item: "Cooked Chicken (shredded)", amount: "1 cup", category: "Proteins", standardKey: "chicken" },
      { item: "Shredded Cheese (Cheddar or Mozzarella)", amount: "1 cup", category: "Dairy", standardKey: "cheese" },
      { item: "Butter", amount: "1 tbsp", category: "Dairy", standardKey: "butter" }
    ],
    instructions: [
      "Melt a thin layer of butter in a large skillet over medium heat.",
      "Lay one tortilla flat, cover evenly with half the cheese, the chicken, and the remaining cheese.",
      "Top with second tortilla and cook for 3 minutes until bottom is golden and crisp.",
      "Carefully flip and cook 2-3 more minutes until cheese is completely melted. Slice into wedges."
    ],
    tags: ["mexican", "chicken", "cheese", "quick", "kid-friendly"],
    imageUrl: "https://images.unsplash.com/photo-1618040996337-56904b7850b9?auto=format&fit=crop&w=800&q=80",
    likes: 340
  },
  {
    title: "15-Minute Sizzling Chicken & Onion Stir Fry",
    category: "Quick Dinners",
    prepTime: "5 mins",
    cookTime: "10 mins",
    servings: 2,
    difficulty: "Easy",
    description: "Tender chicken strips seared golden with sweet sautéed onions in a savory soy garlic glaze.",
    ingredients: [
      { item: "Chicken Breast", amount: "1 lb, sliced thinly", category: "Proteins", standardKey: "chicken" },
      { item: "Yellow Onion", amount: "1 large, sliced", category: "Produce", standardKey: "onion" },
      { item: "Soy Sauce", amount: "3 tbsp", category: "Spices & Sauces", standardKey: "soy sauce" },
      { item: "Garlic", amount: "3 cloves, minced", category: "Produce", standardKey: "garlic" },
      { item: "Cooking Oil", amount: "1.5 tbsp", category: "Pantry & Grains", standardKey: "olive oil" }
    ],
    instructions: [
      "Heat oil in a large skillet or wok over high heat until shimmering.",
      "Add sliced chicken in a single layer and sear undisturbed for 3 minutes, then flip.",
      "Add sliced onions and minced garlic, stir-frying for 3-4 minutes until onions soften with charred edges.",
      "Pour in soy sauce, stir constantly for 1 minute until a glistening sauce coats everything, and serve over rice or noodles."
    ],
    tags: ["dinner", "chicken", "high-protein", "asian", "low-carb"],
    imageUrl: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80",
    likes: 275
  },
  {
    title: "Creamy Deli-Style Egg Salad",
    category: "15-Min Meals",
    prepTime: "5 mins",
    cookTime: "0 mins",
    servings: 2,
    difficulty: "Easy",
    description: "Tender chopped hard-boiled eggs tossed in a creamy, velvety mayonnaise and mustard dressing.",
    ingredients: [
      { item: "Hard-Boiled Eggs", amount: "4 eggs, peeled and diced", category: "Proteins", standardKey: "eggs" },
      { item: "Mayonnaise", amount: "3 tbsp", category: "Spices & Sauces", standardKey: "mayo" },
      { item: "Yellow or Dijon Mustard", amount: "1 tsp", category: "Spices & Sauces", standardKey: "mustard" },
      { item: "Black Pepper", amount: "1/4 tsp", category: "Spices & Sauces", standardKey: "pepper" }
    ],
    instructions: [
      "Place diced hard-boiled eggs into a medium mixing bowl.",
      "Add mayonnaise, mustard, and black pepper.",
      "Gently mash with a fork until creamy yet with pleasant chunky texture.",
      "Serve on toasted bread, lettuce wraps, or straight with crackers."
    ],
    tags: ["lunch", "eggs", "keto-friendly", "no-cook", "budget"],
    imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
    likes: 215
  },
  {
    title: "Loaded Bacon & Cheese Baked Potato",
    category: "Quick Dinners",
    prepTime: "5 mins",
    cookTime: "10 mins",
    servings: 1,
    difficulty: "Easy",
    description: "Fluffy steamed potato split open and piled high with melted cheddar, crisp bacon bits, and butter.",
    ingredients: [
      { item: "Russet Potato", amount: "1 large (microwaved 6 mins)", category: "Produce", standardKey: "potato" },
      { item: "Bacon", amount: "3 strips, cooked crisp", category: "Proteins", standardKey: "bacon" },
      { item: "Cheddar Cheese", amount: "1/3 cup shredded", category: "Dairy", standardKey: "cheese" },
      { item: "Butter", amount: "1.5 tbsp", category: "Dairy", standardKey: "butter" }
    ],
    instructions: [
      "Pierce potato with a fork and microwave on high for 6-8 minutes until tender throughout.",
      "Slice the top open lengthwise and fluff the steaming potato flesh with a fork.",
      "Tuck butter into the hot potato to melt, season with a pinch of pepper.",
      "Top with shredded cheddar and crumbled bacon; warm 30 seconds more until cheese melts."
    ],
    tags: ["dinner", "potatoes", "bacon", "cheese", "comfort-food"],
    imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80",
    likes: 310
  },
  {
    title: "Quick Sizzling Bacon & Egg Breakfast Hash",
    category: "Breakfast",
    prepTime: "5 mins",
    cookTime: "10 mins",
    servings: 2,
    difficulty: "Easy",
    description: "Crispy diced potatoes pan-fried with smoky bacon and sunny-side eggs.",
    ingredients: [
      { item: "Potatoes (diced small)", amount: "2 medium", category: "Produce", standardKey: "potato" },
      { item: "Bacon", amount: "4 strips, chopped", category: "Proteins", standardKey: "bacon" },
      { item: "Eggs", amount: "2 large", category: "Proteins", standardKey: "eggs" },
      { item: "Onion", amount: "1/2 cup diced", category: "Produce", standardKey: "onion" }
    ],
    instructions: [
      "In a skillet over medium heat, fry chopped bacon until crispy. Remove bacon, leave drippings in pan.",
      "Add diced potatoes and onion to the bacon fat; cook 7-8 minutes turning occasionally until crispy and golden.",
      "Push potatoes to the side to create two wells; crack eggs directly into the pan.",
      "Cover with lid and cook 2-3 minutes until whites are set and yolks remain runny. Crumble bacon on top."
    ],
    tags: ["breakfast", "bacon", "eggs", "potato", "one-pan"],
    imageUrl: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80",
    likes: 290
  },
  {
    title: "Classic Diner Tuna Melt",
    category: "15-Min Meals",
    prepTime: "4 mins",
    cookTime: "6 mins",
    servings: 2,
    difficulty: "Easy",
    description: "Flaky tuna mixed with creamy mayo, piled onto crusty bread and toasted under melted cheddar.",
    ingredients: [
      { item: "Canned Tuna", amount: "1 can (5 oz), drained", category: "Proteins", standardKey: "tuna" },
      { item: "Mayonnaise", amount: "2 tbsp", category: "Spices & Sauces", standardKey: "mayo" },
      { item: "Cheddar Cheese", amount: "2 slices", category: "Dairy", standardKey: "cheese" },
      { item: "Bread", amount: "2 slices", category: "Pantry & Grains", standardKey: "bread" },
      { item: "Butter", amount: "1 tbsp", category: "Dairy", standardKey: "butter" }
    ],
    instructions: [
      "In a small bowl, flake the tuna with a fork and mix with mayonnaise and a pinch of black pepper.",
      "Butter one side of each bread slice.",
      "Place bread butter-side down in a skillet; top with tuna mixture and cheddar cheese.",
      "Cover skillet with a lid on medium-low heat for 4-5 minutes until bread is toasted and cheese is bubbling."
    ],
    tags: ["lunch", "tuna", "cheese", "seafood", "high-protein"],
    imageUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
    likes: 275
  },
  {
    title: "3-Ingredient Simple Tomato Garlic Pasta",
    category: "Quick Dinners",
    prepTime: "2 mins",
    cookTime: "12 mins",
    servings: 2,
    difficulty: "Easy",
    description: "Sweet simmered tomatoes in rich garlic olive oil tossed with tender pasta noodles.",
    ingredients: [
      { item: "Pasta (Penne or Spaghetti)", amount: "8 oz", category: "Pantry & Grains", standardKey: "pasta" },
      { item: "Fresh Tomatoes or Canned Diced", amount: "2 cups diced", category: "Produce", standardKey: "tomato" },
      { item: "Garlic", amount: "4 cloves, minced", category: "Produce", standardKey: "garlic" },
      { item: "Olive Oil or Butter", amount: "2 tbsp", category: "Dairy", standardKey: "butter" }
    ],
    instructions: [
      "Cook pasta in boiling salted water according to package directions.",
      "In a separate saucepan, heat olive oil/butter over medium heat; sauté garlic for 1 minute.",
      "Add diced tomatoes, reduce heat, and simmer gently for 8 minutes until tomatoes break down into a rustic sauce.",
      "Toss hot drained pasta directly into the tomato sauce and stir well to coat."
    ],
    tags: ["dinner", "pasta", "vegetarian", "easy", "italian"],
    imageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80",
    likes: 310
  },
  {
    title: "Classic Ground Beef Skillet Tacos",
    category: "Quick Dinners",
    prepTime: "5 mins",
    cookTime: "10 mins",
    servings: 2,
    difficulty: "Easy",
    description: "Seasoned savory ground beef folded into warm tortillas with melted cheese and fresh diced tomatoes.",
    ingredients: [
      { item: "Ground Beef", amount: "1 lb", category: "Proteins", standardKey: "beef" },
      { item: "Tortillas", amount: "4 small", category: "Pantry & Grains", standardKey: "tortilla" },
      { item: "Cheddar Cheese", amount: "1/2 cup shredded", category: "Dairy", standardKey: "cheese" },
      { item: "Tomato", amount: "1 diced", category: "Produce", standardKey: "tomato" }
    ],
    instructions: [
      "Brown ground beef in a skillet over medium-high heat, breaking into crumbles for 6-8 minutes. Drain excess fat.",
      "Season beef with salt, pepper, or taco seasoning if available.",
      "Warm tortillas in a dry pan for 30 seconds per side.",
      "Spoon beef into tortillas and top immediately with shredded cheese and cool diced tomatoes."
    ],
    tags: ["mexican", "beef", "dinner", "quick", "family-friendly"],
    imageUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80",
    likes: 365
  },
  {
    title: "Crispy Sizzling Breakfast BLT",
    category: "15-Min Meals",
    prepTime: "3 mins",
    cookTime: "7 mins",
    servings: 1,
    difficulty: "Easy",
    description: "Thick-cut crispy bacon, crisp lettuce, and ripe tomatoes with cool mayo on toasted bread.",
    ingredients: [
      { item: "Bacon", amount: "4 strips", category: "Proteins", standardKey: "bacon" },
      { item: "Bread", amount: "2 slices toasted", category: "Pantry & Grains", standardKey: "bread" },
      { item: "Tomato", amount: "1 sliced", category: "Produce", standardKey: "tomato" },
      { item: "Lettuce or Greens", amount: "2 leaves", category: "Produce", standardKey: "lettuce" },
      { item: "Mayonnaise", amount: "1.5 tbsp", category: "Spices & Sauces", standardKey: "mayo" }
    ],
    instructions: [
      "Fry bacon in a pan until deeply browned and crisp; drain on paper towels.",
      "Toast bread slices until golden brown.",
      "Spread mayonnaise generously across both toasted bread slices.",
      "Layer bacon, tomato slices, and fresh lettuce; slice diagonally and enjoy immediately."
    ],
    tags: ["sandwich", "bacon", "lunch", "classic", "quick"],
    imageUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
    likes: 245
  },
  {
    title: "Simple Fluffy French Cheese Omelette",
    category: "Breakfast",
    prepTime: "2 mins",
    cookTime: "4 mins",
    servings: 1,
    difficulty: "Easy",
    description: "Tender, velvety folded eggs with a melted cheese center that pulls apart with every forkful.",
    ingredients: [
      { item: "Eggs", amount: "3 large", category: "Proteins", standardKey: "eggs" },
      { item: "Butter", amount: "1 tbsp", category: "Dairy", standardKey: "butter" },
      { item: "Cheddar or Swiss Cheese", amount: "1/4 cup shredded", category: "Dairy", standardKey: "cheese" }
    ],
    instructions: [
      "Whisk eggs thoroughly with 1 tablespoon water and a pinch of salt until uniform.",
      "Melt butter in an 8-inch non-stick skillet over medium-low heat until frothy.",
      "Pour eggs in; gently swirl pan and pull cooked edges inward to let raw egg flow underneath.",
      "When top is just set but still moist, scatter cheese across the middle and fold one side over. Slide onto plate."
    ],
    tags: ["breakfast", "eggs", "cheese", "french", "quick"],
    imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
    likes: 280
  },
  {
    title: "Quick Honey Garlic Chicken Bites",
    category: "Quick Dinners",
    prepTime: "4 mins",
    cookTime: "8 mins",
    servings: 2,
    difficulty: "Easy",
    description: "Bite-sized chicken seared golden and coated in a sticky, sweet-savory honey garlic glaze.",
    ingredients: [
      { item: "Chicken Breast", amount: "1 lb, cut into bite-sized pieces", category: "Proteins", standardKey: "chicken" },
      { item: "Honey", amount: "2 tbsp", category: "Pantry & Grains", standardKey: "honey" },
      { item: "Garlic", amount: "3 cloves minced", category: "Produce", standardKey: "garlic" },
      { item: "Soy Sauce", amount: "2 tbsp", category: "Spices & Sauces", standardKey: "soy sauce" },
      { item: "Butter or Oil", amount: "1 tbsp", category: "Dairy", standardKey: "butter" }
    ],
    instructions: [
      "Heat butter/oil in a skillet over high heat. Add chicken pieces and sear 3 minutes per side until golden.",
      "Turn heat down to medium; add minced garlic and sauté for 45 seconds.",
      "Pour in honey and soy sauce, stirring constantly.",
      "Allow sauce to bubble and thicken into a sticky glaze coating each chicken bite, about 2 minutes."
    ],
    tags: ["dinner", "chicken", "asian", "quick", "sweet-savory"],
    imageUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80",
    likes: 390
  },
  {
    title: "Creamy Cheesy Broccoli Rice Bowl",
    category: "Quick Dinners",
    prepTime: "3 mins",
    cookTime: "7 mins",
    servings: 2,
    difficulty: "Easy",
    description: "Steaming rice tossed with tender broccoli florets and rich melted cheddar cheese sauce.",
    ingredients: [
      { item: "Cooked Rice", amount: "2 cups warm", category: "Pantry & Grains", standardKey: "rice" },
      { item: "Broccoli", amount: "1.5 cups chopped florets", category: "Produce", standardKey: "broccoli" },
      { item: "Cheddar Cheese", amount: "3/4 cup shredded", category: "Dairy", standardKey: "cheese" },
      { item: "Butter", amount: "1.5 tbsp", category: "Dairy", standardKey: "butter" }
    ],
    instructions: [
      "Steam chopped broccoli in microwave with 2 tablespoons water for 3 minutes until bright green and tender.",
      "In a saucepan over low heat, melt butter and fold in warm rice.",
      "Stir in shredded cheddar cheese until it melts through the hot grains into a silky coating.",
      "Fold in steamed broccoli gently, season with black pepper, and serve warm."
    ],
    tags: ["dinner", "vegetarian", "comfort-food", "rice", "cheese"],
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    likes: 260
  },
  {
    title: "One-Pan Sausage & Sliced Pepper Skillet",
    category: "Quick Dinners",
    prepTime: "5 mins",
    cookTime: "10 mins",
    servings: 2,
    difficulty: "Easy",
    description: "Caramelized sliced sausage rounds browned with sweet bell peppers and tender onions.",
    ingredients: [
      { item: "Sausage (Smoked or Italian)", amount: "12 oz sliced", category: "Proteins", standardKey: "sausage" },
      { item: "Bell Pepper", amount: "1 large, sliced", category: "Produce", standardKey: "bell pepper" },
      { item: "Onion", amount: "1 medium, sliced", category: "Produce", standardKey: "onion" },
      { item: "Cooking Oil", amount: "1 tbsp", category: "Pantry & Grains", standardKey: "olive oil" }
    ],
    instructions: [
      "Heat oil in a skillet over medium-high heat. Add sliced sausage and sear for 4 minutes until browned.",
      "Add bell pepper and onion slices to the pan.",
      "Sauté for 5-6 minutes, stirring often, until peppers are tender-crisp and onions are caramelized.",
      "Serve hot right from the skillet as a meal or wrap inside tortillas."
    ],
    tags: ["dinner", "one-pan", "sausage", "keto-friendly", "easy"],
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    likes: 315
  },
  {
    title: "Crispy Fried Eggs with Soy Butter Rice",
    category: "Breakfast",
    prepTime: "2 mins",
    cookTime: "5 mins",
    servings: 1,
    difficulty: "Easy",
    description: "Warm jasmine rice topped with a crispy-edged sunny egg and a drizzle of rich melted soy butter.",
    ingredients: [
      { item: "Cooked Rice", amount: "1 cup warm", category: "Pantry & Grains", standardKey: "rice" },
      { item: "Eggs", amount: "1-2 large", category: "Proteins", standardKey: "eggs" },
      { item: "Butter", amount: "1 tbsp", category: "Dairy", standardKey: "butter" },
      { item: "Soy Sauce", amount: "1 tbsp", category: "Spices & Sauces", standardKey: "soy sauce" }
    ],
    instructions: [
      "Melt butter in a small skillet over medium heat.",
      "Crack eggs into pan and fry undisturbed until whites are set and edges turn crispy and golden.",
      "Place warm rice into a serving bowl.",
      "Slide fried eggs over rice, drizzle pan drippings and soy sauce on top, and break yolk to mix."
    ],
    tags: ["breakfast", "rice", "eggs", "asian-comfort", "fast"],
    imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
    likes: 355
  },
  {
    title: "Golden Cheesy Garlic Toast",
    category: "15-Min Meals",
    prepTime: "3 mins",
    cookTime: "6 mins",
    servings: 2,
    difficulty: "Easy",
    description: "Thick bread slices slathered with rich garlic herb butter and baked under bubbling cheese.",
    ingredients: [
      { item: "Bread", amount: "4 slices", category: "Pantry & Grains", standardKey: "bread" },
      { item: "Butter", amount: "3 tbsp softened", category: "Dairy", standardKey: "butter" },
      { item: "Garlic", amount: "3 cloves minced", category: "Produce", standardKey: "garlic" },
      { item: "Shredded Mozzarella or Cheddar", amount: "1 cup", category: "Dairy", standardKey: "cheese" }
    ],
    instructions: [
      "Mix softened butter with minced garlic in a bowl.",
      "Spread garlic butter generously over one side of each bread slice.",
      "Top with a generous layer of shredded cheese.",
      "Toast in oven or toaster oven at 400°F (or under skillet lid) for 5-6 minutes until cheese is bubbly and browned."
    ],
    tags: ["snack", "bread", "cheese", "garlic", "comfort-food"],
    imageUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
    likes: 330
  },
  {
    title: "15-Minute Chicken & Noodle Comfort Soup",
    category: "Quick Dinners",
    prepTime: "3 mins",
    cookTime: "12 mins",
    servings: 2,
    difficulty: "Easy",
    description: "Soothing hot chicken broth with tender chicken pieces, egg noodles or pasta, and sweet carrots.",
    ingredients: [
      { item: "Cooked Chicken (shredded or diced)", amount: "1.5 cups", category: "Proteins", standardKey: "chicken" },
      { item: "Pasta or Egg Noodles", amount: "4 oz", category: "Pantry & Grains", standardKey: "pasta" },
      { item: "Broth or Bouillon Water", amount: "4 cups", category: "Pantry & Grains", standardKey: "broth" },
      { item: "Carrot", amount: "1 sliced into thin coins", category: "Produce", standardKey: "carrot" }
    ],
    instructions: [
      "Bring broth to a rolling boil in a pot; drop in sliced carrots and cook 4 minutes.",
      "Add pasta/noodles and boil until tender according to package instructions.",
      "Turn heat to low, stir in shredded chicken, and let heat through for 2 minutes.",
      "Ladle steaming soup into deep bowls and season with black pepper."
    ],
    tags: ["soup", "chicken", "comfort-food", "easy", "dinner"],
    imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
    likes: 370
  }
];

// Read existing file and parse
const existingArrayStr = match[1];
const existingArray = eval(existingArrayStr);

console.log(`Original recipes count: ${existingArray.length}`);

// Prepend the new simple comfort meals with IDs rec-s01, rec-s02, etc.
const formattedSimpleMeals = SIMPLE_MEALS.map((meal, idx) => ({
  id: `rec-s${String(idx + 1).padStart(2, '0')}`,
  ...meal
}));

// Filter out any duplicates if run multiple times
const existingIds = new Set(existingArray.map(r => r.title.toLowerCase()));
const newToAdd = formattedSimpleMeals.filter(m => !existingIds.has(m.title.toLowerCase()));

console.log(`Adding ${newToAdd.length} brand new simple comfort recipes!`);

const combined = [...newToAdd, ...existingArray];
console.log(`Total combined recipes: ${combined.length}`);

const newContent = content.replace(
  /export const RECIPES_DATA: Recipe\[\] = (\[[\s\S]*?\]);/,
  `export const RECIPES_DATA: Recipe[] = ${JSON.stringify(combined, null, 2)};`
);

fs.writeFileSync(targetFile, newContent, 'utf8');
console.log("Successfully updated lib/recipes-data.ts with simple comfort recipes!");

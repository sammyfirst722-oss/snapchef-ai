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

const MORE_SIMPLE_MEALS = [
  {
    title: "Crispy Cheddar Quesadilla",
    category: "15-Min Meals",
    prepTime: "2 mins",
    cookTime: "5 mins",
    servings: 1,
    difficulty: "Easy",
    description: "Flour tortilla toasted golden in butter, packed with molten cheddar and jack cheese.",
    ingredients: [
      { item: "Flour Tortilla", amount: "1 large", category: "Pantry & Grains", standardKey: "tortilla" },
      { item: "Cheddar Cheese", amount: "3/4 cup shredded", category: "Dairy", standardKey: "cheese" },
      { item: "Butter", amount: "1 tbsp", category: "Dairy", standardKey: "butter" }
    ],
    instructions: [
      "Melt half the butter in a skillet over medium heat.",
      "Place tortilla in pan, spread shredded cheese across one half.",
      "Fold empty half over the cheese to make a half-moon.",
      "Cook for 2-3 minutes per side until golden brown and cheese is fully melted."
    ],
    tags: ["mexican", "cheese", "quick", "kid-friendly", "lunch"],
    imageUrl: "https://images.unsplash.com/photo-1618040996337-56904b7850b9?auto=format&fit=crop&w=800&q=80",
    likes: 380
  },
  {
    title: "Cinnamon French Toast",
    category: "Breakfast",
    prepTime: "3 mins",
    cookTime: "6 mins",
    servings: 2,
    difficulty: "Easy",
    description: "Thick bread soaked in a rich egg and milk custard, seared golden with sweet butter.",
    ingredients: [
      { item: "Bread", amount: "4 thick slices", category: "Pantry & Grains", standardKey: "bread" },
      { item: "Eggs", amount: "2 large", category: "Proteins", standardKey: "eggs" },
      { item: "Milk", amount: "1/3 cup", category: "Dairy", standardKey: "milk" },
      { item: "Butter", amount: "2 tbsp", category: "Dairy", standardKey: "butter" }
    ],
    instructions: [
      "Whisk eggs, milk, and a pinch of cinnamon or sugar in a shallow dish.",
      "Dip bread slices into the mixture for 15 seconds per side until soaked.",
      "Melt butter in a large skillet over medium heat.",
      "Cook bread slices 3-4 minutes per side until puffed and golden brown."
    ],
    tags: ["breakfast", "bread", "eggs", "milk", "sweet"],
    imageUrl: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=800&q=80",
    likes: 410
  },
  {
    title: "One-Pot Creamy Macaroni & Cheese",
    category: "15-Min Meals",
    prepTime: "2 mins",
    cookTime: "10 mins",
    servings: 2,
    difficulty: "Easy",
    description: "Tender elbow macaroni simmered right in milk and butter, finished with melted cheddar.",
    ingredients: [
      { item: "Macaroni or Short Pasta", amount: "6 oz", category: "Pantry & Grains", standardKey: "pasta" },
      { item: "Milk", amount: "1.5 cups", category: "Dairy", standardKey: "milk" },
      { item: "Cheddar Cheese", amount: "1 cup shredded", category: "Dairy", standardKey: "cheese" },
      { item: "Butter", amount: "1.5 tbsp", category: "Dairy", standardKey: "butter" }
    ],
    instructions: [
      "Combine pasta, milk, and 1 cup water in a pot; bring to a gentle simmer stirring constantly.",
      "Cook for 8 minutes until pasta is tender and liquid is absorbed into a creamy base.",
      "Stir in butter until melted.",
      "Take off heat and fold in cheddar cheese until completely smooth and velvety."
    ],
    tags: ["pasta", "cheese", "comfort-food", "one-pot", "kids"],
    imageUrl: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80",
    likes: 450
  },
  {
    title: "10-Minute Savory Beef & Onion Scramble",
    category: "Quick Dinners",
    prepTime: "3 mins",
    cookTime: "8 mins",
    servings: 2,
    difficulty: "Easy",
    description: "Sizzling ground beef sautéed with caramelized onions and fluffy scrambled eggs.",
    ingredients: [
      { item: "Ground Beef", amount: "1/2 lb", category: "Proteins", standardKey: "beef" },
      { item: "Eggs", amount: "3 large", category: "Proteins", standardKey: "eggs" },
      { item: "Onion", amount: "1/2 diced", category: "Produce", standardKey: "onion" },
      { item: "Soy Sauce", amount: "1.5 tbsp", category: "Spices & Sauces", standardKey: "soy sauce" }
    ],
    instructions: [
      "Brown ground beef and onions together in a skillet over medium-high heat for 5 minutes.",
      "Push beef to one side of the pan.",
      "Crack beaten eggs into the empty side, scramble gently until soft.",
      "Drizzle soy sauce over everything and fold together for 1 minute before serving."
    ],
    tags: ["dinner", "beef", "eggs", "high-protein", "keto-friendly"],
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    likes: 310
  },
  {
    title: "Crispy Country Skillet Hash Browns",
    category: "Breakfast",
    prepTime: "4 mins",
    cookTime: "10 mins",
    servings: 2,
    difficulty: "Easy",
    description: "Grated russet potatoes pan-fried in butter until super crispy and shatteringly golden.",
    ingredients: [
      { item: "Potatoes", amount: "2 medium, grated", category: "Produce", standardKey: "potato" },
      { item: "Butter", amount: "2 tbsp", category: "Dairy", standardKey: "butter" },
      { item: "Cooking Oil", amount: "1 tbsp", category: "Pantry & Grains", standardKey: "olive oil" },
      { item: "Black Pepper", amount: "1/4 tsp", category: "Spices & Sauces", standardKey: "pepper" }
    ],
    instructions: [
      "Squeeze excess moisture out of grated potatoes using a clean dish towel or paper towels.",
      "Heat butter and oil in a large skillet over medium-high heat until sizzling.",
      "Press potatoes into an even layer in the skillet; season with pepper.",
      "Fry undisturbed for 6 minutes until deeply browned on bottom, flip in sections, and cook 4 more minutes."
    ],
    tags: ["breakfast", "potatoes", "crispy", "vegan", "comfort-food"],
    imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80",
    likes: 375
  },
  {
    title: "Garlic Butter Sautéed Mushrooms",
    category: "15-Min Meals",
    prepTime: "3 mins",
    cookTime: "7 mins",
    servings: 2,
    difficulty: "Easy",
    description: "Plump sliced mushrooms caramelized in rich garlic butter with a savory glossy glaze.",
    ingredients: [
      { item: "Mushrooms", amount: "8 oz sliced", category: "Produce", standardKey: "mushrooms" },
      { item: "Butter", amount: "2 tbsp", category: "Dairy", standardKey: "butter" },
      { item: "Garlic", amount: "3 cloves minced", category: "Produce", standardKey: "garlic" },
      { item: "Soy Sauce", amount: "1 tsp", category: "Spices & Sauces", standardKey: "soy sauce" }
    ],
    instructions: [
      "Melt 1 tablespoon butter in a skillet over high heat.",
      "Add sliced mushrooms in a single layer and let brown undisturbed for 3-4 minutes.",
      "Toss mushrooms, add remaining butter, minced garlic, and soy sauce.",
      "Sauté for 2-3 more minutes until tender, glossy, and fragrant."
    ],
    tags: ["side", "mushrooms", "garlic", "vegetarian", "keto-friendly"],
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    likes: 290
  },
  {
    title: "5-Minute Cheesy Fried Eggs on Toast",
    category: "Breakfast",
    prepTime: "1 min",
    cookTime: "4 mins",
    servings: 1,
    difficulty: "Easy",
    description: "Two sunny-side fried eggs capped with melted cheese on thick, buttery toasted bread.",
    ingredients: [
      { item: "Eggs", amount: "2 large", category: "Proteins", standardKey: "eggs" },
      { item: "Bread", amount: "1-2 slices", category: "Pantry & Grains", standardKey: "bread" },
      { item: "Cheddar Cheese", amount: "2 slices", category: "Dairy", standardKey: "cheese" },
      { item: "Butter", amount: "1 tbsp", category: "Dairy", standardKey: "butter" }
    ],
    instructions: [
      "Melt butter in a skillet over medium heat; toast bread on both sides until golden and set aside.",
      "In the same pan, crack eggs and fry for 2 minutes until whites are partially set.",
      "Drape cheese slices directly over eggs, cover pan with lid for 1-2 minutes until cheese melts.",
      "Slide the cheesy fried eggs directly onto your warm toast."
    ],
    tags: ["breakfast", "eggs", "cheese", "toast", "quick"],
    imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
    likes: 360
  },
  {
    title: "15-Minute Sweet & Spicy Glazed Bacon",
    category: "15-Min Meals",
    prepTime: "2 mins",
    cookTime: "10 mins",
    servings: 2,
    difficulty: "Easy",
    description: "Crispy bacon strips caramelized in brown sugar or honey with cracked black pepper.",
    ingredients: [
      { item: "Bacon", amount: "6 thick strips", category: "Proteins", standardKey: "bacon" },
      { item: "Honey or Sugar", amount: "1.5 tbsp", category: "Pantry & Grains", standardKey: "honey" },
      { item: "Black Pepper", amount: "1/2 tsp", category: "Spices & Sauces", standardKey: "pepper" }
    ],
    instructions: [
      "Place bacon strips in a cold skillet and set heat to medium.",
      "Cook for 6-7 minutes, turning occasionally until almost crisp.",
      "Brush or drizzle honey over each strip and sprinkle generously with black pepper.",
      "Cook 1-2 more minutes until glaze bubbles and caramelizes into a candy-crisp coating."
    ],
    tags: ["breakfast", "bacon", "sweet-savory", "snack"],
    imageUrl: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80",
    likes: 310
  }
];

const existingArrayStr = match[1];
const existingArray = eval(existingArrayStr);

const formatted = MORE_SIMPLE_MEALS.map((meal, idx) => ({
  id: `rec-s${String(idx + 21).padStart(2, '0')}`,
  ...meal
}));

const existingIds = new Set(existingArray.map(r => r.title.toLowerCase()));
const newToAdd = formatted.filter(m => !existingIds.has(m.title.toLowerCase()));

console.log(`Adding ${newToAdd.length} more simple comfort meals!`);
const combined = [...newToAdd, ...existingArray];
console.log(`Total recipes now: ${combined.length}`);

const newContent = content.replace(
  /export const RECIPES_DATA: Recipe\[\] = (\[[\s\S]*?\]);/,
  `export const RECIPES_DATA: Recipe[] = ${JSON.stringify(combined, null, 2)};`
);

fs.writeFileSync(targetFile, newContent, 'utf8');
console.log("Successfully appended second batch of simple recipes!");

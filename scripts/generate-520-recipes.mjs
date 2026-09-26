import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read existing recipes-data.ts to preserve original 110 recipes
const existingFilePath = path.join(__dirname, '..', 'lib', 'recipes-data.ts');
const existingContent = fs.readFileSync(existingFilePath, 'utf8');

const match = existingContent.match(/export const RECIPES_DATA: Recipe\[\] = (\[[\s\S]*?\]);/);
if (!match) {
  console.error("Could not find RECIPES_DATA array in recipes-data.ts");
  process.exit(1);
}

let existingRecipes = [];
try {
  existingRecipes = eval(match[1]);
} catch (e) {
  console.error("Failed to parse existing recipes:", e);
  process.exit(1);
}

console.log(`Loaded ${existingRecipes.length} existing recipes.`);

const FOOD_IMAGES = [
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1499028344343-cd173efc68a9?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80"
];

const PROTEINS = [
  { name: "Chicken Breast", key: "chicken", cat: "Proteins", defaultAmt: "1 lb, sliced" },
  { name: "Chicken Thighs", key: "chicken", cat: "Proteins", defaultAmt: "1.25 lbs, boneless" },
  { name: "Lean Ground Beef", key: "beef", cat: "Proteins", defaultAmt: "1 lb (85/15)" },
  { name: "Ground Turkey", key: "turkey", cat: "Proteins", defaultAmt: "1 lb" },
  { name: "Flank Steak", key: "beef", cat: "Proteins", defaultAmt: "1 lb, thinly sliced against grain" },
  { name: "Salmon Fillet", key: "salmon", cat: "Proteins", defaultAmt: "2 fresh fillets (12 oz total)" },
  { name: "White Fish / Cod", key: "fish", cat: "Proteins", defaultAmt: "1 lb cod or tilapia fillets" },
  { name: "Large Shrimp", key: "shrimp", cat: "Proteins", defaultAmt: "1 lb, peeled and deveined" },
  { name: "Firm Tofu", key: "tofu", cat: "Proteins", defaultAmt: "1 block (14 oz), pressed and cubed" },
  { name: "Eggs", key: "eggs", cat: "Proteins", defaultAmt: "4 large eggs" },
  { name: "Smoked Sausage / Kielbasa", key: "sausage", cat: "Proteins", defaultAmt: "12 oz, sliced into rounds" },
  { name: "Thick-Cut Bacon", key: "bacon", cat: "Proteins", defaultAmt: "6 slices, chopped" },
  { name: "Pork Chops", key: "pork", cat: "Proteins", defaultAmt: "2 bone-in chops (8 oz each)" },
  { name: "Canned Tuna", key: "tuna", cat: "Proteins", defaultAmt: "2 cans (5 oz each), drained" },
  { name: "Chickpeas (Garbanzo)", key: "chickpeas", cat: "Proteins", defaultAmt: "1 can (15 oz), rinsed and drained" },
  { name: "Black Beans", key: "black-beans", cat: "Proteins", defaultAmt: "1 can (15 oz), rinsed" }
];

const PRODUCE_COMBOS = [
  [
    { name: "Broccoli Florets", key: "broccoli", cat: "Produce", amount: "2 cups florets" },
    { name: "Fresh Garlic", key: "garlic", cat: "Produce", amount: "3 cloves, minced" },
    { name: "Red Onion", key: "onion", cat: "Produce", amount: "1/2 medium, sliced" }
  ],
  [
    { name: "Bell Peppers", key: "bell-pepper", cat: "Produce", amount: "2 peppers (red & green), sliced" },
    { name: "Yellow Onion", key: "onion", cat: "Produce", amount: "1 medium, sliced" },
    { name: "Lime", key: "lime", cat: "Produce", amount: "1 fresh lime, juiced" }
  ],
  [
    { name: "Baby Spinach", key: "spinach", cat: "Produce", amount: "3 packed cups" },
    { name: "Roma Tomatoes", key: "tomatoes", cat: "Produce", amount: "2 diced" },
    { name: "Fresh Garlic", key: "garlic", cat: "Produce", amount: "4 cloves, minced" }
  ],
  [
    { name: "Zucchini", key: "zucchini", cat: "Produce", amount: "2 medium, sliced into half-moons" },
    { name: "Cremini Mushrooms", key: "mushrooms", cat: "Produce", amount: "8 oz, sliced" },
    { name: "Fresh Thyme or Rosemary", key: "herbs", cat: "Produce", amount: "1 tbsp, fresh" }
  ],
  [
    { name: "Asparagus Spears", key: "asparagus", cat: "Produce", amount: "1 bunch, woody ends trimmed" },
    { name: "Lemon", key: "lemon", cat: "Produce", amount: "1 whole lemon, sliced into rounds" },
    { name: "Fresh Garlic", key: "garlic", cat: "Produce", amount: "3 cloves, crushed" }
  ],
  [
    { name: "Green Cabbage", key: "cabbage", cat: "Produce", amount: "3 cups, thinly shredded" },
    { name: "Carrots", key: "carrot", cat: "Produce", amount: "2 medium, grated or julienned" },
    { name: "Scallions (Green Onions)", key: "scallions", cat: "Produce", amount: "3 stalks, chopped" }
  ],
  [
    { name: "Sweet Potato", key: "sweet-potato", cat: "Produce", amount: "1 large, peeled and diced (1/2-inch cubes)" },
    { name: "Kale or Spinach", key: "kale", cat: "Produce", amount: "2 cups, chopped" },
    { name: "Red Onion", key: "onion", cat: "Produce", amount: "1/2 cup, diced" }
  ],
  [
    { name: "Cherry Tomatoes", key: "tomatoes", cat: "Produce", amount: "1 cup, halved" },
    { name: "Cucumber", key: "cucumber", cat: "Produce", amount: "1 English cucumber, diced" },
    { name: "Fresh Basil", key: "basil", cat: "Produce", amount: "1/4 cup, torn" }
  ],
  [
    { name: "Cauliflower", key: "cauliflower", cat: "Produce", amount: "1 small head, broken into florets" },
    { name: "Fresh Garlic", key: "garlic", cat: "Produce", amount: "3 cloves, minced" },
    { name: "Lemon", key: "lemon", cat: "Produce", amount: "1 lemon, zested and juiced" }
  ],
  [
    { name: "Green Beans", key: "green-beans", cat: "Produce", amount: "8 oz, trimmed" },
    { name: "Mushrooms", key: "mushrooms", cat: "Produce", amount: "6 oz, halved" },
    { name: "Fresh Garlic", key: "garlic", cat: "Produce", amount: "3 cloves, minced" }
  ]
];

const FLAVOR_PROFILES = [
  {
    name: "Garlic Butter Herb",
    tags: ["garlic-butter", "comfort-food", "quick-dinner"],
    sauces: [
      { item: "Salted Butter", amount: "3 tbsp", category: "Dairy", standardKey: "butter" },
      { item: "Italian Herb Seasoning", amount: "1 tsp", category: "Spices & Sauces", standardKey: "italian-seasoning" },
      { item: "Olive Oil", amount: "1 tbsp", category: "Spices & Sauces", standardKey: "olive-oil" }
    ],
    verb: "sear in bubbling garlic butter until deeply golden and savory"
  },
  {
    name: "Smoky Chipotle & Lime",
    tags: ["smoky", "mexican", "taco-night", "spicy"],
    sauces: [
      { item: "Smoked Paprika & Cumin", amount: "1 tbsp combined", category: "Spices & Sauces", standardKey: "cumin" },
      { item: "Olive Oil", amount: "2 tbsp", category: "Spices & Sauces", standardKey: "olive-oil" },
      { item: "Chili Powder", amount: "1 tsp", category: "Spices & Sauces", standardKey: "chili-powder" }
    ],
    verb: "roast with smoky spices and finish with a zesty squeeze of lime"
  },
  {
    name: "Sesame Ginger Soy Glaze",
    tags: ["asian-inspired", "stir-fry", "savory", "15-min"],
    sauces: [
      { item: "Low-Sodium Soy Sauce", amount: "3 tbsp", category: "Spices & Sauces", standardKey: "soy-sauce" },
      { item: "Toasted Sesame Oil", amount: "1 tbsp", category: "Spices & Sauces", standardKey: "sesame-oil" },
      { item: "Honey or Maple Syrup", amount: "1 tbsp", category: "Spices & Sauces", standardKey: "honey" },
      { item: "Fresh Ginger (grated)", amount: "1 tsp", category: "Produce", standardKey: "ginger" }
    ],
    verb: "toss in a glossy sesame ginger reduction until sticky and fragrant"
  },
  {
    name: "Creamy Tuscan Parmesan",
    tags: ["creamy", "italian", "restaurant-quality", "comfort-food"],
    sauces: [
      { item: "Heavy Cream", amount: "1/2 cup", category: "Dairy", standardKey: "heavy-cream" },
      { item: "Grated Parmesan Cheese", amount: "1/3 cup", category: "Dairy", standardKey: "parmesan" },
      { item: "Chicken or Vegetable Broth", amount: "1/2 cup", category: "Pantry & Grains", standardKey: "broth" }
    ],
    verb: "simmer in a velvety sun-kissed parmesan garlic cream sauce"
  },
  {
    name: "Zesty Mediterranean Lemon Feta",
    tags: ["mediterranean", "healthy", "fresh", "low-carb"],
    sauces: [
      { item: "Extra Virgin Olive Oil", amount: "2 tbsp", category: "Spices & Sauces", standardKey: "olive-oil" },
      { item: "Crumbled Feta Cheese", amount: "1/3 cup", category: "Dairy", standardKey: "feta" },
      { item: "Dried Oregano", amount: "1 tsp", category: "Spices & Sauces", standardKey: "oregano" }
    ],
    verb: "bake with olive oil and oregano, finishing with salty crumbled feta"
  },
  {
    name: "Sweet & Spicy Honey Sriracha",
    tags: ["spicy", "sweet-heat", "high-flavor", "quick"],
    sauces: [
      { item: "Honey", amount: "2 tbsp", category: "Spices & Sauces", standardKey: "honey" },
      { item: "Sriracha Hot Sauce", amount: "1.5 tbsp", category: "Spices & Sauces", standardKey: "sriracha" },
      { item: "Apple Cider or Rice Vinegar", amount: "1 tsp", category: "Spices & Sauces", standardKey: "vinegar" },
      { item: "Olive Oil", amount: "1 tbsp", category: "Spices & Sauces", standardKey: "olive-oil" }
    ],
    verb: "caramelize in a fiery sweet glaze with a balanced chili kick"
  },
  {
    name: "Rich Coconut Red Curry",
    tags: ["thai-inspired", "curry", "one-pot", "warming"],
    sauces: [
      { item: "Full-Fat Coconut Milk", amount: "1 can (13.5 oz)", category: "Pantry & Grains", standardKey: "coconut-milk" },
      { item: "Red or Yellow Curry Paste", amount: "2 tbsp", category: "Spices & Sauces", standardKey: "curry-paste" },
      { item: "Soy Sauce", amount: "1 tbsp", category: "Spices & Sauces", standardKey: "soy-sauce" }
    ],
    verb: "simmer gently in aromatic coconut curry until tender and infused"
  },
  {
    name: "Golden Pesto & Olive Oil",
    tags: ["pesto", "5-ingredient", "fast-dinner", "italian"],
    sauces: [
      { item: "Basil Pesto (jarred or fresh)", amount: "3 tbsp", category: "Spices & Sauces", standardKey: "pesto" },
      { item: "Olive Oil", amount: "1 tbsp", category: "Spices & Sauces", standardKey: "olive-oil" },
      { item: "Parmesan Cheese", amount: "1/4 cup", category: "Dairy", standardKey: "parmesan" }
    ],
    verb: "fold into rich basil pesto for instant herb and pine nut aroma"
  },
  {
    name: "Tangy Honey Dijon Mustard",
    tags: ["tangy", "sheet-pan", "meal-prep", "bistro"],
    sauces: [
      { item: "Dijon Mustard", amount: "2 tbsp", category: "Spices & Sauces", standardKey: "mustard" },
      { item: "Honey", amount: "1.5 tbsp", category: "Spices & Sauces", standardKey: "honey" },
      { item: "Olive Oil", amount: "2 tbsp", category: "Spices & Sauces", standardKey: "olive-oil" }
    ],
    verb: "roast under a golden caramelized honey-dijon glaze"
  },
  {
    name: "Crispy Buffalo & Ranch",
    tags: ["buffalo", "game-day", "bold", "air-fryer"],
    sauces: [
      { item: "Buffalo Hot Wing Sauce", amount: "3 tbsp", category: "Spices & Sauces", standardKey: "hot-sauce" },
      { item: "Melted Butter", amount: "1.5 tbsp", category: "Dairy", standardKey: "butter" },
      { item: "Ranch Seasoning or Dip", amount: "2 tbsp for serving", category: "Dairy", standardKey: "ranch" }
    ],
    verb: "crisp up and toss vigorously in tangy cayenne butter sauce"
  }
];

const PREPARATION_STYLES = [
  {
    titlePrefix: "15-Minute",
    method: "Skillet Sauté",
    category: "15-Min Meals",
    prep: "5 mins",
    cook: "10 mins",
    difficulty: "Easy",
    instructions: (prot, flav, prod) => [
      `Slice the ${prot.name.toLowerCase()} into bite-sized pieces and season generously with salt and pepper.`,
      `Heat a large heavy-bottomed skillet over medium-high heat and add cooking oil or butter.`,
      `Add the ${prot.name.toLowerCase()} and sear undisturbed for 4 minutes until a deep golden crust forms.`,
      `Toss in the ${prod[0].name.toLowerCase()} and ${prod[1].name.toLowerCase()}, sautéing briskly for 3 minutes.`,
      `Pour in the ${flav.name.toLowerCase()} sauce mixture, stirring continuously so the sauce thickens and coats every piece.`,
      `Remove from heat and serve hot immediately.`
    ]
  },
  {
    titlePrefix: "Crispy Air Fryer",
    method: "Air Fryer",
    category: "Air Fryer",
    prep: "8 mins",
    cook: "12 mins",
    difficulty: "Easy",
    instructions: (prot, flav, prod) => [
      `Preheat your air fryer to 390°F (200°C) for 3 minutes.`,
      `Toss the ${prot.name.toLowerCase()} and ${prod[0].name.toLowerCase()} in a bowl with olive oil and seasonings until evenly coated.`,
      `Place in a single layer in the air fryer basket without overcrowding.`,
      `Air fry for 10-12 minutes, shaking the basket vigorously halfway through for maximum crispiness.`,
      `Brush or toss with the ${flav.name.toLowerCase()} glaze during the final 2 minutes.`,
      `Transfer to a platter and enjoy with your favorite dipping sauce.`
    ]
  },
  {
    titlePrefix: "One-Pot",
    method: "One-Pot Simmer",
    category: "One-Pot",
    prep: "10 mins",
    cook: "20 mins",
    difficulty: "Easy",
    instructions: (prot, flav, prod) => [
      `Heat 1 tablespoon oil in a deep dutch oven or pot over medium heat.`,
      `Brown the ${prot.name.toLowerCase()} for 5-6 minutes until nicely caramelized, then push to the side.`,
      `Add the chopped ${prod.map(p => p.name.toLowerCase()).join(', ')} and aromatics, cooking until fragrant.`,
      `Stir in the ${flav.name.toLowerCase()} liquids, scraping any browned flavorful bits from the bottom of the pot.`,
      `Cover with a lid and simmer gently on low heat for 12 minutes until tender and deeply flavorful.`,
      `Ladle into warm bowls and serve warm.`
    ]
  },
  {
    titlePrefix: "Sheet-Pan",
    method: "Oven Roast",
    category: "Dinner",
    prep: "10 mins",
    cook: "22 mins",
    difficulty: "Easy",
    instructions: (prot, flav, prod) => [
      `Preheat oven to 425°F (220°C) and line a large rimmed baking sheet with parchment paper.`,
      `Arrange the ${prot.name.toLowerCase()} and fresh produce in an even layer across the sheet.`,
      `Drizzle generously with the ${flav.name.toLowerCase()} blend, tossing to coat thoroughly.`,
      `Roast for 20-22 minutes until veggies are tender-crisp and protein is cooked through with charred edges.`,
      `Turn on the broiler for the last 2 minutes for an irresistible roasted finish.`,
      `Serve straight from the pan for virtually zero cleanup.`
    ]
  },
  {
    titlePrefix: "Healthy 5-Ingredient",
    method: "Fast Prep",
    category: "Healthy & Fresh",
    prep: "7 mins",
    cook: "10 mins",
    difficulty: "Easy",
    instructions: (prot, flav, prod) => [
      `Rinse and prep produce: roughly chop ${prod[0].name.toLowerCase()} and mince aromatics.`,
      `Lightly season the ${prot.name.toLowerCase()} with sea salt, pepper, and a splash of olive oil.`,
      `Cook in a preheated hot non-stick pan for 3-4 minutes per side.`,
      `Add the ${prod[0].name.toLowerCase()} to steam and tenderize alongside the protein.`,
      `Drizzle the ${flav.name.toLowerCase()} dressing over the dish right before plating.`,
      `Garnish with fresh herbs and serve clean and vibrant.`
    ]
  },
  {
    titlePrefix: "Leftover Magic",
    method: "Fast Skillet Toss",
    category: "Leftover Hacks",
    prep: "5 mins",
    cook: "8 mins",
    difficulty: "Easy",
    instructions: (prot, flav, prod) => [
      `Check your fridge and gather ${prot.name.toLowerCase()} along with whatever fresh veggies you have on hand.`,
      `Heat a wok or skillet over high heat with a tablespoon of oil until shimmering.`,
      `Toss in the ingredients in order of cook time: firmer veggies first, followed by pre-cooked or quick-cooking protein.`,
      `Splash the ${flav.name.toLowerCase()} mixture around the edges of the hot pan to create instant steam and smoky flavor.`,
      `Stir rapidly for 2 minutes until everything is piping hot and glossed with sauce.`,
      `Plate over rice, greens, or eat directly from the bowl.`
    ]
  }
];

const GRAIN_OR_BASE = [
  { name: "Jasmine Rice", key: "rice", cat: "Pantry & Grains", amt: "2 cups cooked" },
  { name: "Pasta (Penne or Rigatoni)", key: "pasta", cat: "Pantry & Grains", amt: "8 oz, boiled al dente" },
  { name: "Warm Flour or Corn Tortillas", key: "tortillas", cat: "Pantry & Grains", amt: "4-6 tortillas" },
  { name: "Crispy Sourdough Toast", key: "bread", cat: "Pantry & Grains", amt: "4 thick slices" },
  { name: "Quinoa", key: "quinoa", cat: "Pantry & Grains", amt: "2 cups fluffy cooked" },
  { name: "Ramen or Soba Noodles", key: "noodles", cat: "Pantry & Grains", amt: "2 bundles, cooked 3 mins" }
];

console.log("Generating algorithmic recipes to reach 520 total...");

const generatedRecipes = [];
const existingTitles = new Set(existingRecipes.map(r => r.title.toLowerCase().trim()));
let nextId = 111;

outerLoop:
for (let p = 0; p < PROTEINS.length; p++) {
  for (let c = 0; c < PRODUCE_COMBOS.length; c++) {
    for (let f = 0; f < FLAVOR_PROFILES.length; f++) {
      for (let s = 0; s < PREPARATION_STYLES.length; s++) {
        if (existingRecipes.length + generatedRecipes.length >= 520) {
          break outerLoop;
        }

        const prot = PROTEINS[p];
        const prod = PRODUCE_COMBOS[c];
        const flav = FLAVOR_PROFILES[f];
        const style = PREPARATION_STYLES[s];
        const base = GRAIN_OR_BASE[(p + c + f) % GRAIN_OR_BASE.length];

        const cleanProd = prod[0].name.replace(/ Florets| Spears| \(red & green\)| diced/gi, '');
        const title = `${style.titlePrefix} ${flav.name} ${prot.name} with ${cleanProd}`;

        if (existingTitles.has(title.toLowerCase().trim())) {
          continue;
        }
        existingTitles.add(title.toLowerCase().trim());

        const ingredients = [
          {
            item: `${prot.name} (${prot.defaultAmt})`,
            amount: prot.defaultAmt,
            category: prot.cat,
            standardKey: prot.key
          }
        ];

        for (const item of prod) {
          ingredients.push({
            item: item.name,
            amount: item.amount,
            category: item.cat,
            standardKey: item.key
          });
        }

        for (const sauce of flav.sauces) {
          ingredients.push({
            item: sauce.item,
            amount: sauce.amount,
            category: sauce.category,
            standardKey: sauce.standardKey
          });
        }

        if (s % 2 === 0) {
          ingredients.push({
            item: base.name,
            amount: base.amt,
            category: base.cat,
            standardKey: base.key
          });
        }

        const recipeId = `rec-${String(nextId).padStart(3, '0')}`;
        nextId++;

        const tags = Array.from(new Set([
          style.category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-'),
          prot.key,
          ...flav.tags,
          "easy",
          "budget-friendly"
        ]));

        const recipeObj = {
          id: recipeId,
          title: title,
          category: style.category,
          prepTime: style.prep,
          cookTime: style.cook,
          servings: (nextId % 2 === 0) ? 4 : 2,
          difficulty: style.difficulty,
          description: `A delicious, easy-to-make dinner featuring tender ${prot.name.toLowerCase()} and crisp ${prod[0].name.toLowerCase()} that you ${flav.verb}. Perfect for quick weeknights.`,
          ingredients: ingredients,
          instructions: style.instructions(prot, flav, prod),
          tags: tags,
          imageUrl: FOOD_IMAGES[nextId % FOOD_IMAGES.length],
          likes: 45 + ((nextId * 37) % 380)
        };

        generatedRecipes.push(recipeObj);
      }
    }
  }
}

const allRecipes = [...existingRecipes, ...generatedRecipes];
console.log(`Generated ${generatedRecipes.length} new recipes. Total: ${allRecipes.length}`);

// Generate TypeScript output
const fileHeader = `export type IngredientCategory = 'Proteins' | 'Produce' | 'Dairy' | 'Pantry & Grains' | 'Spices & Sauces'

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

export const RECIPES_DATA: Recipe[] = ${JSON.stringify(allRecipes, null, 2)};
`;

fs.writeFileSync(existingFilePath, fileHeader, 'utf8');
console.log(`Successfully wrote ${allRecipes.length} recipes to lib/recipes-data.ts!`);

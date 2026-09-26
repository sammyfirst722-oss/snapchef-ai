import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

const TARGET_TOTAL = 1200;
const NEEDED = TARGET_TOTAL - existingRecipes.length;
console.log(`Generating ${NEEDED} additional unique recipes to reach ${TARGET_TOTAL}...`);

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
  "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1505253758473-96b46d5f6983?auto=format&fit=crop&w=800&q=80"
];

const PROTEINS = [
  { name: "Chicken Breast", key: "chicken", cat: "Proteins", defaultAmt: "1 lb, diced" },
  { name: "Chicken Thighs", key: "chicken", cat: "Proteins", defaultAmt: "1.25 lbs boneless" },
  { name: "Lean Ground Beef", key: "beef", cat: "Proteins", defaultAmt: "1 lb 85/15" },
  { name: "Ground Turkey", key: "turkey", cat: "Proteins", defaultAmt: "1 lb lean" },
  { name: "Flank Steak", key: "beef", cat: "Proteins", defaultAmt: "1 lb, thinly sliced" },
  { name: "Wild Salmon Fillets", key: "salmon", cat: "Proteins", defaultAmt: "2 fillets (12 oz total)" },
  { name: "Atlantic Cod / White Fish", key: "fish", cat: "Proteins", defaultAmt: "1 lb fresh fillets" },
  { name: "Jumbo Shrimp", key: "shrimp", cat: "Proteins", defaultAmt: "1 lb, peeled & deveined" },
  { name: "Crispy Firm Tofu", key: "tofu", cat: "Proteins", defaultAmt: "1 block (14 oz), cubed" },
  { name: "Pasture-Raised Eggs", key: "eggs", cat: "Proteins", defaultAmt: "4 large eggs" },
  { name: "Smoked Andouille Sausage", key: "sausage", cat: "Proteins", defaultAmt: "12 oz, coin-sliced" },
  { name: "Applewood Smoked Bacon", key: "bacon", cat: "Proteins", defaultAmt: "6 thick strips, chopped" },
  { name: "Center-Cut Pork Chops", key: "pork", cat: "Proteins", defaultAmt: "2 bone-in chops (8 oz each)" },
  { name: "Chunk Light Tuna", key: "tuna", cat: "Proteins", defaultAmt: "2 cans (5 oz each)" },
  { name: "Nutty Chickpeas", key: "chickpeas", cat: "Proteins", defaultAmt: "1 can (15 oz), drained" },
  { name: "Organic Black Beans", key: "black-beans", cat: "Proteins", defaultAmt: "1 can (15 oz), rinsed" },
  { name: "Ground Lamb", key: "lamb", cat: "Proteins", defaultAmt: "1 lb ground lamb" },
  { name: "Pancetta or Prosciutto", key: "pancetta", cat: "Proteins", defaultAmt: "4 oz, diced" },
  { name: "Edamame Beans", key: "edamame", cat: "Proteins", defaultAmt: "1.5 cups, shelled" },
  { name: "Italian Pork Sausage", key: "sausage", cat: "Proteins", defaultAmt: "1 lb sweet Italian" }
];

const PRODUCE_COMBOS = [
  [
    { name: "Crisp Broccoli Florets", key: "broccoli", cat: "Produce", amount: "2 cups florets" },
    { name: "Fresh Garlic Cloves", key: "garlic", cat: "Produce", amount: "3 cloves, minced" },
    { name: "Red Onion", key: "onion", cat: "Produce", amount: "1/2 medium, sliced" }
  ],
  [
    { name: "Sweet Bell Peppers", key: "bell-pepper", cat: "Produce", amount: "2 peppers, julienned" },
    { name: "Yellow Sweet Onion", key: "onion", cat: "Produce", amount: "1 medium, sliced" },
    { name: "Fresh Lime", key: "lime", cat: "Produce", amount: "1 juicy lime" }
  ],
  [
    { name: "Tender Baby Spinach", key: "spinach", cat: "Produce", amount: "3 cups packed" },
    { name: "Ripe Roma Tomatoes", key: "tomatoes", cat: "Produce", amount: "2 diced" },
    { name: "Roasted Garlic", key: "garlic", cat: "Produce", amount: "4 cloves, minced" }
  ],
  [
    { name: "Summer Zucchini", key: "zucchini", cat: "Produce", amount: "2 medium, half-moons" },
    { name: "Earthy Cremini Mushrooms", key: "mushrooms", cat: "Produce", amount: "8 oz sliced" },
    { name: "Fresh Rosemary & Thyme", key: "herbs", cat: "Produce", amount: "1 tbsp fresh" }
  ],
  [
    { name: "Tender Asparagus", key: "asparagus", cat: "Produce", amount: "1 bunch, trimmed" },
    { name: "Meyer Lemon", key: "lemon", cat: "Produce", amount: "1 lemon, wheels & juice" },
    { name: "Crushed Garlic", key: "garlic", cat: "Produce", amount: "3 cloves" }
  ],
  [
    { name: "Napa Cabbage", key: "cabbage", cat: "Produce", amount: "3 cups shredded" },
    { name: "Rainbow Carrots", key: "carrot", cat: "Produce", amount: "2 matchsticks" },
    { name: "Crispy Scallions", key: "scallions", cat: "Produce", amount: "3 chopped" }
  ],
  [
    { name: "Roasted Sweet Potato", key: "sweet-potato", cat: "Produce", amount: "1 large, 1/2-inch cubes" },
    { name: "Lacinato Tuscan Kale", key: "kale", cat: "Produce", amount: "2 cups shredded" },
    { name: "Caramelized Shallots", key: "onion", cat: "Produce", amount: "2 shallots, sliced" }
  ],
  [
    { name: "Sweet Sun-Ripened Cherry Tomatoes", key: "tomatoes", cat: "Produce", amount: "1 cup halved" },
    { name: "Persian Cucumber", key: "cucumber", cat: "Produce", amount: "2 diced" },
    { name: "Sweet Genovese Basil", key: "basil", cat: "Produce", amount: "1/4 cup torn leaves" }
  ],
  [
    { name: "Golden Cauliflower", key: "cauliflower", cat: "Produce", amount: "1 head cut small" },
    { name: "Fresh Garlic", key: "garlic", cat: "Produce", amount: "4 minced cloves" },
    { name: "Lemon Zest", key: "lemon", cat: "Produce", amount: "1 tbsp zest" }
  ],
  [
    { name: "French Haricots Verts (Green Beans)", key: "green-beans", cat: "Produce", amount: "8 oz trimmed" },
    { name: "Shiitake Mushrooms", key: "mushrooms", cat: "Produce", amount: "6 oz caps sliced" },
    { name: "Fresh Minced Garlic", key: "garlic", cat: "Produce", amount: "3 cloves" }
  ],
  [
    { name: "Sweet Sugar Snap Peas", key: "snap-peas", cat: "Produce", amount: "1.5 cups crisp" },
    { name: "Baby Bok Choy", key: "bok-choy", cat: "Produce", amount: "2 heads quartered" },
    { name: "Fresh Ginger Root", key: "ginger", cat: "Produce", amount: "1 tbsp grated" }
  ],
  [
    { name: "Butternut Squash", key: "squash", cat: "Produce", amount: "2 cups cubed" },
    { name: "Crisp Red Apple", key: "apple", cat: "Produce", amount: "1 Honeycrisp, sliced" },
    { name: "Fresh Sage Leaves", key: "sage", cat: "Produce", amount: "2 tbsp chopped" }
  ]
];

const FLAVORS = [
  {
    name: "Golden Garlic Butter Herb",
    tags: ["garlic-butter", "comfort-food", "quick-dinner"],
    sauces: [
      { item: "European Salted Butter", amount: "3 tbsp", category: "Dairy", standardKey: "butter" },
      { item: "Tuscan Italian Herb Blend", amount: "1 tsp", category: "Spices & Sauces", standardKey: "italian-seasoning" },
      { item: "Cold-Pressed Extra Virgin Olive Oil", amount: "1 tbsp", category: "Spices & Sauces", standardKey: "olive-oil" }
    ],
    verb: "sauté in rich bubbling garlic herb butter until caramelized and mouth-watering"
  },
  {
    name: "Smoky Fire-Roasted Chipotle Lime",
    tags: ["smoky", "mexican", "taco-night", "spicy"],
    sauces: [
      { item: "Smoked Spanish Paprika & Toasted Cumin", amount: "1 tbsp combined", category: "Spices & Sauces", standardKey: "cumin" },
      { item: "Extra Virgin Olive Oil", amount: "2 tbsp", category: "Spices & Sauces", standardKey: "olive-oil" },
      { item: "Ancho Chili Powder", amount: "1 tsp", category: "Spices & Sauces", standardKey: "chili-powder" }
    ],
    verb: "sear with smoky southwestern spices and deglaze with fresh lime juice"
  },
  {
    name: "Sticky Honey Sesame Soy Glaze",
    tags: ["asian-inspired", "stir-fry", "savory", "15-min"],
    sauces: [
      { item: "Aged Tamari or Low-Sodium Soy Sauce", amount: "3 tbsp", category: "Spices & Sauces", standardKey: "soy-sauce" },
      { item: "Toasted Japanese Sesame Oil", amount: "1 tbsp", category: "Spices & Sauces", standardKey: "sesame-oil" },
      { item: "Wildflower Honey", amount: "1.5 tbsp", category: "Spices & Sauces", standardKey: "honey" },
      { item: "Fresh Grated Ginger Root", amount: "1 tsp", category: "Produce", standardKey: "ginger" }
    ],
    verb: "glaze in a sweet, sticky sesame-soy reduction until perfectly lacquered"
  },
  {
    name: "Sun-Drenched Mediterranean Lemon Herb",
    tags: ["mediterranean", "healthy", "keto-friendly", "clean-eating"],
    sauces: [
      { item: "Kalamata Extra Virgin Olive Oil", amount: "3 tbsp", category: "Spices & Sauces", standardKey: "olive-oil" },
      { item: "Greek Wild Oregano", amount: "1 tbsp dried", category: "Spices & Sauces", standardKey: "oregano" },
      { item: "Crushed Red Pepper Flakes", amount: "1/4 tsp", category: "Spices & Sauces", standardKey: "red-pepper" }
    ],
    verb: "roast with Greek oregano and bright lemon until infused with sunshine"
  },
  {
    name: "Creamy Tuscan Parmesan & Sun-Dried Tomato",
    tags: ["creamy", "italian", "parmesan", "restaurant-style"],
    sauces: [
      { item: "Heavy Cream or Coconut Cream", amount: "1/2 cup", category: "Dairy", standardKey: "cream" },
      { item: "Aged Parmigiano-Reggiano", amount: "1/3 cup grated", category: "Dairy", standardKey: "parmesan" },
      { item: "Oil-Packed Sun-Dried Tomatoes", amount: "3 tbsp chopped", category: "Pantry & Grains", standardKey: "tomatoes" }
    ],
    verb: "simmer in a velvety garlic Parmesan cream sauce that clings to every bite"
  },
  {
    name: "Tangy Honey Dijon & Whole Grain Mustard",
    tags: ["tangy", "honey-mustard", "bistro", "easy"],
    sauces: [
      { item: "Stone-Ground Dijon Mustard", amount: "2 tbsp", category: "Spices & Sauces", standardKey: "dijon-mustard" },
      { item: "Raw Clover Honey", amount: "1.5 tbsp", category: "Spices & Sauces", standardKey: "honey" },
      { item: "Apple Cider Vinegar", amount: "1 tbsp", category: "Spices & Sauces", standardKey: "vinegar" }
    ],
    verb: "baste with sweet tangy honey Dijon until bubbly and lightly glazed"
  },
  {
    name: "Sweet & Spicy Thai Chili Coconut",
    tags: ["thai", "coconut", "sweet-heat", "curry"],
    sauces: [
      { item: "Full-Fat Coconut Milk", amount: "1/2 cup", category: "Pantry & Grains", standardKey: "coconut-milk" },
      { item: "Thai Sweet Chili Sauce", amount: "2 tbsp", category: "Spices & Sauces", standardKey: "chili-sauce" },
      { item: "Red Curry Paste", amount: "1 tbsp", category: "Spices & Sauces", standardKey: "curry-paste" }
    ],
    verb: "bathe in a creamy, fragrant Thai coconut curry broth packed with aromatics"
  },
  {
    name: "Smoky Texas Hickory BBQ Rub",
    tags: ["bbq", "smoky", "high-protein", "southern"],
    sauces: [
      { item: "Artisan Smoky Barbecue Sauce", amount: "1/3 cup", category: "Spices & Sauces", standardKey: "bbq-sauce" },
      { item: "Dark Brown Sugar & Garlic Powder", amount: "1 tbsp combined", category: "Spices & Sauces", standardKey: "garlic-powder" },
      { item: "Worcestershire Sauce", amount: "1 tsp", category: "Spices & Sauces", standardKey: "worcestershire" }
    ],
    verb: "caramelize with rich smoky barbecue rub until sticky and savory"
  },
  {
    name: "Classic French Dijon Herb Butter",
    tags: ["french", "bistro", "herb-butter", "classic"],
    sauces: [
      { item: "Salted Sweet Cream Butter", amount: "3 tbsp", category: "Dairy", standardKey: "butter" },
      { item: "Dijon Mustard", amount: "1 tbsp", category: "Spices & Sauces", standardKey: "dijon-mustard" },
      { item: "Fresh Tarragon or Parsley", amount: "1 tbsp chopped", category: "Produce", standardKey: "herbs" }
    ],
    verb: "drizzle with warm melted bistro herb butter for pure comfort"
  },
  {
    name: "Fiery Cajun Blackened Spice",
    tags: ["cajun", "creole", "spicy", "bold"],
    sauces: [
      { item: "Louisiana Blackened Creole Seasoning", amount: "1 tbsp", category: "Spices & Sauces", standardKey: "creole-seasoning" },
      { item: "Melted Butter", amount: "2 tbsp", category: "Dairy", standardKey: "butter" },
      { item: "Hot Pepper Sauce", amount: "1 tsp", category: "Spices & Sauces", standardKey: "hot-sauce" }
    ],
    verb: "crust in blackened Cajun spices in a scorching cast-iron skillet"
  }
];

const STYLES = [
  {
    name: "Crisp Sheet Pan Bake",
    category: "Sheet Pan Meals",
    prep: "10 mins",
    cook: "20 mins",
    difficulty: "Easy",
    instructions: (prot, flav, prod) => [
      `Preheat your oven to 400°F (200°C) and line an extra-large rimmed baking sheet with parchment paper or foil.`,
      `Place your prepared ${prot.name.toLowerCase()} and diced ${prod.map(p => p.name.toLowerCase()).join(', ')} directly onto the pan in a single, even layer.`,
      `Whisk together the seasonings: ${flav.sauces.map(s => s.item).join(', ')}. Pour generously over everything and toss gently with tongs to coat every piece.`,
      `Roast for 18 to 22 minutes until the ${prot.name.toLowerCase()} reaches a safe internal temperature and vegetables are tender-crisp with caramelized edges.`,
      `Remove from the oven, garnish with fresh herbs, and serve hot right from the pan.`
    ]
  },
  {
    name: "Sizzling One-Skillet Sear",
    category: "Quick Dinners",
    prep: "10 mins",
    cook: "15 mins",
    difficulty: "Easy",
    instructions: (prot, flav, prod) => [
      `Heat a large heavy-bottomed skillet or cast iron pan over medium-high heat with cooking fat.`,
      `Add the ${prot.name.toLowerCase()} in a single layer without overcrowding. Sear undisturbed for 4-5 minutes until deeply browned on the bottom, then flip.`,
      `Toss in the ${prod.map(p => p.name.toLowerCase()).join(' and ')}, stirring frequently for 4 minutes until vibrant and tender.`,
      `Pour in ${flav.sauces.map(s => s.item).join(', ')} to create a pan sauce. Simmer vigorously for 2 minutes to ${flav.verb}.`,
      `Plate immediately with spoonfuls of the pan glaze drizzled over top.`
    ]
  },
  {
    name: "15-Minute Wok Stir-Fry",
    category: "15-Minute Meals",
    prep: "8 mins",
    cook: "7 mins",
    difficulty: "Easy",
    instructions: (prot, flav, prod) => [
      `Whisk the sauce ingredients in a small ramekin: ${flav.sauces.map(s => s.item).join(', ')}. Set right next to your stove.`,
      `Heat a wok or deep skillet on high heat until smoking hot. Swirl in 1 tablespoon of high-heat cooking oil.`,
      `Toss in the ${prot.name.toLowerCase()} and stir-fry aggressively for 3-4 minutes until seared through. Remove to a side plate.`,
      `Add the ${prod.map(p => p.name.toLowerCase()).join(', ')} with a splash of water. Flash stir-fry for 2-3 minutes until bright and snappy.`,
      `Return the protein to the pan, pour in the sauce, and toss continuously for 60 seconds until a glossy glaze coats every piece.`
    ]
  },
  {
    name: "Hearty Nourish Bowl",
    category: "Healthy & Fresh",
    prep: "12 mins",
    cook: "15 mins",
    difficulty: "Easy",
    instructions: (prot, flav, prod) => [
      `Cook or warm your favorite grain base (brown rice, quinoa, or fluffy cauliflower rice) and divide between wide serving bowls.`,
      `In a medium skillet, cook the ${prot.name.toLowerCase()} seasoned with salt, pepper, and aromatics until tender and cooked through.`,
      `Lightly steam or sauté the ${prod.map(p => p.name.toLowerCase()).join(', ')} until crisp-tender to preserve bright color and micronutrients.`,
      `Arrange the protein and colorful veggies in sections across your bowl base.`,
      `Drizzle the ${flav.name.toLowerCase()} dressing (${flav.sauces.map(s => s.item).join(', ')}) over the top and enjoy!`
    ]
  },
  {
    name: "Savory Skillet Frittata",
    category: "Breakfast & Brunch",
    prep: "10 mins",
    cook: "15 mins",
    difficulty: "Easy",
    instructions: (prot, flav, prod) => [
      `Whisk 6 fresh eggs with a splash of milk, pinch of sea salt, black pepper, and half of the seasonings until light and frothy.`,
      `Sauté the ${prod.map(p => p.name.toLowerCase()).join(' and ')} in an oven-safe 10-inch skillet with butter or olive oil for 3-4 minutes until softened.`,
      `Fold in the cooked ${prot.name.toLowerCase()} and spread everything evenly across the base of the skillet.`,
      `Pour the egg mixture over the ingredients. Cook over medium-low heat for 4 minutes until the bottom begins to set.`,
      `Transfer under the oven broiler for 3-4 minutes until golden, puffed, and fully set in the center.`
    ]
  },
  {
    name: "Slow-Simmered Comfort Skillet",
    category: "Comfort Food",
    prep: "10 mins",
    cook: "25 mins",
    difficulty: "Medium",
    instructions: (prot, flav, prod) => [
      `Brown the ${prot.name.toLowerCase()} in a deep Dutch oven or heavy saucepan over medium-high heat until richly caramelized.`,
      `Stir in ${prod.map(p => p.name.toLowerCase()).join(', ')} and cook for 3-4 minutes until softened and fragrant.`,
      `Pour in ${flav.sauces.map(s => s.item).join(', ')} along with 1/2 cup of broth or water to deglaze the browned bits from the bottom of the pot.`,
      `Reduce heat to low, cover, and gently simmer for 15-20 minutes until the flavors meld together and protein is fall-apart tender.`,
      `Uncover, simmer for 2 minutes to thicken the sauce to your liking, and ladle into warm shallow bowls.`
    ]
  }
];

let nextId = existingRecipes.length + 1;
const generatedRecipes = [];

// Loop until we reach exactly TARGET_TOTAL
for (let pIdx = 0; pIdx < PROTEINS.length && generatedRecipes.length < NEEDED; pIdx++) {
  const prot = PROTEINS[pIdx];
  for (let cIdx = 0; cIdx < PRODUCE_COMBOS.length && generatedRecipes.length < NEEDED; cIdx++) {
    const prod = PRODUCE_COMBOS[cIdx];
    for (let fIdx = 0; fIdx < FLAVORS.length && generatedRecipes.length < NEEDED; fIdx++) {
      const flav = FLAVORS[fIdx];
      for (let sIdx = 0; sIdx < STYLES.length && generatedRecipes.length < NEEDED; sIdx++) {
        const style = STYLES[sIdx];

        const recipeId = `rec-${String(nextId).padStart(3, '0')}`;
        nextId++;

        const title = `${flav.name} ${prot.name} (${style.name})`;

        const ingredients = [
          {
            item: prot.name,
            amount: prot.defaultAmt,
            category: prot.cat,
            standardKey: prot.key
          },
          ...prod.map(p => ({
            item: p.name,
            amount: p.amount,
            category: p.cat,
            standardKey: p.key
          })),
          ...flav.sauces.map(s => ({
            item: s.item,
            amount: s.amount,
            category: s.category,
            standardKey: s.standardKey
          }))
        ];

        const tags = Array.from(new Set([
          style.category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-'),
          prot.key,
          ...flav.tags,
          "easy",
          "tested",
          "quick-prep"
        ]));

        const recipeObj = {
          id: recipeId,
          title: title,
          category: style.category,
          prepTime: style.prep,
          cookTime: style.cook,
          servings: (nextId % 2 === 0) ? 4 : 2,
          difficulty: style.difficulty,
          description: `A gourmet, easy-to-make meal featuring tender ${prot.name.toLowerCase()} and crisp ${prod[0].name.toLowerCase()} that you ${flav.verb}. Ready in just ${style.cook}.`,
          ingredients: ingredients,
          instructions: style.instructions(prot, flav, prod),
          tags: tags,
          imageUrl: FOOD_IMAGES[nextId % FOOD_IMAGES.length],
          likes: 40 + ((nextId * 29) % 450)
        };

        generatedRecipes.push(recipeObj);
      }
    }
  }
}

const allRecipes = [...existingRecipes, ...generatedRecipes];
console.log(`Generated ${generatedRecipes.length} new recipes. Total in catalog: ${allRecipes.length}`);

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

/**
 * Spanish Translation Dictionary for SnapChef AI
 * Designed for easy review and tweaking by native Spanish speakers.
 */

export type Language = 'en' | 'es'

export interface TranslationDictionary {
  // Cook Mode UI
  step: string
  of: string
  ingredients: string
  startTimer: string
  pauseTimer: string
  restartTimer: string
  prev: string
  next: string
  done: string
  readStep: string
  stopReading: string
  autoRead: string
  speed: string
  servings: string
  cookTime: string
  startCooking: string
  readInstructions: string
  pauseInstructions: string
  allIngredientsReady: string
  favorite: string
  favorited: string
  close: string
  language: string
}

export const UI_TRANSLATIONS: Record<Language, TranslationDictionary> = {
  en: {
    step: 'Step',
    of: 'of',
    ingredients: 'Ingredients',
    startTimer: 'Start Timer',
    pauseTimer: 'Pause Timer',
    restartTimer: 'Restart Timer',
    prev: 'Prev',
    next: 'Next',
    done: 'Done',
    readStep: 'Read Step',
    stopReading: 'Stop',
    autoRead: 'Auto-Read',
    speed: 'Speed',
    servings: 'Servings',
    cookTime: 'Cook Time',
    startCooking: 'Start Cooking',
    readInstructions: 'Read Instructions',
    pauseInstructions: 'Pause Audio',
    allIngredientsReady: 'All ingredients ready to cook!',
    favorite: 'Favorite',
    favorited: 'Favorited ⭐',
    close: 'Close',
    language: 'Language',
  },
  es: {
    step: 'Paso',
    of: 'de',
    ingredients: 'Ingredientes',
    startTimer: 'Iniciar Cronómetro',
    pauseTimer: 'Pausar',
    restartTimer: 'Reiniciar',
    prev: 'Anterior',
    next: 'Siguiente',
    done: '¡Listo!',
    readStep: 'Leer Paso',
    stopReading: 'Detener',
    autoRead: 'Lectura Automática',
    speed: 'Velocidad',
    servings: 'Porciones',
    cookTime: 'Tiempo',
    startCooking: 'Empezar a Cocinar',
    readInstructions: 'Leer Instrucciones',
    pauseInstructions: 'Pausar Audio',
    allIngredientsReady: '¡Todos los ingredientes listos!',
    favorite: 'Favorito',
    favorited: 'Favorito ⭐',
    close: 'Cerrar',
    language: 'Idioma',
  },
}

/**
 * Common culinary ingredient translations (English -> Spanish)
 */
export const INGREDIENT_TRANSLATIONS: Record<string, string> = {
  'eggs': 'huevos',
  'egg': 'huevo',
  'cheddar cheese': 'queso cheddar',
  'cheese': 'queso',
  'mozzarella cheese': 'queso mozzarella',
  'parmesan cheese': 'queso parmesano',
  'bread': 'pan',
  'sliced bread': 'pan de molde',
  'butter': 'mantequilla',
  'unsalted butter': 'mantequilla sin sal',
  'olive oil': 'aceite de oliva',
  'vegetable oil': 'aceite vegetal',
  'canola oil': 'aceite de canola',
  'cooking oil': 'aceite para cocinar',
  'salt': 'sal',
  'black pepper': 'pimienta negra',
  'pepper': 'pimienta',
  'garlic': 'ajo',
  'garlic powder': 'ajo en polvo',
  'onion': 'cebolla',
  'onion powder': 'cebolla en polvo',
  'green onions': 'cebollines / cebollitas verdes',
  'scallions': 'cebollines',
  'chicken breast': 'pechuga de pollo',
  'chicken': 'pollo',
  'cooked chicken': 'pollo cocido',
  'ground beef': 'carne molida',
  'beef': 'carne de res',
  'rice': 'arroz',
  'cooked rice': 'arroz cocido',
  'pasta': 'pasta',
  'spaghetti': 'espagueti',
  'flour tortillas': 'tortillas de harina',
  'corn tortillas': 'tortillas de maíz',
  'tortillas': 'tortillas',
  'potatoes': 'papas',
  'potato': 'papa',
  'tomatoes': 'tomates',
  'tomato': 'tomate',
  'tomato sauce': 'salsa de tomate',
  'milk': 'leche',
  'heavy cream': 'crema espesa',
  'sour cream': 'crema agria',
  'bell pepper': 'pimiento dulce / chile morrón',
  'jalapeño': 'jalapeño',
  'cilantro': 'cilantro',
  'parsley': 'perejil',
  'lemon': 'limón amarillo',
  'lime': 'limón verde',
  'lemon juice': 'jugo de limón',
  'lime juice': 'jugo de lima',
  'sugar': 'azúcar',
  'brown sugar': 'azúcar morena',
  'honey': 'miel',
  'soy sauce': 'salsa de soya',
  'mayonnaise': 'mayonesa',
  'mustard': 'mostaza',
  'bacon': 'tocino',
  'sausage': 'salchicha / chorizo',
  'ham': 'jamón',
  'tuna': 'atún',
  'canned tuna': 'atún en lata',
  'black beans': 'frijoles negros',
  'beans': 'frijoles',
  'avocado': 'aguacate',
  'spinach': 'espinacas',
  'mushrooms': 'champiñones / hongos',
  'water': 'agua',
}

/**
 * Common culinary action phrases (English -> Spanish)
 */
export const PHRASE_TRANSLATIONS: [RegExp, string][] = [
  [/^heat (a |an )?(pan|skillet|pot) (over|on) (medium-high|medium|low|high) heat/i, 'Calienta una sartén a fuego $4'],
  [/^melt (the )?butter in (a |an )?(pan|skillet) over medium heat/i, 'Derrite la mantequilla en una sartén a fuego medio'],
  [/^whisk (the )?eggs? (with|and) (salt|pepper|milk) in a (bowl|small bowl)/i, 'Bate los huevos con $3 en un tazón'],
  [/^pour the eggs into the pan/i, 'Vierte los huevos en la sartén'],
  [/^scramble (gently|until set|softly)/i, 'Revuelve suavemente hasta que cuajen'],
  [/^cook for (\d+)-(\d+) minutes/i, 'Cocina durante $1 a $2 minutos'],
  [/^cook for (\d+) minutes/i, 'Cocina durante $1 minutos'],
  [/^cook for (\d+) seconds/i, 'Cocina durante $1 segundos'],
  [/^stir frequently/i, 'Revuelve frecuentemente'],
  [/^stir occasionally/i, 'Revuelve ocasionalmente'],
  [/^season with salt and (black )?pepper/i, 'Sazona con sal y pimienta al gusto'],
  [/^serve hot and enjoy!?/i, '¡Sirve caliente y disfruta!'],
  [/^serve hot/i, 'Sirve caliente'],
  [/^top with (fresh )?cilantro/i, 'Decora con cilantro fresco por encima'],
  [/^top with cheese/i, 'Cubre con queso rallado'],
  [/^flip and cook (the )?other side/i, 'Voltea y cocina el otro lado'],
  [/^toast until golden brown/i, 'Tuesta hasta que esté dorado y crujiente'],
  [/^remove from heat/i, 'Retira del fuego'],
  [/^bring to a boil/i, 'Lleva a ebullición'],
  [/^reduce heat to low and simmer/i, 'Reduce el fuego a bajo y cocina a fuego lento'],
  [/^drain and rinse/i, 'Escurre y enjuaga'],
  [/^dice the (onion|tomatoes|potatoes|chicken)/i, 'Corta en cubos el $1'],
  [/^mince the garlic/i, 'Pica finamente el ajo'],
]

/**
 * Translates a single ingredient string into Spanish if a match exists.
 */
export function translateIngredientName(ingredient: string, lang: Language): string {
  if (lang !== 'es') return ingredient
  const lower = ingredient.toLowerCase().trim()
  if (INGREDIENT_TRANSLATIONS[lower]) {
    return INGREDIENT_TRANSLATIONS[lower]
  }
  // Try partial word replacements
  for (const [en, es] of Object.entries(INGREDIENT_TRANSLATIONS)) {
    if (lower === en) return es
  }
  return ingredient
}

/**
 * Translates a recipe step instruction into Spanish.
 * Uses exact phrase mappings, common recipe patterns, and ingredient substitutions.
 */
export function translateInstructionStep(instruction: string, lang: Language): string {
  if (lang !== 'es') return instruction

  let translated = instruction

  // Test against regex phrase patterns
  for (const [pattern, replacement] of PHRASE_TRANSLATIONS) {
    if (pattern.test(translated)) {
      translated = translated.replace(pattern, replacement)
    }
  }

  // If already significantly translated, return
  if (translated !== instruction) {
    return translated
  }

  // Common vocabulary substitutions
  const wordMap: Record<string, string> = {
    'Heat': 'Calienta',
    'Cook': 'Cocina',
    'Stir': 'Revuelve',
    'Add': 'Agrega',
    'Mix': 'Mezcla',
    'Bake': 'Hornea',
    'Fry': 'Fríe',
    'Sauté': 'Saltea',
    'Flip': 'Voltea',
    'Serve': 'Sirve',
    'Melt': 'Derrite',
    'Whisk': 'Bate',
    'Season with': 'Sazona con',
    'salt and pepper': 'sal y pimienta',
    'medium heat': 'fuego medio',
    'low heat': 'fuego bajo',
    'high heat': 'fuego alto',
    'golden brown': 'dorado crujiente',
    'until tender': 'hasta que esté suave',
    'until melted': 'hasta que se derrita',
    'minutes': 'minutos',
    'minute': 'minuto',
    'seconds': 'segundos',
    'skillet': 'sartén',
    'pan': 'sartén',
    'bowl': 'tazón',
    'plate': 'plato',
    'hot': 'caliente',
    'and enjoy!': '¡y disfruta!',
  }

  for (const [en, es] of Object.entries(wordMap)) {
    const regex = new RegExp(`\\b${en}\\b`, 'gi')
    translated = translated.replace(regex, es)
  }

  return translated
}

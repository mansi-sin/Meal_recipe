/** All static UI strings in English and Hindi */
export const STRINGS = {
  en: {
    tagline: 'Search recipes from around the world — find your next favourite meal.',
    searchPlaceholder: 'e.g. Chicken Tikka, Pasta, Sushi…',
    searchBtn: 'Search',
    searchNote: '',
    back: 'Back',
    ingredients: 'Ingredients',
    instructions: 'Instructions',
    viewRecipe: 'View Recipe',
    watchYT: 'Watch on YouTube',
    speak: 'Listen',
    stopSpeak: 'Stop',
    loading: 'Loading recipe…',
    translating: 'Translating…',
    nothingFound: 'Nothing found',
    nothingFoundSub: "We couldn't find that one. Try a different dish name or category.",
    recipeNotFound: 'Recipe not found',
    recipeNotFoundSub: 'This recipe may have been removed or the link is broken.',
    recipesFor: (n, term) =>
      `${n} recipe${n !== 1 ? 's' : ''}${term ? ` for "${term}"` : ''}`,
    recipesIn: (n, cat) =>
      `${n} recipe${n !== 1 ? 's' : ''} in ${cat}`,
  },
  hi: {
    tagline: 'दुनिया भर की रेसिपी खोजें — अपना अगला पसंदीदा खाना ढूंढें।',
    searchPlaceholder: 'जैसे चिकन टिक्का, पास्ता, सुशी…',
    searchBtn: 'खोजें',
    searchNote: '(अंग्रेज़ी में खोजें)',
    back: 'वापस',
    ingredients: 'सामग्री',
    instructions: 'विधि',
    viewRecipe: 'रेसिपी देखें',
    watchYT: 'YouTube पर देखें',
    speak: 'सुनें',
    stopSpeak: 'रोकें',
    loading: 'रेसिपी लोड हो रही है…',
    translating: 'अनुवाद हो रहा है…',
    nothingFound: 'कुछ नहीं मिला',
    nothingFoundSub: 'इस नाम की रेसिपी नहीं मिली। कोई और नाम आज़माएं।',
    recipeNotFound: 'रेसिपी नहीं मिली',
    recipeNotFoundSub: 'यह रेसिपी हटा दी गई हो सकती है या लिंक टूटा हुआ है।',
    recipesFor: (n, term) =>
      `${n} रेसिपी${term ? ` "${term}" के लिए` : ''}`,
    recipesIn: (n, cat) =>
      `${n} रेसिपी ${cat} में`,
  },
};

/** Category display names in both languages (order must match) */
export const CATEGORY_NAMES = {
  en:  ['Beef', 'Chicken', 'Seafood', 'Vegetarian', 'Pasta', 'Dessert', 'Lamb', 'Vegan'],
  hi:  ['बीफ', 'चिकन', 'समुद्री भोजन', 'शाकाहारी', 'पास्ता', 'मिठाई', 'मेमना', 'वीगन'],
  val: ['Beef', 'Chicken', 'Seafood', 'Vegetarian', 'Pasta', 'Dessert', 'Lamb', 'Vegan'],
};

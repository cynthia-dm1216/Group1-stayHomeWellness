require("dotenv").config();
const param0 = process.argv[2];
const param1 = process.argv[3];
const param2 = process.argv[4];
const param3 = process.argv[5];
const param4 = process.argv[6];
const param5 = process.argv[7];

const q = new RecipeSearchData(
  param0,
  null,
  param1,
  param2,
  [param3, param4],
  param5
);
// const q = new RecipeSearchData([param0, param1], null, param2, param3, [param4, param5]);
// const q = new RecipeSearchData(param0, null, param1, param2, param3, param4, [param5]);
console.log(recipeSearchQuery(q));

/**
 * Object constructor for Recipe Search Query Builder
 * Requires either the searchFood or recipeURI parameter
 * Instantiate with the NEW keyword
 * @param {Text or Array} searchFood Food terms for which to search
 * @param {Text} recipeURI Recipe ID to return
 * @param {Text} dietSpec Blank or one of: Balanced, High-Fiber, High-Protein, Low-Carb, Low-Fat, or Low-Sodium
 * @param {Text} mealType Blank or one of: Breakfast, Lunch, Dinner, or Snack
 * @param {Text or Array} healthSpec Blank or array of listed health restrictions
 * @param {Text or Array} cuisineType Blank or array of ethnic varieties
 * @param {Text or Array} dishType Blank or array of dish classes
 * @param {Text or Array} excludeFood Blank or food terms to exclude
 * @param {Boolean} inSpanish TRUE to Return results in Spanish (BETA); default is FALSE
 */
function RecipeSearchData(
  searchFood = null,
  recipeURI = null,
  dietSpec = null,
  mealType = null,
  healthSpec = null,
  cuisineType = null,
  dishType = null,
  excludeFood = null,
  inSpanish = null
) {
  return {
    searchFood: searchFood,
    recipeURI: recipeURI,
    healthSpec: healthSpec,
    dietSpec: dietSpec,
    cuisineType: cuisineType,
    dishType: dishType,
    mealType: mealType,
    excludeFood: excludeFood,
    inSpanish: inSpanish
  };
}

/**
 * Build an edamam API query from the specified search data.
 * Requires either the searchFood key or the recipeURI key.
 * @param {Object} searchData Object containing search parameters
 */
function recipeSearchQuery(searchData) {
  const {
    searchFood,
    recipeURI,
    healthSpec,
    dietSpec,
    cuisineType,
    dishType,
    mealType,
    excludeFood,
    inSpanish
  } = searchData;

  var queryURL = "https://";

  //      Base API String
  if (!inSpanish) {
    queryURL += "api.edamam.com/search?";
  } else {
    queryURL += "test-es.edamam.com/search?";
  }

  //      Query String
  if (typeof searchFood === "array") {
    let foodQuery = searchFood.join("%2C");
    queryURL += "q=" + foodQuery;
  } else if (searchFood) {
    queryURL += "q=" + searchFood;
  } else if (recipeURI) {
    queryURl += "r=" + recipeURI;
  }

  //      Query Single Parameters
  if (dietSpec) {
    queryURL += "&diet=" + dietSpec;
  }
  if (mealType) {
    queryURL += "&mealType=" + mealType;
  }

  //    Query Multiple Parameters
  if (healthSpec && Array.isArray(healthSpec)) {
    let healthQuery = healthSpec.join("&health=");
    queryURL += "&health=" + healthQuery;
  } else if (healthSpec) {
    queryURL += "&health=" + healthSpec;
  }
  if (cuisineType && Array.isArray(cuisineType)) {
    let cuisineQuery = cuisineType.join("&cuisineType=");
    queryURL += "&cuisineType=" + cuisineQuery;
  } else if (cuisineType) {
    queryURL += "&cuisineType=" + cuisineType;
  }
  if (dishType && Array.isArray(dishType)) {
    let dishQuery = dishType.join("&dishType=");
    queryURL += "&dishType=" + dishQuery;
  } else if (dishType) {
    queryURL += "&dishType=" + dishType;
  }
  if (excludeFood && Array.isArray(excludeFood)) {
    let excludeQuery = excludeFood.join("&excluded=");
    queryURL += "&excluded=" + excludeQuery;
  } else if (excludeFood) {
    queryURL += "&excluded=" + excludeFood;
  }

  //    API Keys
  queryURL +=
    "&app_id=" + process.env.APP_ID + "&app_key=" + process.env.APP_KEY;

  return queryURL;
}

// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");
var axios = require("axios");
require("dotenv").config();
var isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    res.json(req.user);
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function(req, res) {
    db.User.create({
      email: req.body.email,
      password: req.body.password
    })
      .then(function() {
        res.redirect(307, "/api/login");
      })
      .catch(function(err) {
        res.status(401).json(err);
      });
  });

  // Route for logging user out
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });

  // app.get("/api/workout", function(req, res) {
  //   console.log(req.body);
  // });
  //Route for saving a selected recipe
  app.post("/api/recipes", isAuthenticated, function(req, res) {
    // console.log(req);
    // console.log(req.body);
    db.Recipes.create({
      //spread keys/vales from recipe object
      link: req.body.link,
      title: req.body.title,
      uri: req.body.uri,
      UserId: req.user.id
    })
      .then(function(result) {
        res.json(result);
      })
      .catch(function(err) {
        res.status(401).json(err);
      });
  });

  //Route to display selected recipes
  app.get("/api/recipes/saved", isAuthenticated, function(req, res) {
    console.log(req);
    db.Recipes.findAll({
      where: {
        UserId: req.user.id
      }
    }).then(function(result) {
      res.json(result);
    });
  });

  //Route to query API with user input ingredients
  app.get("/api/recipes/:ingredients", isAuthenticated, function(req, res) {
    var userEntry = req.params.ingredients;

    const {
      dietSpec,
      mealType,
      healthSpec,
      cuisineType,
      dishType,
      excludeFood
    } = req.body;

    if (userEntry.indexOf("%2C") > -1) {
      userEntry = userEntry.split("%2C");
    }
    var ingredient = new RecipeSearchData(
      userEntry,
      null,
      dietSpec,
      mealType,
      healthSpec,
      cuisineType,
      dishType,
      excludeFood
    );

    var queryUrl = recipeSearchQuery(ingredient);

    axios
      .get(queryUrl)
      .then(function(result) {
        // res.json(result.data.hits);
        res.json(result.data.hits);
      })
      .catch(function(err) {
        console.error(err.stack);
        res.status(500).send("Something broke!");
      });
  });
};

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

  // var queryURL = "http://";
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

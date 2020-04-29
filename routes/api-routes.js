// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");
var axios = require("axios");
require("dotenv").config();
var isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function (app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function (req, res) {
    res.json(req.user);
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function (req, res) {
    db.User.create({
      email: req.body.email,
      password: req.body.password
    })
      .then(function () {
        res.redirect(307, "/api/login");
      })
      .catch(function (err) {
        res.status(401).json(err);
      });
  });

  // Route for logging user out
  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function (req, res) {
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

  //Route for saving a selected recipe
  app.post("/api/recipes", isAuthenticated, function (req, res) {
    db.Recipes.create({
      //spread keys/values from recipe object
      body: req.body,
      userId: req.user.id
    })
      .then(function (result) {
        res.json(result);
      })
      .catch(function (err) {
        res.status(401).json(err);
      });
  });

  //Route to display selected recipes
  app.get("/api/recipes/selected", function (req, res) {
    db.Recipes.findAll({
      where: {
        userId: req.user.id
      }
    }).then(function (result) {
      res.json(result);
    });
  });

  //Route to query API with user input ingredients
  app.get("/api/recipes/:ingredients", isAuthenticated, function (req, res) {
    var ingredient = req.params.ingredients;
    var queryUrl = `https://api.edamam.com/search?q=beets&app_id=${process.env.APP_ID}&app_key=${process.env.APP_KEY}`

    console.log(ingredient);
    console.log(queryUrl);
    // res.send(ingredient + "<br>" + queryUrl);

    axios
      .get(queryUrl)
      .then(function (result) {
        console.log(result);
        res.send(result.data.hits);
      })
      .catch(function (err) {
        console.error(err.stack)
        res.status(500).send('Something broke!');
      });

      
  })

  //   //External API call
  //   function apiQuery() {
  //     axios
  //       .get("https://api.edamam.com/search?q=beets&app_id=f876d2ab&app_key=f3704087ed21caa6260f24b22b7b655f")
  //       .then(function (res) {
  //         return res.data.hits;
  //       })
  //       .catch(function (error) {
  //         console.log(error);
  //       });
  //   }
};

var _ENTER_KEYCODE = 13;
var _TAB_KEYCODE = 9;

var _ingredientCount = -1;
//please update me now
// $(document).ready(function() {});

//  Key-down event for Ingredient Input Box
$("#ingredient-input").on("keydown", function(event) {
  if (event.keyCode === _ENTER_KEYCODE || event.keyCode === _TAB_KEYCODE) {
    event.preventDefault();

    // console.log(event.keyCode);
    var ingredientInput = $("#ingredient-input");
    var ingredientEntry = ingredientInput.val();

    if (ingredientEntry && ingredientEntry.trim() !== "") {
      var ingredientsList = $("#ingredient-list");
      _ingredientCount++;

      // console.log(ingredientEntry);
      // console.log(_ingredientCount);
      ingredientsList.append(
        IngredientBlock(ingredientEntry, _ingredientCount)
      );
      ingredientInput.val("");
    }
  }
});

//  On-Click event for Ingredient Delete Buttons
$(".ingredient-delete").on("click", function() {
  //      This doesn't work. Seems like it needs a hook since the element is created dynamically, but I don't remember for sure.
  var thisValue = this.attr("id").substr(6);
  console.log(this);
  console.log(this.attr("id"));
  $("#ingredient" + thisValue).remove();
});

//  On-Click event for the Find Recipes button
$(".getRecipes").on("click", function() {
  var ingredientArray = [];
  var ingredients = $("#ingredient-list").find("span");
  for (var i = 0; i < ingredients.length; i++) {
    var item = ingredients[i];
    ingredientArray.push(item.textContent);
  }

  var queryString =
    "https://" +
    window.document.domain +
    ":" +
    window.location.port +
    "/api/recipes/" +
    ingredientArray.join("%2C");

  var dietSpec = $("#userDiet").val();
  var userHealth = $("#userHealth").val();
  var userMealType = $("#userMealType").val();
  var userExclude = $("#userExclude").val();

  var queryData = {
    dietSpec: dietSpec,
    userHealth: userHealth,
    userMealType: userMealType,
    userExclude: userExclude
  };
  //   console.log(queryString);

  //   $.ajax({
  //     method: "GET",
  //     query: queryString,
  //     data: queryData

  $.get(queryString, queryData, function(data) {
    //   }).then(function(data) {
    // console.log(data);

    var numberToPost = 6;
    var divSuggested = $("#suggested-recipes");

    // console.log(data);

    for (var i = 0; i < numberToPost; i++) {
      if (!data[i].recipe) {
        break;
      }

      let currentRecipe = data[i].recipe;
      let newDiv = suggestedBlock(currentRecipe);

      divSuggested.append(newDiv);
    }

    $(".recipe-btn").on("click", function(event) {
      event.preventDefault();
      //   console.log(event.target);

      // Make a newRecipe object
      var newRecipe = {
        link: event.target.getAttribute("value"),
        title: event.target.getAttribute("data-title"),
        uri: event.target.getAttribute("data-uri")
      };
      // console.log(newRecipe);

      submitRecipe(newRecipe);
    });
  });
  // console.log(ingredientArray);
});

function submitRecipe(Recipe) {
  $.post("/api/recipes", Recipe, function(data) {
    // window.location.href = "/recipes";
    console.log(data);
  });
}

/**
 * Blockifies the given recipe from Edamam API for rendering
 * @param {Object} currentRecipe Recipe object from API JSON structure
 */
function suggestedBlock(currentRecipe) {
  let recipeImage = currentRecipe.image;
  let recipeLabel = currentRecipe.label;
  let recipeURI = currentRecipe.uri;
  let recipeLink = currentRecipe.url;
  let newDiv = $("<div>");
  let newImage = $("<img>");
  let newLink = $("<a>");
  let newBreak = $("<br>");
  let newBtn = $(`<a class="button is-small recSavBtn" id="btn2">Save</a>`);

  //   newSpace.attr("id", "suggested-tag" + i);
  //   newBtn.attr("id", "suggested-btn" + i);
  newBtn.addClass("recipe-btn");
  newBtn.attr("value", recipeLink);
  newBtn.attr("data-title", recipeLabel);
  newBtn.attr("data-uri", recipeURI);
  newBtn.attr("style", "display: flex; float: right;");

  newImage.attr("src", recipeImage);
  newImage.attr("alt", "food picture");
  newImage.attr("style", "display: flex; float: left;");
  newImage.attr("height", "50px").attr("width", "50px");

  newLink.text(recipeLabel);
  newLink.attr("href", recipeLink);
  newLink.attr("style", "margin-top: 10px; font-size: 16px;");
  newLink.attr("target", "_blank");

  newDiv.attr("style", "display: block; margin: 1px 0;");
  newDiv.append(newImage);
  newDiv.append(newLink);
  newDiv.append(newBreak);
  newDiv.append(newBtn);
  newDiv.append(newBreak);

  return newDiv;
}
// function RecipeBlock(name, link, type, imageURL) {
//   var imgHTML = "";
//   if (imageURL === undefined || imageURL === "") {
//     imgHTML = `<img src="${imageURL}" alt="picture of ${name}" height="100px" width="100px">`;
//   }
//   var myHTML = `
//         <strong><a href="${link}" target="_blank">${type}</a></strong>
//         ${imgHTML}
//         <p>${type}</p>
//         <a class="button is-small recSaveBtn">Save</a>
//     `;
//   return myHTML;
// }

// function recipeContent(recipeArray) {
//   var recipeDiv = $("#suggested-recipes");
//   var newRecipe = $("<p>");

//   recipeDiv.append(newRecipe);
// }

/**
 * Create list item tag for Ingredients entry
 * @param {Text} ingredient Text value
 * @param {Number} index Unique index for dynamic manipulation
 */
function IngredientBlock(ingredient, index) {
  var liTag = $("<li>");
  var divTag = $("<div>").addClass("block");
  var spanTag = $("<span>").addClass("tag is-info");
  var buttonDelete = $("<button>").addClass(
    "delete is-small ingredient-delete"
  );

  liTag.attr("id", "ingredient" + index);
  spanTag.text(ingredient);
  buttonDelete.attr("id", "delete" + index);

  spanTag.append(buttonDelete);
  divTag.append(spanTag);
  liTag.append(divTag);

  return liTag;
}

/**
 * Fetches logged-in user's saved recipes
 */
function getSavedRecipes() {
  $.get("/api/recipes/saved", function(data) {
    // console.log(data);
    if (!data) {
      return;
    }
    renderSavedRecipes(data);
  });
}

/**
 * Displays saved recipes to the page
 * @param {Array} recipes DB record array from Recipes table to be displayed
 */
function renderSavedRecipes(recipes) {
  let savedDiv = $("#saved-recipes");
  for (var i = 0; i < recipes.length; i++) {
    let currentLink = recipes[i].link;
    let currentTitle = recipes[i].title;
    let currentUri = recipes[i].uri;
    console.log(currentLink, currentTitle);

    let newBlock = savedRecipeBlock(currentLink, currentTitle, currentUri);
    savedDiv.append(newBlock);
  }

  $(".saved-delete").on("click", function(event) {
    console.log(event);
    //  *** Delete code goes here ***
  });
}

function savedRecipeBlock(recipeLink, recipeTitle, recipeUri) {
  let newDiv = $("<div>");
  let newLink = $("<a>");
  let newBtn = $("<a>");

  newBtn.addClass("delete is-small saved-delete");
  newBtn.attr("value", recipeLink);
  newBtn.attr("style", "display: inline-flex; float: right;");

  newLink.text(recipeTitle);
  newLink.attr("href", recipeLink);
  newLink.attr("style", "margin-top: 10px; font-size: 16px;");
  newLink.attr("target", "_blank");
  newLink.attr("data-uri", recipeUri);

  //    This is a terrible way to do this. We need to think of something better.
  newDiv.attr("id", recipeLink);

  newDiv.append(newLink);
  newDiv.append(newBtn);

  return newDiv;
}

$(document).ready(function() {
  getSavedRecipes();
});

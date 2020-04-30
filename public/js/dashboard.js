var _ENTER_KEYCODE = 13;
var _TAB_KEYCODE = 9;

var _ingredientCount = -1;

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

  var queryString = "/api/recipes/" + ingredientArray.join("%2C");

  $.ajax({
    method: "GET",
    query: queryString
  }).then(function(data) {
    console.log(data);
  });
  // console.log(ingredientArray);
});

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
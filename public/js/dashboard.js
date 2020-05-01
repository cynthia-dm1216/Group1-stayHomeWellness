var _ENTER_KEYCODE = 13;
var _TAB_KEYCODE = 9;

var _ingredientCount = -1;
//please update me
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
    "http://" +
    window.document.domain +
    ":" +
    window.location.port +
    "/api/recipes/" +
    ingredientArray.join("%2C");

  var queryData = {
    dietSpec: "Low-Fat"
  };
  console.log(queryString);

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

      var currentRecipe = data[i].recipe;

      var imgSrc = currentRecipe.image;
      var newDiv = $("<div>");
      var newImage = $("<img>");
      var newLink = $("<a>");
      var newBreak = $("<br>");
      var newBtn = $(`<a class="button is-small recSavBtn" id="btn2">Save</a>`);

      newSpace.attr("id", "suggested-tag" + i);
      newBtn.attr("id", "suggested-btn" + i);
      newImage.attr("src", imgSrc);
      newImage.attr("alt", "food picture");
      newImage.attr("style", "display: flex; float: left;");
      newImage.attr("height", "50px").attr("width", "50px");
      newLink.text(data[i].recipe.label);
      newLink.attr("href", currentRecipe.url);
      newLink.attr("style", "margin-top: 10px; font-size: 16px;");
      newLink.attr("target", "_blank");
      console.log(data[i].recipe.label, data[i].recipe.image, data[i].recipe.uri);

      newDiv.append(newImage);
      newDiv.append(newLink);
      newDiv.append(newBreak);
      newDiv.append(newBtn);
      divSuggested.append(newDiv);
    }

    // var newSpace1 = $(`<p style="margin-top: 10px" >`);
    // var newSpace2 = $(`<p style="margin-top: 10px" >`);
    // var newSpace3 = $(`<p style="margin-top: 10px" >`);
    // var newSpace4 = $(`<p style="margin-top: 10px" >`);
    // var newSpace5 = $(`<p style="margin-top: 10px" >`);

    // var newbtn2 = $(`<a class="button is-small recSavBtn" id="btn2">Save</a>`)
    // var newbtn3 = $(`<a class="button is-small recSavBtn" id="btn3">Save</a>`)
    // var newbtn4 = $(`<a class="button is-small recSavBtn" id="btn4">Save</a>`)
    // var newbtn5 = $(`<a class="button is-small recSavBtn" id="btn5">Save</a>`)
    // var newbtn6 = $(`<a class="button is-small recSavBtn" id="btn6">Save</a>`)

    console.log(data);
    //var beetRecipe = (JSON.parse(resp));
    // var firstRecipe = JSON.stringify(resp.hits[0].recipe.label);
    // var secondRecipe = JSON.stringify(resp.hits[1].recipe.label);
    // var thirdRecipe = JSON.stringify(resp.hits[2].recipe.label);
    // var fourthRecipe = JSON.stringify(resp.hits[3].recipe.label);
    // var fifthRecipe = JSON.stringify(resp.hits[4].recipe.label);

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

$(document).ready(function() {

});

function RecipeBlock(name, link, type, imageURL) {
    var imgHTML = "";
    if ((imageURL === undefined) || (imageURL == "")) {
        imgHTML = `<img src="${imageURL}" alt="picture of ${name}" height="100px" width="100px">`;
    };
    var myHTML = `
        <strong><a href="${link}" target="_blank">${type}</a></strong>
        ${imgHTML}
        <p>${type}</p>
        <a class="button is-small recSaveBtn">Save</a>
    `;
};

function recipeContent(recipeArray) {
  var recipeDiv = $("#suggested-recipes");
  var newRecipe = $("<p>");
  recipeDiv.append(newRecipe);
};
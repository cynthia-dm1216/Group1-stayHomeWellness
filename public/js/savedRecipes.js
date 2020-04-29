$(document).ready(function() {
  $(".recSavBtn").on("click", function() {
    console.log("clicked");
    
    saveRecipe();
    
    getAllRecipes();
  });
});

function saveRecipe() {
  $.post("/api/recipes").then(function(data) {
    return data;
  });
}

function getAllRecipes() {
  $.get("/api/recipes/selected").then(function(data) {
    $(".recipe-title").append(data);
  });
}

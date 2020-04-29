
//Search flow
    //User inputs ingredients
    //Call to api with ingredients in query
    //Will get object
    //Return res.data.hits.?




$(document).ready(function () {

    //create a click handler on the /is-small class that 
    //saves the recepie 
    //gets all saved recipeies
    $(".recSavBtn").on("click", function (event) {
        console.log("clicked");
        //save recipe
        saveRecipe();
        //get all saved
        getAllRecipes();
    })
});

function saveRecipe() {
    $.post("/api/recipes").then(function (data) {
        return data;
    })
}

function getAllRecipes() {
    $.get("/api/recipes/selected").then(function (data) {
        $(".recipe-title").append(data);
    });
}



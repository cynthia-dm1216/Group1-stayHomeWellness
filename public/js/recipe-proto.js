document.getElementById("btn1").onclick = function (event) {
    event.preventDefault();
    recipeSearch();
};

function recipeSearch() {
    var userFood = document.getElementById("userFood").value;
    var userHealth = document.getElementById("userHealth").value;
    var userDiet = document.getElementById("userDiet").value;
    var userMealType = document.getElementById("userMealType").value;
    var userExclude = document.getElementById("userExclude").value;

    //var queryURL = "https://api.edamam.com/search?q=beets&diet=low-carb&health=vegetarian&meal-type=lunch&excluded=onions&app_id=f876d2ab&app_key=f3704087ed21caa6260f24b22b7b655f";
    var queryURL =
        "https://api.edamam.com/search?q=" +
        userFood +
        "&diet=" +
        userDiet +
        "&health=" +
        userHealth +
        "&meal-type=" +
        userMealType +
        "&excluded=" +
        userExclude +
        "&app_id=f876d2ab&app_key=f3704087ed21caa6260f24b22b7b655f";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (resp) {
        var newSpace1 = $(`<p style="margin-top: 10px" >`);
        var newSpace2 = $(`<p style="margin-top: 10px" >`);
        var newSpace3 = $(`<p style="margin-top: 10px" >`);
        var newSpace4 = $(`<p style="margin-top: 10px" >`);
        var newSpace5 = $(`<p style="margin-top: 10px" >`);

        var newbtn2 = $(`<a class="button is-small recSavBtn" id="btn2">Save</a>`)
        var newbtn3 = $(`<a class="button is-small recSavBtn" id="btn3">Save</a>`)
        var newbtn4 = $(`<a class="button is-small recSavBtn" id="btn4">Save</a>`)
        var newbtn5 = $(`<a class="button is-small recSavBtn" id="btn5">Save</a>`)
        var newbtn6 = $(`<a class="button is-small recSavBtn" id="btn6">Save</a>`)


        console.log(resp);
        //var beetRecipe = (JSON.parse(resp));
        var firstRecipe = JSON.stringify(resp.hits[0].recipe.label);
        var secondRecipe = JSON.stringify(resp.hits[1].recipe.label);
        var thirdRecipe = JSON.stringify(resp.hits[2].recipe.label);
        var fourthRecipe = JSON.stringify(resp.hits[3].recipe.label);
        var fifthRecipe = JSON.stringify(resp.hits[4].recipe.label);

        // newSpace1.text(firstRecipe);
        // newSpace2.text(secondRecipe);
        // newSpace3.text(thirdRecipe);
        // newSpace4.text(fourthRecipe);
        // newSpace5.text(fifthRecipe);

        // $("#postHere1").append(newSpace1, newbtn2);
        // $("#postHere2").append(newSpace2, newbtn3);
        // $("#postHere3").append(newSpace3, newbtn4);
        // $("#postHere4").append(newSpace4, newbtn5);
        // $("#postHere5").append(newSpace5, newbtn6);

        $("#newid1").append(firstRecipe);
    });
}

// The code in add.js handles what happens when the user clicks the "Add a book" button.

// When user clicks add-btn

var postHere1 = $("#newid1");
var newbtn2 = $("#newbtn1");
$(newbtn2).on("click", function (event) {
    event.preventDefault();

    // Make a newRecipe object
    var newRecipe = {
        link: postHere1.text().trim(),
        UserId: 1
    };
    console.log(newRecipe);

    submitRecipe(newRecipe);
});

function submitRecipe(Recipe) {
    $.post("/api/all/", Recipe, function () {
        window.location.href = "/all";
    });
}
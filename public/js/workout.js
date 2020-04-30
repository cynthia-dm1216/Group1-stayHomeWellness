$(document).ready(function () {
  //Workout button click function
    var workoutBtn = $(".workoutBtn");
  workoutBtn.click(function(){
    //console.log("I have been clicked");
      //button works
  })
  //navabar workout click handler
  var navWorkout = $(".navbar-item");
  navWorkout.click(function() {
    //console.log("lets workout");
  })
 //variable to hold workouts
 var newWorkouts;

 var url = window.location.search;
 var workoutsId;
 //what does this mean???????????
 if (url.indexOf("?workouts_id=") !== -1) {
  workoutsId = url.split("=")[1];
  getWorkouts(workoutsId);
 }
 
 
 // getting workouts from the database and updates the view
 

})
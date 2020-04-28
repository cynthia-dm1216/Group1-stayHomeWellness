
module.exports = function() {

    const https = require('https');

https.get("https://api.edamam.com/search?q=beets&diet=low-carb&health=vegetarian&meal-type=lunch&excluded=onions&app_id=f876d2ab&app_key=f3704087ed21caa6260f24b22b7b655f", (resp) => {
  let data = '';

  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    //console.log(JSON.parse(data).hits);
    return (JSON.parse(data).hits);
  });

}).on("error", (err) => {
  //console.log("Error: " + err.message);
  return ("Error: " + err.message);
});


}


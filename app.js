var userInput;
$('#weatherDiv').hide();
// This function handles events where SEARCH button is clicked
$("#search-btn").on("click", function (event) {
    event.preventDefault();

    // This line will grab the text from the input box
    userInput = $("#search-input")
        .val()
        .trim();

    // Input validation
    if (userInput.length > 4) {
        // Calling functions to create cards and clear input
        renderCards(userInput);
        clearInput();
        clearWeather();
    } else {
        alert("Please enter a proper zip code");
        clearInput();
        clearWeather();
    }
});

function clearInput() {
    // clears input area for next entry
    $("#search-input").val("");
}

function clearWeather() {
    // clears input area for next entry
    $(".city").text("");
    $(".wind").text("");
    $(".clouds").text("");
    $(".temp").text("");
}

// BEGIN YELP API //

function renderCards(zipcode) {
    var where = userInput;
    console.log("where: " + where);

    var numResult = 6;

    // Here we have an empty array to push the results into IF they match 'alias: "skiresorts"
    var resortsArr = [];

    var queryURL =
        "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location=" +
        where +
        "&term=ski+resort";

    $.ajax({
        url: queryURL,
        method: "GET",
        headers: {
            Authorization:
                "Bearer K5vhwq6zYBL4NEpBTf2KN1b7BKB3P1ofVlp_BVJxNVWTxOZpQT05QQv3qKrYyW0hu7sHEBbtd-fVHpx3nu3bGtp2OjcJVUVC8isF-RlthbBF_2ZoJYUWAGHGzRe7XXYx"
        }
    }).then(function (response) {
        // console.log(response);

        var results = response.businesses;

        $("#resortsDiv").empty();

        // First for-loop will loop through results and add businesses into resortsArray IF they match alias: skiresorts
        for (var i = 0; i < results.length; i++) {
            if (results[i].categories[0].alias === "skiresorts") {
                console.log("omg this matches");
                resortsArr.push(results[i]);
            }
        }

        console.log(resortsArr);


        //calling sortByRating function (test)
        var resortsByRating = sortByRating(resortsArr);



        // Second for-loop will loop through resortsArray and dynamically create cards for the first 6 results

        function resortsDisplay(resortsArray, numResults) {

            for (var i = 0; i < numResults; i++) {
                console.log(resortsArray[i]);
                var name = resortsArray[i].name;
                console.log("name: " + name);
                var longitude = resortsArray[i].coordinates.longitude;
                // console.log("long: " + longitude);
                var latitude = resortsArray[i].coordinates.latitude;
                // console.log("lat: " + latitude);
                var imageURL = resortsArray[i].image_url;
                // console.log("img url: " + imageURL);
                var phone = resortsArray[i].display_phone;
                // console.log("phone: " + phone);
                var rating = resortsArray[i].rating;
                // console.log("rating: " + rating);
                var address = resortsArray[i].location.address1;

                var card = $("<div>");
                card.addClass("card border-info mb-3 form-rounded m-3 width");

                var cardHeader = $("<div>");
                cardHeader.addClass("card-header form-rounded");
                cardHeader.text("Rating: " + rating);

                var cardImage = $("<img>");
                cardImage.addClass("card-img-top mb-3");
                cardImage.attr("src", imageURL);
                cardImage.attr("id", "card-img");

                var cardBody = $("<div>");
                cardBody.addClass("card-body");
                cardBody.attr("id", "resort-card");

                var title = $("<h4>");
                title.text(name);
                title.addClass("card-title");

                var paragraph1 = $("<p>");
                paragraph1.text(address);
                paragraph1.addClass("card-text");

                var paragraph2 = $("<p>");
                paragraph2.text(phone);
                paragraph2.addClass("card-text");

                var cardButton = $("<button>");
                cardButton.text("Get Weather");
                cardButton.addClass("btn btn-primary form-rounded");
                cardButton.attr("id", "weather-btn");
                cardButton.attr("lat", latitude);
                cardButton.attr("lon", longitude);

                cardBody.append(cardImage);
                cardBody.append(title);
                cardBody.append(paragraph1);
                cardBody.append(paragraph2);
                cardBody.append(cardButton);
                card.append(cardHeader);
                card.append(cardBody);

                $("#resortsDiv").append(card);
            }
        }

        resultsDisplay(resortsArr, numResult);

        $(document).on("click", "#sort-rating", function(){
            console.log("The on click worked!");

        });

       

    });


}

// BEGIN WEATHER API //

function renderWeather() {
    var APIKey = "51deb09fc20d171f26bffd5637e7878c";

    // This will need to pull the lat/lon from the object associated with the card
    var latCoord = $(this).attr("lat");
    var lonCoord = $(this).attr("lon");

    // Here we are building the URL we need to query the database
    var queryURL =
        "http://api.openweathermap.org/data/2.5/weather?lat=" +
        latCoord +
        "&lon=" +
        lonCoord +
        "&appid=" +
        APIKey;
    console.log("url: " + queryURL);
    // Here we run our AJAX call to the OpenWeatherMap API
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        // We store all of the retrieved data inside of an object called "response"
        .then(function (response) {
            $('#weatherDiv').show();
            // Log the resulting object
            console.log(response);
            $("#resort-cards").empty();
            // Converting Kelvin to Farenheit
            var tempK = response.main.temp;
            var tempF = (tempK - 273.15) * 1.8 + 32;
            console.log("f temp: " + tempF);
            // Converting meters/sec to miles/hour (wind)

            var milesHr = response.wind.speed * 2.237;

            // Transfer content to HTML
            $(".city").html("<h1>" + response.name + " Weather Details</h1>");
            $(".wind").text("Wind Speed: " + milesHr.toFixed(2) + " MPH");
            $(".clouds").text("Clouds: " + response.clouds.all + "%");
            $(".temp").text("Temperature: " + tempF.toFixed(2) + " F");
            // Log the data in the console as well
            console.log("Wind Speed: " + milesHr.toFixed(2));
            var metSec = response.wind.speed;
            var milesHr = response.wind.speed * 2.237;
            console.log("mph: " + milesHr);
            // Making a new card
            var newDiv = $("<div>");
            // Add bootstrap class to card
            // Insert weather data into card
            // Transfer content to HTML
            $(".city").html("<h1>" + response.name + " Weather Details</h1>");
            $(".wind").text("Wind Speed: " + tempF.toFixed(2) + " MPH");
            $(".clouds").text("Clouds: " + response.clouds.all + "%");
            $(".temp").text("Temperature: " + tempF.toFixed(2) + " F");
            // Log the data in the console as well
            console.log("Wind Speed: " + response.wind.speed);
            console.log("Humidity: " + response.main.humidity);
            console.log("Temperature (F): " + response.main.temp);
        });

}

// // When cards with a id of 'resort-card' are clicked, call the displayWeather function
$(document).on("click", "#weather-btn", renderWeather);
// $(document).on("click", "#resort-card", renderWeather);

//Sort by rating function

function sortByRating(resultsArray) {
    console.log("sortByRating was called; resultsArray below");
    console.log(resultsArray);
    for (var i = 0; i < resultsArray.length; i++) {
        console.log("Rating of " + resultsArray[i].name + " is " + resultsArray[i].rating);
    }

    function compare(a, b) {
        if (a.rating > b.rating) {
            return -1;
        }
        if (a.rating < b.rating) {
            return 1;
        }
        return 0;
    }

    var sortedArray = resultsArray.sort(compare);

    console.log("Test");
    console.log("Below is resultsArray");
    console.log(resultsArray);
    
    console.log("Below is sortedArray");

    console.log(sortedArray);


    return resultsArray;

}
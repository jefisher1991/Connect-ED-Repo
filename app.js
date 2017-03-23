$(document).ready(function(){

 // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCEHReOrQaquelLRyTt--5LD2OS-9S3HMs",
    authDomain: "connected-b7cf5.firebaseapp.com",
    databaseURL: "https://connected-b7cf5.firebaseio.com",
    storageBucket: "connected-b7cf5.appspot.com",
    messagingSenderId: "359508292918"
  };

  firebase.initializeApp(config);
  var reference = firebase.database();

//Variables

 var today = new Date().toLocaleDateString();
//XY Coordinates for Ratings and Corresponding Timestamps
 var arrayRatings = [];
 var arrayTimeStamp = [];

 //XY Coordinates for Ratings and Corresponding Timestamps
 var arrayQuestions = [];
 var arrayQuesTimeStamp = [];


//EVENT LISTENERS

//Listening for ratings of understanding

$(document).on("click", ".entry", function(event){
	event.preventDefault();
    //$(".rawDataFeed").html("");

	var rating = $(this).attr("value");
	var dateStamp = new Date().toLocaleDateString();
    var utcTime = new Date().getTime();

 //Pushing rating data to the database
	reference.ref().push({
		comprehension: rating,
		date: dateStamp,
  		utc: utcTime
	});
});

//Listening for Questions

$(document).on("click", ".submitQuestionButton", function(){
    event.preventDefault();

    var question = $(".textEntry").val();
    var dateStamp = new Date().toLocaleDateString();
    var utcTime = new Date().getTime();

    reference.ref().push({
        question: question,
        date: dateStamp,
      	utc: utcTime
    });
});

//Retrieving ratings and/or questions with corresponding timestamps from Firebase
reference.ref().on("child_added", function(data) {
 	
        var retrieveRating = data.val().comprehension;
    	var retrieveTimestamp = data.val().utc;
    	var retrieveQuestion = data.val().question;
        var pointDate = data.val().date;
        console.log(pointDate);
        console.log(today);

    if (pointDate === today){
    	if (data.val().comprehension === undefined){
    		if (data.val().question === undefined){
    			return;
    		} else {
    			arrayQuestions.push(retrieveQuestion);
    			arrayQuesTimeStamp.push(retrieveTimestamp);
    		};
    	} else {
    		arrayRatings.push(parseInt(retrieveRating));
    		arrayTimeStamp.push(retrieveTimestamp);
    	};
    };

		//Stats Functions

		runStats();
		
		//Checking for full array
	    	console.log(arrayRatings);
    		console.log(arrayTimeStamp);

    		console.log(arrayQuestions);
    		console.log(arrayQuesTimeStamp);

     // Handle the errors
    }, function(errorObject) {
        alert("Errors handled: " + errorObject.code);
    });

// listener for live data points

reference.ref().orderByChild("utc").limitToLast(10).on("child_added", function(snapshot) {
	if (snapshot.val().date === today && snapshot.hasChild("comprehension") && snapshot.hasChild("date")) {
		var score = snapshot.val().comprehension;
		var date = snapshot.val().date;
		var utcTime = snapshot.val().utc;
		var convertedTime= moment(utcTime).format('LT');

		$(".rawDataFeed").prepend("<br> Comprehension: " + score + " || Time: " + convertedTime);
        console.log("comprehension: " + score + " time: " + convertedTime + "date" + date);
	}
});

reference.ref().orderByChild("utc").limitToLast(1).on("child_added", function(snapshot) {
		var utcTime = snapshot.val().utc;
		var convertedTime= moment(utcTime).format('LT');

    	if (snapshot.val().date === today && snapshot.hasChild("question")) {
    		$(".questionsLiveFeed").prepend("<br>" + snapshot.val().question + "<br> Time: " + convertedTime+ "<br><br>");
            console.log(snapshot.val().question);
    	};
});

//Reset Button Listener

$(document).on("click", ".reset-button", function(){
    reset();
});

//Initial Variables for Stats
    var data = [];
    var mean;
    var median;
    var mode;
    var min;
    var max;
    var minIndex;

//Timer for Refreshing Stats Bar
function runStats(){
    data = [];

    if (arrayRatings.length > 9){
        minIndex = arrayRatings.length - 10;
        console.log(minIndex);
        
        for (var i = minIndex; i < arrayRatings.length; i++){
            data.push(arrayRatings[i]);
        };

        setInterval(function(){
            getNumbers();
            renderHtml();
        }, 1000*60);
        

    } else {
        $(".median").html("MEDIAN: ");
        $(".mean").html("MEAN: ");
        $(".min").html("MIN: ");
        $(".max").html("MAX: ");
    };
};
    //Stats Output; called when database value changes, or on a timed interval
        function getNumbers(){

        getMean();
        getMinMaxMedian();

            //Functions calculating Mean, median, range

            function getMean(){

                var denominator = data.length;
                console.log(data.length);
                console.log(data);
                console.log(minIndex);

                var numerator = 0;
                console.log(denominator);

                for (var i = 0; i < data.length; i++){
                    numerator += data[i];
                    console.log(numerator);
                    
                    
                };
                console.log(numerator);
                mean = (numerator/denominator).toFixed(2);
                console.log(mean);

            };

            function getMinMaxMedian(){
                data.sort(function(a,b){
                    return a - b
                });

                min = data[0];
                max = data[(data.length - 1)];

                getMedian();

                function getMedian(){
                    //Is the length of the array even or odd? Determines how median is calculated!
                    var even = false;

                    if(Number.isInteger(data.length / 2)){
                        even = true;
                    };
            
                    if (even === true){
                        var half = (data.length / 2);
                        var halfMinus = (half - 1);
                        var targets = data[half] + data[halfMinus];
                        median = targets / 2;

                    } else {
                        var half = data.length / 2;
                        median = data[Math.ceil(half)];
                    };
                };
            };
        };



        function renderHtml(){

            $(".median").html("MEDIAN: " + median);
            $(".mean").html("MEAN: "+ mean);
            $(".min").html("MIN: " + min);
            $(".max").html("MAX: " + max);
        };

function reset(){

    //Clear Stats Bar
    $(".median").html("MEDIAN: ");
    $(".mean").html("MEAN: ");
    $(".min").html("MIN: ");
    $(".max").html("MAX: ");

    //Clear Student Responses and Questions
    $(".rawDataFeed").empty();
    $(".questionsLiveFeed").empty();
};

});
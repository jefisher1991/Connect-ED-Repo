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

  //Initialize GoogleCharts

  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(drawChart);

//VARIABLES

var today = new Date().toLocaleDateString();
var ratingTimer;
var questionTimer;

//XY Coordinates for Ratings and Corresponding Timestamps
var arrayRatings = [];
var arrayTimeStamp = [];

//XY Coordinates for Ratings and Corresponding Timestamps
var arrayQuestions = [];
var arrayQuesTimeStamp = [];

//Initial Variables for Stats
var segment = [];
var mean;
var median;
var mode;
var min;
var max;
var minIndex;

//EVENT LISTENERS

//Listening for ratings of understanding

$(document).on("click", ".entry", function(event){
	event.preventDefault();
    
    // Disable Button for 60 seconds - prevent spamming!
    $(".entry").prop("disabled", true);
    enableEntryTimer();

    //Store the rating and timestamp of submission
	var rating = $(this).attr("value");
	var dateStamp = new Date().toLocaleDateString();
    var utcTime = new Date().getTime();

    //Push rating data to Firebase
    	reference.ref().push({
    		comprehension: rating,
    		date: dateStamp,
      		utc: utcTime
    	});
});

//Listening for Questions

$(document).on("click", ".submitQuestionButton", function(event){
    event.preventDefault();

    //Check for valid user input
    var question = $(".textEntry").val().trim();
        if(question === ""){
            return;
        };

    //If question is not empty, move forward with:

        //Clear the input field
        $(".questionText").val("");

        // Disable Button for 60 seconds - prevent spamming!
        $(".submitQuestionButton").prop("disabled", true);
        enableQuestionTimer();

        //Grab the timestamp of valid submission
        var dateStamp = new Date().toLocaleDateString();
        var utcTime = new Date().getTime();

        //Submit to Firebase
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

    //Only push values in array from TODAY
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

	//Call Stats Functions
	runStats();

    //Display Scatterplot
    drawChart();


    // Handle the errors
    }, function(errorObject) {
        alert("Errors handled: " + errorObject.code);
    });

// Listener for Live Data Points
reference.ref().orderByChild("utc").limitToLast(10).on("child_added", function(snapshot) {
	if (snapshot.val().date === today && snapshot.hasChild("comprehension") && snapshot.hasChild("date")) {
		var score = snapshot.val().comprehension;
		var date = snapshot.val().date;
		var utcTime = snapshot.val().utc;
		var convertedTime= moment(utcTime).format('LT');

		$(".rawDataFeed").prepend("<br> Comprehension: " + score + " || Time: " + convertedTime);
	};
});

// Listener for Questions
reference.ref().orderByChild("utc").limitToLast(1).on("child_added", function(snapshot) {
	var utcTime = snapshot.val().utc;
	var convertedTime= moment(utcTime).format('LT');

	if (snapshot.val().date === today && snapshot.hasChild("question")) {
		$(".questionsLiveFeed").prepend("<br>" + snapshot.val().question + "<br> Time: " + convertedTime+ "<br><br>");
	};
});

//Reset Button Listener
$(document).on("click", ".reset", function(){
    reset();
});

//FUNCTIONS

//Displaying Stats of Students' Ratings
function runStats(){
    segment = [];

    if (arrayRatings.length > 9){
        minIndex = arrayRatings.length - 10;
        
        for (var i = minIndex; i < arrayRatings.length; i++){
            segment.push(arrayRatings[i]);
        };

        //Timer for Refreshing Stats Bar
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

//Stats Output Numbers
function getNumbers(){

    getMean();
    getMinMaxMedian();

    //Functions calculating Mean, median, range
    function getMean(){

        var denominator = segment.length;
        var numerator = 0;

        for (var i = 0; i < segment.length; i++){
            numerator += segment[i];
        };
        mean = (numerator/denominator).toFixed(2);
    };

    function getMinMaxMedian(){
        segment.sort(function(a,b){
            return a - b
        });

        min = segment[0];
        max = segment[(segment.length - 1)];

        getMedian();

        function getMedian(){
            //Is the length of the array even or odd? Determines how median is calculated!
            var even = false;

            if (Number.isInteger(segment.length / 2)){
                even = true;
            };
    
            if (even === true){
                var half = (segment.length / 2);
                var halfMinus = (half - 1);
                var targets = segment[half] + segment[halfMinus];
                median = targets / 2;

            } else {
                var half = segment.length / 2;
                median = segment[Math.ceil(half)];
            };
        };
    };
};

//Display new stats numbers to Instructor HTML
function renderHtml(){

    $(".median").html("MEDIAN: " + median);
    $(".mean").html("MEAN: "+ mean);
    $(".min").html("MIN: " + min);
    $(".max").html("MAX: " + max);
};

//Timer for Re-Enabling Rating Buttons
function enableEntryTimer (){
    ratingTimer = setTimeout(function(){
    $(".entry").prop("disabled", false);
    }, 1000*60);
};

//Timer for Re-Enabling Question Submission Button
function enableQuestionTimer (){
    questionTimer = setTimeout(function(){
    $(".submitQuestionButton").prop("disabled", false);
    }, 1000*60);
};

//Clear portions of Instructor HTML
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

//Use current ratings data, push to GoogleCharts
function drawChart() {
    if($('#curve_chart').length){ 
        var dataList = [];

        for (var i = 0; i < arrayRatings.length; i++){
                dataList.push([arrayTimeStamp[i], arrayRatings[i]]);
            };

        var data = new google.visualization.DataTable();
            data.addColumn('number', 'Time Submitted');
            data.addColumn('number', 'Ratings');
            data.addRows(dataList);

        var options = {
          title: "Students' Comprehension Over Time",
          titleTextStyle: { 
            color: "#B94E12",
            fontName: "sans serif",
            fontSize: 26,
            bold: true,
            italic: false 
        },
          backgroundColor: "#A9A9A9",
          colors: ["#44910A"],
          hAxis: {
            title: 'Time',
            format: 'short',
            gridlines: {
                color: '#BD280E', 
                count: 5
        },

        },
          vAxis: {
            title: 'Ratings',
            gridlines: {
                color: '#BD280E'
        }, 
            minValue: 0, 
            maxValue: 5
        },
          legend: 'none'
        };

        var chart = new google.visualization.ScatterChart(document.getElementById('curve_chart'));
        chart.draw(data, options);
    };

};

});
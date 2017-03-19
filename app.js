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

	//XY Coordinates for Ratings and Corresponding Timestamps
	 var arrayRatings = [];
	 var arrayTimeStamp = [];

	 //XY Coordinates for Ratings and Corresponding Timestamps
	 var arrayQuestions = [];
	 var arrayQuesTimeStamp = [];


//Event listeners

	//Listening for ratings of understanding
		
	$(document).on("click", ".entry", function(event){
		event.preventDefault();

		var rating = $(this).attr("value");
		var timestamp = new Date().toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});
		
	 //Pushing rating data to the database
		reference.ref().push({
			comprehension: rating,
			time: timestamp
		});
	});

	//Listening for Questions

	$(document).on("click", ".submitQuestionButton", function(){
	    event.preventDefault();
	    
	    var question = $(".textEntry").val();
	    var timestamp = new Date().toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});

	    reference.ref().push({
	        question: question,
	        time: timestamp
	    });
	});

//Retrieving ratings and/or questions with corresponding timestamps from Firebase
reference.ref().on("value", function(snapshot) {

	snapshot.forEach(function(data) {
		var retrieveRating = data.val().comprehension;
		var retrieveTimestamp = data.val().time;
		var retrieveQuestion = data.val().question;

	    	if (data.val().comprehension === undefined){
	    		if (data.val().question === undefined){
	    			return;
	    		} else {
	    			arrayQuestions.push(retrieveQuestion);
	    			arrayQuesTimeStamp.push(retrieveTimestamp);
	    		};
	    	} else {
	    		arrayRatings.push(retrieveRating);
	    		arrayTimeStamp.push(retrieveTimestamp);
	    	};
  		});

		//Checking for full array
	    	console.log(arrayRatings);
    		console.log(arrayTimeStamp);

    		console.log(arrayQuestions);
    		console.log(arrayQuesTimeStamp);

     // Handle the errors
    }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });

    	


//Initial Variables for Stats
	var data;
	var mean;
	var median;
	var mode;
	var min;
	var max;


runStats();
renderHtml();

	//Stats Output; called when database value changes, or on a timed interval
	function runStats(){


	//Grab data, global scope?
	data = [1, 5, 3, 4, 2, 4, 5];

	getMean();
	getMinMaxMedian();

		//Functions calculating Mean, median, range

		function getMean(){

			var denominator = data.length;
			var numerator = 0;

			for (var i = 0; i < data.length; i++){
				numerator += data[i];
			};

			mean = (numerator/denominator).toFixed(2);
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

});
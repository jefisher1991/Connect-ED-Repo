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

//Variables
 var arrayRatings = [];
 var arrayTimeStamp = [];

 var reference = firebase.database();

//Event listeners

//Listening for ratings of understanding
	
$(document).on("click", ".entry", function(event){
	event.preventDefault();

	var rating = $(this).attr("value");
	var timestamp = new Date().toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});
	console.log(timestamp);
	
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
	console.log(timestamp);

    reference.ref().push({
        question: question,
        time: timestamp
    });


});

//Retrieving ratings and timestamps from Firebase
reference.ref().on("value", function(snapshot) {
	keys = Object.keys(snapshot.val());
	console.log(keys);

	snapshot.forEach(function(data) {
		var retrieveRating = data.val().comprehension;
		var retrieveTimestamp = data.val().time;
    	console.log(retrieveRating);

	    	if (data.val().comprehension === undefined){
	    		return;
	    	} else {
	    		arrayRatings.push(retrieveRating);
	    		arrayTimeStamp.push(retrieveTimeStamp);
	    	};

    	console.log(arrayRatings);
  		});
  	});

	// //For-loop starts 
	// for(var i = 0; i < keys.length; i++){

	// 	console.log()

	// 	var itemID = keys[i]; //Gives randomized ID key
	// 	var itemPath = "Object.keys(snapshot.val()[" + itemID + "]";
	// 	console.log(Object.keys(snapshot.val()));
	// 	console.log(itemPath);
	// 	var itemPathRating = itemPath + ".comprehension)";
	// 	console.log(itemPathRating);
	// 	var itemPathTime = itemPath + ".time)";

	// 	// arrayRatings.push(parseInt(itemPathRating));
	// 	// arrayTimeStamp.push(itemPathTime);
	// };

	// // console.log(arrayRatings);
	// // console.log(arrayTimeStamp);
      

 //    // Handle the errors
 //    }, function(errorObject) {
 //      console.log("Errors handled: " + errorObject.code);
 //    });


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
	// getMode();

		//Functions calculating Mean, median, mode, range

		function getMean(){

			var denominator = data.length;
			var numerator = 0;

			for (var i = 0; i < data.length; i++){
				numerator += data[i];
			};

			mean = (numerator/denominator).toFixed(2);
			console.log(mean);
		};

		function getMinMaxMedian(){
			console.log("pre-array:" + data);

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
					console.log("half = " + half);
					var halfMinus = (half - 1);
					console.log("halfMinus = " + halfMinus);
					var targets = data[half] + data[halfMinus];
					console.log("targets = " + targets);
					median = targets / 2;
				} else {
					var half = data.length / 2;
					console.log("half = " + half);
					median = data[Math.ceil(half)];

				};

				console.log("median:" + median);

			};
			
			console.log("post-array"+ data);
			console.log("min:" + min);
			console.log("max:" + max);

		};

		// function getMode(){
		// 	var objMode = {
		// 		number: [1, 2, 3, 4, 5],
		// 		count: []
		// 	};

		// 	for (var i = 0; i < data.length; i++){
		// 		for (var i = 0; i < objMode.number.length; i++){
		// 			if (objMode.number[i] === data[i]){
		// 				count[i] = 
		// 			};
		// 		};
		// 	};
		// };


	};

	function renderHtml(){
		$(".median").html("MEDIAN: " + median);
		$(".mean").html("MEAN: "+ mean);
		$(".min").html("MIN: " + min);
		$(".max").html("MAX: " + max);
		// $(".mode").html("MODE: " + mode));


	};

});
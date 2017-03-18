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
 var rating;
 var time;

 var reference = firebase.database();

//Event listeners
	
$(document).on("click", ".submit-button", function(event){
	event.preventDefault();

	//Initial Variables

	 rating = $(".entry").attr("value");
	 

	
 //Pushing employee data to the database
	reference.ref().push({
		understanding: rating
	});


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
	getMode();

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
					// median = Math.ceil(data[half]);
					median = data[Math.ceil(half)];

				};

				console.log("median:" + median);

			};
			
			console.log("post-array"+ data);
			console.log("min:" + min);
			console.log("max:" + max);

		};

		function getMode(){
			var objMode = {
				number: [1, 2, 3, 4, 5],
				count: []
			};

			for (var i = 0; i < data.length; i++){
				for (var i = 0; i < objMode.number.length; i++){
					if (objMode.number[i] === data[i]){
						count[i] = 
					};
				};
			};
		};


	};

	function renderHtml(){
		$(".median").html("MEDIAN: " + median);
		$(".mean").html("MEAN: "+ mean);
		$(".min").html("MIN: " + min);
		$(".max").html("MAX: " + max);
		// $(".mode").html("MODE: " + mode));


	};

});
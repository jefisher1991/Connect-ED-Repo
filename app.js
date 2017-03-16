$(document).ready(function(){
//Initial Variables for Stats

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

			mean = numerator/denominator;
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

		// function getMode(){

		// };


	};

	function renderHtml(){
		$(".median").html(median);
		$(".mean").html(mean);
		$(".min").html(min);
		$(".max").html(max);
		// $(".mode").html(mode);


	};

});
/*globals $:false */
function time(config)
{
	var time = $(".Time");
	var today = new Date();
	//t = setTimeout(startTime, 500);
	var hours = today.getHours();
	var minutes = today.getMinutes();
	var seconds = today.getSeconds();
	if (minutes < 10)
	{
		minutes = "0" + minutes;
	}
	if(seconds < 10){
		seconds = "0" + seconds;
	}
	if (config.general.military === false){
		if (hours > 12)
		{
			hours = hours - 12;
		}
	}
	var str = hours + ":" + minutes;
	if (config.general.showSec === true){
		str = str + ":" + seconds;
	}
	if (config.general.military === false){
		if (today.getHours() <= 12){
			str = str + "AM";
		}
		else{
			str = str + "PM";
		}
	}
	
	time.text(str);
}
$( document ).ready(function () {
	'use strict'
	var longWait = 2000;	//for not showing seconds
	var shortWait = 250;
	var mytext = {contents: ""};
	readTextFile("http://localhost/config.json",mytext);		//read config file
	var config = JSON.parse(mytext.contents);		//get a JSON array from the raw file contents
	time(config); //intialize time
	var timeInterval = longWait;
	if(config.general.showSec){
		timeInterval = shortWait;
	}
	var newTimeInterval = timeInterval;
	var timeFunc = setInterval(function () {
		time(config);
	}, timeInterval); //Update time every this many ms
	setInterval(function () {
		mytext = {contents: ""};
		readTextFile("http://localhost/config.json",mytext);		//read config file
	    config = JSON.parse(mytext.contents);		//get a JSON array from the raw file contents
		if(config.general.showSec){		
			newTimeInterval = shortWait;
		}
		else{
			newTimeInterval = longWait;
		}
		if(newTimeInterval != timeInterval){	//check if showSec has changed
			clearInterval(timeFunc);
			timeInterval = newTimeInterval;
			var timeFunc = setInterval(function () {
				time(config);
			}, timeInterval);
		}
	}, 4000); //check for style changes every this many ms
});

/*globals $:false */
function loadWeather(location) {
    'use strict';
    $.simpleWeather({
        location: location,
        unit: 'f',
        success: function (weather) {
            var temp = weather.temp + '&deg;',
				forecast = weather.forecast[3].text,
                city = weather.city + ', ' + weather.region;
            $(".location").text(city);			//assign .location class the text in city
            $(".temperature").html(temp);
			$(".forecast").text(forecast);
        },
        error: function (error) {
            $(".location").text("Mankato, MN");
            $(".temperature").html("69 f");
        }
    });
}
function readTextFile(file,mystring)
{
	var rawFile = new XMLHttpRequest();
	rawFile.open("GET", file, false);
	rawFile.onreadystatechange = function ()
	{
		if(rawFile.readyState === 4)
		{
			if(rawFile.status === 200)
			{
				var allText = rawFile.responseText;
				mystring.contents += allText;
			}
		}
	}
	rawFile.send(null);
}
function Time(config)
{
	var time = $(".Time");
	var today = new Date();
	//t = setTimeout(startTime, 500);
	var hours = today.getHours();
	var minutes = today.getMinutes();
	if (minutes < 10)
	{
		minutes = "0" + minutes;
	}
	if (config.general.military === false)
	{
		if (hours > 12)
		{
			hours = hours - 12;
		}
	}
	
	if (config.general.military === false)
	{
		if (today.getHours() <= 12)
		{
			str = str + "am";
		}
		else
		{
			str = str + "pm";
		}
	}
	var str = hours + ":" + minutes;
	time.text(str);
}
function Greeting(config)
{
	var greeting = $(".Greeting");
	var today = new Date();

	if ((today.getHours() < 24) && (today.getHours() > 16))
		{greeting.text("Good Evening");}
	if ((today.getHours() < 17) && (today.getHours() > 10))
		{greeting.text("Good Afternoon");}
	if (today.getHours() < 11)
		{greeting.text("Good Morning");}

}
function update(config, zip){
	Greeting(config);
	Time(config)
	loadWeather(zip)
}
$( document ).ready(function () {
	var zip = $("#zip").text();
	var mytext = {contents: ""};
	readTextFile("http://localhost/config.json",mytext);
	var config = JSON.parse(mytext.contents);
	update(config, zip);
	setInterval(function () {
					update(config, zip);
					setInterval(function () {
						Time(config)
					}, 500); //update time every this many ms
				}, 10000); //update everything else every 1 minute
});


import "./style.css";
import windSvg from "../public/assets/icons/wind.svg";
import windDefaultSvg from "../public/assets/icons/wind-default.svg";
import cancelDialogSvg from "../public/assets/icons/cancel-dialog.svg";
import setWeatherIcon from "./setWeatherIcon";
import API_KEY from "./utils/variables";

var SunCalc = require("suncalc");

const searchParentBox = document.querySelector(".search-parent-box");
const loadingBox = document.querySelector(".loading-box");
const displayLocation = document.getElementById("location");
const searchBar = document.querySelector(".search-bar");
const locationInput = document.getElementById("location-input");
const cUnit = document.getElementById("c-unit");
const fUnit = document.getElementById("f-unit");
const selectedUnit = document.getElementById("selected-unit");
const weatherIcon = document.getElementById("weather-icon");
const currentTemp = document.getElementById("current-temp");
const unitType = document.getElementById("unit-type");
const date = document.getElementById("date");
const day = document.getElementById("day");
const time = document.getElementById("time");
const wind = document.getElementById("wind");
const windDirection = document.getElementById("wind-direction");
const humidity = document.getElementById("humidity");
const rain = document.getElementById("rain");
const rainParent = document.getElementById("rain-parent");
const humidityRainDivider = document.getElementById("humidity-rain-divider");
const weeklyTempChildBox = document.querySelector(".weekly-temp-child-box");
const weeklyTempCard = document.querySelectorAll(".weekly-temp-card");
const scrollLeft = document.getElementById("scroll-left");
const scrollRight = document.getElementById("scroll-right");
const aqUvIndicatorImg = document.getElementById("aq-uv-indicator-img");
const uvIndex = document.getElementById("uv-index");
const uvIndexDesc = document.getElementById("uv-index-desc");
const uvIndexIndicatorBox = document.getElementById("uv-index-indicator-box");
const airQuality = document.getElementById("air-quality");
const airQualityDesc = document.getElementById("air-quality-desc");
const airQualityIndicatorBox = document.getElementById("air-quality-indicator-box");
const airQualityIndicatorBoxClass = document.querySelectorAll(".aq-uv-index-indicator-box");
const sunrise = document.getElementById("sunrise-start");
const sunriseEnd = document.getElementById("sunrise-end");
const sunriseSeconds = document.querySelector("[sunrise-seconds]");
const sunriseMinutes = document.querySelector("[sunrise-minutes]");
const sunriseHours = document.querySelector("[sunrise-hours]");
const goldenHourMorning = document.getElementById("golden-hour-morning");
const goldenHourEvening = document.getElementById("golden-hour-evening");
const goldenHourSeconds = document.querySelector("[golden-hour-seconds]");
const goldenHourMinutes = document.querySelector("[golden-hour-minutes]");
const goldenHourHours = document.querySelector("[golden-hour-hours]");
const sunsetStart = document.getElementById("sunset-start");
const sunset = document.getElementById("sunset-end");
const sunsetSeconds = document.querySelector("[sunset-seconds]");
const sunsetMinutes = document.querySelector("[sunset-minutes]");
const sunsetHours = document.querySelector("[sunset-hours]");
const rightBox = document.querySelector(".right-box");
const info = document.getElementById("info");
const infoBody = document.createElement("div");
const infoDialogCancel = document.createElement("img");
const infoBodyHeading = document.createElement("h3");
const infoBodyData = document.createElement("ul");
const infoBodyCredits = document.createElement("p");

const regionNamesInEnglish = new Intl.DisplayNames(["en"], {
	type: "region",
});

const units = {
	metric: {
		mpsToKmph: 3.6,
		mphToKmph: 1.60934,
	},
	imperial: {
		mpsToMph: 2.237, // Mph -miles per hour mps mete per sec
		kmphToMph: 0.621371,
	},
};

let metric = true;

let previousLocation = "Delhi, India";
let previousLocationGeo = {
	latitude: 28.7,
	longitude: 77.1,
};

// handle change in width of image
let resizeImgObserver = new ResizeObserver((element) => {
	// set the width and height of both div as equal to width of aqUvIndicatorImg
	airQualityIndicatorBoxClass.forEach((ele, key) => {
		ele.style.setProperty("--width-aq-uv-index-indicator-box", element[0].target.clientWidth + 10 + "px");
	});
});
// add a listener to body
resizeImgObserver.observe(aqUvIndicatorImg);

// handling unit change
let handleSelectedUnit = () => {
	if (metric) {
		// to change the position of the selected unit
		if (window.matchMedia("(max-width: 992px)").matches) {
			selectedUnit.style.transform = "translateY(0px)";
		} else {
			selectedUnit.style.transform = "translateX(-45px)";
		}
	} else {
		if (window.matchMedia("(max-width: 992px)").matches) {
			selectedUnit.style.transform = "translateY(36px)";
		} else {
			selectedUnit.style.transform = "translateX(0px)";
		}
	}
};
// update the dom elements only when C or F button are clicked
let handleSelectedUnitUpdateDom = () => {
	let temp = currentTemp.innerText;
	let windSpeed = wind.innerText.split(" ")[0];
	if (metric) {
		unitType.innerHTML = "° C";
		currentTemp.innerHTML = ((temp - 32) * (5 / 9)).toFixed();
		wind.innerHTML = parseFloat((windSpeed * units.metric.mphToKmph).toFixed(1)) + " km/h";
		// updating weekly temp in C
		for (let i = 0; i < weeklyTempCard.length; i++) {
			let ithTemp = weeklyTempCard[i].children[0].children[0].innerText.split(" ")[0];
			weeklyTempCard[i].children[0].children[0].innerHTML = ((ithTemp - 32) * (5 / 9)).toFixed() + " °C";
		}
	} else {
		unitType.innerHTML = "° F";
		currentTemp.innerHTML = (temp * (9 / 5) + 32).toFixed();
		wind.innerHTML = parseFloat((windSpeed * units.imperial.kmphToMph).toFixed(1)) + " mph";
		// updating weekly temp in F
		for (let i = 0; i < weeklyTempCard.length; i++) {
			let ithTemp = weeklyTempCard[i].children[0].children[0].innerText.split(" ")[0];
			weeklyTempCard[i].children[0].children[0].innerHTML = (ithTemp * (9 / 5) + 32).toFixed() + " °F";
		}
	}
};
// update the position of selected unit on change of screen width
window.matchMedia("(max-width: 992px)").addEventListener("change", handleSelectedUnit);
// handle on click of C and F units
cUnit.onclick = function () {
	if (!metric) {
		metric = true;
		handleSelectedUnit();
		handleSelectedUnitUpdateDom();
	}
};
fUnit.onclick = function () {
	if (metric) {
		metric = false;
		handleSelectedUnit();
		handleSelectedUnitUpdateDom();
	}
};

// create and display info dialog
let isInfoDialogOpen = false;
// create a dialog box and set its display to none initially
infoBody.classList.add("info-body");
// add button to cancel
infoDialogCancel.src = cancelDialogSvg;
infoDialogCancel.classList.add("info-body-cancel-button");
// add heading of the dialog
infoBodyHeading.style.color = "#7159B2";
infoBodyHeading.style.margin = "0px 40px 18px 0px";
infoBodyHeading.innerHTML = "More Information:";
// add list in the dialog
infoBodyData.classList.add("info-body-list");
infoBodyData.innerHTML = `
		<li>The weather details for Delhi, India or any other place is determined using the One Call API provided by OpenWeatherMap.org. </li>
		<li>The wind speed and percentage of humidity shown are according to the current time, while the chance of rain is determined for the day.</li>
		<li>The wind direction (meteorological direction) is shown using the arrow icon if the wind speed is available or not zero.</li>
		<li>Sunrise(morning) , golden hour(AM-morning, PM-evening) and sunset(evening) time is calculated using the SunCalc node package. Note: If the weather conditions are not good, these calculations are invalid.</li>
		<li>To fetch the Air quality data of your location, we are using Air Pollution API from OpenWeatherMap.org. Min: 0 Max: 5</li>
		<li>If the current UV index in your location is not available, we have shown the UV index for the day. Min: 0 Max: 15</li>
		`;
// add credits to the dialog
infoBodyCredits.classList.add("info-body-credits");
infoBodyCredits.innerHTML = `Designed and Developed by <a href = "https://github.com/mayankchaudhary19" target="_blank">Mayank Chaudhary</a>`;
// to get and set the color of the list items
for (let i = 0; i < infoBodyData.children.length; i++) {
	infoBodyData.children[i].style.color = "#7159B2";
	infoBodyData.children[i].style.marginBottom = "6px";
}
// to append the created elements to parent
infoBody.appendChild(infoDialogCancel);
infoBody.appendChild(infoBodyHeading);
infoBody.appendChild(infoBodyData);
infoBody.appendChild(infoBodyCredits);
rightBox.appendChild(infoBody);
// change the top margin acc. to screen size
let handleInfoDialogMargin = () => {
	// to change the position of the selected unit
	if (isInfoDialogOpen) {
		if (window.matchMedia("(max-width: 992px)").matches) {
			infoBody.style.top = "20px";
			infoBody.style.bottom = "20px";
		} else {
			infoBody.style.top = "90px";
			infoBody.style.bottom = "40px";
		}
	}
};
window.matchMedia("(max-width: 992px)").addEventListener("change", handleInfoDialogMargin);
// to open info dialog
let handleInfoDialogOpen = () => {
	if (!isInfoDialogOpen) {
		infoBody.style.display = "block";
		isInfoDialogOpen = true;
		handleInfoDialogMargin();
	}
};
info.addEventListener("click", handleInfoDialogOpen);
let handleInfoDialogClose = () => {
	if (isInfoDialogOpen) {
		infoBody.style.display = "none";
		isInfoDialogOpen = false;
	}
};
document.addEventListener("mouseup", (event) => {
	// check for parent of search bar so that when user selects the text and mistakenly clicks just outside search bar, then the serach bar does not get hidden
	if (!infoBody.contains(event.target)) {
		handleInfoDialogClose();
	}
});
infoDialogCancel.addEventListener("click", handleInfoDialogClose);

// TODO:show errors if a dialog

//  handle scroll right
// 	hide scroll when screen size is small(600 px or less) and show left swipe only when scroll left !=0
let handleScrollWeeklyWeatherBox = (event) => {
	if (window.matchMedia("(max-width: 600px)").matches) {
		scrollLeft.style.display = "none";
		if (window.matchMedia("(width: 600px)").matches) {
			//set scrolllLeft=0 only when width=600px else it will scroll to 0 again and again
			weeklyTempChildBox.scrollLeft = 0;
		}
	} else {
		if (weeklyTempChildBox.scrollLeft === 0) {
			scrollLeft.style.display = "none";
		} else {
			scrollLeft.style.display = "block";
		}
	}
};
let handleScrollLeftWeeklyWeatherBox = () => {
	weeklyTempChildBox.scrollLeft -= 2 * 220;
};
let handleScrollRightWeeklyWeatherBox = () => {
	weeklyTempChildBox.scrollLeft += 2 * 220;
};
window.matchMedia("(max-width: 600px)").addEventListener("change", handleScrollWeeklyWeatherBox);
weeklyTempChildBox.addEventListener("scroll", handleScrollWeeklyWeatherBox);
scrollLeft.addEventListener("click", handleScrollLeftWeeklyWeatherBox);
scrollRight.addEventListener("click", handleScrollRightWeeklyWeatherBox);

// to get the details of weather and add the response to weather object (it is returned)
let getWeatherDetails = async (lat, lon) => {
	let weather = {};
	weather.unit = "metric";
	let response = await fetch(
		`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly&appid=${API_KEY}`
	);
	let data = await response.json();
	async function weatherDetails() {
		weather.lat = data.lat;
		weather.lon = data.lon;
		weather.date = data.current.dt;
		weather.timezone_offset = data.timezone_offset;
		weather.timezone = data.timezone;
		weather.temp = data.current.temp;
		weather.humidity = data.current.humidity;
		weather.uvi = data.current.uvi;
		weather.windSpeed = data.current.wind_speed;
		weather.windDeg = data.current.wind_deg;
		weather.rain = data.daily[0].pop;
		weather.icon = data.current.weather[0].icon;
		weather.fullDescription = data.current.weather[0].description; //TODO:show in info box
		weather.weeklyWeather = [{}, {}, {}, {}, {}, {}, {}, {}];
		for (let i = 0; i < 8; i++) {
			weather.weeklyWeather[i].dt = data.daily[i].dt;
			weather.weeklyWeather[i].temp = data.daily[i].temp.day;
			weather.weeklyWeather[i].weather = data.daily[i].weather[0];
			weather.weeklyWeather[i].uvi = data.daily[i].uvi;
			weather.weeklyWeather[i].icon = data.daily[i].weather[0].icon;
		}
		return weather;
	}
	return await weatherDetails();
};

// set the UVI as well if UVI current is zero then set the max UVI, also mention in the heading of AQI current or max in small text
let setCurrentWeatherData = (weather) => {
	// to set current weather icon
	setWeatherIcon(weatherIcon, weather.icon);
	currentTemp.innerHTML = weather.temp.toFixed();
	unitType.innerHTML = metric ? "° C" : "° F";
	let ddt = getDDT(weather.date);
	date.innerHTML = ddt.date;
	day.innerHTML = ddt.day;
	time.innerHTML = ddt.time;
	wind.innerHTML =
		parseFloat((weather.windSpeed * (metric ? units.metric.mpsToKmph : units.imperial.mpsToMph)).toFixed(1)) +
		(metric ? " km/h" : " mph");
	// weather.windDeg gives data in meteorological direction which is different from mathematical direction
	if (weather.windSpeed !== 0) {
		let windDegInMathDir = 270 - weather.windDeg;
		windDirection.src = windSvg;
		windDirection.style.transform = `rotate(${windDegInMathDir}deg)`;
	} else {
		windDirection.src = windDefaultSvg;
		windDirection.style.transform = `rotate(0deg)`;
	}
	humidity.innerHTML = weather.humidity + " %";
	if (weather.rain) {
		rain.innerHTML = weather.rain + " %";
	} else {
		rainParent.style.display = "none";
		humidityRainDivider.style.display = "none";
	}
	// setting uvi
	let uvi = weather.uvi;
	if (uvi === 0) {
		uvi = weather.weeklyWeather[0].uvi;
	}

	uvi = Math.round(uvi);
	let uviDesc = "";
	switch (uvi) {
		case 0:
		case 1:
		case 2:
			uviDesc = "Low";
			break;
		case 3:
		case 4:
		case 5:
			uviDesc = "Moderate";
			break;
		case 6:
		case 7:
			uviDesc = "High";
			break;
		case 8:
		case 9:
		case 10:
			uviDesc = "Very High";
			break;
		default:
			uviDesc = "Extreme";
			break;
	}
	uvIndex.innerHTML = uvi + "/15";
	uvIndexDesc.innerHTML = uviDesc;
	uvIndexIndicatorBox.style.transform = `rotate(${(uvi / 15) * 180 - 90}deg)`;
};

// to change the UNIX, UTC date format
let getDDT = (date) => {
	let ddt = { date, day, time };
	const dtFormat = new Intl.DateTimeFormat("en-GB", {
		day: "numeric",
		month: "short",
		year: "2-digit",
		weekday: "long",
		hourCycle: "h24",
		hour: "2-digit",
		minute: "2-digit",
		hour12: "false",
	});
	let formattedDdt = dtFormat.format(new Date(date * 1e3)).split(", ");
	let formattedDate = formattedDdt[1].split(" ");
	ddt.date = formattedDate[0];
	switch (parseInt(formattedDate[0])) {
		case 1:
		case 21:
		case 31:
			ddt.date = ddt.date + "st ";
			break;
		case 2:
		case 22:
			ddt.date = ddt.date + "nd ";
			break;
		case 3:
		case 23:
			ddt.date = ddt.date + "rd ";
			break;
		default:
			ddt.date = ddt.date + "th ";
			break;
	}
	ddt.date = ddt.date + formattedDate[1] + " '" + formattedDate[2];
	ddt.day = formattedDdt[0];
	ddt.time = formattedDdt[2].substring(0, 2) == "00" ? "12" + formattedDdt[2].substring(2) : formattedDdt[2];
	return ddt;
};

// weekly data
let setWeeklyWeatherData = (weeklyWeather) => {
	for (let i = 0; i < weeklyTempCard.length; i++) {
		weeklyTempCard[i].children[0].children[0].innerHTML = weeklyWeather[i].temp.toFixed() + (metric ? " °C" : " °F");
		// set icons for each card
		setWeatherIcon(weeklyTempCard[i].children[1], weeklyWeather[i].icon);
		let weekDay = getDDT(weeklyWeather[i].dt);
		weeklyTempCard[i].children[2].children[0].innerHTML = weekDay.day.substring(0, 3);
	}
};

// using npm package sun calc to get the sun hours
let setTime = (date, latitude, longitude) => {
	let formattedHour = (hour) => {
		if (hour === 0) return 12;
		if (hour > 12) return hour % 12;
		return hour;
	};
	let setRotation = (element, rotationRatio) => {
		element.style.setProperty("--rotation-clock-hands", rotationRatio * 360);
	};
	let setClock = (seconds, minutes, hours, secondsHand, minutesHand, hoursHand) => {
		let secondsRatio = seconds / 60;
		let minutesRatio = (secondsRatio + minutes) / 60;
		let hoursRatio = (minutesRatio + hours) / 12;
		setRotation(secondsHand, secondsRatio);
		setRotation(minutesHand, minutesRatio);
		setRotation(hoursHand, hoursRatio);
	};
	function randomNumber(min, max) {
		return Math.floor(Math.random() * (max - min) + min);
	}
	let times = SunCalc.getTimes(new Date(date * 1e3), latitude, longitude);
	let sunriseStr = formattedHour(times.sunrise.getHours()) + ":" + times.sunrise.getMinutes();
	let sunriseEndStr = formattedHour(times.sunriseEnd.getHours()) + ":" + times.sunriseEnd.getMinutes();
	let goldenHourMorningStr = formattedHour(times.goldenHourEnd.getHours()) + ":" + times.goldenHourEnd.getMinutes() + " AM";
	let goldenHourEveningStr = formattedHour(times.goldenHour.getHours()) + ":" + times.goldenHour.getMinutes() + " PM";
	let sunsetStartStr = formattedHour(times.sunsetStart.getHours()) + ":" + times.sunsetStart.getMinutes();
	let sunsetStr = formattedHour(times.sunset.getHours()) + ":" + times.sunset.getMinutes();
	setClock(
		randomNumber(0, 60),
		times.sunrise.getMinutes(),
		formattedHour(times.sunrise.getHours()),
		sunriseSeconds,
		sunriseMinutes,
		sunriseHours
	);
	// TODO : if current time is AM set for AM else set for PM
	setClock(
		randomNumber(0, 60),
		times.goldenHourEnd.getMinutes(),
		formattedHour(times.goldenHourEnd.getHours()),
		goldenHourSeconds,
		goldenHourMinutes,
		goldenHourHours
	);
	setClock(
		randomNumber(0, 60),
		formattedHour(times.sunsetStart.getMinutes()),
		formattedHour(times.sunsetStart.getHours()),
		sunsetSeconds,
		sunsetMinutes,
		sunsetHours
	);

	sunrise.innerHTML = sunriseStr;
	sunriseEnd.innerHTML = sunriseEndStr;
	goldenHourMorning.innerHTML = goldenHourMorningStr;
	goldenHourEvening.innerHTML = goldenHourEveningStr;
	sunsetStart.innerHTML = sunsetStartStr;
	sunset.innerHTML = sunsetStr;
};

let setSunHourData = () => {};

// to set and get air quality index
// get AQI
let getAirPollutionData = async (lat, lon) => {
	let response = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
	let data = await response.json();
	return data ? await data.list[0].main.aqi : -1;
};
// set AQI
let setAirPollutionData = (aqi) => {
	if (aqi !== -1) {
		airQuality.innerHTML = aqi + "/5";
		let airQualityDescription = "";
		switch (aqi) {
			case 5:
				airQualityDescription = "Very Poor";
				break;
			case 4:
				airQualityDescription = "Poor";
				break;
			case 3:
				airQualityDescription = "Moderate";
				break;
			case 2:
				airQualityDescription = "Fair";
				break;
			case 1:
				airQualityDescription = "Good";
				break;
			default:
				break;
		}
		airQualityDesc.innerHTML = airQualityDescription;
		airQualityIndicatorBox.style.transform = `rotate(${(aqi / 5) * 180 - 90}deg)`;
	} else {
		// TODO: show error
		hideLoading();
		console.log("Unable to fetch air quality for provided loaction");
	}
};

// loading functions-hide and show
// functions to show loading
let hideLoading = () => {
	loadingBox.style.display = "none";
	searchParentBox.style.position = "relative";
	searchParentBox.style.filter = "none";
};
// functions to show loading
let showLoading = () => {
	loadingBox.style.display = "flex";
	searchParentBox.style.position = "absolute";
	searchParentBox.style.filter = "blur(8px)";
};

// handle location search
// when we have to open the search bar
let handleOpenSearchBar = () => {
	locationInput.style.display = "block";
	searchBar.style.width = "100%";
	searchBar.style.justifyContent = "space-between";
	searchBar.children[1].style.marginRight = "14px";
	searchBar.classList.add("search-bar-animate");
};
// when we have ti close the search bar
let handleCloseSearchBar = () => {
	locationInput.value = "";
	locationInput.style.display = "none";
	searchBar.style.width = "45px";
	searchBar.style.justifyContent = "center";
	searchBar.children[1].style.marginRight = "0px";
	searchBar.classList.remove("search-bar-animate");
};
searchBar.addEventListener("click", handleOpenSearchBar);
document.addEventListener("mouseup", (event) => {
	// check for parent of search bar so that when user selects the text and mistakenly clicks just outside search bar, then the serach bar does not get hidden
	if (!searchBar.parentElement.contains(event.target)) {
		handleCloseSearchBar();
	}
});
// to get and set the data of searched location
let handleLocationSearch = async (inputLocation) => {
	if (inputLocation) {
		showLoading();
		// to get location lat and lon from inputLocation
		let response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${inputLocation}&appid=${API_KEY}`);
		let data = await response.json();
		// to avoid same requests compare the lat long of previous location
		if (data.length !== 0) {
			if (previousLocationGeo.latitude !== data[0].lat && previousLocationGeo.longitude !== data[0].lon) {
				previousLocationGeo = {
					latitude: data[0].lat,
					longitude: data[0].lon,
				};
				let country = regionNamesInEnglish.of(data[0].country);
				let place = data[0].name;
				displayLocation.innerHTML = place + ", " + country;
				previousLocation = place + ", " + country;
				if (previousLocation.length < 15) {
					displayLocation.style.cssText = "font-size: 1.4em";
				}
				setLocationData(data[0].lat, data[0].lon);
				handleCloseSearchBar();
			} else {
				// TODO: show error
				handleCloseSearchBar();
				hideLoading();
				console.log("Results already updated!");
			}
		} else {
			hideLoading();
			// TODO: show error
			console.log("Unable to fetch the data for specified location");
		}
	} else {
		// TODO: show error
		console.log("Empty input field!");
	}
};
locationInput.addEventListener("keyup", (event) => {
	if (event.key === "Enter") {
		handleLocationSearch(event.target.value.trim());
	}
});
searchBar.children[1].addEventListener("click", () => {
	handleLocationSearch(locationInput.value.trim());
});

// to get the location from navigation.geolocation or if not allowed show the details of default city
// set the data of the page according to the postion.coords
let setLocationData = async (latitude, longitude) => {
	let aqiData = await getAirPollutionData(latitude, longitude);
	let weatherData = await getWeatherDetails(latitude, longitude);
	setCurrentWeatherData(weatherData);
	setWeeklyWeatherData(weatherData.weeklyWeather);
	setAirPollutionData(parseInt(aqiData));
	setTime(weatherData.date, latitude, longitude);
	// hide the loading icon when data is retrieved
	if (weatherData) {
		// let aqi data load afterwards for better user experience
		hideLoading();
	}
};
// get the location of user
let locationSuccess = async (position) => {
	previousLocationGeo = {
		latitude: position.coords.latitude,
		longitude: position.coords.longitude,
	};
	// reverse Geocoding to get the state and country from lat and long
	let response = await fetch(
		`https://api.openweathermap.org/geo/1.0/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${API_KEY}`
	);
	let data = await response.json();
	if (data.length !== 0) {
		setLocationData(position.coords.latitude, position.coords.longitude);
		let country = regionNamesInEnglish.of(data[0].country);
		let place = data[0].name;
		displayLocation.innerHTML = place + ", " + country;
		previousLocation = place + ", " + country;
		if (previousLocation.length < 15) {
			displayLocation.style.cssText = "font-size: 1.4em";
		}
	} else {
		throw "Can not fetch data for your current location!";
	}
};
let locationError = () => {
	// TODO: Show error- Unable to get location
	console.log("Unable to get current location of user!");
	// set latitude and longitude as of Delhi, India
	setLocationData(28.7, 77.1);
};

// program begin here
if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
} else {
	// if navigator.geolocaction is not supported by the browser then set latitude and longitude as of Delhi
	setLocationData(28.7, 77.1);
}

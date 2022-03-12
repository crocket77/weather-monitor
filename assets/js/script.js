//DECLARATIONS
// search city button 
const searchBtn = document.getElementById('search-city');
//city drop down select
const selectEl = document.getElementById('cities');
// input element 
const inputEl = document.getElementById('city');
// current city
const currCity = document.getElementById('current-city');
// temperature
let tempEl = document.getElementById('temp');
// uv index
let uvIndexEl = document.getElementById('uv-index')
// wind
let windEl = document.getElementById('wind');
// humidity
let humidityEl = document.getElementById('humidity');



const apiKey="3808b300a4b2bbad8195b631560eeb71";
// forecast container
const forecastEl = document.getElementById('forecast-container');

let citiesArr = [];


//FUNCTIONS
//Displays current date
function todaysDate() {

    // reference current date element
    let currentDay = document.getElementById('todaysDate');
    // get current date
    let newDate = "Todays Date: "+ moment().format('dddd, MMMM Do, YYYY');
    // display it
    currentDay.textContent = newDate;
 
 }

 
// get user city searched and push into city array
function monitorCity(event) {

    // prevent refresh of page after button click
    event.preventDefault();
 
    // get value for searched cities and trim excess spaces
    // cannot use textContent with input element
    let citySearch = inputEl.value.trim();
    
 
    // send city searched to latLon();
    latLon(citySearch.toLowerCase());
 
    // if no city is entered 
    if (citySearch === null || citySearch === '') {
       alert('Please Enter A City');
    }
    // if the city searched is not in the array pushes
    else if (!citiesArr.includes(citySearch.toLowerCase())) {
       citiesArr.push(citySearch.toLowerCase());
       setSearched();
       console.log(citiesArr)
    }

 
    // clear input value
    inputEl.value = '';
 
    // button out of focus
    event.target.blur();
 };
 

 
// convert city searched into lat long with api
function latLon(city) {
   //capitalize first letter for display
    let cityDisplay=city.split("");
    cityDisplay[0]=cityDisplay[0].toUpperCase()
    cityDisplay=cityDisplay.join("")
   //display searched city
    currCity.textContent = cityDisplay;
 
    // fetch information for city
    let apiUrl = 'http://api.openweathermap.org/geo/1.0/direct?q='+ city + '&appid=' + apiKey;
    console.log(apiUrl)
    // fetch returns Promise, since it's a slower function, it will run asynchronously 
    fetch(apiUrl)
    .then(function(response) {
 
       // when the HTTP request status code is something in the 200s, the ok proprty will be true
       if (response.ok) {
         
          // format response object into json
          // json() method returns another promise, so need another then() the resolve the Promise
          // the callback function displays the data
          response.json().then(function(data) {
 
            
             
             // send data of lat lon of city to getWeather()
             getWeather(data);
                // display city searched 
                
                
 
          });
       }
       // if the ok property is false, do this
       else {
          alert("Error: City Not Found");
       }
    })
    // api's way of handling network errors
    .catch(function(error) {
       // Notice this `.catch()` getting chained onto the end of the `.then()` method
       alert("Unable to connect to OpenWeatherMap");
    });
 };


 // get current uv index and current weather for city searched with api using lat lon
function getWeather(cityData) {
    // save city lat
    let latitude = cityData[0].lat;
    // save city lon
    let longitude = cityData[0].lon;
 
    var apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&units=imperial&appid=' + apiKey;
 
    fetch(apiUrl)
    .then(function(response) {
 
       if (response.ok) {
 
          response.json().then(function(data) {
            console.log(data)
             // send current weather data to currWeather()
             currWeather(data.current);
 
             // send forecast weather to forecast()
             forecast(data.daily);

             
            
          });
       }
       else {
          alert("Error: City Lat and Lon Not Found");
       }
    })
    // api's way of handling network errors
    .catch(function(error) {
       // Notice this `.catch()` getting chained onto the end of the `.then()` method
       alert("Unable to connect to OpenWeatherMap");
    });
 };

 // display current weather information
function currWeather(cityWeather) {


    tempEl.textContent = Math.round(cityWeather.temp) + '°F';
 

    // clear uv index classList
    uvIndexEl.classList = '';
    // add styling classes
    uvIndexEl.classList = 'px-2 rounded';
    uvIndexEl.textContent = cityWeather.uvi;
    // index conditions
    if (cityWeather.uvi< 3) {
       uvIndexEl.classList.add('uv-low');
    }
    else if (cityWeather.uvi>=3 && cityWeather.uvi< 8) {
       uvIndexEl.classList.add('uv-moderate');
    }
    else if (cityWeather.uvi>=8) {
       uvIndexEl.classList.add('uv-extreme');
    }
 
    windEl.textContent = cityWeather.wind_speed + ' mph';
    humidityEl.textContent = cityWeather.humidity + '%';
 };

 // get the searchCities and save them to local storage
function setSearched() {

   // save citiesArr array to local storage
   localStorage.setItem('Cities', JSON.stringify(citiesArr));

};

// load saved cities from local storage
function loadCities() {

   // load saved cities
   let savedCities = localStorage.getItem('Cities');
   // turn savedCities into array 
   savedCities = JSON.parse(savedCities);

   // if there are no cities saved, do nothing
   if (savedCities === null) {
      return;
   }
   // else if there are cities saved, add them to the citiesArr array
   else {
      citiesArr = savedCities;
   }
}

// get value from dropdown
function selectFormHandler() {

   // save city selected by user
   let selectedCity = selectEl.options[selectEl.selectedIndex].value;

   // send city to latLon()
   latLon(selectedCity);
   
   // reset selected city
   selectEl.selectedIndex = 0;

}

// loop through citiesArr and add generate options for select dropdown
function dropCities() {
    
   for(let i = 0; i < citiesArr.length; i++) {

      // create the option element
      let dropEl = document.createElement('option');

      // let the value of the option equal the array element
      dropEl.value = citiesArr[i].toLowerCase();
      // let the text of the option equal the array element
      
      //capitalize first letter for display
      let citiesUpper=citiesArr[i].split("");
      citiesUpper[0]=citiesUpper[0].toUpperCase()
      citiesUpper=citiesUpper.join("")

      dropEl.textContent = citiesUpper;

      // append option element to selectEl
      selectEl.append(dropEl); 
   }
};



// display forecast information
function forecast(cityForecast) {

   // clear reference container
   forecastEl.innerHTML = '';
   forecastEl.classList.remove("hide")

   // cityForecast comes in as an array of objects 
   // forecast for 5 days includes indexes 1-5
   for (i = 1; i < 6; i++) {

      // create element for each day
      let dayEl = document.createElement('card');
      dayEl.classList = 'days w-100';

      // create date title
      let dateEl = document.createElement('h3');
      dateEl.classList = 'p-0';
      // get dt unix timestamp
      let dtDate = cityForecast[i].dt;
      // convert timestamp to date
      let dayDate = moment.unix(dtDate).format('MMMM DD, Y');
      // display it
      dateEl.textContent = dayDate;

      // create day title 
      let weekDayEl = document.createElement('h3');

      // convert timestamp to date
      let weekDayDate = moment.unix(dtDate).format('dddd');
      // display it
      weekDayEl.textContent = weekDayDate;

      // create icon container
      let iconContainer = document.createElement('div');
      iconContainer.classList = 'img-container';
      // create icon 
      let dayIcon = document.createElement('img');
      dayIcon.classList = 'icon'
      dayIcon.setAttribute('src','http://openweathermap.org/img/wn/' + cityForecast[i].weather[0].icon + '@2x.png');
      // append img to container
      iconContainer.append(dayIcon);

      // create min temp element
      let dateMinTemp = document.createElement('h3');
      dateMinTemp.classList = 'text-white';
      dateMinTemp.textContent = 'L: '  +  Math.round(cityForecast[i].temp.min) + ' °F';

      // create max temp element
      let dateMaxTemp = document.createElement('h3');
      dateMaxTemp.classList = 'text-white';
      dateMaxTemp.textContent = 'H: '  + Math.round(cityForecast[i].temp.max) + ' °F';

      // create wind temp element
      let dateWind = document.createElement('h3');
      dateWind.textContent = cityForecast[i].wind_speed + ' mph';

      // create humidity temp element
      let dateHumidity = document.createElement('h3');
      dateHumidity.classList = 'day-humidity';
      dateHumidity.textContent = 'Humidity: ' + cityForecast[i].humidity + '%';

      dayEl.append(dateEl, weekDayEl, iconContainer, dateMinTemp, dateMaxTemp, dateWind, dateHumidity);
      forecastEl.append(dayEl);
   }
};
 




//CALLS
searchBtn.addEventListener('click', monitorCity);
selectEl.addEventListener('change', selectFormHandler);
loadCities();
dropCities();
todaysDate();


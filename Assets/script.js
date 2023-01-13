var apiKey = "1f40db029d8aa5986ddf3ab9927c8d74";

var city;
var url = "https://api.openweathermap.org/data/2.5/weather"
var cityArr = [];

window.onload = function(){
    cityArr=JSON.parse(localStorage.getItem('cities'));
    if (cityArr !== null){
        cityArr.forEach(function(x,i){
            $('#history').prepend($(`<button class="btn btn-default citybtn" type="button">${x}</button>`));
        })
    } else {
        cityArr=[];
    }
}

function checkItem(citytxt){
    for (i=0; i < cityArr.length; i++) {
        if (cityArr[i].toLowerCase()=== citytxt.toLowerCase()) {
            return true;
        }
    }
    return false
}

$("#searchbtn").on("click", function(event) {
    event.preventDefault();
    var inputVal=$("#inputVal");
    city = inputVal.val().trim();
    
    var check = document.querySelector(".msg");
    if (city === "" || city === null) {
      check.innerHTML = "Please enter a valid input.";
    } else {
      check.innerHTML = "" ;
      if (cityArr.length>0 && checkItem(city) == false) {
        cityArr.push(city);
        $("#history").prepend($(`<button class="btn btn-default citybtn" type="button">${city}</button>`));
      }
      else if(cityArr.length == 0){
        cityArr.push(city);
        $("#history").prepend($(`<button class="btn btn-default citybtn" type="button">${city}</button>`));
      }
      
      localStorage.setItem("cities",JSON.stringify(cityArr));
      localStorage.getItem("cities");
    }
    currentData();
});

function currentData() {
  let geoURL = `http://api.openweathermap.org/geo/1.0/direct`;
    let lat,lon;
    $.ajax({
      url: geoURL,
      dataType: 'json',
      type: 'GET',
      data: {
        q: city,
        appid: apiKey,
        limit: 1
      },
      success: function(data) {
        lat = data[0].lat;
        lon = data[0].lon;
      }
    })
    $.ajax({
        url: url, //API Call
        dataType: "json",
        type: "GET",
        data: {
          q: city,
          appid: apiKey,
          units: "metric",
          lat: lat,
          lon: lon,
        },
        success: function(data) {
         
          $("#city").text(data.name + " " + moment(). format('YYYY-MM-DD'));
          $("#temp").text("Temperature  :  " + data.main.temp + "°");
          $("#humidity").text("Humidity  :  " + data.main.humidity + "%");
          $("#wind").text("Wind  :  " + data.wind.speed + " mph");
          $("#icon").attr('src', "http://openweathermap.org/img/wn/" + data.weather[0].icon + ".png");
         
          let dayNum=1;
          for (let i = 0; i < 5; i++) {
              let dayEL = document.querySelector("#day-"+dayNum);
              
              if (document.querySelector("#day-"+dayNum)){
                dayEL.innerHTML="";
              } else{
                break;
              }
              dayNum = dayNum+1;
            }
          fivedayData(data.name,data.lat,data.lon);
        }

      })

}

function fivedayData(city,lat,lon) {
  const fiveDayURL = `https://api.openweathermap.org/data/2.5/forecast`;
  let index = 3;
  let dayNum=1;
    $.ajax({
        url: fiveDayURL,
        dataType: "json",
        method: "GET",
        data: {
          q: city,
          appid: apiKey,
          units: "metric",
          lat: lat,
          lon: lon,
        },
        success: function(response){
          for (let i = 4; i < response.list.length; i += 8) {
              const iconResponse = response.list[i].weather[0].icon;
              const shortDate = response.list[i].dt_txt.substr(0, response.list[i].dt_txt.indexOf(' '));
              let day = $("<h5>");
              day.text(shortDate);
              let temp = $("<h6>");
              temp.addClass("card-subtitle mb-2");
              temp.text("Temperature:  "+response.list[i].main.temp + "°");
              let wind = $("<h6>");
              wind.text("Wind:  "+response.list[i].wind.speed + " mph");
              let humidity = $("<h6>");
              humidity.text("Humidity:  "+response.list[i].main.humidity + "%");
              let icon = $("<img>");
              icon.attr('src', "http://openweathermap.org/img/wn/" + iconResponse + ".png");
              let newLine = $("<br>");
              index = index + 8;
              day.append(newLine);
              day.append(icon);
              day.append(temp);
              day.append(wind);
              day.append(humidity);
              $("#day-"+dayNum).append(day);
              dayNum=dayNum+1;
          }
            
        }
      })
        
}

$(document).on("click", ".citybtn", function () {
  
  city = $(this).text();
  currentData();

});

var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

let dataList = document.getElementById("miestai");
let xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        let miestas = JSON.parse(xhr.responseText);
        for (let i = 0; i < miestas.length; i++) {
            let option = document.createElement("option");
            option.value = miestas[i].name;
            dataList.appendChild(option);
        }
    }
}


xhr.open("GET", "https://api.meteo.lt/v1/places");
xhr.send();

const btn = document.querySelector('.btn');
const conditions = document.querySelector('.weather');
btn.addEventListener('click',getWeather)


function getWeather() {
    conditions.innerHTML = "";
    let xhr1 = new XMLHttpRequest();
    xhr1.onreadystatechange = function() {
        if (xhr1.readyState === 4 && xhr1.status === 200) {
            let weather = JSON.parse(xhr1.responseText);
            let tempsum = 0;
            let tempamount = 0;
            let header1 = document.createElement('h2');
            let textH1 = document.createTextNode(miestas.value + " " +date + " " + "Prognoze:")
            header1.appendChild(textH1);
            conditions.appendChild(header1);
            for (let i = 0; i < weather.forecastTimestamps.length; i++) {
                if (date === weather.forecastTimestamps[i].forecastTimeUtc.slice(0,10)) {
                    let para = document.createElement('p');
                    let textP = document.createTextNode(weather.forecastTimestamps[i].forecastTimeUtc.slice(10,30) + " " + ":" + " " + weather.forecastTimestamps[i].airTemperature + " " + '\u00B0C' + " " + translate(weather.forecastTimestamps[i].conditionCode));
                    para.appendChild(textP);
                    conditions.appendChild(para);
                    tempsum = tempsum + weather.forecastTimestamps[i].airTemperature;
                    tempamount = tempamount + 1;
                }
            }
        }
    }

    xhr1.open("GET", "https://api.meteo.lt/v1/places/"+kurismiestas()+"/forecasts/long-term");
    xhr1.send();
}

function translate(name) {
    if (name === "clear") {name = "saule"}
    else if (name === "isolated-clouds") {name = "debesuota"}
    else if (name === "scattered-clouds") {name = "debesuota"}
    else if (name === "overcast") {name = "debesuota"}
    else if (name === "light-rain") {name = "lietus"}
    else if (name === "moderate-rain") {name = "lietus"}
    else if (name === "heavy-rain") {name = "lietus"}
    else if (name === "sleet") {name = "lietus"}
    else if (name === "na") {name = "oro salygos nenustatytos."}
    else {name = "Neatpazinta."}
    return name;
}

function kurismiestas() {
    let which = "";
    let townnames = JSON.parse(xhr.responseText);

    for (let i = 0; i < townnames.length; i++) {
        if (townnames[i].name === miestas.value) {
            which = townnames[i].code;
        }
    }
    return which;

}
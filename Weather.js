//Variables
const main = document.querySelector('main');
const time = document.querySelector('#time');
const cityName = document.querySelector('#city-name');
const date = document.querySelector('#date');
const temperature = document.querySelector('#temperature');
const description = document.querySelector('#description');
const windDirection = document.querySelector('#wind-direction');
const windSpeed = document.querySelector('#wind-speed');
const pressure= document.querySelector('#pressure');
const humidity= document.querySelector('#humidity');
const forecast = document.querySelector('#forecast');
//Storage;
let dateTimeArr = [];
let locationArr = [];
// Search Form
const search = document.querySelector('#search');
search.addEventListener('submit',function(e) {
    e.preventDefault();
    window.clearInterval()
    let cityAndCountry = search.elements.city;
    let countryCode = '';
    // Format City and Country Input to Match API 
    if(cityAndCountry.value.includes(',')) {
        [city,country] = cityAndCountry.value.split(',');
        city = city.trim();
        if(city.includes("-")) {
            while(city.includes("-")) {
                city = city.replace("-"," ");
            }
        }
        country = country.trim();
        if(country.includes(" ")) {
            let countryArr = country.split(' ');
            country = countryArr.map(x=>{
                return x[0].toUpperCase() + x.toLowerCase().slice(1,x.length)
            }).join(' ');
        }
        else{
            country = country[0].toUpperCase() + country.toLowerCase().slice(1,country.length);
        }
        for(let i in codes) {
            if(codes[i] == country) {
                countryCode = i;
            }
        }
    }
    //Format City to Match API
    else{
        city = cityAndCountry.value;
        city = city.trim();
        if(city.includes("-")) {
            while(city.includes("-")) {
                city = city.replace("-"," ");
            }
        }
    }
    // Weather Promise
    functions.getWeather(city,countryCode)
    // Display main weather window
    .then(res=>{
        if(main.style.display === '') {
            main.style.display = 'flex';
        }
        return res
    })
    // Set weather data 
    .then(res=>{
        cityName.innerText = `${res.data.name},${codes[res.data.sys.country]}`;
        temperature.innerText = `${Math.round(res.data.main.temp-273)}°C`;
        description.innerText = `${res.data.weather[0].description[0].toUpperCase()}${res.data.weather[0].description.slice(1,res.data.weather[0].description.length)}`;
        windDirection.innerText = `Wind Direction: ${functions.windDirection(res.data.wind.deg)}`;
        windSpeed.innerText = `Wind Speed:${res.data.wind.speed}m/s`;
        pressure.innerText = `Pressure:${res.data.main.pressure}hPA`;
        humidity.innerText = `Humidity:${res.data.main.humidity}%`;
        return res
    })
    // Set time/date data
    .then(res=>{
        console.log(res.data)
        locationArr=[res.data.name,res.data.sys.country];
        functions.getTime(res.data.name,res.data.sys.country)
        .then(res=>{
            dateTimeArr = res.data.datetime.split(" ");
            dateTimeArr[0] = dateTimeArr[0].split("-");
            dateTimeArr[1] = dateTimeArr[1].split(":");
            dateTimeArr = dateTimeArr[0].concat(dateTimeArr[1]);
            let newArr = [];
            dateTimeArr.forEach(x=>{
                newArr.push(parseInt(x))
            })
            dateTimeArr = newArr;
            functions.displayTime();
        })
    })
    .catch(err=>{
        console.log(err);
    })
    // Reset form input
    cityAndCountry.value = '';
})
// Functions
const functions = {
    // Open Weather API async call
    async getWeather(cityVal,countryVal) {
        return await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityVal},${countryVal}&APPID=d4a9bdcf926df60c453efe8bd2492aa1`)
    },
    // Abstaract API async call
    async getTime(cityVal,countryVal){
        return await axios.get(`https://timezone.abstractapi.com/v1/current_time?api_key=6a110204179e467188dfd0a4869ce6f2&location=${cityVal},${countryVal}`)
    },
    // Time and Date logic for Animated Clock
    displayTime(){
        dateTimeArr[5]++;
        if(dateTimeArr[3]>23) {
            dateTimeArr[2]+=1;
            dateTimeArr[3]=0;
        }
        else if(dateTimeArr[4]>59) {
            dateTimeArr[3]+=1;
            dateTimeArr[4]=0;
        }
        else if(dateTimeArr[5]>59) {
            dateTimeArr[4]+=1;
            dateTimeArr[5]=0;
        }
        month = (dateTimeArr[1]<10)? "0" + dateTimeArr[1]:dateTimeArr[1];
        day = (dateTimeArr[2]<10)? "0" + dateTimeArr[2]:dateTimeArr[2];
        hour = (dateTimeArr[3]<10)? "0" + dateTimeArr[3]:dateTimeArr[3];
        minute = (dateTimeArr[4]<10)? "0" + dateTimeArr[4]:dateTimeArr[4];
        second = (dateTimeArr[5]<10)? "0" + dateTimeArr[5]:dateTimeArr[5];
        date.innerText = dateTimeArr[0] + "." + month + "." + day ;
        time.innerText = hour + ":" + minute + ":" + second ;
        let id = setTimeout(functions.displayTime,1000);
        // Clear running timeouts
        search.addEventListener('submit',function(e) {
            e.preventDefault()
            window.clearTimeout(id)
        })
    },
    // Wind Direction from Angle
    windDirection(deg) {
        const directions = "N ↑,N-E ↗,E →,S-E ↘,S ↓,S-W ↙,W ←,N-W ↖".split(",");
        if(22.5 < deg && deg <= 67.5) {
            return directions[1]
        }
        else if(67,5 < deg && deg<= 112.5) {
            return directions[2];
        }
        else if(112.5 < deg && deg <= 157.5) {
            return directions[3];
        }
        else if(157.5 < deg && deg <= 202.5) {
            return directions[4];
        }
        else if(202.5 < deg && deg <= 247.5) {
            return directions[5];
        }
        else if(247.5 < deg && deg <= 292.5) {
            return directions[6];
        }
        else if(292.5 < deg && deg <= 337.5) {
            return directions[7];
        }
        else{
            return directions[0];
        }     
    }
}
// Countries and Codes
const codes = {
    "AF": "Afghanistan",
    "AX": "Aland Islands",
    "AL": "Albania",
    "DZ": "Algeria",
    "AS": "American Samoa",
    "AD": "Andorra",
    "AO": "Angola",
    "AI": "Anguilla",
    "AQ": "Antarctica",
    "AG": "Antigua And Barbuda",
    "AR": "Argentina",
    "AM": "Armenia",
    "AW": "Aruba",
    "AU": "Australia",
    "AT": "Austria",
    "AZ": "Azerbaijan",
    "BS": "Bahamas",
    "BH": "Bahrain",
    "BD": "Bangladesh",
    "BB": "Barbados",
    "BY": "Belarus",
    "BE": "Belgium",
    "BZ": "Belize",
    "BJ": "Benin",
    "BM": "Bermuda",
    "BT": "Bhutan",
    "BO": "Bolivia",
    "BA": "Bosnia And Herzegovina",
    "BW": "Botswana",
    "BV": "Bouvet Island",
    "BR": "Brazil",
    "IO": "British Indian Ocean Territory",
    "BN": "Brunei Darussalam",
    "BG": "Bulgaria",
    "BF": "Burkina Faso",
    "BI": "Burundi",
    "KH": "Cambodia",
    "CM": "Cameroon",
    "CA": "Canada",
    "CV": "Cape Verde",
    "KY": "Cayman Islands",
    "CF": "Central African Republic",
    "TD": "Chad",
    "CL": "Chile",
    "CN": "China",
    "CX": "Christmas Island",
    "CC": "Cocos (Keeling) Islands",
    "CO": "Colombia",
    "KM": "Comoros",
    "CG": "Congo",
    "CD": "Congo, Democratic Republic",
    "CK": "Cook Islands",
    "CR": "Costa Rica",
    "CI": "Cote D'Ivoire",
    "HR": "Croatia",
    "CU": "Cuba",
    "CY": "Cyprus",
    "CZ": "Czech Republic",
    "DK": "Denmark",
    "DJ": "Djibouti",
    "DM": "Dominica",
    "DO": "Dominican Republic",
    "EC": "Ecuador",
    "EG": "Egypt",
    "SV": "El Salvador",
    "GQ": "Equatorial Guinea",
    "ER": "Eritrea",
    "EE": "Estonia",
    "ET": "Ethiopia",
    "FK": "Falkland Islands (Malvinas)",
    "FO": "Faroe Islands",
    "FJ": "Fiji",
    "FI": "Finland",
    "FR": "France",
    "GF": "French Guiana",
    "PF": "French Polynesia",
    "TF": "French Southern Territories",
    "GA": "Gabon",
    "GM": "Gambia",
    "GE": "Georgia",
    "DE": "Germany",
    "GH": "Ghana",
    "GI": "Gibraltar",
    "GR": "Greece",
    "GL": "Greenland",
    "GD": "Grenada",
    "GP": "Guadeloupe",
    "GU": "Guam",
    "GT": "Guatemala",
    "GG": "Guernsey",
    "GN": "Guinea",
    "GW": "Guinea-Bissau",
    "GY": "Guyana",
    "HT": "Haiti",
    "HM": "Heard Island & Mcdonald Islands",
    "VA": "Holy See (Vatican City State)",
    "HN": "Honduras",
    "HK": "Hong Kong",
    "HU": "Hungary",
    "IS": "Iceland",
    "IN": "India",
    "ID": "Indonesia",
    "IR": "Iran, Islamic Republic Of",
    "IQ": "Iraq",
    "IE": "Ireland",
    "IM": "Isle Of Man",
    "IL": "Israel",
    "IT": "Italy",
    "JM": "Jamaica",
    "JP": "Japan",
    "JE": "Jersey",
    "JO": "Jordan",
    "KZ": "Kazakhstan",
    "KE": "Kenya",
    "KI": "Kiribati",
    "KR": "Korea",
    "KW": "Kuwait",
    "KG": "Kyrgyzstan",
    "LA": "Lao People's Democratic Republic",
    "LV": "Latvia",
    "LB": "Lebanon",
    "LS": "Lesotho",
    "LR": "Liberia",
    "LY": "Libyan Arab Jamahiriya",
    "LI": "Liechtenstein",
    "LT": "Lithuania",
    "LU": "Luxembourg",
    "MO": "Macao",
    "MK": "Macedonia",
    "MG": "Madagascar",
    "MW": "Malawi",
    "MY": "Malaysia",
    "MV": "Maldives",
    "ML": "Mali",
    "MT": "Malta",
    "MH": "Marshall Islands",
    "MQ": "Martinique",
    "MR": "Mauritania",
    "MU": "Mauritius",
    "YT": "Mayotte",
    "MX": "Mexico",
    "FM": "Micronesia, Federated States Of",
    "MD": "Moldova",
    "MC": "Monaco",
    "MN": "Mongolia",
    "ME": "Montenegro",
    "MS": "Montserrat",
    "MA": "Morocco",
    "MZ": "Mozambique",
    "MM": "Myanmar",
    "NA": "Namibia",
    "NR": "Nauru",
    "NP": "Nepal",
    "NL": "Netherlands",
    "AN": "Netherlands Antilles",
    "NC": "New Caledonia",
    "NZ": "New Zealand",
    "NI": "Nicaragua",
    "NE": "Niger",
    "NG": "Nigeria",
    "NU": "Niue",
    "NF": "Norfolk Island",
    "MP": "Northern Mariana Islands",
    "NO": "Norway",
    "OM": "Oman",
    "PK": "Pakistan",
    "PW": "Palau",
    "PS": "Palestinian Territory, Occupied",
    "PA": "Panama",
    "PG": "Papua New Guinea",
    "PY": "Paraguay",
    "PE": "Peru",
    "PH": "Philippines",
    "PN": "Pitcairn",
    "PL": "Poland",
    "PT": "Portugal",
    "PR": "Puerto Rico",
    "QA": "Qatar",
    "RE": "Reunion",
    "RO": "Romania",
    "RU": "Russian Federation",
    "RW": "Rwanda",
    "BL": "Saint Barthelemy",
    "SH": "Saint Helena",
    "KN": "Saint Kitts And Nevis",
    "LC": "Saint Lucia",
    "MF": "Saint Martin",
    "PM": "Saint Pierre And Miquelon",
    "VC": "Saint Vincent And Grenadines",
    "WS": "Samoa",
    "SM": "San Marino",
    "ST": "Sao Tome And Principe",
    "SA": "Saudi Arabia",
    "SN": "Senegal",
    "RS": "Serbia",
    "SC": "Seychelles",
    "SL": "Sierra Leone",
    "SG": "Singapore",
    "SK": "Slovakia",
    "SI": "Slovenia",
    "SB": "Solomon Islands",
    "SO": "Somalia",
    "ZA": "South Africa",
    "GS": "South Georgia And Sandwich Isl.",
    "ES": "Spain",
    "LK": "Sri Lanka",
    "SD": "Sudan",
    "SR": "Suriname",
    "SJ": "Svalbard And Jan Mayen",
    "SZ": "Swaziland",
    "SE": "Sweden",
    "CH": "Switzerland",
    "SY": "Syrian Arab Republic",
    "TW": "Taiwan",
    "TJ": "Tajikistan",
    "TZ": "Tanzania",
    "TH": "Thailand",
    "TL": "Timor-Leste",
    "TG": "Togo",
    "TK": "Tokelau",
    "TO": "Tonga",
    "TT": "Trinidad And Tobago",
    "TN": "Tunisia",
    "TR": "Turkey",
    "TM": "Turkmenistan",
    "TC": "Turks And Caicos Islands",
    "TV": "Tuvalu",
    "UG": "Uganda",
    "UA": "Ukraine",
    "AE": "United Arab Emirates",
    "GB": "United Kingdom",
    "US": "United States",
    "UM": "United States Outlying Islands",
    "UY": "Uruguay",
    "UZ": "Uzbekistan",
    "VU": "Vanuatu",
    "VE": "Venezuela",
    "VN": "Viet Nam",
    "VG": "Virgin Islands, British",
    "VI": "Virgin Islands, U.S.",
    "WF": "Wallis And Futuna",
    "EH": "Western Sahara",
    "YE": "Yemen",
    "ZM": "Zambia",
    "ZW": "Zimbabwe"
};
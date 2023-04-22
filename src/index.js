import './css/styles.css';

const DEBOUNCE_DELAY = 500;

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import Debounce from 'lodash.debounce';

const inputField = document.querySelector('#search-box');
inputField.addEventListener('input', Debounce(onSearch, DEBOUNCE_DELAY));

const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');


function onSearch(event) {
    const name = event.target.value.trim();
    // console.log(name);
    if (!name) return clearMark() ;

    getCountries(name)
        .then((data) => {createMark(data), console.log(data);  })
        .catch((err) => {
            if (err.message === "404") { Notify.failure('Oops, there is no country with that name') }
            else {console.dir(err)}
            
            clearMark()
        });
}


function createMark(arrey) {
   
    if (arrey.length > 10) {
        clearMark()
        return Notify.info("Too many matches found. Please enter a more specific name.");
    }
    if (arrey.length > 1) {
        clearMark()
        return countryList.innerHTML=createMarkList(arrey);
    }
    if (arrey.length === 1) {
        clearMark()
        return countryInfo.innerHTML=createMarkInfo(arrey);
    }
    
}

function createMarkList(countries) {
    return countries.map((element) => 
            `<li class="country-list-elem">
                <img width="40" height="30" src="${element.flags.svg}" alt="${element.name.official}">
                <p>${element.name.official}</p>
            </li>`
    ).join("")
}

function createMarkInfo(country) {
    return country.map((element) =>
    `<div><img width="60" height="45" src="${element.flags.svg}" alt="${element.name.official}">
    <h2>${element.name.official}</h2></div>
    <ul>
      <li class="country-list-elem"> <h3>Capital:</h3> ${element.capital}</li>
      <li class="country-list-elem"> <h3>Population:</h3> ${element.population.toLocaleString()}</li>
      <li class="country-list-elem"> <h3>Languages:</h3> ${Object.values(element.languages).join(',  ')}</li>
    </ul>`).join("")
}

function clearMark() {
    countryList.innerHTML = "";
    countryInfo.innerHTML = "";
}





function getCountries (name) {
    const BASE_URL = "https://restcountries.com/v3.1/";
    
    return fetch(`${BASE_URL}/name/${name}?fields=name,capital,population,flags,languages`)
        .then((resp) => {
            if (!resp.ok) {
                throw new Error(resp.status);
            }
            return resp.json();
        }
    )
    
}


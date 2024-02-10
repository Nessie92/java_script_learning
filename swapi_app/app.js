// The app allows the user to search for and read info from SWAPI. There are 2 ways the user can find the info.
// 1. filter the info by category using the labeled buttons on the left hand side of the screen.
// 2. search for a term in the search bar and set a filter.
// Once the user has begun a search the results are displayed in the centre of the screen in a list. 
// The user can click on an item in the list, or scroll through more results using the buttons NEXT and PREV. 
// Once and item has been clicked, the profile will display on the right of the screen


const API_ROOT_URL = "https://swapi.dev/api"

const categories = [
    'people',
    'planets',
    'films',
    'species',
    'vehicles',
    'starships'
]

let currentPage = 1



//The Category Buttons. I'm fairly happy with how this logic works 
//except for the running of the clearProfile function, which has a problem and doesn't work as I anticipated
categories.forEach(category => {
    const button = document.getElementById(`${category}BTN`)
    button.addEventListener('click', () => {    
    currentPage = 1 
    fetchDataAndRender(category, currentPage)
    clearProfile()
})
    
})
//this is the logic which fetches the data from the button clicks
function fetchDataAndRender(category, page) {
    const apiUrl = `${API_ROOT_URL}/${category}/?page=${page}`

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const resultList = document.querySelector('.result-list')
            resultList.innerHTML = ""
            
            let names
            //this was included because the object key for films is 'title' rather than 'name'
            if(category === 'films') {
                names = data.results.map(item => item.title)
            } else{
                names = data.results.map(item => item.name)
            }

            names.forEach((name, index) => {
                const listItem = document.createElement('li')
                listItem.textContent = name
                listItem.classList.add('result-item')
                resultList.appendChild(listItem)

                listItem.addEventListener('click', ()=> {
                    //I'm unhappy with the second argument as it's rather messy but I couldn't find a better 
                    //solution to retrieve this data
                    displayProfileDetails(category, data.results[index].url.split('/').filter(Boolean).pop())
                })

            })
            pageControls(category, data)
        })
        .catch(error => console.error('Error fetching data', error))
}

//The Seach bar. I would have liked to add the ability to search the whole API not just filter by categories but I didn't have time.
const searchInput = document.getElementById('search-input')
const searchFilter = document.getElementById('search-filter')
const searchButton = document.getElementById('search-button')

searchButton.addEventListener('click', ()=> {
    const searchTerm = searchInput.value.trim()
    const filterCat = searchFilter.value
    if(searchTerm !== ''){
        currentPage = 1
        fetchSearchResults(searchTerm, filterCat)
        clearProfile()
    }
})
//there is a lot of repeated code here from the fetchDataAndRender function, perhaps it could be improved and condensed
function fetchSearchResults(searchTerm, filterCat){
    const searchApiUrl = `${API_ROOT_URL}/${filterCat}/?search=${searchTerm}`
    fetch(searchApiUrl)
        .then(response => response.json())
        .then(data =>{
            const resultList = document.querySelector('.result-list')
            resultList.innerHTML = ''

            let names

            if(data.results.length > 0){
                if(data.results[0].hasOwnProperty('name')){
                    names = data.results.map(item => item.name)
                } else if(data.results[0].hasOwnProperty('title')){
                    names = data.results.map(item => item.title)
                }
            } else{
                names = ['No Results Found!']
            }

            names.forEach((name, index) => {
                const listItem = document.createElement('li');
                listItem.textContent = name;
                listItem.classList.add('result-item');
                resultList.appendChild(listItem);
                

                listItem.addEventListener('click', ()=> {
                    displayProfileDetails(filterCat, data.results[index].url.split('/').filter(Boolean).pop())
                })
                
            })
        })
        .catch(error => console.error('Error fetching results'))
        .finally(()=>{
            searchInput.value =''
        })
}

//buttons to allow the user to scroll through pages. A good feature but doesn't work for searches via the search bar
function pageControls(category, data) {
    const paginationContainer = document.querySelector('.pagination-container')
    paginationContainer.innerHTML = ''
   
    //the logic for the next and prev buttons are similar so could have been condensed but I wasn't able to work out how
    if (data.previous){
        const prevButton = document.createElement ('button')
        prevButton.textContent = 'PREV'
        prevButton.addEventListener('click', () => {
            currentPage--
            fetchDataAndRender(category, currentPage)
        })
        paginationContainer.appendChild(prevButton)
    }
    if (data.next){
        const nextButton = document.createElement('button')
        nextButton.textContent = 'NEXT'
        nextButton.addEventListener('click', () => {
            currentPage++
            fetchDataAndRender(category, currentPage)
        })
        paginationContainer.appendChild(nextButton)
    }

}
//this function doesn't appear to be working properly and I ran out of time before I could work out why
function clearProfile() {
    const profileDetails = document.getElementById('profileDetails');
    profileDetails.innerHTML = '';
}
//the folowing functions handle the rendering of the profiles for the user to view the information
function displayProfileDetails (category, itemId){
    const apiUrlForProfiles = `${API_ROOT_URL}/${category}/${itemId}/`

    fetch(apiUrlForProfiles)
        .then(response => response.json())
        .then(data => {
            const profileDetails = document.getElementById('profile-details')
            profileDetails.innerHTML = ''
            
            if(category === 'people'){
                renderPeopleProfile(data)
            }else if(category === 'planets'){
                renderPlanetProfile(data)
            }else if(category === 'films'){
                renderFilmProfile(data)
            }else if(category === 'species'){
                renderSpeciesProfile(data)
            }else if(category === 'vehicles'){
                renderVehicleProfile(data)
            }else if(category === 'starships'){
                renderStarshipProfile(data)
            }
        })
        .catch(error => console.error('Error fetching profile details', error))
}
//the following functions handle the info which is rendered, they are similar so could be condensed somehow, but the info is 
//very different for each category so I couldn't think how to do it more effectively
function renderPeopleProfile(data){
    const profileDetails = document.getElementById('profile-details')
    const name = document.createElement('p');
    const height = document.createElement('p');
    const mass = document.createElement('p');
    const hairColor = document.createElement('p');
    const skinColor = document.createElement('p');
    const eyeColor = document.createElement('p');
    const birthYear = document.createElement('p');
    const gender = document.createElement('p');

    name.textContent = `Name: ${data.name}`;
    height.textContent = `Height: ${data.height} cm`;
    mass.textContent = `Mass: ${data.mass} kg`;
    hairColor.textContent = `Hair Color: ${data.hair_color}`;
    skinColor.textContent = `Skin Color: ${data.skin_color}`;
    eyeColor.textContent = `Eye Color: ${data.eye_color}`;
    birthYear.textContent = `Birth Year: ${data.birth_year}`;
    gender.textContent = `Gender: ${data.gender}`;

    profileDetails.appendChild(name);
    profileDetails.appendChild(height);
    profileDetails.appendChild(mass);
    profileDetails.appendChild(hairColor);
    profileDetails.appendChild(skinColor);
    profileDetails.appendChild(eyeColor);
    profileDetails.appendChild(birthYear);
    profileDetails.appendChild(gender);
}
function renderPlanetProfile(data){
    const profileDetails = document.getElementById('profile-details');
    const name = document.createElement('p');
    const rotationPeriod = document.createElement('p');
    const orbitalPeriod = document.createElement('p');
    const diameter = document.createElement('p');
    const climate = document.createElement('p');
    const gravity = document.createElement('p');
    const terrain = document.createElement('p');
    const surfaceWater = document.createElement('p');
    const population = document.createElement('p');

    name.textContent = `Name: ${data.name}`;
    rotationPeriod.textContent = `Rotation Period: ${data.rotation_period} hours`;
    orbitalPeriod.textContent = `Orbital Period: ${data.orbital_period} days`;
    diameter.textContent = `Diameter: ${data.diameter} km`;
    climate.textContent = `Climate: ${data.climate}`;
    gravity.textContent = `Gravity: ${data.gravity}`;
    terrain.textContent = `Terrain: ${data.terrain}`;
    surfaceWater.textContent = `Surface Water: ${data.surface_water}%`;
    population.textContent = `Population: ${data.population}`;

    profileDetails.appendChild(name);
    profileDetails.appendChild(rotationPeriod);
    profileDetails.appendChild(orbitalPeriod);
    profileDetails.appendChild(diameter);
    profileDetails.appendChild(climate);
    profileDetails.appendChild(gravity);
    profileDetails.appendChild(terrain);
    profileDetails.appendChild(surfaceWater);
    profileDetails.appendChild(population);
}
function renderFilmProfile(data){
    const profileDetails = document.getElementById('profile-details');
    const title = document.createElement('p');
    const episodeId = document.createElement('p');
    const openingCrawl = document.createElement('p');
    const director = document.createElement('p');
    const producer = document.createElement('p');
    const releaseDate = document.createElement('p');

    title.textContent = `Title: ${data.title}`;
    episodeId.textContent = `Episode ID: ${data.episode_id}`;
    openingCrawl.textContent = `Opening Crawl: ${data.opening_crawl}`;
    director.textContent = `Director: ${data.director}`;
    producer.textContent = `Producer: ${data.producer}`;
    releaseDate.textContent = `Release Date: ${data.release_date}`;

    profileDetails.appendChild(title);
    profileDetails.appendChild(episodeId);
    profileDetails.appendChild(openingCrawl);
    profileDetails.appendChild(director);
    profileDetails.appendChild(producer);
    profileDetails.appendChild(releaseDate);
}
function renderSpeciesProfile(data){
    const profileDetails = document.getElementById('profile-details');
    const name = document.createElement('p');
    const classification = document.createElement('p');
    const designation = document.createElement('p');
    const averageHeight = document.createElement('p');
    const skinColors = document.createElement('p');
    const hairColors = document.createElement('p');
    const eyeColors = document.createElement('p');
    const averageLifespan = document.createElement('p');
    const language = document.createElement('p');

    name.textContent = `Name: ${data.name}`;
    classification.textContent = `Classification: ${data.classification}`;
    designation.textContent = `Designation: ${data.designation}`;
    averageHeight.textContent = `Average Height: ${data.average_height} cm`;
    skinColors.textContent = `Skin Colors: ${data.skin_colors}`;
    hairColors.textContent = `Hair Colors: ${data.hair_colors}`;
    eyeColors.textContent = `Eye Colors: ${data.eye_colors}`;
    averageLifespan.textContent = `Average Lifespan: ${data.average_lifespan} years`;
    language.textContent = `Language: ${data.language}`;

    profileDetails.appendChild(name);
    profileDetails.appendChild(classification);
    profileDetails.appendChild(designation);
    profileDetails.appendChild(averageHeight);
    profileDetails.appendChild(skinColors);
    profileDetails.appendChild(hairColors);
    profileDetails.appendChild(eyeColors);
    profileDetails.appendChild(averageLifespan);
    profileDetails.appendChild(language);
}
function renderVehicleProfile(data){
    const profileDetails = document.getElementById('profile-details');
    const name = document.createElement('p');
    const model = document.createElement('p');
    const manufacturer = document.createElement('p');
    const costInCredits = document.createElement('p');
    const length = document.createElement('p');
    const maxAtmospheringSpeed = document.createElement('p');
    const crew = document.createElement('p');
    const passengers = document.createElement('p');
    const cargoCapacity = document.createElement('p');
    const consumables = document.createElement('p');

    name.textContent = `Name: ${data.name}`;
    model.textContent = `Model: ${data.model}`;
    manufacturer.textContent = `Manufacturer: ${data.manufacturer}`;
    costInCredits.textContent = `Cost in Credits: ${data.cost_in_credits}`;
    length.textContent = `Length: ${data.length} meters`;
    maxAtmospheringSpeed.textContent = `Max Atmosphering Speed: ${data.max_atmosphering_speed}`;
    crew.textContent = `Crew: ${data.crew}`;
    passengers.textContent = `Passengers: ${data.passengers}`;
    cargoCapacity.textContent = `Cargo Capacity: ${data.cargo_capacity} kg`;
    consumables.textContent = `Consumables: ${data.consumables}`;

    profileDetails.appendChild(name);
    profileDetails.appendChild(model);
    profileDetails.appendChild(manufacturer);
    profileDetails.appendChild(costInCredits);
    profileDetails.appendChild(length);
    profileDetails.appendChild(maxAtmospheringSpeed);
    profileDetails.appendChild(crew);
    profileDetails.appendChild(passengers);
    profileDetails.appendChild(cargoCapacity);
    profileDetails.appendChild(consumables);    
}
function renderStarshipProfile(data){
    const profileDetails = document.getElementById('profile-details');
    const name = document.createElement('p');
    const model = document.createElement('p');
    const manufacturer = document.createElement('p');
    const costInCredits = document.createElement('p');
    const length = document.createElement('p');
    const maxAtmospheringSpeed = document.createElement('p');
    const crew = document.createElement('p');
    const passengers = document.createElement('p');
    const cargoCapacity = document.createElement('p');
    const consumables = document.createElement('p');
    const MGLT = document.createElement('p');
    const hyperdriveRating = document.createElement('p');
    const starshipClass = document.createElement('p');

    name.textContent = `Name: ${data.name}`;
    model.textContent = `Model: ${data.model}`;
    manufacturer.textContent = `Manufacturer: ${data.manufacturer}`;
    costInCredits.textContent = `Cost in Credits: ${data.cost_in_credits}`;
    length.textContent = `Length: ${data.length} meters`;
    maxAtmospheringSpeed.textContent = `Max Atmosphering Speed: ${data.max_atmosphering_speed || 'n/a'}`;
    crew.textContent = `Crew: ${data.crew}`;
    passengers.textContent = `Passengers: ${data.passengers}`;
    cargoCapacity.textContent = `Cargo Capacity: ${data.cargo_capacity} kg`;
    consumables.textContent = `Consumables: ${data.consumables}`;
    MGLT.textContent = `MGLT: ${data.MGLT}`;
    hyperdriveRating.textContent = `Hyperdrive Rating: ${data.hyperdrive_rating}`;
    starshipClass.textContent = `Starship Class: ${data.starship_class}`;

    profileDetails.appendChild(name);
    profileDetails.appendChild(model);
    profileDetails.appendChild(manufacturer);
    profileDetails.appendChild(costInCredits);
    profileDetails.appendChild(length);
    profileDetails.appendChild(maxAtmospheringSpeed);
    profileDetails.appendChild(crew);
    profileDetails.appendChild(passengers);
    profileDetails.appendChild(cargoCapacity);
    profileDetails.appendChild(consumables);
    profileDetails.appendChild(MGLT);
    profileDetails.appendChild(hyperdriveRating);
    profileDetails.appendChild(starshipClass);
}

//Generally speaking I am happy with how the project turned out. I have done some similar projects before but I don't have a huge amount
//of experience so I understand there are places which could be improved.
//The positives I think are the styling, the UI are simple but look good, I think the site is intuitive for the user and it looks good
//in the browser at least.
//Things that could be improved are, the readability of the code, although I think generally it is readable and is organised efficiently
//there are several places where code is repeated, and could be made more efficient.
//If I were to do it again I think firstly I would have used a framework like React, firstly because I have more experience making projects
//in React and modular react components would have helped keep the code cleaner and easier to read. I used vanilla JS because the 
//I was following the task strictly. I would have added more user feedback, for example some loading icon for when the app is fetching
//and rendering the data, at the moment there is no feedback and the user has no way of knowing if a request was successful while they wait
//for it to load. The user should also have the ability to search the whole API for a term in the search bar, I didn't have time to 
//work this logic out. 
//I wasn't able to optimise for mobile, my lack of experience and time constraint for the task meant I couldn't implement this
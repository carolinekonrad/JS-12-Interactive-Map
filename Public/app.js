//get user coords and assign coordinates to variables
async function getCoords(){
    pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
    return [pos.coords.latitude, pos.coords.longitude]
}

//create map using those coordinates^
function buildMap(coordinates){
    //build the map
    const myMap = L.map('map', {
        center: [coordinates[0], coordinates[1]],
        zoom: 12,
    })

    //add OpenStreetMap tile
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: '5',
}).addTo(myMap)

    //add user location marker
    const userMarker = L.marker([coordinates[0], coordinates[1]])
    userMarker.addTo(myMap).bindPopup('<p1><b>You are here</b></p1>').openPopup()

    //setting buttons for searches and calling the getBusiness function
    var markets = document.getElementById('market')
    markets.addEventListener('click', () => {
        let type = 'market'
        getBusiness(coordinates, type)
    })

    var hotels = document.getElementById('hotel')
    hotels.addEventListener('click', () => {
        let type = 'hotel'
        getBusiness(coordinates, type)
    })

    var coffee = document.getElementById('coffee')
    coffee.addEventListener('click', () => {
        let type = 'coffee'
        getBusiness(coordinates, type)
    })

    var restaurants = document.getElementById('restaurant')
    restaurants.addEventListener('click', () => {
        let type = 'restaurants'
        getBusiness(coordinates, type)
    })
}

async function getBusiness(coords, type){
    const option = {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: 'fsq31rMdrPx0N/GYVRKybof6ANwbsLNNdXOMw5lyO0VcQPw=',
            'Access-Control-Allow-Origin': '*',
        },
    }

    //fetching search data from FourSquare
    const response = await fetch(`https://api.foursquare.com/v3/places/search?query=${type}&ll=${coords[0]}%2C${coords[1]}&limit=10`, option)
    const data = await response.text()
    let parseData = JSON.parse(data)
    let businessData = parseData.results
    console.log(businessData)

    //bind popups to business search
    businessData.forEach(element => {
        const businessMarkers = L.marker(businessData[0], businessData[1])
        businessMarkers.addTo(myMap).bindPopup('<p1><b>Location</b></p1>')
    })
}

//onload
window.onload = async () => {
    const coords = await getCoords()
    buildMap(coords)
}

import { useEffect } from 'react';
import './App.css';
import { getApiData } from "./dataApi";

function App() {
  const apiData = getApiData();
  const coords=[]
  const sats =[]


for (let i =0 ; i<apiData.length;i++){
  if(parseFloat(apiData[i].longi) !== 0 && parseFloat(apiData[i].lati) !== 0)  
  {
    const temp = []
    sats.push(apiData[i].sats)
    temp.push(parseFloat(apiData[i].longi))
    temp.push(parseFloat(apiData[i].lati))
    coords.push(temp)
  }
  else{
    console.log("hello")
  }
}

// console.log(coords)
// console.log(sats)

useEffect(() => {
  var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
  mapboxgl.accessToken = 'pk.eyJ1IjoiYXZpeGlvbjIwMDEiLCJhIjoiY2ttN2p1MjY4MHl2YjJ5bzQxOXNkamJzeSJ9.gY48YPfe2qT9V_6zF6Tj-w';
const map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11',
// center: [88.42451567, 26.71762767],
center: coords[Math.floor(apiData.length/2)],
zoom: 15
});
map.addControl(new mapboxgl.NavigationControl());

map.on('load', function () {
    map.addSource('route', {
    'type': 'geojson',
    'data': {
    'type': 'Feature',
    'properties': {},
    'geometry': {
    'type': 'LineString',
    'coordinates': coords
    }
    }
    });
    map.addLayer({
    'id': 'route',
    'type': 'line',
    'source': 'route',
    'layout': {
    'line-join': 'round',
    'line-cap': 'round'
    },
    'paint': {
    'line-color': '#cf2626',
    'line-width': 8
    }
    });
    });
  
}, [coords])
  return (
    <div className="App" style={{width: "100vw", height: "100vh", display: "flex", alignItems:"center", justifyContent:"center"}}>
      <div id="map" style={{width: "100%", height: "100%"}}></div>


    </div>
  );
}

export default App;
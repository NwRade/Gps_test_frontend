import { useEffect, useState } from "react";
import "./App.css";
// import { getApiData } from "./dataApi";
import axios from "axios";

function App() {
  const [ip, setIp] = useState("");
  const [port, setPort] = useState("");
  const [showMap, setShowMap] = useState(false);
  const apiData = [];
  const coords = [];
  const sats = [];
  const time = 1200;
  useEffect(() => {
    const interval = setInterval(() => {
      axios
        // .get("http://192.168.29.49:3000/gps/relive/updated.json")
        // .get("http://192.168.29.49:3000/gps/live")
        .get("http://192.168.43.1:3000/gps/live")
        .then((res) => {
          apiData.push(res.data.GPS);
          for (let i = 0; i < apiData.length; i++) {
            if (
              parseFloat(apiData[i].longi) !== 0 &&
              parseFloat(apiData[i].lati) !== 0
            ) {
              const temp = [];
              sats.push(apiData[i].sats);
              temp.push(parseFloat(apiData[i].longi));
              temp.push(parseFloat(apiData[i].lati));
              coords.push(temp);
            } else {
              console.log("hello");
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });

      console.log(apiData);
    }, time);

    return () => clearInterval(interval);
  }, [time, apiData]);

  const mapRefesh = 5000;

  useEffect(() => {
    const interval = setInterval(() => {
      var mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");
      mapboxgl.accessToken =
        "pk.eyJ1IjoiYXZpeGlvbjIwMDEiLCJhIjoiY2ttN2p1MjY4MHl2YjJ5bzQxOXNkamJzeSJ9.gY48YPfe2qT9V_6zF6Tj-w";
      const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
        center: coords[Math.floor(apiData.length / 2)],
        zoom: 13,
      });
      map.addControl(new mapboxgl.NavigationControl());

      map.on("load", function () {
        map.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: coords,
            },
          },
        });
        map.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#cf2626",
            "line-width": 8,
          },
        });
      });
    }, mapRefesh);

    return () => clearInterval(interval);
  }, [coords, mapRefesh]);

  const handleClick = () => {
    setShowMap(true);
  };
  return (
    <div>
      {/* {!showMap && (
        <div>
          <input type="text" placeholder="IP" value={ip} onChange={setIp} />
          <input
            type="text"
            placeholder="Port"
            value={port}
            onChange={setPort}
          />
          <button onChange={handleClick}>OK</button>
        </div>
      )}
      {showMap && ( */}
      <div
        className="App"
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div id="map" style={{ width: "100%", height: "100%" }}></div>
      </div>
      {/* )} */}
    </div>
  );
}

export default App;

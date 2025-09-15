/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import styles from "./Map.module.css";
import Button from "./Button";
import Spinner from "./Spinner";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvent,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContext";
import { useGeolocation } from "../hooks/useGeolocation";
import { useUrlPosition } from "../hooks/useUrlPosition";

function Map() {
  const [lat, lng] = useUrlPosition();
  const {
    isLoading: isLoadingPosition,
    position: geoLocationPosition,
    getPosition,
  } = useGeolocation();

  const navigate = useNavigate();

  const mapLat = lat || 40;
  const mapLng = lng || 0;
  const { cities } = useCities();

  const [mapPosition, setMapPosition] = useState([mapLat, mapLng]);
  const [zoom, setZoom] = useState(6);

  useEffect(
    function () {
      if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    },
    [mapLat, mapLng]
  );

  useEffect(
    function () {
      if (geoLocationPosition.lat) {
        setMapPosition([geoLocationPosition.lat, geoLocationPosition.lng]);
        setZoom(12);
      }
    },
    [geoLocationPosition.lat, geoLocationPosition.lng]
  );

  return (
    <div
      className={styles.mapContainer}
      onClick={() => {
        navigate("form");
      }}
    >
      {!geoLocationPosition.lat && (
        <Button type="position" onClick={getPosition}>
          {isLoadingPosition ? <Spinner /> : "Use your Position"}
        </Button>
      )}
      <MapContainer
        center={mapPosition}
        zoom={zoom}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />

        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji}</span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}

        <ChangePopUp position={mapPosition} />
        <HandleClick />
      </MapContainer>
    </div>
  );
}

function ChangePopUp({ position }) {
  const map = useMap();
  map.setView(position);

  return null;
}

function HandleClick() {
  const navigate = useNavigate();
  useMapEvent({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
}

export default Map;

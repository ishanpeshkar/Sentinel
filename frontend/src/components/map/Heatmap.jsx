import React from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Heatmap.css';

// This component will handle map events like clicks
const MapEvents = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
};

const Heatmap = ({ onMapClick }) => {
  const position = [51.505, -0.09]; // Default position (London)

  return (
    <MapContainer center={position} zoom={13} scrollWheelZoom={true} className="heatmap-leaflet-container">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapEvents onMapClick={onMapClick} />
      {/* Heatmap layer will be added here in a future phase */}
    </MapContainer>
  );
};

export default Heatmap;
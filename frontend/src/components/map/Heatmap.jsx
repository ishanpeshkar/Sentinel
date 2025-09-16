import React from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import CustomHeatmapLayer from './HeatmapLayer'; // Import our new component
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

// Accept 'center' as a prop
const Heatmap = ({ onMapClick, center }) => {
  // Use the passed center prop for the MapContainer
  return (
    <MapContainer center={center} zoom={13} scrollWheelZoom={true} className="heatmap-leaflet-container">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapEvents onMapClick={onMapClick} />
      <CustomHeatmapLayer /> {/* Add the heatmap layer here! */}
    </MapContainer>
  );
};

export default Heatmap;
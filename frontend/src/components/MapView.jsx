import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { placesAPI } from '../api';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
  });
  return null;
}

// Create custom icon for selected marker
const createCustomIcon = (isSelected) => {
  if (isSelected) {
    // Create a custom HTML icon for selected marker
    return L.divIcon({
      className: 'custom-marker-selected',
      html: `<div style="
        width: 30px;
        height: 30px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: 3px solid white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 3px 14px rgba(0,0,0,0.4);
        position: relative;
      ">
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(45deg);
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
        "></div>
      </div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30]
    });
  }
  
  return L.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

// Create preview marker icon
const createPreviewIcon = () => {
  return L.divIcon({
    className: 'preview-marker',
    html: `<div style="
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      border: 3px solid white;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 4px 16px rgba(245, 87, 108, 0.5);
      position: relative;
      animation: pulse 2s infinite;
    ">
      <div style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(45deg);
        width: 14px;
        height: 14px;
        background: white;
        border-radius: 50%;
      "></div>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

function MapView({ places, onPlaceClick, onMapClick, selectedPlaceId, previewLocation }) {
  const defaultCenter = [50.4501, 30.5234]; // Kyiv, Ukraine

  return (
    <MapContainer
      center={defaultCenter}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClickHandler onMapClick={onMapClick} />
      {/* Preview marker */}
      {previewLocation && (
        <Marker
          position={[previewLocation.lat, previewLocation.lng]}
          icon={createPreviewIcon()}
        >
          <Popup>
            <div className="popup-content">
              <strong>Нове місце</strong>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>
                Заповніть форму, щоб створити місце
              </p>
            </div>
          </Popup>
        </Marker>
      )}
      {places.map((place) => {
        const isSelected = selectedPlaceId === place._id;
        return (
        <Marker
          key={place._id}
          position={[place.location.lat, place.location.lng]}
          icon={createCustomIcon(isSelected)}
          eventHandlers={{
            click: () => onPlaceClick(place),
          }}
        >
          <Popup>
            <div className="popup-content">
              <h3>{place.name}</h3>
              {(place.userId || place.userName) && (
                <div className="popup-author">
                  {place.userId?.picture ? (
                    <img src={place.userId.picture} alt={place.userId.name || place.userName} className="popup-avatar" />
                  ) : (
                    <div className="popup-avatar-placeholder">
                      {(place.userId?.name || place.userName || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="popup-author-name">
                    {place.userId?.name || place.userName || 'Невідомий користувач'}
                  </span>
                </div>
              )}
              {place.type && <p><strong>Тип:</strong> {place.type}</p>}
              {place.description && <p>{place.description}</p>}
              {place.eventEndTime && (
                <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#f5576c', fontWeight: '500' }}>
                  📅 До: {new Date(place.eventEndTime).toLocaleString('uk-UA', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              )}
            </div>
          </Popup>
        </Marker>
        );
      })}
    </MapContainer>
  );
}

export default MapView;


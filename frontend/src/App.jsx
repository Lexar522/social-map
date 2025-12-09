import React, { useState, useEffect } from 'react';
import MapView from './components/MapView';
import LoginButton from './components/LoginButton';
import AuthorLinks from './components/AuthorLinks';
import { placesAPI, authAPI, setAuthToken } from './api';
import './index.css';

function App() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    location: null,
    eventEndTime: ''
  });
  const [previewLocation, setPreviewLocation] = useState(null);

  // Handle OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      console.log('Token received:', token);
      setAuthToken(token);
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
      // Load user after token is set
      setTimeout(() => {
        loadUser();
      }, 100);
    }
  }, []);

  // Load user and places on mount
  useEffect(() => {
    loadUser();
    loadPlaces();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await authAPI.getCurrentUser();
      console.log('Current user:', currentUser);
      setUser(currentUser);
    } catch (error) {
      console.error('Error loading user:', error);
      setUser(null);
    }
  };

  const loadPlaces = async () => {
    try {
      setLoading(true);
      const data = await placesAPI.getAll();
      console.log('Loaded places:', data);
      console.log('First place userId:', data[0]?.userId);
      setPlaces(data);
    } catch (error) {
      console.error('Error loading places:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMapClick = (latlng) => {
    if (!user) {
      alert('Будь ласка, увійдіть, щоб додавати місця');
      return;
    }
    setFormData({
      name: '',
      type: '',
      description: '',
      location: { lat: latlng.lat, lng: latlng.lng },
      eventEndTime: ''
    });
    setPreviewLocation({ lat: latlng.lat, lng: latlng.lng });
    setSelectedPlace(null);
    setShowForm(true);
  };

  const handlePlaceClick = (place) => {
    console.log('Place clicked:', place);
    console.log('Place userId:', place.userId);
    setSelectedPlace(place);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.location) {
      alert('Будь ласка, введіть назву місця');
      return;
    }

    if (!user) {
      alert('Будь ласка, увійдіть, щоб додавати місця');
      return;
    }

    try {
      await placesAPI.create(formData);
      setShowForm(false);
      setFormData({ name: '', type: '', description: '', location: null, eventEndTime: '' });
      setPreviewLocation(null);
      loadPlaces();
    } catch (error) {
      console.error('Error creating place:', error);
      alert(error.message || 'Помилка створення місця');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Ви впевнені, що хочете видалити це місце?')) {
      return;
    }

    try {
      await placesAPI.delete(id);
      setSelectedPlace(null);
      loadPlaces();
    } catch (error) {
      console.error('Error deleting place:', error);
      alert(error.message || 'Помилка видалення місця. Можливо, це не ваше місце.');
    }
  };

  const isOwner = (place) => {
    if (!user || !place.userId) return false;
    const placeUserId = typeof place.userId === 'object' ? place.userId._id : place.userId;
    return placeUserId === user._id || placeUserId.toString() === user._id.toString();
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1>🗺️ Social Map</h1>
            <p>{user ? 'Клікніть на карту, щоб додати нове місце' : 'Увійдіть, щоб додавати місця на карту'}</p>
          </div>
          <LoginButton user={user} onLogin={loadUser} />
        </div>
      </header>

      <div className="app-content">
        <div className="map-container">
          {loading ? (
            <div className="loading">Завантаження карти...</div>
          ) : (
            <MapView
              places={places}
              onPlaceClick={handlePlaceClick}
              onMapClick={handleMapClick}
              selectedPlaceId={selectedPlace?._id}
              previewLocation={previewLocation}
            />
          )}
        </div>

        <div className="sidebar">
          {showForm && (
            <div className="form-panel">
              <h2>Додати нове місце</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Назва *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Назва місця"
                  />
                </div>
                <div className="form-group">
                  <label>Тип</label>
                  <input
                    type="text"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    placeholder="Наприклад: ресторан, парк, музей"
                  />
                </div>
                <div className="form-group">
                  <label>Опис</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Опис місця"
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label>Подія діє до</label>
                  <input
                    type="datetime-local"
                    value={formData.eventEndTime}
                    onChange={(e) => setFormData({ ...formData, eventEndTime: e.target.value })}
                    placeholder="Дата та час завершення події"
                  />
                  <small style={{ display: 'block', marginTop: '0.5rem', color: '#666', fontSize: '0.85rem' }}>
                    Оберіть дату та час, до якого буде діяти подія (необов'язково)
                  </small>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">Додати</button>
                  <button type="button" className="btn btn-secondary" onClick={() => {
                    setShowForm(false);
                    setPreviewLocation(null);
                  }}>
                    Скасувати
                  </button>
                </div>
              </form>
            </div>
          )}

          {selectedPlace && !showForm && (
            <div className="place-details">
              <h2>{selectedPlace.name}</h2>
              {(selectedPlace.userId || selectedPlace.userName) && (
                <div className="place-author-card">
                  <div className="place-author-avatar">
                    {selectedPlace.userId?.picture ? (
                      <img src={selectedPlace.userId.picture} alt={selectedPlace.userId.name || selectedPlace.userName} />
                    ) : (
                      <div className="place-author-avatar-placeholder">
                        {(selectedPlace.userId?.name || selectedPlace.userName || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="place-author-info">
                    <div className="place-author-label">Автор</div>
                    <div className="place-author-name">
                      {selectedPlace.userId?.name || selectedPlace.userName || 'Невідомий користувач'}
                    </div>
                  </div>
                </div>
              )}
              {selectedPlace.type && (
                <p className="place-type"><strong>Тип:</strong> {selectedPlace.type}</p>
              )}
              {selectedPlace.description && (
                <p className="place-description">{selectedPlace.description}</p>
              )}
              {selectedPlace.eventEndTime && (
                <div className="place-event-time">
                  <strong>Подія діє до:</strong>{' '}
                  {new Date(selectedPlace.eventEndTime).toLocaleString('uk-UA', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              )}
              <p className="place-coords">
                Координати: {selectedPlace.location.lat.toFixed(4)}, {selectedPlace.location.lng.toFixed(4)}
              </p>
              {isOwner(selectedPlace) && (
                <button className="btn btn-danger" onClick={() => handleDelete(selectedPlace._id)}>
                  Видалити
                </button>
              )}
              {!isOwner(selectedPlace) && user && (
                <p className="place-note">Ви можете видаляти тільки свої місця</p>
              )}
              <button className="btn btn-secondary" onClick={() => setSelectedPlace(null)}>
                Закрити
              </button>
            </div>
          )}

          {!showForm && !selectedPlace && (
            <div className="info-panel">
              <h3>Інструкція</h3>
              <ol>
                <li>Увійдіть через Google акаунт</li>
                <li>Клікніть на карту, щоб додати нове місце</li>
                <li>Заповніть форму з назвою та описом</li>
                <li>Клікніть на маркер на карті, щоб переглянути деталі</li>
                <li>Ви можете видаляти тільки свої місця</li>
              </ol>
              <div className="places-count">
                <strong>Всього місць:</strong> {places.length}
              </div>
            </div>
          )}
        </div>
      </div>
      <AuthorLinks />
    </div>
  );
}

export default App;

const API_URL = 'http://localhost:5000/api';

// Get auth token from localStorage
const getToken = () => localStorage.getItem('authToken');

// Set auth token
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

// Get current user
export const getCurrentUser = async () => {
  const token = getToken();
  console.log('getCurrentUser - token:', token ? 'exists' : 'missing');
  if (!token) return null;

  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('getCurrentUser - response status:', response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('getCurrentUser - error:', errorText);
      setAuthToken(null);
      return null;
    }
    const userData = await response.json();
    console.log('getCurrentUser - user data:', userData);
    return userData;
  } catch (error) {
    console.error('Error fetching user:', error);
    setAuthToken(null);
    return null;
  }
};

// Auth API
export const authAPI = {
  login: () => {
    window.location.href = `${API_URL}/auth/google`;
  },
  logout: () => {
    setAuthToken(null);
    window.location.href = '/';
  },
  getCurrentUser
};

// Places API
export const placesAPI = {
  // Get all places
  getAll: async () => {
    const response = await fetch(`${API_URL}/places`);
    if (!response.ok) throw new Error('Failed to fetch places');
    return response.json();
  },

  // Get single place
  getOne: async (id) => {
    const response = await fetch(`${API_URL}/places/${id}`);
    if (!response.ok) throw new Error('Failed to fetch place');
    return response.json();
  },

  // Create place
  create: async (placeData) => {
    const token = getToken();
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_URL}/places`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(placeData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create place');
    }
    return response.json();
  },

  // Update place
  update: async (id, placeData) => {
    const token = getToken();
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_URL}/places/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(placeData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update place');
    }
    return response.json();
  },

  // Delete place
  delete: async (id) => {
    const token = getToken();
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_URL}/places/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete place');
    }
    return response.json();
  },
};

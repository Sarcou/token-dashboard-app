
// API service for authentication and data fetching
const BASE_URL = '/api/auth';

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  // Add any other properties returned by your API
}

export interface UserData {
  email: string;
  createdAt: string;
  // Add any other user properties from your API
}

// Authentication Services
export const authService = {
  // Login function
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Échec de la connexion. Veuillez réessayer.');
    }

    return response.json();
  },

  // Get current user data
  getMe: async (token: string): Promise<UserData> => {
    const response = await fetch(`${BASE_URL}/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Échec de récupération des données utilisateur.');
    }

    return response.json();
  },

  // Future endpoint for getting all users
  getAllUsers: async (token: string): Promise<UserData[]> => {
    const response = await fetch(`${BASE_URL}/users`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Échec de récupération des utilisateurs.');
    }

    return response.json();
  },
};

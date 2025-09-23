const API_BASE_URL = 'http://localhost:8000/api/auth';

class AuthService {
  constructor() {
    this.token = localStorage.getItem('access_token');
    this.refreshToken = localStorage.getItem('refresh_token');
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
  }

  // Register a new user
  async register(userData) {
    try {
      console.log('🔍 AuthService.register called with:', userData);
      
      // Validate required fields
      if (!userData.email || !userData.password) {
        console.error('❌ Missing required fields:', { email: !!userData.email, password: !!userData.password });
        return { 
          success: false, 
          errors: { general: ['Email and password are required'] } 
        };
      }

      // Safely handle full_name
      const fullName = userData.full_name || '';
      const nameParts = fullName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Convert form data to API format
      const apiData = {
        username: userData.email, // Use email as username
        email: userData.email,
        password: userData.password,
        first_name: firstName,
        last_name: lastName,
      };

      console.log('📤 Sending API data:', apiData);

      const response = await fetch(`${API_BASE_URL}/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      const data = await response.json();
      console.log('📥 API response:', data);

      if (data.success) {
        // Store tokens and user data
        this.setTokens(data.tokens);
        this.setUser(data.user);
        console.log('✅ Registration successful');
        return { success: true, user: data.user };
      } else {
        console.error('❌ Registration failed:', data.message);
        return { success: false, errors: { general: [data.message] } };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        errors: { general: ['Registration failed. Please try again.'] } 
      };
    }
  }

  // Login user
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password }), // Use email as username
      });

      const data = await response.json();

      if (data.success) {
        // Store tokens and user data
        this.setTokens(data.tokens);
        this.setUser(data.user);
        return { success: true, user: data.user };
      } else {
        return { success: false, errors: { general: [data.message] } };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        errors: { general: ['Login failed. Please try again.'] } 
      };
    }
  }

  // Logout user
  async logout() {
    try {
      if (this.refreshToken) {
        await fetch(`${API_BASE_URL}/logout/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`,
          },
          body: JSON.stringify({ refresh_token: this.refreshToken }),
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API call success
      this.clearTokens();
      this.clearUser();
    }
  }

  // Refresh access token
  async refreshAccessToken() {
    try {
      if (!this.refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: this.refreshToken }),
      });

      const data = await response.json();

      if (data.access) {
        this.token = data.access;
        localStorage.setItem('access_token', this.token);
        return true;
      } else {
        throw new Error('Failed to refresh token');
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      this.logout();
      return false;
    }
  }

  // Get user profile
  async getProfile() {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });

      if (response.status === 401) {
        // Token expired, try to refresh
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          return this.getProfile(); // Retry with new token
        }
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      return data.success ? data.profile : null;
    } catch (error) {
      console.error('Get profile error:', error);
      return null;
    }
  }

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (response.status === 401) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          return this.updateProfile(profileData);
        }
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      return data.success ? data.profile : null;
    } catch (error) {
      console.error('Update profile error:', error);
      return null;
    }
  }

  // Change password
  async changePassword(oldPassword, newPassword, confirmPassword) {
    try {
      const response = await fetch(`${API_BASE_URL}/change-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }),
      });

      if (response.status === 401) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          return this.changePassword(oldPassword, newPassword, confirmPassword);
        }
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Change password error:', error);
      return false;
    }
  }

  // Get dashboard data
  async getDashboardData() {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard-data/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });

      if (response.status === 401) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          return this.getDashboardData();
        }
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Get dashboard data error:', error);
      return null;
    }
  }

  // Helper methods
  setTokens(tokens) {
    this.token = tokens.access;
    this.refreshToken = tokens.refresh;
    localStorage.setItem('access_token', this.token);
    localStorage.setItem('refresh_token', this.refreshToken);
  }

  setUser(user) {
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  clearTokens() {
    this.token = null;
    this.refreshToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  clearUser() {
    this.user = null;
    localStorage.removeItem('user');
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.token && !!this.user;
  }

  // Get current user
  getCurrentUser() {
    return this.user;
  }

  // Get auth headers for API calls
  getAuthHeaders() {
    return {
      'Authorization': `Bearer ${this.token}`,
    };
  }
}

// Create singleton instance
const authService = new AuthService();
export default authService;

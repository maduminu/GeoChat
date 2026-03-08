import { API_BASE_URL } from './config';

/**
 * Central API service to handle all network requests.
 * Modernizes the legacy XMLHttpRequest pattern used in the app.
 */
const api = {
    /**
     * Helper to handle response parsing safely
     */
    handleResponse: async (response) => {
        const text = await response.text();
        try {
            return JSON.parse(text);
        } catch (e) {
            // If not JSON, return as plain text (legacy PHP response style)
            return text;
        }
    },

    /**
     * Generic POST request handler using FormData
     */
    post: async (endpoint, data = {}) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
        });

        try {
            const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await api.handleResponse(response);
        } catch (error) {
            console.error(`API POST Error [${endpoint}]:`, error);
            throw error;
        }
    },

    /**
     * Generic GET request handler
     */
    get: async (endpoint) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${endpoint}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await api.handleResponse(response);
        } catch (error) {
            console.error(`API GET Error [${endpoint}]:`, error);
            throw error;
        }
    },

    /**
     * Specifically for image uploads or complex FormData
     */
    upload: async (endpoint, formData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await api.handleResponse(response);
        } catch (error) {
            console.error(`API Upload Error [${endpoint}]:`, error);
            throw error;
        }
    }
};

export default api;

import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const verifyGoogleToken = async (token: string) => {
    try {
        const response = await axios.post(`${API_URL}/auth/verify-google-token`, { token });
        return response.data;
    } catch (error) {
        console.error('Error verifying Google token:', error);
        throw error;
    }
}

export {
    verifyGoogleToken
};
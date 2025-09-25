import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const signIn = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/auth/sign-in`, { email, password });
        return response.data;
    } catch (error) {
        console.error('Error signing in:', error);
        throw error;
    }
}

const signUp = async (email: string, password: string, name: string, role: string) => {
    try {
        const response = await axios.post(`${API_URL}/auth/sign-up`, { 
            email, 
            password, 
            name, 
            role 
        });
        return response.data;
    } catch (error) {
        console.error('Error signing up:', error);
        throw error;
    }
}

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
    signIn,
    signUp,
    verifyGoogleToken
};
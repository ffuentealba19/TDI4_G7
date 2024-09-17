import axios from "axios";

const API_URL = 'http://localhost:3000/api';

export const registerUser = async (name: string, email: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/register`, {
        name,
        email,
        password
        });
    
        return response.data;
    } catch (error) {
        console.error(error);
    }
    }

import axios from "axios"

export const axiosInstance = axios.create({
    baseURL:"https://chit-chat-app-x9g0.onrender.com",
    headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`
    }
});
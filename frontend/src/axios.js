import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

const axiosClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`
})

axiosClient.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('TOKEN')}`
    return config
});

axiosClient.interceptors.response.use(response => {
    return response;
}, error => {
    if(error.response && error.response.status === 401) {
        const navigate = useNavigate(); // Use useNavigate hook to access the navigation function
        navigate('/login'); // Navigate to the login page
        return error;
    }
    throw error;
})

export default axiosClient;

import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', // Adjust the base URL as needed
    headers: { 'Content-Type': 'application/json' },
});

export default api;
// This code sets up an Axios instance with a predefined configuration.
// The baseURL is set to 'http://localhost:8000/api', which means all requests made using this instance will be prefixed with this URL.
// The headers are set to include 'Content-Type': 'application/json', indicating that the request body will be in JSON format.

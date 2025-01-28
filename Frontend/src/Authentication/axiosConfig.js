import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api", // Replace with your API base URL
});

// Add the request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Set Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance; // Export the Axios instance

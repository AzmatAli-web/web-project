// import axios from "axios";

// const axiosClient = axios.create({
//   baseURL: 'http://localhost:5000/api' // Fixed URL
// });

// // Add JWT token to requests automatically
// axiosClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   }
// );

// export default axiosClient;

// api/axiosClient.js
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// REMOVE the request interceptor completely for now
// Just set default headers
axiosClient.defaults.headers.common['Content-Type'] = 'application/json';

// Only add Authorization header if token exists
const token = localStorage.getItem('token');
if (token) {
  axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default axiosClient;
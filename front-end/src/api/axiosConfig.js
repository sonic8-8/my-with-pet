import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Cookie 전송을 위해 활성화
});

// Request Interceptor
// Plan-32: HttpOnly Cookie가 자동으로 전송되므로 Authorization 헤더 수동 주입 불필요
api.interceptors.request.use(
  (config) => {
    // 쿠키는 withCredentials: true로 자동 전송됨
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401/403 errors (e.g. redirect to login)
    if (error.response && error.response.status === 401) {
      // Redirect to login or refresh token
      console.log("Unauthorized, redirecting to login...");
    }
    return Promise.reject(error);
  }
);

export default api;

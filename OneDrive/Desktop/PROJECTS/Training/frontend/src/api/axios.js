// =====================================================
// FILE: src/services/api.js
// FULLY FIXED VERSION
// =====================================================

import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
     "http://localhost:8000" ,

  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },

  timeout: 10000,
});


// =====================================================
// REQUEST INTERCEPTOR
// =====================================================

api.interceptors.request.use(

  (config) => {

    const token =
      localStorage.getItem("token");

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {

    return Promise.reject(error);
  }
);


// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

api.interceptors.response.use(

  (response) => response,

  (error) => {

    console.error(
      "API ERROR:",
      error?.response?.data ||
      error?.message
    );

    // =============================================
    // AUTO LOGOUT ON 401
    // =============================================

    if (
      error?.response?.status === 401
    ) {

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );

      window.location.href =
        "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
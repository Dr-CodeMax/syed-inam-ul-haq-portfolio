// =====================================================
// FILE: src/context/AuthContext.jsx
// FULLY FIXED VERSION
// =====================================================

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import toast from "react-hot-toast";

import {
  loginUser,
  logoutUser,
  getCurrentUser,
  updateCurrentUser,
  updateCurrentPassword,
} from "../services/authServices";

const AuthContext =
  createContext();


// =====================================================
// PROVIDER
// =====================================================

export const AuthProvider = ({
  children,
}) => {

  const [token, setToken] =
    useState(
      localStorage.getItem(
        "token"
      ) || null
    );

  const [user, setUser] =
    useState(() => {

      const storedUser =
        localStorage.getItem(
          "user"
        );

      return storedUser
        ? JSON.parse(storedUser)
        : null;
    });

  const [loading, setLoading] =
    useState(true);


  // =====================================================
  // FETCH USER
  // =====================================================

  const fetchUser =
    useCallback(async () => {

      const storedToken =
        localStorage.getItem(
          "token"
        );

      if (!storedToken) {

        setLoading(false);

        return;
      }

      try {

        const data =
          await getCurrentUser();

        setUser(data);

        localStorage.setItem(
          "user",
          JSON.stringify(data)
        );

      } catch (error) {

        console.error(
          "FETCH USER ERROR:",
          error
        );

        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "user"
        );

        setToken(null);

        setUser(null);

      } finally {

        setLoading(false);
      }

    }, []);


  // =====================================================
  // HYDRATE AUTH
  // =====================================================

  useEffect(() => {

    fetchUser();

  }, [fetchUser]);


  // =====================================================
  // LOGIN
  // =====================================================

  const login =
    async (credentials) => {

      try {

        setLoading(true);

        const data =
          await loginUser(
            credentials
          );

        const accessToken =
          data?.access_token;

        const loggedInUser =
          data?.user;

        if (!accessToken) {

          throw new Error(
            "Access token missing"
          );
        }

        localStorage.setItem(
          "token",
          accessToken
        );

        localStorage.setItem(
          "user",
          JSON.stringify(
            loggedInUser
          )
        );

        setToken(
          accessToken
        );

        setUser(
          loggedInUser
        );

        toast.success(
          "Login successful"
        );

        return data;

      } catch (error) {

        console.error(
          "LOGIN ERROR:",
          error
        );

        toast.error(

          error?.response?.data
            ?.detail ||

          error?.response?.data
            ?.message ||

          "Login failed"
        );

        throw error;

      } finally {

        setLoading(false);
      }

    };


  // =====================================================
  // UPDATE PROFILE
  // =====================================================

  const updateProfile =
    async (payload) => {

      try {

        const response =
          await updateCurrentUser(
            payload
          );

        await fetchUser();

        return response;

      } catch (error) {

        console.error(
          "UPDATE PROFILE ERROR:",
          error
        );

        throw error;
      }

    };


  // =====================================================
  // UPDATE PASSWORD
  // =====================================================

  const updatePassword =
    async (payload) => {

      return await updateCurrentPassword(
        payload
      );
    };


  // =====================================================
  // LOGOUT
  // =====================================================

  const logout =
    async () => {

      try {

        await logoutUser();

      } catch (error) {

        console.error(
          "LOGOUT ERROR:",
          error
        );

      } finally {

        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "user"
        );

        setToken(null);

        setUser(null);

        toast.success(
          "Logged out successfully"
        );
      }

    };


  const isAuthenticated =
    !!token && !!user;


  return (

    <AuthContext.Provider
      value={{

        token,

        user,

        login,

        logout,

        refreshUser:
          fetchUser,

        updateProfile,

        updatePassword,

        loading,

        isAuthenticated,
      }}
    >

      {children}

    </AuthContext.Provider>
  );
};


export const useAuth = () => {

  const context =
    useContext(
      AuthContext
    );

  if (!context) {

    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};
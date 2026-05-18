// =====================================================
// FILE: src/services/authServices.js
// FULLY FIXED VERSION
// =====================================================

import api from "./api";


// =====================================================
// LOGIN
// =====================================================

export const loginUser = async (
  credentials
) => {

  const response =
    await api.post(
      "/auth/login",
      credentials
    );

  return response.data;
};


// =====================================================
// REGISTER
// =====================================================

export const registerUser = async (
  data
) => {

  const response =
    await api.post(
      "/auth/register",
      data
    );

  return response.data;
};


// =====================================================
// GET CURRENT USER
// =====================================================

export const getCurrentUser =
  async () => {

    const response =
      await api.get(
        "/auth/me"
      );

    return response.data;
  };


// =====================================================
// UPDATE CURRENT USER
// =====================================================

export const updateCurrentUser =
  async (payload) => {

    // =============================================
    // REMOVE EMPTY VALUES
    // =============================================

    const cleanedPayload =
      Object.fromEntries(

        Object.entries(payload)
          .filter(

            ([_, value]) =>

              value !== undefined &&
              value !== null
          )
      );

    const response =
      await api.put(
        "/auth/me",
        cleanedPayload
      );

    return response.data;
  };


// =====================================================
// UPDATE PASSWORD
// =====================================================

export const updateCurrentPassword =
  async (payload) => {

    const response =
      await api.put(
        "/auth/me/password",
        payload
      );

    return response.data;
  };


// =====================================================
// LOGOUT
// =====================================================

export const logoutUser =
  async () => {

    const response =
      await api.post(
        "/auth/logout"
      );

    return response.data;
  };
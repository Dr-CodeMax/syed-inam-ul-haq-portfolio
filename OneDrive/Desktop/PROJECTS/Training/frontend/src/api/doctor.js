// ======================================================
// FILE: frontend/src/api/doctor.js
// ======================================================

import api from "./axios";


// ======================================================
// ✅ GET ALL DOCTORS
// ======================================================

export const getDoctors = async (
  params = {}
) => {

  try {

    const res =
      await api.get(
        "/doctor/list",
        {
          params
        }
      );

    return (
      res.data?.data || []
    );

  } catch (error) {

    console.error(
      "GET DOCTORS ERROR:",
      error
    );

    throw error;
  }
};


// ======================================================
// ✅ GET SINGLE DOCTOR
// ======================================================

export const getDoctorById = async (
  doctorId
) => {

  try {

    const res =
      await api.get(
        `/doctor/${doctorId}`
      );

    return (
      res.data?.data || null
    );

  } catch (error) {

    console.error(
      "GET DOCTOR BY ID ERROR:",
      error
    );

    throw error;
  }
};


// ======================================================
// ✅ GET CURRENT DOCTOR PROFILE
// ======================================================

export const getMyDoctorProfile =
  async () => {

    try {

      const res =
        await api.get(
          "/doctor/me"
        );

      return (
        res.data?.data || null
      );

    } catch (error) {

      console.error(
        "GET MY DOCTOR PROFILE ERROR:",
        error
      );

      throw error;
    }
  };


// ======================================================
// ✅ UPDATE DOCTOR PROFILE
// ======================================================

export const updateDoctorProfile =
  async (payload) => {

    try {

      const res =
        await api.patch(
          "/doctor/me",
          payload
        );

      return (
        res.data || {}
      );

    } catch (error) {

      console.error(
        "UPDATE DOCTOR PROFILE ERROR:",
        error
      );

      throw error;
    }
  };


// ======================================================
// ✅ UPLOAD PROFILE IMAGE
// ======================================================

export const uploadDoctorProfileImage =
  async (formData) => {

    try {

      const res =
        await api.post(
          "/doctor/upload-image",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      return (
        res.data || {}
      );

    } catch (error) {

      console.error(
        "UPLOAD PROFILE IMAGE ERROR:",
        error
      );

      throw error;
    }
  };


// ======================================================
// ✅ GET DOCTOR AVAILABILITY
// ======================================================

export const getDoctorAvailability =
  async (
    doctorId,
    date
  ) => {

    try {

      const res =
        await api.get(
          `/appointment/slots/${doctorId}`,
          {
            params: { date }
          }
        );

      return (
        res.data || {}
      );

    } catch (error) {

      console.error(
        "GET AVAILABILITY ERROR:",
        error
      );

      throw error;
    }
  };
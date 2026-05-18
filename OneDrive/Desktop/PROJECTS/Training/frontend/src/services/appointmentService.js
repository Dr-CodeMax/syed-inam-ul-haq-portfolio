// ======================================================
// FILE: src/services/appointmentService.js
// ======================================================

import api from "./api";


// ======================================================
// GET APPOINTMENTS
// ======================================================

export const getAppointments =
  async (params = {}) => {

    // ==================================================
    // ADMIN
    // ==================================================

    if (
      params.role === "admin"
    ) {

      const response =
        await api.get(
          "/admin/appointments"
        );

      return response.data;

    }


    // ==================================================
    // DOCTOR
    // ==================================================

    if (
      params.role === "doctor"
    ) {

      const response =
        await api.get(
          "/appointment/doctor"
        );

      return response.data;

    }


    // ==================================================
    // PATIENT
    // ==================================================

    const response =
      await api.get(
        "/appointment/my"
      );

    return response.data;

  };


// ======================================================
// GET SINGLE APPOINTMENT
// ======================================================

export const getAppointmentById =
  async (id) => {

    const response =
      await api.get(
        `/appointment/${id}`
      );

    return response.data;

  };


// ======================================================
// CREATE APPOINTMENT
// ======================================================

export const createAppointment =
  async (data) => {

    const response =
      await api.post(
        "/appointment/book",
        data
      );

    return response.data;

  };


// ======================================================
// UPDATE APPOINTMENT
// ======================================================

export const updateAppointment =
  async (
    id,
    data
  ) => {

    const response =
      await api.put(
        `/appointment/status/${id}`,
        data
      );

    return response.data;

  };


// ======================================================
// CANCEL APPOINTMENT
// ======================================================

export const cancelAppointment =
  async (id) => {

    const response =
      await api.put(
        `/appointment/cancel/${id}`
      );

    return response.data;

  };


// ======================================================
// DELETE APPOINTMENT
// ======================================================

export const deleteAppointment =
  async (id) => {

    const response =
      await api.delete(
        `/appointment/${id}`
      );

    return response.data;

  };

// ======================================================
// FILE: src/services/dashboardService.js
// ======================================================

import api from "./api";


// ======================================================
// ADMIN DASHBOARD
// ======================================================

export const getAdminDashboard =
  async () => {

    const response =
      await api.get(
        "/admin/dashboard"
      );

    return response.data;

  };


// ======================================================
// DOCTOR DASHBOARD
// ======================================================

export const getDoctorDashboard =
  async () => {

    const response =
      await api.get(
        "/doctor/dashboard"
      );

    return response.data;

  };


// ======================================================
// PATIENT DASHBOARD
// ======================================================

export const getPatientDashboard =
  async () => {

    const response =
      await api.get(
        "/dashboard/patient"
      );

    return response.data;

  };

// =========================================================
// ✅ adminApi.js
// =========================================================

import api from "./axios";


// =========================================================
// ✅ GET ALL USERS
// =========================================================

export const getAllUsers = async () => {

    const response = await api.get(
        "/admin/users"
    );

    return response.data;
};


// =========================================================
// ✅ GET ALL DOCTORS
// =========================================================

export const getAllDoctors = async () => {

    const response = await api.get(
        "/admin/doctors"
    );

    return response.data;
};


// =========================================================
// ✅ GET ALL APPOINTMENTS
// =========================================================

export const getAllAppointments = async () => {

    const response = await api.get(
        "/admin/appointments"
    );

    return response.data;
};


// =========================================================
// ✅ APPROVE DOCTOR
// =========================================================

export const approveDoctor = async (
    doctorId
) => {

    const response = await api.put(
        `/admin/doctor/${doctorId}/approve`
    );

    return response.data;
};


// =========================================================
// ✅ REJECT DOCTOR
// =========================================================

export const rejectDoctor = async (
    doctorId
) => {

    const response = await api.put(
        `/admin/doctor/${doctorId}/reject`
    );

    return response.data;
};


// =========================================================
// ✅ SUSPEND DOCTOR
// =========================================================

export const suspendDoctor = async (
    doctorId
) => {

    const response = await api.put(
        `/admin/doctor/${doctorId}/suspend`
    );

    return response.data;
};


// =========================================================
// ✅ REACTIVATE DOCTOR
// =========================================================

export const reactivateDoctor = async (
    doctorId
) => {

    const response = await api.put(
        `/admin/doctor/${doctorId}/reactivate`
    );

    return response.data;
};
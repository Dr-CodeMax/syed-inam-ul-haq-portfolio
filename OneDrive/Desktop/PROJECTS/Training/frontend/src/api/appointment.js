import api from "./axios";
import { formatDateLocal } from "../utils/date";

/**
 * 📅 GET AVAILABLE SLOTS (TIMEZONE SAFE)
 */
export const getAvailableSlots = async (doctorId, date) => {
  try {
    const formattedDate = formatDateLocal(date);

    const res = await api.get(
      `/appointment/slots/${doctorId}?date=${formattedDate}`
    );

    return res.data;
  } catch (error) {
    console.error("GET AVAILABLE SLOTS ERROR:", error);
    throw error;
  }
};

/**
 * 📅 CREATE APPOINTMENT
 * (Aligned with your backend: /appointment/book)
 */
export const createAppointment = async (data) => {
  try {
    const res = await api.post("/appointment/book", data);
    return res.data;
  } catch (error) {
    console.error("CREATE APPOINTMENT ERROR:", error);
    throw error;
  }
};

/**
 * 📅 GET MY APPOINTMENTS
 */
export const getMyAppointments = async () => {
  try {
    const res = await api.get("/appointment/my");
    return res.data;
  } catch (error) {
    console.error("GET MY APPOINTMENTS ERROR:", error);
    throw error;
  }
};
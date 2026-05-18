import api from "./axios";

export const getAvailability = (doctorId) => {
  return api.get(`/availability/${doctorId}`);
};
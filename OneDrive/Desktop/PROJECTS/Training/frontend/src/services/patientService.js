import api from "./api";

export const getPatients = async () => {
  const res = await api.get("/admin/patients");
  return res.data;
};
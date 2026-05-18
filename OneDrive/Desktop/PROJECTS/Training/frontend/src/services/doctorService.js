import api from "./api";

const normalizeDoctor = (doctor = {}) => ({
  id: doctor.id,
  user_id: doctor.user_id,
  name: doctor.name || "",
  email: doctor.email || "",
  phone: doctor.phone || "",
  address: doctor.address || "",
  city: doctor.city || "",
  specialization: doctor.specialization || "",
  experience: Number(doctor.experience || 0),
  consultation_fee: Number(
    doctor.consultation_fee ??
      doctor.consultationFee ??
      0
  ),
  consultationFee: Number(
    doctor.consultationFee ??
      doctor.consultation_fee ??
      0
  ),
  qualification: doctor.qualification || "",
  hospital_name: doctor.hospital_name || "",
  license_number: doctor.license_number || "",
  bio: doctor.bio || "",
  profile_image:
    doctor.profile_image || doctor.profileImage || "",
  profileImage:
    doctor.profileImage || doctor.profile_image || "",
  mail_email: doctor.mail_email || "",
  status: doctor.status || "APPROVED",
  is_online: Boolean(doctor.is_online),
  accepts_emergency: Boolean(
    doctor.accepts_emergency
  ),
  moderation_note: doctor.moderation_note || "",
  appointmentsCount:
    doctor.appointmentsCount ??
    doctor.appointments_count ??
    0,
  is_verified: Boolean(doctor.is_verified),
  created_at: doctor.created_at || null,
  updated_at: doctor.updated_at || null,
});

const trimOptional = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
};

export const buildDoctorPayload = (
  values,
  { isEdit = false } = {}
) => {
  const payload = {
    name: values.name.trim(),
    email: values.email.trim(),
    city: trimOptional(values.city),
    phone: trimOptional(values.phone),
    address: trimOptional(values.address),
    profile_image: trimOptional(
      values.profile_image
    ),
    specialization: values.specialization.trim(),
    experience: Number(values.experience || 0),
    consultation_fee: Number(
      values.consultation_fee || 0
    ),
    qualification: values.qualification.trim(),
    hospital_name: trimOptional(
      values.hospital_name
    ),
    license_number:
      values.license_number.trim(),
    bio: trimOptional(values.bio),
    mail_email: trimOptional(values.mail_email),
    mail_password: trimOptional(
      values.mail_password
    ),
    status: values.status,
    is_online: Boolean(values.is_online),
    accepts_emergency: Boolean(
      values.accepts_emergency
    ),
    moderation_note: trimOptional(
      values.moderation_note
    ),
  };

  if (!isEdit || values.password?.trim()) {
    payload.password = values.password.trim();
  }

  if (isEdit) {
    return Object.fromEntries(
      Object.entries(payload).filter(
        ([, value]) => value !== undefined
      )
    );
  }

  return payload;
};

export const getDoctors = async () => {
  const response = await api.get("/admin/doctors");

  return {
    ...response.data,
    data: (response.data?.data || []).map(
      normalizeDoctor
    ),
  };
};

export const getDoctorById = async (id) => {
  const response = await api.get(`/admin/doctors/${id}`);

  return {
    ...response.data,
    data: normalizeDoctor(response.data?.data),
  };
};

export const getDoctorPatients = async () => {
  const response = await api.get("/doctor/patients");
  return response.data;
};

export const createDoctor = async (payload) => {
  const response = await api.post("/admin/doctors", payload);

  return {
    ...response.data,
    data: normalizeDoctor(response.data?.data),
  };
};

export const updateDoctor = async (id, payload) => {
  const response = await api.put(
    `/admin/doctors/${id}`,
    payload
  );

  return {
    ...response.data,
    data: normalizeDoctor(response.data?.data),
  };
};

export const deleteDoctor = async (id) => {
  const response = await api.delete(`/admin/doctors/${id}`);
  return response.data;
};

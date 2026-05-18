import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Loader2 } from "lucide-react";

import { buildDoctorPayload } from "../../services/doctorService";

const specializations = [
  "Cardiologist",
  "Dermatologist",
  "Neurologist",
  "Orthopedic",
  "Pediatrician",
  "Psychiatrist",
  "ENT",
  "General Physician",
  "Gynecologist",
  "Urologist",
  "Oncologist",
];

const statusOptions = [
  "APPROVED",
  "PENDING",
  "SUSPENDED",
  "REJECTED",
];

const defaultValues = {
  name: "",
  email: "",
  password: "",
  city: "",
  phone: "",
  address: "",
  profile_image: "",
  specialization: "",
  experience: 0,
  consultation_fee: 0,
  qualification: "",
  hospital_name: "",
  license_number: "",
  bio: "",
  mail_email: "",
  mail_password: "",
  status: "APPROVED",
  is_online: false,
  accepts_emergency: false,
  moderation_note: "",
};

const DoctorForm = ({
  initialData = null,
  onSubmit,
  loading = false,
  submitText = "Save Doctor",
  readOnly = false,
}) => {
  const [submitError, setSubmitError] = useState("");

  const {
    control,
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const profileImage = useWatch({
    control,
    name: "profile_image",
  });

  useEffect(() => {
    if (!initialData) {
      reset(defaultValues);
      return;
    }

    reset({
      ...defaultValues,
      name: initialData.name || "",
      email: initialData.email || "",
      city: initialData.city || "",
      phone: initialData.phone || "",
      address: initialData.address || "",
      profile_image:
        initialData.profile_image ||
        initialData.profileImage ||
        "",
      specialization:
        initialData.specialization || "",
      experience: initialData.experience ?? 0,
      consultation_fee:
        initialData.consultation_fee ??
        initialData.consultationFee ??
        0,
      qualification:
        initialData.qualification || "",
      hospital_name:
        initialData.hospital_name || "",
      license_number:
        initialData.license_number || "",
      bio: initialData.bio || "",
      mail_email: initialData.mail_email || "",
      mail_password: "",
      status: initialData.status || "APPROVED",
      is_online: Boolean(initialData.is_online),
      accepts_emergency: Boolean(
        initialData.accepts_emergency
      ),
      moderation_note:
        initialData.moderation_note || "",
      password: "",
    });
  }, [initialData, reset]);

  const handleFormSubmit = async (values) => {
    try {
      setSubmitError("");
      const payload = buildDoctorPayload(values, {
        isEdit: Boolean(initialData?.id),
      });
      await onSubmit(payload);
    } catch (error) {
      setSubmitError(
        error?.response?.data?.detail ||
          error?.response?.data?.message ||
          "Unable to save doctor."
      );
      throw error;
    }
  };

  const isEditMode = Boolean(initialData?.id);

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-8"
    >
      <div className="rounded-2xl border bg-white p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">
              Full Name
            </label>
            <input
              type="text"
              disabled={readOnly}
              className="mt-2 w-full rounded-xl border px-4 py-3"
              {...register("name", {
                required: "Name is required",
              })}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              disabled={readOnly}
              className="mt-2 w-full rounded-xl border px-4 py-3"
              {...register("email", {
                required: "Email is required",
              })}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">
              {isEditMode
                ? "Reset Password"
                : "Password"}
            </label>
            <input
              type="password"
              disabled={readOnly}
              className="mt-2 w-full rounded-xl border px-4 py-3"
              placeholder={
                isEditMode
                  ? "Leave blank to keep current password"
                  : "Minimum 6 characters"
              }
              {...register("password", {
                required: isEditMode
                  ? false
                  : "Password is required",
                minLength: {
                  value: 6,
                  message:
                    "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">
              Phone
            </label>
            <input
              type="text"
              disabled={readOnly}
              className="mt-2 w-full rounded-xl border px-4 py-3"
              {...register("phone")}
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              City
            </label>
            <input
              type="text"
              disabled={readOnly}
              className="mt-2 w-full rounded-xl border px-4 py-3"
              {...register("city")}
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Address
            </label>
            <input
              type="text"
              disabled={readOnly}
              className="mt-2 w-full rounded-xl border px-4 py-3"
              {...register("address")}
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="text-sm font-medium">
              Profile Image URL
            </label>
            <input
              type="url"
              disabled={readOnly}
              className="mt-2 w-full rounded-xl border px-4 py-3"
              placeholder="https://example.com/doctor.jpg"
              {...register("profile_image")}
            />
            {profileImage ? (
              <div className="mt-4 flex items-center gap-4">
                <img
                  src={profileImage}
                  alt="Doctor preview"
                  className="h-20 w-20 rounded-2xl border object-cover"
                />
                <p className="text-sm text-slate-500">
                  Image preview from the current URL
                </p>
              </div>
            ) : null}
          </div>

          <div>
            <label className="text-sm font-medium">
              Specialization
            </label>
            <select
              disabled={readOnly}
              className="mt-2 w-full rounded-xl border px-4 py-3"
              {...register("specialization", {
                required:
                  "Specialization is required",
              })}
            >
              <option value="">
                Select specialization
              </option>
              {specializations.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            {errors.specialization && (
              <p className="mt-1 text-sm text-red-500">
                {errors.specialization.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">
              Qualification
            </label>
            <input
              type="text"
              disabled={readOnly}
              className="mt-2 w-full rounded-xl border px-4 py-3"
              {...register("qualification", {
                required:
                  "Qualification is required",
              })}
            />
            {errors.qualification && (
              <p className="mt-1 text-sm text-red-500">
                {errors.qualification.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">
              Experience
            </label>
            <input
              type="number"
              disabled={readOnly}
              className="mt-2 w-full rounded-xl border px-4 py-3"
              {...register("experience", {
                valueAsNumber: true,
                min: {
                  value: 0,
                  message:
                    "Experience cannot be negative",
                },
              })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Consultation Fee
            </label>
            <input
              type="number"
              step="0.01"
              disabled={readOnly}
              className="mt-2 w-full rounded-xl border px-4 py-3"
              {...register("consultation_fee", {
                valueAsNumber: true,
                min: {
                  value: 0,
                  message:
                    "Fee cannot be negative",
                },
              })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Hospital Name
            </label>
            <input
              type="text"
              disabled={readOnly}
              className="mt-2 w-full rounded-xl border px-4 py-3"
              {...register("hospital_name")}
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              License Number
            </label>
            <input
              type="text"
              disabled={readOnly}
              className="mt-2 w-full rounded-xl border px-4 py-3"
              {...register("license_number", {
                required:
                  "License number is required",
              })}
            />
            {errors.license_number && (
              <p className="mt-1 text-sm text-red-500">
                {errors.license_number.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium">
              Bio
            </label>
            <textarea
              rows="4"
              disabled={readOnly}
              className="mt-2 w-full rounded-xl border px-4 py-3"
              {...register("bio")}
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">
              Mail Email
            </label>
            <input
              type="email"
              disabled={readOnly}
              className="mt-2 w-full rounded-xl border px-4 py-3"
              {...register("mail_email")}
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Mail Password
            </label>
            <input
              type="password"
              disabled={readOnly}
              className="mt-2 w-full rounded-xl border px-4 py-3"
              placeholder="Optional SMTP/app password"
              {...register("mail_password")}
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Status
            </label>
            <select
              disabled={readOnly}
              className="mt-2 w-full rounded-xl border px-4 py-3"
              {...register("status")}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium">
              Moderation Note
            </label>
            <textarea
              rows="3"
              disabled={readOnly}
              className="mt-2 w-full rounded-xl border px-4 py-3"
              {...register("moderation_note")}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 md:flex-row">
          <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              disabled={readOnly}
              className="h-4 w-4"
              {...register("is_online")}
            />
            Doctor is online
          </label>

          <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              disabled={readOnly}
              className="h-4 w-4"
              {...register("accepts_emergency")}
            />
            Accepts emergency cases
          </label>
        </div>
      </div>

      {submitError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </div>
      ) : null}

      {!readOnly ? (
        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-white disabled:opacity-60 md:w-auto"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Processing...
            </>
          ) : (
            submitText
          )}
        </button>
      ) : null}
    </form>
  );
};

export default DoctorForm;

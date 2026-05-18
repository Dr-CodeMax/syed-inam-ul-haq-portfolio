import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  Bell,
  KeyRound,
  Lock,
  Save,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import SectionHeader from "../../components/ui/SectionHeader";
import PageLoader from "../../components/ui/PageLoader";

const preferencesKey = "medbook_settings_preferences";

const SettingsPage = () => {
  const {
    user,
    loading,
    updatePassword,
  } = useAuth();

  const [preferences, setPreferences] = useState({
    compactMode: false,
    appointmentReminders: true,
    securityAlerts: true,
  });

  const {
    register,
    reset,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  useEffect(() => {
    const storedPreferences =
      localStorage.getItem(preferencesKey);

    if (!storedPreferences) {
      return;
    }

    try {
      setPreferences(
        JSON.parse(storedPreferences)
      );
    } catch {
      localStorage.removeItem(preferencesKey);
    }
  }, []);

  const handlePasswordSubmit = async (values) => {
    if (values.new_password !== values.confirm_password) {
      toast.error("New passwords do not match");
      return;
    }

    const response = await updatePassword({
      current_password: values.current_password,
      new_password: values.new_password,
    });

    toast.success(
      response?.message ||
        "Password updated successfully"
    );
    reset();
  };

  const savePreferences = () => {
    localStorage.setItem(
      preferencesKey,
      JSON.stringify(preferences)
    );

    toast.success(
      "Preferences saved on this device"
    );
  };

  if (loading) {
    return (
      <PageLoader
        title="Loading settings"
        subtitle="Preparing your account controls..."
      />
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <SectionHeader
        title="Settings"
        subtitle="Control password, account safety, and workspace preferences from one secure panel."
      />

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.2fr,0.8fr]">
        <form
          onSubmit={handleSubmit(handlePasswordSubmit)}
          className="enterprise-card space-y-6 p-6"
        >
          <div className="flex items-center gap-3">
            <KeyRound size={18} className="text-primary" />
            <h2 className="text-lg font-semibold text-slate-800">
              Password & Security
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Current Password
              </label>
              <input
                type="password"
                className="mt-2 w-full rounded-2xl border px-4 py-3"
                {...register("current_password", {
                  required:
                    "Current password is required",
                })}
              />
              {errors.current_password ? (
                <p className="mt-1 text-sm text-red-500">
                  {errors.current_password.message}
                </p>
              ) : null}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                New Password
              </label>
              <input
                type="password"
                className="mt-2 w-full rounded-2xl border px-4 py-3"
                {...register("new_password", {
                  required:
                    "New password is required",
                  minLength: {
                    value: 6,
                    message:
                      "Use at least 6 characters",
                  },
                })}
              />
              {errors.new_password ? (
                <p className="mt-1 text-sm text-red-500">
                  {errors.new_password.message}
                </p>
              ) : null}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Confirm New Password
              </label>
              <input
                type="password"
                className="mt-2 w-full rounded-2xl border px-4 py-3"
                {...register("confirm_password", {
                  required:
                    "Please confirm the new password",
                })}
              />
              {errors.confirm_password ? (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirm_password.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
            <p className="flex items-center gap-2">
              <ShieldCheck size={15} />
              Signed in as `{user?.role}` with JWT-protected account access.
            </p>
            <p className="mt-2 flex items-center gap-2">
              <Lock size={15} />
              Changing your password does not modify any other role or profile permissions.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 font-semibold text-white"
          >
            <Save size={16} />
            {isSubmitting
              ? "Updating..."
              : "Update Password"}
          </button>
        </form>

        <div className="space-y-6">
          <div className="enterprise-card p-6">
            <div className="flex items-center gap-3">
              <Smartphone
                size={18}
                className="text-primary"
              />
              <h2 className="text-lg font-semibold text-slate-800">
                Workspace Preferences
              </h2>
            </div>

            <div className="mt-5 space-y-4">
              <label className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 px-4 py-4">
                <div>
                  <p className="font-medium text-slate-800">
                    Compact dashboard mode
                  </p>
                  <p className="text-sm text-slate-500">
                    Reduce spacing in account surfaces on this device.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.compactMode}
                  onChange={(event) =>
                    setPreferences((current) => ({
                      ...current,
                      compactMode: event.target.checked,
                    }))
                  }
                />
              </label>

              <label className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 px-4 py-4">
                <div>
                  <p className="font-medium text-slate-800">
                    Appointment reminders
                  </p>
                  <p className="text-sm text-slate-500">
                    Placeholder preference for future messaging integration.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={
                    preferences.appointmentReminders
                  }
                  onChange={(event) =>
                    setPreferences((current) => ({
                      ...current,
                      appointmentReminders:
                        event.target.checked,
                    }))
                  }
                />
              </label>

              <label className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 px-4 py-4">
                <div>
                  <p className="font-medium text-slate-800">
                    Security alerts
                  </p>
                  <p className="text-sm text-slate-500">
                    Keep local reminders enabled for important account changes.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={
                    preferences.securityAlerts
                  }
                  onChange={(event) =>
                    setPreferences((current) => ({
                      ...current,
                      securityAlerts:
                        event.target.checked,
                    }))
                  }
                />
              </label>
            </div>

            <button
              type="button"
              onClick={savePreferences}
              className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700"
            >
              <Save size={16} />
              Save Preferences
            </button>
          </div>

          <div className="enterprise-card p-6">
            <div className="flex items-center gap-3">
              <Bell size={18} className="text-primary" />
              <h2 className="text-lg font-semibold text-slate-800">
                Notification Preferences
              </h2>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-500">
              Email, SMS, and in-app notification routing is reserved for the next messaging phase. This card stays visible so the settings IA is complete now without introducing fake backend behavior.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

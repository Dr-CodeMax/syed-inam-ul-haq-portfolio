export const getDashboardPath = (role) => {
  if (role === "ADMIN") {
    return "/admin/dashboard";
  }

  if (role === "DOCTOR") {
    return "/doctor/dashboard";
  }

  return "/patient/dashboard";
};

export const getProfilePath = (role) => {
  if (role === "ADMIN") {
    return "/admin/profile";
  }

  if (role === "DOCTOR") {
    return "/doctor/profile";
  }

  return "/patient/profile";
};

export const getSettingsPath = (role) => {
  if (role === "ADMIN") {
    return "/admin/settings";
  }

  if (role === "DOCTOR") {
    return "/doctor/settings";
  }

  return "/patient/settings";
};

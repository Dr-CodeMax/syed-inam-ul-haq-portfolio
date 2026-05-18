// =====================================================
// ✅ ROLE-BASED NAVIGATION CONFIG
// =====================================================

export const navigationConfig = {

  // ===================================================
  // ✅ ADMIN NAVIGATION
  // ===================================================

  ADMIN: [

    {
      label: "Dashboard",
      path: "/admin/dashboard",
    },

    {
      label: "Users",
      path: "/admin/users",
    },

    {
      label: "Doctors",
      path: "/admin/doctors",
    },

    {
      label: "Appointments",
      path: "/admin/appointments",
    },

  ],


  // ===================================================
  // ✅ DOCTOR NAVIGATION
  // ===================================================

  DOCTOR: [

    {
      label: "Dashboard",
      path: "/doctor/dashboard",
    },

    {
      label: "Appointments",
      path: "/doctor/appointments",
    },

  ],


  // ===================================================
  // ✅ PATIENT NAVIGATION
  // ===================================================

  PATIENT: [

    {
      label: "Doctors",
      path: "/patient/doctors",
    },

    {
      label: "My Appointments",
      path: "/patient/appointments",
    },

  ],

};
// =====================================================
// FILE: src/constants/dashboardLinks.js
// =====================================================

import {
  LayoutDashboard,
  Stethoscope,
  Users,
  CalendarDays,
  ClipboardList,
} from "lucide-react";


// =====================================================
// ENTERPRISE ROLE-BASED SIDEBAR LINKS
// =====================================================

export const dashboardLinks = {

  // ===================================================
  // ADMIN
  // ===================================================

  ADMIN: [

    {
      label:
        "Dashboard",

      path:
        "/admin/dashboard",

      icon:
        LayoutDashboard,
    },

    {
      label:
        "Doctors",

      path:
        "/admin/doctors",

      icon:
        Stethoscope,
    },

    {
      label:
        "Users",

      path:
        "/admin/users",

      icon:
        Users,
    },

    {
      label:
        "Appointments",

      path:
        "/admin/appointments",

      icon:
        CalendarDays,
    },

  ],


  // ===================================================
  // DOCTOR
  // ===================================================

  DOCTOR: [

    {
      label:
        "Dashboard",

      path:
        "/doctor/dashboard",

      icon:
        LayoutDashboard,
    },

    {
      label:
        "Appointments",

      path:
        "/doctor/appointments",

      icon:
        ClipboardList,
    },

    {
      label:
        "Patients",

      path:
        "/doctor/patients",

      icon:
        Users,
    },

  ],


  // ===================================================
  // PATIENT
  // ===================================================

  PATIENT: [

    {
      label:
        "Dashboard",

      path:
        "/patient/dashboard",

      icon:
        LayoutDashboard,
    },

    {
      label:
        "Appointments",

      path:
        "/patient/appointments",

      icon:
        CalendarDays,
    },

  ],

};

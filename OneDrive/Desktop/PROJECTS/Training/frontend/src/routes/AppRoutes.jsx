// =====================================================
// ✅ AppRoutes.jsx
// =====================================================

import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";


// =====================================================
// ✅ AUTH
// =====================================================

import Login from "../pages/Login";

import Register from "../pages/Register";

import Unauthorized from "../pages/Unauthorized";


// =====================================================
// ✅ PATIENT
// =====================================================

import Doctors from "../pages/patient/Doctors";

import DoctorProfile from "../pages/patient/DoctorProfile";

import BookAppointment from "../pages/patient/BookAppointment";

import Appointments from "../pages/patient/Appointments";

import BookingSuccessPage from "../pages/patient/BookingSuccessPage";

import PatientDashboard from "../pages/patient/PatientDashboard";
import ProfilePage from "../pages/account/ProfilePage";
import SettingsPage from "../pages/account/SettingsPage";


// =====================================================
// ✅ DOCTOR
// =====================================================

import DoctorDashboard
from "../pages/doctor/DoctorDashboard";

import DoctorAppointments
from "../pages/doctor/DoctorAppointments";

import DoctorPatients
from "../pages/doctor/DoctorPatients";


// =====================================================
// ✅ ADMIN
// =====================================================

import AdminDashboard
from "../pages/admin/AdminDashboard";

import AdminUsers
from "../pages/admin/AdminUsers";

import AdminDoctorsPage
from "../pages/admin/AdminDoctorsPage";

import AdminAppointments
from "../pages/admin/AdminAppointments";

import CreateDoctorPage
from "../pages/admin/CreateDoctorPage";

import EditDoctorPage
from "../pages/admin/EditDoctorPage";

import ViewDoctorPage
from "../pages/admin/ViewDoctorPage";


// =====================================================
// ✅ LAYOUTS
// =====================================================

import PatientLayout
from "../components/layouts/PatientLayout";

import DashboardLayout
from "../components/dashboard/DashboardLayout";


// =====================================================
// ✅ ROUTE GUARDS
// =====================================================

import ProtectedRoute
from "./ProtectedRoute";

import PublicRoute
from "./PublicRoute";


// =====================================================
// ✅ ROUTES
// =====================================================

const AppRoutes = () => {

  return (

    <Routes>

      {/* ================================================= */}
      {/* PUBLIC ROUTES */}
      {/* ================================================= */}

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      <Route
        path="/unauthorized"
        element={<Unauthorized />}
      />

      {/* ================================================= */}
      {/* PUBLIC MARKETPLACE */}
      {/* ================================================= */}

      <Route
        path="/"
        element={
          <PatientLayout>
            <Doctors />
          </PatientLayout>
        }
      />

      <Route
        path="/doctors"
        element={
          <PatientLayout>
            <Doctors />
          </PatientLayout>
        }
      />

      <Route
        path="/doctor/:id"
        element={
          <PatientLayout>
            <DoctorProfile />
          </PatientLayout>
        }
      />

      {/* ================================================= */}
      {/* PATIENT */}
      {/* ================================================= */}

      <Route
        path="/patient/dashboard"
        element={
          <ProtectedRoute
            allowedRoles={["PATIENT"]}
          >
            <DashboardLayout role="PATIENT">
              <PatientDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/booking"
        element={
          <ProtectedRoute
            allowedRoles={["PATIENT"]}
          >
            <PatientLayout>
              <BookAppointment />
            </PatientLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/appointments"
        element={
          <ProtectedRoute
            allowedRoles={["PATIENT"]}
          >
            <PatientLayout>
              <Appointments />
            </PatientLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/booking-success"
        element={
          <ProtectedRoute
            allowedRoles={["PATIENT"]}
          >
            <PatientLayout>
              <BookingSuccessPage />
            </PatientLayout>
          </ProtectedRoute>
        }
      />

      {/* ================================================= */}
      {/* DOCTOR */}
      {/* ================================================= */}

      <Route
        path="/doctor/dashboard"
        element={
          <ProtectedRoute
            allowedRoles={["DOCTOR"]}
          >
            <DashboardLayout role="DOCTOR">
              <DoctorDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor/appointments"
        element={
          <ProtectedRoute
            allowedRoles={["DOCTOR"]}
          >
            <DashboardLayout role="DOCTOR">
              <DoctorAppointments />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/profile"
        element={
          <ProtectedRoute
            allowedRoles={["PATIENT"]}
          >
            <DashboardLayout role="PATIENT">
              <ProfilePage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/settings"
        element={
          <ProtectedRoute
            allowedRoles={["PATIENT"]}
          >
            <DashboardLayout role="PATIENT">
              <SettingsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor/patients"
        element={
          <ProtectedRoute
            allowedRoles={["DOCTOR"]}
          >
            <DashboardLayout role="DOCTOR">
              <DoctorPatients />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor/profile"
        element={
          <ProtectedRoute
            allowedRoles={["DOCTOR"]}
          >
            <DashboardLayout role="DOCTOR">
              <ProfilePage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor/settings"
        element={
          <ProtectedRoute
            allowedRoles={["DOCTOR"]}
          >
            <DashboardLayout role="DOCTOR">
              <SettingsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* ================================================= */}
      {/* ADMIN */}
      {/* ================================================= */}

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute
            allowedRoles={["ADMIN"]}
          >
            <DashboardLayout role="ADMIN">
              <AdminDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute
            allowedRoles={["ADMIN"]}
          >
            <DashboardLayout role="ADMIN">
              <AdminUsers />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/doctors"
        element={
          <ProtectedRoute
            allowedRoles={["ADMIN"]}
          >
            <DashboardLayout role="ADMIN">
              <AdminDoctorsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute
            allowedRoles={["ADMIN"]}
          >
            <DashboardLayout role="ADMIN">
              <ProfilePage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute
            allowedRoles={["ADMIN"]}
          >
            <DashboardLayout role="ADMIN">
              <SettingsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/doctors/create"
        element={
          <ProtectedRoute
            allowedRoles={["ADMIN"]}
          >
            <DashboardLayout role="ADMIN">
              <CreateDoctorPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/doctors/:id/edit"
        element={
          <ProtectedRoute
            allowedRoles={["ADMIN"]}
          >
            <DashboardLayout role="ADMIN">
              <EditDoctorPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/doctors/:id"
        element={
          <ProtectedRoute
            allowedRoles={["ADMIN"]}
          >
            <DashboardLayout role="ADMIN">
              <ViewDoctorPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/appointments"
        element={
          <ProtectedRoute
            allowedRoles={["ADMIN"]}
          >
            <DashboardLayout role="ADMIN">
              <AdminAppointments />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* ================================================= */}
      {/* FALLBACK */}
      {/* ================================================= */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
};

export default AppRoutes;

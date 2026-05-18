// =====================================================
// FILE: src/routes/ProtectedRoute.jsx
// =====================================================

import {
  Navigate,
  useLocation,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

import PageLoader
  from "../components/ui/PageLoader";


// =====================================================
// PROTECTED ROUTE
// =====================================================

const ProtectedRoute = ({
  children,
  allowedRoles = [],
}) => {

  const {
    user,
    loading,
  } = useAuth();

  const location =
    useLocation();


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return <PageLoader />;

  }


  // =====================================================
  // NOT AUTHENTICATED
  // =====================================================

  if (!user) {

    return (

      <Navigate
        to="/login"
        state={{
          from: location,
        }}
        replace
      />

    );

  }


  // =====================================================
  // ROLE VALIDATION
  // =====================================================

  if (

    allowedRoles.length > 0 &&

    !allowedRoles.includes(
      user?.role
    )

  ) {

    // ===============================================
    // ADMIN
    // ===============================================

    if (
      user?.role === "ADMIN"
    ) {

      return (

        <Navigate
          to="/admin/dashboard"
          replace
        />

      );

    }


    // ===============================================
    // DOCTOR
    // ===============================================

    if (
      user?.role === "DOCTOR"
    ) {

      return (

        <Navigate
          to="/doctor/dashboard"
          replace
        />

      );

    }


    // ===============================================
    // PATIENT
    // ===============================================

    return (

      <Navigate
        to="/patient/dashboard"
        replace
      />

    );

  }


  // =====================================================
  // ACCESS GRANTED
  // =====================================================

  return children;

};

export default ProtectedRoute;
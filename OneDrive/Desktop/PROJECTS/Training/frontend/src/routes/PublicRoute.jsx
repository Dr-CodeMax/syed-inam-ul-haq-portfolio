// =====================================================
// ✅ ENTERPRISE PUBLIC ROUTE
// =====================================================

import {
  Navigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";


// =====================================================
// ✅ PUBLIC ROUTE
// =====================================================

const PublicRoute = ({
  children,
}) => {

  const {
    user,
    loading,
  } = useAuth();


  // =====================================================
  // ✅ LOADING
  // =====================================================

  if (loading) {

    return (

      <div
        className="
          min-h-screen

          flex
          items-center
          justify-center

          bg-gradient-to-br
          from-slate-100
          via-blue-50
          to-indigo-100
        "
      >

        <div
          className="
            enterprise-card

            px-8
            py-6
          "
        >

          <div
            className="
              flex
              items-center
              gap-4
            "
          >

            <div
              className="
                h-10
                w-10

                rounded-full

                border-4
                border-primary/20
                border-t-primary

                animate-spin
              "
            />

            <div>

              <h2
                className="
                  font-bold
                  text-slate-800
                "
              >

                Loading

              </h2>

              <p
                className="
                  mt-1

                  text-sm
                  text-slate-500
                "
              >

                Preparing application...

              </p>

            </div>

          </div>

        </div>

      </div>
    );
  }


  // =====================================================
  // ✅ ALREADY AUTHENTICATED
  // =====================================================

  if (user) {

    // ===============================================
    // ADMIN
    // ===============================================

    if (
      user.role === "ADMIN"
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
      user.role === "DOCTOR"
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
  // ✅ PUBLIC ACCESS
  // =====================================================

  return children;
};

export default PublicRoute;
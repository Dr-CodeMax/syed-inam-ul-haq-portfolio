import { useMemo } from "react";

import Navbar from "./navbar/Navbar";

import Sidebar
from "./sidebar/Sidebar";


// =====================================================
// ✅ APP LAYOUT
// =====================================================

const AppLayout = ({ children }) => {

  // =====================================================
  // ✅ GET USER FROM LOCAL STORAGE
  // =====================================================

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  // =====================================================
  // ✅ USER ROLE
  // =====================================================

  const role =
    user?.role || null;

  // =====================================================
  // ✅ SHOW SIDEBAR ONLY FOR DOCTORS
  // =====================================================

  const showSidebar =
    useMemo(() => {

      return role === "DOCTOR";

    }, [role]);


  return (

    <div
      className="
        min-h-screen
        flex
        bg-gray-100
      "
    >

      {/* ================================================= */}
      {/* ✅ SIDEBAR */}
      {/* ================================================= */}

      {showSidebar && (
        <Sidebar role={role} />
      )}


      {/* ================================================= */}
      {/* ✅ RIGHT SIDE */}
      {/* ================================================= */}

      <div
        className="
          flex-1
          flex
          flex-col
          min-w-0
        "
      >

        {/* ============================================= */}
        {/* ✅ NAVBAR */}
        {/* ============================================= */}

        <Navbar />


        {/* ============================================= */}
        {/* ✅ PAGE CONTENT */}
        {/* ============================================= */}

        <main
          className="
            flex-1
            p-6
          "
        >

          {children}

        </main>

      </div>

    </div>
  );
};

export default AppLayout;
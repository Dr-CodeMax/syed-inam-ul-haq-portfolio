// =====================================================
// ✅ ENTERPRISE DASHBOARD LAYOUT
// =====================================================

import {
  useState,
} from "react";

import Sidebar
from "../layouts/sidebar/Sidebar";

import TopNavbar
from "../layouts/TopNavbar";


// =====================================================
// ✅ DASHBOARD LAYOUT
// =====================================================

const DashboardLayout = ({
  role,
  children,
}) => {

  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);

  return (

    <div
      className="
        relative
        min-h-screen

        bg-gradient-to-br
        from-slate-100
        via-blue-50
        to-indigo-100
      "
    >

      {/* BACKGROUND GLOW */}

      <div
        className="
          fixed
          inset-0
          overflow-hidden
          pointer-events-none
        "
      >

        <div
          className="
            absolute
            top-[-150px]
            left-[-150px]

            h-[420px]
            w-[420px]

            rounded-full

            bg-blue-400/10

            blur-3xl
          "
        />

        <div
          className="
            absolute
            bottom-[-150px]
            right-[-150px]

            h-[420px]
            w-[420px]

            rounded-full

            bg-indigo-400/10

            blur-3xl
          "
        />

      </div>

      {/* SHELL */}

      <div
        className="
          relative
          z-10

          flex
          min-h-screen
        "
      >

        <Sidebar
          role={role}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div
          className="
            flex-1
            min-w-0

            flex
            flex-col
          "
        >

          <TopNavbar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />

          <main
            className="
              flex-1

              overflow-y-auto
              overflow-x-hidden

              p-6
            "
          >

            <div className="w-full">

              {children}

            </div>

          </main>

        </div>

      </div>

    </div>
  );
};

export default DashboardLayout;
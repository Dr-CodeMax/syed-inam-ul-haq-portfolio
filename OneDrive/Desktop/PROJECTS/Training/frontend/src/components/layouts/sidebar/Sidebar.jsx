// =====================================================
// ✅ ENTERPRISE ROLE-BASED SIDEBAR
// =====================================================

import {
  Link,
  useLocation,
} from "react-router-dom";

import {
  X,
  Shield,
  LayoutDashboard,
  Users,
  UserCheck,
  CalendarDays,
  Activity,
  Clock3,
  Settings,
  Headphones,
  FileText,
  HeartPulse,
  Stethoscope,
} from "lucide-react";

import { motion }
from "framer-motion";

import { dashboardLinks }
from "../../../config/dashboardLinks";


// =====================================================
// ✅ ICON MAP
// =====================================================

const iconMap = {

  Dashboard:
    LayoutDashboard,

  Doctors:
    UserCheck,

  Users:
    Users,

  Appointments:
    CalendarDays,

  Analytics:
    Activity,

  Availability:
    Clock3,

  Patients:
    Users,

  Settings:
    Settings,

  Support:
    Headphones,

  History:
    FileText,

  Health:
    HeartPulse,

  Profile:
    Stethoscope,
};


// =====================================================
// ✅ ROLE CONFIG
// =====================================================

const roleConfig = {

  ADMIN: {
    gradient:
      "from-red-500 to-orange-500",

    badge:
      "bg-red-500/10 border-red-500/20 text-red-300",
  },

  DOCTOR: {
    gradient:
      "from-blue-500 to-cyan-500",

    badge:
      "bg-blue-500/10 border-blue-500/20 text-blue-300",
  },

  PATIENT: {
    gradient:
      "from-emerald-500 to-teal-500",

    badge:
      "bg-emerald-500/10 border-emerald-500/20 text-emerald-300",
  },
};


// =====================================================
// ✅ SIDEBAR
// =====================================================

const Sidebar = ({
  role,
  sidebarOpen,
  setSidebarOpen,
}) => {

  const location =
    useLocation();

  const normalizedRole =
    role?.toUpperCase();

  const links =
    dashboardLinks[
      normalizedRole
    ] || [];

  const currentRole =
    roleConfig[
      normalizedRole
    ];

  return (

    <>

      {/* =============================================== */}
      {/* MOBILE OVERLAY */}
      {/* =============================================== */}

      {
        sidebarOpen && (

          <div
            onClick={() =>
              setSidebarOpen(false)
            }
            className="
              fixed
              inset-0

              bg-black/40
              backdrop-blur-sm

              z-40

              lg:hidden
            "
          />

        )
      }

      {/* =============================================== */}
      {/* SIDEBAR */}
      {/* =============================================== */}

      <aside
        className={`

          fixed
          lg:sticky

          top-0
          left-0

          h-screen
          w-72

          shrink-0

          bg-slate-950/95
          backdrop-blur-2xl

          border-r
          border-white/10

          text-white

          p-6

          flex
          flex-col

          z-50

          transform
          transition-all
          duration-300

          shadow-2xl

          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }

          lg:translate-x-0
        `}
      >

        {/* ============================================= */}
        {/* HEADER */}
        {/* ============================================= */}

        <div
          className="
            flex
            items-center
            justify-between

            mb-10
          "
        >

          <div>

            <h2
              className={`
                text-3xl
                font-black
                tracking-tight

                bg-gradient-to-r
                ${currentRole?.gradient}

                bg-clip-text
                text-transparent
              `}
            >

              MedBook

            </h2>

            <p
              className="
                text-slate-400
                text-sm
                mt-1
              "
            >

              Enterprise Healthcare

            </p>

          </div>

          <button
            onClick={() =>
              setSidebarOpen(false)
            }
            className="
              lg:hidden

              p-2

              rounded-xl

              hover:bg-slate-800

              transition
            "
          >

            <X size={20} />

          </button>

        </div>

        {/* ============================================= */}
        {/* ROLE PANEL */}
        {/* ============================================= */}

        <div
          className={`
            rounded-3xl

            border

            p-5

            mb-8

            ${currentRole?.badge}
          `}
        >

          <div
            className="
              flex
              items-center
              gap-4
            "
          >

            <div
              className={`
                h-14
                w-14

                rounded-2xl

                bg-gradient-to-br
                ${currentRole?.gradient}

                flex
                items-center
                justify-center

                shadow-lg
              `}
            >

              <Shield size={24} />

            </div>

            <div>

              <p
                className="
                  text-xs
                  uppercase
                  tracking-[0.25em]

                  text-slate-400
                "
              >

                Active Role

              </p>

              <h3
                className="
                  mt-1

                  text-lg
                  font-bold
                "
              >

                {normalizedRole}

              </h3>

            </div>

          </div>

        </div>

        {/* ============================================= */}
        {/* NAVIGATION */}
        {/* ============================================= */}

        <nav
          className="
            flex-1
            overflow-y-auto

            flex
            flex-col
            gap-3

            pr-1
          "
        >

          {links.map((link) => {

            const isActive =
              location.pathname ===
              link.path;

            const Icon =
              iconMap[
                link.label
              ];

            return (

              <motion.div
  key={link.path}

  whileHover={{
    scale: 1.02,
  }}

  transition={{
    duration: 0.18,
  }}

  className="
    will-change-transform
  "
>

                <Link
                  to={link.path}

                  onClick={() =>
                    setSidebarOpen(false)
                  }

                  className={`

                    group

                    relative

                    flex
                    items-center
                    gap-4

                    overflow-hidden

                    rounded-2xl

                    px-5
                    py-4

                    font-medium

                    transition-all
                    duration-300

                    ${
                      isActive

                        ? `
                          bg-gradient-to-r
                          ${currentRole?.gradient}

                          text-white

                          shadow-lg
                        `

                        : `
                          text-slate-300

                          hover:bg-white/5
                          hover:text-white
                        `
                    }
                  `}
                >

                  {/* ACTIVE GLOW */}

                  {
                    isActive && (

                      <div
                        className="
                          absolute
                          inset-0

                          bg-white/10

                          blur-2xl
                        "
                      />

                    )
                  }

                  {/* ICON */}

                  {
                    Icon && (

                      <Icon
                        size={20}
                        className="
                          relative
                          z-10
                        "
                      />

                    )
                  }

                  {/* LABEL */}

                  <span
                    className="
                      relative
                      z-10
                    "
                  >

                    {link.label}

                  </span>

                </Link>

              </motion.div>

            );

          })}

        </nav>

        {/* ============================================= */}
        {/* FOOTER */}
        {/* ============================================= */}

        <div
          className="
            mt-8
            pt-6

            border-t
            border-white/10
          "
        >

          <div
            className="
              rounded-3xl

              bg-white/5

              p-5
            "
          >

            <p
              className="
                text-sm
                font-medium
                text-slate-300
              "
            >

              Enterprise Healthcare Platform

            </p>

            <p
              className="
                mt-2

                text-xs
                leading-relaxed

                text-slate-500
              "
            >

              Real-time SaaS operations
              console with enterprise-grade
              dashboard architecture.

            </p>

          </div>

        </div>

      </aside>

    </>

  );
};

export default Sidebar;
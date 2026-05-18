import {
  useState,
  useRef,
  useEffect,
} from "react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  Menu,
  Bell,
  ChevronDown,
  LogOut,
  ShieldCheck,
  User,
  Settings,
  Activity,
  LayoutDashboard,
} from "lucide-react";

import { motion }
from "framer-motion";

import { useAuth }
from "../../context/AuthContext";


// =====================================================
// ✅ PAGE TITLES
// =====================================================

const pageTitles = {

  "/admin/dashboard":
    "Admin Dashboard",

  "/admin/users":
    "User Management",

  "/admin/doctors":
    "Doctor Management",

  "/admin/appointments":
    "Appointments",

  "/doctor/dashboard":
    "Doctor Dashboard",

  "/doctor/appointments":
    "Doctor Appointments",

  "/patient/dashboard":
    "Patient Dashboard",

  "/patient/appointments":
    "My Appointments",
};


// =====================================================
// ✅ TOP NAVBAR
// =====================================================

const TopNavbar = ({
  sidebarOpen,
  setSidebarOpen,
}) => {

  const {
    user,
    logout,
  } = useAuth();

  const navigate = useNavigate();

  const location = useLocation();

  const [
    dropdownOpen,
    setDropdownOpen,
  ] = useState(false);

  const dropdownRef =
    useRef(null);


  // =====================================================
  // ✅ CLOSE DROPDOWN
  // =====================================================

  useEffect(() => {

    const handleClickOutside = (
      event
    ) => {

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target
        )
      ) {

        setDropdownOpen(false);
      }

    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };

  }, []);


  // =====================================================
  // ✅ LOGOUT
  // =====================================================

  const handleLogout = () => {

    logout();

    navigate("/login");

  };


  // =====================================================
  // ✅ DASHBOARD NAVIGATION
  // =====================================================

  const handleDashboardNavigation = () => {

    if (
      user?.role === "ADMIN"
    ) {

      navigate(
        "/admin/dashboard"
      );

    } else if (
      user?.role === "DOCTOR"
    ) {

      navigate(
        "/doctor/dashboard"
      );

    } else {

      navigate(
        "/patient/dashboard"
      );
    }
  };


  // =====================================================
  // ✅ ROLE BADGE COLORS
  // =====================================================

  const roleStyles = {

    ADMIN:
      "bg-red-100 text-red-700 border-red-200",

    DOCTOR:
      "bg-blue-100 text-blue-700 border-blue-200",

    PATIENT:
      "bg-emerald-100 text-emerald-700 border-emerald-200",
  };


  // =====================================================
  // ✅ PAGE TITLE
  // =====================================================

  const currentTitle =
    pageTitles[
      location.pathname
    ] || "Dashboard";


  return (

    <header
      className="
        sticky
        top-0
        z-30

        border-b
        border-white/20

        bg-white/70
        backdrop-blur-2xl

        shadow-sm
      "
    >

      <div
        className="
          h-20

          px-4
          md:px-6

          flex
          items-center
          justify-between
        "
      >

        {/* =============================================== */}
        {/* ✅ LEFT */}
        {/* =============================================== */}

        <div
          className="
            flex
            items-center
            gap-4
          "
        >

          {/* MOBILE MENU */}

          <button
            onClick={() =>
              setSidebarOpen(
                !sidebarOpen
              )
            }
            className="
              lg:hidden

              p-2

              rounded-xl

              hover:bg-slate-100

              transition
            "
          >

            <Menu size={22} />

          </button>

          {/* TITLE */}

          <div>

            <h1
              className="
                text-2xl
                font-bold
                tracking-tight
                text-slate-800
              "
            >

              {currentTitle}

            </h1>

            <div
              className="
                hidden
                md:flex

                items-center
                gap-2

                mt-1
              "
            >

              <span
                className="
                  text-sm
                  text-slate-500
                "
              >
                Enterprise Healthcare
              </span>

              <span className="text-slate-300">
                •
              </span>

              <span
                className="
                  text-sm
                  text-primary
                  font-medium
                "
              >
                SaaS Platform
              </span>

            </div>

          </div>

        </div>

        {/* =============================================== */}
        {/* ✅ RIGHT */}
        {/* =============================================== */}

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          {/* DASHBOARD BUTTON */}

          <button
            onClick={
              handleDashboardNavigation
            }
            className="
              hidden
              md:flex

              items-center
              gap-2

              rounded-2xl

              border
              border-white/20

              bg-white/70
              backdrop-blur-xl

              px-4
              py-2.5

              font-semibold

              transition-all

              hover:bg-white
            "
          >

            <LayoutDashboard
              size={18}
            />

            Dashboard

          </button>

          {/* LIVE STATUS */}

          <div
            className="
              hidden
              md:flex

              items-center
              gap-2

              rounded-2xl

              border
              border-emerald-200

              bg-emerald-50

              px-4
              py-2.5
            "
          >

            <motion.div

              animate={{
                opacity: [1, 0.4, 1],
              }}

              transition={{
                repeat: Infinity,
                duration: 2,
              }}

              className="
                h-2
                w-2

                rounded-full

                bg-emerald-500
              "
            />

            <span
              className="
                text-sm
                font-semibold
                text-emerald-700
              "
            >

              System Live

            </span>

          </div>

          {/* NOTIFICATIONS */}

          <button
            className="
              relative

              flex
              items-center
              justify-center

              h-12
              w-12

              rounded-2xl

              border
              border-white/20

              bg-white/70
              backdrop-blur-xl

              transition-all

              hover:bg-white
            "
          >

            <Bell size={19} />

            <span
              className="
                absolute
                top-3
                right-3

                h-2
                w-2

                rounded-full

                bg-red-500
              "
            />

          </button>

          {/* PROFILE */}

          <div
            className="relative"
            ref={dropdownRef}
          >

            <button
              onClick={() =>
                setDropdownOpen(
                  !dropdownOpen
                )
              }
              className="
                flex
                items-center
                gap-3

                rounded-2xl

                border
                border-white/20

                bg-white/70
                backdrop-blur-xl

                px-3
                py-2

                transition-all

                hover:bg-white
              "
            >

              {/* AVATAR */}

              <div
                className="
                  h-11
                  w-11

                  rounded-2xl

                  bg-gradient-to-br
                  from-primary
                  to-secondary

                  flex
                  items-center
                  justify-center

                  text-white
                  font-bold
                "
              >

                {user?.name
                  ?.charAt(0)
                  ?.toUpperCase()}

              </div>

              {/* INFO */}

              <div
                className="
                  hidden
                  md:block

                  text-left
                "
              >

                <h3
                  className="
                    text-sm
                    font-semibold
                    text-slate-800
                  "
                >

                  {user?.name}

                </h3>

                <div
                  className={`
                    inline-flex

                    items-center
                    gap-1

                    mt-1

                    rounded-full
                    border

                    px-2
                    py-1

                    text-[11px]
                    font-semibold

                    ${roleStyles[user?.role]}
                  `}
                >

                  <ShieldCheck
                    size={11}
                  />

                  {user?.role}

                </div>

              </div>

              <ChevronDown
                size={18}
                className="
                  text-slate-500
                "
              />

            </button>

            {/* =========================================== */}
            {/* ✅ DROPDOWN */}
            {/* =========================================== */}

            {
              dropdownOpen && (

                <div
                  className="
                    absolute
                    right-0
                    mt-4
                    w-72

                    overflow-hidden

                    rounded-3xl

                    border
                    border-white/20

                    bg-white/90
                    backdrop-blur-2xl

                    shadow-2xl

                    z-50
                  "
                >

                  {/* HEADER */}

                  <div
                    className="
                      border-b
                      border-slate-100

                      p-5
                    "
                  >

                    <h2
                      className="
                        font-bold
                        text-slate-800
                      "
                    >

                      {user?.name}

                    </h2>

                    <p
                      className="
                        mt-1
                        text-sm
                        text-slate-500
                      "
                    >

                      {user?.email}

                    </p>

                  </div>

                  {/* ITEMS */}

                  <div className="p-3">

                    <button
                      onClick={
                        handleDashboardNavigation
                      }
                      className="
                        w-full

                        flex
                        items-center
                        gap-3

                        rounded-2xl

                        px-4
                        py-3

                        text-sm
                        font-medium

                        transition-all

                        hover:bg-slate-100
                      "
                    >

                      <LayoutDashboard
                        size={18}
                      />

                      Dashboard

                    </button>

                    <button
                      className="
                        w-full

                        flex
                        items-center
                        gap-3

                        rounded-2xl

                        px-4
                        py-3

                        text-sm
                        font-medium

                        transition-all

                        hover:bg-slate-100
                      "
                    >

                      <User size={18} />

                      Profile

                    </button>

                    <button
                      className="
                        w-full

                        flex
                        items-center
                        gap-3

                        rounded-2xl

                        px-4
                        py-3

                        text-sm
                        font-medium

                        transition-all

                        hover:bg-slate-100
                      "
                    >

                      <Settings size={18} />

                      Settings

                    </button>

                    <button
                      onClick={handleLogout}
                      className="
                        mt-2

                        w-full

                        flex
                        items-center
                        gap-3

                        rounded-2xl

                        px-4
                        py-3

                        text-sm
                        font-medium
                        text-red-600

                        transition-all

                        hover:bg-red-50
                      "
                    >

                      <LogOut size={18} />

                      Logout

                    </button>

                  </div>

                </div>

              )
            }

          </div>

        </div>

      </div>

    </header>
  );
};

export default TopNavbar;
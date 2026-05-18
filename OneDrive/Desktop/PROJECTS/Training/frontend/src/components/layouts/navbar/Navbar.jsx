// ======================================================
// ✅ ENTERPRISE ROLE-AWARE NAVBAR
// ======================================================

import {
  Link,
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  Search,
  Bell,
  X,
  UserCircle2,
  LogOut,
  Activity,
  LayoutDashboard,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import { motion }
from "framer-motion";

import {
  useAuth,
} from "../../../context/AuthContext";


const Navbar = () => {

  const {
    user,
    logout,
  } = useAuth();

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const [search, setSearch] =
    useState("");

  // =====================================================
  // ✅ SEARCH URL SYNC
  // =====================================================

  useEffect(() => {

    const params =
      new URLSearchParams(
        location.search
      );

    setSearch(
      params.get("search") || ""
    );

  }, [location.search]);

  // =====================================================
  // ✅ SEARCH HANDLER
  // =====================================================

  const handleSearch = (
    value
  ) => {

    setSearch(value);

    const params =
      new URLSearchParams();

    if (value.trim()) {

      params.set(
        "search",
        value
      );
    }

    navigate({
      pathname: "/doctors",
      search:
        params.toString(),
    });
  };

  // =====================================================
  // ✅ LOGOUT
  // =====================================================

  const handleLogout = () => {

    logout();

    navigate(
      "/login",
      {
        replace: true,
      }
    );
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

  const roleBadgeStyles = {

    ADMIN:
      "bg-red-100 text-red-700 border-red-200",

    DOCTOR:
      "bg-blue-100 text-blue-700 border-blue-200",

    PATIENT:
      "bg-emerald-100 text-emerald-700 border-emerald-200",
  };

  return (

    <nav
      className="
        sticky
        top-0
        z-50

        border-b
        border-white/20

        bg-white/70
        backdrop-blur-2xl

        shadow-sm
      "
    >

      <div
        className="
          max-w-7xl
          mx-auto

          px-4
          sm:px-6
          lg:px-8

          h-20

          flex
          items-center
          justify-between
          gap-6
        "
      >

        {/* ================================================= */}
        {/* ✅ LEFT */}
        {/* ================================================= */}

        <div
          className="
            flex
            items-center
            gap-10
          "
        >

          <Link
            to="/"
            className="
              flex
              items-center
              gap-4
              shrink-0
            "
          >

            <img
              src="/MedBook_logo.png"
              alt="MedBook"
              className="
                h-14
                object-contain
              "
            />

            <div
              className="
                hidden
                sm:flex
                flex-col
              "
            >

              <span
                className="
                  text-2xl
                  font-bold
                  tracking-tight
                  text-primary
                "
              >

                MedBook

              </span>

              <span
                className="
                  text-xs
                  text-slate-500
                "
              >

                Enterprise Healthcare

              </span>

            </div>

          </Link>

          {/* ================================================= */}
          {/* ✅ NAVIGATION */}
          {/* ================================================= */}

          <div
            className="
              hidden
              lg:flex
              items-center
              gap-6
            "
          >

            {/* PUBLIC */}

            {!user && (

              <>

                <NavLink
                  to="/"
                  className={({ isActive }) => `
                    font-semibold
                    transition-all

                    ${isActive
                      ? "text-primary"
                      : "text-slate-700 hover:text-primary"
                    }
                  `}
                >

                  Home

                </NavLink>

                <NavLink
                  to="/doctors"
                  className={({ isActive }) => `
                    font-semibold
                    transition-all

                    ${isActive
                      ? "text-primary"
                      : "text-slate-700 hover:text-primary"
                    }
                  `}
                >

                  Doctors

                </NavLink>

              </>
            )}

            {/* PATIENT */}

            {user?.role === "PATIENT" && (

              <>

                <NavLink
                  to="/doctors"
                  className={({ isActive }) => `
                    font-semibold
                    transition-all

                    ${isActive
                      ? "text-primary"
                      : "text-slate-700 hover:text-primary"
                    }
                  `}
                >

                  Find Doctors

                </NavLink>

                <NavLink
                  to="/patient/appointments"
                  className={({ isActive }) => `
                    font-semibold
                    transition-all

                    ${isActive
                      ? "text-primary"
                      : "text-slate-700 hover:text-primary"
                    }
                  `}
                >

                  My Appointments

                </NavLink>

              </>
            )}

          </div>

        </div>

        {/* ================================================= */}
        {/* ✅ SEARCH BAR */}
        {/* ================================================= */}

        {user?.role !== "ADMIN" &&
          user?.role !== "DOCTOR" && (

          <div
            className="
              hidden
              md:flex

              flex-1
              max-w-xl
            "
          >

            <div className="relative w-full">

              <Search
                size={18}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  handleSearch(
                    e.target.value
                  )
                }
                placeholder="Search doctors, specialization..."
                className="
                  w-full

                  rounded-2xl

                  border
                  border-slate-200

                  bg-slate-100/80

                  py-3
                  pl-11
                  pr-12

                  outline-none

                  transition-all

                  focus:border-primary
                  focus:bg-white
                  focus:ring-4
                  focus:ring-primary/10
                "
              />

              {search && (

                <button
                  onClick={() =>
                    handleSearch("")
                  }
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                >

                  <X size={18} />

                </button>
              )}

            </div>

          </div>
        )}

        {/* ================================================= */}
        {/* ✅ RIGHT */}
        {/* ================================================= */}

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          {!user && (

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <NavLink
                to="/login"
                className="
                  font-semibold
                  text-slate-700
                  hover:text-primary
                "
              >

                Login

              </NavLink>

              <NavLink
                to="/register"
                className="
                  rounded-xl
                  bg-primary
                  px-5
                  py-2.5
                  font-semibold
                  text-white
                  transition-all
                  hover:bg-primaryHover
                "
              >

                Register

              </NavLink>

            </div>
          )}

          {user && (

            <>

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
                  border-slate-200

                  bg-white

                  px-4
                  py-2.5

                  font-semibold

                  transition-all

                  hover:bg-slate-100
                "
              >

                <LayoutDashboard
                  size={18}
                />

                Dashboard

              </button>

              {/* REALTIME */}

              <div
                className="
                  hidden
                  md:flex
                  items-center
                  gap-2

                  rounded-xl

                  border
                  border-emerald-200

                  bg-emerald-50

                  px-3
                  py-2
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
                    font-medium
                    text-emerald-700
                  "
                >

                  Live

                </span>

              </div>

              {/* ROLE BADGE */}

              <div
                className={`
                  hidden
                  md:flex

                  items-center
                  gap-2

                  rounded-xl
                  border

                  px-3
                  py-2

                  text-sm
                  font-semibold

                  ${roleBadgeStyles[user?.role]}
                `}
              >

                <Activity size={15} />

                {user?.role}

              </div>

              {/* NOTIFICATIONS */}

              <button
                className="
                  hidden
                  md:flex

                  h-11
                  w-11

                  items-center
                  justify-center

                  rounded-2xl

                  border
                  border-slate-200

                  bg-white

                  transition-all

                  hover:bg-slate-100
                "
              >

                <Bell size={18} />

              </button>

              {/* PROFILE */}

              <button
                onClick={
                  handleDashboardNavigation
                }
                className="
                  flex
                  items-center
                  gap-2

                  rounded-2xl

                  border
                  border-slate-200

                  bg-white

                  px-4
                  py-2.5

                  font-semibold

                  transition-all

                  hover:bg-slate-100
                "
              >

                <UserCircle2
                  size={18}
                />

                <span className="hidden sm:block">

                  Account

                </span>

              </button>

              {/* LOGOUT */}

              <button
                onClick={handleLogout}
                className="
                  flex
                  items-center
                  gap-2

                  rounded-2xl

                  bg-red-500

                  px-4
                  py-2.5

                  font-semibold
                  text-white

                  transition-all

                  hover:bg-red-600
                "
              >

                <LogOut size={17} />

                <span className="hidden sm:block">

                  Logout

                </span>

              </button>

            </>
          )}

        </div>

      </div>

    </nav>
  );
};

export default Navbar;
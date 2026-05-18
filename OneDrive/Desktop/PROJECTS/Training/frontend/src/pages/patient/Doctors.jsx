// ======================================================
// FILE: frontend/src/pages/Doctors.jsx
// FULLY UPDATED ENTERPRISE VERSION
// PATIENT DASHBOARD LAYOUT INSPIRED
// SIDEBAR + NAVBAR INTEGRATED
// MODERN PREMIUM UI/UX
// ======================================================

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  NavLink,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  Search,
  Sparkles,
  Activity,
  ShieldCheck,
  Users,
  CalendarClock,
  TrendingUp,
  HeartPulse,
  Stethoscope,
  LayoutDashboard,
  CalendarDays,
  FileText,
  Settings,
  User,
  Menu,
  X,
  ChevronRight,
  Bell,
  LogOut,
} from "lucide-react";

import { motion }
from "framer-motion";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

import { getDoctors }
from "../../api/doctor";

import DoctorCard
from "../../components/doctor/DoctorCard";

import DoctorFilters
from "../../components/doctor/DoctorFilters";

import SkeletonCard
from "../../components/ui/SkeletonCard";


// ======================================================
// COMPONENT
// ======================================================

const Doctors = () => {

  const navigate =
    useNavigate();

  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();


  // ===================================================
  // SIDEBAR NAVIGATION
  // ===================================================

  const sidebarLinks = [

    {
      label:
        "Dashboard",

      icon:
        LayoutDashboard,

      to:
        "/patient/dashboard",
    },

    {
      label:
        "Find Doctors",

      icon:
        Stethoscope,

      to:
        "/doctors",
    },

    {
      label:
        "Book Appointment",

      icon:
        CalendarDays,

      to:
        "/patient/booking",
    },

    {
      label:
        "Appointments",

      icon:
        FileText,

      to:
        "/patient/appointments",
    },

    {
      label:
        "Profile",

      icon:
        User,

      to:
        "/patient/profile",
    },

    {
      label:
        "Settings",

      icon:
        Settings,

      to:
        "/patient/settings",
    },

  ];


  // ===================================================
  // FILTERS
  // ===================================================

  const initialFilters =
    useMemo(() => ({

      search:
        searchParams.get(
          "search"
        ) || "",

      city:
        searchParams.get(
          "city"
        ) || "",

      specialization:
        searchParams.get(
          "specialization"
        ) || "",

      experience:
        searchParams.get(
          "experience"
        ) || "",

      fee:
        searchParams.get(
          "fee"
        ) || "",

    }), [searchParams]);


  // ===================================================
  // STATES
  // ===================================================

  const [filters, setFilters] =
    useState(initialFilters);

  const [doctors, setDoctors] =
    useState([]);

  const [loading, setLoading] =
    useState(false);


  // ===================================================
  // URL -> STATE SYNC
  // ===================================================

  useEffect(() => {

    setFilters(
      initialFilters
    );

  }, [initialFilters]);


  // ===================================================
  // STATE -> URL SYNC
  // ===================================================

  useEffect(() => {

    const params =
      new URLSearchParams();

    Object.entries(filters)
      .forEach(([key, value]) => {

        if (
          value !== "" &&
          value !== null &&
          value !== undefined
        ) {

          params.set(
            key,
            value
          );
        }
      });

    setSearchParams(
      params,
      {
        replace: true,
      }
    );

  }, [filters]);


  // ===================================================
  // FETCH DOCTORS
  // ===================================================

  useEffect(() => {

    const timeout =
      setTimeout(async () => {

        try {

          setLoading(true);

          const payload = {

            ...(filters.search && {
              search:
                filters.search,
            }),

            ...(filters.city && {
              city:
                filters.city,
            }),

            ...(filters.specialization && {
              specialization:
                filters.specialization,
            }),

            ...(filters.experience && {
              experience:
                Number(
                  filters.experience
                ),
            }),

            ...(filters.fee && {
              fee:
                Number(
                  filters.fee
                ),
            }),
          };

          const response =
            await getDoctors(
              payload
            );

          setDoctors(
            response || []
          );

        } catch (error) {

          console.error(
            "FETCH DOCTORS ERROR:",
            error
          );

          setDoctors([]);

        } finally {

          setLoading(false);
        }

      }, 400);

    return () =>
      clearTimeout(timeout);

  }, [filters]);


  // ===================================================
  // ANALYTICS
  // ===================================================

  const analyticsData = [

    {
      name: "Doctors",
      value:
        doctors.length,
    },

    {
      name: "Available",
      value:
        Math.max(
          doctors.length - 2,
          0
        ),
    },

    {
      name: "Busy",
      value:
        Math.min(
          2,
          doctors.length
        ),
    },
  ];


  // ===================================================
  // STATS
  // ===================================================

  const stats = [

    {
      title:
        "Verified Doctors",

      value:
        doctors.length,

      subtitle:
        "Trusted healthcare specialists",

      icon:
        ShieldCheck,

      bg:
        "bg-primary/10",

      color:
        "text-primary",
    },

    {
      title:
        "Available Today",

      value:
        Math.max(
          doctors.length - 2,
          0
        ),

      subtitle:
        "Doctors accepting appointments",

      icon:
        CalendarClock,

      bg:
        "bg-blue-100",

      color:
        "text-blue-700",
    },

    {
      title:
        "Healthcare Rating",

      value:
        "4.9",

      subtitle:
        "Average patient satisfaction",

      icon:
        HeartPulse,

      bg:
        "bg-emerald-100",

      color:
        "text-emerald-700",
    },

    {
      title:
        "Success Rate",

      value:
        "99%",

      subtitle:
        "Appointment completion rate",

      icon:
        TrendingUp,

      bg:
        "bg-yellow-100",

      color:
        "text-yellow-700",
    },

  ];


  return (

    <div
      className="
        min-h-screen
        bg-slate-50
      "
    >

      {/* ================================================= */}
      {/* TOP NAVBAR */}
      {/* ================================================= */}

      <header
        className="
          sticky
          top-0
          z-50

          border-b
          border-slate-200

          bg-white/80
          backdrop-blur-xl
        "
      >

        <div
          className="
            flex
            items-center
            justify-between

            px-4
            md:px-8

            py-4
          "
        >

          <div
            className="
              flex
              items-center
              gap-4
            "
          >

            <button
              onClick={() =>
                setSidebarOpen(
                  !sidebarOpen
                )
              }
              className="
                lg:hidden

                flex
                h-11
                w-11

                items-center
                justify-center

                rounded-2xl

                border
                border-slate-200

                bg-white
              "
            >

              {sidebarOpen ? (

                <X size={20} />

              ) : (

                <Menu size={20} />

              )}

            </button>

            <div>

              <h1
                className="
                  text-2xl
                  font-black

                  text-slate-900
                "
              >

                MEDBOOK

              </h1>

              <p
                className="
                  text-sm
                  text-slate-500
                "
              >

                Smart Healthcare Platform

              </p>

            </div>

          </div>


          {/* NAVBAR RIGHT */}

          <div
            className="
              flex
              items-center
              gap-4
            "
          >

            <button
              className="
                relative

                flex
                h-12
                w-12

                items-center
                justify-center

                rounded-2xl

                border
                border-slate-200

                bg-white
              "
            >

              <Bell size={20} />

              <span
                className="
                  absolute
                  top-2
                  right-2

                  h-2.5
                  w-2.5

                  rounded-full

                  bg-red-500
                "
              />

            </button>

            <div
              className="
                hidden
                md:flex

                items-center
                gap-3

                rounded-2xl

                border
                border-slate-200

                bg-white

                px-4
                py-2
              "
            >

              <div
                className="
                  flex
                  h-11
                  w-11

                  items-center
                  justify-center

                  rounded-xl

                  bg-primary/10

                  text-primary

                  font-black
                "
              >

                O

              </div>

              <div>

                <h3
                  className="
                    text-sm
                    font-bold
                    text-slate-900
                  "
                >

                  Patient Portal

                </h3>

                <p
                  className="
                    text-xs
                    text-slate-500
                  "
                >

                  Healthcare Workspace

                </p>

              </div>

            </div>

          </div>

        </div>

      </header>


      <div className="flex">

        {/* ================================================= */}
        {/* SIDEBAR */}
        {/* ================================================= */}

        <aside
          className={`
            fixed
            lg:sticky
            top-0
            left-0
            z-40

            h-screen

            w-[290px]

            border-r
            border-slate-200

            bg-white

            transition-all
            duration-300

            ${
              sidebarOpen

                ? "translate-x-0"

                : "-translate-x-full lg:translate-x-0"
            }
          `}
        >

          <div className="p-6">

            <div
              className="
                rounded-[2rem]

                bg-gradient-to-r
                from-primary
                to-secondary

                p-6

                text-white
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
                    flex
                    h-16
                    w-16

                    items-center
                    justify-center

                    rounded-2xl

                    bg-white/10

                    text-2xl
                    font-black
                  "
                >

                  O

                </div>

                <div>

                  <h3
                    className="
                      text-xl
                      font-black
                    "
                  >

                    Owais

                  </h3>

                  <p
                    className="
                      text-sm
                      text-white/80
                    "
                  >

                    Patient Workspace

                  </p>

                </div>

              </div>

            </div>


            {/* NAVIGATION */}

            <div className="mt-8 space-y-3">

              {sidebarLinks.map(
                (item) => {

                  const Icon =
                    item.icon;

                  return (

                    <NavLink

                      key={item.label}

                      to={item.to}

                      className={({
                        isActive,
                      }) => `
                        flex
                        items-center
                        justify-between

                        rounded-2xl

                        px-5
                        py-4

                        transition-all

                        ${
                          isActive

                            ? `
                              bg-primary
                              text-white
                              shadow-lg
                            `

                            : `
                              text-slate-600
                              hover:bg-slate-100
                            `
                        }
                      `}
                    >

                      <div
                        className="
                          flex
                          items-center
                          gap-4
                        "
                      >

                        <Icon size={22} />

                        <span
                          className="
                            font-semibold
                          "
                        >

                          {item.label}

                        </span>

                      </div>

                      <ChevronRight
                        size={18}
                      />

                    </NavLink>

                  );

                }
              )}

            </div>


            {/* LOGOUT */}

            <button
              className="
                mt-10

                flex
                w-full

                items-center
                justify-center
                gap-3

                rounded-2xl

                border
                border-red-200

                bg-red-50

                px-5
                py-4

                font-semibold

                text-red-600

                transition-all

                hover:bg-red-100
              "
            >

              <LogOut size={20} />

              Logout

            </button>

          </div>

        </aside>


        {/* ================================================= */}
        {/* MAIN CONTENT */}
        {/* ================================================= */}

        <main
          className="
            flex-1

            p-4
            md:p-8

            lg:ml-0
          "
        >

          <div className="space-y-10">

            {/* HERO */}

            <motion.div

              initial={{
                opacity: 0,
                y: 20,
              }}

              animate={{
                opacity: 1,
                y: 0,
              }}

              className="
                relative
                overflow-hidden

                rounded-[2.8rem]

                bg-gradient-to-r
                from-primary
                via-primary
                to-secondary

                p-8
                md:p-10

                text-white
              "
            >

              <div
                className="
                  absolute
                  top-0
                  right-0

                  h-80
                  w-80

                  rounded-full

                  bg-white/10

                  blur-3xl
                "
              />

              <div className="relative z-10">

                <div
                  className="
                    mb-6

                    inline-flex
                    items-center
                    gap-2

                    rounded-full

                    bg-white/10
                    backdrop-blur-md

                    px-4
                    py-2

                    text-sm
                    font-medium
                  "
                >

                  <Sparkles size={16} />

                  Smart Healthcare Discovery

                </div>

                <div
                  className="
                    flex
                    flex-col
                    xl:flex-row

                    xl:items-center
                    xl:justify-between

                    gap-10
                  "
                >

                  <div className="max-w-3xl">

                    <h1
                      className="
                        text-4xl
                        md:text-6xl

                        font-black

                        leading-tight
                      "
                    >

                      Discover Expert
                      <br />

                      Healthcare Specialists

                    </h1>

                    <p
                      className="
                        mt-6

                        text-lg
                        text-white/90

                        leading-relaxed

                        max-w-2xl
                      "
                    >

                      Search verified doctors,
                      compare healthcare specialists,
                      and instantly book appointments
                      with confidence.

                    </p>

                  </div>

                  <div
                    className="
                      w-full
                      xl:w-[340px]

                      rounded-[2rem]

                      border
                      border-white/20

                      bg-white/10
                      backdrop-blur-xl

                      p-7
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
                          flex
                          h-16
                          w-16

                          items-center
                          justify-center

                          rounded-3xl

                          bg-white/20
                        "
                      >

                        <Activity size={30} />

                      </div>

                      <div>

                        <p
                          className="
                            text-sm
                            text-white/70
                          "
                        >

                          Healthcare Network

                        </p>

                        <h3
                          className="
                            text-2xl
                            font-black
                          "
                        >

                          Active & Live

                        </h3>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </motion.div>


            {/* STATS */}

            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                xl:grid-cols-4
                gap-6
              "
            >

              {stats.map((item) => {

                const Icon =
                  item.icon;

                return (

                  <motion.div

                    key={item.title}

                    whileHover={{
                      y: -4,
                    }}

                    className="
                      rounded-[2rem]

                      border
                      border-slate-200

                      bg-white

                      p-6

                      shadow-sm
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                      "
                    >

                      <div>

                        <p
                          className="
                            text-sm
                            font-medium
                            text-slate-500
                          "
                        >

                          {item.title}

                        </p>

                        <h2
                          className="
                            mt-3

                            text-4xl
                            font-black

                            text-slate-900
                          "
                        >

                          {item.value}

                        </h2>

                        <p
                          className="
                            mt-2
                            text-sm
                            text-slate-500
                          "
                        >

                          {item.subtitle}

                        </p>

                      </div>

                      <div
                        className={`
                          flex
                          h-16
                          w-16

                          items-center
                          justify-center

                          rounded-3xl

                          ${item.bg}
                          ${item.color}
                        `}
                      >

                        <Icon size={30} />

                      </div>

                    </div>

                  </motion.div>

                );

              })}

            </div>


            {/* ANALYTICS */}

            <div
              className="
                grid
                grid-cols-1
                xl:grid-cols-3
                gap-6
              "
            >

              <motion.div
                whileHover={{
                  y: -4,
                }}
                className="
                  rounded-[2rem]
                  border
                  border-slate-200
                  bg-white
                  p-6
                  shadow-sm
                "
              >

                <h3
                  className="
                    text-2xl
                    font-black
                    text-slate-900
                    mb-6
                  "
                >

                  Healthcare Activity

                </h3>

                <div className="h-[320px]">

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >

                    <AreaChart
                      data={
                        analyticsData
                      }
                    >

                      <CartesianGrid
                        strokeDasharray="3 3"
                      />

                      <XAxis
                        dataKey="name"
                      />

                      <YAxis />

                      <Tooltip />

                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#3B82F6"
                        fill="#93C5FD"
                      />

                    </AreaChart>

                  </ResponsiveContainer>

                </div>

              </motion.div>


              <motion.div
                whileHover={{
                  y: -4,
                }}
                className="
                  rounded-[2rem]
                  border
                  border-slate-200
                  bg-white
                  p-6
                  shadow-sm
                "
              >

                <h3
                  className="
                    text-2xl
                    font-black
                    text-slate-900
                    mb-6
                  "
                >

                  Doctor Availability

                </h3>

                <div className="h-[320px]">

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >

                    <PieChart>

                      <Pie
                        data={
                          analyticsData
                        }
                        dataKey="value"
                        outerRadius={100}
                        label
                      >

                        <Cell fill="#3B82F6" />
                        <Cell fill="#10B981" />
                        <Cell fill="#FACC15" />

                      </Pie>

                      <Tooltip />

                    </PieChart>

                  </ResponsiveContainer>

                </div>

              </motion.div>


              <motion.div
                whileHover={{
                  y: -4,
                }}
                className="
                  rounded-[2rem]
                  border
                  border-slate-200
                  bg-white
                  p-6
                  shadow-sm
                "
              >

                <h3
                  className="
                    text-2xl
                    font-black
                    text-slate-900
                    mb-6
                  "
                >

                  Healthcare Insights

                </h3>

                <div className="h-[320px]">

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >

                    <BarChart
                      data={
                        analyticsData
                      }
                    >

                      <CartesianGrid
                        strokeDasharray="3 3"
                      />

                      <XAxis
                        dataKey="name"
                      />

                      <YAxis />

                      <Tooltip />

                      <Bar
                        dataKey="value"
                        fill="#3B82F6"
                        radius={[
                          12,
                          12,
                          0,
                          0,
                        ]}
                      />

                    </BarChart>

                  </ResponsiveContainer>

                </div>

              </motion.div>

            </div>


            {/* MAIN GRID */}

            <div
              className="
                grid
                grid-cols-1
                lg:grid-cols-12
                gap-8
                items-start
              "
            >

              {/* FILTERS */}

              <div className="lg:col-span-3">

                <div className="lg:sticky lg:top-28">

                  <div
                    className="
                      rounded-[2.5rem]

                      border
                      border-slate-200

                      bg-white

                      p-2

                      shadow-sm
                    "
                  >

                    <DoctorFilters
                      filters={filters}
                      setFilters={setFilters}
                    />

                  </div>

                </div>

              </div>


              {/* CONTENT */}

              <div className="lg:col-span-9 min-w-0">

                <div
                  className="
                    flex
                    flex-col
                    lg:flex-row

                    lg:items-center
                    lg:justify-between

                    gap-5

                    mb-8
                  "
                >

                  <div>

                    <h2
                      className="
                        text-3xl
                        md:text-4xl

                        font-black

                        text-slate-900
                      "
                    >

                      Available Doctors

                    </h2>

                    <p
                      className="
                        mt-2
                        text-slate-500
                      "
                    >

                      Explore verified healthcare specialists

                    </p>

                  </div>


                  {/* SEARCH */}

                  <div
                    className="
                      relative

                      w-full
                      max-w-md
                    "
                  >

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
                      value={filters.search}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          search:
                            e.target.value,
                        })
                      }
                      placeholder="
Search doctors...
                      "
                      className="
                        h-14
                        w-full

                        rounded-2xl

                        border
                        border-slate-200

                        bg-white

                        pl-11
                        pr-4

                        outline-none

                        focus:border-primary
                        focus:ring-4
                        focus:ring-primary/10
                      "
                    />

                  </div>

                </div>


                {/* RESULTS */}

                {loading ? (

                  <div className="space-y-7">

                    {[1, 2, 3, 4].map((i) => (

                      <SkeletonCard
                        key={i}
                      />

                    ))}

                  </div>

                ) : doctors.length === 0 ? (

                  <motion.div

                    initial={{
                      opacity: 0,
                      y: 20,
                    }}

                    animate={{
                      opacity: 1,
                      y: 0,
                    }}

                    className="
                      rounded-[2.8rem]

                      border
                      border-slate-200

                      bg-white

                      p-14

                      text-center

                      shadow-sm
                    "
                  >

                    <div
                      className="
                        mx-auto

                        flex
                        h-28
                        w-28

                        items-center
                        justify-center

                        rounded-full

                        bg-primary/10

                        text-primary
                      "
                    >

                      <Stethoscope
                        size={48}
                      />

                    </div>

                    <h2
                      className="
                        mt-8

                        text-4xl
                        font-black

                        text-slate-900
                      "
                    >

                      No Doctors Found

                    </h2>

                    <p
                      className="
                        mt-5

                        max-w-xl
                        mx-auto

                        text-lg

                        leading-relaxed

                        text-slate-500
                      "
                    >

                      Try adjusting your filters
                      or search criteria to discover
                      more healthcare specialists.

                    </p>

                  </motion.div>

                ) : (

                  <div className="space-y-7">

                    {doctors.map((doc) => (

                      <motion.div

                        key={doc.id}

                        initial={{
                          opacity: 0,
                          y: 15,
                        }}

                        animate={{
                          opacity: 1,
                          y: 0,
                        }}

                        whileHover={{
                          y: -4,
                        }}

                        transition={{
                          duration: 0.3,
                        }}
                      >

                        <DoctorCard
                          doc={doc}
                        />

                      </motion.div>

                    ))}

                  </div>

                )}

              </div>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
};

export default Doctors;
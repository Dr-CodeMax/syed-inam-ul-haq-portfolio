import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  CalendarDays,
  HeartPulse,
  UserCheck,
  FileText,
  ArrowRight,
  Activity,
  Sparkles,
  CalendarClock,
  User,
  Settings,
  Search,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock3,
  XCircle,
  TrendingUp,
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
  Legend,
} from "recharts";

import DashboardGrid
from "../../components/dashboard/DashboardGrid";

import DashboardSection
from "../../components/dashboard/DashboardSection";

import QuickActions
from "../../components/dashboard/QuickActions";

import StatCard
from "../../components/dashboard/StatCard";

import PageLoader
from "../../components/ui/PageLoader";

import ErrorState
from "../../components/ui/ErrorState";

import {
  getPatientDashboard,
} from "../../services/dashboardService";


// ======================================================
// ITEMS PER PAGE
// ======================================================

const ITEMS_PER_PAGE = 5;


// ======================================================
// PATIENT DASHBOARD
// ======================================================

const PatientDashboard = () => {

  const navigate =
    useNavigate();

  // ======================================================
  // STATES
  // ======================================================

  const [
    dashboardData,
    setDashboardData,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);


  // ======================================================
  // FETCH DASHBOARD
  // ======================================================

  useEffect(() => {

    const fetchDashboard =
      async () => {

        try {

          setLoading(true);

          setError("");

          const response =
            await getPatientDashboard();

          const data =
            response?.data ||
            response ||
            {};

          setDashboardData(
            data
          );

        } catch (err) {

          console.error(err);

          setError(
            err?.response?.data
              ?.message ||

            "Failed to load patient dashboard"
          );

        } finally {

          setLoading(false);

        }

      };

    fetchDashboard();

  }, []);


  // ======================================================
  // SAFE DEFAULTS
  // ======================================================

  const safeDashboard =
    dashboardData || {};

  const appointments =
    safeDashboard
      ?.upcomingAppointments || [];


  // ======================================================
  // FILTERED APPOINTMENTS
  // ======================================================

  const filteredAppointments =
    useMemo(() => {

      const query =
        search
          .toLowerCase()
          .trim();

      if (!query) {

        return appointments;

      }

      return appointments.filter(
        (appointment) =>

          [
            appointment?.doctorName,
            appointment?.specialization,
            appointment?.status,
            appointment?.date,
            appointment?.time,
          ]

            .filter(Boolean)

            .some(
              (value) =>

                String(value)
                  .toLowerCase()
                  .includes(query)
            )
      );

    }, [
      appointments,
      search,
    ]);


  // ======================================================
  // PAGINATION
  // ======================================================

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredAppointments.length
        /
        ITEMS_PER_PAGE
      )
    );

  const paginatedAppointments =
    filteredAppointments.slice(

      (currentPage - 1)
      * ITEMS_PER_PAGE,

      currentPage
      * ITEMS_PER_PAGE
    );


  // ======================================================
  // APPOINTMENT ANALYTICS
  // ======================================================

  const confirmedAppointments =
    appointments.filter(
      (appointment) =>

        (
          appointment?.status ||
          ""
        ).toUpperCase() ===
        "CONFIRMED"
    ).length;

  const pendingAppointments =
    appointments.filter(
      (appointment) =>

        (
          appointment?.status ||
          ""
        ).toUpperCase() ===
        "PENDING"
    ).length;

  const cancelledAppointments =
    appointments.filter(
      (appointment) =>

        (
          appointment?.status ||
          ""
        ).toUpperCase() ===
        "CANCELLED"
    ).length;


  // ======================================================
  // STATS
  // ======================================================

  const stats = [

    {
      title:
        "Upcoming Appointments",

      value:
        safeDashboard
          ?.appointmentCount ||
        0,

      subtitle:
        "Scheduled healthcare visits",

      icon:
        CalendarDays,

      color:
        "primary",

      trend:
        "+12.4%",
    },

    {
      title:
        "Medical Reports",

      value:
        safeDashboard
          ?.reportCount ||
        0,

      subtitle:
        "Healthcare records",

      icon:
        FileText,

      color:
        "blue",

      trend:
        "+8.7%",
    },

    {
      title:
        "Favorite Doctors",

      value:
        safeDashboard
          ?.favoriteDoctors ||
        0,

      subtitle:
        "Saved specialists",

      icon:
        UserCheck,

      color:
        "green",

      trend:
        "+5.1%",
    },

    {
      title:
        "Health Score",

      value:
        safeDashboard
          ?.healthScore ||
        "0%",

      subtitle:
        "Overall wellness score",

      icon:
        HeartPulse,

      color:
        "yellow",

      trend:
        "+18.2%",
    },

  ];


  // ======================================================
  // QUICK ACTIONS
  // ======================================================

  const quickActions = [

    {
      label:
        "Book Appointment",

      description:
        "Schedule consultations instantly",

      icon:
        CalendarDays,

      to:
        "/patient/booking",
    },

    {
      label:
        "Find Doctors",

      description:
        "Browse verified specialists",

      icon:
        UserCheck,

      to:
        "/doctors",
    },

    {
      label:
        "My Appointments",

      description:
        "Track appointment history",

      icon:
        FileText,

      to:
        "/patient/appointments",
    },

    {
      label:
        "My Profile",

      description:
        "Manage personal information",

      icon:
        User,

      to:
        "/patient/profile",
    },

    {
      label:
        "Settings",

      description:
        "Manage preferences",

      icon:
        Settings,

      to:
        "/patient/settings",
    },

  ];


  // ======================================================
  // CHART DATA
  // ======================================================

  const appointmentAnalytics = [

    {
      name: "Confirmed",
      value:
        confirmedAppointments,
    },

    {
      name: "Pending",
      value:
        pendingAppointments,
    },

    {
      name: "Cancelled",
      value:
        cancelledAppointments,
    },

  ];

  const healthAnalytics = [

    {
      name: "Appointments",
      value:
        safeDashboard
          ?.appointmentCount ||
        0,
    },

    {
      name: "Reports",
      value:
        safeDashboard
          ?.reportCount ||
        0,
    },

    {
      name: "Favorites",
      value:
        safeDashboard
          ?.favoriteDoctors ||
        0,
    },

  ];


  // ======================================================
  // STATUS STYLES
  // ======================================================

  const getStatusStyles =
    (status) => {

      switch (
        status
      ) {

        case "CONFIRMED":

          return `
            bg-emerald-100
            text-emerald-700
          `;

        case "PENDING":

          return `
            bg-yellow-100
            text-yellow-700
          `;

        case "CANCELLED":

          return `
            bg-red-100
            text-red-700
          `;

        default:

          return `
            bg-slate-100
            text-slate-700
          `;
      }

    };


  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {

    return (
      <PageLoader
        title="Loading dashboard"
        subtitle="
Preparing your healthcare workspace...
        "
      />
    );

  }


  // ======================================================
  // ERROR
  // ======================================================

  if (error) {

    return (
      <ErrorState
        message={error}
      />
    );

  }


  return (

    <div className="space-y-10">

      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <motion.div

        initial={{
          opacity: 0,
          y: 20,
        }}

        animate={{
          opacity: 1,
          y: 0,
        }}

        transition={{
          duration: 0.4,
        }}

        className="
          relative
          overflow-hidden

          rounded-[2.5rem]

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

            Smart Healthcare Experience

          </div>

          <div
            className="
              flex
              flex-col
              lg:flex-row

              items-start
              lg:items-center

              justify-between

              gap-8
            "
          >

            <div>

              <h1
                className="
                  text-4xl
                  md:text-5xl

                  font-black
                "
              >

                Welcome Back 👋

              </h1>

              <p
                className="
                  mt-5

                  max-w-2xl

                  text-lg
                  text-white/90
                "
              >

                Access appointments,
                healthcare insights,
                analytics,
                medical records,
                and verified specialists
                from one unified healthcare platform.

              </p>

            </div>

            <div
              className="
                rounded-3xl

                border
                border-white/20

                bg-white/10
                backdrop-blur-xl

                p-6
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
                    h-14
                    w-14

                    items-center
                    justify-center

                    rounded-2xl

                    bg-white/20
                  "
                >

                  <Activity size={28} />

                </div>

                <div>

                  <p
                    className="
                      text-sm
                      text-white/70
                    "
                  >

                    Current Health Status

                  </p>

                  <h3
                    className="
                      text-xl
                      font-bold
                    "
                  >

                    Stable & Active

                  </h3>

                </div>

              </div>

            </div>

          </div>

        </div>

      </motion.div>


      {/* ================================================= */}
      {/* STATS */}
      {/* ================================================= */}

      <DashboardSection
        title="Healthcare Overview"
      >

        <DashboardGrid>

          {stats.map(
            (stat) => (

              <StatCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                subtitle={stat.subtitle}
                icon={stat.icon}
                color={stat.color}
                trend={stat.trend}
              />

            )
          )}

        </DashboardGrid>

      </DashboardSection>


      {/* ================================================= */}
      {/* ANALYTICS */}
      {/* ================================================= */}

      <DashboardSection
        title="Healthcare Analytics"
      >

        <div
          className="
            grid
            grid-cols-1
            xl:grid-cols-3
            gap-6
          "
        >

          {/* AREA CHART */}

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

              min-w-0
            "
          >

            <div className="mb-6">

              <h3
                className="
                  text-xl
                  font-bold
                  text-slate-900
                "
              >

                Health Activity

              </h3>

            </div>

            <div
              className="
                h-[320px]
                w-full
              "
            >

              <ResponsiveContainer
                width="100%"
                height={320}
              >

                <AreaChart
                  data={
                    healthAnalytics
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


          {/* PIE CHART */}

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

              min-w-0
            "
          >

            <div className="mb-6">

              <h3
                className="
                  text-xl
                  font-bold
                  text-slate-900
                "
              >

                Appointment Status

              </h3>

            </div>

            <div
              className="
                h-[320px]
                w-full
              "
            >

              <ResponsiveContainer
                width="100%"
                height={320}
              >

                <PieChart>

                  <Pie
                    data={
                      appointmentAnalytics
                    }
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >

                    <Cell fill="#10B981" />
                    <Cell fill="#FACC15" />
                    <Cell fill="#EF4444" />

                  </Pie>

                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </motion.div>


          {/* BAR CHART */}

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

              min-w-0
            "
          >

            <div className="mb-6">

              <h3
                className="
                  text-xl
                  font-bold
                  text-slate-900
                "
              >

                Patient Insights

              </h3>

            </div>

            <div
              className="
                h-[320px]
                w-full
              "
            >

              <ResponsiveContainer
                width="100%"
                height={320}
              >

                <BarChart
                  data={
                    healthAnalytics
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

                  <Legend />

                  <Bar
                    dataKey="value"
                    fill="#3B82F6"
                    radius={[
                      10,
                      10,
                      0,
                      0,
                    ]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </motion.div>

        </div>

      </DashboardSection>


      {/* ================================================= */}
      {/* QUICK ACTIONS */}
      {/* ================================================= */}

      <DashboardSection
        title="Quick Actions"
      >

        <QuickActions
          actions={
            quickActions
          }
        />

      </DashboardSection>


      {/* ================================================= */}
      {/* HEALTH STATUS */}
      {/* ================================================= */}

      <DashboardSection
        title="Healthcare Status"
      >

        <DashboardGrid>

          {[
            {
              title:
                "Confirmed Appointments",

              value:
                confirmedAppointments,

              icon:
                CheckCircle2,

              bg:
                "bg-emerald-100",

              color:
                "text-emerald-600",
            },

            {
              title:
                "Pending Reviews",

              value:
                pendingAppointments,

              icon:
                Clock3,

              bg:
                "bg-yellow-100",

              color:
                "text-yellow-600",
            },

            {
              title:
                "Cancelled Visits",

              value:
                cancelledAppointments,

              icon:
                XCircle,

              bg:
                "bg-red-100",

              color:
                "text-red-600",
            },

            {
              title:
                "Health Progress",

              value:
                safeDashboard
                  ?.healthScore ||
                "0%",

              icon:
                TrendingUp,

              bg:
                "bg-primary/10",

              color:
                "text-primary",
            },
          ].map(
            (item) => {

              const Icon =
                item.icon;

              return (

                <motion.div

                  key={
                    item.title
                  }

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

                        {
                          item.title
                        }

                      </p>

                      <h2
                        className="
                          mt-2

                          text-4xl
                          font-black

                          text-slate-900
                        "
                      >

                        {
                          item.value
                        }

                      </h2>

                    </div>

                    <div
                      className={`
                        flex
                        h-14
                        w-14

                        items-center
                        justify-center

                        rounded-2xl

                        ${item.bg}
                        ${item.color}
                      `}
                    >

                      <Icon
                        size={28}
                      />

                    </div>

                  </div>

                </motion.div>

              );

            }
          )}

        </DashboardGrid>

      </DashboardSection>


      {/* ================================================= */}
      {/* APPOINTMENTS TABLE */}
      {/* ================================================= */}

      <DashboardSection
        title="Appointment Analytics"
      >

        <div
          className="
            overflow-hidden

            rounded-[2rem]

            border
            border-slate-200

            bg-white

            shadow-sm
          "
        >

          {/* HEADER */}

          <div
            className="
              flex
              flex-col
              lg:flex-row

              lg:items-center
              lg:justify-between

              gap-4

              border-b
              border-slate-200

              p-6
            "
          >

            <div>

              <h2
                className="
                  text-2xl
                  font-bold

                  text-slate-900
                "
              >

                Upcoming Appointments

              </h2>

              <p
                className="
                  mt-2
                  text-slate-500
                "
              >

                View and manage your healthcare schedule

              </p>

            </div>

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

                value={search}

                onChange={(e) => {

                  setSearch(
                    e.target.value
                  );

                  setCurrentPage(
                    1
                  );

                }}

                placeholder="
                  Search appointments...
                "

                className="
                  w-full

                  rounded-2xl

                  border
                  border-slate-200

                  bg-slate-50

                  py-3
                  pl-11
                  pr-4

                  outline-none

                  focus:border-primary
                "
              />

            </div>

          </div>


          {/* TABLE */}

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead
                className="
                  bg-slate-50
                "
              >

                <tr>

                  {[
                    "Doctor",
                    "Specialization",
                    "Date",
                    "Time",
                    "Status",
                  ].map(
                    (heading) => (

                      <th

                        key={heading}

                        className="
                          px-6
                          py-5

                          text-left

                          text-sm
                          font-bold

                          uppercase

                          text-slate-500
                        "
                      >

                        {heading}

                      </th>
                    )
                  )}

                </tr>

              </thead>

              <tbody>

                {paginatedAppointments.length === 0 ? (

                  <tr>

                    <td
                      colSpan={5}

                      className="
                        py-16
                        text-center
                      "
                    >

                      <div className="text-6xl mb-5">

                        📅

                      </div>

                      <h3
                        className="
                          text-2xl
                          font-bold
                          text-slate-800
                        "
                      >

                        No Upcoming Appointments

                      </h3>

                      <p
                        className="
                          mt-3
                          text-slate-500
                        "
                      >

                        Start by booking your first healthcare consultation.

                      </p>

                      <button
                        onClick={() =>
                          navigate("/patient/booking")
                        }
                        className="
                          mt-6
                          bg-primary
                          hover:bg-primaryHover
                          text-white
                          px-7
                          py-3
                          rounded-2xl
                          font-semibold
                          transition-all
                        "
                      >

                        Book Appointment

                      </button>

                    </td>

                  </tr>

                ) : (

                  paginatedAppointments.map(
                    (
                      appointment,
                      index
                    ) => (

                      <motion.tr

                        key={
                          appointment?.id ||
                          index
                        }

                        initial={{
                          opacity: 0,
                          y: 10,
                        }}

                        animate={{
                          opacity: 1,
                          y: 0,
                        }}

                        className="
                          border-t
                          border-slate-100

                          hover:bg-slate-50
                        "
                      >

                        <td className="px-6 py-5">

                          <div
                            className="
                              font-semibold
                              text-slate-900
                            "
                          >

                            {
                              appointment?.doctorName ||
                              "N/A"
                            }

                          </div>

                        </td>

                        <td className="px-6 py-5">

                          <div
                            className="
                              text-slate-600
                            "
                          >

                            {
                              appointment?.specialization ||
                              "N/A"
                            }

                          </div>

                        </td>

                        <td className="px-6 py-5">

                          <div
                            className="
                              text-slate-600
                            "
                          >

                            {
                              appointment?.date ||
                              "N/A"
                            }

                          </div>

                        </td>

                        <td className="px-6 py-5">

                          <div
                            className="
                              text-slate-600
                            "
                          >

                            {
                              appointment?.time ||
                              "N/A"
                            }

                          </div>

                        </td>

                        <td className="px-6 py-5">

                          <div
                            className={`
                              inline-flex

                              rounded-full

                              px-4
                              py-2

                              text-sm
                              font-semibold

                              ${getStatusStyles(
                                appointment?.status
                              )}
                            `}
                          >

                            {
                              appointment?.status ||
                              "CONFIRMED"
                            }

                          </div>

                        </td>

                      </motion.tr>

                    )
                  )

                )}

              </tbody>

            </table>

          </div>


          {/* PAGINATION */}

          {filteredAppointments.length >
            ITEMS_PER_PAGE && (

            <div
              className="
                flex
                items-center
                justify-between

                border-t
                border-slate-200

                p-6
              "
            >

              <button

                onClick={() =>
                  setCurrentPage(
                    (prev) =>
                      Math.max(
                        prev - 1,
                        1
                      )
                  )
                }

                disabled={
                  currentPage === 1
                }

                className="
                  flex
                  items-center
                  gap-2

                  rounded-2xl

                  border
                  border-slate-200

                  px-4
                  py-2

                  disabled:opacity-40
                "
              >

                <ChevronLeft
                  size={16}
                />

                Previous

              </button>


              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >

                {[...Array(
                  totalPages
                )].map(
                  (_, index) => {

                    const page =
                      index + 1;

                    return (

                      <button

                        key={page}

                        onClick={() =>
                          setCurrentPage(
                            page
                          )
                        }

                        className={`
                          h-10
                          w-10

                          rounded-xl

                          text-sm
                          font-bold

                          ${
                            currentPage ===
                            page

                              ? `
                                bg-primary
                                text-white
                              `

                              : `
                                border
                                border-slate-200
                              `
                          }
                        `}
                      >

                        {page}

                      </button>

                    );

                  }
                )}

              </div>


              <button

                onClick={() =>
                  setCurrentPage(
                    (prev) =>
                      Math.min(
                        prev + 1,
                        totalPages
                      )
                  )
                }

                disabled={
                  currentPage ===
                  totalPages
                }

                className="
                  flex
                  items-center
                  gap-2

                  rounded-2xl

                  border
                  border-slate-200

                  px-4
                  py-2

                  disabled:opacity-40
                "
              >

                Next

                <ChevronRight
                  size={16}
                />

              </button>

            </div>

          )}

        </div>

      </DashboardSection>


      {/* ================================================= */}
      {/* SYSTEM STATUS */}
      {/* ================================================= */}

      <DashboardSection
        title="Healthcare System Activity"
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

            p-8

            shadow-sm
          "
        >

          <div
            className="
              flex
              flex-col
              md:flex-row

              md:items-center
              md:justify-between

              gap-6
            "
          >

            <div
              className="
                flex
                items-center
                gap-5
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

                  bg-primary/10

                  text-primary
                "
              >

                <Activity size={30} />

              </div>

              <div>

                <h3
                  className="
                    text-2xl
                    font-bold

                    text-slate-900
                  "
                >

                  Healthcare Services Active

                </h3>

                <p
                  className="
                    mt-2

                    text-slate-500
                  "
                >

                  Appointment booking,
                  patient analytics,
                  healthcare records,
                  and doctor consultation
                  systems are functioning normally.

                </p>

              </div>

            </div>

            <div
              className="
                flex
                items-center
                gap-2

                font-semibold

                text-primary
              "
            >

              Live Monitoring

              <ArrowRight
                size={18}
              />

            </div>

          </div>

        </motion.div>

      </DashboardSection>

    </div>

  );

};

export default PatientDashboard;
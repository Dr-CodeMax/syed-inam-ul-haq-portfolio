// =====================================================
// FILE: src/pages/doctor/DoctorDashboard.jsx
// FULLY UPDATED ENTERPRISE VERSION
// FIXED APPOINTMENTS ISSUE
// MODERN RESPONSIVE UI/UX
// CLEAN APPOINTMENT REPRESENTATION
// ENTERPRISE ANALYTICS
// VIDEO CONSULTATION
// QUICK ACTIONS
// RESPONSIVE CHARTS
// =====================================================

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Users,
  UserCheck,
  CalendarDays,
  Clock3,
  Activity,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Search,
  ChevronLeft,
  ChevronRight,
  CalendarCheck,
  Video,
  Stethoscope,
  ClipboardPlus,
  TimerReset,
  Pill,
} from "lucide-react";

import { motion }
from "framer-motion";

import {
  useNavigate,
} from "react-router-dom";

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

import StatCard
from "../../components/dashboard/StatCard";

import DashboardGrid
from "../../components/dashboard/DashboardGrid";

import DashboardSection
from "../../components/dashboard/DashboardSection";

import PageLoader
from "../../components/ui/PageLoader";

import ErrorState
from "../../components/ui/ErrorState";

import {
  getDoctorDashboard,
} from "../../services/dashboardService";

import {
  getAppointments,
} from "../../services/appointmentService";


// =====================================================
// ITEMS PER PAGE
// =====================================================

const ITEMS_PER_PAGE = 4;


// =====================================================
// DOCTOR DASHBOARD
// =====================================================

const DoctorDashboard = () => {

  const navigate =
    useNavigate();

  // =====================================================
  // STATES
  // =====================================================

  const [
    dashboardData,
    setDashboardData,
  ] = useState({});

  const [
    appointments,
    setAppointments,
  ] = useState([]);

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


  // =====================================================
  // NORMALIZE APPOINTMENTS
  // =====================================================

  const normalizeAppointment =
    (appointment) => {

      return {

        ...appointment,

        id:
          appointment?.id ||
          appointment?._id,

        patient_name:
          appointment?.patient_name ||
          appointment?.patientName ||
          "Unknown Patient",

        date:
          appointment?.date ||
          appointment?.appointment_date ||
          "N/A",

        time:
          appointment?.time ||
          appointment?.appointment_time ||
          "N/A",

        status:
          appointment?.status ||
          "PENDING",

        reason:
          appointment?.reason ||
          "General Consultation",

        priority:
          appointment?.priority ||
          "NORMAL",

      };

    };


  // =====================================================
  // FETCH DASHBOARD
  // =====================================================

  useEffect(() => {

    const fetchDashboard =
      async () => {

        try {

          setLoading(true);

          setError("");

          // =====================================================
          // DASHBOARD API
          // =====================================================

          const dashboardResponse =
            await getDoctorDashboard();

          const dashboard =
            dashboardResponse?.data ||
            dashboardResponse ||
            {};

          setDashboardData(
            dashboard
          );

          // =====================================================
          // APPOINTMENTS API
          // =====================================================

          const appointmentsResponse =
            await getAppointments({
              role: "doctor",
            });

          const rawAppointments =

            Array.isArray(
              appointmentsResponse
            )

              ? appointmentsResponse

              : appointmentsResponse?.data || [];

          const normalizedAppointments =
            rawAppointments.map(
              normalizeAppointment
            );

          setAppointments(
            normalizedAppointments
          );

        } catch (err) {

          console.error(err);

          setError(

            err?.response?.data
              ?.message ||

            "Failed to load doctor dashboard"

          );

        } finally {

          setLoading(false);

        }

      };

    fetchDashboard();

  }, []);


  // =====================================================
  // FILTERED APPOINTMENTS
  // =====================================================

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
            appointment?.patient_name,
            appointment?.status,
            appointment?.date,
            appointment?.reason,
          ]

            .filter(Boolean)

            .some(
              (value) =>

                value
                  .toString()
                  .toLowerCase()
                  .includes(query)
            )
      );

    }, [
      appointments,
      search,
    ]);


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return <PageLoader />;

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (
      <ErrorState
        message={error}
      />
    );

  }


  // =====================================================
  // ANALYTICS
  // =====================================================

  const totalAppointments =
    appointments.length;

  const confirmedAppointments =
    appointments.filter(
      (appointment) =>

        appointment?.status ===
        "CONFIRMED"
    ).length;

  const completedAppointments =
    appointments.filter(
      (appointment) =>

        appointment?.status ===
        "COMPLETED"
    ).length;

  const pendingAppointments =
    appointments.filter(
      (appointment) =>

        appointment?.status ===
        "PENDING"
    ).length;

  const cancelledAppointments =
    appointments.filter(
      (appointment) =>

        appointment?.status ===
        "CANCELLED"
    ).length;


  // =====================================================
  // STATS
  // =====================================================

  const stats = [

    {
      title:
        "Today's Patients",

      value:
        dashboardData?.todayPatients ||
        totalAppointments,

      subtitle:
        "Patients scheduled today",

      icon:
        Users,

      color:
        "primary",

      trend:
        "+12%",
    },

    {
      title:
        "Completed",

      value:
        completedAppointments,

      subtitle:
        "Appointments completed",

      icon:
        UserCheck,

      color:
        "green",

      trend:
        "+8%",
    },

    {
      title:
        "Upcoming",

      value:
        pendingAppointments,

      subtitle:
        "Remaining appointments",

      icon:
        CalendarDays,

      color:
        "blue",

      trend:
        "+4%",
    },

    {
      title:
        "Hours Active",

      value:
        dashboardData?.activeHours ||
        "8h",

      subtitle:
        "Today's active hours",

      icon:
        Clock3,

      color:
        "yellow",

      trend:
        "+2%",
    },

  ];


  // =====================================================
  // CHART DATA
  // =====================================================

  const overviewChartData = [

    {
      name: "Pending",
      value:
        pendingAppointments,
    },

    {
      name: "Confirmed",
      value:
        confirmedAppointments,
    },

    {
      name: "Completed",
      value:
        completedAppointments,
    },

    {
      name: "Cancelled",
      value:
        cancelledAppointments,
    },

  ];

  const weeklyData = [

    {
      name: "Mon",
      appointments: 5,
    },

    {
      name: "Tue",
      appointments: 7,
    },

    {
      name: "Wed",
      appointments: 4,
    },

    {
      name: "Thu",
      appointments: 8,
    },

    {
      name: "Fri",
      appointments: 6,
    },

    {
      name: "Sat",
      appointments: 3,
    },

  ];


  // =====================================================
  // PAGINATION
  // =====================================================

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


  // =====================================================
  // STATUS COLORS
  // =====================================================

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

        case "COMPLETED":

          return `
            bg-blue-100
            text-blue-700
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


  return (

    <div className="space-y-8 lg:space-y-10">

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

        className="
          relative
          overflow-hidden

          rounded-[2rem]
          lg:rounded-[2.5rem]

          bg-gradient-to-r
          from-primary
          via-primary
          to-secondary

          p-6
          md:p-8
          lg:p-10

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

            Healthcare Professional Portal

          </div>

          <div
            className="
              flex
              flex-col
              xl:flex-row

              items-start
              xl:items-center

              justify-between

              gap-8
            "
          >

            <div>

              <h1
                className="
                  text-3xl
                  md:text-4xl
                  lg:text-5xl

                  font-black
                "
              >

                Doctor Dashboard

              </h1>

              <p
                className="
                  mt-4

                  max-w-2xl

                  text-base
                  md:text-lg

                  text-white/90
                "
              >

                Manage appointments,
                consultations,
                schedules,
                healthcare analytics,
                prescriptions,
                and patient workflows
                from one intelligent dashboard.

              </p>

            </div>

            <div
              className="
                w-full
                xl:w-auto

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

                    Consultation Status

                  </p>

                  <h3
                    className="
                      text-xl
                      font-bold
                    "
                  >

                    Active Today

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
        title="Today's Overview"
      >

        <DashboardGrid>

          {stats.map(
            (stat) => (

              <StatCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                subtitle={
                  stat.subtitle
                }
                icon={stat.icon}
                color={stat.color}
                trend={stat.trend}
              />

            )
          )}

        </DashboardGrid>

      </DashboardSection>


      {/* ================================================= */}
      {/* QUICK ACTIONS */}
      {/* ================================================= */}

      <DashboardSection
        title="Quick Access"
      >

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-4

            gap-6
          "
        >

          {[
            {
              title:
                "Appointments",
              description:
                "Manage consultations and schedules",
              icon:
                CalendarCheck,
              route:
                "/doctor/appointments",
              color:
                "bg-blue-100 text-blue-600",
            },

            {
              title:
                "Video Consultation",
              description:
                "Start online patient consultations",
              icon:
                Video,
              route:
                "/doctor/video-consultation",
              color:
                "bg-violet-100 text-violet-600",
            },

            {
              title:
                "Prescriptions",
              description:
                "Create e-prescriptions for patients",
              icon:
                Pill,
              route:
                "/doctor/prescriptions",
              color:
                "bg-emerald-100 text-emerald-600",
            },

            {
              title:
                "Patient Records",
              description:
                "Review healthcare records",
              icon:
                ClipboardPlus,
              route:
                "/doctor/patients",
              color:
                "bg-orange-100 text-orange-600",
            },
          ].map(
            (item) => {

              const Icon =
                item.icon;

              return (

                <motion.button

                  key={
                    item.title
                  }

                  whileHover={{
                    y: -4,
                  }}

                  onClick={() =>
                    navigate(
                      item.route
                    )
                  }

                  className="
                    rounded-[2rem]

                    border
                    border-slate-200

                    bg-white

                    p-6

                    text-left

                    shadow-sm

                    transition-all

                    hover:shadow-xl
                  "
                >

                  <div
                    className={`
                      mb-5

                      flex
                      h-14
                      w-14

                      items-center
                      justify-center

                      rounded-2xl

                      ${item.color}
                    `}
                  >

                    <Icon size={28} />

                  </div>

                  <h3
                    className="
                      text-xl
                      font-bold

                      text-slate-900
                    "
                  >

                    {
                      item.title
                    }

                  </h3>

                  <p
                    className="
                      mt-2

                      text-sm
                      text-slate-500
                    "
                  >

                    {
                      item.description
                    }

                  </p>

                  <div
                    className="
                      mt-5

                      flex
                      items-center
                      gap-2

                      text-primary
                      font-semibold
                    "
                  >

                    Open

                    <ArrowRight
                      size={18}
                    />

                  </div>

                </motion.button>

              );

            }
          )}

        </div>

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
            2xl:grid-cols-3

            gap-6
          "
        >

          {/* AREA */}

          <motion.div

            whileHover={{
              y: -4,
            }}

            className="
              rounded-[2rem]

              border
              border-slate-200

              bg-white

              p-4
              md:p-6

              shadow-sm

              min-w-0
            "
          >

            <h3
              className="
                mb-6

                text-xl
                font-bold

                text-slate-900
              "
            >

              Appointment Analytics

            </h3>

            <div className="h-[300px]">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <AreaChart
                  data={
                    overviewChartData
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


          {/* PIE */}

          <motion.div

            whileHover={{
              y: -4,
            }}

            className="
              rounded-[2rem]

              border
              border-slate-200

              bg-white

              p-4
              md:p-6

              shadow-sm

              min-w-0
            "
          >

            <h3
              className="
                mb-6

                text-xl
                font-bold

                text-slate-900
              "
            >

              Consultation Status

            </h3>

            <div className="h-[300px]">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <PieChart>

                  <Pie
                    data={
                      overviewChartData
                    }
                    dataKey="value"
                    outerRadius={95}
                    label
                  >

                    <Cell fill="#FACC15" />
                    <Cell fill="#10B981" />
                    <Cell fill="#3B82F6" />
                    <Cell fill="#EF4444" />

                  </Pie>

                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </motion.div>


          {/* BAR */}

          <motion.div

            whileHover={{
              y: -4,
            }}

            className="
              rounded-[2rem]

              border
              border-slate-200

              bg-white

              p-4
              md:p-6

              shadow-sm

              min-w-0
            "
          >

            <h3
              className="
                mb-6

                text-xl
                font-bold

                text-slate-900
              "
            >

              Weekly Consultations

            </h3>

            <div className="h-[300px]">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart
                  data={weeklyData}
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
                    dataKey="appointments"
                    fill="#6366F1"
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
      {/* RECENT APPOINTMENTS */}
      {/* ================================================= */}

      <DashboardSection
        title="Recent Appointments"
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

              items-start
              lg:items-center

              justify-between

              gap-4

              border-b
              border-slate-200

              p-5
              md:p-6
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

                Appointment Records

              </h2>

              <p
                className="
                  mt-1

                  text-sm
                  text-slate-500
                "
              >

                Monitor consultations and patient schedules.

              </p>

            </div>

            <div
              className="
                relative

                w-full
                lg:w-96
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


          {/* APPOINTMENTS */}

          <div
            className="
              grid
              grid-cols-1
              xl:grid-cols-2

              gap-5

              p-5
              md:p-6
            "
          >

            {paginatedAppointments.map(
              (
                appointment
              ) => (

                <motion.div

                  key={
                    appointment.id
                  }

                  whileHover={{
                    y: -4,
                  }}

                  className="
                    rounded-[1.8rem]

                    border
                    border-slate-200

                    bg-slate-50/80

                    p-5

                    transition-all

                    hover:shadow-lg
                  "
                >

                  {/* TOP */}

                  <div
                    className="
                      flex
                      items-start
                      justify-between

                      gap-4
                    "
                  >

                    <div
                      className="
                        flex
                        items-start
                        gap-4
                      "
                    >

                      <div
                        className="
                          flex
                          h-14
                          w-14

                          shrink-0

                          items-center
                          justify-center

                          rounded-2xl

                          bg-primary/10

                          text-primary
                        "
                      >

                        <Users
                          size={26}
                        />

                      </div>

                      <div>

                        <h3
                          className="
                            text-lg
                            md:text-xl

                            font-bold

                            text-slate-900
                          "
                        >

                          {
                            appointment.patient_name
                          }

                        </h3>

                        <p
                          className="
                            mt-1

                            text-sm
                            text-slate-500
                          "
                        >

                          {
                            appointment.reason
                          }

                        </p>

                      </div>

                    </div>

                    <div
                      className={`
                        rounded-full

                        px-4
                        py-2

                        text-xs
                        font-bold

                        ${getStatusStyles(
                          appointment.status
                        )}
                      `}
                    >

                      {
                        appointment.status
                      }

                    </div>

                  </div>


                  {/* DETAILS */}

                  <div
                    className="
                      mt-6

                      grid
                      grid-cols-2

                      gap-4
                    "
                  >

                    <div
                      className="
                        rounded-2xl

                        border
                        border-slate-100

                        bg-white

                        p-4
                      "
                    >

                      <p
                        className="
                          text-xs
                          font-semibold

                          uppercase

                          text-slate-400
                        "
                      >

                        Appointment Date

                      </p>

                      <h4
                        className="
                          mt-2

                          font-bold

                          text-slate-900
                        "
                      >

                        {
                          appointment.date
                        }

                      </h4>

                    </div>

                    <div
                      className="
                        rounded-2xl

                        border
                        border-slate-100

                        bg-white

                        p-4
                      "
                    >

                      <p
                        className="
                          text-xs
                          font-semibold

                          uppercase

                          text-slate-400
                        "
                      >

                        Appointment Time

                      </p>

                      <h4
                        className="
                          mt-2

                          font-bold

                          text-slate-900
                        "
                      >

                        {
                          appointment.time
                        }

                      </h4>

                    </div>

                  </div>


                  {/* ACTIONS */}

                  <div
                    className="
                      mt-6

                      flex
                      flex-wrap

                      gap-3
                    "
                  >

                    <button

                      onClick={() =>
                        navigate(
                          "/doctor/appointments"
                        )
                      }

                      className="
                        flex
                        items-center
                        gap-2

                        rounded-2xl

                        bg-primary

                        px-4
                        py-3

                        text-sm
                        font-semibold

                        text-white
                      "
                    >

                      <CalendarCheck
                        size={16}
                      />

                      Manage

                    </button>

                    <button
                      className="
                        flex
                        items-center
                        gap-2

                        rounded-2xl

                        border
                        border-slate-200

                        bg-white

                        px-4
                        py-3

                        text-sm
                        font-semibold

                        text-slate-700
                      "
                    >

                      <Video
                        size={16}
                      />

                      Video

                    </button>

                    <button
                      className="
                        flex
                        items-center
                        gap-2

                        rounded-2xl

                        border
                        border-slate-200

                        bg-white

                        px-4
                        py-3

                        text-sm
                        font-semibold

                        text-slate-700
                      "
                    >

                      <Pill
                        size={16}
                      />

                      Prescription

                    </button>

                  </div>

                </motion.div>

              )
            )}

          </div>


          {/* EMPTY */}

          {!paginatedAppointments.length && (

            <div className="p-10">

              <div
                className="
                  flex
                  flex-col

                  items-center
                  justify-center

                  text-center
                "
              >

                <CalendarDays
                  size={60}

                  className="
                    text-slate-300
                  "
                />

                <h3
                  className="
                    mt-4

                    text-2xl
                    font-bold

                    text-slate-700
                  "
                >

                  No Appointments Found

                </h3>

                <p
                  className="
                    mt-2

                    text-slate-500
                  "
                >

                  No appointments match your current search.

                </p>

              </div>

            </div>

          )}


          {/* PAGINATION */}

          {filteredAppointments.length >
            ITEMS_PER_PAGE && (

            <div
              className="
                flex
                flex-col
                md:flex-row

                items-center
                justify-between

                gap-4

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

                  px-5
                  py-3

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
                                bg-white
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

                  px-5
                  py-3

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

    </div>

  );

};

export default DoctorDashboard;
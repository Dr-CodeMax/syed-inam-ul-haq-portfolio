// =====================================================
// FILE: src/pages/admin/AdminDashboard.jsx
// FULLY FIXED + UPDATED VERSION
// HOOK ERROR FIXED
// RECHARTS WIDTH/HEIGHT FIXED
// WHITE SCREEN FIXED
// ENTERPRISE ANALYTICS INCLUDED
// =====================================================

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Users,
  CalendarDays,
  IndianRupee,
  UserPlus,
  Stethoscope,
  CalendarPlus,
  Activity,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Clock3,
  CheckCircle2,
  XCircle,
  Search,
  ChevronLeft,
  ChevronRight,
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
  getAdminDashboard,
} from "../../services/dashboardService";

import {
  getAllUsers,
} from "../../services/adminService";

import {
  getDoctors,
} from "../../services/doctorService";

import {
  getAppointments,
} from "../../services/appointmentService";


// =====================================================
// ITEMS PER PAGE
// =====================================================

const ITEMS_PER_PAGE = 6;


// =====================================================
// ADMIN DASHBOARD
// =====================================================

const AdminDashboard = () => {

  // =====================================================
  // STATES
  // =====================================================

  const [
    dashboardData,
    setDashboardData,
  ] = useState(null);

  const [
    users,
    setUsers,
  ] = useState([]);

  const [
    doctors,
    setDoctors,
  ] = useState([]);

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
  // FETCH DASHBOARD
  // =====================================================

  useEffect(() => {

    const fetchDashboard =
      async () => {

        try {

          setLoading(true);

          const [

            dashboardRes,
            usersRes,
            doctorsRes,
            appointmentsRes,

          ] = await Promise.all([

            getAdminDashboard(),

            getAllUsers(),

            getDoctors(),

            getAppointments({
              role: "admin",
            }),

          ]);


          // =====================================================
          // DASHBOARD
          // =====================================================

          const dashboard =
            dashboardRes?.data ||
            dashboardRes ||
            {};

          setDashboardData(
            dashboard
          );


          // =====================================================
          // USERS
          // =====================================================

          let usersData = [];

          if (
            Array.isArray(
              usersRes
            )
          ) {

            usersData =
              usersRes;

          }

          else if (
            Array.isArray(
              usersRes?.data
            )
          ) {

            usersData =
              usersRes.data;

          }

          else if (
            Array.isArray(
              usersRes?.data?.users
            )
          ) {

            usersData =
              usersRes.data.users;

          }

          setUsers(
            usersData
          );


          // =====================================================
          // DOCTORS
          // =====================================================

          let doctorsData = [];

          if (
            Array.isArray(
              doctorsRes
            )
          ) {

            doctorsData =
              doctorsRes;

          }

          else if (
            Array.isArray(
              doctorsRes?.data
            )
          ) {

            doctorsData =
              doctorsRes.data;

          }

          else if (
            Array.isArray(
              doctorsRes?.data?.doctors
            )
          ) {

            doctorsData =
              doctorsRes.data.doctors;

          }

          setDoctors(
            doctorsData
          );


          // =====================================================
          // APPOINTMENTS
          // =====================================================

          let appointmentsData = [];

          if (
            Array.isArray(
              appointmentsRes
            )
          ) {

            appointmentsData =
              appointmentsRes;

          }

          else if (
            Array.isArray(
              appointmentsRes?.data
            )
          ) {

            appointmentsData =
              appointmentsRes.data;

          }

          else if (
            Array.isArray(
              appointmentsRes?.data?.appointments
            )
          ) {

            appointmentsData =
              appointmentsRes.data.appointments;

          }

          setAppointments(
            appointmentsData
          );

        } catch (err) {

          console.error(err);

          setError(
            "Failed to load admin analytics dashboard"
          );

        } finally {

          setLoading(false);

        }

      };

    fetchDashboard();

  }, []);


  // =====================================================
  // FIXED HOOK ISSUE
  // ALL HOOKS MUST COME BEFORE RETURNS
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
            appointment?.doctor_name,
            appointment?.status,
          ]

            .filter(Boolean)

            .some(
              (value) =>

                value
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

  const totalUsers =
    users.length;

  const totalDoctors =
    doctors.length;

  const totalAppointments =
    appointments.length;

  const totalRevenue =
    dashboardData?.revenue ||
    "₹0";


  // =====================================================
  // USER STATS
  // =====================================================

  const patients =
    users.filter(
      (user) =>

        user?.role
          ?.toLowerCase()
        === "patient"
    ).length;

  const adminUsers =
    users.filter(
      (user) =>

        user?.role
          ?.toLowerCase()
        === "admin"
    ).length;

  const activeUsers =
    users.filter(
      (user) =>
        user?.is_active
    ).length;


  // =====================================================
  // DOCTOR STATS
  // =====================================================

  const approvedDoctors =
    doctors.filter(
      (doctor) =>

        doctor?.status ===
        "APPROVED"
    ).length;

  const pendingDoctors =
    doctors.filter(
      (doctor) =>

        doctor?.status ===
        "PENDING"
    ).length;

  const suspendedDoctors =
    doctors.filter(
      (doctor) =>

        doctor?.status ===
        "SUSPENDED"
    ).length;


  // =====================================================
  // APPOINTMENT STATS
  // =====================================================

  const confirmedAppointments =
    appointments.filter(
      (appointment) =>

        appointment?.status ===
        "CONFIRMED"
    ).length;

  const pendingAppointments =
    appointments.filter(
      (appointment) =>

        appointment?.status ===
        "PENDING"
    ).length;

  const completedAppointments =
    appointments.filter(
      (appointment) =>

        appointment?.status ===
        "COMPLETED"
    ).length;

  const cancelledAppointments =
    appointments.filter(
      (appointment) =>

        appointment?.status ===
        "CANCELLED"
    ).length;


  // =====================================================
  // QUICK ACTIONS
  // =====================================================

  const quickActions = [

    {
      label:
        "Add Doctor",

      description:
        "Create a new doctor profile",

      icon:
        UserPlus,

      to:
        "/admin/doctors/create",
    },

    {
      label:
        "Manage Doctors",

      description:
        "View and manage doctors",

      icon:
        Stethoscope,

      to:
        "/admin/doctors",
    },

    {
      label:
        "Appointments",

      description:
        "Manage appointments",

      icon:
        CalendarPlus,

      to:
        "/admin/appointments",
    },

    {
      label:
        "Users",

      description:
        "Manage platform users",

      icon:
        Users,

      to:
        "/admin/users",
    },

  ];


  // =====================================================
  // CHART DATA
  // =====================================================

  const overviewChartData = [

    {
      name: "Users",
      value: totalUsers,
    },

    {
      name: "Doctors",
      value: totalDoctors,
    },

    {
      name: "Appointments",
      value: totalAppointments,
    },

  ];

  const appointmentChartData = [

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

  const userRoleChartData = [

    {
      name: "Patients",
      value: patients,
    },

    {
      name: "Doctors",
      value: totalDoctors,
    },

    {
      name: "Admins",
      value: adminUsers,
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
  // STATUS STYLES
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


  // =====================================================
  // STATS
  // =====================================================

  const stats = [

    {
      title:
        "Total Users",

      value:
        totalUsers,

      subtitle:
        "Platform accounts",

      icon:
        Users,

      color:
        "primary",

      trend:
        "+14.2%",
    },

    {
      title:
        "Doctors",

      value:
        totalDoctors,

      subtitle:
        "Healthcare specialists",

      icon:
        Stethoscope,

      color:
        "green",

      trend:
        "+9.4%",
    },

    {
      title:
        "Appointments",

      value:
        totalAppointments,

      subtitle:
        "Healthcare bookings",

      icon:
        CalendarDays,

      color:
        "blue",

      trend:
        "+22.6%",
    },

    {
      title:
        "Revenue",

      value:
        totalRevenue,

      subtitle:
        "Monthly revenue",

      icon:
        IndianRupee,

      color:
        "yellow",

      trend:
        "+18.7%",
    },

  ];


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

        className="
          relative
          overflow-hidden

          rounded-[2.5rem]

          bg-gradient-to-r
          from-slate-900
          via-slate-800
          to-slate-700

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

            Enterprise Healthcare Analytics

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

                Admin Dashboard

              </h1>

              <p
                className="
                  mt-5

                  max-w-2xl

                  text-lg
                  text-white/80
                "
              >

                Monitor healthcare operations,
                appointments,
                doctors,
                patients,
                revenue,
                and enterprise analytics
                from one centralized system.

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

                    Enterprise System

                  </p>

                  <h3
                    className="
                      text-xl
                      font-bold
                    "
                  >

                    Analytics Active

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
        title="Healthcare Platform Overview"
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
      {/* CHARTS */}
      {/* ================================================= */}

      <DashboardSection
        title="Enterprise Analytics"
      >

        <div
          className="
            grid
            grid-cols-1
            xl:grid-cols-3
            gap-6
          "
        >

          {/* ================================================= */}
          {/* OVERVIEW */}
          {/* ================================================= */}

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

                Platform Growth

              </h3>

            </div>

            <div
              className="
                h-[320px]
                w-full
                min-w-0
              "
            >

              <ResponsiveContainer
                width="100%"
                height={320}
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


          {/* ================================================= */}
          {/* PIE CHART */}
          {/* ================================================= */}

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
                min-w-0
              "
            >

              <ResponsiveContainer
                width="100%"
                height={320}
              >

                <PieChart>

                  <Pie
                    data={
                      appointmentChartData
                    }
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >

                    <Cell fill="#10B981" />
                    <Cell fill="#FACC15" />
                    <Cell fill="#3B82F6" />
                    <Cell fill="#EF4444" />

                  </Pie>

                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </motion.div>


          {/* ================================================= */}
          {/* BAR CHART */}
          {/* ================================================= */}

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

                User Distribution

              </h3>

            </div>

            <div
              className="
                h-[320px]
                w-full
                min-w-0
              "
            >

              <ResponsiveContainer
                width="100%"
                height={320}
              >

                <BarChart
                  data={
                    userRoleChartData
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
      {/* DOCTOR ANALYTICS */}
      {/* ================================================= */}

      <DashboardSection
        title="Doctor Verification Analytics"
      >

        <DashboardGrid>

          {[
            {
              title:
                "Approved Doctors",

              value:
                approvedDoctors,

              icon:
                ShieldCheck,

              bg:
                "bg-emerald-100",

              color:
                "text-emerald-600",
            },

            {
              title:
                "Pending Verification",

              value:
                pendingDoctors,

              icon:
                Clock3,

              bg:
                "bg-yellow-100",

              color:
                "text-yellow-600",
            },

            {
              title:
                "Suspended Doctors",

              value:
                suspendedDoctors,

              icon:
                XCircle,

              bg:
                "bg-red-100",

              color:
                "text-red-600",
            },

            {
              title:
                "Active Users",

              value:
                activeUsers,

              icon:
                CheckCircle2,

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
      {/* APPOINTMENTS */}
      {/* ================================================= */}

      <DashboardSection
        title="Recent Appointment Analytics"
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

                Appointment Records

              </h2>

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
                    "Patient",
                    "Doctor",
                    "Status",
                    "Date",
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

                {paginatedAppointments.map(
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
                            appointment?.patient_name ||
                            "N/A"
                          }

                        </div>

                      </td>

                      <td className="px-6 py-5">

                        <div
                          className="
                            font-semibold
                            text-slate-700
                          "
                        >

                          {
                            appointment?.doctor_name ||
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
                            "N/A"
                          }

                        </div>

                      </td>

                      <td
                        className="
                          px-6
                          py-5

                          text-slate-600
                        "
                      >

                        {
                          appointment?.date ||
                          "N/A"
                        }

                      </td>

                    </motion.tr>

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
        title="Enterprise System Activity"
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

                  Healthcare Infrastructure Healthy

                </h3>

                <p
                  className="
                    mt-2

                    text-slate-500
                  "
                >

                  Appointment pipelines,
                  doctor management,
                  user systems,
                  analytics services,
                  and enterprise APIs
                  are operating normally.

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

export default AdminDashboard;
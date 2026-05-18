// =====================================================
// FILE: src/pages/doctor/DoctorAppointments.jsx
// FULLY UPDATED ENTERPRISE VERSION
// MODERN RESPONSIVE UI/UX
// CLEAN APPOINTMENT CARDS
// VIDEO CONSULTATION
// E-PRESCRIPTION
// DOCTOR NOTES
// RESCHEDULE + CANCELLATION NOTES
// SMART COMPLETE BUTTON
// RESPONSIVE ANALYTICS
// =====================================================

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import toast
from "react-hot-toast";

import {
  CalendarDays,
  Clock3,
  CheckCircle2,
  Users,
  Activity,
  Sparkles,
  Search,
  Video,
  FileText,
  ClipboardPlus,
  Check,
  XCircle,
  RotateCcw,
  Stethoscope,
  CalendarCheck,
  TimerReset,
  Pill,
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
} from "recharts";

import SectionHeader
from "../../components/ui/SectionHeader";

import PageLoader
from "../../components/ui/PageLoader";

import EmptyAppointments
from "../../components/appointments/EmptyAppointments";

import {
  getAppointments,
  updateAppointment,
} from "../../services/appointmentService";


// =====================================================
// ITEMS PER PAGE
// =====================================================

const ITEMS_PER_PAGE = 6;


// =====================================================
// DOCTOR APPOINTMENTS
// =====================================================

const DoctorAppointments = () => {

  // =====================================================
  // STATES
  // =====================================================

  const [
    appointments,
    setAppointments,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("ALL");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    selectedAppointment,
    setSelectedAppointment,
  ] = useState(null);

  const [
    noteModal,
    setNoteModal,
  ] = useState(false);

  const [
    actionType,
    setActionType,
  ] = useState("");

  const [
    actionNote,
    setActionNote,
  ] = useState("");

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);


  // =====================================================
  // NORMALIZE
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

        reason:
          appointment?.reason ||
          "General Consultation",

        priority:
          appointment?.priority ||
          "NORMAL",

        status:
          appointment?.status ||
          "PENDING",

        doctor_note:
          appointment?.doctor_note ||
          "",

        prescription:
          appointment?.prescription ||
          "",

        video_link:
          appointment?.video_link ||
          "",

      };

    };


  // =====================================================
  // DATE TIME
  // =====================================================

  const getAppointmentDateTime =
    (appointment) => {

      return new Date(
        `${appointment.date} ${appointment.time}`
      );

    };


  // =====================================================
  // CHECK COMPLETE
  // =====================================================

  const canCompleteAppointment =
    (appointment) => {

      const now =
        new Date();

      const appointmentDate =
        getAppointmentDateTime(
          appointment
        );

      return (
        appointmentDate <= now
      );

    };


  // =====================================================
  // AUTO COMPLETE
  // =====================================================

  const autoCompleteAppointments =
    async (
      appointmentsList
    ) => {

      const now =
        new Date();

      const expiredAppointments =
        appointmentsList.filter(
          (appointment) => {

            const appointmentTime =
              getAppointmentDateTime(
                appointment
              );

            return (

              [
                "CONFIRMED",
              ].includes(
                appointment.status
              ) &&

              appointmentTime < now

            );

          }
        );

      if (
        !expiredAppointments.length
      ) {

        return;

      }

      try {

        await Promise.all(

          expiredAppointments.map(
            (appointment) =>

              updateAppointment(
                appointment.id,
                {
                  status:
                    "COMPLETED",
                }
              )
          )
        );

      } catch (err) {

        console.error(err);

      }

    };


  // =====================================================
  // FETCH
  // =====================================================

  const fetchAppointments =
    async () => {

      try {

        setLoading(true);

        const response =
          await getAppointments({
            role: "doctor",
          });

        const rawData =

          Array.isArray(response)

            ? response

            : response?.data || [];

        const normalized =
          rawData.map(
            normalizeAppointment
          );

        setAppointments(
          normalized
        );

        await autoCompleteAppointments(
          normalized
        );

      } catch (err) {

        console.error(err);

        toast.error(
          "Failed to load appointments"
        );

      } finally {

        setLoading(false);

      }

    };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    fetchAppointments();

  }, []);


  // =====================================================
  // AUTO REFRESH
  // =====================================================

  useEffect(() => {

    const interval =
      setInterval(() => {

        autoCompleteAppointments(
          appointments
        );

      }, 60000);

    return () =>
      clearInterval(interval);

  }, [appointments]);


  // =====================================================
  // HANDLE ACTION
  // =====================================================

  const handleAppointmentAction =
    async (
      appointment,
      status
    ) => {

      try {

        const payload = {

          status,

          doctor_note:
            actionNote,

        };

        await updateAppointment(
          appointment.id,
          payload
        );

        setAppointments(
          (prev) =>
            prev.map(
              (item) =>

                item.id ===
                appointment.id

                  ? {
                      ...item,
                      status,
                      doctor_note:
                        actionNote,
                    }

                  : item
            )
        );

        toast.success(
          `Appointment ${status.toLowerCase()}`
        );

        setNoteModal(false);

        setActionNote("");

      } catch (err) {

        console.error(err);

        toast.error(
          "Action failed"
        );

      }

    };


  // =====================================================
  // FILTERED
  // =====================================================

  const filteredAppointments =
    useMemo(() => {

      return appointments.filter(
        (appointment) => {

          const matchesStatus =

            statusFilter ===
            "ALL"

              ? true

              : appointment.status ===
                statusFilter;

          const matchesSearch =

            [
              appointment.patient_name,
              appointment.reason,
              appointment.status,
            ]

              .join(" ")

              .toLowerCase()

              .includes(
                search.toLowerCase()
              );

          return (
            matchesStatus &&
            matchesSearch
          );

        }
      );

    }, [
      appointments,
      statusFilter,
      search,
    ]);


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
  // STATS
  // =====================================================

  const totalAppointments =
    appointments.length;

  const confirmedAppointments =
    appointments.filter(
      (appointment) =>

        appointment.status ===
        "CONFIRMED"
    ).length;

  const pendingAppointments =
    appointments.filter(
      (appointment) =>

        appointment.status ===
        "PENDING"
    ).length;

  const completedAppointments =
    appointments.filter(
      (appointment) =>

        appointment.status ===
        "COMPLETED"
    ).length;

  const cancelledAppointments =
    appointments.filter(
      (appointment) =>

        appointment.status ===
        "CANCELLED"
    ).length;


  // =====================================================
  // CHART DATA
  // =====================================================

  const overviewData = [

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
  // LOADING
  // =====================================================

  if (loading) {

    return <PageLoader />;

  }


  // =====================================================
  // EMPTY
  // =====================================================

  if (!appointments.length) {

    return (

      <EmptyAppointments
        message="
No appointments assigned yet.
        "
      />

    );

  }


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
              inline-flex
              items-center
              gap-2

              rounded-full

              bg-white/10

              px-4
              py-2

              text-sm
              font-medium

              backdrop-blur-md

              mb-6
            "
          >

            <Sparkles size={16} />

            Healthcare Consultation Center

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
                  md:text-5xl

                  font-black
                "
              >

                Doctor Appointments

              </h1>

              <p
                className="
                  mt-5

                  max-w-2xl

                  text-base
                  md:text-lg

                  text-white/90
                "
              >

                Manage consultations,
                schedules,
                video appointments,
                e-prescriptions,
                patient notes,
                and healthcare workflows
                from one enterprise system.

              </p>

            </div>

            <div
              className="
                rounded-3xl

                border
                border-white/20

                bg-white/10

                p-6

                backdrop-blur-xl
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

                    Live Monitoring

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

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-4

          gap-6
        "
      >

        {[
          {
            title: "Total",
            value:
              totalAppointments,
            icon:
              CalendarDays,
            color:
              "bg-blue-100 text-blue-600",
          },

          {
            title: "Confirmed",
            value:
              confirmedAppointments,
            icon:
              CheckCircle2,
            color:
              "bg-emerald-100 text-emerald-600",
          },

          {
            title: "Pending",
            value:
              pendingAppointments,
            icon:
              TimerReset,
            color:
              "bg-yellow-100 text-yellow-600",
          },

          {
            title: "Completed",
            value:
              completedAppointments,
            icon:
              Users,
            color:
              "bg-violet-100 text-violet-600",
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

                      ${item.color}
                    `}
                  >

                    <Icon size={28} />

                  </div>

                </div>

              </motion.div>

            );

          }
        )}

      </div>


      {/* ================================================= */}
      {/* ANALYTICS */}
      {/* ================================================= */}

      <div
        className="
          grid
          grid-cols-1
          2xl:grid-cols-3

          gap-6
        "
      >

        {/* AREA */}

        <div
          className="
            rounded-[2rem]

            border
            border-slate-200

            bg-white

            p-6

            shadow-sm
          "
        >

          <h2
            className="
              mb-6

              text-2xl
              font-bold

              text-slate-900
            "
          >

            Appointment Analytics

          </h2>

          <div className="h-[300px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <AreaChart
                data={
                  overviewData
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

        </div>


        {/* PIE */}

        <div
          className="
            rounded-[2rem]

            border
            border-slate-200

            bg-white

            p-6

            shadow-sm
          "
        >

          <h2
            className="
              mb-6

              text-2xl
              font-bold

              text-slate-900
            "
          >

            Consultation Status

          </h2>

          <div className="h-[300px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <PieChart>

                <Pie
                  data={overviewData}
                  dataKey="value"
                  outerRadius={100}
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

        </div>


        {/* BAR */}

        <div
          className="
            rounded-[2rem]

            border
            border-slate-200

            bg-white

            p-6

            shadow-sm
          "
        >

          <h2
            className="
              mb-6

              text-2xl
              font-bold

              text-slate-900
            "
          >

            Weekly Consultations

          </h2>

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

        </div>

      </div>


      {/* ================================================= */}
      {/* FILTERS */}
      {/* ================================================= */}

      <div
        className="
          flex
          flex-col
          xl:flex-row

          gap-4

          items-start
          xl:items-center

          justify-between
        "
      >

        <div
          className="
            flex
            flex-wrap

            gap-3
          "
        >

          {[
            "ALL",
            "PENDING",
            "CONFIRMED",
            "COMPLETED",
            "CANCELLED",
            "RESCHEDULED",
          ].map(
            (status) => (

              <button

                key={status}

                onClick={() => {

                  setStatusFilter(
                    status
                  );

                  setCurrentPage(1);

                }}

                className={`
                  rounded-2xl

                  px-5
                  py-2.5

                  text-sm
                  font-semibold

                  transition-all

                  ${
                    statusFilter ===
                    status

                      ? `
                        bg-primary
                        text-white
                      `

                      : `
                        border
                        border-slate-200
                        bg-white
                        text-slate-600
                      `
                  }
                `}
              >

                {status}

              </button>

            )
          )}

        </div>

        <div
          className="
            relative

            w-full
            xl:w-96
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

              setCurrentPage(1);

            }}

            placeholder="
Search appointments...
            "

            className="
              w-full

              rounded-2xl

              border
              border-slate-200

              bg-white

              py-3
              pl-11
              pr-4

              outline-none

              focus:border-primary
            "
          />

        </div>

      </div>


      {/* ================================================= */}
      {/* APPOINTMENTS */}
      {/* ================================================= */}

      <div
        className="
          grid
          grid-cols-1
          2xl:grid-cols-2

          gap-6
        "
      >

        {paginatedAppointments.map(
          (appointment) => {

            const canComplete =
              canCompleteAppointment(
                appointment
              );

            return (

              <motion.div

                key={
                  appointment.id
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

                  transition-all

                  hover:shadow-xl
                "
              >

                {/* HEADER */}

                <div
                  className="
                    flex
                    flex-col
                    lg:flex-row

                    gap-5

                    justify-between
                  "
                >

                  {/* LEFT */}

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
                        h-16
                        w-16

                        shrink-0

                        items-center
                        justify-center

                        rounded-3xl

                        bg-primary/10

                        text-primary
                      "
                    >

                      <Users size={28} />

                    </div>

                    <div>

                      <h2
                        className="
                          text-2xl
                          font-bold

                          text-slate-900
                        "
                      >

                        {
                          appointment.patient_name
                        }

                      </h2>

                      <p
                        className="
                          mt-1

                          text-slate-500
                        "
                      >

                        {
                          appointment.reason
                        }

                      </p>

                    </div>

                  </div>

                  {/* STATUS */}

                  <div
                    className={`
                      inline-flex

                      h-fit

                      rounded-full

                      px-4
                      py-2

                      text-sm
                      font-bold

                      ${
                        appointment.status ===
                        "CONFIRMED"

                          ? `
                            bg-emerald-100
                            text-emerald-700
                          `

                          : appointment.status ===
                            "PENDING"

                          ? `
                            bg-yellow-100
                            text-yellow-700
                          `

                          : appointment.status ===
                            "COMPLETED"

                          ? `
                            bg-blue-100
                            text-blue-700
                          `

                          : appointment.status ===
                            "RESCHEDULED"

                          ? `
                            bg-violet-100
                            text-violet-700
                          `

                          : `
                            bg-red-100
                            text-red-700
                          `
                      }
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
                    grid-cols-1
                    md:grid-cols-3

                    gap-4
                  "
                >

                  <div
                    className="
                      rounded-2xl

                      border
                      border-slate-100

                      bg-slate-50

                      p-4
                    "
                  >

                    <p
                      className="
                        text-xs
                        font-bold

                        uppercase

                        text-slate-400
                      "
                    >

                      Date

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

                      bg-slate-50

                      p-4
                    "
                  >

                    <p
                      className="
                        text-xs
                        font-bold

                        uppercase

                        text-slate-400
                      "
                    >

                      Time

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

                  <div
                    className="
                      rounded-2xl

                      border
                      border-slate-100

                      bg-slate-50

                      p-4
                    "
                  >

                    <p
                      className="
                        text-xs
                        font-bold

                        uppercase

                        text-slate-400
                      "
                    >

                      Priority

                    </p>

                    <h4
                      className="
                        mt-2

                        font-bold

                        text-slate-900
                      "
                    >

                      {
                        appointment.priority
                      }

                    </h4>

                  </div>

                </div>


                {/* NOTES */}

                {appointment.doctor_note && (

                  <div
                    className="
                      mt-5

                      rounded-2xl

                      border
                      border-primary/10

                      bg-primary/5

                      p-4
                    "
                  >

                    <div
                      className="
                        flex
                        items-start
                        gap-3
                      "
                    >

                      <FileText
                        size={18}

                        className="
                          mt-1
                          text-primary
                        "
                      />

                      <div>

                        <h4
                          className="
                            font-bold

                            text-slate-900
                          "
                        >

                          Doctor Note

                        </h4>

                        <p
                          className="
                            mt-1

                            text-sm
                            text-slate-600
                          "
                        >

                          {
                            appointment.doctor_note
                          }

                        </p>

                      </div>

                    </div>

                  </div>

                )}


                {/* ACTIONS */}

                <div
                  className="
                    mt-6

                    flex
                    flex-wrap

                    gap-3
                  "
                >

                  {/* CONFIRM */}

                  {appointment.status ===
                    "PENDING" && (

                    <button

                      onClick={() =>
                        handleAppointmentAction(
                          appointment,
                          "CONFIRMED"
                        )
                      }

                      className="
                        flex
                        items-center
                        gap-2

                        rounded-2xl

                        bg-emerald-600

                        px-5
                        py-3

                        text-sm
                        font-semibold

                        text-white
                      "
                    >

                      <Check size={18} />

                      Confirm

                    </button>

                  )}


                  {/* RESCHEDULE */}

                  <button

                    onClick={() => {

                      setSelectedAppointment(
                        appointment
                      );

                      setActionType(
                        "RESCHEDULED"
                      );

                      setNoteModal(
                        true
                      );

                    }}

                    className="
                      flex
                      items-center
                      gap-2

                      rounded-2xl

                      bg-yellow-500

                      px-5
                      py-3

                      text-sm
                      font-semibold

                      text-white
                    "
                  >

                    <RotateCcw
                      size={18}
                    />

                    Reschedule

                  </button>


                  {/* CANCEL */}

                  <button

                    onClick={() => {

                      setSelectedAppointment(
                        appointment
                      );

                      setActionType(
                        "CANCELLED"
                      );

                      setNoteModal(
                        true
                      );

                    }}

                    className="
                      flex
                      items-center
                      gap-2

                      rounded-2xl

                      bg-red-500

                      px-5
                      py-3

                      text-sm
                      font-semibold

                      text-white
                    "
                  >

                    <XCircle
                      size={18}
                    />

                    Cancel

                  </button>


                  {/* COMPLETE */}

                  {canComplete &&

                    appointment.status !==
                      "COMPLETED" && (

                    <button

                      onClick={() =>
                        handleAppointmentAction(
                          appointment,
                          "COMPLETED"
                        )
                      }

                      className="
                        flex
                        items-center
                        gap-2

                        rounded-2xl

                        bg-blue-600

                        px-5
                        py-3

                        text-sm
                        font-semibold

                        text-white
                      "
                    >

                      <CheckCircle2
                        size={18}
                      />

                      Complete

                    </button>

                  )}


                  {/* VIDEO */}

                  <button
                    className="
                      flex
                      items-center
                      gap-2

                      rounded-2xl

                      border
                      border-slate-200

                      bg-white

                      px-5
                      py-3

                      text-sm
                      font-semibold

                      text-slate-700
                    "
                  >

                    <Video
                      size={18}
                    />

                    Video

                  </button>


                  {/* PRESCRIPTION */}

                  <button
                    className="
                      flex
                      items-center
                      gap-2

                      rounded-2xl

                      border
                      border-slate-200

                      bg-white

                      px-5
                      py-3

                      text-sm
                      font-semibold

                      text-slate-700
                    "
                  >

                    <Pill
                      size={18}
                    />

                    Prescription

                  </button>


                  {/* NOTES */}

                  <button
                    className="
                      flex
                      items-center
                      gap-2

                      rounded-2xl

                      border
                      border-slate-200

                      bg-white

                      px-5
                      py-3

                      text-sm
                      font-semibold

                      text-slate-700
                    "
                  >

                    <Stethoscope
                      size={18}
                    />

                    Notes

                  </button>

                </div>

              </motion.div>

            );

          }
        )}

      </div>


      {/* ================================================= */}
      {/* PAGINATION */}
      {/* ================================================= */}

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

              bg-white

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

              bg-white

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


      {/* ================================================= */}
      {/* NOTE MODAL */}
      {/* ================================================= */}

      {noteModal && (

        <div
          className="
            fixed
            inset-0

            z-50

            flex
            items-center
            justify-center

            bg-black/50

            p-4
          "
        >

          <div
            className="
              w-full
              max-w-xl

              rounded-[2rem]

              bg-white

              p-8
            "
          >

            <h2
              className="
                mb-6

                text-3xl
                font-black

                text-slate-900
              "
            >

              {
                actionType ===
                "RESCHEDULED"

                  ? `
                    Reschedule Appointment
                  `

                  : `
                    Cancel Appointment
                  `
              }

            </h2>

            <textarea

              value={actionNote}

              onChange={(e) =>
                setActionNote(
                  e.target.value
                )
              }

              placeholder="
Enter reason or doctor notes...
              "

              rows={5}

              className="
                w-full

                rounded-2xl

                border
                border-slate-200

                p-4

                outline-none

                focus:border-primary
              "
            />

            <div
              className="
                mt-6

                flex
                justify-end

                gap-4
              "
            >

              <button

                onClick={() =>
                  setNoteModal(false)
                }

                className="
                  rounded-2xl

                  border
                  border-slate-200

                  px-6
                  py-3

                  font-semibold
                "
              >

                Cancel

              </button>

              <button

                onClick={() =>
                  handleAppointmentAction(

                    selectedAppointment,

                    actionType
                  )
                }

                className="
                  rounded-2xl

                  bg-primary

                  px-6
                  py-3

                  font-semibold

                  text-white
                "
              >

                Save

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

};

export default DoctorAppointments;
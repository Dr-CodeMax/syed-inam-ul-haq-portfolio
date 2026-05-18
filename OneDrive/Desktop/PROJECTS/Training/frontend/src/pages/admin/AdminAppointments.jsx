// =====================================================
// FILE: src/pages/admin/AdminAppointments.jsx
// =====================================================

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  motion,
} from "framer-motion";

import toast
from "react-hot-toast";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Users,
  Sparkles,
  Activity,
  ArrowRight,
  Search,
  ChevronLeft,
  ChevronRight,
  XCircle,
  Stethoscope,
} from "lucide-react";

import DashboardSection
from "../../components/dashboard/DashboardSection";

import DashboardGrid
from "../../components/dashboard/DashboardGrid";

import PageLoader
from "../../components/ui/PageLoader";

import ErrorState
from "../../components/ui/ErrorState";

import {
  getAppointments,
} from "../../services/appointmentService";


// =====================================================
// ITEMS PER PAGE
// =====================================================

const ITEMS_PER_PAGE = 8;


// =====================================================
// ADMIN APPOINTMENTS
// =====================================================

const AdminAppointments = () => {

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
    error,
    setError,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("ALL");

  const [
    searchTerm,
    setSearchTerm,
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
          appointment.id ||
          appointment._id,

        patient_name:
          appointment.patient_name ||
          appointment.patientName,

        doctor_name:
          appointment.doctor_name ||
          appointment.doctorName,

        date:
          appointment.date ||
          appointment.appointment_date,

        time:
          appointment.time ||
          appointment.appointment_time,

      };

    };


  // =====================================================
  // FETCH APPOINTMENTS
  // =====================================================

  const fetchAppointments =
    async () => {

      try {

        setLoading(true);

        setError("");

        const response =
          await getAppointments({
            role: "admin",
          });

        const rawData =
          Array.isArray(
            response
          )

            ? response

            : response?.data || [];

        const normalized =
          rawData.map(
            normalizeAppointment
          );

        setAppointments(
          normalized
        );

      } catch (err) {

        console.error(err);

        setError(
          "Failed to load appointments"
        );

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
  // FILTERED APPOINTMENTS
  // =====================================================

  const filteredAppointments =
    useMemo(() => {

      let filtered =
        appointments;

      // STATUS FILTER

      if (
        statusFilter !==
        "ALL"
      ) {

        filtered =
          filtered.filter(
            (
              appointment
            ) =>

              appointment.status ===
              statusFilter
          );

      }

      // SEARCH FILTER

      if (
        searchTerm.trim()
      ) {

        const query =
          searchTerm
            .toLowerCase()
            .trim();

        filtered =
          filtered.filter(
            (
              appointment
            ) =>

              [
                appointment.patient_name,
                appointment.doctor_name,
                appointment.status,
              ]

                .filter(Boolean)

                .some(
                  (value) =>

                    value
                      .toLowerCase()
                      .includes(query)
                )
          );

      }

      return filtered;

    }, [
      appointments,
      statusFilter,
      searchTerm,
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
  // PAGE FIX
  // =====================================================

  useEffect(() => {

    if (
      currentPage >
      totalPages
    ) {

      setCurrentPage(
        totalPages
      );

    }

  }, [
    currentPage,
    totalPages,
  ]);


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
  // STATUS STYLE
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
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <PageLoader />
    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (
    error &&
    appointments.length === 0
  ) {

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

            w-80
            h-80

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
              backdrop-blur-md

              px-4
              py-2

              text-sm
              font-medium

              mb-6
            "
          >

            <Sparkles size={16} />

            Enterprise Appointment Management

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

                Admin Appointments

              </h1>

              <p
                className="
                  mt-5

                  max-w-2xl

                  text-lg
                  text-white/80
                "
              >

                Manage healthcare
                consultations,
                doctor schedules,
                appointment workflows,
                and enterprise patient
                operations from one
                centralized dashboard.

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

                    Appointment System

                  </p>

                  <h3
                    className="
                      text-xl
                      font-bold
                    "
                  >

                    Real-Time Monitoring

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
        title="Appointments Analytics"
      >

        <DashboardGrid>

          {[
            {
              title:
                "Total",

              value:
                totalAppointments,

              icon:
                CalendarDays,

              color:
                "primary",
            },

            {
              title:
                "Confirmed",

              value:
                confirmedAppointments,

              icon:
                CheckCircle2,

              color:
                "green",
            },

            {
              title:
                "Pending",

              value:
                pendingAppointments,

              icon:
                Clock3,

              color:
                "yellow",
            },

            {
              title:
                "Completed",

              value:
                completedAppointments,

              icon:
                Users,

              color:
                "blue",
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

                        ${
                          item.color ===
                          "primary"

                            ? `
                              bg-primary/10
                              text-primary
                            `

                            : ""
                        }

                        ${
                          item.color ===
                          "green"

                            ? `
                              bg-emerald-100
                              text-emerald-600
                            `

                            : ""
                        }

                        ${
                          item.color ===
                          "yellow"

                            ? `
                              bg-yellow-100
                              text-yellow-600
                            `

                            : ""
                        }

                        ${
                          item.color ===
                          "blue"

                            ? `
                              bg-blue-100
                              text-blue-600
                            `

                            : ""
                        }
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
      {/* TABLE */}
      {/* ================================================= */}

      <DashboardSection
        title="All Healthcare Appointments"
      >

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

              gap-5

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

              <p
                className="
                  mt-1

                  text-slate-500
                "
              >

                Enterprise healthcare
                appointment monitoring
                and scheduling management.

              </p>

            </div>


            {/* FILTERS */}

            <div
              className="
                flex
                flex-wrap

                gap-3
              "
            >

              {[
                "ALL",
                "CONFIRMED",
                "PENDING",
                "COMPLETED",
                "CANCELLED",
              ].map(
                (status) => (

                  <button

                    key={status}

                    onClick={() => {

                      setStatusFilter(
                        status
                      );

                      setCurrentPage(
                        1
                      );

                    }}

                    className={`
                      rounded-2xl

                      px-4
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

                            text-slate-700

                            hover:bg-slate-100
                          `
                      }
                    `}
                  >

                    {status}

                  </button>

                )
              )}

            </div>

          </div>


          {/* SEARCH */}

          <div
            className="
              border-b
              border-slate-200

              p-6
            "
          >

            <div
              className="
                relative

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

                value={
                  searchTerm
                }

                onChange={(
                  event
                ) => {

                  setSearchTerm(
                    event.target.value
                  );

                  setCurrentPage(
                    1
                  );

                }}

                placeholder="
                  Search patient,
                  doctor,
                  or status
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

                  transition-all

                  focus:border-primary
                  focus:ring-4
                  focus:ring-primary/10
                "
              />

            </div>

          </div>


          {/* EMPTY */}

          {filteredAppointments.length === 0 ? (

            <div
              className="
                py-20

                text-center
              "
            >

              <CalendarDays
                size={52}

                className="
                  mx-auto

                  text-slate-300
                "
              />

              <h3
                className="
                  mt-6

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

                No appointments are
                available for the
                selected filters.

              </p>

            </div>

          ) : (

            <>

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
                        "Date",
                        "Time",
                        "Status",
                      ].map(
                        (title) => (

                          <th

                            key={
                              title
                            }

                            className="
                              px-6
                              py-5

                              text-left

                              text-xs
                              font-bold

                              uppercase
                              tracking-wider

                              text-slate-500
                            "
                          >

                            {title}

                          </th>
                        )
                      )}

                    </tr>

                  </thead>

                  <tbody
                    className="
                      divide-y
                      divide-slate-100
                    "
                  >

                    {paginatedAppointments.map(
                      (
                        appointment,
                        index
                      ) => (

                        <motion.tr

                          key={
                            appointment.id
                          }

                          initial={{
                            opacity: 0,
                            y: 10,
                          }}

                          animate={{
                            opacity: 1,
                            y: 0,
                          }}

                          transition={{
                            delay:
                              index *
                              0.03,
                          }}

                          className="
                            transition-all

                            hover:bg-slate-50
                          "
                        >

                          {/* PATIENT */}

                          <td
                            className="
                              px-6
                              py-5
                            "
                          >

                            <div
                              className="
                                flex
                                items-center
                                gap-3
                              "
                            >

                              <div
                                className="
                                  flex
                                  h-11
                                  w-11

                                  items-center
                                  justify-center

                                  rounded-2xl

                                  bg-primary/10

                                  font-bold

                                  text-primary
                                "
                              >

                                {appointment
                                  ?.patient_name
                                  ?.charAt(
                                    0
                                  ) || "P"}

                              </div>

                              <div>

                                <h4
                                  className="
                                    font-bold

                                    text-slate-900
                                  "
                                >

                                  {
                                    appointment.patient_name
                                  }

                                </h4>

                                <p
                                  className="
                                    text-sm

                                    text-slate-500
                                  "
                                >

                                  Patient Account

                                </p>

                              </div>

                            </div>

                          </td>


                          {/* DOCTOR */}

                          <td
                            className="
                              px-6
                              py-5
                            "
                          >

                            <div
                              className="
                                flex
                                items-center
                                gap-3
                              "
                            >

                              <div
                                className="
                                  flex
                                  h-11
                                  w-11

                                  items-center
                                  justify-center

                                  rounded-2xl

                                  bg-emerald-100

                                  text-emerald-700
                                "
                              >

                                <Stethoscope
                                  size={18}
                                />

                              </div>

                              <div>

                                <h4
                                  className="
                                    font-bold

                                    text-slate-900
                                  "
                                >

                                  {
                                    appointment.doctor_name
                                  }

                                </h4>

                                <p
                                  className="
                                    text-sm

                                    text-slate-500
                                  "
                                >

                                  Healthcare Specialist

                                </p>

                              </div>

                            </div>

                          </td>


                          {/* DATE */}

                          <td
                            className="
                              px-6
                              py-5

                              font-medium

                              text-slate-700
                            "
                          >

                            {
                              appointment.date
                            }

                          </td>


                          {/* TIME */}

                          <td
                            className="
                              px-6
                              py-5
                            "
                          >

                            <div
                              className="
                                inline-flex
                                items-center
                                gap-2

                                rounded-full

                                bg-slate-100

                                px-4
                                py-2

                                text-sm
                                font-semibold

                                text-slate-700
                              "
                            >

                              <Clock3
                                size={15}
                              />

                              {
                                appointment.time
                              }

                            </div>

                          </td>


                          {/* STATUS */}

                          <td
                            className="
                              px-6
                              py-5
                            "
                          >

                            <div
                              className={`
                                inline-flex
                                items-center

                                rounded-full

                                px-4
                                py-2

                                text-sm
                                font-semibold

                                ${getStatusStyles(
                                  appointment.status
                                )}
                              `}
                            >

                              {
                                appointment.status
                              }

                            </div>

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
                    flex-col
                    md:flex-row

                    items-center
                    justify-between

                    gap-5

                    border-t
                    border-slate-200

                    px-6
                    py-5
                  "
                >

                  <div
                    className="
                      text-sm

                      text-slate-500
                    "
                  >

                    Showing{" "}

                    <span
                      className="
                        font-semibold

                        text-slate-700
                      "
                    >

                      {(currentPage - 1)
                        *
                        ITEMS_PER_PAGE
                        + 1}

                    </span>

                    {" "}to{" "}

                    <span
                      className="
                        font-semibold

                        text-slate-700
                      "
                    >

                      {Math.min(

                        currentPage
                        *
                        ITEMS_PER_PAGE,

                        filteredAppointments.length
                      )}

                    </span>

                    {" "}of{" "}

                    <span
                      className="
                        font-semibold

                        text-slate-700
                      "
                    >

                      {
                        filteredAppointments.length
                      }

                    </span>

                    {" "}appointments

                  </div>


                  <div
                    className="
                      flex
                      items-center

                      gap-2
                    "
                  >

                    {/* PREVIOUS */}

                    <button

                      onClick={() =>
                        setCurrentPage(
                          (
                            prev
                          ) =>

                            Math.max(
                              prev - 1,
                              1
                            )
                        )
                      }

                      disabled={
                        currentPage ===
                        1
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

                        text-sm
                        font-semibold

                        text-slate-700

                        transition-all

                        hover:bg-slate-100

                        disabled:cursor-not-allowed
                        disabled:opacity-40
                      "
                    >

                      <ChevronLeft
                        size={16}
                      />

                      Previous

                    </button>


                    {/* PAGE BUTTONS */}

                    {[...Array(
                      totalPages
                    )].map(
                      (
                        _,
                        index
                      ) => {

                        const page =
                          index + 1;

                        return (

                          <button

                            key={
                              page
                            }

                            onClick={() =>
                              setCurrentPage(
                                page
                              )
                            }

                            className={`
                              h-11
                              w-11

                              rounded-2xl

                              text-sm
                              font-bold

                              transition-all

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

                                    text-slate-700

                                    hover:bg-slate-100
                                  `
                              }
                            `}
                          >

                            {page}

                          </button>

                        );

                      }
                    )}


                    {/* NEXT */}

                    <button

                      onClick={() =>
                        setCurrentPage(
                          (
                            prev
                          ) =>

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

                        text-sm
                        font-semibold

                        text-slate-700

                        transition-all

                        hover:bg-slate-100

                        disabled:cursor-not-allowed
                        disabled:opacity-40
                      "
                    >

                      Next

                      <ChevronRight
                        size={16}
                      />

                    </button>

                  </div>

                </div>

              )}

            </>

          )}

        </motion.div>

      </DashboardSection>


      {/* ================================================= */}
      {/* SYSTEM STATUS */}
      {/* ================================================= */}

      <DashboardSection
        title="Appointment System Activity"
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

                  Healthcare Scheduling Active

                </h3>

                <p
                  className="
                    mt-2

                    text-slate-500
                  "
                >

                  Appointment pipelines,
                  healthcare scheduling,
                  consultation systems,
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

export default AdminAppointments;
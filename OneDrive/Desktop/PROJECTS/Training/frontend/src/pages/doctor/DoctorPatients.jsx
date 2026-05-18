// =====================================================
// FILE: src/pages/doctor/DoctorPatients.jsx
// FULLY UPDATED ENTERPRISE VERSION
// FIXED FUTURE DATE ISSUE
// UI MATCHED WITH DOCTOR DASHBOARD
// TABLE ARCHITECTURE MATCHED WITH ADMIN USERS
// =====================================================

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  motion,
} from "framer-motion";

import {
  Users,
  Search,
  Activity,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  CalendarDays,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Clock3,
} from "lucide-react";

import DashboardSection
from "../../components/dashboard/DashboardSection";

import DashboardGrid
from "../../components/dashboard/DashboardGrid";

import PageLoader
from "../../components/ui/PageLoader";

import EmptyState
from "../../components/ui/EmptyState";

import {
  getDoctorPatients,
} from "../../services/doctorService";


// =====================================================
// DOCTOR PATIENTS
// =====================================================

const DoctorPatients = () => {

  // =====================================================
  // STATES
  // =====================================================

  const [patients,
    setPatients] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  const [search,
    setSearch] =
    useState("");

  const [currentPage,
    setCurrentPage] =
    useState(1);

  const patientsPerPage = 8;


  // =====================================================
  // DATE FORMATTER
  // =====================================================

  const formatLastVisit = (
    dateValue
  ) => {

    if (!dateValue) {
      return "Not Available";
    }

    const parsedDate =
      new Date(dateValue);

    // INVALID DATE
    if (
      isNaN(
        parsedDate.getTime()
      )
    ) {

      return "Not Available";

    }

    // CURRENT DATE
    const today =
      new Date();

    // REMOVE TIME
    today.setHours(
      0,
      0,
      0,
      0
    );

    parsedDate.setHours(
      0,
      0,
      0,
      0
    );

    // FUTURE DATE FIX
    if (
      parsedDate > today
    ) {

      return "Upcoming Appointment";

    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  };


  // =====================================================
  // FETCH PATIENTS
  // =====================================================

  useEffect(() => {

    const fetchPatients =
      async () => {

        try {

          setLoading(true);

          const response =
            await getDoctorPatients();

          const patientsData =
            response?.data || [];

          const normalizedPatients =
            patientsData.map(
              (patient) => ({

                ...patient,

                last_appointment:
                  formatLastVisit(
                    patient?.last_appointment
                  ),

              })
            );

          setPatients(
            normalizedPatients
          );

        } catch {

          toast.error(
            "Failed to load patients"
          );

        } finally {

          setLoading(false);

        }

      };

    fetchPatients();

  }, []);


  // =====================================================
  // FILTERED PATIENTS
  // =====================================================

  const filteredPatients =
    useMemo(() => {

      const keyword =
        search
          .toLowerCase()
          .trim();

      if (!keyword)
        return patients;

      return patients.filter(
        (patient) =>

          [
            patient?.name,
            patient?.email,
            patient?.phone,
            patient?.city,
          ]

            .filter(Boolean)

            .some((value) =>
              value
                .toString()
                .toLowerCase()
                .includes(keyword)
            )
      );

    }, [
      patients,
      search,
    ]);


  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages =
    Math.ceil(
      filteredPatients.length /
      patientsPerPage
    );

  const paginatedPatients =
    useMemo(() => {

      const startIndex =
        (currentPage - 1)
        * patientsPerPage;

      const endIndex =
        startIndex +
        patientsPerPage;

      return filteredPatients.slice(
        startIndex,
        endIndex
      );

    }, [
      filteredPatients,
      currentPage,
    ]);


  // =====================================================
  // ANALYTICS
  // =====================================================

  const totalPatients =
    patients.length;

  const activePatients =
    patients.filter(
      (patient) =>
        patient?.total_appointments > 0
    ).length;

  const totalAppointments =
    patients.reduce(
      (acc, patient) =>
        acc +
        (
          patient?.total_appointments ||
          0
        ),
      0
    );

  const citiesCovered =
    new Set(
      patients
        .map(
          (patient) =>
            patient?.city
        )
        .filter(Boolean)
    ).size;


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return <PageLoader />;

  }


  // =====================================================
  // EMPTY STATE
  // =====================================================

  if (!patients.length) {

    return (

      <div className="max-w-7xl mx-auto">

        <EmptyState
          icon={Users}
          title="No patients yet"
          description="
Patients will appear here after appointments are booked.
          "
        />

      </div>

    );

  }


  // =====================================================
  // UI
  // =====================================================

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

            Healthcare Patient Management

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

                My Patients

              </h1>

              <p
                className="
                  mt-5

                  max-w-2xl

                  text-lg
                  text-white/90
                "
              >

                Manage patient records,
                appointment history,
                contact details,
                and healthcare interactions
                from one centralized
                medical dashboard.

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

                    Patient System

                  </p>

                  <h3
                    className="
                      text-xl
                      font-bold
                    "
                  >

                    Patient Records Active

                  </h3>

                </div>

              </div>

            </div>

          </div>

        </div>

      </motion.div>


      {/* ================================================= */}
      {/* ANALYTICS */}
      {/* ================================================= */}

      <DashboardSection
        title="Patient Analytics"
      >

        <DashboardGrid>

          {[
            {
              title:
                "Total Patients",
              value:
                totalPatients,
              icon:
                Users,
              bg:
                "bg-primary/10",
              color:
                "text-primary",
            },

            {
              title:
                "Active Patients",
              value:
                activePatients,
              icon:
                UserCheck,
              bg:
                "bg-emerald-100",
              color:
                "text-emerald-600",
            },

            {
              title:
                "Appointments",
              value:
                totalAppointments,
              icon:
                CalendarDays,
              bg:
                "bg-blue-100",
              color:
                "text-blue-600",
            },

            {
              title:
                "Cities Covered",
              value:
                citiesCovered,
              icon:
                MapPin,
              bg:
                "bg-orange-100",
              color:
                "text-orange-600",
            },
          ].map((item) => {

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
                        mt-2

                        text-4xl
                        font-black

                        text-slate-900
                      "
                    >

                      {item.value}

                    </h2>

                  </div>

                  <div
                    className={`
                      h-14
                      w-14

                      rounded-2xl

                      flex
                      items-center
                      justify-center

                      ${item.bg}
                      ${item.color}
                    `}
                  >

                    <Icon size={28} />

                  </div>

                </div>

              </motion.div>

            );

          })}

        </DashboardGrid>

      </DashboardSection>


      {/* ================================================= */}
      {/* PATIENTS TABLE */}
      {/* ================================================= */}

      <DashboardSection
        title="Patient Records"
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

                placeholder="
Search patients...
                "

                value={search}

                onChange={(e) => {

                  setSearch(
                    e.target.value
                  );

                  setCurrentPage(
                    1
                  );

                }}

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
                    "Contact",
                    "City",
                    "Appointments",
                    "Last Visit",
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
                          tracking-wider

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

                {paginatedPatients.length > 0 ? (

                  paginatedPatients.map(
                    (
                      patient,
                      index
                    ) => (

                      <motion.tr

                        key={patient?.id}

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
                            index * 0.03,
                        }}

                        className="
                          border-t
                          border-slate-100

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
                              gap-4
                            "
                          >

                            <div
                              className="
                                flex
                                h-12
                                w-12

                                items-center
                                justify-center

                                rounded-2xl

                                bg-primary/10

                                font-bold

                                text-primary
                              "
                            >

                              {patient?.name
                                ?.charAt(0)
                                ?.toUpperCase()}

                            </div>

                            <div>

                              <h4
                                className="
                                  font-bold
                                  text-slate-900
                                "
                              >

                                {patient?.name}

                              </h4>

                              <p
                                className="
                                  text-sm
                                  text-slate-500
                                "
                              >

                                Patient ID #
                                {patient?.id}

                              </p>

                            </div>

                          </div>

                        </td>


                        {/* CONTACT */}

                        <td
                          className="
                            px-6
                            py-5
                          "
                        >

                          <div
                            className="
                              space-y-2
                            "
                          >

                            <div
                              className="
                                flex
                                items-center
                                gap-2

                                text-sm
                                text-slate-600
                              "
                            >

                              <Mail size={15} />

                              {
                                patient?.email
                              }

                            </div>

                            <div
                              className="
                                flex
                                items-center
                                gap-2

                                text-sm
                                text-slate-600
                              "
                            >

                              <Phone size={15} />

                              {patient?.phone ||
                                "No phone"}

                            </div>

                          </div>

                        </td>


                        {/* CITY */}

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

                            <MapPin
                              size={15}
                            />

                            {patient?.city ||
                              "Not Added"}

                          </div>

                        </td>


                        {/* APPOINTMENTS */}

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

                              bg-emerald-100

                              px-4
                              py-2

                              text-sm
                              font-bold

                              text-emerald-700
                            "
                          >

                            <CalendarDays
                              size={15}
                            />

                            {
                              patient?.total_appointments
                            }

                          </div>

                        </td>


                        {/* LAST VISIT */}

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

                              bg-blue-100

                              px-4
                              py-2

                              text-sm
                              font-semibold

                              text-blue-700
                            "
                          >

                            <Clock3
                              size={15}
                            />

                            {patient?.last_appointment}

                          </div>

                        </td>

                      </motion.tr>

                    )
                  )

                ) : (

                  <tr>

                    <td
                      colSpan="5"

                      className="
                        py-14

                        text-center

                        text-slate-500
                      "
                    >

                      No patients found

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>


          {/* ================================================= */}
          {/* PAGINATION */}
          {/* ================================================= */}

          {filteredPatients.length >
            patientsPerPage && (

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
                    * patientsPerPage + 1}

                </span>

                {" "}to{" "}

                <span
                  className="
                    font-semibold
                    text-slate-700
                  "
                >

                  {Math.min(
                    currentPage *
                    patientsPerPage,
                    filteredPatients.length
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
                    filteredPatients.length
                  }

                </span>

                {" "}patients

              </div>


              <div
                className="
                  flex
                  items-center
                  gap-2
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

                    text-sm
                    font-semibold

                    text-slate-700

                    transition-all

                    hover:bg-slate-100

                    disabled:opacity-40
                  "
                >

                  <ChevronLeft
                    size={16}
                  />

                  Previous

                </button>


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

                    text-sm
                    font-semibold

                    text-slate-700

                    transition-all

                    hover:bg-slate-100

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

        </motion.div>

      </DashboardSection>

    </div>

  );

};

export default DoctorPatients;
// =========================================================
// FILE: src/pages/admin/AdminDoctors.jsx
// =========================================================

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  CheckCircle2,
  XCircle,
  ShieldAlert,
  Clock3,
  Search,
  Sparkles,
  Activity,
  Stethoscope,
  IndianRupee,
  BadgeCheck,
  UserRound,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Eye,
  X,
  Mail,
  GraduationCap,
  BriefcaseMedical,
} from "lucide-react";

import toast from "react-hot-toast";

import {
  getAllDoctors,
  approveDoctor,
  rejectDoctor,
  suspendDoctor,
  reactivateDoctor,
} from "../../api/adminApi";

import DashboardSection
from "../../components/dashboard/DashboardSection";

import DashboardGrid
from "../../components/dashboard/DashboardGrid";

import PageLoader
from "../../components/ui/PageLoader";

import ErrorState
from "../../components/ui/ErrorState";


// =========================================================
// ADMIN DOCTORS
// =========================================================

const AdminDoctors = () => {

  // =====================================================
  // STATES
  // =====================================================

  const [doctors, setDoctors] =
    useState([]);

  const [filteredDoctors,
    setFilteredDoctors] =
    useState([]);

  const [selectedDoctor,
    setSelectedDoctor] =
    useState(null);

  const [showModal,
    setShowModal] =
    useState(false);

  const [loading,
    setLoading] =
    useState(true);

  const [actionLoading,
    setActionLoading] =
    useState(false);

  const [error,
    setError] =
    useState("");

  const [search,
    setSearch] =
    useState("");

  const [currentPage,
    setCurrentPage] =
    useState(1);

  const doctorsPerPage = 8;


  // =====================================================
  // FETCH
  // =====================================================

  useEffect(() => {

    fetchDoctors();

  }, []);


  // =====================================================
  // FILTER
  // =====================================================

  useEffect(() => {

    const keyword =
      search.toLowerCase();

    const filtered =
      doctors.filter(
        (doctor) => (

          doctor?.name
            ?.toLowerCase()
            ?.includes(keyword)

          ||

          doctor?.email
            ?.toLowerCase()
            ?.includes(keyword)

          ||

          doctor?.specialization
            ?.toLowerCase()
            ?.includes(keyword)

          ||

          doctor?.qualification
            ?.toLowerCase()
            ?.includes(keyword)

          ||

          doctor?.status
            ?.toLowerCase()
            ?.includes(keyword)
        )
      );

    setFilteredDoctors(
      filtered
    );

    setCurrentPage(1);

  }, [search, doctors]);


  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages =
    Math.ceil(
      filteredDoctors.length /
      doctorsPerPage
    );

  const paginatedDoctors =
    useMemo(() => {

      const startIndex =
        (currentPage - 1)
        * doctorsPerPage;

      const endIndex =
        startIndex +
        doctorsPerPage;

      return filteredDoctors.slice(
        startIndex,
        endIndex
      );

    }, [
      filteredDoctors,
      currentPage,
    ]);


  // =====================================================
  // FETCH DOCTORS
  // =====================================================

  const fetchDoctors = async () => {

    try {

      setLoading(true);

      setError("");

      const response =
        await getAllDoctors();

      let doctorsData = [];

      if (
        Array.isArray(response)
      ) {

        doctorsData = response;

      } else if (
        Array.isArray(response?.data)
      ) {

        doctorsData =
          response.data;

      } else if (
        Array.isArray(response?.data?.data)
      ) {

        doctorsData =
          response.data.data;

      } else if (
        Array.isArray(response?.data?.doctors)
      ) {

        doctorsData =
          response.data.doctors;
      }

      setDoctors(doctorsData);

    } catch (error) {

      console.log(error);

      setError(
        "Failed to load doctors"
      );

      setDoctors([]);

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // OPEN MODAL
  // =====================================================

  const handleRowClick = (
    doctor
  ) => {

    setSelectedDoctor(
      doctor
    );

    setShowModal(true);

  };


  // =====================================================
  // ACTION HANDLER
  // =====================================================

  const handleAction = async (
    action,
    doctorId
  ) => {

    try {

      setActionLoading(true);

      if (
        action === "approve"
      ) {

        await approveDoctor(
          doctorId
        );

        toast.success(
          "Doctor approved successfully"
        );
      }

      else if (
        action === "reject"
      ) {

        await rejectDoctor(
          doctorId
        );

        toast.success(
          "Doctor rejected"
        );
      }

      else if (
        action === "suspend"
      ) {

        await suspendDoctor(
          doctorId
        );

        toast.success(
          "Doctor suspended"
        );
      }

      else if (
        action === "reactivate"
      ) {

        await reactivateDoctor(
          doctorId
        );

        toast.success(
          "Doctor reactivated"
        );
      }

      await fetchDoctors();

      setShowModal(false);

    } catch (error) {

      console.log(error);

      toast.error(
        "Action failed"
      );

    } finally {

      setActionLoading(false);

    }

  };


  // =====================================================
  // STATUS STYLES
  // =====================================================

  const getStatusStyles = (
    status
  ) => {

    switch (
      status?.toUpperCase()
    ) {

      case "APPROVED":

        return {
          icon:
            CheckCircle2,

          label:
            "Approved",

          classes:
            `
            bg-emerald-100
            text-emerald-700
            border-emerald-200
            `,
        };

      case "REJECTED":

        return {
          icon:
            XCircle,

          label:
            "Rejected",

          classes:
            `
            bg-red-100
            text-red-700
            border-red-200
            `,
        };

      case "SUSPENDED":

        return {
          icon:
            ShieldAlert,

          label:
            "Suspended",

          classes:
            `
            bg-orange-100
            text-orange-700
            border-orange-200
            `,
        };

      default:

        return {
          icon:
            Clock3,

          label:
            "Pending",

          classes:
            `
            bg-yellow-100
            text-yellow-700
            border-yellow-200
            `,
        };
    }
  };


  // =====================================================
  // STATS
  // =====================================================

  const totalDoctors =
    doctors.length;

  const approvedDoctors =
    doctors.filter(
      (doctor) =>
        doctor.status ===
        "APPROVED"
    ).length;

  const pendingDoctors =
    doctors.filter(
      (doctor) =>
        doctor.status ===
        "PENDING"
    ).length;

  const suspendedDoctors =
    doctors.filter(
      (doctor) =>
        doctor.status ===
        "SUSPENDED"
    ).length;


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

              bg-white/10
              backdrop-blur-md

              px-4
              py-2

              rounded-full

              text-sm
              font-medium

              mb-6
            "
          >

            <Sparkles size={16} />

            Enterprise Doctor Management

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

                Admin Doctors

              </h1>

              <p
                className="
                  mt-5

                  max-w-2xl

                  text-lg
                  text-white/80
                "
              >

                Manage doctor verification,
                approvals,
                moderation,
                healthcare profiles,
                and enterprise medical
                operations from one
                centralized system.

              </p>

            </div>

            <div
              className="
                bg-white/10
                backdrop-blur-xl

                border
                border-white/20

                rounded-3xl

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
                    h-14
                    w-14

                    rounded-2xl

                    bg-white/20

                    flex
                    items-center
                    justify-center
                  "
                >

                  <Activity size={28} />

                </div>

                <div>

                  <p
                    className="
                      text-white/70
                      text-sm
                    "
                  >

                    Doctor System

                  </p>

                  <h3
                    className="
                      text-xl
                      font-bold
                    "
                  >

                    Verification Active

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
        title="Doctors Analytics"
      >

        <DashboardGrid>

          {[
            {
              title:
                "Total Doctors",

              value:
                totalDoctors,

              icon:
                Stethoscope,

              bg:
                "bg-primary/10",

              color:
                "text-primary",
            },

            {
              title:
                "Approved",

              value:
                approvedDoctors,

              icon:
                BadgeCheck,

              bg:
                "bg-emerald-100",

              color:
                "text-emerald-600",
            },

            {
              title:
                "Pending",

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
                "Suspended",

              value:
                suspendedDoctors,

              icon:
                ShieldAlert,

              bg:
                "bg-red-100",

              color:
                "text-red-600",
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
                    bg-white

                    border
                    border-slate-200

                    rounded-[2rem]

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
                          text-slate-500
                          text-sm
                          font-medium
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
                        w-14
                        h-14

                        rounded-2xl

                        flex
                        items-center
                        justify-center

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
      {/* TABLE */}
      {/* ================================================= */}

      <DashboardSection
        title="All Platform Doctors"
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
            bg-white

            border
            border-slate-200

            rounded-[2rem]

            overflow-hidden

            shadow-sm
          "
        >

          {/* SEARCH */}

          <div
            className="
              flex
              flex-col
              lg:flex-row

              lg:items-center
              lg:justify-between

              gap-4

              p-6

              border-b
              border-slate-200
            "
          >

            <div
              className="
                relative
                max-w-md
                w-full
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

                placeholder="Search doctors..."

                value={search}

                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }

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

            <button

              onClick={
                fetchDoctors
              }

              className="
                inline-flex
                items-center
                gap-2

                rounded-2xl

                bg-primary

                px-5
                py-3

                font-semibold
                text-white

                transition-all

                hover:opacity-90
              "
            >

              <RefreshCw
                size={18}
              />

              Refresh

            </button>

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
                    "Qualification",
                    "Experience",
                    "Fee",
                    "Status",
                    "Action",
                  ].map(
                    (
                      heading
                    ) => (

                      <th

                        key={
                          heading
                        }

                        className={`
                          px-6
                          py-5

                          text-sm
                          font-bold

                          uppercase
                          tracking-wider

                          text-slate-500

                          ${
                            heading ===
                            "Action"

                              ? "text-right"

                              : "text-left"
                          }
                        `}
                      >

                        {heading}

                      </th>
                    )
                  )}

                </tr>

              </thead>


              <tbody>

                {paginatedDoctors
                  .length > 0 ? (

                  paginatedDoctors.map(
                    (
                      doctor,
                      index
                    ) => {

                      const statusData =
                        getStatusStyles(
                          doctor.status
                        );

                      const StatusIcon =
                        statusData.icon;

                      return (

                        <motion.tr

                          key={
                            doctor.id
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

                          onClick={() =>
                            handleRowClick(
                              doctor
                            )
                          }

                          className="
                            border-t
                            border-slate-100

                            cursor-pointer

                            transition-all

                            hover:bg-slate-50
                          "
                        >

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
                                gap-4
                              "
                            >

                              <div
                                className="
                                  h-12
                                  w-12

                                  rounded-2xl

                                  bg-slate-100

                                  flex
                                  items-center
                                  justify-center

                                  font-bold

                                  text-slate-700
                                "
                              >

                                {doctor?.name
                                  ?.charAt(
                                    0
                                  )
                                  ?.toUpperCase()}

                              </div>

                              <div>

                                <h4
                                  className="
                                    font-bold
                                    text-slate-900
                                  "
                                >

                                  {
                                    doctor.name
                                  }

                                </h4>

                                <p
                                  className="
                                    text-sm
                                    text-slate-500
                                  "
                                >

                                  {
                                    doctor.email
                                  }

                                </p>

                              </div>

                            </div>

                          </td>


                          {/* SPECIALIZATION */}

                          <td
                            className="
                              px-6
                              py-5

                              text-slate-700
                            "
                          >

                            {
                              doctor.specialization ||
                              "N/A"
                            }

                          </td>


                          {/* QUALIFICATION */}

                          <td
                            className="
                              px-6
                              py-5

                              text-slate-700
                            "
                          >

                            {
                              doctor.qualification ||
                              "N/A"
                            }

                          </td>


                          {/* EXPERIENCE */}

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

                              <UserRound
                                size={15}
                              />

                              {
                                doctor.experience ||
                                0
                              }{" "}
                              Years

                            </div>

                          </td>


                          {/* FEE */}

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
                                font-semibold

                                text-emerald-700
                              "
                            >

                              <IndianRupee
                                size={15}
                              />

                              {doctor.consultation_fee ||
                                0}

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
                                gap-2

                                rounded-full

                                border

                                px-4
                                py-2

                                text-sm
                                font-semibold

                                ${statusData.classes}
                              `}
                            >

                              <StatusIcon
                                size={15}
                              />

                              {
                                statusData.label
                              }

                            </div>

                          </td>


                          {/* ACTION */}

                          <td
                            className="
                              px-6
                              py-5

                              text-right
                            "
                          >

                            <button
                              className="
                                inline-flex
                                items-center
                                gap-2

                                rounded-2xl

                                bg-primary/10

                                px-4
                                py-2

                                text-sm
                                font-semibold

                                text-primary

                                transition-all

                                hover:bg-primary
                                hover:text-white
                              "
                            >

                              <Eye
                                size={16}
                              />

                              View

                            </button>

                          </td>

                        </motion.tr>
                      );
                    }
                  )

                ) : (

                  <tr>

                    <td
                      colSpan="7"

                      className="
                        py-14

                        text-center

                        text-slate-500
                      "
                    >

                      No doctors found

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>


          {/* ================================================= */}
          {/* PAGINATION */}
          {/* ================================================= */}

          {filteredDoctors.length >
            doctorsPerPage && (

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
                    doctorsPerPage
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
                    currentPage *
                    doctorsPerPage,
                    filteredDoctors.length
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
                    filteredDoctors.length
                  }

                </span>

                {" "}doctors

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
                      (prev) =>
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

                    disabled:opacity-40
                    disabled:cursor-not-allowed
                  "
                >

                  <ChevronLeft
                    size={16}
                  />

                  Previous

                </button>


                {/* PAGE NUMBERS */}

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


                {/* NEXT */}

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
                    disabled:cursor-not-allowed
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


      {/* ================================================= */}
      {/* MODAL */}
      {/* ================================================= */}

      <AnimatePresence>

        {showModal &&
          selectedDoctor && (

          <motion.div

            initial={{
              opacity: 0,
            }}

            animate={{
              opacity: 1,
            }}

            exit={{
              opacity: 0,
            }}

            className="
              fixed
              inset-0

              z-50

              flex
              items-center
              justify-center

              bg-black/50
              backdrop-blur-sm

              p-4
            "
          >

            <motion.div

              initial={{
                opacity: 0,
                scale: 0.9,
                y: 20,
              }}

              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}

              exit={{
                opacity: 0,
                scale: 0.9,
              }}

              className="
                w-full
                max-w-2xl

                rounded-[2rem]

                bg-white

                p-8

                shadow-2xl
              "
            >

              {/* HEADER */}

              <div
                className="
                  flex
                  items-start
                  justify-between

                  mb-8
                "
              >

                <div>

                  <h2
                    className="
                      text-3xl
                      font-black

                      text-slate-900
                    "
                  >

                    Doctor Profile

                  </h2>

                  <p
                    className="
                      mt-2

                      text-slate-500
                    "
                  >

                    Manage doctor
                    verification and
                    moderation

                  </p>

                </div>

                <button

                  onClick={() =>
                    setShowModal(
                      false
                    )
                  }

                  className="
                    h-11
                    w-11

                    rounded-2xl

                    bg-slate-100

                    flex
                    items-center
                    justify-center

                    text-slate-500

                    transition-all

                    hover:bg-red-100
                    hover:text-red-600
                  "
                >

                  <X size={20} />

                </button>

              </div>


              {/* PROFILE */}

              <div
                className="
                  grid
                  grid-cols-1
                  md:grid-cols-2

                  gap-6
                "
              >

                {/* NAME */}

                <div
                  className="
                    rounded-2xl

                    border
                    border-slate-200

                    bg-slate-50

                    p-5
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-3

                      mb-3
                    "
                  >

                    <UserRound
                      size={18}

                      className="
                        text-primary
                      "
                    />

                    <h4
                      className="
                        font-semibold
                        text-slate-700
                      "
                    >

                      Doctor Name

                    </h4>

                  </div>

                  <p
                    className="
                      font-bold
                      text-slate-900
                    "
                  >

                    {
                      selectedDoctor.name
                    }

                  </p>

                </div>


                {/* EMAIL */}

                <div
                  className="
                    rounded-2xl

                    border
                    border-slate-200

                    bg-slate-50

                    p-5
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-3

                      mb-3
                    "
                  >

                    <Mail
                      size={18}

                      className="
                        text-primary
                      "
                    />

                    <h4
                      className="
                        font-semibold
                        text-slate-700
                      "
                    >

                      Email Address

                    </h4>

                  </div>

                  <p
                    className="
                      font-bold
                      text-slate-900
                    "
                  >

                    {
                      selectedDoctor.email
                    }

                  </p>

                </div>


                {/* SPECIALIZATION */}

                <div
                  className="
                    rounded-2xl

                    border
                    border-slate-200

                    bg-slate-50

                    p-5
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-3

                      mb-3
                    "
                  >

                    <Stethoscope
                      size={18}

                      className="
                        text-primary
                      "
                    />

                    <h4
                      className="
                        font-semibold
                        text-slate-700
                      "
                    >

                      Specialization

                    </h4>

                  </div>

                  <p
                    className="
                      font-bold
                      text-slate-900
                    "
                  >

                    {
                      selectedDoctor.specialization ||
                      "N/A"
                    }

                  </p>

                </div>


                {/* QUALIFICATION */}

                <div
                  className="
                    rounded-2xl

                    border
                    border-slate-200

                    bg-slate-50

                    p-5
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-3

                      mb-3
                    "
                  >

                    <GraduationCap
                      size={18}

                      className="
                        text-primary
                      "
                    />

                    <h4
                      className="
                        font-semibold
                        text-slate-700
                      "
                    >

                      Qualification

                    </h4>

                  </div>

                  <p
                    className="
                      font-bold
                      text-slate-900
                    "
                  >

                    {
                      selectedDoctor.qualification ||
                      "N/A"
                    }

                  </p>

                </div>


                {/* EXPERIENCE */}

                <div
                  className="
                    rounded-2xl

                    border
                    border-slate-200

                    bg-slate-50

                    p-5
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-3

                      mb-3
                    "
                  >

                    <BriefcaseMedical
                      size={18}

                      className="
                        text-primary
                      "
                    />

                    <h4
                      className="
                        font-semibold
                        text-slate-700
                      "
                    >

                      Experience

                    </h4>

                  </div>

                  <p
                    className="
                      font-bold
                      text-slate-900
                    "
                  >

                    {
                      selectedDoctor.experience ||
                      0
                    }{" "}
                    Years

                  </p>

                </div>


                {/* FEE */}

                <div
                  className="
                    rounded-2xl

                    border
                    border-slate-200

                    bg-slate-50

                    p-5
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-3

                      mb-3
                    "
                  >

                    <IndianRupee
                      size={18}

                      className="
                        text-primary
                      "
                    />

                    <h4
                      className="
                        font-semibold
                        text-slate-700
                      "
                    >

                      Consultation Fee

                    </h4>

                  </div>

                  <p
                    className="
                      font-bold
                      text-slate-900
                    "
                  >

                    ₹
                    {
                      selectedDoctor.consultation_fee ||
                      0
                    }

                  </p>

                </div>

              </div>


              {/* ACTIONS */}

              <div
                className="
                  mt-10

                  flex
                  flex-wrap
                  justify-end

                  gap-3
                "
              >

                {/* PENDING */}

                {selectedDoctor.status ===
                  "PENDING" && (

                  <>

                    <button

                      disabled={
                        actionLoading
                      }

                      onClick={() =>
                        handleAction(
                          "reject",
                          selectedDoctor.id
                        )
                      }

                      className="
                        rounded-2xl

                        bg-red-100

                        px-6
                        py-3

                        font-semibold

                        text-red-700

                        transition-all

                        hover:bg-red-200
                      "
                    >

                      Reject

                    </button>

                    <button

                      disabled={
                        actionLoading
                      }

                      onClick={() =>
                        handleAction(
                          "approve",
                          selectedDoctor.id
                        )
                      }

                      className="
                        rounded-2xl

                        bg-emerald-600

                        px-6
                        py-3

                        font-semibold

                        text-white

                        transition-all

                        hover:bg-emerald-700
                      "
                    >

                      Approve

                    </button>

                  </>

                )}


                {/* APPROVED */}

                {selectedDoctor.status ===
                  "APPROVED" && (

                  <button

                    disabled={
                      actionLoading
                    }

                    onClick={() =>
                      handleAction(
                        "suspend",
                        selectedDoctor.id
                      )
                    }

                    className="
                      rounded-2xl

                      bg-orange-100

                      px-6
                      py-3

                      font-semibold

                      text-orange-700

                      transition-all

                      hover:bg-orange-200
                    "
                  >

                    Suspend Doctor

                  </button>

                )}


                {/* REJECTED / SUSPENDED */}

                {(selectedDoctor.status ===
                  "REJECTED" ||

                  selectedDoctor.status ===
                  "SUSPENDED") && (

                  <button

                    disabled={
                      actionLoading
                    }

                    onClick={() =>
                      handleAction(
                        "reactivate",
                        selectedDoctor.id
                      )
                    }

                    className="
                      rounded-2xl

                      bg-blue-600

                      px-6
                      py-3

                      font-semibold

                      text-white

                      transition-all

                      hover:bg-blue-700
                    "
                  >

                    Reactivate Doctor

                  </button>

                )}

              </div>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </div>
  );
};

export default AdminDoctors;
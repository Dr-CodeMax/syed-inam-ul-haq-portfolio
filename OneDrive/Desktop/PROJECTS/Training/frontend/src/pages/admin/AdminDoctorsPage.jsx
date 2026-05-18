// =========================================================
// FILE: src/pages/admin/AdminDoctorsPage.jsx
// =========================================================

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  RefreshCw,
  Search,
  UserPlus,
  Sparkles,
  Activity,
  Stethoscope,
  BadgeCheck,
  Clock3,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Hospital,
  MapPin,
  Eye,
  PencilLine,
  Trash2,
  IndianRupee,
  CalendarDays,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import DashboardSection
from "../../components/dashboard/DashboardSection";

import DashboardGrid
from "../../components/dashboard/DashboardGrid";

import PageLoader
from "../../components/ui/PageLoader";

import ErrorState
from "../../components/ui/ErrorState";

import ConfirmModal
from "../../components/modals/ConfirmModal";

import {
  deleteDoctor,
  getDoctors,
} from "../../services/doctorService";


// =========================================================
// ITEMS PER PAGE
// =========================================================

const ITEMS_PER_PAGE = 6;


// =========================================================
// ADMIN DOCTORS PAGE
// =========================================================

const AdminDoctorsPage = () => {

  const navigate =
    useNavigate();

  // =====================================================
  // STATES
  // =====================================================

  const [
    doctors,
    setDoctors,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    deleteLoading,
    setDeleteLoading,
  ] = useState(false);

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const [
    error,
    setError,
  ] = useState("");

  const [
    selectedDoctor,
    setSelectedDoctor,
  ] = useState(null);


  // =====================================================
  // FETCH DOCTORS
  // =====================================================

  const fetchDoctors =
    useCallback(

      async (
        showRefresh = false
      ) => {

        try {

          if (
            showRefresh
          ) {

            setRefreshing(
              true
            );

          } else {

            setLoading(
              true
            );

          }

          setError("");

          const response =
            await getDoctors();

          setDoctors(
            response.data ||
            []
          );

        } catch (
          requestError
        ) {

          const detail =

            requestError
              ?.response
              ?.data
              ?.detail ||

            requestError
              ?.response
              ?.data
              ?.message ||

            "Failed to load doctors";

          setError(
            detail
          );

          toast.error(
            detail
          );

        } finally {

          setLoading(
            false
          );

          setRefreshing(
            false
          );

        }

      },

      []
    );


  // =====================================================
  // INITIAL FETCH
  // =====================================================

  useEffect(() => {

    fetchDoctors();

  }, [fetchDoctors]);


  // =====================================================
  // FILTERED DOCTORS
  // =====================================================

  const filteredDoctors =
    useMemo(() => {

      const query =
        searchTerm
          .trim()
          .toLowerCase();

      if (!query) {

        return doctors;

      }

      return doctors.filter(
        (doctor) =>

          [
            doctor.name,
            doctor.email,
            doctor.specialization,
            doctor.hospital_name,
            doctor.city,
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
      doctors,
      searchTerm,
    ]);


  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages =
    Math.max(

      1,

      Math.ceil(

        filteredDoctors.length
        /
        ITEMS_PER_PAGE
      )
    );

  const paginatedDoctors =
    filteredDoctors.slice(

      (currentPage - 1)
      * ITEMS_PER_PAGE,

      currentPage
      * ITEMS_PER_PAGE
    );


  // =====================================================
  // HANDLE PAGE
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
  // DELETE DOCTOR
  // =====================================================

  const handleDeleteDoctor =
    async () => {

      if (
        !selectedDoctor
      ) {

        return;

      }

      const previousDoctors =
        doctors;

      try {

        setDeleteLoading(
          true
        );

        setDoctors(
          (
            currentDoctors
          ) =>

            currentDoctors.filter(

              (
                doctor
              ) =>

                doctor.id
                !==
                selectedDoctor.id
            )
        );

        await deleteDoctor(
          selectedDoctor.id
        );

        toast.success(
          "Doctor deleted successfully"
        );

        setSelectedDoctor(
          null
        );

      } catch (
        requestError
      ) {

        setDoctors(
          previousDoctors
        );

        toast.error(

          requestError
            ?.response
            ?.data
            ?.detail ||

          requestError
            ?.response
            ?.data
            ?.message ||

          "Failed to delete doctor"
        );

      } finally {

        setDeleteLoading(
          false
        );

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
  // STATUS STYLES
  // =====================================================

  const getStatusStyles =
    (status) => {

      switch (
        status
      ) {

        case "APPROVED":

          return `
            bg-emerald-100
            text-emerald-700
          `;

        case "PENDING":

          return `
            bg-yellow-100
            text-yellow-700
          `;

        case "SUSPENDED":

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

    return <PageLoader />;

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (
    error &&
    doctors.length === 0
  ) {

    return (
      <ErrorState
        message={error}
      />
    );

  }


  return (

    <>

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

                  Doctors Management

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
                  professionals,
                  hospital records,
                  doctor approvals,
                  appointments,
                  and enterprise
                  medical operations.

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

                      Healthcare System

                    </p>

                    <h3
                      className="
                        text-xl
                        font-bold
                      "
                    >

                      Doctor Monitoring Active

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
          title="Doctor Analytics"
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

                color:
                  "primary",
              },

              {
                title:
                  "Approved",

                value:
                  approvedDoctors,

                icon:
                  BadgeCheck,

                color:
                  "green",
              },

              {
                title:
                  "Pending",

                value:
                  pendingDoctors,

                icon:
                  Clock3,

                color:
                  "yellow",
              },

              {
                title:
                  "Suspended",

                value:
                  suspendedDoctors,

                icon:
                  ShieldAlert,

                color:
                  "red",
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
                            "red"

                              ? `
                                bg-red-100
                                text-red-600
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

                  Doctor Accounts

                </h2>

                <p
                  className="
                    mt-1

                    text-slate-500
                  "
                >

                  Enterprise healthcare
                  professionals linked
                  with the MEDBOOK system.

                </p>

              </div>

              <div
                className="
                  flex
                  flex-wrap
                  items-center

                  gap-3
                "
              >

                <button

                  onClick={() =>
                    fetchDoctors(
                      true
                    )
                  }

                  disabled={
                    refreshing
                  }

                  className="
                    inline-flex
                    items-center
                    gap-2

                    rounded-2xl

                    border
                    border-slate-200

                    px-5
                    py-3

                    font-semibold

                    text-slate-700

                    transition-all

                    hover:bg-slate-100
                  "
                >

                  <RefreshCw
                    size={18}

                    className={
                      refreshing

                        ? "animate-spin"

                        : ""
                    }
                  />

                  Refresh

                </button>

                <button

                  onClick={() =>
                    navigate(
                      "/admin/doctors/create"
                    )
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

                  <UserPlus
                    size={18}
                  />

                  Add Doctor

                </button>

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
                    Search by doctor,
                    specialization,
                    hospital,
                    or city
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

            {!error &&
            filteredDoctors.length === 0 ? (

              <div
                className="
                  py-20

                  text-center
                "
              >

                <Search
                  size={48}

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

                  No Doctors Found

                </h3>

                <p
                  className="
                    mt-2

                    text-slate-500
                  "
                >

                  Adjust your search or
                  create a new doctor
                  profile to populate
                  this list.

                </p>

              </div>

            ) : null}


            {/* TABLE */}

            {!error &&
            filteredDoctors.length > 0 ? (

              <>

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
                          "Hospital",
                          "Appointments",
                          "Status",
                          "Actions",
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

                      {paginatedDoctors.map(
                        (
                          doctor,
                          index
                        ) => (

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

                            className="
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
                                    flex
                                    h-12
                                    w-12

                                    items-center
                                    justify-center

                                    overflow-hidden

                                    rounded-2xl

                                    bg-slate-100

                                    font-bold

                                    text-slate-600
                                  "
                                >

                                  {doctor.profileImage ? (

                                    <img

                                      src={
                                        doctor.profileImage
                                      }

                                      alt={
                                        doctor.name
                                      }

                                      className="
                                        h-full
                                        w-full

                                        object-cover
                                      "
                                    />

                                  ) : (

                                    doctor.name
                                      ?.charAt(
                                        0
                                      )
                                  )}

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
                              "
                            >

                              <div>

                                <p
                                  className="
                                    font-semibold

                                    text-slate-800
                                  "
                                >

                                  {
                                    doctor.specialization ||
                                    "-"
                                  }

                                </p>

                                <p
                                  className="
                                    mt-1

                                    text-sm

                                    text-slate-500
                                  "
                                >

                                  {
                                    doctor.qualification ||
                                    "-"
                                  }

                                </p>

                              </div>

                            </td>


                            {/* HOSPITAL */}

                            <td
                              className="
                                px-6
                                py-5
                              "
                            >

                              <div
                                className="
                                  space-y-1
                                "
                              >

                                <div
                                  className="
                                    flex
                                    items-center
                                    gap-2

                                    text-slate-800
                                  "
                                >

                                  <Hospital
                                    size={15}
                                  />

                                  {
                                    doctor.hospital_name ||
                                    "-"
                                  }

                                </div>

                                <div
                                  className="
                                    flex
                                    items-center
                                    gap-2

                                    text-sm

                                    text-slate-500
                                  "
                                >

                                  <MapPin
                                    size={14}
                                  />

                                  {
                                    doctor.city ||
                                    "No city"
                                  }

                                </div>

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

                                  bg-primary/10

                                  px-4
                                  py-2

                                  text-sm
                                  font-semibold

                                  text-primary
                                "
                              >

                                <CalendarDays
                                  size={15}
                                />

                                {
                                  doctor.appointmentsCount
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
                                    doctor.status
                                  )}
                                `}
                              >

                                {
                                  doctor.status
                                }

                              </div>

                            </td>


                            {/* ACTIONS */}

                            <td
                              className="
                                px-6
                                py-5
                              "
                            >

                              <div
                                className="
                                  flex
                                  flex-wrap

                                  gap-2
                                "
                              >

                                <button

                                  onClick={() =>
                                    navigate(

                                      `/admin/doctors/${doctor.id}`
                                    )
                                  }

                                  className="
                                    inline-flex
                                    items-center
                                    gap-2

                                    rounded-xl

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
                                    size={15}
                                  />

                                  View

                                </button>

                                <button

                                  onClick={() =>
                                    navigate(

                                      `/admin/doctors/${doctor.id}/edit`
                                    )
                                  }

                                  className="
                                    inline-flex
                                    items-center
                                    gap-2

                                    rounded-xl

                                    bg-yellow-100

                                    px-4
                                    py-2

                                    text-sm
                                    font-semibold

                                    text-yellow-700

                                    transition-all

                                    hover:bg-yellow-200
                                  "
                                >

                                  <PencilLine
                                    size={15}
                                  />

                                  Edit

                                </button>

                                <button

                                  onClick={() =>
                                    setSelectedDoctor(
                                      doctor
                                    )
                                  }

                                  className="
                                    inline-flex
                                    items-center
                                    gap-2

                                    rounded-xl

                                    bg-red-100

                                    px-4
                                    py-2

                                    text-sm
                                    font-semibold

                                    text-red-700

                                    transition-all

                                    hover:bg-red-200
                                  "
                                >

                                  <Trash2
                                    size={15}
                                  />

                                  Delete

                                </button>

                              </div>

                            </td>

                          </motion.tr>
                        )
                      )}

                    </tbody>

                  </table>

                </div>


                {/* ================================================= */}
                {/* PAGINATION */}
                {/* ================================================= */}

                {filteredDoctors.length >
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

            ) : null}

          </motion.div>

        </DashboardSection>

      </div>


      {/* ================================================= */}
      {/* DELETE MODAL */}
      {/* ================================================= */}

      <ConfirmModal

        open={Boolean(
          selectedDoctor
        )}

        onClose={() => {

          if (
            !deleteLoading
          ) {

            setSelectedDoctor(
              null
            );

          }

        }}

        onConfirm={
          handleDeleteDoctor
        }

        title="Delete Doctor"

        message={`
          Delete
          ${
            selectedDoctor?.name ||
            "this doctor"
          }
          and the linked
          doctor account?
          This action
          cannot be undone.
        `}

        confirmText="Delete Doctor"

        cancelText="Cancel"

        variant="danger"

        loading={
          deleteLoading
        }

      />

    </>

  );

};

export default AdminDoctorsPage;
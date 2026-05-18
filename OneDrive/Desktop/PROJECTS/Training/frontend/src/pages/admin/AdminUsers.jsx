// =====================================================
// FILE: src/pages/admin/AdminUsers.jsx
// =====================================================

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
  Users,
  Shield,
  Stethoscope,
  User,
  Search,
  Activity,
  Sparkles,
  Edit3,
  X,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  getAllUsers,
  updateUser,
} from "../../services/adminService";

import DashboardSection
from "../../components/dashboard/DashboardSection";

import DashboardGrid
from "../../components/dashboard/DashboardGrid";

import PageLoader
from "../../components/ui/PageLoader";

import ErrorState
from "../../components/ui/ErrorState";


// =====================================================
// ADMIN USERS
// =====================================================

const AdminUsers = () => {

  // =====================================================
  // STATES
  // =====================================================

  const [users, setUsers] =
    useState([]);

  const [filteredUsers,
    setFilteredUsers] =
    useState([]);

  const [selectedUser,
    setSelectedUser] =
    useState(null);

  const [showModal,
    setShowModal] =
    useState(false);

  const [editingName,
    setEditingName] =
    useState("");

  const [editingStatus,
    setEditingStatus] =
    useState(true);

  const [loading,
    setLoading] =
    useState(true);

  const [saving,
    setSaving] =
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

  const usersPerPage = 8;


  // =====================================================
  // FETCH USERS
  // =====================================================

  useEffect(() => {

    fetchUsers();

  }, []);


  // =====================================================
  // FILTER USERS
  // =====================================================

  useEffect(() => {

    const filtered =
      users.filter((user) => {

        const keyword =
          search.toLowerCase();

        return (

          user?.name
            ?.toLowerCase()
            ?.includes(keyword)

          ||

          user?.email
            ?.toLowerCase()
            ?.includes(keyword)

          ||

          user?.role
            ?.toLowerCase()
            ?.includes(keyword)
        );
      });

    setFilteredUsers(filtered);

    setCurrentPage(1);

  }, [search, users]);


  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages =
    Math.ceil(
      filteredUsers.length /
      usersPerPage
    );

  const paginatedUsers =
    useMemo(() => {

      const startIndex =
        (currentPage - 1)
        * usersPerPage;

      const endIndex =
        startIndex +
        usersPerPage;

      return filteredUsers.slice(
        startIndex,
        endIndex
      );

    }, [
      filteredUsers,
      currentPage,
    ]);


  // =====================================================
  // API FETCH
  // =====================================================

  const fetchUsers = async () => {

    try {

      setLoading(true);

      const res =
        await getAllUsers();

      let data = [];

      if (Array.isArray(res)) {

        data = res;

      } else if (
        Array.isArray(res?.users)
      ) {

        data = res.users;

      } else if (
        Array.isArray(res?.data)
      ) {

        data = res.data;

      } else if (
        Array.isArray(
          res?.data?.users
        )
      ) {

        data =
          res.data.users;
      }

      setUsers(data);

    } catch (err) {

      console.error(err);

      setError(
        "Failed to load users"
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // ROLE STYLES
  // =====================================================

  const getRoleStyles = (
    role
  ) => {

    switch (
      role?.toLowerCase()
    ) {

      case "admin":

        return {
          icon: Shield,

          classes:
            `
            bg-purple-100
            text-purple-700
            border-purple-200
            `,
        };

      case "doctor":

        return {
          icon: Stethoscope,

          classes:
            `
            bg-emerald-100
            text-emerald-700
            border-emerald-200
            `,
        };

      case "patient":

        return {
          icon: User,

          classes:
            `
            bg-blue-100
            text-blue-700
            border-blue-200
            `,
        };

      default:

        return {
          icon: Users,

          classes:
            `
            bg-slate-100
            text-slate-700
            border-slate-200
            `,
        };
    }
  };


  // =====================================================
  // OPEN MODAL
  // =====================================================

  const handleRowClick = (
    user
  ) => {

    if (
      user?.role
        ?.toLowerCase()
      === "admin"
    ) return;

    setSelectedUser(user);

    setEditingName(
      user?.name || ""
    );

    setEditingStatus(
      user?.is_active ?? true
    );

    setShowModal(true);

  };


  // =====================================================
  // SAVE USER
  // =====================================================

  const handleSave = async () => {

    if (!selectedUser)
      return;

    try {

      setSaving(true);

      await updateUser(
        selectedUser.id,
        {
          name: editingName,
          is_active:
            editingStatus,
        }
      );

      await fetchUsers();

      setShowModal(false);

    } catch (err) {

      console.error(err);

      alert(
        err?.response?.data
          ?.detail ||
        "Failed to update user"
      );

    } finally {

      setSaving(false);

    }

  };


  // =====================================================
  // STATS
  // =====================================================

  const totalUsers =
    users.length;

  const doctors =
    users.filter(
      (u) =>
        u?.role
          ?.toLowerCase()
        === "doctor"
    ).length;

  const patients =
    users.filter(
      (u) =>
        u?.role
          ?.toLowerCase()
        === "patient"
    ).length;

  const activeUsers =
    users.filter(
      (u) => u?.is_active
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

            Enterprise User Management

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

                Admin Users

              </h1>

              <p
                className="
                  mt-5

                  max-w-2xl

                  text-lg
                  text-white/80
                "
              >

                Manage platform users,
                doctors,
                patients,
                roles,
                and account activity
                from one centralized
                enterprise system.

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

                    User System

                  </p>

                  <h3
                    className="
                      text-xl
                      font-bold
                    "
                  >

                    User Management Active

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
        title="Platform User Analytics"
      >

        <DashboardGrid>

          {[
            {
              title:
                "Total Users",

              value:
                totalUsers,

              icon:
                Users,

              bg:
                "bg-primary/10",

              color:
                "text-primary",
            },

            {
              title:
                "Doctors",

              value:
                doctors,

              icon:
                Stethoscope,

              bg:
                "bg-emerald-100",

              color:
                "text-emerald-600",
            },

            {
              title:
                "Patients",

              value:
                patients,

              icon:
                User,

              bg:
                "bg-blue-100",

              color:
                "text-blue-600",
            },

            {
              title:
                "Active Users",

              value:
                activeUsers,

              icon:
                Activity,

              bg:
                "bg-yellow-100",

              color:
                "text-yellow-600",
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
      {/* USERS TABLE */}
      {/* ================================================= */}

      <DashboardSection
        title="All Platform Users"
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
              p-6

              border-b
              border-slate-200
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

                placeholder="Search users..."

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
                    "User",
                    "Email",
                    "Role",
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

                {paginatedUsers
                  .length > 0 ? (

                  paginatedUsers.map(
                    (
                      user,
                      index
                    ) => {

                      const roleData =
                        getRoleStyles(
                          user?.role
                        );

                      const RoleIcon =
                        roleData.icon;

                      return (

                        <motion.tr

                          key={
                            user?.id
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
                              user
                            )
                          }

                          className={`
                            border-t
                            border-slate-100

                            transition-all

                            ${
                              user?.role?.toLowerCase()
                              !==
                              "admin"

                                ? `
                                  cursor-pointer
                                  hover:bg-slate-50
                                `

                                : ""
                            }
                          `}
                        >

                          {/* USER */}

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

                                {user?.name
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

                                  {user?.name ||
                                    "Unknown"}

                                </h4>

                                <p
                                  className="
                                    text-sm
                                    text-slate-500
                                  "
                                >

                                  Platform User

                                </p>

                              </div>

                            </div>

                          </td>


                          {/* EMAIL */}

                          <td
                            className="
                              px-6
                              py-5

                              text-slate-600
                            "
                          >

                            {user?.email}

                          </td>


                          {/* ROLE */}

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

                                px-4
                                py-2

                                rounded-full

                                border

                                text-sm
                                font-semibold

                                ${roleData.classes}
                              `}
                            >

                              <RoleIcon
                                size={15}
                              />

                              {user?.role}

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

                                px-4
                                py-2

                                text-sm
                                font-semibold

                                ${
                                  user?.is_active

                                    ? `
                                      bg-emerald-100
                                      text-emerald-700
                                    `

                                    : `
                                      bg-red-100
                                      text-red-700
                                    `
                                }
                              `}
                            >

                              {user?.is_active ? (

                                <CheckCircle2
                                  size={16}
                                />

                              ) : (

                                <XCircle
                                  size={16}
                                />

                              )}

                              {user?.is_active

                                ? "Active"

                                : "Inactive"}

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

                            {user?.role?.toLowerCase()
                              !==
                              "admin" && (

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

                                <Edit3
                                  size={16}
                                />

                                Edit

                              </button>

                            )}

                          </td>

                        </motion.tr>
                      );
                    }
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

                      No users found

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>


          {/* ================================================= */}
          {/* PAGINATION */}
          {/* ================================================= */}

          {filteredUsers.length >
            usersPerPage && (

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

              {/* INFO */}

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
                    usersPerPage
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
                    usersPerPage,
                    filteredUsers.length
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
                    filteredUsers.length
                  }

                </span>

                {" "}users

              </div>


              {/* BUTTONS */}

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
          selectedUser && (

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
                max-w-lg

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

                    Edit User

                  </h2>

                  <p
                    className="
                      mt-2

                      text-slate-500
                    "
                  >

                    Update user details
                    and account status

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


              {/* EMAIL */}

              <div
                className="
                  mb-6
                "
              >

                <label
                  className="
                    text-sm
                    font-semibold

                    text-slate-600
                  "
                >

                  Email

                </label>

                <div
                  className="
                    mt-2

                    rounded-2xl

                    border
                    border-slate-200

                    bg-slate-50

                    px-4
                    py-3

                    text-slate-700
                  "
                >

                  {
                    selectedUser.email
                  }

                </div>

              </div>


              {/* NAME */}

              <div
                className="
                  mb-6
                "
              >

                <label
                  className="
                    text-sm
                    font-semibold

                    text-slate-600
                  "
                >

                  Full Name

                </label>

                <input

                  type="text"

                  value={
                    editingName
                  }

                  onChange={(e) =>
                    setEditingName(
                      e.target.value
                    )
                  }

                  className="
                    mt-2
                    w-full

                    rounded-2xl

                    border
                    border-slate-200

                    bg-slate-50

                    px-4
                    py-3

                    outline-none

                    transition-all

                    focus:border-primary
                    focus:ring-4
                    focus:ring-primary/10
                  "
                />

              </div>


              {/* STATUS */}

              <div>

                <label
                  className="
                    text-sm
                    font-semibold

                    text-slate-600
                  "
                >

                  Account Status

                </label>

                <select

                  value={
                    editingStatus
                  }

                  onChange={(e) =>
                    setEditingStatus(
                      e.target.value
                      === "true"
                    )
                  }

                  className="
                    mt-2
                    w-full

                    rounded-2xl

                    border
                    border-slate-200

                    bg-slate-50

                    px-4
                    py-3

                    outline-none

                    transition-all

                    focus:border-primary
                    focus:ring-4
                    focus:ring-primary/10
                  "
                >

                  <option value="true">
                    Active
                  </option>

                  <option value="false">
                    Inactive
                  </option>

                </select>

              </div>


              {/* ACTIONS */}

              <div
                className="
                  mt-10

                  flex
                  justify-end

                  gap-4
                "
              >

                <button

                  onClick={() =>
                    setShowModal(
                      false
                    )
                  }

                  className="
                    rounded-2xl

                    border
                    border-slate-200

                    px-6
                    py-3

                    font-semibold

                    text-slate-700

                    transition-all

                    hover:bg-slate-100
                  "
                >

                  Cancel

                </button>

                <button

                  onClick={
                    handleSave
                  }

                  disabled={saving}

                  className="
                    rounded-2xl

                    bg-primary

                    px-6
                    py-3

                    font-semibold
                    text-white

                    transition-all

                    hover:opacity-90

                    disabled:opacity-60
                  "
                >

                  {saving

                    ? "Saving..."

                    : "Save Changes"}

                </button>

              </div>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </div>
  );
};

export default AdminUsers;
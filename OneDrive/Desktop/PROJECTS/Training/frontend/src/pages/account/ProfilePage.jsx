// =====================================================
// FILE: src/pages/account/ProfilePage.jsx
// =====================================================

import {
  useEffect,
  useState,
} from "react";

import {
  Camera,
  Mail,
  Phone,
  MapPin,
  User,
  ShieldCheck,
  Save,
  Pencil,
  HeartPulse,
  AlertTriangle,
} from "lucide-react";

import toast
from "react-hot-toast";

import { motion }
from "framer-motion";

import {
  useAuth,
} from "../../context/AuthContext";

import PageLoader
from "../../components/ui/PageLoader";


const ProfilePage = () => {

  const {
    user,
    refreshUser,
    updateProfile,
  } = useAuth();

  const [loading,
    setLoading] =
    useState(false);

  const [editMode,
    setEditMode] =
    useState(false);

  const [formData,
    setFormData] =
    useState({

      name: "",

      email: "",

      phone: "",

      city: "",

      address: "",

      gender: "",

      bio: "",

      // =================================================
      // PATIENT FIELDS
      // =================================================

      blood_group: "",

      allergies: "",

      emergency_contact: "",

      medical_history: "",
    });


  // =====================================================
  // LOAD USER
  // =====================================================

  useEffect(() => {

    if (user) {

      setFormData({

        name:
          user?.name || "",

        email:
          user?.email || "",

        phone:
          user?.phone || "",

        city:
          user?.city || "",

        address:
          user?.address || "",

        gender:
          user?.gender || "",

        bio:
          user?.bio || "",

        // =============================================
        // PATIENT DATA
        // =============================================

        blood_group:
          user?.blood_group || "",

        allergies:
          user?.allergies || "",

        emergency_contact:
          user?.emergency_contact || "",

        medical_history:
          user?.medical_history || "",
      });
    }

  }, [user]);


  // =====================================================
  // HANDLE CHANGE
  // =====================================================

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };


  // =====================================================
// IMPORTANT FIX INSIDE ProfilePage.jsx
// REPLACE ONLY handleSubmit FUNCTION
// =====================================================

const handleSubmit =
  async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      // ============================================
      // CLEAN EMPTY FIELDS
      // ============================================

      const cleanedPayload =
        Object.fromEntries(

          Object.entries(formData)
            .filter(

              ([_, value]) =>

                value !== "" &&
                value !== null &&
                value !== undefined
            )
        );

      await updateProfile(
        cleanedPayload
      );

      await refreshUser();

      toast.success(
        "Profile updated successfully"
      );

      setEditMode(false);

    } catch (error) {

      console.error(error);

      toast.error(

        error?.response?.data
          ?.detail?.[0]?.msg ||

        error?.response?.data
          ?.message ||

        "Failed to update profile"
      );

    } finally {

      setLoading(false);
    }

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (!user) {

    return <PageLoader />;

  }


  return (

    <div className="space-y-8">

      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <motion.div

        initial={{
          opacity: 0,
          y: 10,
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

            h-72
            w-72

            rounded-full

            bg-white/10

            blur-3xl
          "
        />

        <div
          className="
            relative
            z-10

            flex
            flex-col
            lg:flex-row

            items-start
            lg:items-center

            justify-between

            gap-8
          "
        >

          <div
            className="
              flex
              items-center
              gap-6
            "
          >

            <div
              className="
                relative
              "
            >

              <div
                className="
                  h-28
                  w-28

                  rounded-[2rem]

                  bg-white/20

                  backdrop-blur-xl

                  flex
                  items-center
                  justify-center

                  text-4xl
                  font-black
                "
              >

                {
                  user?.name
                    ?.charAt(0)
                }

              </div>

              <button
                className="
                  absolute
                  -bottom-2
                  -right-2

                  h-10
                  w-10

                  rounded-xl

                  bg-white

                  text-primary

                  flex
                  items-center
                  justify-center

                  shadow-lg
                "
              >

                <Camera size={18} />

              </button>

            </div>

            <div>

              <div
                className="
                  flex
                  items-center
                  gap-3
                  flex-wrap
                "
              >

                <h1
                  className="
                    text-4xl
                    font-black
                  "
                >

                  {user?.name}

                </h1>

                <div
                  className="
                    flex
                    items-center
                    gap-2

                    rounded-full

                    bg-white/20

                    px-4
                    py-2

                    text-sm
                    font-semibold
                  "
                >

                  <ShieldCheck size={16} />

                  Verified Account

                </div>

              </div>

              <p
                className="
                  mt-3

                  text-lg
                  text-white/90
                "
              >

                Manage your healthcare
                identity and personal
                information securely.

              </p>

            </div>

          </div>

          <button

            onClick={() =>
              setEditMode(
                !editMode
              )
            }

            className="
              flex
              items-center
              gap-3

              rounded-2xl

              bg-white

              px-6
              py-4

              font-semibold

              text-primary

              shadow-xl
            "
          >

            <Pencil size={18} />

            {
              editMode
                ? "Cancel Editing"
                : "Edit Profile"
            }

          </button>

        </div>

      </motion.div>


      {/* ================================================= */}
      {/* PROFILE FORM */}
      {/* ================================================= */}

      <motion.form

        onSubmit={handleSubmit}

        initial={{
          opacity: 0,
          y: 10,
        }}

        animate={{
          opacity: 1,
          y: 0,
        }}

        className="
          enterprise-card

          p-8
        "
      >

        <div
          className="
            flex
            items-center
            justify-between

            mb-10
          "
        >

          <div>

            <h2
              className="
                text-3xl
                font-black
                text-slate-800
              "
            >

              Personal Information

            </h2>

            <p
              className="
                mt-2
                text-slate-500
              "
            >

              Update your profile
              details and healthcare
              identity.

            </p>

          </div>

        </div>


        {/* ================================================= */}
        {/* PERSONAL GRID */}
        {/* ================================================= */}

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2

            gap-7
          "
        >

          {/* NAME */}

          <div>

            <label
              className="
                mb-3
                flex
                items-center
                gap-2

                text-sm
                font-semibold
                text-slate-700
              "
            >

              <User size={16} />

              Full Name

            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!editMode}
              className="
                w-full

                rounded-2xl

                border
                border-slate-200

                bg-white

                px-5
                py-4

                outline-none

                transition-all

                focus:border-primary
                focus:ring-4
                focus:ring-primary/10

                disabled:bg-slate-100
              "
            />

          </div>


          {/* EMAIL */}

          <div>

            <label
              className="
                mb-3
                flex
                items-center
                gap-2

                text-sm
                font-semibold
                text-slate-700
              "
            >

              <Mail size={16} />

              Email Address

            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="
                w-full

                rounded-2xl

                border
                border-slate-200

                bg-slate-100

                px-5
                py-4
              "
            />

          </div>


          {/* PHONE */}

          <div>

            <label
              className="
                mb-3
                flex
                items-center
                gap-2

                text-sm
                font-semibold
                text-slate-700
              "
            >

              <Phone size={16} />

              Phone Number

            </label>

            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!editMode}
              className="
                w-full

                rounded-2xl

                border
                border-slate-200

                px-5
                py-4

                outline-none

                focus:border-primary
                focus:ring-4
                focus:ring-primary/10

                disabled:bg-slate-100
              "
            />

          </div>


          {/* CITY */}

          <div>

            <label
              className="
                mb-3
                flex
                items-center
                gap-2

                text-sm
                font-semibold
                text-slate-700
              "
            >

              <MapPin size={16} />

              City

            </label>

            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              disabled={!editMode}
              className="
                w-full

                rounded-2xl

                border
                border-slate-200

                px-5
                py-4

                outline-none

                focus:border-primary
                focus:ring-4
                focus:ring-primary/10

                disabled:bg-slate-100
              "
            />

          </div>


          {/* GENDER */}

          <div>

            <label
              className="
                mb-3

                text-sm
                font-semibold
                text-slate-700

                block
              "
            >

              Gender

            </label>

            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              disabled={!editMode}
              className="
                w-full

                rounded-2xl

                border
                border-slate-200

                px-5
                py-4

                outline-none

                focus:border-primary
                focus:ring-4
                focus:ring-primary/10

                disabled:bg-slate-100
              "
            >

              <option value="">
                Select Gender
              </option>

              <option value="Male">
                Male
              </option>

              <option value="Female">
                Female
              </option>

              <option value="Other">
                Other
              </option>

            </select>

          </div>


          {/* ADDRESS */}

          <div>

            <label
              className="
                mb-3

                text-sm
                font-semibold
                text-slate-700

                block
              "
            >

              Address

            </label>

            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={!editMode}
              className="
                w-full

                rounded-2xl

                border
                border-slate-200

                px-5
                py-4

                outline-none

                focus:border-primary
                focus:ring-4
                focus:ring-primary/10

                disabled:bg-slate-100
              "
            />

          </div>

        </div>


        {/* ================================================= */}
        {/* MEDICAL INFORMATION */}
        {/* ================================================= */}

        <div className="mt-12">

          <div
            className="
              flex
              items-center
              gap-3

              mb-6
            "
          >

            <HeartPulse
              size={24}
              className="
                text-rose-500
              "
            />

            <div>

              <h2
                className="
                  text-2xl
                  font-black
                  text-slate-800
                "
              >

                Medical Information

              </h2>

              <p
                className="
                  text-slate-500
                  mt-1
                "
              >

                Manage healthcare related details.

              </p>

            </div>

          </div>

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2

              gap-7
            "
          >

            {/* BLOOD GROUP */}

            <div>

              <label
                className="
                  mb-3

                  block

                  text-sm
                  font-semibold
                  text-slate-700
                "
              >

                Blood Group

              </label>

              <input
                type="text"
                name="blood_group"
                value={formData.blood_group}
                onChange={handleChange}
                disabled={!editMode}
                placeholder="Enter blood group"
                className="
                  w-full

                  rounded-2xl

                  border
                  border-slate-200

                  px-5
                  py-4

                  outline-none

                  focus:border-primary
                  focus:ring-4
                  focus:ring-primary/10

                  disabled:bg-slate-100
                "
              />

            </div>


            {/* EMERGENCY CONTACT */}

            <div>

              <label
                className="
                  mb-3
                  flex
                  items-center
                  gap-2

                  text-sm
                  font-semibold
                  text-slate-700
                "
              >

                <AlertTriangle
                  size={16}
                />

                Emergency Contact

              </label>

              <input
                type="text"
                name="emergency_contact"
                value={
                  formData.emergency_contact
                }
                onChange={handleChange}
                disabled={!editMode}
                placeholder="
Emergency contact number
                "
                className="
                  w-full

                  rounded-2xl

                  border
                  border-slate-200

                  px-5
                  py-4

                  outline-none

                  focus:border-primary
                  focus:ring-4
                  focus:ring-primary/10

                  disabled:bg-slate-100
                "
              />

            </div>

          </div>

        </div>


        {/* ================================================= */}
        {/* ALLERGIES */}
        {/* ================================================= */}

        <div className="mt-8">

          <label
            className="
              mb-3

              block

              text-sm
              font-semibold
              text-slate-700
            "
          >

            Allergies

          </label>

          <textarea
            rows={4}
            name="allergies"
            value={formData.allergies}
            onChange={handleChange}
            disabled={!editMode}
            placeholder="
Mention allergies if any...
            "
            className="
              w-full

              rounded-3xl

              border
              border-slate-200

              px-5
              py-4

              outline-none

              resize-none

              focus:border-primary
              focus:ring-4
              focus:ring-primary/10

              disabled:bg-slate-100
            "
          />

        </div>


        {/* ================================================= */}
        {/* MEDICAL HISTORY */}
        {/* ================================================= */}

        <div className="mt-8">

          <label
            className="
              mb-3

              block

              text-sm
              font-semibold
              text-slate-700
            "
          >

            Medical History

          </label>

          <textarea
            rows={5}
            name="medical_history"
            value={
              formData.medical_history
            }
            onChange={handleChange}
            disabled={!editMode}
            placeholder="
Enter medical history...
            "
            className="
              w-full

              rounded-3xl

              border
              border-slate-200

              px-5
              py-4

              outline-none

              resize-none

              focus:border-primary
              focus:ring-4
              focus:ring-primary/10

              disabled:bg-slate-100
            "
          />

        </div>


        {/* ================================================= */}
        {/* BIO */}
        {/* ================================================= */}

        <div className="mt-8">

          <label
            className="
              mb-3

              block

              text-sm
              font-semibold
              text-slate-700
            "
          >

            About / Bio

          </label>

          <textarea
            rows={5}
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            disabled={!editMode}
            placeholder="
Tell us about yourself...
            "
            className="
              w-full

              rounded-3xl

              border
              border-slate-200

              px-5
              py-4

              outline-none

              resize-none

              focus:border-primary
              focus:ring-4
              focus:ring-primary/10

              disabled:bg-slate-100
            "
          />

        </div>


        {/* ================================================= */}
        {/* ACTIONS */}
        {/* ================================================= */}

        {editMode && (

          <div
            className="
              mt-10

              flex
              justify-end
            "
          >

            <button
              type="submit"
              disabled={loading}
              className="
                flex
                items-center
                gap-3

                rounded-2xl

                bg-primary
                hover:bg-primaryHover

                px-7
                py-4

                text-white
                font-semibold

                transition-all
              "
            >

              <Save size={18} />

              {
                loading
                  ? "Saving..."
                  : "Save Changes"
              }

            </button>

          </div>

        )}

      </motion.form>

    </div>

  );

};

export default ProfilePage;
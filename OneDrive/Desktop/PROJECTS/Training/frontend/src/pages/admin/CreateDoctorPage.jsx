// =========================================================
// FILE: src/pages/admin/CreateDoctorPage.jsx
// =========================================================

import {
  useState,
} from "react";

import {
  motion,
} from "framer-motion";

import {
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
  Sparkles,
  Activity,
  Stethoscope,
  UserPlus,
} from "lucide-react";

import DoctorForm
from "../../components/forms/DoctorForm";

import DashboardSection
from "../../components/dashboard/DashboardSection";

import {
  createDoctor,
} from "../../services/doctorService";


// =========================================================
// CREATE DOCTOR PAGE
// =========================================================

const CreateDoctorPage = () => {

  const navigate =
    useNavigate();

  const [
    loading,
    setLoading,
  ] = useState(false);


  // =====================================================
  // CREATE DOCTOR
  // =====================================================

  const handleCreateDoctor =
    async (payload) => {

      try {

        setLoading(true);

        await createDoctor(
          payload
        );

        toast.success(
          "Doctor created successfully"
        );

        navigate(
          "/admin/doctors"
        );

      } catch (error) {

        toast.error(
          error?.response?.data
            ?.detail ||

          error?.response?.data
            ?.message ||

          "Failed to create doctor"
        );

      } finally {

        setLoading(false);

      }

    };


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

            Enterprise Doctor Creation

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

                Create Doctor

              </h1>

              <p
                className="
                  mt-5

                  max-w-2xl

                  text-lg
                  text-white/80
                "
              >

                Add verified healthcare
                professionals to the
                MEDBOOK enterprise
                healthcare platform.

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

                  <UserPlus size={28} />

                </div>

                <div>

                  <p
                    className="
                      text-sm
                      text-white/70
                    "
                  >

                    Doctor Onboarding

                  </p>

                  <h3
                    className="
                      text-xl
                      font-bold
                    "
                  >

                    Registration Active

                  </h3>

                </div>

              </div>

            </div>

          </div>

        </div>

      </motion.div>


      {/* ================================================= */}
      {/* FORM */}
      {/* ================================================= */}

      <DashboardSection
        title="Doctor Registration Form"
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
            rounded-[2rem]

            border
            border-slate-200

            bg-white

            p-6
            md:p-8

            shadow-sm
          "
        >

          <div
            className="
              mb-8

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

                bg-primary/10

                text-primary
              "
            >

              <Stethoscope size={28} />

            </div>

            <div>

              <h2
                className="
                  text-2xl
                  font-bold

                  text-slate-900
                "
              >

                Doctor Information

              </h2>

              <p
                className="
                  mt-1

                  text-slate-500
                "
              >

                Complete all professional
                and healthcare details.

              </p>

            </div>

          </div>

          <DoctorForm
            onSubmit={
              handleCreateDoctor
            }
            loading={loading}
            submitText="Create Doctor"
          />

        </motion.div>

      </DashboardSection>


      {/* ================================================= */}
      {/* SYSTEM STATUS */}
      {/* ================================================= */}

      <DashboardSection
        title="Healthcare Verification"
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

              gap-6

              md:items-center
              md:justify-between
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

                  Verification Pipeline Active

                </h3>

                <p
                  className="
                    mt-2

                    text-slate-500
                  "
                >

                  All doctor records are
                  securely processed through
                  the enterprise healthcare
                  verification system.

                </p>

              </div>

            </div>

          </div>

        </motion.div>

      </DashboardSection>

    </div>
  );

};

export default CreateDoctorPage;
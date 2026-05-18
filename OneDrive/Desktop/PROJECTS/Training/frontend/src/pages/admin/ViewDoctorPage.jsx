// =========================================================
// FILE: src/pages/admin/ViewDoctorPage.jsx
// =========================================================

import {
  useEffect,
  useState,
} from "react";

import {
  motion,
} from "framer-motion";

import {
  useParams,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
  Sparkles,
  Activity,
  Eye,
  Stethoscope,
} from "lucide-react";

import DoctorForm
from "../../components/forms/DoctorForm";

import DashboardSection
from "../../components/dashboard/DashboardSection";

import PageLoader
from "../../components/ui/PageLoader";

import ErrorState
from "../../components/ui/ErrorState";

import {
  getDoctorById,
} from "../../services/doctorService";


// =========================================================
// VIEW DOCTOR PAGE
// =========================================================

const ViewDoctorPage = () => {

  const {
    id,
  } = useParams();

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    doctor,
    setDoctor,
  ] = useState(null);

  const [
    error,
    setError,
  ] = useState("");


  // =====================================================
  // FETCH DOCTOR
  // =====================================================

  useEffect(() => {

    const fetchDoctor =
      async () => {

        try {

          const response =
            await getDoctorById(
              id
            );

          setDoctor(
            response.data
          );

        } catch {

          setError(
            "Failed to load doctor"
          );

          toast.error(
            "Failed to load doctor"
          );

        } finally {

          setLoading(false);

        }

      };

    fetchDoctor();

  }, [id]);


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

            Enterprise Doctor Viewer

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

                Doctor Details

              </h1>

              <p
                className="
                  mt-5

                  max-w-2xl

                  text-lg
                  text-white/80
                "
              >

                View complete healthcare
                profile information,
                qualifications,
                experience,
                and professional records.

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

                  <Eye size={28} />

                </div>

                <div>

                  <p
                    className="
                      text-sm
                      text-white/70
                    "
                  >

                    Doctor Profile

                  </p>

                  <h3
                    className="
                      text-xl
                      font-bold
                    "
                  >

                    Read Only View

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
        title="Doctor Information"
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

                Professional Healthcare Profile

              </h2>

              <p
                className="
                  mt-1

                  text-slate-500
                "
              >

                Enterprise doctor details
                and medical profile records.

              </p>

            </div>

          </div>

          <DoctorForm
            initialData={doctor}
            readOnly={true}
          />

        </motion.div>

      </DashboardSection>


      {/* ================================================= */}
      {/* SYSTEM */}
      {/* ================================================= */}

      <DashboardSection
        title="Healthcare Monitoring"
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

                Doctor Record Verified

              </h3>

              <p
                className="
                  mt-2

                  text-slate-500
                "
              >

                Healthcare profile data
                is synchronized with the
                enterprise hospital
                management ecosystem.

              </p>

            </div>

          </div>

        </motion.div>

      </DashboardSection>

    </div>
  );

};

export default ViewDoctorPage;
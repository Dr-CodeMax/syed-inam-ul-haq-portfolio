import {
  MapPin,
  BriefcaseMedical,
  IndianRupee,
  Star,
  Clock3,
  ShieldCheck,
  ChevronRight,
  Activity,
  Video,
  Stethoscope,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";


const DoctorCard = ({ doc }) => {

  const navigate =
    useNavigate();


  // =====================================================
  // ✅ AVAILABILITY CONFIG
  // =====================================================

  const availabilityConfig = {

    AVAILABLE: {

      label: "Available Today",

      badgeClass:
        "bg-emerald-100 text-emerald-700 border border-emerald-200",

      cardClass:
        "bg-emerald-500 text-white",

      glow:
        "from-emerald-400/20 to-emerald-500/5",
    },

    LIMITED: {

      label: "Few Slots Left",

      badgeClass:
        "bg-amber-100 text-amber-700 border border-amber-200",

      cardClass:
        "bg-amber-500 text-white",

      glow:
        "from-amber-400/20 to-amber-500/5",
    },

    FULL: {

      label: "Fully Booked",

      badgeClass:
        "bg-red-100 text-red-700 border border-red-200",

      cardClass:
        "bg-red-500 text-white",

      glow:
        "from-red-400/20 to-red-500/5",
    },
  };


  const availability =
    availabilityConfig[
      doc.availability_status
    ] ||
    availabilityConfig.AVAILABLE;


  return (

    <div
      className="
        group
        relative
        overflow-hidden

        bg-white/90
        backdrop-blur-xl

        border
        border-white/30

        rounded-[2.5rem]

        shadow-lg

        hover:shadow-2xl
        hover:-translate-y-1

        transition-all
        duration-500
      "
    >

      <div
        className={`
          absolute
          inset-0

          opacity-0
          group-hover:opacity-100

          bg-gradient-to-r

          ${availability.glow}

          transition-all
          duration-700
        `}
      />


      <div
        className="
          relative
          z-10

          p-7

          flex
          flex-col
          2xl:flex-row

          gap-8
          justify-between
        "
      >

        {/* ============================================= */}
        {/* ✅ LEFT */}
        {/* ============================================= */}

        <div
          className="
            flex
            flex-col
            lg:flex-row

            gap-7
            flex-1
          "
        >

          {/* AVATAR */}

          <div className="relative shrink-0">

            <div
              className="
                w-32
                h-32

                rounded-[2rem]

                bg-gradient-to-br
                from-cyan-500/10
                via-teal-500/10
                to-blue-500/10

                flex
                items-center
                justify-center

                text-cyan-700
                text-5xl
                font-black

                shadow-lg
              "
            >

              {doc.name?.charAt(0)}

            </div>


            <div
              className="
                absolute
                bottom-2
                right-2

                w-6
                h-6

                rounded-full

                bg-emerald-500

                border-4
                border-white

                shadow-lg
              "
            />

          </div>


          {/* DETAILS */}

          <div className="flex-1 min-w-0">

            <div
              className="
                flex
                flex-wrap
                items-center
                gap-3
              "
            >

              <h2
                className="
                  text-3xl
                  font-black
                  text-slate-900
                "
              >

                {doc.name}

              </h2>


              <div
                className="
                  flex
                  items-center
                  gap-2

                  bg-emerald-100

                  border
                  border-emerald-200

                  text-emerald-700

                  px-4
                  py-2

                  rounded-full

                  text-xs
                  font-bold
                "
              >

                <ShieldCheck size={15} />

                Verified Provider

              </div>

            </div>


            <p
              className="
                text-cyan-700
                font-bold

                mt-3

                text-xl
              "
            >

              {doc.specialization}

            </p>


            <div
              className="
                flex
                flex-wrap

                gap-4

                mt-6
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-2

                  bg-slate-100

                  px-4
                  py-3

                  rounded-2xl

                  text-sm
                  font-medium
                "
              >

                <MapPin
                  size={17}
                  className="
                    text-cyan-700
                  "
                />

                {doc.city || "Unknown City"}

              </div>


              <div
                className="
                  flex
                  items-center
                  gap-2

                  bg-slate-100

                  px-4
                  py-3

                  rounded-2xl

                  text-sm
                  font-medium
                "
              >

                <BriefcaseMedical
                  size={17}
                  className="
                    text-cyan-700
                  "
                />

                {doc.experience}
                {" "}
                Years Experience

              </div>


              <div
                className="
                  flex
                  items-center
                  gap-2

                  bg-slate-100

                  px-4
                  py-3

                  rounded-2xl

                  text-sm
                  font-medium
                "
              >

                <IndianRupee
                  size={17}
                  className="
                    text-cyan-700
                  "
                />

                ₹
                {
                  Number(
                    doc.consultation_fee
                  ).toFixed(0)
                }

              </div>


              {doc.is_online && (

                <div
                  className="
                    flex
                    items-center
                    gap-2

                    bg-blue-50

                    border
                    border-blue-100

                    text-blue-700

                    px-4
                    py-3

                    rounded-2xl

                    text-sm
                    font-semibold
                  "
                >

                  <Video size={16} />

                  Online Consultation

                </div>
              )}

            </div>


            <div
              className="
                flex
                flex-wrap

                gap-3

                mt-6
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-2

                  bg-yellow-50

                  border
                  border-yellow-200

                  text-yellow-700

                  px-4
                  py-2

                  rounded-2xl

                  text-sm
                  font-semibold
                "
              >

                <Star
                  size={16}
                  fill="currentColor"
                />

                4.9 Rating

              </div>


              <div
                className={`
                  flex
                  items-center
                  gap-2

                  px-4
                  py-2

                  rounded-2xl

                  text-sm
                  font-semibold

                  ${availability.badgeClass}
                `}
              >

                <Clock3 size={16} />

                {availability.label}

              </div>


              <div
                className="
                  flex
                  items-center
                  gap-2

                  bg-cyan-50

                  border
                  border-cyan-100

                  text-cyan-700

                  px-4
                  py-2

                  rounded-2xl

                  text-sm
                  font-semibold
                "
              >

                <Activity size={16} />

                {
                  doc.active_appointments || 0
                }
                {" "}
                Active Appointments

              </div>


              {doc.accepts_emergency && (

                <div
                  className="
                    flex
                    items-center
                    gap-2

                    bg-red-50

                    border
                    border-red-100

                    text-red-700

                    px-4
                    py-2

                    rounded-2xl

                    text-sm
                    font-semibold
                  "
                >

                  <Stethoscope size={16} />

                  Emergency Support

                </div>
              )}

            </div>


            <p
              className="
                mt-6

                text-slate-600

                leading-relaxed

                max-w-3xl
              "
            >

              {
                doc.bio ||
                "Experienced healthcare specialist focused on compassionate patient care, modern treatment approaches, and advanced medical consultation workflows."
              }

            </p>

          </div>

        </div>


        {/* ============================================= */}
        {/* ✅ RIGHT */}
        {/* ============================================= */}

        <div
          className="
            w-full
            2xl:w-[300px]

            shrink-0
          "
        >

          <div
            className="
              bg-gradient-to-br
              from-slate-50
              to-white

              border
              border-slate-200

              rounded-[2rem]

              p-7

              shadow-inner
            "
          >

            <div className="text-center">

              <p
                className="
                  text-sm
                  text-slate-500
                  font-medium
                "
              >
                Consultation Fee
              </p>

              <h3
                className="
                  text-5xl
                  font-black
                  text-slate-900

                  mt-3
                "
              >

                ₹
                {
                  Number(
                    doc.consultation_fee
                  ).toFixed(0)
                }

              </h3>

            </div>


            <div
              className={`
                mt-6

                py-4

                rounded-2xl

                text-center

                text-sm
                font-bold

                shadow-lg

                ${availability.cardClass}
              `}
            >

              {availability.label}

            </div>


            <div className="space-y-3 mt-6">

              <button
                onClick={() =>
                  navigate(
                    `/doctor/${doc.id}`
                  )
                }
                className="
                  w-full

                  bg-gradient-to-r
                  from-cyan-600
                  to-teal-600

                  hover:from-cyan-700
                  hover:to-teal-700

                  text-white

                  py-4

                  rounded-2xl

                  font-bold

                  flex
                  items-center
                  justify-center
                  gap-2

                  transition-all
                  duration-300

                  shadow-xl
                "
              >

                Book Appointment

                <ChevronRight
                  size={18}
                />

              </button>


              <button
                onClick={() =>
                  navigate(
                    `/doctor/${doc.id}`
                  )
                }
                className="
                  w-full

                  bg-white

                  border
                  border-slate-200

                  hover:border-cyan-500
                  hover:bg-cyan-50

                  text-slate-800

                  py-4

                  rounded-2xl

                  font-bold

                  transition-all
                  duration-300
                "
              >
                View Full Profile
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default DoctorCard;
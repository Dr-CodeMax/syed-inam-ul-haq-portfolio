import {
  CalendarDays,
  Clock3,
  IndianRupee,
  ShieldCheck,
  MapPin,
  BriefcaseMedical,
} from "lucide-react";

import {
  motion,
} from "framer-motion";


const BookingSummary = ({

  doctor,

  date,

  time,
}) => {

  if (!doctor || !date || !time) {
    return null;
  }

  // =====================================================
  // ✅ DATE FORMAT
  // =====================================================

  const formattedDate =

    date instanceof Date

      ? date.toLocaleDateString(
          "en-IN",
          {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          }
        )

      : date;


  return (

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
        rounded-[2rem]
        border border-borderColor
        shadow-soft
        overflow-hidden
      "
    >

      {/* ================================================= */}
      {/* ✅ HEADER */}
      {/* ================================================= */}

      <div
        className="
          bg-gradient-to-r
          from-primary
          to-secondary
          p-6
          text-white
        "
      >

        <div
          className="
            flex items-center gap-4
          "
        >

          {/* AVATAR */}

          <div
            className="
              w-20 h-20
              rounded-[2rem]
              bg-white/10

              flex items-center
              justify-center

              text-3xl
              font-bold
            "
          >

            {doctor.name?.charAt(0)}

          </div>


          {/* INFO */}

          <div>

            <h2
              className="
                text-2xl
                font-bold
              "
            >

              {doctor.name}

            </h2>

            <p className="text-white/90">

              {doctor.specialization}

            </p>


            <div
              className="
                flex items-center gap-4
                mt-3
                text-sm
                text-white/80
              "
            >

              <div
                className="
                  flex items-center gap-1
                "
              >

                <MapPin size={15} />

                {doctor.city}

              </div>

              <div
                className="
                  flex items-center gap-1
                "
              >

                <BriefcaseMedical
                  size={15}
                />

                {doctor.experience}
                {" "}
                yrs

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* ================================================= */}
      {/* ✅ CONTENT */}
      {/* ================================================= */}

      <div className="p-6">

        {/* VERIFIED */}

        <div
          className="
            flex items-center gap-2

            bg-green-50
            border border-green-100

            text-green-700

            rounded-2xl

            px-4 py-3

            text-sm
            font-semibold

            mb-6
          "
        >

          <ShieldCheck size={18} />

          Verified Healthcare Specialist

        </div>


        {/* DETAILS */}

        <div className="space-y-4">

          {/* DATE */}

          <div
            className="
              flex items-center justify-between

              bg-muted

              rounded-2xl

              p-5
            "
          >

            <div
              className="
                flex items-center gap-3
              "
            >

              <CalendarDays
                size={18}
                className="
                  text-primary
                "
              />

              <span
                className="
                  text-textSecondary
                  text-sm
                "
              >

                Appointment Date

              </span>

            </div>

            <span
              className="
                font-semibold
                text-textPrimary
                text-right
              "
            >

              {formattedDate}

            </span>

          </div>


          {/* TIME */}

          <div
            className="
              flex items-center justify-between

              bg-muted

              rounded-2xl

              p-5
            "
          >

            <div
              className="
                flex items-center gap-3
              "
            >

              <Clock3
                size={18}
                className="
                  text-primary
                "
              />

              <span
                className="
                  text-textSecondary
                  text-sm
                "
              >

                Consultation Time

              </span>

            </div>

            <span
              className="
                font-semibold
                text-textPrimary
              "
            >

              {time.start_time || time}

            </span>

          </div>


          {/* FEE */}

          <div
            className="
              flex items-center justify-between

              bg-muted

              rounded-2xl

              p-5
            "
          >

            <div
              className="
                flex items-center gap-3
              "
            >

              <IndianRupee
                size={18}
                className="
                  text-primary
                "
              />

              <span
                className="
                  text-textSecondary
                  text-sm
                "
              >

                Consultation Fee

              </span>

            </div>

            <span
              className="
                text-3xl
                font-bold
                text-textPrimary
              "
            >

              ₹{
                Number(
                  doctor.consultation_fee
                ).toFixed(0)
              }

            </span>

          </div>

        </div>


        {/* FOOTER */}

        <div
          className="
            mt-6

            bg-primary/10

            text-primary

            rounded-2xl

            p-5

            text-sm
            font-medium
            leading-relaxed
          "
        >

          Please arrive at least
          10 minutes before your
          appointment for a smooth
          and timely consultation.

        </div>

      </div>

    </motion.div>
  );
};

export default BookingSummary;
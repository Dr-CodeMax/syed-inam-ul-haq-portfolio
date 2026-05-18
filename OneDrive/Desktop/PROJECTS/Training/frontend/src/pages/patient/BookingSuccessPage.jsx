import {
  Link,
  useLocation,
} from "react-router-dom";

import {
  CircleCheckBig,
  CalendarDays,
  Clock3,
  ArrowRight,
} from "lucide-react";

import { motion } from "framer-motion";


const BookingSuccessPage = () => {

  const { state } = useLocation();


  return (

    <div
      className="
        min-h-screen
        flex items-center justify-center
        px-4 py-12
      "
    >

      <motion.div

        initial={{
          opacity: 0,
          y: 30,
        }}

        animate={{
          opacity: 1,
          y: 0,
        }}

        className="
          w-full
          max-w-2xl
          bg-white
          rounded-[2.5rem]
          border border-borderColor
          shadow-card
          overflow-hidden
        "
      >

        {/* HEADER */}

        <div
          className="
            bg-gradient-to-r
            from-primary
            to-secondary
            p-10
            text-white
            text-center
            relative
            overflow-hidden
          "
        >

          <div
            className="
              absolute
              top-0 right-0
              w-72 h-72
              bg-white/10
              rounded-full
              blur-3xl
            "
          />

          <div className="relative z-10">

            <div
              className="
                w-24 h-24
                rounded-full
                bg-white/10
                flex items-center justify-center
                mx-auto
                mb-6
              "
            >

              <CircleCheckBig size={52} />

            </div>


            <h1
              className="
                text-4xl
                font-bold
              "
            >

              Appointment Confirmed

            </h1>


            <p
              className="
                mt-4
                text-white/90
                text-lg
              "
            >

              Your healthcare appointment
              has been successfully booked.

            </p>

          </div>

        </div>


        {/* CONTENT */}

        <div className="p-8 md:p-10">

          {/* APPOINTMENT CARD */}

          <div
            className="
              bg-muted
              rounded-[2rem]
              p-6
              border border-borderColor
            "
          >

            <div
              className="
                flex
                flex-col
                md:flex-row
                md:items-center
                justify-between
                gap-6
              "
            >

              {/* DOCTOR */}

              <div>

                <p
                  className="
                    text-sm
                    text-textSecondary
                    mb-2
                  "
                >

                  Doctor

                </p>

                <h2
                  className="
                    text-2xl
                    font-bold
                    text-textPrimary
                  "
                >

                  {state?.doctorName || "N/A"}

                </h2>

              </div>


              {/* DATE */}

              <div
                className="
                  flex items-center gap-3
                "
              >

                <div
                  className="
                    w-12 h-12
                    rounded-2xl
                    bg-primary/10
                    text-primary
                    flex items-center justify-center
                  "
                >

                  <CalendarDays size={20} />

                </div>

                <div>

                  <p
                    className="
                      text-sm
                      text-textSecondary
                    "
                  >

                    Appointment Date

                  </p>

                  <p
                    className="
                      font-semibold
                    "
                  >

                    {state?.date || "N/A"}

                  </p>

                </div>

              </div>


              {/* TIME */}

              <div
                className="
                  flex items-center gap-3
                "
              >

                <div
                  className="
                    w-12 h-12
                    rounded-2xl
                    bg-primary/10
                    text-primary
                    flex items-center justify-center
                  "
                >

                  <Clock3 size={20} />

                </div>

                <div>

                  <p
                    className="
                      text-sm
                      text-textSecondary
                    "
                  >

                    Consultation Time

                  </p>

                  <p
                    className="
                      font-semibold
                    "
                  >

                    {state?.time || "N/A"}

                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* INFO */}

          <div
            className="
              mt-6
              bg-green-50
              border border-green-100
              rounded-2xl
              p-5
              text-green-700
              text-sm
              leading-relaxed
            "
          >

            A confirmation notification has
            been generated for your appointment.
            Please arrive at least 10 minutes
            before your scheduled consultation.

          </div>


          {/* BUTTONS */}

          <div
            className="
              flex
              flex-col
              sm:flex-row
              gap-4
              mt-8
            "
          >

            <Link
              to="/patient/appointments"
              className="
                flex-1
                bg-primary
                hover:bg-primaryHover
                text-white
                py-4
                rounded-2xl
                font-semibold
                flex items-center justify-center
                gap-2
                transition-all
                duration-300
                hover:scale-[1.02]
              "
            >

              View Appointments

              <ArrowRight size={18} />

            </Link>


            <Link
              to="/"
              className="
                flex-1
                bg-white
                border border-borderColor
                hover:border-primary
                py-4
                rounded-2xl
                font-semibold
                text-textPrimary
                flex items-center justify-center
                transition-all
                duration-300
              "
            >

              Book Another Appointment

            </Link>

          </div>

        </div>

      </motion.div>

    </div>
  );
};

export default BookingSuccessPage;
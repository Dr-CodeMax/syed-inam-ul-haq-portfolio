import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  CalendarDays,
  Clock3,
  CircleCheckBig,
  Stethoscope,
} from "lucide-react";

import toast from "react-hot-toast";

import DoctorSelector from "../../components/booking/DoctorSelector";
import DateSelector from "../../components/booking/DateSelector";
import SlotSelector from "../../components/booking/SlotSelector";
import BookingForm from "../../components/booking/BookingForm";
import BookingSummary from "../../components/booking/BookingSummary";

import {
  createAppointment,
} from "../../api/appointment";

import {
  formatDateLocal,
} from "../../utils/date";


const BookAppointment = () => {

  const navigate = useNavigate();

  const location = useLocation();


  // =====================================================
  // ✅ PREFILLED STATE
  // =====================================================

  const prefilledDoctor =
    location.state?.doctor || null;

  const prefilledDate =
    location.state?.date || null;

  const prefilledSlot =
    location.state?.slot || null;


  // =====================================================
  // ✅ MAIN STATES
  // =====================================================

  const [doctor, setDoctor] =
    useState(prefilledDoctor);

  const [date, setDate] =
    useState(prefilledDate);

  const [slot, setSlot] =
    useState(prefilledSlot);

  const [symptoms, setSymptoms] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  // =====================================================
  // ✅ FORMATTED DATE
  // =====================================================

  const formattedDate = useMemo(() => {

    return date
      ? formatDateLocal(date)
      : null;

  }, [date]);


  // =====================================================
  // ✅ RESET SLOT WHEN DATE CHANGES
  // =====================================================

  useEffect(() => {

    if (!date) {

      setSlot(null);
    }

  }, [date]);


  // =====================================================
  // ✅ FINAL BOOKING
  // =====================================================

  const handleBooking = async () => {

    if (!doctor || !date || !slot) {

      toast.error(
        "Please complete all selections"
      );

      return;
    }

    try {

      setLoading(true);

      const payload = {

        doctor_id: doctor.id,

        date: formattedDate,

        time:
          slot?.start_time || slot,

        symptoms:
          symptoms?.trim() ||
          "General Checkup",

        priority: "NORMAL",
      };

      await createAppointment(payload);

      toast.success(
        "Appointment booked successfully 🎉"
      );

      navigate("/patient/appointments");

    } catch (err) {

      console.error(
        "BOOKING ERROR:",
        err
      );

      let message =
        "Booking failed";

      if (
        Array.isArray(
          err?.response?.data?.detail
        )
      ) {

        message =
          err.response.data.detail[0]?.msg ||
          "Validation error";
      }

      else if (
        typeof err?.response?.data?.detail ===
        "string"
      ) {

        message =
          err.response.data.detail;
      }

      else if (err?.message) {

        message = err.message;
      }

      toast.error(
        String(message)
      );

    } finally {

      setLoading(false);
    }
  };


  // =====================================================
  // ✅ STEP STATUS
  // =====================================================

  const steps = [

    {
      label: "Doctor",
      completed: !!doctor,
      icon: Stethoscope,
    },

    {
      label: "Date",
      completed: !!date,
      icon: CalendarDays,
    },

    {
      label: "Slot",
      completed: !!slot,
      icon: Clock3,
    },

    {
      label: "Confirm",
      completed:
        !!doctor &&
        !!date &&
        !!slot,
      icon: CircleCheckBig,
    },
  ];


  return (

    <div className="max-w-7xl mx-auto">

      {/* ================================================= */}
      {/* ✅ HERO */}
      {/* ================================================= */}

      <div
        className="
          rounded-[2rem]
          bg-gradient-to-r
          from-primary
          to-secondary
          p-8 md:p-10
          text-white
          relative
          overflow-hidden
          mb-8
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
              inline-flex
              items-center
              gap-2
              bg-white/10
              backdrop-blur-md
              px-4 py-2
              rounded-full
              text-sm
              font-medium
              mb-6
            "
          >

            Secure Healthcare Booking

          </div>


          <h1
            className="
              text-4xl
              md:text-5xl
              font-bold
              leading-tight
            "
          >

            Book Your
            <br />

            Appointment

          </h1>


          <p
            className="
              mt-4
              text-white/90
              text-lg
              max-w-2xl
            "
          >

            Choose your preferred doctor,
            date and slot with a smooth
            healthcare booking experience.

          </p>

        </div>

      </div>


      {/* ================================================= */}
      {/* ✅ STEPPER */}
      {/* ================================================= */}

      <div
        className="
          bg-white
          rounded-[2rem]
          border border-borderColor
          shadow-soft
          p-5 md:p-8
          mb-8
        "
      >

        <div
          className="
            grid
            grid-cols-2
            md:grid-cols-4
            gap-5
          "
        >

          {steps.map((step, index) => {

            const Icon = step.icon;

            return (

              <div
                key={index}
                className="
                  flex items-center gap-4
                "
              >

                <div
                  className={`
                    w-14 h-14
                    rounded-2xl
                    flex items-center justify-center
                    transition-all duration-300

                    ${step.completed

                      ? `
                        bg-primary
                        text-white
                        shadow-soft
                      `

                      : `
                        bg-muted
                        text-slate-400
                      `
                    }
                  `}
                >

                  <Icon size={22} />

                </div>

                <div>

                  <p
                    className="
                      text-xs
                      text-textSecondary
                    "
                  >

                    Step {index + 1}

                  </p>

                  <h3
                    className="
                      font-semibold
                      text-textPrimary
                    "
                  >

                    {step.label}

                  </h3>

                </div>

              </div>
            );
          })}

        </div>

      </div>


      {/* ================================================= */}
      {/* ✅ MAIN GRID */}
      {/* ================================================= */}

      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-3
          gap-8
        "
      >

        {/* ================================================= */}
        {/* ✅ LEFT CONTENT */}
        {/* ================================================= */}

        <div className="xl:col-span-2 space-y-8">

          {/* DOCTOR */}

          {!prefilledDoctor && (

            <DoctorSelector
              onSelect={(selectedDoctor) => {

                setDoctor(selectedDoctor);

                setDate(null);

                setSlot(null);
              }}
            />
          )}


          {/* SELECTED DOCTOR */}

          {doctor && (

            <div
              className="
                bg-white
                rounded-[2rem]
                border border-borderColor
                shadow-soft
                p-6 md:p-8
              "
            >

              <div
                className="
                  flex
                  flex-col
                  md:flex-row
                  gap-6
                  md:items-center
                "
              >

                {/* AVATAR */}

                <div
                  className="
                    w-24 h-24
                    rounded-[2rem]
                    bg-gradient-to-br
                    from-primary/10
                    to-accent/10
                    flex items-center justify-center
                    text-4xl
                    font-bold
                    text-primary
                    shrink-0
                  "
                >

                  {doctor?.name?.charAt(0)}

                </div>


                {/* INFO */}

                <div className="flex-1">

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
                        font-bold
                        text-textPrimary
                      "
                    >

                      {doctor?.name}

                    </h2>

                    <div
                      className="
                        bg-green-100
                        text-green-700
                        px-3 py-1
                        rounded-full
                        text-xs
                        font-semibold
                      "
                    >

                      Verified

                    </div>

                  </div>


                  <p
                    className="
                      text-primary
                      font-semibold
                      mt-2
                      text-lg
                    "
                  >

                    {doctor?.specialization}

                  </p>


                  <div
                    className="
                      flex
                      flex-wrap
                      gap-4
                      mt-4
                    "
                  >

                    <div
                      className="
                        bg-muted
                        px-4 py-2
                        rounded-2xl
                        text-sm
                        font-medium
                      "
                    >

                      {doctor?.experience}
                      {" "}
                      years experience

                    </div>

                    <div
                      className="
                        bg-primary/10
                        text-primary
                        px-4 py-2
                        rounded-2xl
                        text-sm
                        font-semibold
                      "
                    >

                      ₹{doctor?.consultation_fee}
                      {" "}
                      consultation

                    </div>

                  </div>

                </div>

              </div>

            </div>
          )}


          {/* DATE */}

          {!prefilledDate && doctor && (

            <DateSelector
              selectedDate={date}
              onSelect={(d) => {

                setDate(d);

                setSlot(null);
              }}
            />
          )}


          {/* SLOT */}

          {!prefilledSlot &&
            doctor &&
            formattedDate && (

            <SlotSelector
              doctor={doctor}
              date={formattedDate}
              selectedSlot={slot}
              onSelect={setSlot}
            />
          )}


          {/* FORM */}

          {doctor && date && slot && (

            <BookingForm
              doctor={doctor}
              date={date}
              time={slot}
              onSymptomsChange={
                setSymptoms
              }
            />
          )}

        </div>


        {/* ================================================= */}
        {/* ✅ RIGHT SUMMARY */}
        {/* ================================================= */}

        <div>

          <div className="sticky top-28">

            <BookingSummary
              doctor={doctor}
              date={date}
              time={
                slot?.start_time || slot
              }
            />


            {/* FINAL BUTTON */}

            {doctor && date && slot && (

              <button
                onClick={handleBooking}
                disabled={loading}
                className={`
                  w-full
                  mt-6
                  py-4
                  rounded-2xl
                  font-semibold
                  text-white
                  transition-all
                  duration-300

                  ${loading

                    ? `
                      bg-slate-400
                      cursor-not-allowed
                    `

                    : `
                      bg-primary
                      hover:bg-primaryHover
                      hover:scale-[1.02]
                      shadow-soft
                    `
                  }
                `}
              >

                {loading
                  ? "Booking Appointment..."
                  : "Confirm Appointment"}

              </button>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default BookAppointment;
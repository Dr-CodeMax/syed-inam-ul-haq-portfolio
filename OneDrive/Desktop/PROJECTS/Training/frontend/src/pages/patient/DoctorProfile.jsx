// ======================================================
// FILE: frontend/src/pages/doctor/DoctorProfile.jsx
// ======================================================

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  MapPin,
  BriefcaseMedical,
  IndianRupee,
  Star,
  ShieldCheck,
  Clock3,
  CalendarDays,
  ChevronRight,
  Activity,
  Stethoscope,
  Building2,
  Ambulance,
  Wifi,
} from "lucide-react";

import { getDoctorById }
from "../../api/doctor";

import DateSelector
from "../../components/booking/DateSelector";

import SlotSelector
from "../../components/booking/SlotSelector";

import Loader
from "../../components/Loader";


const DoctorProfile = () => {

  const { id } = useParams();

  const navigate =
    useNavigate();

  const [doctor, setDoctor] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [selectedDate,
    setSelectedDate] =
    useState(new Date());

  const [selectedSlot,
    setSelectedSlot] =
    useState(null);

  // =====================================================
  // ✅ FETCH DOCTOR
  // =====================================================

  useEffect(() => {

    const loadDoctor =
      async () => {

        try {

          setLoading(true);

          const doctorData =
            await getDoctorById(id);

          setDoctor(doctorData);

        } catch (error) {

          console.error(
            "DOCTOR FETCH ERROR:",
            error
          );

          setDoctor(null);

        } finally {

          setLoading(false);
        }
      };

    loadDoctor();

  }, [id]);

  // =====================================================
  // ✅ FORMAT DATE
  // =====================================================

  const formattedDate =
    selectedDate
      ?.toISOString()
      ?.split("T")[0];

  // =====================================================
  // ✅ CONTINUE BOOKING
  // =====================================================

  const handleContinueBooking =
    () => {

      navigate(
        "/patient/booking",
        {
          state: {
            doctor,
            date: formattedDate,
            slot: selectedSlot,
          },
        }
      );
    };

  // =====================================================
  // ✅ LOADING
  // =====================================================

  if (loading) {

    return (

      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
        "
      >

        <Loader
          text="
            Loading doctor profile...
          "
        />

      </div>
    );
  }

  // =====================================================
  // ✅ NOT FOUND
  // =====================================================

  if (!doctor) {

    return (

      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          p-6
        "
      >

        <div
          className="
            bg-white
            rounded-[2rem]
            border border-borderColor
            shadow-soft
            p-10
            text-center
            max-w-md
            w-full
          "
        >

          <div
            className="
              w-20 h-20
              mx-auto
              rounded-full
              bg-red-100
              flex
              items-center
              justify-center
              text-red-600
              text-3xl
              font-bold
            "
          >

            !

          </div>

          <h2
            className="
              mt-6
              text-2xl
              font-bold
              text-textPrimary
            "
          >

            Doctor Not Found

          </h2>

        </div>

      </div>
    );
  }

  // =====================================================
  // ✅ AVAILABILITY CONFIG
  // =====================================================

  const availabilityConfig = {

    AVAILABLE: {
      label: "Available Today",
      badgeClass:
        "bg-green-100 text-green-700",
    },

    LIMITED: {
      label: "Few Slots Left",
      badgeClass:
        "bg-yellow-100 text-yellow-700",
    },

    FULL: {
      label: "Fully Booked",
      badgeClass:
        "bg-red-100 text-red-700",
    },

    OFFLINE: {
      label: "Offline",
      badgeClass:
        "bg-slate-200 text-slate-700",
    },
  };

  const availability =
    availabilityConfig[
      doctor.availability_status
    ] || availabilityConfig.AVAILABLE;

  return (

    <div
      className="
        min-h-screen
        bg-background
        py-10
      "
    >

      <div
        className="
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8
        "
      >

        <div
          className="
            grid
            grid-cols-1
            xl:grid-cols-[minmax(0,1fr)_380px]
            gap-8
          "
        >

          {/* LEFT */}

          <div className="space-y-8">

            {/* PROFILE CARD */}

            <div
              className="
                bg-white
                rounded-[2rem]
                border border-borderColor
                shadow-soft
                overflow-hidden
              "
            >

              <div
                className="
                  p-8
                  flex
                  flex-col
                  lg:flex-row
                  gap-8
                "
              >

                {/* AVATAR */}

                <div
                  className="
                    relative
                    shrink-0
                  "
                >

                  {
                    doctor.profile_image
                      ? (
                        <img
                          src={
                            doctor.profile_image
                          }
                          alt={doctor.name}
                          className="
                            w-36 h-36
                            rounded-[2.5rem]
                            object-cover
                            shadow-soft
                          "
                        />
                      )
                      : (
                        <div
                          className="
                            w-36 h-36
                            rounded-[2.5rem]
                            bg-gradient-to-br
                            from-primary/10
                            to-secondary/10
                            flex
                            items-center
                            justify-center
                            text-primary
                            text-5xl
                            font-bold
                            shadow-soft
                          "
                        >

                          {
                            doctor.name
                              ?.charAt(0)
                          }

                        </div>
                      )
                  }

                  <div
                    className="
                      absolute
                      bottom-2
                      right-2
                      w-6
                      h-6
                      bg-green-500
                      border-4
                      border-white
                      rounded-full
                    "
                  />

                </div>

                {/* DETAILS */}

                <div className="flex-1">

                  <div
                    className="
                      flex
                      flex-wrap
                      items-center
                      gap-3
                    "
                  >

                    <h1
                      className="
                        text-4xl
                        font-bold
                        text-textPrimary
                      "
                    >

                      {doctor.name}

                    </h1>

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        bg-green-100
                        text-green-700
                        px-4 py-2
                        rounded-full
                        text-sm
                        font-semibold
                      "
                    >

                      <ShieldCheck
                        size={16}
                      />

                      Verified

                    </div>

                  </div>

                  <p
                    className="
                      mt-3
                      text-xl
                      font-semibold
                      text-primary
                    "
                  >

                    {
                      doctor.specialization
                    }

                  </p>

                  {/* INFO */}

                  <div
                    className="
                      mt-6
                      grid
                      grid-cols-1
                      sm:grid-cols-2
                      gap-4
                      text-textSecondary
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                      "
                    >

                      <MapPin size={18} />

                      {doctor.city}

                    </div>

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                      "
                    >

                      <BriefcaseMedical
                        size={18}
                      />

                      {
                        doctor.experience
                      }
                      {" "}
                      Years Experience

                    </div>

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                      "
                    >

                      <IndianRupee
                        size={18}
                      />

                      ₹
                      {
                        Number(
                          doctor.consultation_fee
                        ).toFixed(0)
                      }

                    </div>

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                      "
                    >

                      <Building2
                        size={18}
                      />

                      {
                        doctor.hospital_name
                        || "Independent Practice"
                      }

                    </div>

                  </div>

                  {/* BADGES */}

                  <div
                    className="
                      mt-6
                      flex
                      flex-wrap
                      gap-4
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        bg-yellow-50
                        text-yellow-700
                        px-4 py-3
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
                        px-4 py-3
                        rounded-2xl
                        text-sm
                        font-semibold
                        ${availability.badgeClass}
                      `}
                    >

                      <Clock3 size={16} />

                      {
                        availability.label
                      }

                    </div>

                    {
                      doctor.is_online &&
                      (
                        <div
                          className="
                            flex
                            items-center
                            gap-2
                            bg-blue-100
                            text-blue-700
                            px-4 py-3
                            rounded-2xl
                            text-sm
                            font-semibold
                          "
                        >

                          <Wifi size={16} />

                          Online Consultation

                        </div>
                      )
                    }

                    {
                      doctor.accepts_emergency &&
                      (
                        <div
                          className="
                            flex
                            items-center
                            gap-2
                            bg-red-100
                            text-red-700
                            px-4 py-3
                            rounded-2xl
                            text-sm
                            font-semibold
                          "
                        >

                          <Ambulance
                            size={16}
                          />

                          Emergency Support

                        </div>
                      )
                    }

                  </div>

                  {/* ABOUT */}

                  <div className="mt-8">

                    <h3
                      className="
                        text-lg
                        font-bold
                        text-textPrimary
                      "
                    >

                      About Doctor

                    </h3>

                    <p
                      className="
                        mt-3
                        text-textSecondary
                        leading-relaxed
                      "
                    >

                      {
                        doctor.bio
                        ||
                        `Experienced healthcare specialist dedicated to delivering high-quality patient care using modern treatment methods and compassionate consultation.`
                      }

                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* DATE SELECTOR */}

            <DateSelector
              selectedDate={
                selectedDate
              }
              onSelect={(date) => {

                setSelectedDate(
                  date
                );

                setSelectedSlot(
                  null
                );
              }}
            />

            {/* SLOT SELECTOR */}

            <SlotSelector
              doctor={doctor}
              date={formattedDate}
              selectedSlot={
                selectedSlot
              }
              onSelect={
                setSelectedSlot
              }
            />

          </div>

          {/* RIGHT SIDEBAR */}

          <div>

            <div
              className="
                bg-white
                rounded-[2rem]
                border border-borderColor
                shadow-soft
                p-8
                sticky
                top-28
              "
            >

              <h2
                className="
                  text-2xl
                  font-bold
                  text-textPrimary
                "
              >

                Booking Summary

              </h2>

              {/* SUMMARY */}

              <div className="mt-8 space-y-5">

                <div
                  className="
                    flex
                    justify-between
                  "
                >

                  <span
                    className="
                      text-textSecondary
                    "
                  >

                    Consultation

                  </span>

                  <span
                    className="
                      font-semibold
                    "
                  >

                    ₹
                    {
                      Number(
                        doctor.consultation_fee
                      ).toFixed(0)
                    }

                  </span>

                </div>

                <div
                  className="
                    flex
                    justify-between
                  "
                >

                  <span
                    className="
                      text-textSecondary
                    "
                  >

                    Date

                  </span>

                  <span
                    className="
                      font-semibold
                    "
                  >

                    {formattedDate}

                  </span>

                </div>

                <div
                  className="
                    flex
                    justify-between
                  "
                >

                  <span
                    className="
                      text-textSecondary
                    "
                  >

                    Slot

                  </span>

                  <span
                    className="
                      font-semibold
                    "
                  >

                    {
                      selectedSlot
                        ? `${selectedSlot.start_time} - ${selectedSlot.end_time}`
                        : "Not Selected"
                    }

                  </span>

                </div>

              </div>

              {/* ANALYTICS */}

              <div
                className="
                  mt-8
                  border-t
                  border-borderColor
                  pt-8
                  space-y-4
                "
              >

                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >

                  <span
                    className="
                      text-textSecondary
                    "
                  >

                    Total Slots

                  </span>

                  <span
                    className="
                      font-semibold
                    "
                  >

                    {
                      doctor.total_slots || 0
                    }

                  </span>

                </div>

                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >

                  <span
                    className="
                      text-textSecondary
                    "
                  >

                    Remaining

                  </span>

                  <span
                    className="
                      font-semibold
                    "
                  >

                    {
                      doctor.remaining_slots || 0
                    }

                  </span>

                </div>

                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >

                  <span
                    className="
                      text-textSecondary
                    "
                  >

                    Workload

                  </span>

                  <span
                    className="
                      font-semibold
                    "
                  >

                    {
                      doctor.workload_percentage || 0
                    }
                    %

                  </span>

                </div>

              </div>

              {/* BUTTON */}

              <button
                disabled={!selectedSlot}
                onClick={
                  handleContinueBooking
                }
                className={`
                  w-full
                  mt-8
                  py-4
                  rounded-2xl
                  font-semibold
                  flex
                  items-center
                  justify-center
                  gap-2
                  transition-all
                  duration-300

                  ${
                    selectedSlot
                      ? `
                        bg-primary
                        hover:bg-primaryHover
                        text-white
                      `
                      : `
                        bg-slate-200
                        text-slate-500
                        cursor-not-allowed
                      `
                  }
                `}
              >

                Continue Booking

                <ChevronRight
                  size={18}
                />

              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default DoctorProfile;
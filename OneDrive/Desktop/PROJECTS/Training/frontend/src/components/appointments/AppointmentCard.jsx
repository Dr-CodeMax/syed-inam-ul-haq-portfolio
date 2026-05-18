import {
  Calendar,
  Clock3,
  Stethoscope,
  CheckCircle2,
  XCircle,
  Wallet,
  FileText,
  AlertTriangle,
  Check,
  RefreshCcw,
  Ban,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import toast
from "react-hot-toast";

import PaymentButton
from "../PaymentButton";

import StatusBadge
from "../ui/StatusBadge";

import PriorityBadge
from "./PriorityBadge";

const AppointmentCard = ({
  appointment,
  role = "PATIENT",

  // PATIENT ACTIONS
  cancelAppointment,

  // DOCTOR ACTIONS
  onConfirm,
  onCancel,
  onComplete,
  onReschedule,

  refreshAppointments,
}) => {

  const [expanded,
    setExpanded] =
    useState(false);

  const [showReschedule,
    setShowReschedule] =
    useState(false);

  const [newDate,
    setNewDate] =
    useState("");

  const [newTime,
    setNewTime] =
    useState("");


  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate =
    (date) => {

      try {

        return new Date(date)
          .toLocaleDateString(
            "en-IN",
            {
              day: "numeric",
              month: "short",
              year: "numeric",
            }
          );

      } catch {

        return date;

      }

    };


  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatTime =
    (time) => {

      try {

        const [h, m] =
          time.split(":");

        const d =
          new Date();

        d.setHours(h);

        d.setMinutes(m);

        return d.toLocaleTimeString(
          "en-IN",
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        );

      } catch {

        return time;

      }

    };


  // =====================================================
  // APPOINTMENT DATETIME
  // =====================================================

  const appointmentDateTime =
    useMemo(() => {

      try {

        return new Date(
          `${appointment.date} ${appointment.time}`
        );

      } catch {

        return null;

      }

    }, [
      appointment.date,
      appointment.time,
    ]);


  // =====================================================
  // IS EXPIRED
  // =====================================================

  const isExpired =
    useMemo(() => {

      if (!appointmentDateTime)
        return false;

      return (
        appointmentDateTime <
        new Date()
      );

    }, [
      appointmentDateTime,
    ]);


  // =====================================================
  // PAYMENT STATUS
  // =====================================================

  const showPaymentButton =
    role === "PATIENT" &&
    appointment?.status ===
      "PENDING";


  // =====================================================
  // DOCTOR ACTION CONDITIONS
  // =====================================================

  const canConfirm =
    role === "DOCTOR" &&
    appointment.status ===
      "PENDING";

  const canCancel =
    role === "DOCTOR" &&
    ![
      "COMPLETED",
      "CANCELLED",
    ].includes(
      appointment.status
    );

  const canComplete =
    role === "DOCTOR" &&
    [
      "CONFIRMED",
      "RESCHEDULED",
    ].includes(
      appointment.status
    );

  const canReschedule =
    role === "DOCTOR" &&
    ![
      "COMPLETED",
      "CANCELLED",
    ].includes(
      appointment.status
    );


  // =====================================================
  // HANDLE RESCHEDULE
  // =====================================================

  const handleReschedule =
    async () => {

      if (
        !newDate ||
        !newTime
      ) {

        toast.error(
          "Select new date and time"
        );

        return;

      }

      try {

        await onReschedule(
          appointment.id,
          newDate,
          newTime
        );

        setShowReschedule(
          false
        );

        setNewDate("");

        setNewTime("");

      } catch (err) {

        console.error(err);

      }

    };


  return (

    <div
      className="
        relative
        bg-white
        border
        border-slate-200
        rounded-[2rem]
        shadow-sm
        hover:shadow-xl
        transition-all
        duration-300
        overflow-hidden
      "
    >

      {/* LEFT BORDER */}

      <div
        className={`
          absolute
          left-0
          top-0
          h-full
          w-2

          ${
            appointment.status ===
            "COMPLETED"
              ? "bg-blue-500"

              : appointment.status ===
                "CANCELLED"
              ? "bg-red-500"

              : appointment.status ===
                "CONFIRMED"
              ? "bg-green-500"

              : appointment.status ===
                "RESCHEDULED"
              ? "bg-yellow-500"

              : "bg-primary"
          }
        `}
      />

      <div className="p-6 md:p-8">

        {/* HEADER */}

        <div
          className="
            flex
            flex-col
            lg:flex-row
            lg:items-start
            justify-between
            gap-6
          "
        >

          {/* ================================================= */}
          {/* LEFT */}
          {/* ================================================= */}

          <div className="flex gap-5">

            {/* AVATAR */}

            <div
              className="
                w-20
                h-20
                rounded-[2rem]
                bg-gradient-to-br
                from-primary/10
                to-accent/10
                flex
                items-center
                justify-center
                text-primary
                text-3xl
                font-bold
                shrink-0
              "
            >

              {role === "PATIENT"

                ? appointment?.doctor_name?.charAt(0)

                : appointment?.patient_name?.charAt(0)}

            </div>

            {/* INFO */}

            <div>

              {/* TITLE */}

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
                    text-2xl
                    font-bold
                    text-slate-800
                  "
                >

                  {role === "PATIENT"

                    ? (
                        appointment.doctor_name ||
                        `Doctor #${appointment.doctor_id}`
                      )

                    : (
                        appointment.patient_name ||
                        `Patient #${appointment.patient_id}`
                      )}

                </h2>

                <StatusBadge
                  status={
                    appointment.status
                  }
                />

                <PriorityBadge
                  priority={
                    appointment.priority
                  }
                />

              </div>

              {/* SPECIALIZATION */}

              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-slate-500
                  mt-2
                "
              >

                <Stethoscope
                  size={16}
                />

                <span>

                  {
                    appointment.doctor_specialization ||
                    "General Specialist"
                  }

                </span>

              </div>

              {/* DATE + TIME */}

              <div
                className="
                  flex
                  flex-wrap
                  gap-5
                  mt-5
                  text-sm
                  text-slate-500
                "
              >

                <div className="flex items-center gap-2">

                  <Calendar
                    size={16}
                  />

                  {formatDate(
                    appointment.date
                  )}

                </div>

                <div className="flex items-center gap-2">

                  <Clock3
                    size={16}
                  />

                  {formatTime(
                    appointment.time
                  )}

                </div>

              </div>

              {/* EXPIRED WARNING */}

              {isExpired &&
                ![
                  "COMPLETED",
                  "CANCELLED",
                ].includes(
                  appointment.status
                ) && (

                <div
                  className="
                    mt-4
                    inline-flex
                    items-center
                    gap-2
                    bg-orange-50
                    text-orange-700
                    px-4
                    py-2
                    rounded-xl
                    text-sm
                    font-medium
                  "
                >

                  <AlertTriangle
                    size={16}
                  />

                  Appointment time has passed

                </div>

              )}

            </div>

          </div>

          {/* ================================================= */}
          {/* ACTIONS */}
          {/* ================================================= */}

          <div className="flex flex-wrap gap-3">

            {/* ================================================= */}
            {/* PATIENT PAYMENT */}
            {/* ================================================= */}

            {showPaymentButton && (

              <PaymentButton
                appointmentId={
                  appointment?.id
                }
                amount={
                  appointment.amount ||
                  500
                }
                doctorName={
                  appointment.doctor_name
                }
                date={
                  appointment.date
                }
                time={
                  appointment.time
                }
                onSuccess={
                  refreshAppointments
                }
              />

            )}

            {/* ================================================= */}
            {/* PATIENT CANCEL */}
            {/* ================================================= */}

            {role === "PATIENT" &&
              appointment.status ===
                "PENDING" && (

              <button
                onClick={() =>
                  cancelAppointment(
                    appointment.id
                  )
                }
                className="
                  bg-red-500
                  hover:bg-red-600
                  text-white
                  px-5
                  py-3
                  rounded-2xl
                  font-semibold
                  transition-all
                "
              >

                Cancel

              </button>

            )}

            {/* ================================================= */}
            {/* DOCTOR CONFIRM */}
            {/* ================================================= */}

            {canConfirm && (

              <button
                onClick={() =>
                  onConfirm(
                    appointment.id
                  )
                }
                className="
                  bg-green-500
                  hover:bg-green-600
                  text-white
                  px-5
                  py-3
                  rounded-2xl
                  font-semibold
                  transition-all
                  flex
                  items-center
                  gap-2
                "
              >

                <Check size={18} />

                Confirm

              </button>

            )}

            {/* ================================================= */}
            {/* DOCTOR COMPLETE */}
            {/* ================================================= */}

            {canComplete && (

              <button
                onClick={() =>
                  onComplete(
                    appointment.id
                  )
                }
                className="
                  bg-blue-500
                  hover:bg-blue-600
                  text-white
                  px-5
                  py-3
                  rounded-2xl
                  font-semibold
                  transition-all
                  flex
                  items-center
                  gap-2
                "
              >

                <CheckCircle2
                  size={18}
                />

                Complete

              </button>

            )}

            {/* ================================================= */}
            {/* DOCTOR RESCHEDULE */}
            {/* ================================================= */}

            {canReschedule && (

              <button
                onClick={() =>
                  setShowReschedule(
                    !showReschedule
                  )
                }
                className="
                  bg-yellow-500
                  hover:bg-yellow-600
                  text-white
                  px-5
                  py-3
                  rounded-2xl
                  font-semibold
                  transition-all
                  flex
                  items-center
                  gap-2
                "
              >

                <RefreshCcw
                  size={18}
                />

                Reschedule

              </button>

            )}

            {/* ================================================= */}
            {/* DOCTOR CANCEL */}
            {/* ================================================= */}

            {canCancel && (

              <button
                onClick={() =>
                  onCancel(
                    appointment.id
                  )
                }
                className="
                  bg-red-500
                  hover:bg-red-600
                  text-white
                  px-5
                  py-3
                  rounded-2xl
                  font-semibold
                  transition-all
                  flex
                  items-center
                  gap-2
                "
              >

                <Ban size={18} />

                Cancel

              </button>

            )}

            {/* ================================================= */}
            {/* STATUS PANELS */}
            {/* ================================================= */}

            {appointment.status ===
              "CONFIRMED" && (

              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-green-700
                  font-semibold
                  bg-green-50
                  px-4
                  py-3
                  rounded-2xl
                "
              >

                <CheckCircle2
                  size={18}
                />

                Appointment Confirmed

              </div>

            )}

            {appointment.status ===
              "COMPLETED" && (

              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-blue-700
                  font-semibold
                  bg-blue-50
                  px-4
                  py-3
                  rounded-2xl
                "
              >

                <Wallet
                  size={18}
                />

                Consultation Completed

              </div>

            )}

            {appointment.status ===
              "CANCELLED" && (

              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-red-700
                  font-semibold
                  bg-red-50
                  px-4
                  py-3
                  rounded-2xl
                "
              >

                <XCircle
                  size={18}
                />

                Cancelled

              </div>

            )}

            {appointment.status ===
              "RESCHEDULED" && (

              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-yellow-700
                  font-semibold
                  bg-yellow-50
                  px-4
                  py-3
                  rounded-2xl
                "
              >

                <RefreshCcw
                  size={18}
                />

                Rescheduled

              </div>

            )}

            {/* ================================================= */}
            {/* DETAILS */}
            {/* ================================================= */}

            <button
              onClick={() =>
                setExpanded(
                  !expanded
                )
              }
              className="
                border
                border-slate-300
                px-5
                py-3
                rounded-2xl
                hover:bg-slate-100
                transition-all
                font-medium
              "
            >

              {expanded
                ? "Hide Details"
                : "View Details"}

            </button>

          </div>

        </div>

        {/* ================================================= */}
        {/* RESCHEDULE PANEL */}
        {/* ================================================= */}

        {showReschedule && (

          <div
            className="
              mt-6
              border
              border-yellow-200
              bg-yellow-50
              rounded-3xl
              p-6
            "
          >

            <h3
              className="
                text-lg
                font-bold
                text-slate-800
                mb-5
              "
            >

              Reschedule Appointment

            </h3>

            <div
              className="
                grid
                md:grid-cols-2
                gap-4
              "
            >

              <div>

                <label
                  className="
                    block
                    text-sm
                    font-medium
                    mb-2
                    text-slate-700
                  "
                >

                  New Date

                </label>

                <input
                  type="date"
                  value={newDate}
                  onChange={(e) =>
                    setNewDate(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    border
                    border-slate-300
                    rounded-2xl
                    px-4
                    py-3
                    outline-none
                    focus:ring-2
                    focus:ring-primary
                  "
                />

              </div>

              <div>

                <label
                  className="
                    block
                    text-sm
                    font-medium
                    mb-2
                    text-slate-700
                  "
                >

                  New Time

                </label>

                <input
                  type="time"
                  value={newTime}
                  onChange={(e) =>
                    setNewTime(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    border
                    border-slate-300
                    rounded-2xl
                    px-4
                    py-3
                    outline-none
                    focus:ring-2
                    focus:ring-primary
                  "
                />

              </div>

            </div>

            <div className="flex gap-3 mt-6">

              <button
                onClick={
                  handleReschedule
                }
                className="
                  bg-primary
                  hover:opacity-90
                  text-white
                  px-6
                  py-3
                  rounded-2xl
                  font-semibold
                  transition-all
                "
              >

                Save Changes

              </button>

              <button
                onClick={() =>
                  setShowReschedule(
                    false
                  )
                }
                className="
                  border
                  border-slate-300
                  px-6
                  py-3
                  rounded-2xl
                  font-semibold
                  hover:bg-slate-100
                  transition-all
                "
              >

                Cancel

              </button>

            </div>

          </div>

        )}

        {/* ================================================= */}
        {/* EXPANDED DETAILS */}
        {/* ================================================= */}

        {expanded && (

          <div
            className="
              mt-8
              pt-6
              border-t
              border-slate-200
              space-y-6
            "
          >

            {/* SYMPTOMS */}

            <div>

              <div
                className="
                  flex
                  items-center
                  gap-2
                  mb-2
                "
              >

                <AlertTriangle
                  size={18}
                  className="
                    text-orange-500
                  "
                />

                <h4
                  className="
                    font-semibold
                    text-slate-700
                  "
                >

                  Symptoms

                </h4>

              </div>

              <p className="text-slate-600">

                {appointment.symptoms ||
                  "No symptoms added"}

              </p>

            </div>

            {/* NOTES */}

            <div>

              <div
                className="
                  flex
                  items-center
                  gap-2
                  mb-2
                "
              >

                <FileText
                  size={18}
                  className="
                    text-blue-500
                  "
                />

                <h4
                  className="
                    font-semibold
                    text-slate-700
                  "
                >

                  Notes

                </h4>

              </div>

              <p className="text-slate-600">

                {appointment.notes ||
                  "No notes available"}

              </p>

            </div>

          </div>

        )}

      </div>

    </div>
  );

};

export default AppointmentCard;
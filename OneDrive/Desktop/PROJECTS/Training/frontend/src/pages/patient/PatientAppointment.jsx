import {
  useEffect,
  useMemo,
  useState,
} from "react";

import toast
from "react-hot-toast";

import {
  CalendarDays,
  Clock3,
  CheckCircle2,
  Wallet,
  XCircle,
  RefreshCcw,
  Activity,
  CalendarClock,
  Sparkles,
} from "lucide-react";

import { motion }
from "framer-motion";

import api
from "../../api/axios";

import PageLoader
from "../../components/ui/PageLoader";

import SectionHeader
from "../../components/ui/SectionHeader";

import AppointmentStats
from "../../components/appointments/AppointmentStats";

import AppointmentFilters
from "../../components/appointments/AppointmentFilters";

import AppointmentSection
from "../../components/appointments/AppointmentSection";

import EmptyAppointments
from "../../components/appointments/EmptyAppointments";


// ======================================================
// PATIENT APPOINTMENTS
// ======================================================

const PatientAppointments =
  () => {

    const [appointments,
      setAppointments] =
      useState([]);

    const [loading,
      setLoading] =
      useState(true);

    const [statusFilter,
      setStatusFilter] =
      useState("ALL");


    // ======================================================
    // NORMALIZE
    // ======================================================

    const normalizeAppointment =
      (appointment) => {

        return {

          ...appointment,

          id:
            appointment.id ||
            appointment._id,

          date:
            appointment.date ||
            appointment.appointment_date,

          time:
            appointment.time ||
            appointment.appointment_time,

          doctor_name:
            appointment.doctor_name ||
            appointment.doctorName ||
            `Doctor #${appointment.doctor_id}`,

          doctor_specialization:
            appointment.doctor_specialization ||
            appointment.specialization ||
            "General Specialist",

          priority:
            appointment.priority ||
            "NORMAL",

          status:
            appointment.status ||
            "PENDING",
        };

      };


    // ======================================================
    // GET APPOINTMENT DATETIME
    // ======================================================

    const getAppointmentDateTime =
      (appointment) => {

        return new Date(
          `${appointment.date} ${appointment.time}`
        );

      };


    // ======================================================
    // AUTO COMPLETE
    // ======================================================

    const autoCompleteAppointments =
      async (
        appointmentsList
      ) => {

        const now =
          new Date();

        const expiredAppointments =
          appointmentsList.filter(
            (
              appointment
            ) => {

              const appointmentTime =
                getAppointmentDateTime(
                  appointment
                );

              return (
                [
                  "PENDING",
                  "CONFIRMED",
                  "RESCHEDULED",
                ].includes(
                  appointment.status
                ) &&
                appointmentTime <
                  now
              );

            }
          );

        if (
          !expiredAppointments.length
        ) return;

        try {

          await Promise.all(

            expiredAppointments.map(
              (
                appointment
              ) =>

                api.put(
                  `/appointment/update/${appointment.id}`,
                  {
                    status:
                      "COMPLETED",
                  }
                )
            )
          );

          setAppointments(
            (
              prev
            ) =>

              prev.map(
                (
                  appointment
                ) => {

                  const found =
                    expiredAppointments.find(
                      (
                        a
                      ) =>
                        a.id ===
                        appointment.id
                    );

                  if (
                    found
                  ) {

                    return {
                      ...appointment,
                      status:
                        "COMPLETED",
                    };

                  }

                  return appointment;

                }
              )
          );

        } catch (err) {

          console.error(
            "Auto complete failed",
            err
          );

        }

      };


    // ======================================================
    // FETCH APPOINTMENTS
    // ======================================================

    const fetchAppointments =
      async () => {

        try {

          setLoading(true);

          const response =
            await api.get(
              "/appointment/my"
            );

          const rawData =
            Array.isArray(
              response.data
            )
              ? response.data
              : response
                  .data
                  ?.data || [];

          const normalized =
            rawData.map(
              normalizeAppointment
            );

          const sorted =
            [
              ...normalized,
            ].sort(
              (
                a,
                b
              ) => {

                const d1 =
                  new Date(
                    `${a.date}T${a.time}`
                  );

                const d2 =
                  new Date(
                    `${b.date}T${b.time}`
                  );

                return d2 - d1;

              }
            );

          setAppointments(
            sorted
          );

          await autoCompleteAppointments(
            sorted
          );

        } catch (err) {

          console.error(
            err
          );

          toast.error(
            "Failed to load appointments"
          );

          setAppointments(
            []
          );

        } finally {

          setLoading(
            false
          );

        }

      };


    // ======================================================
    // INITIAL LOAD
    // ======================================================

    useEffect(() => {

      fetchAppointments();

    }, []);


    // ======================================================
    // REALTIME CHECK
    // ======================================================

    useEffect(() => {

      const interval =
        setInterval(
          () => {

            autoCompleteAppointments(
              appointments
            );

          },
          60000
        );

      return () =>
        clearInterval(
          interval
        );

    }, [
      appointments,
    ]);


    // ======================================================
    // CANCEL
    // ======================================================

    const cancelAppointment =
      async (id) => {

        const confirmAction =
          window.confirm(
            "Cancel this appointment?"
          );

        if (
          !confirmAction
        ) return;

        try {

          await api.put(
            `/appointment/cancel/${id}`
          );

          setAppointments(
            (
              prev
            ) =>

              prev.map(
                (
                  appointment
                ) =>

                  appointment.id ===
                  id

                    ? {
                        ...appointment,
                        status:
                          "CANCELLED",
                      }

                    : appointment
              )
          );

          toast.success(
            "Appointment cancelled"
          );

        } catch (err) {

          console.error(
            err
          );

          toast.error(
            "Failed to cancel appointment"
          );

        }

      };


    // ======================================================
    // FILTERED
    // ======================================================

    const filteredAppointments =
      useMemo(
        () => {

          if (
            statusFilter ===
            "ALL"
          ) {

            return appointments;

          }

          return appointments.filter(
            (
              appointment
            ) =>

              appointment.status ===
              statusFilter
          );

        },
        [
          appointments,
          statusFilter,
        ]
      );


    // ======================================================
    // GROUPS
    // ======================================================

    const upcomingAppointments =
      filteredAppointments.filter(
        (
          appointment
        ) =>

          [
            "PENDING",
            "CONFIRMED",
            "RESCHEDULED",
          ].includes(
            appointment.status
          )
      );

    const completedAppointments =
      filteredAppointments.filter(
        (
          appointment
        ) =>

          appointment.status ===
          "COMPLETED"
      );

    const cancelledAppointments =
      filteredAppointments.filter(
        (
          appointment
        ) =>

          appointment.status ===
          "CANCELLED"
      );


    // ======================================================
    // ANALYTICS
    // ======================================================

    const totalAppointments =
      appointments.length;

    const confirmedAppointments =
      appointments.filter(
        (
          appointment
        ) =>

          appointment.status ===
          "CONFIRMED"
      ).length;

    const pendingAppointments =
      appointments.filter(
        (
          appointment
        ) =>

          appointment.status ===
          "PENDING"
      ).length;

    const completedCount =
      appointments.filter(
        (
          appointment
        ) =>

          appointment.status ===
          "COMPLETED"
      ).length;


    // ======================================================
    // LOADING
    // ======================================================

    if (loading) {

      return (

        <PageLoader
          title="
Loading appointments
          "
          subtitle="
Preparing your healthcare consultations...
          "
        />

      );

    }


    // ======================================================
    // UI
    // ======================================================

    return (

      <div className="space-y-8">

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

          transition={{
            duration: 0.4,
          }}

          className="
            relative
            overflow-hidden

            rounded-[2.5rem]

            bg-gradient-to-br
            from-primary
            via-primary
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

              w-80
              h-80

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

                px-4
                py-2

                rounded-full

                text-sm
                font-medium

                mb-6
              "
            >

              <Sparkles
                size={16}
              />

              Smart Appointment Management

            </div>

            <div
              className="
                flex
                flex-col
                xl:flex-row

                items-start
                xl:items-center

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

                    leading-tight
                  "
                >

                  My Appointments 📅

                </h1>

                <p
                  className="
                    mt-5

                    max-w-2xl

                    text-lg
                    text-white/90

                    leading-relaxed
                  "
                >

                  Track consultations,
                  appointment statuses,
                  healthcare schedules,
                  payments,
                  and realtime updates
                  from your enterprise portal.

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

                  min-w-[260px]
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

                    <Activity
                      size={28}
                    />

                  </div>

                  <div>

                    <p
                      className="
                        text-white/70
                        text-sm
                      "
                    >

                      Appointment Overview

                    </p>

                    <h3
                      className="
                        text-xl
                        font-bold
                      "
                    >

                      {
                        totalAppointments
                      } Total Bookings

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

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-4
            gap-6
          "
        >

          <AppointmentStats
            title="
Total Appointments
            "
            value={
              totalAppointments
            }
            icon={
              CalendarDays
            }
            color="blue"
          />

          <AppointmentStats
            title="
Confirmed
            "
            value={
              confirmedAppointments
            }
            icon={
              CheckCircle2
            }
            color="green"
          />

          <AppointmentStats
            title="
Pending
            "
            value={
              pendingAppointments
            }
            icon={
              Clock3
            }
            color="yellow"
          />

          <AppointmentStats
            title="
Completed
            "
            value={
              completedCount
            }
            icon={
              Wallet
            }
            color="blue"
          />

        </div>


        {/* ================================================= */}
        {/* FILTERS */}
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

          transition={{
            delay: 0.1,
          }}

          className="
            enterprise-card
            p-6
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
              mb-5
            "
          >

            <div>

              <h2
                className="
                  text-2xl
                  font-black
                  text-slate-800
                "
              >

                Appointment Filters

              </h2>

              <p
                className="
                  mt-1
                  text-slate-500
                "
              >

                Filter consultations
                by realtime status

              </p>

            </div>

            <div
              className="
                hidden
                md:flex
                items-center
                gap-2
                text-primary
                font-semibold
              "
            >

              <CalendarClock
                size={18}
              />

              Live Updates Enabled

            </div>

          </div>

          <AppointmentFilters
            statusFilter={
              statusFilter
            }
            setStatusFilter={
              setStatusFilter
            }
          />

        </motion.div>


        {/* ================================================= */}
        {/* EMPTY */}
        {/* ================================================= */}

        {!filteredAppointments.length ? (

          <EmptyAppointments
            message="
No appointments found for this filter.
            "
          />

        ) : (

          <div className="space-y-12">

            {/* ================================================= */}
            {/* UPCOMING */}
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

              transition={{
                delay: 0.2,
              }}

              className="
                enterprise-card
                p-6
              "
            >

              <AppointmentSection
                title="
Upcoming Appointments
                "
                appointments={
                  upcomingAppointments
                }
                role="PATIENT"
                cancelAppointment={
                  cancelAppointment
                }
                refreshAppointments={
                  fetchAppointments
                }
              />

            </motion.div>


            {/* ================================================= */}
            {/* COMPLETED */}
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

              transition={{
                delay: 0.3,
              }}

              className="
                enterprise-card
                p-6
              "
            >

              <AppointmentSection
                title="
Completed Appointments
                "
                appointments={
                  completedAppointments
                }
                role="PATIENT"
              />

            </motion.div>


            {/* ================================================= */}
            {/* CANCELLED */}
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

              transition={{
                delay: 0.4,
              }}

              className="
                enterprise-card
                p-6
              "
            >

              <AppointmentSection
                title="
Cancelled Appointments
                "
                appointments={
                  cancelledAppointments
                }
                role="PATIENT"
              />

            </motion.div>

          </div>

        )}

      </div>

    );

  };

export default PatientAppointments;
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  CalendarDays,
  Clock3,
  CheckCircle2,
  Wallet,
} from "lucide-react";

import api from "../../api/axios";

import Loader from "../../components/Loader";

import SectionHeader from "../../components/ui/SectionHeader";

import AppointmentStats from "../../components/appointments/AppointmentStats";

import AppointmentFilters from "../../components/appointments/AppointmentFilters";

import AppointmentSection from "../../components/appointments/AppointmentSection";

import EmptyAppointments from "../../components/appointments/EmptyAppointments";

const Appointments = () => {

  const [appointments, setAppointments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [statusFilter, setStatusFilter] =
    useState("ALL");


  // =====================================================
  // NORMALIZE APPOINTMENT
  // =====================================================

  const normalizeAppointment = (
    appointment
  ) => {

    return {

      ...appointment,

      // ✅ STANDARDIZED DATE/TIME
      date:
        appointment.date ||
        appointment.appointment_date,

      time:
        appointment.time ||
        appointment.appointment_time,

      // ✅ DOCTOR FALLBACKS
      doctor_name:
        appointment.doctor_name ||
        `Doctor #${appointment.doctor_id}`,

      doctor_specialization:
        appointment.doctor_specialization ||
        "General Specialist",

      // ✅ PRIORITY FALLBACK
      priority:
        appointment.priority ||
        "NORMAL",
    };
  };


  // =====================================================
  // FETCH APPOINTMENTS
  // =====================================================

  const fetchAppointments = async () => {

    try {

      setLoading(true);

      const res =
        await api.get(
          "/appointment/my"
        );

      const rawData =
        Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];

      const normalizedData =
        rawData.map(
          normalizeAppointment
        );

      // ✅ SORT LATEST FIRST
      const sorted =
        [...normalizedData].sort(
          (a, b) => {

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

      setAppointments(sorted);

    } catch (err) {

      console.error(err);

      toast.error(
        "Failed to load appointments"
      );

      setAppointments([]);

    } finally {

      setLoading(false);
    }
  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    fetchAppointments();

  }, []);


  // =====================================================
  // CANCEL APPOINTMENT
  // =====================================================

  const cancelAppointment =
    async (id) => {

      const confirmAction =
        window.confirm(
          "Cancel this appointment?"
        );

      if (!confirmAction) return;

      try {

        await api.put(
          `/appointment/cancel/${id}`
        );

        // ✅ OPTIMISTIC UI UPDATE
        setAppointments((prev) =>
          prev.map((appointment) =>
            appointment.id === id
              ? {
                  ...appointment,
                  status: "CANCELLED",
                }
              : appointment
          )
        );

        toast.success(
          "Appointment cancelled"
        );

      } catch (err) {

        console.error(err);

        toast.error(
          "Failed to cancel appointment"
        );
      }
    };


  // =====================================================
  // FILTERING
  // =====================================================

  const filteredAppointments =
    useMemo(() => {

      if (
        statusFilter === "ALL"
      ) {

        return appointments;
      }

      return appointments.filter(
        (appointment) =>
          appointment.status ===
          statusFilter
      );

    }, [
      appointments,
      statusFilter,
    ]);


  // =====================================================
  // GROUPING
  // =====================================================

  const upcomingAppointments =
    filteredAppointments.filter(
      (appointment) =>
        appointment.status ===
          "PENDING" ||
        appointment.status ===
          "CONFIRMED"
    );

  const completedAppointments =
    filteredAppointments.filter(
      (appointment) =>
        appointment.status ===
        "COMPLETED"
    );

  const cancelledAppointments =
    filteredAppointments.filter(
      (appointment) =>
        appointment.status ===
        "CANCELLED"
    );


  // =====================================================
  // ANALYTICS
  // =====================================================

  const totalAppointments =
    appointments.length;

  const confirmedAppointments =
    appointments.filter(
      (appointment) =>
        appointment.status ===
        "CONFIRMED"
    ).length;

  const pendingAppointments =
    appointments.filter(
      (appointment) =>
        appointment.status ===
        "PENDING"
    ).length;

  const completedCount =
    appointments.filter(
      (appointment) =>
        appointment.status ===
        "COMPLETED"
    ).length;


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <Loader text="Loading appointments..." />
    );
  }


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="max-w-7xl mx-auto pb-10">

      {/* HEADER */}

      <SectionHeader
        title="My Appointments"
        subtitle="
Manage your healthcare consultations,
track statuses and upcoming visits.
        "
      />


      {/* STATS */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-4
          gap-6
          mb-10
        "
      >

        <AppointmentStats
          title="Total Appointments"
          value={totalAppointments}
          icon={CalendarDays}
          color="blue"
        />

        <AppointmentStats
          title="Confirmed"
          value={confirmedAppointments}
          icon={CheckCircle2}
          color="green"
        />

        <AppointmentStats
          title="Pending"
          value={pendingAppointments}
          icon={Clock3}
          color="yellow"
        />

        <AppointmentStats
          title="Completed"
          value={completedCount}
          icon={Wallet}
          color="blue"
        />

      </div>


      {/* FILTERS */}

      <div className="mb-10">

        <AppointmentFilters
          statusFilter={
            statusFilter
          }
          setStatusFilter={
            setStatusFilter
          }
        />

      </div>


      {/* EMPTY STATE */}

      {!filteredAppointments.length ? (

        <EmptyAppointments
          message="
No appointments found for this filter.
          "
        />

      ) : (

        <div className="space-y-12">

          {/* UPCOMING */}

          <AppointmentSection
            title="Upcoming Appointments"
            appointments={
              upcomingAppointments
            }
            cancelAppointment={
              cancelAppointment
            }
            refreshAppointments={
              fetchAppointments
            }
          />


          {/* COMPLETED */}

          <AppointmentSection
            title="Completed Appointments"
            appointments={
              completedAppointments
            }
          />


          {/* CANCELLED */}

          <AppointmentSection
            title="Cancelled Appointments"
            appointments={
              cancelledAppointments
            }
          />

        </div>
      )}

    </div>
  );
};

export default Appointments;
import AppointmentCard from "./AppointmentCard";

const AppointmentSection = ({
  title,
  appointments,
  role = "PATIENT",
  cancelAppointment,
  refreshAppointments,
}) => {

  if (!appointments.length) {
    return null;
  }

  return (

    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold text-slate-800">
            {title}
          </h2>

          <p className="text-slate-500 mt-1">
            {appointments.length} appointments
          </p>

        </div>

      </div>


      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {appointments.map((appointment) => (

          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            role={role}
            cancelAppointment={cancelAppointment}
            refreshAppointments={refreshAppointments}
          />
        ))}

      </div>

    </div>
  );
};

export default AppointmentSection;
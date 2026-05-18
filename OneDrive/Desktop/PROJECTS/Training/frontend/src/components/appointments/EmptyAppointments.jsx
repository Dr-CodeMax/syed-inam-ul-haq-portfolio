const EmptyAppointments = ({
  message = "No appointments found",
}) => {
  return (
    <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center">
      
      <h3 className="text-lg font-semibold text-slate-700">
        {message}
      </h3>

      <p className="text-slate-500 mt-2">
        Try changing filters or check again later.
      </p>
    </div>
  );
};

export default EmptyAppointments;
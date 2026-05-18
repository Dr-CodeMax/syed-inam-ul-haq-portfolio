const filters = [
  "ALL",
  "PENDING",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
];

const AppointmentFilters = ({
  statusFilter,
  setStatusFilter,
}) => {

  return (

    <div className="flex flex-wrap gap-3">

      {filters.map((filter) => (

        <button
          key={filter}
          onClick={() =>
            setStatusFilter(filter)
          }
          className={`
            px-5 py-2.5
            rounded-2xl
            text-sm
            font-semibold
            transition-all
            duration-300

            ${
              statusFilter === filter
                ? "bg-primary text-white shadow-md"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
            }
          `}
        >

          {filter}

        </button>
      ))}

    </div>
  );
};

export default AppointmentFilters;
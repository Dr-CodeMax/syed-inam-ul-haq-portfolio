const colorVariants = {
  blue: {
    bg: "bg-blue-100",
    text: "text-blue-600",
  },

  green: {
    bg: "bg-green-100",
    text: "text-green-600",
  },

  yellow: {
    bg: "bg-yellow-100",
    text: "text-yellow-600",
  },

  red: {
    bg: "bg-red-100",
    text: "text-red-600",
  },
};

const AppointmentStats = ({
  title,
  value,
  icon: Icon,
  color = "blue",
}) => {

  const styles =
    colorVariants[color] ||
    colorVariants.blue;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all duration-300">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-500 font-medium">
            {title}
          </p>

          <h2 className="text-3xl font-bold text-slate-800 mt-3">
            {value}
          </h2>

        </div>

        <div
          className={`p-4 rounded-2xl ${styles.bg} ${styles.text}`}
        >

          <Icon size={26} />

        </div>

      </div>

    </div>
  );
};

export default AppointmentStats;
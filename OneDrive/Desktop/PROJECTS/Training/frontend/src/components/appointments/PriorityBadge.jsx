const priorityConfig = {

  LOW: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    label: "Low",
  },

  NORMAL: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    label: "Normal",
  },

  HIGH: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    label: "High",
  },

  EMERGENCY: {
    bg: "bg-red-100",
    text: "text-red-700",
    label: "Emergency",
  },
};

const PriorityBadge = ({
  priority = "NORMAL",
}) => {

  const config =
    priorityConfig[priority] ||
    priorityConfig.NORMAL;

  return (

    <span
      className={`
        px-3
        py-1
        rounded-full
        text-xs
        font-semibold
        ${config.bg}
        ${config.text}
      `}
    >
      {config.label}
    </span>
  );
};

export default PriorityBadge;
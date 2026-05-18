// =========================================================
// ✅ StatusBadge.jsx
// =========================================================

const StatusBadge = ({ status }) => {

  const normalizedStatus =
    status?.toUpperCase() || "PENDING";

  const statusStyles = {

    APPROVED:
      "bg-green-100 text-green-700 border border-green-200",

    PENDING:
      "bg-yellow-100 text-yellow-700 border border-yellow-200",

    REJECTED:
      "bg-red-100 text-red-700 border border-red-200",

    SUSPENDED:
      "bg-gray-200 text-gray-700 border border-gray-300",
  };

  return (

    <span
      className={`
        px-3
        py-1
        rounded-full
        text-xs
        font-semibold
        whitespace-nowrap
        ${statusStyles[normalizedStatus]}
      `}
    >
      {normalizedStatus}
    </span>
  );
};

export default StatusBadge;
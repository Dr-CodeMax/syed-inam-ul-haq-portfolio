// ======================================================
// ✅ STATUS BADGE
// ======================================================

const statusStyles = {

  active: `
    bg-emerald-100
    text-emerald-700
  `,

  inactive: `
    bg-slate-100
    text-slate-600
  `,

  suspended: `
    bg-red-100
    text-red-700
  `,

};


// ======================================================
// ✅ COMPONENT
// ======================================================

const StatusBadge = ({
  status,
}) => {

  return (

    <span
      className={`
        inline-flex
        items-center
        justify-center
        rounded-full
        px-3
        py-1
        text-xs
        font-semibold
        capitalize
        whitespace-nowrap
        ${statusStyles[status]}
      `}
    >

      {status}

    </span>

  );

};

export default StatusBadge;
// =====================================================
// ✅ ENTERPRISE REALTIME BADGE
// =====================================================

import { motion }
from "framer-motion";


// =====================================================
// ✅ REALTIME BADGE
// =====================================================

const RealtimeBadge = ({
  label = "Live",
}) => {

  return (

    <div
      className="
        inline-flex
        items-center
        gap-2

        rounded-2xl

        border
        border-emerald-200

        bg-emerald-50

        px-4
        py-2
      "
    >

      <motion.div

        animate={{
          opacity: [1, 0.4, 1],
        }}

        transition={{
          repeat: Infinity,
          duration: 2,
        }}

        className="
          h-2.5
          w-2.5

          rounded-full

          bg-emerald-500
        "
      />

      <span
        className="
          text-sm
          font-semibold
          text-emerald-700
        "
      >

        {label}

      </span>

    </div>
  );
};

export default RealtimeBadge;
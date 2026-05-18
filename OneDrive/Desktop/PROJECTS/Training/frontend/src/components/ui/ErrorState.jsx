// =====================================================
// ✅ ENTERPRISE ERROR STATE
// =====================================================

import {
  AlertTriangle,
} from "lucide-react";

import { motion }
from "framer-motion";


// =====================================================
// ✅ ERROR STATE
// =====================================================

const ErrorState = ({
  title = "Something went wrong",
  description =
    "An unexpected error occurred.",
  action,
}) => {

  return (

    <motion.div

      initial={{
        opacity: 0,
        y: 10,
      }}

      animate={{
        opacity: 1,
        y: 0,
      }}

      className="
        enterprise-card

        flex
        flex-col
        items-center
        justify-center

        text-center

        p-10
      "
    >

      {/* ICON */}

      <div
        className="
          h-20
          w-20

          rounded-3xl

          bg-red-100

          flex
          items-center
          justify-center

          mb-6
        "
      >

        <AlertTriangle
          size={38}
          className="
            text-red-600
          "
        />

      </div>

      {/* TITLE */}

      <h2
        className="
          text-2xl
          font-bold
          text-slate-800
        "
      >

        {title}

      </h2>

      {/* DESCRIPTION */}

      <p
        className="
          mt-3

          max-w-md

          text-slate-500
          leading-relaxed
        "
      >

        {description}

      </p>

      {/* ACTION */}

      {
        action && (

          <div className="mt-6">

            {action}

          </div>

        )
      }

    </motion.div>
  );
};

export default ErrorState;
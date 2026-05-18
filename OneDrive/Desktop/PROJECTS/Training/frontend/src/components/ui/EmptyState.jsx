// =====================================================
// ✅ ENTERPRISE EMPTY STATE
// =====================================================

import { motion }
from "framer-motion";


// =====================================================
// ✅ EMPTY STATE
// =====================================================

const EmptyState = ({
  icon: Icon,
  title = "No Data Found",
  description =
    "There is currently no data available.",
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

      {
        Icon && (

          <div
            className="
              h-20
              w-20

              rounded-3xl

              bg-primary/10

              flex
              items-center
              justify-center

              mb-6
            "
          >

            <Icon
              size={38}
              className="
                text-primary
              "
            />

          </div>

        )
      }

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

export default EmptyState;
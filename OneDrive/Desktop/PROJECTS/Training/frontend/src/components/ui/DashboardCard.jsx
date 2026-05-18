// =====================================================
// ✅ ENTERPRISE DASHBOARD CARD
// =====================================================

import { motion }
from "framer-motion";


// =====================================================
// ✅ DASHBOARD CARD
// =====================================================

const DashboardCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg = "bg-blue-100",
  iconColor = "text-blue-600",
}) => {

  return (

    <motion.div

      whileHover={{
        y: -4,
      }}

      transition={{
        duration: 0.2,
      }}

      className="
        enterprise-card
        card-hover

        p-6
      "
    >

      <div
        className="
          flex
          items-start
          justify-between
          gap-4
        "
      >

        {/* =========================================== */}
        {/* LEFT */}
        {/* =========================================== */}

        <div>

          <p
            className="
              text-sm
              font-medium
              text-slate-500
            "
          >

            {title}

          </p>

          <h2
            className="
              mt-3

              text-4xl
              font-bold
              tracking-tight

              text-slate-800
            "
          >

            {
              typeof value === "number"
                ? value.toLocaleString(
                    "en-IN"
                  )
                : value
            }

          </h2>

          {
            subtitle && (

              <p
                className="
                  mt-2

                  text-sm
                  text-slate-500
                "
              >

                {subtitle}

              </p>

            )
          }

        </div>

        {/* =========================================== */}
        {/* ICON */}
        {/* =========================================== */}

        {
          Icon && (

            <div
              className={`
                h-14
                w-14

                rounded-2xl

                flex
                items-center
                justify-center

                ${iconBg}
              `}
            >

              <Icon
                size={28}
                className={iconColor}
              />

            </div>

          )
        }

      </div>

    </motion.div>
  );
};

export default DashboardCard;
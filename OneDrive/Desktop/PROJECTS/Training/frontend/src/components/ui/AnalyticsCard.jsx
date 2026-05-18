// =====================================================
// ✅ ENTERPRISE ANALYTICS CARD
// =====================================================

import {
  TrendingUp,
} from "lucide-react";

import { motion }
from "framer-motion";


// =====================================================
// ✅ ANALYTICS CARD
// =====================================================

const AnalyticsCard = ({
  title,
  value,
  change,
  chart,
}) => {

  return (

    <motion.div

      whileHover={{
        y: -4,
      }}

      className="
        enterprise-card

        p-6
      "
    >

      {/* HEADER */}

      <div
        className="
          flex
          items-start
          justify-between
        "
      >

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

            {value}

          </h2>

        </div>

        <div
          className="
            h-12
            w-12

            rounded-2xl

            bg-emerald-100

            flex
            items-center
            justify-center
          "
        >

          <TrendingUp
            size={22}
            className="
              text-emerald-600
            "
          />

        </div>

      </div>

      {/* CHANGE */}

      <div
        className="
          mt-5

          flex
          items-center
          gap-2
        "
      >

        <span
          className="
            rounded-full

            bg-emerald-100

            px-2.5
            py-1

            text-xs
            font-semibold

            text-emerald-700
          "
        >

          {change}

        </span>

        <span
          className="
            text-sm
            text-slate-500
          "
        >

          vs last month

        </span>

      </div>

      {/* CHART */}

      {
        chart && (

          <div className="mt-6">

            {chart}

          </div>

        )
      }

    </motion.div>
  );
};

export default AnalyticsCard;
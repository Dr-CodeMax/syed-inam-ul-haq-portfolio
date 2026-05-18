import {
  TrendingUp,
} from "lucide-react";


// =====================================================
// FORMAT NUMBERS
// =====================================================

const formatValue = (
  value
) => {

  if (
    typeof value === "number"
  ) {

    return value.toLocaleString(
      "en-IN"
    );
  }

  return value;
};


// =====================================================
// STAT CARD
// =====================================================

const StatCard = ({
  title,
  value,
  icon: Icon,
  color = "primary",
  subtitle = "",
  trend = "",
  loading = false,
}) => {

  const glowVariants = {

    primary:
      "bg-cyan-400",

    green:
      "bg-green-400",

    yellow:
      "bg-yellow-400",

    red:
      "bg-red-400",

    blue:
      "bg-blue-400",

    purple:
      "bg-purple-400",
  };


  const iconVariants = {

    primary:
      "bg-cyan-500 text-white",

    green:
      "bg-green-500 text-white",

    yellow:
      "bg-yellow-500 text-white",

    red:
      "bg-red-500 text-white",

    blue:
      "bg-blue-500 text-white",

    purple:
      "bg-purple-500 text-white",
  };


  if (loading) {

    return (

      <div
        className="
          animate-pulse

          rounded-3xl

          border
          border-white/40

          bg-white/70
          backdrop-blur-xl

          p-5

          shadow-md
        "
      >

        <div
          className="
            flex
            items-start
            justify-between
          "
        >

          <div className="flex-1">

            <div
              className="
                h-3
                w-24
                rounded-full
                bg-slate-200
              "
            />

            <div
              className="
                mt-4
                h-8
                w-28
                rounded-xl
                bg-slate-200
              "
            />

          </div>

          <div
            className="
              h-14
              w-14
              rounded-2xl
              bg-slate-200
            "
          />

        </div>

      </div>
    );
  }

  return (

    <div
      className="
        group
        relative
        overflow-hidden

        rounded-3xl

        border
        border-white/40

        bg-white/75
        backdrop-blur-xl

        p-5

        shadow-md

        transition-all
        duration-300

        hover:-translate-y-1
        hover:shadow-xl
      "
    >

      {/* GLOW */}

      <div
        className={`
          absolute
          right-0
          top-0

          h-32
          w-32

          rounded-full

          opacity-10
          blur-3xl

          ${glowVariants[color]}
        `}
      />

      {/* CONTENT */}

      <div
        className="
          relative
          z-10

          flex
          items-start
          justify-between
          gap-4
        "
      >

        {/* LEFT */}

        <div className="min-w-0 flex-1">

          <p
            className="
              text-xs
              font-semibold

              uppercase
              tracking-wider

              text-slate-500
            "
          >

            {title}

          </p>

          <h2
            className="
              mt-3

              text-3xl
              md:text-4xl

              font-black

              leading-none

              text-slate-900

              break-words
            "
          >

            {formatValue(value)}

          </h2>

          {subtitle && (

            <p
              className="
                mt-2

                text-sm
                text-slate-500
              "
            >

              {subtitle}

            </p>

          )}

          {trend && (

            <div
              className="
                mt-3

                inline-flex
                items-center
                gap-1.5

                rounded-full

                bg-green-50

                px-2.5
                py-1

                text-xs
                font-semibold

                text-green-700
              "
            >

              <TrendingUp
                size={13}
              />

              {trend}

            </div>

          )}

        </div>

        {/* ICON */}

        <div
          className={`
            flex
            h-14
            w-14
            shrink-0

            items-center
            justify-center

            rounded-2xl

            shadow-lg

            ${iconVariants[color]}
          `}
        >

          {Icon && (

            <Icon size={26} />

          )}

        </div>

      </div>

    </div>
  );
};

export default StatCard;
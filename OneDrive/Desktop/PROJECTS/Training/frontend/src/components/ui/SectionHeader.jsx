// =====================================================
// ✅ ENTERPRISE SECTION HEADER
// =====================================================

const SectionHeader = ({
  title,
  subtitle,
  action,
}) => {

  return (

    <div
      className="
        mb-6

        flex
        flex-col
        md:flex-row

        md:items-center
        md:justify-between

        gap-4
      "
    >

      {/* =========================================== */}
      {/* LEFT */}
      {/* =========================================== */}

      <div>

        <h2
          className="
            text-3xl
            font-bold
            tracking-tight

            text-slate-800
          "
        >

          {title}

        </h2>

        {
          subtitle && (

            <p
              className="
                mt-2

                text-slate-500
                leading-relaxed
              "
            >

              {subtitle}

            </p>

          )
        }

      </div>

      {/* =========================================== */}
      {/* ACTION */}
      {/* =========================================== */}

      {
        action && (

          <div>

            {action}

          </div>

        )
      }

    </div>
  );
};

export default SectionHeader;
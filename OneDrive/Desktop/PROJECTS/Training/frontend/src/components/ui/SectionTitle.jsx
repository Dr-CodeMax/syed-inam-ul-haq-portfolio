// =====================================================
// ✅ ENTERPRISE SECTION TITLE
// =====================================================

const SectionTitle = ({
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
            text-2xl
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

export default SectionTitle;
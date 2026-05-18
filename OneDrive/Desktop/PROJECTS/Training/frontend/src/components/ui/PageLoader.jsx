// =====================================================
// ✅ ENTERPRISE PAGE LOADER
// =====================================================

const PageLoader = ({
  title = "Loading",
  subtitle = "Please wait...",
}) => {

  return (

    <div
      className="
        min-h-[60vh]

        flex
        items-center
        justify-center
      "
    >

      <div
        className="
          enterprise-card

          px-10
          py-8
        "
      >

        <div
          className="
            flex
            items-center
            gap-5
          "
        >

          {/* SPINNER */}

          <div
            className="
              h-12
              w-12

              rounded-full

              border-[5px]
              border-primary/20
              border-t-primary

              animate-spin
            "
          />

          {/* CONTENT */}

          <div>

            <h2
              className="
                text-lg
                font-bold
                text-slate-800
              "
            >

              {title}

            </h2>

            <p
              className="
                mt-1

                text-sm
                text-slate-500
              "
            >

              {subtitle}

            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default PageLoader;
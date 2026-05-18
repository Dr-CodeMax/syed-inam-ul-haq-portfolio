const DashboardSection = ({
  title,
  children,
  action,
}) => {

  return (

    <section
      className="space-y-5"
    >

      {/* HEADER */}

      <div
        className="
          flex
          items-center
          justify-between
          gap-4
        "
      >

        <h2
          className="
            text-xl
            font-bold
            text-slate-900
          "
        >
          {title}
        </h2>

        {action}

      </div>


      {/* CONTENT */}

      <div>

        {children}

      </div>

    </section>

  );

};

export default DashboardSection;
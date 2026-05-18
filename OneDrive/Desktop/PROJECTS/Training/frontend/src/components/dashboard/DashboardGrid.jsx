const DashboardGrid = ({
  children,
}) => {

  return (

    <div
      className="
        grid
        grid-cols-1
        md:grid-cols-2
        2xl:grid-cols-4
        gap-6
      "
    >

      {children}

    </div>

  );

};

export default DashboardGrid;
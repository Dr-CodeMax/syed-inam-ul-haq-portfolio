// =====================================================
// FILE: src/components/tables/TableHeader.jsx
// =====================================================

const TableHeader = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <div
      className="
        flex
        flex-col
        gap-4
        border-b
        border-gray-200
        p-5
        md:flex-row
        md:items-center
        md:justify-between
      "
    >
      <div>
        <h2
          className="
            text-lg
            font-bold
            text-gray-800
          "
        >
          {title}
        </h2>

        {subtitle && (
          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            {subtitle}
          </p>
        )}
      </div>

      <div
        className="
          flex
          flex-wrap
          items-center
          gap-3
        "
      >
        {children}
      </div>
    </div>
  );
};

export default TableHeader;
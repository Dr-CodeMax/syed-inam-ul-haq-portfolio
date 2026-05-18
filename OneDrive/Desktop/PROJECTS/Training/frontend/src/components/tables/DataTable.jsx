// =====================================================
// FILE: src/components/tables/DataTable.jsx
// =====================================================

import StatusBadge from "./StatusBadge";

const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = "No data found.",
}) => {
  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {
    return (
      <div
        className="
          rounded-2xl
          border
          border-gray-200
          bg-white
          p-10
          text-center
        "
      >
        <div
          className="
            mx-auto
            mb-4
            h-10
            w-10
            animate-spin
            rounded-full
            border-4
            border-blue-500
            border-t-transparent
          "
        />

        <p className="text-sm text-gray-500">
          Loading table data...
        </p>
      </div>
    );
  }

  // =====================================================
  // EMPTY STATE
  // =====================================================

  if (!loading && data.length === 0) {
    return (
      <div
        className="
          rounded-2xl
          border
          border-dashed
          border-gray-300
          bg-white
          p-10
          text-center
        "
      >
        <p className="text-gray-500">
          {emptyMessage}
        </p>
      </div>
    );
  }

  // =====================================================
  // TABLE
  // =====================================================

  return (
    <div
      className="
        overflow-hidden
        rounded-2xl
        border
        border-gray-200
        bg-white
        shadow-sm
      "
    >
      <div className="overflow-x-auto">
        <table className="min-w-full">
          {/* ========================================= */}
          {/* TABLE HEADER */}
          {/* ========================================= */}

          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="
                    whitespace-nowrap
                    px-6
                    py-4
                    text-left
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-gray-500
                  "
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>

          {/* ========================================= */}
          {/* TABLE BODY */}
          {/* ========================================= */}

          <tbody className="divide-y divide-gray-100">
            {data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                className="
                  transition-all
                  duration-150
                  hover:bg-gray-50
                "
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="
                      whitespace-nowrap
                      px-6
                      py-4
                      text-sm
                      text-gray-700
                    "
                  >
                    {column.render ? (
                      column.render(row)
                    ) : column.key === "status" ? (
                      <StatusBadge
                        status={row[column.key]}
                      />
                    ) : (
                      row[column.key]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
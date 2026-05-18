import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";


// ======================================================
// ✅ TABLE PAGINATION
// ======================================================

const TablePagination = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {

  return (

    <div
      className="
        flex
        flex-col
        md:flex-row
        items-center
        justify-between
        gap-4
        px-6
        py-4
        border-t
        border-slate-200
      "
    >

      <p
        className="
          text-sm
          text-slate-500
        "
      >
        Page {currentPage}
        {" "}of{" "}
        {totalPages || 1}
      </p>


      <div
        className="
          flex
          items-center
          gap-2
        "
      >

        <button
          disabled={
            currentPage === 1
          }
          onClick={() =>
            onPageChange(
              currentPage - 1
            )
          }
          className="
            flex
            items-center
            gap-2
            px-4
            py-2
            rounded-lg
            border
            border-slate-200
            text-sm
            disabled:opacity-50
          "
        >

          <ChevronLeft
            size={16}
          />

          Prev

        </button>


        <button
          disabled={
            currentPage ===
            totalPages
            ||
            totalPages === 0
          }
          onClick={() =>
            onPageChange(
              currentPage + 1
            )
          }
          className="
            flex
            items-center
            gap-2
            px-4
            py-2
            rounded-lg
            border
            border-slate-200
            text-sm
            disabled:opacity-50
          "
        >

          Next

          <ChevronRight
            size={16}
          />

        </button>

      </div>

    </div>

  );

};

export default TablePagination;
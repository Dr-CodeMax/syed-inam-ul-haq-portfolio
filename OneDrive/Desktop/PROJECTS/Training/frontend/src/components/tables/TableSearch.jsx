// =====================================================
// FILE: src/components/tables/TableSearch.jsx
// =====================================================

import { Search } from "lucide-react";

const TableSearch = ({
  value,
  onChange,
  placeholder = "Search...",
}) => {
  return (
    <div className="relative w-full md:w-80">
      <Search
        size={18}
        className="
          absolute
          left-3
          top-1/2
          -translate-y-1/2
          text-gray-400
        "
      />

      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          w-full
          rounded-xl
          border
          border-gray-200
          bg-white
          py-2.5
          pl-10
          pr-4
          text-sm
          outline-none
          transition-all
          duration-200
          focus:border-blue-500
          focus:ring-4
          focus:ring-blue-100
        "
      />
    </div>
  );
};

export default TableSearch;
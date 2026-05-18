const Filters = ({ filters, setFilters }) => {
  return (
    <div className="flex gap-4 flex-wrap">

      <select
        onChange={(e) =>
          setFilters({ ...filters, specialization: e.target.value })
        }
        className="p-2 border rounded"
      >
        <option value="">All Specializations</option>
        <option value="cardiologist">Cardiologist</option>
        <option value="dermatologist">Dermatologist</option>
      </select>

      <select
        onChange={(e) =>
          setFilters({ ...filters, experience: e.target.value })
        }
        className="p-2 border rounded"
      >
        <option value="">Experience</option>
        <option value="5">5+ years</option>
        <option value="10">10+ years</option>
      </select>

      <select
        onChange={(e) =>
          setFilters({ ...filters, fee: e.target.value })
        }
        className="p-2 border rounded"
      >
        <option value="">Fee</option>
        <option value="500">Below ₹500</option>
        <option value="1000">Below ₹1000</option>
      </select>

    </div>
  );
};

export default Filters;
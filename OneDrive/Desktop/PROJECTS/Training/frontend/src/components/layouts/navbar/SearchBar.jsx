const SearchBar = ({ value, onChange }) => {
  return (
    <input
      type="text"
      placeholder="Search doctors, specialization..."
      className="w-full p-3 border rounded-lg"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default SearchBar;
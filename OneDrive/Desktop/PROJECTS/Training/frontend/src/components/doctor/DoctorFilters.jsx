import {
  Search,
  MapPin,
  BriefcaseMedical,
  IndianRupee,
  SlidersHorizontal,
  Stethoscope,
  RotateCcw,
} from "lucide-react";


const DoctorFilters = ({
  filters,
  setFilters,
}) => {

  const specializations = [
    "Cardiologist",
    "Dermatologist",
    "Neurologist",
    "Orthopedic",
    "Pediatrician",
    "Psychiatrist",
    "ENT",
    "Gynecologist",
  ];


  // ===================================================
  // ✅ RESET
  // ===================================================

  const resetFilters = () => {

    setFilters({
      search: "",
      city: "",
      specialization: "",
      experience: "",
      fee: "",
    });
  };


  return (

    <div
      className="
        bg-white/90
        backdrop-blur-xl

        border
        border-white/40

        rounded-[2.2rem]

        shadow-xl
      "
    >

      {/* ============================================= */}
      {/* ✅ HEADER */}
      {/* ============================================= */}

      <div
        className="
          p-6

          border-b
          border-slate-100

          bg-gradient-to-r
          from-cyan-50
          to-teal-50
        "
      >

        <div
          className="
            flex
            items-center
            justify-between
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                w-12
                h-12

                rounded-2xl

                bg-cyan-500

                flex
                items-center
                justify-center

                text-white
              "
            >

              <SlidersHorizontal
                size={22}
              />

            </div>


            <div>

              <h2
                className="
                  text-xl
                  font-black
                  text-slate-900
                "
              >
                Smart Filters
              </h2>

              <p
                className="
                  text-sm
                  text-slate-500
                  mt-1
                "
              >
                Discover ideal specialists
              </p>

            </div>

          </div>


          <button
            onClick={resetFilters}
            className="
              flex
              items-center
              gap-2

              text-sm
              font-semibold

              text-slate-500
              hover:text-red-500

              transition-all
            "
          >

            <RotateCcw size={16} />

            Reset

          </button>

        </div>

      </div>


      {/* ============================================= */}
      {/* ✅ CONTENT */}
      {/* ============================================= */}

      

      <div className="p-6 space-y-6">

        {/* SEARCH */}

        <div className="space-y-2">

          <label
            className="
              text-sm
              font-bold
              text-slate-700
            "
          >
            Search
          </label>

          <div className="relative">

            <Search
              size={18}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              type="text"
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  search:
                    e.target.value,
                }))
              }
              placeholder="Doctor or specialization"
              className="
                w-full

                bg-slate-50

                border
                border-slate-200

                focus:border-cyan-500
                focus:ring-4
                focus:ring-cyan-500/10

                rounded-2xl

                pl-11
                pr-4
                py-4

                transition-all
                duration-300
              "
            />

          </div>

        </div>


        {/* SPECIALIZATION */}

        <div className="space-y-2">

          <label
            className="
              text-sm
              font-bold
              text-slate-700
            "
          >
            Specialization
          </label>

          <div className="relative">

            <Stethoscope
              size={18}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <select
              value={
                filters.specialization
              }
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  specialization:
                    e.target.value,
                }))
              }
              className="
                w-full

                appearance-none

                bg-slate-50

                border
                border-slate-200

                focus:border-cyan-500
                focus:ring-4
                focus:ring-cyan-500/10

                rounded-2xl

                pl-11
                pr-4
                py-4

                transition-all
                duration-300
              "
            >

              <option value="">
                All Specializations
              </option>

              {specializations.map(
                (item) => (

                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}

            </select>

          </div>

        </div>


        {/* CITY */}

        <div className="space-y-2">

          <label
            className="
              text-sm
              font-bold
              text-slate-700
            "
          >
            City
          </label>

          <div className="relative">

            <MapPin
              size={18}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              type="text"
              value={filters.city}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  city:
                    e.target.value,
                }))
              }
              placeholder="Enter city"
              className="
                w-full

                bg-slate-50

                border
                border-slate-200

                focus:border-cyan-500
                focus:ring-4
                focus:ring-cyan-500/10

                rounded-2xl

                pl-11
                pr-4
                py-4

                transition-all
                duration-300
              "
            />

          </div>

        </div>


        {/* EXPERIENCE */}

        <div className="space-y-2">

          <label
            className="
              text-sm
              font-bold
              text-slate-700
            "
          >
            Experience
          </label>

          <div className="relative">

            <BriefcaseMedical
              size={18}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <select
              value={
                filters.experience
              }
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  experience:
                    e.target.value,
                }))
              }
              className="
                w-full

                appearance-none

                bg-slate-50

                border
                border-slate-200

                focus:border-cyan-500
                focus:ring-4
                focus:ring-cyan-500/10

                rounded-2xl

                pl-11
                pr-4
                py-4

                transition-all
                duration-300
              "
            >

              <option value="">
                All Experience
              </option>

              <option value="5">
                5+ Years
              </option>

              <option value="10">
                10+ Years
              </option>

              <option value="15">
                15+ Years
              </option>

            </select>

          </div>

        </div>


        {/* FEE */}

        <div className="space-y-2">

          <label
            className="
              text-sm
              font-bold
              text-slate-700
            "
          >
            Consultation Fee
          </label>

          <div className="relative">

            <IndianRupee
              size={18}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <select
              value={filters.fee}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  fee:
                    e.target.value,
                }))
              }
              className="
                w-full

                appearance-none

                bg-slate-50

                border
                border-slate-200

                focus:border-cyan-500
                focus:ring-4
                focus:ring-cyan-500/10

                rounded-2xl

                pl-11
                pr-4
                py-4

                transition-all
                duration-300
              "
            >

              <option value="">
                All Fees
              </option>

              <option value="500">
                Below ₹500
              </option>

              <option value="1000">
                Below ₹1000
              </option>

              <option value="1500">
                Below ₹1500
              </option>

            </select>

          </div>

        </div>

      </div>

    </div>
  );
};

export default DoctorFilters;
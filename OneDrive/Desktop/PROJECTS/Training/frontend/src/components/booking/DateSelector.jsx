import Calendar from "react-calendar";

import "react-calendar/dist/Calendar.css";

import {
  CalendarDays,
  CheckCircle2,
  Activity,
  ShieldCheck,
  Clock3,
} from "lucide-react";


const DateSelector = ({
  selectedDate,
  onSelect,
}) => {

  return (

    <div
      className="
        bg-white
        rounded-[2rem]
        border border-borderColor
        shadow-soft
        overflow-hidden
      "
    >

      {/* ================================================= */}
      {/* ✅ HEADER */}
      {/* ================================================= */}

      <div
        className="
          px-6
          py-5
          border-b border-borderColor
          flex
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
          gap-4
        "
      >

        {/* LEFT */}

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <div
            className="
              w-12 h-12
              rounded-2xl
              bg-primary/10
              text-primary
              flex
              items-center
              justify-center
            "
          >

            <CalendarDays
              size={22}
            />

          </div>


          <div>

            <h2
              className="
                text-xl
                font-bold
                text-textPrimary
              "
            >

              Select Appointment Date

            </h2>

            <p
              className="
                text-sm
                text-textSecondary
                mt-1
              "
            >

              Smart enterprise healthcare scheduling

            </p>

          </div>

        </div>


        {/* RIGHT */}

        <div
          className="
            flex
            flex-wrap
            gap-3
          "
        >

          <div
            className="
              bg-blue-100
              text-blue-700
              px-4 py-2
              rounded-2xl
              text-sm
              font-semibold
              flex
              items-center
              gap-2
            "
          >

            <Activity size={16} />

            Real-Time

          </div>


          {
            selectedDate && (

              <div
                className="
                  bg-green-100
                  text-green-700
                  px-4 py-2
                  rounded-2xl
                  text-sm
                  font-semibold
                  flex
                  items-center
                  gap-2
                "
              >

                <CheckCircle2
                  size={16}
                />

                Date Selected

              </div>
            )
          }

        </div>

      </div>


      {/* ================================================= */}
      {/* ✅ CALENDAR */}
      {/* ================================================= */}

      <div className="p-6">

        <div
          className="
            rounded-[2rem]
            overflow-hidden
            border border-borderColor
            bg-muted/30
            p-4
          "
        >

          <Calendar

            onChange={onSelect}

            value={selectedDate}

            minDate={new Date()}

            className="
              modern-calendar
              w-full
              border-none
              bg-transparent
            "

            tileClassName={({
              date,
              view
            }) => {

              if (
                view === "month"
              ) {

                const today =
                  new Date();

                const isToday =
                  date.toDateString() ===
                  today.toDateString();

                if (isToday) {

                  return "calendar-today";
                }
              }

              return "";
            }}
          />

        </div>


        {/* ================================================= */}
        {/* ✅ FOOTER INFO */}
        {/* ================================================= */}

        <div
          className="
            mt-5
            flex
            flex-wrap
            gap-3
          "
        >

          <div
            className="
              bg-primary/10
              text-primary
              px-4 py-2
              rounded-2xl
              text-sm
              font-medium
              flex
              items-center
              gap-2
            "
          >

            <ShieldCheck
              size={16}
            />

            Secure Booking

          </div>


          <div
            className="
              bg-green-100
              text-green-700
              px-4 py-2
              rounded-2xl
              text-sm
              font-medium
              flex
              items-center
              gap-2
            "
          >

            <Activity
              size={16}
            />

            Real-time Availability

          </div>


          <div
            className="
              bg-blue-100
              text-blue-700
              px-4 py-2
              rounded-2xl
              text-sm
              font-medium
              flex
              items-center
              gap-2
            "
          >

            <Clock3
              size={16}
            />

            Instant Confirmation

          </div>

        </div>

      </div>

    </div>
  );
};

export default DateSelector;
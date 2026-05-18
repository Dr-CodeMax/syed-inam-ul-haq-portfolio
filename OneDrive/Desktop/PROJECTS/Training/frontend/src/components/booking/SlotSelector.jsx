import {
  useEffect,
  useState,
  useCallback,
} from "react";

import {
  Clock3,
  CalendarClock,
  CheckCircle2,
  Activity,
  Users,
  AlertTriangle,
  TimerReset,
} from "lucide-react";

import {
  getAvailableSlots,
} from "../../api/appointment";

import Loader from "../Loader";


const SlotSelector = ({
  doctor,
  date,
  selectedSlot,
  onSelect,
}) => {

  const [slots, setSlots] =
    useState([]);

  const [loading, setLoading] =
    useState(false);


  // =====================================================
  // ✅ NORMALIZE TIME
  // =====================================================

  const normalizeTime = (
    value
  ) => {

    if (!value) {

      return "";
    }

    if (
      typeof value === "object"
    ) {

      value =
        value.time ||
        value.start_time ||
        value.slot_time ||
        "";
    }

    return String(value)
      .trim()
      .slice(0, 5);
  };


  // =====================================================
  // ✅ ADD MINUTES
  // =====================================================

  const addMinutes = (
    time,
    minutesToAdd = 15
  ) => {

    const normalized =
      normalizeTime(time);

    if (!normalized) {

      return "";
    }

    const [hours, minutes] =
      normalized
        .split(":")
        .map(Number);

    const dateObj =
      new Date();

    dateObj.setHours(hours);

    dateObj.setMinutes(
      minutes + minutesToAdd
    );

    return dateObj
      .toTimeString()
      .slice(0, 5);
  };


  // =====================================================
  // ✅ FORMAT SLOT
  // =====================================================

  const formatSlot = (
    slot
  ) => {

    const startTime =
      normalizeTime(slot);

    if (!startTime) {

      return null;
    }

    return {

      time:
        startTime,

      start_time:
        startTime,

      end_time:
        slot?.end_time ||
        addMinutes(
          startTime,
          slot?.duration || 15
        ),

      remaining_capacity:
        slot?.remaining_capacity ?? 1,

      total_capacity:
        slot?.total_capacity ?? 1,

      booking_count:
        slot?.booking_count ?? 0,

      is_available:
        slot?.is_available ?? true,
    };
  };


  // =====================================================
  // ✅ FETCH SLOTS
  // =====================================================

  const fetchSlots =
    useCallback(async () => {

      if (
        !doctor?.id ||
        !date
      ) {

        return;
      }

      try {

        setLoading(true);

        const response =
          await getAvailableSlots(
            doctor.id,
            date
          );

        const rawSlots =

          response?.slots ||

          response?.data?.slots ||

          [];

        if (
          !Array.isArray(
            rawSlots
          )
        ) {

          setSlots([]);

          return;
        }

        const formattedSlots =
          rawSlots
            .map(formatSlot)
            .filter(Boolean);

        setSlots(
          formattedSlots
        );

      } catch (error) {

        console.error(
          "SLOT FETCH ERROR:",
          error
        );

        setSlots([]);

      } finally {

        setLoading(false);
      }

    }, [
      doctor?.id,
      date,
    ]);


  // =====================================================
  // ✅ INITIAL LOAD + REALTIME POLLING
  // =====================================================

  useEffect(() => {

    if (
      !doctor?.id ||
      !date
    ) {

      return;
    }

    fetchSlots();

    const interval =
      setInterval(
        fetchSlots,
        5000
      );

    return () =>
      clearInterval(
        interval
      );

  }, [
    fetchSlots,
    doctor?.id,
    date,
  ]);


  // =====================================================
  // ✅ RESET INVALID SLOT
  // =====================================================

  useEffect(() => {

    if (!selectedSlot) {

      return;
    }

    const exists =
      slots.some(
        (slot) =>
          slot.start_time ===
          selectedSlot.start_time
      );

    if (!exists) {

      onSelect(null);
    }

  }, [
    slots,
    selectedSlot,
    onSelect,
  ]);


  // =====================================================
  // ✅ GUARD
  // =====================================================

  if (
    !doctor?.id ||
    !date
  ) {

    return null;
  }


  return (

    <div
      className="
        bg-white
        rounded-[2rem]
        border border-borderColor
        shadow-soft
        overflow-hidden
        fade-in
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
          lg:flex-row
          lg:items-center
          lg:justify-between
          gap-4
        "
      >

        {/* LEFT */}

        <div
          className="
            flex
            items-center
            gap-4
          "
        >

          <div
            className="
              w-14 h-14
              rounded-2xl
              bg-primary/10
              text-primary
              flex
              items-center
              justify-center
            "
          >

            <CalendarClock
              size={24}
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

              Live Available Slots

            </h2>

            <p
              className="
                text-sm
                text-textSecondary
                mt-1
              "
            >

              Enterprise real-time scheduling engine

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

            Live Updates

          </div>


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

            <TimerReset
              size={16}
            />

            Refresh: 5s

          </div>


          <div
            className="
              bg-primary/10
              text-primary
              px-4 py-2
              rounded-2xl
              text-sm
              font-semibold
            "
          >

            {slots.length}
            {" "}
            Slots Available

          </div>

        </div>

      </div>


      {/* ================================================= */}
      {/* ✅ BODY */}
      {/* ================================================= */}

      <div className="p-6">

        {/* ================================================= */}
        {/* ✅ LOADING */}
        {/* ================================================= */}

        {
          loading && (

            <div
              className="
                py-10
              "
            >

              <Loader
                text="Loading live slot availability..."
              />

            </div>
          )
        }


        {/* ================================================= */}
        {/* ✅ EMPTY */}
        {/* ================================================= */}

        {
          !loading &&
          slots.length === 0 && (

            <div
              className="
                text-center
                py-14
              "
            >

              <div
                className="
                  w-20 h-20
                  mx-auto
                  rounded-full
                  bg-red-100
                  text-red-600
                  flex
                  items-center
                  justify-center
                  mb-5
                "
              >

                <AlertTriangle
                  size={34}
                />

              </div>


              <h3
                className="
                  text-xl
                  font-bold
                  text-textPrimary
                "
              >

                No Slots Available

              </h3>


              <p
                className="
                  mt-2
                  text-textSecondary
                "
              >

                Doctor is fully booked
                or unavailable for
                the selected date.

              </p>

            </div>
          )
        }


        {/* ================================================= */}
        {/* ✅ SLOT GRID */}
        {/* ================================================= */}

        {
          !loading &&
          slots.length > 0 && (

            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                xl:grid-cols-3
                gap-4
              "
            >

              {
                slots.map(
                  (
                    slot,
                    index
                  ) => {

                    const isSelected =

                      selectedSlot?.start_time ===
                      slot.start_time;

                    const isLowCapacity =

                      slot.remaining_capacity <= 1;

                    return (

                      <button
                        key={`${slot.start_time}-${index}`}

                        onClick={() =>
                          onSelect(
                            slot
                          )
                        }

                        className={`

                          relative
                          overflow-hidden
                          rounded-[1.5rem]
                          border
                          p-5
                          text-left
                          transition-all
                          duration-300

                          ${
                            isSelected

                              ? `
                                border-primary
                                bg-primary
                                text-white
                                shadow-large
                                scale-[1.02]
                              `

                              : `
                                border-borderColor
                                bg-white
                                hover:border-primary
                                hover:bg-primary/5
                                hover:shadow-soft
                              `
                          }
                        `}
                      >

                        {/* TOP */}

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
                              className={`
                                w-12 h-12
                                rounded-2xl
                                flex
                                items-center
                                justify-center

                                ${
                                  isSelected

                                    ? `
                                      bg-white/20
                                      text-white
                                    `

                                    : `
                                      bg-primary/10
                                      text-primary
                                    `
                                }
                              `}
                            >

                              <Clock3
                                size={20}
                              />

                            </div>


                            <div>

                              <h3
                                className="
                                  text-lg
                                  font-bold
                                "
                              >

                                {
                                  slot.start_time
                                }

                              </h3>

                              <p
                                className={`
                                  text-sm

                                  ${
                                    isSelected
                                      ? "text-white/80"
                                      : "text-textSecondary"
                                  }
                                `}
                              >

                                to
                                {" "}
                                {
                                  slot.end_time
                                }

                              </p>

                            </div>

                          </div>


                          {
                            isSelected && (

                              <CheckCircle2
                                size={22}
                              />
                            )
                          }

                        </div>


                        {/* FOOTER */}

                        <div
                          className="
                            mt-5
                            flex
                            items-center
                            justify-between
                          "
                        >

                          <div
                            className="
                              flex
                              items-center
                              gap-2
                            "
                          >

                            <Users
                              size={16}
                            />

                            <span
                              className="
                                text-sm
                                font-semibold
                              "
                            >

                              {
                                slot.remaining_capacity
                              }
                              {" "}
                              left

                            </span>

                          </div>


                          <span
                            className={`

                              text-xs
                              font-semibold
                              px-3 py-1
                              rounded-full

                              ${
                                isLowCapacity

                                  ? `
                                    bg-yellow-100
                                    text-yellow-700
                                  `

                                  : isSelected

                                    ? `
                                      bg-white/20
                                      text-white
                                    `

                                    : `
                                      bg-green-100
                                      text-green-700
                                    `
                              }
                            `}
                          >

                            {
                              isLowCapacity
                                ? "Filling Fast"
                                : "Available"
                            }

                          </span>

                        </div>

                      </button>
                    );
                  }
                )
              }

            </div>
          )
        }

      </div>

    </div>
  );
};

export default SlotSelector;
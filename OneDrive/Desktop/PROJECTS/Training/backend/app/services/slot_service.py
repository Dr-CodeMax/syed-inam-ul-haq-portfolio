from datetime import (
    timedelta,
    datetime,
)

from app.models.availability import Availability
from app.models.appointment import Appointment


# =====================================================
# ✅ NORMALIZE DAY
# =====================================================
def normalize_day(day: str):

    return day.strip().capitalize()


# =====================================================
# ✅ GENERATE AVAILABLE SLOTS
# =====================================================
def generate_slots(
    db,
    doctor_id,
    selected_date,
):

    try:

        # =================================================
        # ✅ GET WEEKDAY
        # =================================================
        day = normalize_day(
            selected_date.strftime("%A")
        )

        print(f"\n📅 Requested Day: {day}")

        # =================================================
        # ✅ FETCH DOCTOR AVAILABILITY
        # =================================================
        availability_list = (
            db.query(Availability)
            .filter(
                Availability.doctor_id == doctor_id,
                Availability.day_of_week == day,
                Availability.is_active == True,
            )
            .order_by(
                Availability.start_time.asc()
            )
            .all()
        )

        print(
            f"✅ Availability Found: {len(availability_list)}"
        )

        # =================================================
        # ✅ NO AVAILABILITY
        # =================================================
        if not availability_list:
            return []

        # =================================================
        # ✅ FETCH BLOCKED APPOINTMENTS
        # =================================================
        blocked_slots = (
            db.query(Appointment.time)
            .filter(
                Appointment.doctor_id == doctor_id,
                Appointment.date == selected_date,
                Appointment.status.in_([
                    "PENDING",
                    "BOOKED",
                    "CONFIRMED",
                ])
            )
            .all()
        )

        # =================================================
        # ✅ CONVERT BLOCKED TIMES
        # =================================================
        blocked_times = set()

        for slot in blocked_slots:

            if slot[0]:

                blocked_times.add(
                    slot[0].strftime("%H:%M")
                )

        print(
            f"🚫 Blocked Slots: {blocked_times}"
        )

        slots = []

        # =================================================
        # ✅ GENERATE DYNAMIC SLOTS
        # =================================================
        for availability in availability_list:

            # =============================================
            # ✅ FALLBACK VALUES
            # =============================================
            slot_duration = (
                availability.slot_duration
                or 15
            )

            buffer_time = (
                availability.buffer_time
                or 0
            )

            slot_capacity = (
                availability.slot_capacity
                or 1
            )

            # =============================================
            # ✅ CONVERT TO TIMEDATA
            # =============================================
            slot_duration_delta = timedelta(
                minutes=slot_duration
            )

            buffer_delta = timedelta(
                minutes=buffer_time
            )

            # =============================================
            # ✅ DATETIME CONVERSION
            # =============================================
            current_time = datetime.combine(
                selected_date,
                availability.start_time
            )

            end_time = datetime.combine(
                selected_date,
                availability.end_time
            )

            print(
                f"\n🕒 Processing Availability "
                f"{availability.id}"
            )

            # =============================================
            # ✅ GENERATE SLOTS
            # =============================================
            while (
                current_time +
                slot_duration_delta
                <= end_time
            ):

                slot_start = current_time

                slot_end = (
                    current_time +
                    slot_duration_delta
                )

                slot_string = slot_start.strftime(
                    "%H:%M"
                )

                # =========================================
                # ✅ SKIP BLOCKED SLOT
                # =========================================
                if slot_string not in blocked_times:

                    slots.append({

                        "availability_id":
                        availability.id,

                        "day_of_week":
                        availability.day_of_week,

                        "start_time":
                        slot_start.strftime(
                            "%H:%M"
                        ),

                        "end_time":
                        slot_end.strftime(
                            "%H:%M"
                        ),

                        "slot_duration":
                        slot_duration,

                        "slot_capacity":
                        slot_capacity,

                        "buffer_time":
                        buffer_time,

                        "is_online":
                        availability.is_online,

                        "accepts_emergency":
                        availability.accepts_emergency,

                        "is_available": True,
                    })

                # =========================================
                # ✅ NEXT SLOT
                # =========================================
                current_time = (
                    slot_end +
                    buffer_delta
                )

        # =================================================
        # ✅ REMOVE DUPLICATES
        # =================================================
        unique_slots = []

        seen = set()

        for slot in slots:

            slot_key = (
                slot["start_time"],
                slot["end_time"]
            )

            if slot_key not in seen:

                unique_slots.append(slot)

                seen.add(slot_key)

        # =================================================
        # ✅ SORT
        # =================================================
        unique_slots.sort(
            key=lambda x: x["start_time"]
        )

        print(
            f"✅ Total Generated Slots: "
            f"{len(unique_slots)}"
        )

        return unique_slots

    except Exception as e:

        print(
            f"\n❌ SLOT GENERATION ERROR: {str(e)}"
        )

        raise Exception(
            f"Failed to generate slots: {str(e)}"
        )
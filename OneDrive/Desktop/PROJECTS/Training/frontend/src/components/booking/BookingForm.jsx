import {
  useState,
  useEffect,
} from "react";

import {
  FileText,
  Shield,
  Sparkles,
} from "lucide-react";

import toast from "react-hot-toast";

import {
  motion,
} from "framer-motion";

import {
  getSocket,
} from "../../services/socket";

import {
  formatDateLocal,
} from "../../utils/date";


const BookingForm = ({

  doctor,

  date,

  time,

  setSlots,

  onSymptomsChange,
}) => {

  const [symptoms, setSymptoms] =
    useState("");


  // =====================================================
  // ✅ RESET
  // =====================================================

  useEffect(() => {

    setSymptoms("");

  }, [doctor, date, time]);


  // =====================================================
  // ✅ SOCKET SLOT SYNC
  // =====================================================

  useEffect(() => {

    if (!doctor || !date) {
      return;
    }

    const socket = getSocket();

    if (!socket) {
      return;
    }

    const formattedDate =
      formatDateLocal(date);

    const handleMessage = (event) => {

      try {

        const data =
          JSON.parse(event.data);

        if (

          data.type === "SLOT_BOOKED" &&

          data.doctor_id === doctor.id &&

          data.date === formattedDate
        ) {

          if (setSlots) {

            setSlots((prev = []) =>

              prev.filter(
                (slot) =>

                  slot.start_time !==
                  data.time
              )
            );
          }

          toast(
            "⚡ Slot booked by another patient"
          );
        }

      } catch (err) {

        console.error(
          "SOCKET ERROR:",
          err
        );
      }
    };

    socket.addEventListener(
      "message",
      handleMessage
    );

    return () => {

      socket.removeEventListener(
        "message",
        handleMessage
      );
    };

  }, [
    doctor?.id,
    date,
    setSlots,
  ]);


  // =====================================================
  // ✅ SEND DATA TO PARENT
  // =====================================================

  useEffect(() => {

    if (onSymptomsChange) {

      onSymptomsChange(
        symptoms.trim()
      );
    }

  }, [
    symptoms,
    onSymptomsChange,
  ]);


  // =====================================================
  // ✅ GUARD
  // =====================================================

  if (!doctor || !date || !time) {
    return null;
  }


  return (

    <motion.div

      initial={{
        opacity: 0,
        y: 20,
      }}

      animate={{
        opacity: 1,
        y: 0,
      }}

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
          bg-gradient-to-r
          from-primary
          to-secondary
          p-6
          text-white
        "
      >

        <div
          className="
            flex items-center gap-4
          "
        >

          <div
            className="
              w-14 h-14
              rounded-2xl
              bg-white/10
              flex items-center justify-center
            "
          >

            <FileText size={24} />

          </div>

          <div>

            <h2
              className="
                text-2xl
                font-bold
              "
            >

              Patient Notes

            </h2>

            <p className="text-white/80">

              Share important medical details

            </p>

          </div>

        </div>

      </div>


      {/* ================================================= */}
      {/* ✅ CONTENT */}
      {/* ================================================= */}

      <div className="p-6">

        {/* INFO BOX */}

        <div
          className="
            flex items-start gap-3
            bg-primary/5
            border border-primary/10
            rounded-2xl
            p-4
            mb-5
          "
        >

          <Sparkles
            size={18}
            className="
              text-primary
              mt-0.5
            "
          />

          <p
            className="
              text-sm
              text-textSecondary
              leading-relaxed
            "
          >

            Mention symptoms, allergies,
            medications, medical history,
            or concerns for a smoother
            consultation experience.

          </p>

        </div>


        {/* TEXTAREA */}

        <textarea
          placeholder="
Describe your symptoms, concerns,
medical history or anything important
for the doctor to know...
          "
          value={symptoms}
          onChange={(e) =>
            setSymptoms(
              e.target.value
            )
          }
          className="
            w-full
            min-h-[220px]

            rounded-[1.5rem]

            border border-borderColor

            bg-muted

            p-5

            text-textPrimary

            placeholder:text-slate-400

            resize-none

            focus:ring-4
            focus:ring-primary/10
            focus:border-primary

            transition-all
            duration-300
          "
        />


        {/* CHARACTER COUNT */}

        <div
          className="
            mt-3
            flex justify-end
          "
        >

          <span
            className="
              text-xs
              text-textSecondary
            "
          >

            {symptoms.length}
            {" "}
            characters

          </span>

        </div>


        {/* SECURITY */}

        <div
          className="
            mt-6
            bg-green-50
            border border-green-100
            rounded-2xl
            p-4

            flex items-start gap-3
          "
        >

          <Shield
            size={18}
            className="
              text-green-600
              mt-0.5
            "
          />

          <p
            className="
              text-sm
              text-green-700
              leading-relaxed
            "
          >

            Your medical information is
            securely encrypted and only
            visible to your selected doctor.

          </p>

        </div>

      </div>

    </motion.div>
  );
};

export default BookingForm;
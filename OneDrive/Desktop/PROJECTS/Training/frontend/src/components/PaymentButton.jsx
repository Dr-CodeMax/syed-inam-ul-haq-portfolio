import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
  CheckCircle2,
  Loader2,
  CreditCard,
} from "lucide-react";

import {
  createPayment,
  pay,
} from "../api/payment";


const PaymentButton = ({

  appointmentId,

  amount = 500,

  doctorName,

  date,

  time,

  paymentStatus,

  onSuccess,
}) => {

  // =====================================================
  // ✅ STATE
  // =====================================================

  const [loading, setLoading] =
    useState(false);

  const [paid, setPaid] =
    useState(false);

  const navigate =
    useNavigate();


  // =====================================================
  // ✅ INITIAL PAYMENT STATUS
  // =====================================================

  useEffect(() => {

    if (
      paymentStatus === "PAID" ||

      paymentStatus === "COMPLETED" ||

      paymentStatus === "SUCCESS"
    ) {

      setPaid(true);
    }

  }, [paymentStatus]);


  // =====================================================
  // ✅ PAYMENT FLOW
  // =====================================================

  const handlePayment =
    async () => {

    // 🚨 SAFETY
    if (!appointmentId) {

      toast.error(
        "Invalid appointment"
      );

      return;
    }

    // 🚨 ALREADY PAID
    if (paid) {

      toast.success(
        "Already paid"
      );

      return;
    }

    try {

      setLoading(true);

      // =================================================
      // ✅ CREATE PAYMENT
      // =================================================

      const createRes =
        await createPayment({

          appointment_id:
            Number(appointmentId),

          amount:
            Number(amount),
        });

      const paymentData =
        createRes?.data?.data;

      if (!paymentData) {

        throw new Error(
          "Payment response missing"
        );
      }

      const paymentId =
        paymentData.payment_id;

      if (!paymentId) {

        throw new Error(
          "Payment ID missing"
        );
      }

      // =================================================
      // ✅ COMPLETE PAYMENT
      // =================================================

      const payRes =
        await pay({

          payment_id:
            Number(paymentId),
        });

      console.log(
        "PAYMENT SUCCESS:",
        payRes?.data
      );

      // =================================================
      // ✅ LOCAL UI UPDATE
      // =================================================

      setPaid(true);

      toast.success(
        "Payment successful 🎉"
      );

      // =================================================
      // ✅ REFRESH APPOINTMENTS
      // =================================================

      if (onSuccess) {

        await onSuccess();
      }

      // =================================================
      // ✅ SUCCESS PAGE
      // =================================================

      navigate(
        "/patient/booking-success",
        {
          state: {

            doctorName,

            date,

            time,
          },
        }
      );

    } catch (err) {

      console.error(
        "PAYMENT FLOW ERROR:",
        err
      );

      let message =
        "Payment failed";

      // =================================================
      // ✅ FASTAPI VALIDATION
      // =================================================

      if (
        Array.isArray(
          err?.response?.data?.detail
        )
      ) {

        message =

          err.response
            .data
            .detail[0]?.msg ||

          "Validation error";
      }

      // =================================================
      // ✅ NORMAL API ERROR
      // =================================================

      else if (

        typeof err
          ?.response
          ?.data
          ?.detail === "string"
      ) {

        message =
          err.response
            .data
            .detail;
      }

      // =================================================
      // ✅ JS ERROR
      // =================================================

      else if (err?.message) {

        message =
          err.message;
      }

      toast.error(
        String(message)
      );

    } finally {

      setLoading(false);
    }
  };


  // =====================================================
  // ✅ PAID UI
  // =====================================================

  if (paid) {

    return (

      <div
        className="
          flex items-center
          justify-center gap-2

          px-5 py-3

          rounded-2xl

          bg-green-100
          text-green-700

          font-semibold
        "
      >

        <CheckCircle2 size={18} />

        Payment Completed

      </div>
    );
  }


  // =====================================================
  // ✅ BUTTON UI
  // =====================================================

  return (

    <button

      onClick={handlePayment}

      disabled={loading}

      className={`
        w-full

        flex items-center
        justify-center gap-2

        px-5 py-3

        rounded-2xl

        font-semibold

        transition-all
        duration-300

        shadow-soft

        ${loading

          ? `
            bg-slate-400
            cursor-not-allowed
            text-white
          `

          : `
            bg-green-600
            hover:bg-green-700
            text-white
            hover:scale-[1.02]
          `
        }
      `}
    >

      {loading ? (

        <>

          <Loader2
            size={18}
            className="
              animate-spin
            "
          />

          Processing Payment...

        </>

      ) : (

        <>

          <CreditCard size={18} />

          Pay Now

        </>
      )}

    </button>
  );
};

export default PaymentButton;
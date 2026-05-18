import {
  useEffect,
} from "react";

import {
  createPortal,
} from "react-dom";

import {
  X,
  AlertTriangle,
} from "lucide-react";


// ======================================================
// ✅ ENTERPRISE CONFIRM MODAL
// ======================================================

const ConfirmModal = ({

  open,

  onClose,

  onConfirm,

  title = "Confirm Action",

  message = "Are you sure?",

  confirmText = "Confirm",

  cancelText = "Cancel",

  variant = "danger",

  loading = false,

}) => {


  // ======================================================
  // ✅ ESCAPE SUPPORT
  // ======================================================

  useEffect(() => {

    const handleEscape = (
      e
    ) => {

      if (
        e.key === "Escape"
      ) {

        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {

      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };

  }, [onClose]);


  // ======================================================
  // ✅ PREVENT BODY SCROLL
  // ======================================================

  useEffect(() => {

    document.body.style.overflow =
      open
        ? "hidden"
        : "auto";

    return () => {

      document.body.style.overflow =
        "auto";
    };

  }, [open]);


  // ======================================================
  // ✅ PREVENT RENDER
  // ======================================================

  if (!open) return null;


  // ======================================================
  // ✅ BUTTON VARIANTS
  // ======================================================

  const confirmButtonStyles = {

    danger:
      "bg-red-600 hover:bg-red-700 focus:ring-red-500",

    warning:
      "bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500",

    primary:
      "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
  };


  // ======================================================
  // ✅ MODAL UI
  // ======================================================

  return createPortal(

    <div
      className="
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center
        p-4
      "
    >

      {/* ====================================================== */}
      {/* BACKDROP */}
      {/* ====================================================== */}

      <div
        onClick={onClose}
        className="
          absolute
          inset-0
          bg-black/50
          backdrop-blur-sm
          animate-in
          fade-in
          duration-200
        "
      />


      {/* ====================================================== */}
      {/* MODAL */}
      {/* ====================================================== */}

      <div
        className="
          relative
          w-full
          max-w-md
          rounded-3xl
          bg-white
          shadow-2xl
          animate-in
          zoom-in-95
          duration-200
        "
      >

        {/* ====================================================== */}
        {/* HEADER */}
        {/* ====================================================== */}

        <div
          className="
            flex
            items-start
            justify-between
            border-b
            p-6
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
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-red-100
              "
            >

              <AlertTriangle
                size={24}
                className="text-red-600"
              />

            </div>

            <div>

              <h2
                className="
                  text-xl
                  font-bold
                  text-gray-900
                "
              >
                {title}
              </h2>

            </div>

          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="
              rounded-xl
              p-2
              transition
              hover:bg-gray-100
            "
          >

            <X size={20} />

          </button>

        </div>


        {/* ====================================================== */}
        {/* BODY */}
        {/* ====================================================== */}

        <div className="p-6">

          <p
            className="
              leading-relaxed
              text-gray-600
            "
          >
            {message}
          </p>

        </div>


        {/* ====================================================== */}
        {/* FOOTER */}
        {/* ====================================================== */}

        <div
          className="
            flex
            justify-end
            gap-3
            border-t
            p-6
          "
        >

          <button
            onClick={onClose}
            disabled={loading}
            className="
              rounded-2xl
              border
              border-gray-300
              px-5
              py-2.5
              font-medium
              transition
              hover:bg-gray-100
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {cancelText}
          </button>


          <button
            onClick={onConfirm}
            disabled={loading}
            className={`
              rounded-2xl
              px-5
              py-2.5
              font-semibold
              text-white
              transition
              focus:outline-none
              focus:ring-2
              disabled:cursor-not-allowed
              disabled:opacity-50
              ${confirmButtonStyles[variant]}
            `}
          >

            {
              loading
                ? "Processing..."
                : confirmText
            }

          </button>

        </div>

      </div>

    </div>,

    document.body
  );
};

export default ConfirmModal;
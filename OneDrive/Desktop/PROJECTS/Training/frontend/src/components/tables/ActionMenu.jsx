import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  MoreHorizontal,
} from "lucide-react";


// ======================================================
// ✅ ACTION MENU
// ======================================================

const ActionMenu = ({
  actions = [],
}) => {

  const [
    open,
    setOpen,
  ] = useState(false);

  const menuRef =
    useRef(null);


  // ======================================================
  // ✅ CLOSE OUTSIDE
  // ======================================================

  useEffect(() => {

    const handleClickOutside = (
      event
    ) => {

      if (
        menuRef.current
        &&
        !menuRef.current.contains(
          event.target
        )
      ) {
        setOpen(false);
      }

    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };

  }, []);


  return (

    <div
      ref={menuRef}
      className="
        relative
        inline-block
        text-left
      "
    >

      {/* ============================================= */}
      {/* ✅ BUTTON */}
      {/* ============================================= */}

      <button
        onClick={() =>
          setOpen(!open)
        }
        className="
          flex
          items-center
          justify-center
          w-9
          h-9
          rounded-lg
          hover:bg-slate-100
          transition
        "
      >

        <MoreHorizontal
          size={18}
        />

      </button>


      {/* ============================================= */}
      {/* ✅ DROPDOWN */}
      {/* ============================================= */}

      {open && (

        <div
          className="
            absolute
            right-0
            mt-2
            w-48
            bg-white
            border
            border-slate-200
            rounded-xl
            shadow-lg
            z-50
            overflow-hidden
          "
        >

          {actions.map(
            (
              action,
              index
            ) => (

              <button
                key={index}
                onClick={() => {

                  action.onClick();
                  setOpen(false);

                }}
                className={`
                  w-full
                  text-left
                  px-4
                  py-3
                  text-sm
                  transition
                  hover:bg-slate-50

                  ${
                    action.danger
                      ? `
                        text-red-600
                      `
                      : `
                        text-slate-700
                      `
                  }
                `}
              >

                {action.label}

              </button>

            )
          )}

        </div>

      )}

    </div>

  );

};

export default ActionMenu;
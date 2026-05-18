// =========================================================
// ✅ ModerationActions.jsx
// =========================================================

const ModerationActions = ({
  doctor,
  onApprove,
  onReject,
  onSuspend,
  onReactivate,
}) => {

  const status = doctor?.status?.toUpperCase();

  return (

    <div className="flex gap-2 flex-wrap">

      {/* ================================================= */}
      {/* ✅ PENDING */}
      {/* ================================================= */}

      {status === "PENDING" && (
        <>
          <button
            onClick={() => onApprove(doctor.id)}
            className="
              bg-green-600
              hover:bg-green-700
              text-white
              px-3
              py-1
              rounded-lg
              text-sm
              transition
            "
          >
            Approve
          </button>

          <button
            onClick={() => onReject(doctor.id)}
            className="
              bg-red-600
              hover:bg-red-700
              text-white
              px-3
              py-1
              rounded-lg
              text-sm
              transition
            "
          >
            Reject
          </button>
        </>
      )}

      {/* ================================================= */}
      {/* ✅ APPROVED */}
      {/* ================================================= */}

      {status === "APPROVED" && (
        <button
          onClick={() => onSuspend(doctor.id)}
          className="
            bg-gray-700
            hover:bg-gray-800
            text-white
            px-3
            py-1
            rounded-lg
            text-sm
            transition
          "
        >
          Suspend
        </button>
      )}

      {/* ================================================= */}
      {/* ✅ SUSPENDED */}
      {/* ================================================= */}

      {status === "SUSPENDED" && (
        <button
          onClick={() => onReactivate(doctor.id)}
          className="
            bg-blue-600
            hover:bg-blue-700
            text-white
            px-3
            py-1
            rounded-lg
            text-sm
            transition
          "
        >
          Reactivate
        </button>
      )}

      {/* ================================================= */}
      {/* ✅ REJECTED */}
      {/* ================================================= */}

      {status === "REJECTED" && (
        <button
          onClick={() => onReactivate(doctor.id)}
          className="
            bg-purple-600
            hover:bg-purple-700
            text-white
            px-3
            py-1
            rounded-lg
            text-sm
            transition
          "
        >
          Reconsider
        </button>
      )}

    </div>
  );
};

export default ModerationActions;
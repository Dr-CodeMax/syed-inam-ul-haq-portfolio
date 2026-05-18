// =====================================================
// ✅ ENTERPRISE SKELETON CARD
// =====================================================

const SkeletonCard = () => {

  return (

    <div
      className="
        enterprise-card
        shimmer

        p-6
      "
    >

      {/* HEADER */}

      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        <div className="space-y-3">

          <div
            className="
              h-4
              w-28

              rounded-full

              bg-slate-200
            "
          />

          <div
            className="
              h-10
              w-20

              rounded-xl

              bg-slate-200
            "
          />

        </div>

        <div
          className="
            h-14
            w-14

            rounded-2xl

            bg-slate-200
          "
        />

      </div>

    </div>
  );
};

export default SkeletonCard;
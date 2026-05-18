import { ShieldX } from "lucide-react";

import { Link } from "react-router-dom";

const Unauthorized = () => {

  return (

    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-background
        px-6
      "
    >

      <div
        className="
          max-w-md
          w-full
          bg-card
          border
          border-border
          rounded-3xl
          p-10
          shadow-xl
          text-center
        "
      >

        {/* ICON */}

        <div
          className="
            flex
            justify-center
            mb-6
          "
        >

          <div
            className="
              w-20
              h-20
              rounded-full
              bg-red-500/10
              flex
              items-center
              justify-center
            "
          >

            <ShieldX
              size={40}
              className="text-red-500"
            />

          </div>

        </div>

        {/* TITLE */}

        <h1
          className="
            text-3xl
            font-bold
            text-textPrimary
            mb-4
          "
        >

          Access Denied

        </h1>

        {/* DESCRIPTION */}

        <p
          className="
            text-textSecondary
            mb-8
            leading-relaxed
          "
        >

          You do not have permission
          to access this page.

        </p>

        {/* BUTTON */}

        <Link
          to="/patient/dashboard"
          className="
            inline-flex
            items-center
            justify-center
            px-6
            py-3
            rounded-2xl
            bg-primary
            hover:opacity-90
            transition
            text-white
            font-semibold
          "
        >

          Back To Dashboard

        </Link>

      </div>

    </div>
  );
};

export default Unauthorized;
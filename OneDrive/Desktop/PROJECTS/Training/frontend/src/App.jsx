import AppRoutes from "./routes/AppRoutes";

import { useAuth } from "./context/AuthContext";


// ======================================================
// APP
// ======================================================

function App() {

  const {
    loading,
  } = useAuth();


  // ======================================================
  // GLOBAL APP LOADING SCREEN
  // ======================================================

  if (loading) {

    return (

      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          bg-background
          px-4
        "
      >

        <div
          className="
            flex
            flex-col
            items-center
            gap-5
          "
        >

          {/* ====================================================== */}
          {/* ENTERPRISE SPINNER */}
          {/* ====================================================== */}

          <div className="relative">

            {/* OUTER RING */}

            <div
              className="
                h-16
                w-16
                rounded-full
                border-4
                border-primary/10
              "
            />

            {/* SPINNING RING */}

            <div
              className="
                absolute
                inset-0
                h-16
                w-16
                rounded-full
                border-4
                border-transparent
                border-t-primary
                animate-spin
              "
            />

          </div>


          {/* ====================================================== */}
          {/* LOADING TEXT */}
          {/* ====================================================== */}

          <div className="text-center">

            <h2
              className="
                text-lg
                font-semibold
                text-textPrimary
              "
            >
              MedBook Enterprise
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-textSecondary
              "
            >
              Initializing secure healthcare platform...
            </p>

          </div>

        </div>

      </div>

    );

  }


  // ======================================================
  // APPLICATION ROUTES
  // ======================================================

  return <AppRoutes />;

}

export default App;

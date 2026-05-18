import { createRoot } from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

import { Toaster } from "react-hot-toast";

import "./index.css";

import App from "./App.jsx";

import { AuthProvider } from "./context/AuthContext";

import { SocketProvider } from "./context/SocketContext";


// ======================================================
// ROOT APPLICATION
// ======================================================

createRoot(
  document.getElementById("root")
).render(

  <BrowserRouter>

    <AuthProvider>

      <SocketProvider>

        {/* ====================================================== */}
        {/* GLOBAL ENTERPRISE TOAST SYSTEM */}
        {/* ====================================================== */}

        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={12}
          containerStyle={{
            top: 24,
            right: 24,
          }}
          toastOptions={{

            // ======================================================
            // DEFAULT TOAST
            // ======================================================

            duration: 3500,

            style: {
              background: "#ffffff",
              color: "#111827",
              border: "1px solid #e5e7eb",
              borderRadius: "18px",
              padding: "14px 16px",
              fontSize: "14px",
              fontWeight: "500",
              boxShadow:
                "0 10px 25px rgba(0,0,0,0.08)",
            },

            // ======================================================
            // SUCCESS TOAST
            // ======================================================

            success: {

              duration: 3000,

              iconTheme: {
                primary: "#2563eb",
                secondary: "#ffffff",
              },

              style: {
                border:
                  "1px solid rgba(37,99,235,0.15)",
              },
            },

            // ======================================================
            // ERROR TOAST
            // ======================================================

            error: {

              duration: 4500,

              iconTheme: {
                primary: "#ef4444",
                secondary: "#ffffff",
              },

              style: {
                border:
                  "1px solid rgba(239,68,68,0.15)",
              },
            },

            // ======================================================
            // LOADING TOAST
            // ======================================================

            loading: {

              style: {
                border:
                  "1px solid rgba(17,24,39,0.08)",
              },
            },
          }}
        />


        {/* ====================================================== */}
        {/* MAIN APP */}
        {/* ====================================================== */}

        <App />

      </SocketProvider>

    </AuthProvider>

  </BrowserRouter>
);
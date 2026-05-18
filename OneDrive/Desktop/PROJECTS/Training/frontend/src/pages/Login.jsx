// =========================================================
// FILE: src/pages/Login.jsx
// =========================================================

import {
  useState,
} from "react";

import {
  useNavigate,
  useLocation,
  Link,
} from "react-router-dom";

import {
  Mail,
  LockKeyhole,
  ShieldCheck,
  ArrowRight,
  HeartPulse,
  Eye,
  EyeOff,
  Clock3,
} from "lucide-react";

import {
  motion,
} from "framer-motion";

import toast
  from "react-hot-toast";

import {
  useAuth,
} from "../context/AuthContext";


// =========================================================
// LOGIN
// =========================================================

const Login = () => {

  const {
    login,
  } = useAuth();

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const [email,
    setEmail] =
    useState("");

  const [password,
    setPassword] =
    useState("");

  const [showPassword,
    setShowPassword] =
    useState(false);

  const [loading,
    setLoading] =
    useState(false);


  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      if (
        !email ||
        !password
      ) {

        toast.error(
          "Please enter email and password"
        );

        return;

      }

      try {

        setLoading(true);

        const response =
          await login({

            email,
            password,

          });

        toast.success(
          "Login successful 🎉"
        );

        const loggedInUser =

          response?.user ||

          response?.data?.user;


        // =================================================
        // PREVIOUS ROUTE REDIRECT
        // =================================================

        const from =
          location.state
            ?.from
            ?.pathname;

        if (from) {

          navigate(
            from,
            {
              replace: true,
            }
          );

          return;

        }


        // =================================================
        // ROLE-BASED REDIRECT
        // =================================================

        if (
          loggedInUser?.role ===
          "ADMIN"
        ) {

          navigate(
            "/admin/dashboard",
            {
              replace: true,
            }
          );

        } else if (

          loggedInUser?.role ===
          "DOCTOR"

        ) {

          navigate(
            "/doctor/dashboard",
            {
              replace: true,
            }
          );

        } else {

          navigate(
            "/patient/dashboard",
            {
              replace: true,
            }
          );

        }

      } catch (error) {

        console.error(
          "LOGIN ERROR:",
          error?.response?.data ||
          error
        );

        if (
          error?.response?.status ===
          401
        ) {

          toast.error(
            "Invalid email or password"
          );

        } else if (

          error?.response?.status ===
          403

        ) {

          toast.error(

            error?.response?.data
              ?.detail ||

            "Doctor account not approved"

          );

        } else if (

          error?.response?.status ===
          422

        ) {

          toast.error(
            "Invalid request format"
          );

        } else {

          toast.error(
            error?.response?.data
              ?.message ||

            "Something went wrong"
          );

        }

      } finally {

        setLoading(false);

      }

    };


  return (

    <div
      className="
        min-h-screen

        bg-gradient-to-br
        from-slate-100
        via-blue-50
        to-indigo-100

        flex
        items-center
        justify-center

        px-4
        py-10

        relative
        overflow-hidden
      "
    >

      {/* ================================================= */}
      {/* BACKGROUND BLOBS */}
      {/* ================================================= */}

      <div
        className="
          absolute
          top-[-120px]
          left-[-120px]

          w-[420px]
          h-[420px]

          rounded-full

          bg-primary/10

          blur-3xl
        "
      />

      <div
        className="
          absolute
          bottom-[-120px]
          right-[-120px]

          w-[420px]
          h-[420px]

          rounded-full

          bg-secondary/10

          blur-3xl
        "
      />


      {/* ================================================= */}
      {/* CARD */}
      {/* ================================================= */}

      <motion.div

        initial={{
          opacity: 0,
          y: 20,
          scale: 0.98,
        }}

        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}

        transition={{
          duration: 0.45,
        }}

        className="
          relative
          w-full
          max-w-md

          overflow-hidden

          rounded-[2.5rem]

          border
          border-white/40

          bg-white/80
          backdrop-blur-xl

          shadow-[0_20px_60px_rgba(15,23,42,0.08)]
        "
      >

        {/* ================================================= */}
        {/* TOP SECTION */}
        {/* ================================================= */}

        <div
          className="
            relative
            overflow-hidden

            bg-gradient-to-br
            from-primary
            via-primary
            to-secondary

            px-8
            pt-10
            pb-12

            text-white
          "
        >

          <div
            className="
              absolute
              top-[-40px]
              right-[-20px]

              w-60
              h-60

              rounded-full

              bg-white/10

              blur-3xl
            "
          />

          <div className="relative z-10">

            <motion.div

              animate={{
                y: [0, -4, 0],
              }}

              transition={{
                repeat: Infinity,
                duration: 4,
              }}

              className="
                w-20
                h-20

                rounded-[2rem]

                bg-white/10
                backdrop-blur-md

                border
                border-white/20

                flex
                items-center
                justify-center

                mb-7
              "
            >

              <HeartPulse
                size={40}
              />

            </motion.div>

            <h1
              className="
                text-[2.5rem]
                font-bold

                leading-[1.1]
                tracking-tight
              "
            >

              Welcome
              <br />
              Back

            </h1>

            <p
              className="
                mt-4

                text-white/85
                text-[15px]

                leading-relaxed
              "
            >

              Securely access your healthcare
              dashboard and manage appointments
              with enterprise-grade security.

            </p>

          </div>

        </div>


        {/* ================================================= */}
        {/* FORM */}
        {/* ================================================= */}

        <div className="p-8">

          <form
            onSubmit={
              handleSubmit
            }
            className="
              space-y-6
            "
          >

            {/* EMAIL */}

            <div>

              <label
                className="
                  mb-2
                  block

                  text-sm
                  font-semibold

                  text-textPrimary
                "
              >

                Email Address

              </label>

              <div
                className="
                  group

                  flex
                  items-center
                  gap-3

                  rounded-2xl

                  border
                  border-slate-200

                  bg-slate-50/80

                  px-4
                  py-4

                  transition-all
                  duration-300

                  hover:border-primary/30
                  hover:bg-white

                  focus-within:border-primary
                  focus-within:bg-white
                  focus-within:ring-4
                  focus-within:ring-primary/10
                "
              >

                <Mail
                  size={20}
                  className="
                    text-slate-400

                    transition-colors

                    group-focus-within:text-primary
                  "
                />

                <input
                  type="email"

                  placeholder="
                    Enter your email
                  "

                  value={email}

                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }

                  required

                  className="
                    w-full

                    bg-transparent

                    text-textPrimary

                    placeholder:text-slate-400

                    outline-none
                    border-none

                    focus:outline-none
                    focus:ring-0
                  "
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div>

              <label
                className="
                  mb-2
                  block

                  text-sm
                  font-semibold

                  text-textPrimary
                "
              >

                Password

              </label>

              <div
                className="
                  group

                  flex
                  items-center
                  gap-3

                  rounded-2xl

                  border
                  border-slate-200

                  bg-slate-50/80

                  px-4
                  py-4

                  transition-all
                  duration-300

                  hover:border-primary/30
                  hover:bg-white

                  focus-within:border-primary
                  focus-within:bg-white
                  focus-within:ring-4
                  focus-within:ring-primary/10
                "
              >

                <LockKeyhole
                  size={20}
                  className="
                    text-slate-400

                    transition-colors

                    group-focus-within:text-primary
                  "
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }

                  placeholder="
                    Enter your password
                  "

                  value={password}

                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }

                  required

                  className="
                    w-full

                    bg-transparent

                    text-textPrimary

                    placeholder:text-slate-400

                    outline-none
                    border-none

                    focus:outline-none
                    focus:ring-0
                  "
                />

                <button
                  type="button"

                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }

                  className="
                    text-slate-400

                    hover:text-primary

                    transition-colors
                  "
                >

                  {showPassword

                    ? (
                      <EyeOff
                        size={20}
                      />
                    )

                    : (
                      <Eye
                        size={20}
                      />
                    )
                  }

                </button>

              </div>

            </div>


            {/* DOCTOR NOTICE */}

            <div
              className="
                flex
                items-start
                gap-3

                rounded-2xl

                border
                border-amber-100

                bg-amber-50/80

                p-4
              "
            >

              <Clock3
                size={18}
                className="
                  mt-0.5
                  text-amber-600
                "
              />

              <p
                className="
                  text-sm
                  leading-relaxed
                  text-amber-700
                "
              >

                Doctor accounts require
                admin approval before
                accessing the platform.

              </p>

            </div>


            {/* SECURITY NOTICE */}

            <div
              className="
                flex
                items-start
                gap-3

                rounded-2xl

                border
                border-emerald-100

                bg-emerald-50/80

                p-4
              "
            >

              <ShieldCheck
                size={18}
                className="
                  mt-0.5
                  text-emerald-600
                "
              />

              <p
                className="
                  text-sm
                  leading-relaxed
                  text-emerald-700
                "
              >

                Your healthcare information is
                securely encrypted and protected
                using enterprise-grade security.

              </p>

            </div>


            {/* SUBMIT */}

            <motion.button

              whileHover={{
                scale: 1.015,
              }}

              whileTap={{
                scale: 0.98,
              }}

              type="submit"

              disabled={loading}

              className={`
                w-full

                rounded-2xl

                py-4

                font-semibold
                text-white

                flex
                items-center
                justify-center
                gap-2

                transition-all
                duration-300

                ${loading

                  ? `
                    cursor-not-allowed
                    bg-slate-400
                  `

                  : `
                    bg-primary
                    hover:bg-primaryHover

                    shadow-lg
                    hover:shadow-xl
                  `
                }
              `}
            >

              {loading

                ? "Logging in..."

                : (
                  <>
                    Login
                    <ArrowRight
                      size={18}
                    />
                  </>
                )
              }

            </motion.button>

          </form>


          {/* ================================================= */}
          {/* FOOTER */}
          {/* ================================================= */}

          <div
            className="
              mt-8
              text-center
            "
          >

            <p
              className="
                text-sm
                text-textSecondary
              "
            >

              Don&apos;t have an account?

              <Link
                to="/register"

                className="
                  ml-2

                  font-semibold

                  text-primary

                  hover:text-primaryHover
                  hover:underline
                "
              >

                Create Account

              </Link>

            </p>

          </div>

        </div>

      </motion.div>

    </div>

  );

};

export default Login;
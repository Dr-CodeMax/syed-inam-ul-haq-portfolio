// =========================================================
// FILE: src/pages/Register.jsx
// =========================================================

import {
  useState,
} from "react";

import {
  useNavigate,
  Link,
} from "react-router-dom";

import {
  User,
  Mail,
  LockKeyhole,
  MapPin,
  BriefcaseMedical,
  GraduationCap,
  Building2,
  BadgeCheck,
  FileText,
  IndianRupee,
} from "lucide-react";

import {
  motion,
} from "framer-motion";

import toast
from "react-hot-toast";

import api
from "../api/axios";


// =========================================================
// REGISTER PAGE
// =========================================================

const Register = () => {

  const navigate =
    useNavigate();

  const [loading,
    setLoading] =
    useState(false);

  const [formData,
    setFormData] =
    useState({

      // =================================================
      // COMMON
      // =================================================

      name: "",

      email: "",

      password: "",

      city: "",

      role: "PATIENT",

      // =================================================
      // DOCTOR
      // =================================================

      specialization: "",

      experience: "",

      consultation_fee: "",

      qualification: "",

      hospital_name: "",

      license_number: "",

      bio: "",

      mail_email: "",

      mail_password: "",
    });


  // =====================================================
  // HANDLE CHANGE
  // =====================================================

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };


  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        // =================================================
        // BASIC VALIDATION
        // =================================================

        if (
          !formData.name.trim()
        ) {

          toast.error(
            "Name is required"
          );

          return;
        }

        if (
          !formData.email.trim()
        ) {

          toast.error(
            "Email is required"
          );

          return;
        }

        if (
          !formData.password.trim()
        ) {

          toast.error(
            "Password is required"
          );

          return;
        }

        if (
          formData.password.length < 6
        ) {

          toast.error(
            "Password must be at least 6 characters"
          );

          return;
        }


        // =================================================
        // BASE PAYLOAD
        // =================================================

        const payload = {

          name:
            formData.name.trim(),

          email:
            formData.email.trim(),

          password:
            formData.password,

          city:
            formData.city.trim() || null,

          role:
            formData.role,
        };


        // =================================================
        // DOCTOR PAYLOAD
        // =================================================

        if (
          formData.role === "DOCTOR"
        ) {

          payload.specialization =
            formData.specialization
              .trim() || null;

          payload.experience =
            formData.experience
              ? Number(
                  formData.experience
                )
              : null;

          payload.consultation_fee =
            formData.consultation_fee
              ? Number(
                  formData.consultation_fee
                )
              : null;

          payload.qualification =
            formData.qualification
              .trim() || null;

          payload.hospital_name =
            formData.hospital_name
              .trim() || null;

          payload.license_number =
            formData.license_number
              .trim() || null;

          payload.bio =
            formData.bio
              .trim() || null;

          payload.mail_email =
            formData.mail_email
              .trim() || null;

          payload.mail_password =
            formData.mail_password
              .trim() || null;
        }


        // =================================================
        // DEBUG
        // =================================================

        console.log(
          "REGISTER PAYLOAD:",
          payload
        );


        // =================================================
        // API CALL
        // =================================================

        const response =
          await api.post(
            "/auth/register",
            payload
          );


        console.log(
          "REGISTER RESPONSE:",
          response.data
        );


        // =================================================
        // SUCCESS
        // =================================================

        toast.success(
          "Registration successful 🎉"
        );


        // =================================================
        // AUTO LOGIN
        // =================================================

        if (
          response?.data
            ?.access_token
        ) {

          localStorage.setItem(

            "token",

            response.data
              .access_token
          );
        }

        if (
          response?.data
            ?.user
        ) {

          localStorage.setItem(

            "user",

            JSON.stringify(
              response.data.user
            )
          );
        }


        // =================================================
        // NAVIGATION
        // =================================================

        if (
          formData.role === "DOCTOR"
        ) {

          navigate(
            "/login"
          );

        } else {

          navigate(
            "/"
          );
        }

      } catch (error) {

        // =================================================
        // ERROR LOGGING
        // =================================================

        console.error(
          "REGISTER ERROR:",
          error
        );

        console.log(

          "FULL BACKEND ERROR:",

          JSON.stringify(
            error?.response?.data,
            null,
            2
          )

        );

        if (
          error?.response?.data
            ?.detail
        ) {

          console.log(

            "VALIDATION DETAILS:",

            error.response
              .data
              .detail
          );
        }


        // =================================================
        // 422 VALIDATION
        // =================================================

        if (
          error?.response?.status === 422
        ) {

          const details =
            error?.response?.data
              ?.detail;

          if (
            Array.isArray(
              details
            )
          ) {

            const firstError =
              details[0];

            toast.error(

              `${firstError?.loc?.join(" → ")} : ${firstError?.msg}`

            );

          } else {

            toast.error(
              "Validation failed"
            );
          }

        }

        // =================================================
        // OTHER ERRORS
        // =================================================

        else {

          toast.error(

            error?.response?.data
              ?.detail ||

            error?.response?.data
              ?.message ||

            "Registration failed"

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

        flex
        items-center
        justify-center

        bg-slate-100

        px-4
        py-10
      "
    >

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
          w-full
          max-w-4xl

          rounded-3xl

          bg-white

          shadow-2xl

          overflow-hidden
        "
      >

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div
          className="
            bg-primary

            text-white

            px-10
            py-8
          "
        >

          <h1
            className="
              text-4xl
              font-bold
            "
          >

            Create Account

          </h1>

          <p
            className="
              mt-2
              text-white/80
            "
          >

            Register as patient or doctor

          </p>

        </div>


        {/* ================================================= */}
        {/* FORM */}
        {/* ================================================= */}

        <form

          onSubmit={
            handleSubmit
          }

          className="
            p-10

            grid
            grid-cols-1
            md:grid-cols-2

            gap-6
          "
        >

          {/* NAME */}

          <InputField
            icon={
              <User size={18} />
            }
            name="name"
            placeholder="
Full Name
            "
            value={formData.name}
            onChange={handleChange}
            required
          />


          {/* EMAIL */}

          <InputField
            icon={
              <Mail size={18} />
            }
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />


          {/* PASSWORD */}

          <InputField
            icon={
              <LockKeyhole
                size={18}
              />
            }
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />


          {/* CITY */}

          <InputField
            icon={
              <MapPin size={18} />
            }
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
          />


          {/* ROLE */}

          <div>

            <label
              className="
                text-sm
                font-semibold

                mb-2

                block
              "
            >

              Select Role

            </label>

            <select

              name="role"

              value={
                formData.role
              }

              onChange={
                handleChange
              }

              className="
                w-full

                border

                rounded-xl

                px-4
                py-3

                outline-none
              "
            >

              <option value="PATIENT">

                PATIENT

              </option>

              <option value="DOCTOR">

                DOCTOR

              </option>

            </select>

          </div>


          {/* ================================================= */}
          {/* DOCTOR FIELDS */}
          {/* ================================================= */}

          {
            formData.role ===
              "DOCTOR" && (

              <>

                <InputField
                  icon={
                    <BriefcaseMedical
                      size={18}
                    />
                  }
                  name="specialization"
                  placeholder="
Specialization
                  "
                  value={
                    formData.specialization
                  }
                  onChange={
                    handleChange
                  }
                />

                <InputField
                  icon={
                    <GraduationCap
                      size={18}
                    />
                  }
                  name="qualification"
                  placeholder="
Qualification
                  "
                  value={
                    formData.qualification
                  }
                  onChange={
                    handleChange
                  }
                />

                <InputField
                  icon={
                    <Building2
                      size={18}
                    />
                  }
                  name="hospital_name"
                  placeholder="
Hospital Name
                  "
                  value={
                    formData.hospital_name
                  }
                  onChange={
                    handleChange
                  }
                />

                <InputField
                  icon={
                    <BadgeCheck
                      size={18}
                    />
                  }
                  name="license_number"
                  placeholder="
Medical License Number
                  "
                  value={
                    formData.license_number
                  }
                  onChange={
                    handleChange
                  }
                />

                <InputField
                  icon={
                    <FileText
                      size={18}
                    />
                  }
                  name="experience"
                  type="number"
                  placeholder="
Experience (Years)
                  "
                  value={
                    formData.experience
                  }
                  onChange={
                    handleChange
                  }
                />

                <InputField
                  icon={
                    <IndianRupee
                      size={18}
                    />
                  }
                  name="consultation_fee"
                  type="number"
                  placeholder="
Consultation Fee
                  "
                  value={
                    formData.consultation_fee
                  }
                  onChange={
                    handleChange
                  }
                />

                <InputField
                  icon={
                    <Mail size={18} />
                  }
                  name="mail_email"
                  type="email"
                  placeholder="
Professional Mail
                  "
                  value={
                    formData.mail_email
                  }
                  onChange={
                    handleChange
                  }
                />

                <InputField
                  icon={
                    <LockKeyhole
                      size={18}
                    />
                  }
                  name="mail_password"
                  type="password"
                  placeholder="
Mail App Password
                  "
                  value={
                    formData.mail_password
                  }
                  onChange={
                    handleChange
                  }
                />

                <div
                  className="
                    md:col-span-2
                  "
                >

                  <textarea

                    name="bio"

                    rows={5}

                    placeholder="
Doctor Bio
                    "

                    value={
                      formData.bio
                    }

                    onChange={
                      handleChange
                    }

                    className="
                      w-full

                      border

                      rounded-xl

                      p-4

                      outline-none
                    "
                  />

                </div>

              </>
            )
          }


          {/* ================================================= */}
          {/* SUBMIT */}
          {/* ================================================= */}

          <div
            className="
              md:col-span-2
            "
          >

            <button

              type="submit"

              disabled={loading}

              className="
                w-full

                bg-primary
                hover:bg-primaryHover

                text-white
                font-semibold

                py-4

                rounded-2xl

                transition-all

                disabled:opacity-50
              "
            >

              {
                loading

                  ? "Creating Account..."

                  : "Create Account"
              }

            </button>

          </div>


          {/* ================================================= */}
          {/* FOOTER */}
          {/* ================================================= */}

          <div
            className="
              md:col-span-2
              text-center
            "
          >

            <p>

              Already have an account?

              <Link

                to="/login"

                className="
                  text-primary
                  font-semibold
                  ml-2
                "
              >

                Login

              </Link>

            </p>

          </div>

        </form>

      </motion.div>

    </div>
  );
};


// =========================================================
// INPUT FIELD
// =========================================================

const InputField = ({
  icon,
  ...props
}) => {

  return (

    <div>

      <div
        className="
          flex
          items-center
          gap-3

          border

          rounded-xl

          px-4
          py-3
        "
      >

        {icon}

        <input

          {...props}

          className="
            w-full

            outline-none

            bg-transparent
          "
        />

      </div>

    </div>
  );
};

export default Register;
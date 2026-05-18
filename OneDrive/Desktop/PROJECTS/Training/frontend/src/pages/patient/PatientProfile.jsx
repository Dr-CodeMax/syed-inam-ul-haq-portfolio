// ======================================================
// FILE: frontend/src/pages/patient/PatientProfile.jsx
// ======================================================

import {
  useState
} from "react";

import {
  User,
  Phone,
  Mail,
  MapPin,
  Shield,
  Save,
  HeartPulse,
  AlertTriangle,
} from "lucide-react";


const PatientProfile = () => {

  const [formData, setFormData] =
    useState({

      name: "",

      email: "",

      phone: "",

      city: "",

      address: "",

      blood_group: "",

      allergies: "",

      emergency_contact: "",

      medical_history: "",
    });

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (
    e
  ) => {

    e.preventDefault();

    console.log(
      "PATIENT PROFILE:",
      formData
    );
  };

  return (

    <div
      className="
        min-h-screen
        bg-background
        py-10
      "
    >

      <div
        className="
          max-w-5xl
          mx-auto
          px-4
        "
      >

        <div
          className="
            bg-white
            rounded-[2rem]
            border border-borderColor
            shadow-soft
            overflow-hidden
          "
        >

          {/* HEADER */}

          <div
            className="
              p-8
              border-b
              border-borderColor
            "
          >

            <h1
              className="
                text-3xl
                font-bold
                text-textPrimary
              "
            >

              Patient Settings

            </h1>

            <p
              className="
                mt-2
                text-textSecondary
              "
            >

              Manage your personal and
              medical information

            </p>

          </div>

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="
              p-8
              space-y-10
            "
          >

            {/* PERSONAL */}

            <div>

              <h2
                className="
                  text-xl
                  font-bold
                  flex
                  items-center
                  gap-2
                "
              >

                <User size={20} />

                Personal Information

              </h2>

              <div
                className="
                  mt-6
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  gap-6
                "
              >

                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="
                    border
                    rounded-2xl
                    px-5 py-4
                    outline-none
                  "
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="
                    border
                    rounded-2xl
                    px-5 py-4
                    outline-none
                  "
                />

                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="
                    border
                    rounded-2xl
                    px-5 py-4
                    outline-none
                  "
                />

                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  className="
                    border
                    rounded-2xl
                    px-5 py-4
                    outline-none
                  "
                />

              </div>

            </div>

            {/* MEDICAL */}

            <div>

              <h2
                className="
                  text-xl
                  font-bold
                  flex
                  items-center
                  gap-2
                "
              >

                <HeartPulse size={20} />

                Medical Information

              </h2>

              <div
                className="
                  mt-6
                  grid
                  grid-cols-1
                  gap-6
                "
              >

                <input
                  type="text"
                  name="blood_group"
                  placeholder="Blood Group"
                  value={
                    formData.blood_group
                  }
                  onChange={handleChange}
                  className="
                    border
                    rounded-2xl
                    px-5 py-4
                    outline-none
                  "
                />

                <textarea
                  rows="4"
                  name="allergies"
                  placeholder="Allergies"
                  value={
                    formData.allergies
                  }
                  onChange={handleChange}
                  className="
                    border
                    rounded-2xl
                    px-5 py-4
                    outline-none
                  "
                />

                <textarea
                  rows="5"
                  name="medical_history"
                  placeholder="Medical History"
                  value={
                    formData.medical_history
                  }
                  onChange={handleChange}
                  className="
                    border
                    rounded-2xl
                    px-5 py-4
                    outline-none
                  "
                />

              </div>

            </div>

            {/* EMERGENCY */}

            <div>

              <h2
                className="
                  text-xl
                  font-bold
                  flex
                  items-center
                  gap-2
                "
              >

                <AlertTriangle
                  size={20}
                />

                Emergency Contact

              </h2>

              <div className="mt-6">

                <input
                  type="text"
                  name="emergency_contact"
                  placeholder="
                    Emergency Contact Number
                  "
                  value={
                    formData.emergency_contact
                  }
                  onChange={handleChange}
                  className="
                    w-full
                    border
                    rounded-2xl
                    px-5 py-4
                    outline-none
                  "
                />

              </div>

            </div>

            {/* SAVE */}

            <button
              type="submit"
              className="
                w-full
                bg-primary
                hover:bg-primaryHover
                text-white
                py-4
                rounded-2xl
                font-semibold
                flex
                items-center
                justify-center
                gap-2
                transition-all
              "
            >

              <Save size={18} />

              Save Profile

            </button>

          </form>

        </div>

      </div>

    </div>
  );
};

export default PatientProfile;
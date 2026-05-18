import {
  useEffect,
  useState,
} from "react";

import { getDoctors } from "../../api/doctor";

import Loader from "../Loader";

const DoctorSelector = ({ onSelect }) => {

  const [doctors, setDoctors] = useState([]);

  const [loading, setLoading] = useState(false);

  // 🔥 FETCH DOCTORS
  useEffect(() => {

    const loadDoctors = async () => {

      try {

        setLoading(true);

        const doctorsArray =
          await getDoctors();

        setDoctors(doctorsArray || []);

      } catch (err) {

        console.error(
          "FETCH DOCTORS ERROR:",
          err
        );

        setDoctors([]);

      } finally {

        setLoading(false);
      }
    };

    loadDoctors();

  }, []);

  // 🔥 LOADING STATE
  if (loading) {

    return (
      <Loader text="Loading doctors..." />
    );
  }

  // 🔥 EMPTY STATE
  if (!loading && doctors.length === 0) {

    return (
      <Loader text="No doctors available" />
    );
  }

  return (
    <div>

      <h2 className="font-semibold mb-2">
        Select Doctor
      </h2>

      <div className="grid grid-cols-2 gap-4">

        {doctors.map((doc) => (

          <div
            key={doc.id}
            className="
              p-4 border rounded
              cursor-pointer
              hover:shadow transition
            "
            onClick={() => onSelect(doc)}
          >

            <h3 className="font-bold">
              {doc.name}
            </h3>

            <p>
              {doc.specialization}
            </p>

          </div>
        ))}

      </div>

    </div>
  );
};

export default DoctorSelector;
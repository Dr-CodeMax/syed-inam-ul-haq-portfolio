// import { useNavigate } from "react-router-dom";

// export default function Dashboard() {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen bg-gray-100 p-6 flex flex-col gap-4">

//       <h1 className="text-2xl font-bold">Dashboard</h1>

//       <button
//         onClick={() => navigate("/doctors")}
//         className="bg-blue-600 text-white p-3 rounded"
//       >
//         Find Doctors
//       </button>

//       <button
//         onClick={() => navigate("/appointments")}
//         className="bg-green-600 text-white p-3 rounded"
//       >
//         My Appointments
//       </button>

//       <button
//         onClick={() => {
//           localStorage.removeItem("token");
//           navigate("/login");
//         }}
//         className="bg-red-500 text-white p-3 rounded"
//       >
//         Logout
//       </button>
//     </div>
//   );
// }
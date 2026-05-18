// import {
//   useEffect,
//   useMemo,
//   useState,
//   useCallback,
// } from "react";

// import {
//   useNavigate,
//   useSearchParams,
// } from "react-router-dom";

// import {
//   Search,
//   MapPin,
//   BriefcaseMedical,
//   IndianRupee,
//   Star,
//   ShieldCheck,
//   CalendarDays,
//   Clock3,
//   Activity,
//   Stethoscope,
//   Building2,
//   Ambulance,
//   Wifi,
//   Sparkles,
//   CheckCircle2,
//   ArrowRight,
//   CalendarClock,
//   TimerReset,
//   AlertTriangle,
//   Users,
//   FileText,
// } from "lucide-react";

// import Calendar from "react-calendar";

// import "react-calendar/dist/Calendar.css";

// import toast from "react-hot-toast";

// import {
//   motion,
// } from "framer-motion";

// import {
//   ResponsiveContainer,
//   AreaChart,
//   Area,
//   CartesianGrid,
//   Tooltip,
//   XAxis,
//   YAxis,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";

// import {
//   getDoctors,
//   getDoctorById,
// } from "../../api/doctor";

// import {
//   createAppointment,
//   getAvailableSlots,
// } from "../../api/appointment";

// import Loader from "../../components/Loader";

// import {
//   formatDateLocal,
// } from "../../utils/date";


// // ======================================================
// // COMPONENT
// // ======================================================

// const PatientDoctorsBooking = () => {

//   const navigate =
//     useNavigate();

//   const [searchParams,
//     setSearchParams] =
//     useSearchParams();

//   // ======================================================
//   // FILTERS
//   // ======================================================

//   const initialFilters =
//     useMemo(() => ({

//       search:
//         searchParams.get(
//           "search"
//         ) || "",

//       city:
//         searchParams.get(
//           "city"
//         ) || "",

//       specialization:
//         searchParams.get(
//           "specialization"
//         ) || "",

//     }), [searchParams]);


//   // ======================================================
//   // STATES
//   // ======================================================

//   const [filters, setFilters] =
//     useState(initialFilters);

//   const [doctors, setDoctors] =
//     useState([]);

//   const [loading, setLoading] =
//     useState(false);

//   const [
//     selectedDoctor,
//     setSelectedDoctor,
//   ] = useState(null);

//   const [
//     selectedDate,
//     setSelectedDate,
//   ] = useState(new Date());

//   const [
//     selectedSlot,
//     setSelectedSlot,
//   ] = useState(null);

//   const [slots, setSlots] =
//     useState([]);

//   const [
//     slotsLoading,
//     setSlotsLoading,
//   ] = useState(false);

//   const [symptoms,
//     setSymptoms] =
//     useState("");

//   const [
//     bookingLoading,
//     setBookingLoading,
//   ] = useState(false);


//   // ======================================================
//   // URL SYNC
//   // ======================================================

//   useEffect(() => {

//     const params =
//       new URLSearchParams();

//     Object.entries(filters)
//       .forEach(([key, value]) => {

//         if (value) {

//           params.set(
//             key,
//             value
//           );
//         }
//       });

//     setSearchParams(
//       params,
//       {
//         replace: true,
//       }
//     );

//   }, [filters]);


//   // ======================================================
//   // FETCH DOCTORS
//   // ======================================================

//   useEffect(() => {

//     const fetchDoctors =
//       async () => {

//         try {

//           setLoading(true);

//           const payload = {

//             ...(filters.search && {
//               search:
//                 filters.search,
//             }),

//             ...(filters.city && {
//               city:
//                 filters.city,
//             }),

//             ...(filters.specialization && {
//               specialization:
//                 filters.specialization,
//             }),
//           };

//           const response =
//             await getDoctors(
//               payload
//             );

//           setDoctors(
//             response || []
//           );

//         } catch (err) {

//           console.error(err);

//           setDoctors([]);

//         } finally {

//           setLoading(false);
//         }
//       };

//     fetchDoctors();

//   }, [filters]);


//   // ======================================================
//   // FETCH COMPLETE DOCTOR
//   // ======================================================

//   const handleDoctorSelect =
//     async (doctor) => {

//       try {

//         setLoading(true);

//         const fullDoctor =
//           await getDoctorById(
//             doctor.id
//           );

//         setSelectedDoctor(
//           fullDoctor
//         );

//         setSelectedSlot(null);

//       } catch (err) {

//         console.error(err);

//         toast.error(
//           "Failed to load doctor profile"
//         );

//       } finally {

//         setLoading(false);
//       }
//     };


//   // ======================================================
//   // FETCH SLOTS
//   // ======================================================

//   const fetchSlots =
//     useCallback(async () => {

//       if (
//         !selectedDoctor?.id ||
//         !selectedDate
//       ) {

//         return;
//       }

//       try {

//         setSlotsLoading(true);

//         const formattedDate =
//           formatDateLocal(
//             selectedDate
//           );

//         const response =
//           await getAvailableSlots(
//             selectedDoctor.id,
//             formattedDate
//           );

//         const rawSlots =

//           response?.slots ||

//           response?.data?.slots ||

//           [];

//         const formatted =
//           rawSlots.map(
//             (slot) => ({

//               ...slot,

//               start_time:
//                 slot.start_time ||
//                 slot.time,
//             })
//           );

//         setSlots(
//           formatted
//         );

//       } catch (err) {

//         console.error(err);

//         setSlots([]);

//       } finally {

//         setSlotsLoading(false);
//       }

//     }, [
//       selectedDoctor,
//       selectedDate,
//     ]);


//   // ======================================================
//   // LOAD SLOTS
//   // ======================================================

//   useEffect(() => {

//     fetchSlots();

//   }, [fetchSlots]);


//   // ======================================================
//   // ANALYTICS
//   // ======================================================

//   const analytics = [

//     {
//       name: "Doctors",
//       value:
//         doctors.length,
//     },

//     {
//       name: "Available",
//       value:
//         slots.length,
//     },

//     {
//       name: "Booked",
//       value:
//         Math.max(
//           0,
//           20 - slots.length
//         ),
//     },
//   ];


//   // ======================================================
//   // BOOKING
//   // ======================================================

//   const handleBooking =
//     async () => {

//       if (
//         !selectedDoctor ||
//         !selectedDate ||
//         !selectedSlot
//       ) {

//         toast.error(
//           "Please complete booking details"
//         );

//         return;
//       }

//       try {

//         setBookingLoading(
//           true
//         );

//         const payload = {

//           doctor_id:
//             selectedDoctor.id,

//           date:
//             formatDateLocal(
//               selectedDate
//             ),

//           time:
//             selectedSlot.start_time,

//           symptoms:
//             symptoms.trim() ||
//             "General Checkup",

//           priority:
//             "NORMAL",
//         };

//         await createAppointment(
//           payload
//         );

//         toast.success(
//           "Appointment booked successfully 🎉"
//         );

//         navigate(
//           "/patient/booking-success",
//           {
//             state: {

//               doctorName:
//                 selectedDoctor.name,

//               date:
//                 formatDateLocal(
//                   selectedDate
//                 ),

//               time:
//                 selectedSlot.start_time,
//             },
//           }
//         );

//       } catch (err) {

//         console.error(err);

//         toast.error(
//           err?.response?.data
//             ?.detail ||
//           "Booking failed"
//         );

//       } finally {

//         setBookingLoading(
//           false
//         );
//       }
//     };


//   // ======================================================
//   // AVAILABILITY
//   // ======================================================

//   const availabilityConfig = {

//     AVAILABLE: {
//       label:
//         "Available Today",

//       badgeClass:
//         "bg-green-100 text-green-700",
//     },

//     LIMITED: {
//       label:
//         "Few Slots Left",

//       badgeClass:
//         "bg-yellow-100 text-yellow-700",
//     },

//     FULL: {
//       label:
//         "Fully Booked",

//       badgeClass:
//         "bg-red-100 text-red-700",
//     },
//   };


//   // ======================================================
//   // LOADING
//   // ======================================================

//   if (loading) {

//     return (
//       <Loader text="Loading healthcare workspace..." />
//     );
//   }


//   return (

//     <div className="space-y-10">

//       {/* ================================================= */}
//       {/* HERO */}
//       {/* ================================================= */}

//       <motion.div

//         initial={{
//           opacity: 0,
//           y: 20,
//         }}

//         animate={{
//           opacity: 1,
//           y: 0,
//         }}

//         className="
//           relative
//           overflow-hidden
//           rounded-[2.5rem]
//           bg-gradient-to-r
//           from-primary
//           via-primary
//           to-secondary
//           p-8
//           md:p-10
//           text-white
//         "
//       >

//         <div
//           className="
//             absolute
//             top-0
//             right-0
//             h-80
//             w-80
//             rounded-full
//             bg-white/10
//             blur-3xl
//           "
//         />

//         <div className="relative z-10">

//           <div
//             className="
//               mb-6
//               inline-flex
//               items-center
//               gap-2
//               rounded-full
//               bg-white/10
//               backdrop-blur-md
//               px-4
//               py-2
//               text-sm
//               font-medium
//             "
//           >

//             <Sparkles size={16} />

//             Smart Healthcare Booking

//           </div>

//           <div
//             className="
//               flex
//               flex-col
//               lg:flex-row
//               items-start
//               lg:items-center
//               justify-between
//               gap-8
//             "
//           >

//             <div>

//               <h1
//                 className="
//                   text-4xl
//                   md:text-5xl
//                   font-black
//                 "
//               >

//                 Find &
//                 <br />

//                 Book Doctors

//               </h1>

//               <p
//                 className="
//                   mt-5
//                   max-w-2xl
//                   text-lg
//                   text-white/90
//                 "
//               >

//                 Browse verified doctors,
//                 real-time slot availability,
//                 healthcare analytics,
//                 and enterprise appointment booking.

//               </p>

//             </div>

//             <div
//               className="
//                 rounded-3xl
//                 border
//                 border-white/20
//                 bg-white/10
//                 backdrop-blur-xl
//                 p-6
//               "
//             >

//               <div
//                 className="
//                   flex
//                   items-center
//                   gap-4
//                 "
//               >

//                 <div
//                   className="
//                     flex
//                     h-14
//                     w-14
//                     items-center
//                     justify-center
//                     rounded-2xl
//                     bg-white/20
//                   "
//                 >

//                   <Activity size={28} />

//                 </div>

//                 <div>

//                   <p
//                     className="
//                       text-sm
//                       text-white/70
//                     "
//                   >

//                     Live Booking Engine

//                   </p>

//                   <h3
//                     className="
//                       text-xl
//                       font-bold
//                     "
//                   >

//                     Active & Secure

//                   </h3>

//                 </div>

//               </div>

//             </div>

//           </div>

//         </div>

//       </motion.div>


//       {/* ================================================= */}
//       {/* ANALYTICS */}
//       {/* ================================================= */}

//       <div
//         className="
//           grid
//           grid-cols-1
//           xl:grid-cols-3
//           gap-6
//         "
//       >

//         <motion.div
//           whileHover={{
//             y: -4,
//           }}
//           className="
//             rounded-[2rem]
//             border
//             border-slate-200
//             bg-white
//             p-6
//             shadow-sm
//           "
//         >

//           <h3
//             className="
//               text-xl
//               font-bold
//               text-slate-900
//               mb-5
//             "
//           >

//             Healthcare Analytics

//           </h3>

//           <div className="h-[300px]">

//             <ResponsiveContainer
//               width="100%"
//               height="100%"
//             >

//               <AreaChart
//                 data={analytics}
//               >

//                 <CartesianGrid
//                   strokeDasharray="3 3"
//                 />

//                 <XAxis
//                   dataKey="name"
//                 />

//                 <YAxis />

//                 <Tooltip />

//                 <Area
//                   type="monotone"
//                   dataKey="value"
//                   stroke="#3B82F6"
//                   fill="#93C5FD"
//                 />

//               </AreaChart>

//             </ResponsiveContainer>

//           </div>

//         </motion.div>


//         <motion.div
//           whileHover={{
//             y: -4,
//           }}
//           className="
//             rounded-[2rem]
//             border
//             border-slate-200
//             bg-white
//             p-6
//             shadow-sm
//           "
//         >

//           <h3
//             className="
//               text-xl
//               font-bold
//               text-slate-900
//               mb-5
//             "
//           >

//             Booking Distribution

//           </h3>

//           <div className="h-[300px]">

//             <ResponsiveContainer
//               width="100%"
//               height="100%"
//             >

//               <PieChart>

//                 <Pie
//                   data={analytics}
//                   dataKey="value"
//                   outerRadius={100}
//                   label
//                 >

//                   <Cell fill="#10B981" />
//                   <Cell fill="#3B82F6" />
//                   <Cell fill="#F59E0B" />

//                 </Pie>

//                 <Tooltip />

//               </PieChart>

//             </ResponsiveContainer>

//           </div>

//         </motion.div>


//         <motion.div
//           whileHover={{
//             y: -4,
//           }}
//           className="
//             rounded-[2rem]
//             border
//             border-slate-200
//             bg-white
//             p-6
//             shadow-sm
//           "
//         >

//           <div
//             className="
//               flex
//               items-center
//               justify-between
//               mb-8
//             "
//           >

//             <div>

//               <h3
//                 className="
//                   text-xl
//                   font-bold
//                 "
//               >

//                 Live Statistics

//               </h3>

//               <p
//                 className="
//                   text-sm
//                   text-slate-500
//                   mt-1
//                 "
//               >

//                 Enterprise healthcare insights

//               </p>

//             </div>

//             <div
//               className="
//                 w-14
//                 h-14
//                 rounded-2xl
//                 bg-primary/10
//                 text-primary
//                 flex
//                 items-center
//                 justify-center
//               "
//             >

//               <Users size={24} />

//             </div>

//           </div>

//           <div className="space-y-5">

//             {[
//               {
//                 title:
//                   "Verified Doctors",
//                 value:
//                   doctors.length,
//                 icon:
//                   ShieldCheck,
//                 bg:
//                   "bg-green-100",
//                 color:
//                   "text-green-700",
//               },

//               {
//                 title:
//                   "Available Slots",
//                 value:
//                   slots.length,
//                 icon:
//                   CalendarClock,
//                 bg:
//                   "bg-blue-100",
//                 color:
//                   "text-blue-700",
//               },

//               {
//                 title:
//                   "Secure Booking",
//                 value:
//                   "100%",
//                 icon:
//                   CheckCircle2,
//                 bg:
//                   "bg-primary/10",
//                 color:
//                   "text-primary",
//               },

//             ].map((item) => {

//               const Icon =
//                 item.icon;

//               return (

//                 <div
//                   key={item.title}
//                   className="
//                     flex
//                     items-center
//                     justify-between
//                     bg-muted
//                     rounded-2xl
//                     p-5
//                   "
//                 >

//                   <div
//                     className="
//                       flex
//                       items-center
//                       gap-4
//                     "
//                   >

//                     <div
//                       className={`
//                         w-12
//                         h-12
//                         rounded-2xl
//                         flex
//                         items-center
//                         justify-center
//                         ${item.bg}
//                         ${item.color}
//                       `}
//                     >

//                       <Icon size={20} />

//                     </div>

//                     <div>

//                       <h4
//                         className="
//                           font-semibold
//                         "
//                       >

//                         {item.title}

//                       </h4>

//                     </div>

//                   </div>

//                   <div
//                     className="
//                       text-2xl
//                       font-black
//                     "
//                   >

//                     {item.value}

//                   </div>

//                 </div>
//               );
//             })}

//           </div>

//         </motion.div>

//       </div>


//       {/* ================================================= */}
//       {/* SEARCH */}
//       {/* ================================================= */}

//       <div
//         className="
//           bg-white
//           rounded-[2rem]
//           border border-borderColor
//           shadow-soft
//           p-6
//         "
//       >

//         <div
//           className="
//             flex
//             flex-col
//             md:flex-row
//             gap-5
//           "
//         >

//           <div className="flex-1">

//             <div className="relative">

//               <Search
//                 size={20}
//                 className="
//                   absolute
//                   left-4
//                   top-1/2
//                   -translate-y-1/2
//                   text-slate-400
//                 "
//               />

//               <input
//                 type="text"
//                 placeholder="
// Search doctors, specialists...
//                 "
//                 value={filters.search}
//                 onChange={(e) =>
//                   setFilters({
//                     ...filters,
//                     search:
//                       e.target.value,
//                   })
//                 }
//                 className="
//                   w-full
//                   h-14
//                   rounded-2xl
//                   border border-borderColor
//                   pl-12
//                   pr-4
//                   focus:outline-none
//                   focus:ring-4
//                   focus:ring-primary/10
//                 "
//               />

//             </div>

//           </div>

//           <input
//             type="text"
//             placeholder="City"
//             value={filters.city}
//             onChange={(e) =>
//               setFilters({
//                 ...filters,
//                 city:
//                   e.target.value,
//               })
//             }
//             className="
//               h-14
//               rounded-2xl
//               border border-borderColor
//               px-5
//               focus:outline-none
//               focus:ring-4
//               focus:ring-primary/10
//             "
//           />

//           <input
//             type="text"
//             placeholder="Specialization"
//             value={
//               filters.specialization
//             }
//             onChange={(e) =>
//               setFilters({
//                 ...filters,
//                 specialization:
//                   e.target.value,
//               })
//             }
//             className="
//               h-14
//               rounded-2xl
//               border border-borderColor
//               px-5
//               focus:outline-none
//               focus:ring-4
//               focus:ring-primary/10
//             "
//           />

//         </div>

//       </div>


//       {/* ================================================= */}
//       {/* MAIN GRID */}
//       {/* ================================================= */}

//       <div
//         className="
//           grid
//           grid-cols-1
//           xl:grid-cols-12
//           gap-8
//         "
//       >

//         {/* ================================================= */}
//         {/* DOCTORS */}
//         {/* ================================================= */}

//         <div className="xl:col-span-5">

//           <div
//             className="
//               bg-white
//               rounded-[2rem]
//               border border-borderColor
//               shadow-soft
//               p-6
//             "
//           >

//             <div
//               className="
//                 flex
//                 items-center
//                 justify-between
//                 mb-8
//               "
//             >

//               <div>

//                 <h2
//                   className="
//                     text-2xl
//                     font-black
//                   "
//                 >

//                   Available Doctors

//                 </h2>

//                 <p
//                   className="
//                     text-slate-500
//                     mt-1
//                   "
//                 >

//                   Verified healthcare specialists

//                 </p>

//               </div>

//               <div
//                 className="
//                   bg-primary/10
//                   text-primary
//                   px-4
//                   py-2
//                   rounded-2xl
//                   font-semibold
//                 "
//               >

//                 {doctors.length}
//                 {" "}
//                 Doctors

//               </div>

//             </div>

//             <div className="space-y-5">

//               {doctors.map((doctor) => {

//                 const availability =
//                   availabilityConfig[
//                     doctor.availability_status
//                   ] ||
//                   availabilityConfig.AVAILABLE;

//                 return (

//                   <motion.div

//                     key={doctor.id}

//                     whileHover={{
//                       y: -4,
//                     }}

//                     onClick={() =>
//                       handleDoctorSelect(
//                         doctor
//                       )
//                     }

//                     className={`
//                       rounded-[2rem]
//                       border
//                       cursor-pointer
//                       transition-all
//                       duration-300
//                       overflow-hidden

//                       ${
//                         selectedDoctor?.id ===
//                         doctor.id

//                           ? `
//                             border-primary
//                             shadow-xl
//                           `

//                           : `
//                             border-borderColor
//                             hover:border-primary/40
//                           `
//                       }
//                     `}
//                   >

//                     <div className="p-6">

//                       <div
//                         className="
//                           flex
//                           gap-5
//                         "
//                       >

//                         <div
//                           className="
//                             w-20
//                             h-20
//                             rounded-[1.5rem]
//                             bg-gradient-to-br
//                             from-primary/10
//                             to-secondary/10
//                             flex
//                             items-center
//                             justify-center
//                             text-3xl
//                             font-black
//                             text-primary
//                             shrink-0
//                           "
//                         >

//                           {
//                             doctor.name?.charAt(0)
//                           }

//                         </div>

//                         <div className="flex-1">

//                           <div
//                             className="
//                               flex
//                               items-start
//                               justify-between
//                               gap-3
//                             "
//                           >

//                             <div>

//                               <h3
//                                 className="
//                                   text-xl
//                                   font-bold
//                                 "
//                               >

//                                 {doctor.name}

//                               </h3>

//                               <p
//                                 className="
//                                   text-primary
//                                   font-semibold
//                                   mt-1
//                                 "
//                               >

//                                 {
//                                   doctor.specialization
//                                 }

//                               </p>

//                             </div>

//                             <div
//                               className={`
//                                 px-3
//                                 py-2
//                                 rounded-2xl
//                                 text-xs
//                                 font-semibold
//                                 ${availability.badgeClass}
//                               `}
//                             >

//                               {
//                                 availability.label
//                               }

//                             </div>

//                           </div>

//                           <div
//                             className="
//                               mt-5
//                               grid
//                               grid-cols-2
//                               gap-4
//                               text-sm
//                               text-slate-600
//                             "
//                           >

//                             <div
//                               className="
//                                 flex
//                                 items-center
//                                 gap-2
//                               "
//                             >

//                               <MapPin size={16} />

//                               {doctor.city}

//                             </div>

//                             <div
//                               className="
//                                 flex
//                                 items-center
//                                 gap-2
//                               "
//                             >

//                               <BriefcaseMedical
//                                 size={16}
//                               />

//                               {
//                                 doctor.experience
//                               }
//                               {" "}
//                               yrs

//                             </div>

//                             <div
//                               className="
//                                 flex
//                                 items-center
//                                 gap-2
//                               "
//                             >

//                               <IndianRupee
//                                 size={16}
//                               />

//                               ₹
//                               {
//                                 doctor.consultation_fee
//                               }

//                             </div>

//                             <div
//                               className="
//                                 flex
//                                 items-center
//                                 gap-2
//                               "
//                             >

//                               <Star
//                                 size={16}
//                                 fill="currentColor"
//                               />

//                               4.9 Rating

//                             </div>

//                           </div>

//                         </div>

//                       </div>

//                     </div>

//                   </motion.div>
//                 );
//               })}

//             </div>

//           </div>

//         </div>


//         {/* ================================================= */}
//         {/* RIGHT */}
//         {/* ================================================= */}

//         <div className="xl:col-span-7 space-y-8">

//           {/* ================================================= */}
//           {/* DOCTOR PROFILE */}
//           {/* ================================================= */}

//           {selectedDoctor && (

//             <motion.div

//               initial={{
//                 opacity: 0,
//                 y: 20,
//               }}

//               animate={{
//                 opacity: 1,
//                 y: 0,
//               }}

//               className="
//                 bg-white
//                 rounded-[2rem]
//                 border border-borderColor
//                 shadow-soft
//                 overflow-hidden
//               "
//             >

//               <div
//                 className="
//                   bg-gradient-to-r
//                   from-primary
//                   to-secondary
//                   p-8
//                   text-white
//                 "
//               >

//                 <div
//                   className="
//                     flex
//                     flex-col
//                     lg:flex-row
//                     gap-8
//                   "
//                 >

//                   <div
//                     className="
//                       w-32
//                       h-32
//                       rounded-[2rem]
//                       bg-white/10
//                       flex
//                       items-center
//                       justify-center
//                       text-5xl
//                       font-black
//                       shrink-0
//                     "
//                   >

//                     {
//                       selectedDoctor.name?.charAt(0)
//                     }

//                   </div>

//                   <div className="flex-1">

//                     <div
//                       className="
//                         flex
//                         flex-wrap
//                         items-center
//                         gap-3
//                       "
//                     >

//                       <h1
//                         className="
//                           text-4xl
//                           font-black
//                         "
//                       >

//                         {
//                           selectedDoctor.name
//                         }

//                       </h1>

//                       <div
//                         className="
//                           bg-white/10
//                           px-4
//                           py-2
//                           rounded-full
//                           text-sm
//                           font-semibold
//                           flex
//                           items-center
//                           gap-2
//                         "
//                       >

//                         <ShieldCheck
//                           size={16}
//                         />

//                         Verified

//                       </div>

//                     </div>

//                     <p
//                       className="
//                         mt-4
//                         text-xl
//                         font-semibold
//                         text-white/90
//                       "
//                     >

//                       {
//                         selectedDoctor.specialization
//                       }

//                     </p>

//                     <div
//                       className="
//                         mt-6
//                         grid
//                         grid-cols-2
//                         gap-5
//                         text-white/90
//                       "
//                     >

//                       <div
//                         className="
//                           flex
//                           items-center
//                           gap-2
//                         "
//                       >

//                         <MapPin size={18} />

//                         {
//                           selectedDoctor.city
//                         }

//                       </div>

//                       <div
//                         className="
//                           flex
//                           items-center
//                           gap-2
//                         "
//                       >

//                         <BriefcaseMedical
//                           size={18}
//                         />

//                         {
//                           selectedDoctor.experience
//                         }
//                         {" "}
//                         Years

//                       </div>

//                       <div
//                         className="
//                           flex
//                           items-center
//                           gap-2
//                         "
//                       >

//                         <IndianRupee
//                           size={18}
//                         />

//                         ₹
//                         {
//                           selectedDoctor.consultation_fee
//                         }

//                       </div>

//                       <div
//                         className="
//                           flex
//                           items-center
//                           gap-2
//                         "
//                       >

//                         <Building2
//                           size={18}
//                         />

//                         {
//                           selectedDoctor.hospital_name
//                           || "Independent Practice"
//                         }

//                       </div>

//                     </div>

//                     <div
//                       className="
//                         mt-6
//                         flex
//                         flex-wrap
//                         gap-3
//                       "
//                     >

//                       <div
//                         className="
//                           bg-green-100
//                           text-green-700
//                           px-4
//                           py-3
//                           rounded-2xl
//                           font-semibold
//                           text-sm
//                           flex
//                           items-center
//                           gap-2
//                         "
//                       >

//                         <Star
//                           size={16}
//                           fill="currentColor"
//                         />

//                         4.9 Rating

//                       </div>

//                       {selectedDoctor.is_online && (

//                         <div
//                           className="
//                             bg-blue-100
//                             text-blue-700
//                             px-4
//                             py-3
//                             rounded-2xl
//                             font-semibold
//                             text-sm
//                             flex
//                             items-center
//                             gap-2
//                           "
//                         >

//                           <Wifi size={16} />

//                           Online Consultation

//                         </div>
//                       )}

//                       {selectedDoctor.accepts_emergency && (

//                         <div
//                           className="
//                             bg-red-100
//                             text-red-700
//                             px-4
//                             py-3
//                             rounded-2xl
//                             font-semibold
//                             text-sm
//                             flex
//                             items-center
//                             gap-2
//                           "
//                         >

//                           <Ambulance
//                             size={16}
//                           />

//                           Emergency Support

//                         </div>
//                       )}

//                     </div>

//                   </div>

//                 </div>

//               </div>

//             </motion.div>
//           )}


//           {/* ================================================= */}
//           {/* DATE SELECTOR */}
//           {/* ================================================= */}

//           {selectedDoctor && (

//             <div
//               className="
//                 bg-white
//                 rounded-[2rem]
//                 border border-borderColor
//                 shadow-soft
//                 overflow-hidden
//               "
//             >

//               <div
//                 className="
//                   px-6
//                   py-5
//                   border-b border-borderColor
//                   flex
//                   items-center
//                   justify-between
//                 "
//               >

//                 <div
//                   className="
//                     flex
//                     items-center
//                     gap-4
//                   "
//                 >

//                   <div
//                     className="
//                       w-14
//                       h-14
//                       rounded-2xl
//                       bg-primary/10
//                       text-primary
//                       flex
//                       items-center
//                       justify-center
//                     "
//                   >

//                     <CalendarDays
//                       size={24}
//                     />

//                   </div>

//                   <div>

//                     <h2
//                       className="
//                         text-xl
//                         font-bold
//                       "
//                     >

//                       Select Appointment Date

//                     </h2>

//                     <p
//                       className="
//                         text-sm
//                         text-slate-500
//                         mt-1
//                       "
//                     >

//                       Enterprise healthcare scheduling

//                     </p>

//                   </div>

//                 </div>

//                 <div
//                   className="
//                     bg-blue-100
//                     text-blue-700
//                     px-4
//                     py-2
//                     rounded-2xl
//                     text-sm
//                     font-semibold
//                     flex
//                     items-center
//                     gap-2
//                   "
//                 >

//                   <Activity size={16} />

//                   Real-Time

//                 </div>

//               </div>

//               <div className="p-6">

//                 <div
//                   className="
//                     rounded-[2rem]
//                     overflow-hidden
//                     border border-borderColor
//                     p-4
//                     bg-muted/20
//                   "
//                 >

//                   <Calendar
//                     onChange={
//                       setSelectedDate
//                     }
//                     value={
//                       selectedDate
//                     }
//                     minDate={
//                       new Date()
//                     }
//                     className="
//                       modern-calendar
//                       border-none
//                       w-full
//                     "
//                   />

//                 </div>

//               </div>

//             </div>
//           )}


//           {/* ================================================= */}
//           {/* SLOT SELECTOR */}
//           {/* ================================================= */}

//           {
//             selectedDoctor &&
//             selectedDate && (

//               <div
//                 className="
//                   bg-white
//                   rounded-[2rem]
//                   border border-borderColor
//                   shadow-soft
//                   overflow-hidden
//                 "
//               >

//                 <div
//                   className="
//                     px-6
//                     py-5
//                     border-b border-borderColor
//                     flex
//                     items-center
//                     justify-between
//                     flex-wrap
//                     gap-4
//                   "
//                 >

//                   <div
//                     className="
//                       flex
//                       items-center
//                       gap-4
//                     "
//                   >

//                     <div
//                       className="
//                         w-14
//                         h-14
//                         rounded-2xl
//                         bg-primary/10
//                         text-primary
//                         flex
//                         items-center
//                         justify-center
//                       "
//                     >

//                       <CalendarClock
//                         size={24}
//                       />

//                     </div>

//                     <div>

//                       <h2
//                         className="
//                           text-xl
//                           font-bold
//                         "
//                       >

//                         Live Available Slots

//                       </h2>

//                       <p
//                         className="
//                           text-sm
//                           text-slate-500
//                           mt-1
//                         "
//                       >

//                         Real-time booking engine

//                       </p>

//                     </div>

//                   </div>

//                   <div
//                     className="
//                       flex
//                       gap-3
//                     "
//                   >

//                     <div
//                       className="
//                         bg-green-100
//                         text-green-700
//                         px-4
//                         py-2
//                         rounded-2xl
//                         text-sm
//                         font-semibold
//                         flex
//                         items-center
//                         gap-2
//                       "
//                     >

//                       <TimerReset
//                         size={16}
//                       />

//                       Live Refresh

//                     </div>

//                     <div
//                       className="
//                         bg-primary/10
//                         text-primary
//                         px-4
//                         py-2
//                         rounded-2xl
//                         text-sm
//                         font-semibold
//                       "
//                     >

//                       {slots.length}
//                       {" "}
//                       Slots

//                     </div>

//                   </div>

//                 </div>

//                 <div className="p-6">

//                   {
//                     slotsLoading && (
//                       <Loader text="Loading slots..." />
//                     )
//                   }

//                   {
//                     !slotsLoading &&
//                     slots.length === 0 && (

//                       <div
//                         className="
//                           text-center
//                           py-14
//                         "
//                       >

//                         <div
//                           className="
//                             w-20
//                             h-20
//                             mx-auto
//                             rounded-full
//                             bg-red-100
//                             text-red-600
//                             flex
//                             items-center
//                             justify-center
//                             mb-5
//                           "
//                         >

//                           <AlertTriangle
//                             size={34}
//                           />

//                         </div>

//                         <h3
//                           className="
//                             text-2xl
//                             font-bold
//                           "
//                         >

//                           No Slots Available

//                         </h3>

//                       </div>
//                     )
//                   }

//                   {
//                     !slotsLoading &&
//                     slots.length > 0 && (

//                       <div
//                         className="
//                           grid
//                           grid-cols-2
//                           md:grid-cols-3
//                           xl:grid-cols-4
//                           gap-4
//                         "
//                       >

//                         {slots.map((slot,
//                           index) => {

//                           const active =
//                             selectedSlot?.start_time ===
//                             slot.start_time;

//                           return (

//                             <motion.button

//                               key={index}

//                               whileHover={{
//                                 y: -2,
//                               }}

//                               onClick={() =>
//                                 setSelectedSlot(
//                                   slot
//                                 )
//                               }

//                               className={`
//                                 rounded-2xl
//                                 border
//                                 p-5
//                                 text-left
//                                 transition-all

//                                 ${
//                                   active

//                                     ? `
//                                       border-primary
//                                       bg-primary
//                                       text-white
//                                       shadow-xl
//                                     `

//                                     : `
//                                       border-borderColor
//                                       hover:border-primary/50
//                                       bg-white
//                                     `
//                                 }
//                               `}
//                             >

//                               <div
//                                 className="
//                                   flex
//                                   items-center
//                                   justify-between
//                                   mb-3
//                                 "
//                               >

//                                 <Clock3
//                                   size={20}
//                                 />

//                                 {
//                                   active && (
//                                     <CheckCircle2
//                                       size={20}
//                                     />
//                                   )
//                                 }

//                               </div>

//                               <h3
//                                 className="
//                                   text-lg
//                                   font-bold
//                                 "
//                               >

//                                 {
//                                   slot.start_time
//                                 }

//                               </h3>

//                               <p
//                                 className="
//                                   text-sm
//                                   mt-2
//                                   opacity-80
//                                 "
//                               >

//                                 {
//                                   slot.remaining_capacity || 1
//                                 }
//                                 {" "}
//                                 Slots Left

//                               </p>

//                             </motion.button>
//                           );
//                         })}

//                       </div>
//                     )
//                   }

//                 </div>

//               </div>
//             )
//           }


//           {/* ================================================= */}
//           {/* BOOKING FORM */}
//           {/* ================================================= */}

//           {
//             selectedDoctor &&
//             selectedSlot && (

//               <div
//                 className="
//                   bg-white
//                   rounded-[2rem]
//                   border border-borderColor
//                   shadow-soft
//                   overflow-hidden
//                 "
//               >

//                 <div
//                   className="
//                     bg-gradient-to-r
//                     from-primary
//                     to-secondary
//                     p-6
//                     text-white
//                   "
//                 >

//                   <div
//                     className="
//                       flex
//                       items-center
//                       gap-4
//                     "
//                   >

//                     <div
//                       className="
//                         w-14
//                         h-14
//                         rounded-2xl
//                         bg-white/10
//                         flex
//                         items-center
//                         justify-center
//                       "
//                     >

//                       <FileText
//                         size={24}
//                       />

//                     </div>

//                     <div>

//                       <h2
//                         className="
//                           text-2xl
//                           font-bold
//                         "
//                       >

//                         Patient Notes

//                       </h2>

//                       <p className="text-white/80">

//                         Share medical concerns

//                       </p>

//                     </div>

//                   </div>

//                 </div>

//                 <div className="p-6">

//                   <textarea
//                     value={symptoms}
//                     onChange={(e) =>
//                       setSymptoms(
//                         e.target.value
//                       )
//                     }
//                     placeholder="
// Describe symptoms, allergies,
// medical history or concerns...
//                     "
//                     className="
//                       w-full
//                       min-h-[220px]
//                       rounded-[1.5rem]
//                       border border-borderColor
//                       bg-muted
//                       p-5
//                       resize-none
//                       focus:ring-4
//                       focus:ring-primary/10
//                       focus:border-primary
//                       transition-all
//                     "
//                   />

//                 </div>

//               </div>
//             )
//           }


//           {/* ================================================= */}
//           {/* SUMMARY */}
//           {/* ================================================= */}

//           {
//             selectedDoctor &&
//             selectedDate &&
//             selectedSlot && (

//               <div
//                 className="
//                   bg-white
//                   rounded-[2rem]
//                   border border-borderColor
//                   shadow-soft
//                   overflow-hidden
//                 "
//               >

//                 <div
//                   className="
//                     bg-gradient-to-r
//                     from-primary
//                     to-secondary
//                     p-6
//                     text-white
//                   "
//                 >

//                   <div
//                     className="
//                       flex
//                       items-center
//                       gap-4
//                     "
//                   >

//                     <div
//                       className="
//                         w-20
//                         h-20
//                         rounded-[2rem]
//                         bg-white/10
//                         flex
//                         items-center
//                         justify-center
//                         text-3xl
//                         font-bold
//                       "
//                     >

//                       {
//                         selectedDoctor.name?.charAt(0)
//                       }

//                     </div>

//                     <div>

//                       <h2
//                         className="
//                           text-2xl
//                           font-bold
//                         "
//                       >

//                         {
//                           selectedDoctor.name
//                         }

//                       </h2>

//                       <p className="text-white/90">

//                         {
//                           selectedDoctor.specialization
//                         }

//                       </p>

//                     </div>

//                   </div>

//                 </div>

//                 <div className="p-6 space-y-5">

//                   <div
//                     className="
//                       flex
//                       items-center
//                       justify-between
//                       bg-muted
//                       rounded-2xl
//                       p-5
//                     "
//                   >

//                     <div
//                       className="
//                         flex
//                         items-center
//                         gap-3
//                       "
//                     >

//                       <CalendarDays
//                         size={18}
//                         className="
//                           text-primary
//                         "
//                       />

//                       <span>

//                         Appointment Date

//                       </span>

//                     </div>

//                     <span className="font-bold">

//                       {
//                         selectedDate.toLocaleDateString(
//                           "en-IN",
//                           {
//                             weekday:
//                               "long",
//                             day:
//                               "numeric",
//                             month:
//                               "long",
//                             year:
//                               "numeric",
//                           }
//                         )
//                       }

//                     </span>

//                   </div>

//                   <div
//                     className="
//                       flex
//                       items-center
//                       justify-between
//                       bg-muted
//                       rounded-2xl
//                       p-5
//                     "
//                   >

//                     <div
//                       className="
//                         flex
//                         items-center
//                         gap-3
//                       "
//                     >

//                       <Clock3
//                         size={18}
//                         className="
//                           text-primary
//                         "
//                       />

//                       <span>

//                         Consultation Time

//                       </span>

//                     </div>

//                     <span className="font-bold">

//                       {
//                         selectedSlot.start_time
//                       }

//                     </span>

//                   </div>

//                   <div
//                     className="
//                       flex
//                       items-center
//                       justify-between
//                       bg-muted
//                       rounded-2xl
//                       p-5
//                     "
//                   >

//                     <div
//                       className="
//                         flex
//                         items-center
//                         gap-3
//                       "
//                     >

//                       <IndianRupee
//                         size={18}
//                         className="
//                           text-primary
//                         "
//                       />

//                       <span>

//                         Consultation Fee

//                       </span>

//                     </div>

//                     <span className="font-bold">

//                       ₹
//                       {
//                         selectedDoctor.consultation_fee
//                       }

//                     </span>

//                   </div>

//                   <button

//                     onClick={
//                       handleBooking
//                     }

//                     disabled={
//                       bookingLoading
//                     }

//                     className="
//                       w-full
//                       h-16
//                       rounded-[1.5rem]
//                       bg-gradient-to-r
//                       from-primary
//                       to-secondary
//                       text-white
//                       font-bold
//                       text-lg
//                       flex
//                       items-center
//                       justify-center
//                       gap-3
//                       hover:scale-[1.01]
//                       transition-all
//                       disabled:opacity-60
//                     "
//                   >

//                     {
//                       bookingLoading

//                         ? "Booking Appointment..."

//                         : (
//                           <>
//                             Confirm Booking

//                             <ArrowRight
//                               size={22}
//                             />
//                           </>
//                         )
//                     }

//                   </button>

//                 </div>

//               </div>
//             )
//           }

//         </div>

//       </div>

//     </div>
//   );
// };

// export default PatientDoctorsBooking;
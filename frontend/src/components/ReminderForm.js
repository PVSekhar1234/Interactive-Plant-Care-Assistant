
// export default ReminderForm;
import { useState, useEffect } from "react";

const ReminderForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
  });
  const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // // Debugging: Log component mount
  // useEffect(() => {
  //   console.log("EventForm component mounted");
  // }, []);

  // // Debugging: Log formData updates
  // useEffect(() => {
  //   console.log("Updated formData:", formData);
  // }, [formData]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Submitted", formData);

    // Ensure all fields are filled
    if (!formData.date || !formData.startTime || !formData.endTime || !formData.title || !formData.description) {
      console.log("Some fields are empty");
      alert("Please fill in all required fields.");
      return;
    }

    try {
      // Step 1: Check if the user is authenticated
      const authCheck = await fetch(`${baseURL}/api/calendar/check-auth`);
      const authStatus = await authCheck.json();
      console.log("Authentication status:", authStatus);

      if (!authStatus.isAuthenticated) {
        console.log("User not authenticated, redirecting to /auth");
        window.location.href = `${baseURL}/api/calendar/auth?${new URLSearchParams(formData).toString()}`;
        return;
      }

      // Step 2: If authenticated, proceed with event creation
      const response = await fetch(`${baseURL}/api/calendar/create-event`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });


      if(!response.ok) {
        throw new Error("Failed to create event!");
      }

      const result = await response.json();
      console.log("Event created successfully:", result);
      alert("Event created successfully!");

    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event.");
    }

    onClose(); // Close the form/modal
  };


  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>

      {/* Form Modal */}
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-black">
          ✖
        </button>

        <h2 className="text-2xl font-bold mb-4">Add Reminder</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Event Title" required className="w-full p-2 border rounded" />
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Event Description" className="w-full p-2 border rounded"></textarea>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full p-2 border rounded" />
          <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required className="w-full p-2 border rounded" />
          <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required className="w-full p-2 border rounded" />
        

          <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
            Add Reminder
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReminderForm;
    // <form onSubmit={handleSubmit}>
    //   <input type="date" name="date" value={formData.date} onChange={handleChange} required />
    //   <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required />
    //   <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required />
    //   <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Event Title" required />
    //   <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Event Description"></textarea>
    //   <button type="submit">Create Event</button>
    // </form>
//   );
// };

// export default EventForm;



// import React, { useState } from 'react';

// function ReminderForm({ isOpen, onClose }) {
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     date: '',
//     startTime: '',
//     endTime: ''
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };
  
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     // TODO: Handle form submission
//     console.log(formData);
//     try {
//         const response = await fetch("/api/calendar/events", { 
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(formData),
//         });
    
//         if (!response.ok) {
//           throw new Error("Failed to create event !!!");
//         }
    
//         const result = await response.json();
//         console.log("Event created successfully:", result);
//         alert("Event created successfully!");
//       } catch (error) {
//         console.error("Error creating event:", error);
//         alert("Failed to create event.");
//       }
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
//       <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6 m-4">
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
//         >
//           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//           </svg>
//         </button>

//         <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Reminder</h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label htmlFor="title" className="block text-sm font-medium text-gray-700">
//               Title
//             </label>
//             <input
//               type="text"
//               id="title"
//               name="title"
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
//               value={formData.title}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div>
//             <label htmlFor="description" className="block text-sm font-medium text-gray-700">
//               Description
//             </label>
//             <textarea
//               id="description"
//               rows="3"
//               name="description"
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
//               value={formData.description}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div>
//             <label htmlFor="date" className="block text-sm font-medium text-gray-700">
//               Date
//             </label>
//             <input
//               type="date"
//               id="date"
//               name="date"
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
//               value={formData.date}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
//                 Start Time
//               </label>
//               <input
//                 type="time"
//                 id="startTime"
//                 name="startTime"
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
//                 value={formData.startTime}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div>
//               <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
//                 End Time
//               </label>
//               <input
//                 type="time"
//                 id="endTime"
//                 name="endTime"
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
//                 value={formData.endTime}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-green-600 text-white rounded-md py-2 px-4 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
//           >
//             Add Reminder
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

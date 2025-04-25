
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
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

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
      const authCheck = await fetch(`${API_BASE_URL}/api/calendar/check-auth`);
      const authStatus = await authCheck.json();
      console.log("Authentication status:", authStatus);

      if (!authStatus.isAuthenticated) {
        console.log("User not authenticated, redirecting to /auth");
        window.location.href = `${API_BASE_URL}/api/calendar/auth?${new URLSearchParams(formData).toString()}`;
        return;
      }

      // Step 2: If authenticated, proceed with event creation
      const response = await fetch(`${API_BASE_URL}/api/calendar/create-event`, { 
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
import React, { useState } from "react";
import "../App.css"; // Ensure this path is correct

function CalendarForm() {
  // State for form fields
  const [formData, setFormData] = useState({
    summary: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); 
  
    console.log("Sending event data:", formData); 
  
    try {
      const response = await fetch("/api/calendar/events", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      console.log("Response:", response);
      if (!response.ok) {
        throw new Error("Failed to create event !!!");
      }

      const result = await response.json();
      console.log("Result data:", result);
      console.log("Event created successfully:", result);
      alert("Event created successfully!");
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event.");
    }
  };
  

  return (
    <div className="form">
      <h2>Create Google Calendar Event</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="eventTitle">Event Title</label>
        <input
          type="text"
          id="eventTitle"
          name="summary"
          placeholder="Enter the event title."
          value={formData.summary}
          onChange={handleChange}
          required
        />

        <label htmlFor="body">Event Description</label>
        <input
          type="text"
          id="body"
          name="description"
          placeholder="Enter the description of the event."
          value={formData.description}
          onChange={handleChange}
          required
        />

        <label htmlFor="date">Date</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <label htmlFor="startTime">Start Time</label>
        <input
          type="time"
          id="startTime"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          required
        />

        <label htmlFor="endTime">End Time</label>
        <input
          type="time"
          id="endTime"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
          required
        />

        <input type="submit" value="Create Event" />
      </form>
    </div>
  );
}

export default CalendarForm;

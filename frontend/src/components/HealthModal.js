import React, { useState } from "react";

function HealthModal({ isOpen, onClose, onResult, plantName}) {
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!imageFile) {
      setError("Please upload an image.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      console.log("Plant Name:", plantName);
      formData.append("plantName", plantName);
      const response = await fetch("http://localhost:5000/api/plant/health", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        onResult(data.health_assessment); // Pass result to parent
        onClose(); // Close modal
      } else {
        setError(data.error || "Failed to analyze image.");
      }
    } catch (err) {
      console.error("Health check error:", err.message, err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Upload Plant Image for Health Check</h2>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="mb-4"
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        {loading ? (
          <p>Analyzing image...</p>
        ) : (
          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Analyze
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default HealthModal;

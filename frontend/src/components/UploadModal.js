import React, { useState } from "react";
import { auth, db } from "../firebase";
import { doc, setDoc, collection, serverTimestamp } from "firebase/firestore";
import axios from "axios";

const UploadModal = ({ onClose, onPlantAdded }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select an image.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await axios.post(
        "http://localhost:5000/api/plant/identify",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (!response.data || response.data.error) {
        throw new Error(response.data.error || "Failed to identify plant");
      }

      const plantData = {
        name: response.data.suggestions[0]?.name || "Unknown Plant",
        probability: response.data.suggestions[0]?.probability || 0,
        similar_images: response.data.suggestions[0]?.similar_images || [],
        isPlant: response.data.isPlant,
        plantProbability: response.data.plantProbability,
        timestamp: serverTimestamp(),
      };

      // Save plant in Firestore under the logged-in user's collection
      const plantRef = doc(collection(db, "users", user.uid, "plants"));
      await setDoc(plantRef, plantData);

      // Notify the homepage to update
      onPlantAdded(plantData);

      setLoading(false);
      onClose(); // Close modal
    } catch (error) {
      console.error("Error uploading image:", error);
      setError(error.message || "Failed to upload plant.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Upload New Plant</h2>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleUpload}
            className="bg-green-500 text-white px-4 py-2 rounded mr-2"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;

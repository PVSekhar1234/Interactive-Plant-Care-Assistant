// components/ManualPlantModal.js
import React, { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function ManualPlantModal({ onClose, onPlantAdded }) {
  const [plantName, setPlantName] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user || !plantName.trim()) return;

    const newPlant = {
      name: plantName,
      similar_images: imageUrl ? [imageUrl] : [],
      probability: 1,
      manuallyAdded: true,
      isPlant: true,
      plantProbability: true,
      timestamp: serverTimestamp()
    };

    try {
      const docRef = await addDoc(collection(db, "users", user.uid, "plants"), newPlant);
      onPlantAdded({ id: docRef.id, ...newPlant });
      onClose();
    } catch (error) {
      console.error("Error adding plant manually:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Enter Plant Details</h2>
        <input
          type="text"
          placeholder="Plant Name"
          className="w-full mb-2 p-2 border rounded"
          value={plantName}
          onChange={(e) => setPlantName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Image URL (optional)"
          className="w-full mb-4 p-2 border rounded"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <div className="flex justify-between">
          <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={onClose}>
            Cancel
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleSubmit}>
            Save Plant
          </button>
        </div>
      </div>
    </div>
  );
}

export default ManualPlantModal;

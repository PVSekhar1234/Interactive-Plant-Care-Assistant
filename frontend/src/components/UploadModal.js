import React, { useState } from "react";
import axios from "axios";

function UploadModal({ onClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select an image.");

    setUploading(true);
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await axios.post("http://localhost:5000/api/plant/identify", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(response.data);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to identify plant.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Upload Plant Image</h2>
        <input type="file" onChange={handleFileChange} className="mb-4" />
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Identify Plant"}
        </button>

        {result && (
          <div className="mt-4">
            <h3 className="text-md font-semibold">Top Match:</h3>
            <p>{result.suggestions[0]?.name || "Unknown"}</p>
          </div>
        )}

        <button
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 w-full"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default UploadModal;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import ReminderForm from "../components/ReminderForm";

function PlantPage() {
  const { id } = useParams(); // Get plant ID from URL
  const navigate = useNavigate();
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReminderFormOpen, setIsReminderFormOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlantData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError("User not authenticated.");
          return;
        }

        const plantRef = doc(db, "users", user.uid, "plants", id);
        const plantSnap = await getDoc(plantRef);

        if (plantSnap.exists()) {
          setPlant(plantSnap.data());
        } else {
          setError("Plant not found.");
        }
      } catch (err) {
        setError("Failed to fetch plant data.");
        console.error("Error fetching plant:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlantData();
  }, [id]);

  // Handle Plant Deletion
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this plant?")) return;
  
    try {
      const user = auth.currentUser;
      if (!user) {
        setError("User not authenticated.");
        return;
      }
  
      const plantRef = doc(db, "users", user.uid, "plants", id);
      await deleteDoc(plantRef);
  
      console.log("Plant deleted successfully!");
      navigate("/home"); // Redirect to homepage
  
    } catch (err) {
      console.error("Error deleting plant:", err);
      setError("Failed to delete plant. Please try again.");
    }
  };  

  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-8">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">{plant?.name || "Unknown Plant"}</h1>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={handleDelete}
        >
          Delete Plant Entry
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {/* Plant Images */}
          <div className="bg-blue-100 p-4 rounded-lg mb-4 aspect-video flex items-center justify-center">
            {plant?.similar_images?.length > 0 ? (
              <img
                src={plant.similar_images[0]}
                alt="Plant"
                className="rounded-lg w-full h-full object-cover"
              />
            ) : (
              "No image available"
            )}
          </div>

          {/* Plant Identification Details */}
          <div className="bg-green-100 p-4 rounded-lg">
            <p><strong>Scientific Name:</strong> {plant?.name || "N/A"}</p>
            <p><strong>Identification Confidence:</strong> {(plant?.probability * 100).toFixed(2)}%</p>
            <p><strong>Plant Likelihood:</strong> {(plant?.plantProbability * 100).toFixed(2)}%</p>
          </div>
        </div>

        {/* Care Logs and Reminders */}
        <div className="space-y-4">
          <div>
            <div className="bg-green-100 p-4 rounded-lg mb-2">
              Weather-Based Care Log (Coming Soon)
            </div>
            <p className="text-sm text-gray-600">Updated on dd/mm/yy</p>
            <button className="w-full bg-green-600 text-white p-2 rounded mt-2 hover:bg-green-700">
              Update Weather Care Suggestions
            </button>
          </div>

          <div>
            <div className="bg-green-100 p-4 rounded-lg mb-2">
              Health Monitoring Log (Coming Soon)
            </div>
            <p className="text-sm text-gray-600">Updated on dd/mm/yy</p>
            <button className="w-full bg-green-600 text-white p-2 rounded mt-2 hover:bg-green-700">
              Update Health Monitoring
            </button>
          </div>

          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={() => setIsReminderFormOpen(true)}
          >
            Add Reminder
          </button>
        </div>
      </div>

      <ReminderForm
        isOpen={isReminderFormOpen}
        onClose={() => setIsReminderFormOpen(false)}
      />
    </div>
  );
}

export default PlantPage;

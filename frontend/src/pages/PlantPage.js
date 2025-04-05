import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import ReminderForm from "../components/ReminderForm";
import HealthModal from "../components/HealthModal";

function PlantPage() {
  const { id } = useParams(); // Get plant ID from URL
  const navigate = useNavigate();
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReminderFormOpen, setIsReminderFormOpen] = useState(false);
  const [error, setError] = useState("");
  const [weather, setWeather] = useState(null);
  const [weatherUpdatedDate, setWeatherUpdatedDate] = useState("dd/mm/yy"); // State to store weather update date
  const [healthInfo, setHealthInfo] = useState(null);
  const [healthUpdatedDate, setHealthUpdatedDate] = useState("dd/mm/yy");
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
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


  const getWeather = async () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          const response = await fetch(`http://localhost:5000/api/weather/getweather?lat=${lat}&lon=${lon}`);
          const data = await response.json();
          console.log(data);
          setWeather(data); // Update weather state
          setWeatherUpdatedDate(new Date().toLocaleDateString()); // Update weather update date
        } catch (error) {
          console.error("Error fetching weather data:", error);
        }
      }, (error) => {
        console.error("Error getting location:", error);
      });
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

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
                {/* Display weather data if available */}
                {!weather && (
                  <p>Get Weather Data for your Plant care</p>   
                )}
                {weather && (
                  <div className="mt-4 p-4 bg-gray-100 rounded">
                    <h3 className="text-lg font-bold">{weather.name}</h3>
                    <p>Temperature: {weather.main.temp}°C</p>
                    <p>Condition: {weather.weather[0].description}</p>
                    <p>Humidity:{weather.main.humidity}</p>
                    <p>Expected Rain (last hour):{" "}
                  {weather.rain && weather.rain['1h'] ? `${weather.rain['1h']} mm` : 'No rain'}
                </p>
                  </div>
                )}
            </div>
            <p className="text-sm text-gray-600">Updated on {weatherUpdatedDate}</p>
            <button 
              className="w-full bg-green-600 text-white p-2 rounded mt-2 hover:bg-green-700"
              onClick={getWeather}
            >
              Get Weather Data
            </button>
          </div>

          {healthInfo ? (
            <div>
              <p><strong>Status:</strong> {healthInfo.is_healthy?.binary ? "Healthy" : "Unhealthy"}</p>
              <p>
                <strong>Health Probability:</strong>{" "}
                {(healthInfo.is_healthy?.probability * 100).toFixed(2)}%
              </p>
              <p>
                <strong>Plant Detection Confidence:</strong>{" "}
                {(healthInfo.is_plant?.probability * 100).toFixed(2)}%
              </p>

              {healthInfo.disease?.suggestions?.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold">Possible Issues:</h4>
                  <ul className="list-disc ml-5 mt-1">
                    {healthInfo.disease.suggestions.map((sugg, idx) => (
                      <li key={idx}>
                        <strong>{sugg.name}</strong>: {(sugg.probability * 100).toFixed(2)}%
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            "Health Monitoring Log (No data yet)"
          )}
          <p className="text-sm text-gray-600">Updated on {healthUpdatedDate}</p>
          <button
            className="w-full bg-green-600 text-white p-2 rounded mt-2 hover:bg-green-700"
            onClick={() => setIsHealthModalOpen(true)}
          >
            Upload Image for Health Check
          </button>


          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={() => setIsReminderFormOpen(true)}
          >
            Add Reminder
          </button>
        </div>
      </div>

      {isReminderFormOpen && (
        <ReminderForm
          isOpen={isReminderFormOpen}
          onClose={() => setIsReminderFormOpen(false)}  // Close modal when onClose is triggered
        />
      )}
      {isHealthModalOpen && (
        <HealthModal
          isOpen={isHealthModalOpen}
          onClose={() => setIsHealthModalOpen(false)}
          plantName={plant?.name}
          onResult={(result) => {
            setHealthInfo(result);
            setHealthUpdatedDate(new Date().toLocaleDateString());
          }}
        />
      )}

    </div>
  );
}

export default PlantPage;

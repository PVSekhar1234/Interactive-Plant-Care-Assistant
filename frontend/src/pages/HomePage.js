import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { db, auth } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import UploadModal from "../components/UploadModal";

function HomePage() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [plants, setPlants] = useState([]);

  // Fetch plants from Firestore
  const fetchPlants = async () => {
    const user = auth.currentUser;
    if (!user) return; // Ensure user is logged in

    try {
      const q = query(collection(db, "users", user.uid, "plants"));
      const querySnapshot = await getDocs(q);
      
      const fetchedPlants = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setPlants(fetchedPlants);
    } catch (error) {
      console.error("Error fetching plants:", error);
    }
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  // Function to add a new plant dynamically
  const handlePlantAdded = (newPlant) => {
    setPlants((prevPlants) => [...prevPlants, newPlant]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <button 
          className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors"
          onClick={() => setIsUploadOpen(true)}
        >
          Upload New Plant
        </button>
        <button className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors">
          Enter New Plant
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-4">Previously Added Plants:</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {plants.map((plant) => (
          <Link
            key={plant.id}
            to={`/plant/${plant.id}`}
            className="bg-green-100 p-4 rounded-lg hover:bg-green-200 transition-colors"
          >
            <img src={plant.similar_images[0] || ""} alt={plant.name} className="w-full h-32 object-cover rounded-lg" />
            <p className="text-center font-bold">{plant.name}</p>
            <p className="text-center text-gray-500">Confidence: {(plant.probability * 100).toFixed(2)}%</p>
          </Link>
        ))}
      </div>
      
      {isUploadOpen && (
        <UploadModal 
          onClose={() => setIsUploadOpen(false)} 
          onPlantAdded={handlePlantAdded} 
        />
      )}
    </div>
  );
}

export default HomePage;

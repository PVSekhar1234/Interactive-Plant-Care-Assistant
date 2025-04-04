import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { db, auth } from "../firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
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

  const auth = getAuth();
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [username, setUsername] = useState(''); 
  useEffect(() => {
    if (user) {
      // Fetch user data from Firestore
      const fetchUserData = async () => {
        try {
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            setUsername(userData.name); // Store the username in state
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchUserData();
    } else {
      navigate('/'); // Redirect to login page if user is not logged in
    }
  }, [user, navigate]);
  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase clears the user session
      navigate('/'); // Redirect to login or landing page
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
       <div className="flex justify-end mb-4">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <h1 className="text-2xl font-bold mb-4">Welcome {username ? username : 'User'}!</h1> {/* Display username */}
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

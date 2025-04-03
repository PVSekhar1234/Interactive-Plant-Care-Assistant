import React from 'react';
import { Link } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure you have Firebase config imported correctly
function HomePage() {
  const plants = [
    { id: 1, name: 'Plant 1' },
    { id: 2, name: 'Plant 2' },
    { id: 3, name: 'Plant 3' },
    { id: 4, name: 'Plant 4' },
  ];
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
        <button className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors">
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
            <div className="aspect-square bg-green-50 rounded-lg mb-2"></div>
            <p className="text-center">{plant.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
import React, { useEffect, useState } from 'react';
import { getAuth, updateProfile, signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';  // Ensure you have Firebase config imported correctly
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    profilePic: '',
    createdAt: '',
  });

  const [newName, setNewName] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserData();
    } else {
      navigate('/'); // Redirect to login if not logged in
    }
  }, [user, navigate]);

  const fetchUserData = async () => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        setUserData({
          name: userData.name || user.displayName || '',
          email: user.email,
          profilePic: userData.profilePic || user.photoURL || '',
          createdAt: userData.createdAt?.toDate().toLocaleDateString() || '',
        });
        setNewName(userData.name || '');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      if (user) {
        await updateProfile(user, { displayName: newName });

        await updateDoc(doc(db, 'users', user.uid), {
          name: newName,
        });

        setUserData((prev) => ({ ...prev, name: newName }));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  
  const handleLogout = async () => {
    await signOut(auth);
    navigate('/'); // Redirect to login page
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Profile</h1>

      <div className="flex flex-col items-center">
        {/* <img
          src={userData.profilePic || 'https://via.placeholder.com/100'}
          alt="Profile"
          className="w-24 h-24 rounded-full mb-4"
        /> */}

        <p className="text-lg font-semibold">{userData.name}</p>
        <p className="text-gray-600">{userData.email}</p>
        <p className="text-gray-500 text-sm">Joined on {userData.createdAt}</p>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="w-full p-2 border rounded-md"
        />

        <button
          onClick={handleUpdateProfile}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
        >
          Update Profile
        </button>

        <button
          onClick={handleLogout}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default ProfilePage;

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  applyActionCode, 
  checkActionCode, 
  confirmPasswordReset, 
  getAuth 
} from 'firebase/auth';
import { collection, query, where, getDocs, updateDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

function Verify() {
  const [message, setMessage] = useState('Processing...');
  const [newPassword, setNewPassword] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const auth = getAuth();
  const mode = searchParams.get('mode');  // Determine action type
  const oobCode = searchParams.get('oobCode'); // Firebase action code

  useEffect(() => {
    if (!oobCode) {
      setMessage('Invalid or expired link.');
      return;
    }

    if (mode === 'verifyEmail') {
      handleEmailVerification();
    } else if (mode === 'resetPassword') {
      setMessage('Enter a new password below:');
    } else {
      setMessage('Invalid action mode.');
    }
  }, [mode, oobCode]);

  // Handle email verification
  const handleEmailVerification = async () => {
    try {
      console.log("Extracted oobCode:", oobCode);

      // Get the email associated with the action code
      const actionCodeInfo = await checkActionCode(auth, oobCode);
      const email = actionCodeInfo.data.email;

      console.log("Email associated with verification:", email);

      // Apply the verification code
      await applyActionCode(auth, oobCode);
      console.log("Verification successful.");

      // Update Firestore user entry
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        const newUserRef = doc(collection(db, "users"));
        await setDoc(newUserRef, {
          email,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          verified: true,
        });
      } else {
        const userDoc = querySnapshot.docs[0];
        await updateDoc(userDoc.ref, {
          verified: true,
          lastLogin: serverTimestamp(),
        },{merge: true});
      }

      setMessage('Email verified! Redirecting to home...');
      setTimeout(() => navigate('/home'), 3000);
    } catch (error) {
      console.error('Verification error:', error);
      setMessage('Invalid or expired verification link.');
    }
  };

  // Handle password reset
  const handlePasswordReset = async () => {
    if (!newPassword || newPassword.length < 6) {
      setMessage('Password must be at least 6 characters.');
      return;
    }

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/'), 3000);
    } catch (error) {
      console.error('Password reset error:', error);
      setMessage('Failed to reset password. Try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Firebase Action</h1>
        <h2 className="text-xl font-bold">{message}</h2>

        {mode === 'resetPassword' && (
          <div className="mt-4">
            <input
              type="password"
              placeholder="New Password"
              className="border border-gray-300 p-2 rounded w-64"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              onClick={handlePasswordReset}
              className="block mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Reset Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Verify;

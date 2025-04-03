import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { applyActionCode, checkActionCode, getAuth } from 'firebase/auth';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { doc } from 'firebase/firestore'
import { serverTimestamp } from 'firebase/firestore';
import { setDoc } from 'firebase/firestore';

function VerifyEmail() {
  const [message, setMessage] = useState('Verifying...');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const oobCode = searchParams.get('oobCode'); // Extract the verification code from URL
  const auth = getAuth();

  useEffect(() => {
    const verifyEmail = async () => {
      if (!oobCode) {
        setMessage('Invalid verification link.');
        return;
      }

      try {
        console.log("Extracted oobCode:", oobCode);

        // Get the email associated with the oobCode
        const actionCodeInfo = await checkActionCode(auth, oobCode);
        const email = actionCodeInfo.data.email;

        console.log("Email associated with verification:", email);

        // Apply the verification code
        await applyActionCode(auth, oobCode);
        console.log("Verification code applied successfully.");

        // Fetch user by email from Firestore
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
        } else{
          const userDoc = querySnapshot.docs[0];
          await updateDoc(userDoc.ref, {
            verified: true,
            lastLogin: serverTimestamp(),
          },{ merge: true });
        }
          setMessage('Email verified! Redirecting to home...');
          setTimeout(() => navigate('/home'), 3000);
        }
       catch (error) {
        console.error('Verification error:', error);
        setMessage('Invalid or expired verification link.');
      }
    };

    verifyEmail();
  }, [oobCode, navigate, auth]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Email Verification</h1>
        <h2 className="text-xl font-bold">{message}</h2>
      </div>
    </div>
  );
};

export default VerifyEmail;

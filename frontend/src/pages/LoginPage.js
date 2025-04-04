import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,

} from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase';
function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      googleProvider.setCustomParameters({ prompt: 'select_account' }); // Ensure single popup
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // Create new user document if first time
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          displayName: user.displayName,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp()
        });
      } else {
        // Update last login
        await setDoc(doc(db, 'users', user.uid), {
          lastLogin: serverTimestamp()
        }, { merge: true });
      }
      
      navigate('/home');
    } catch (error) {
      setError(error.message);
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[a-z0-9._%+-]+@(gmail\.com|iiti\.ac\.in)$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);
    
    if (!isValidEmail(inputEmail)) {
      setEmailError("Invalid email format. Only Gmail and IITI emails are allowed.");
    } else {
      setEmailError('');
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isValidEmail(email)) {
      setError("Invalid email format. Please enter a valid email.");
      return;
    }
  
    try {
      if (isLogin) {
        // Check if user exists in Firestore before login
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);
  
        if (querySnapshot.empty) {
          setError("No account found. Please sign up first.");
          return;
        }
  
        // Sign in the user
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("Signed-in User:", user.email);
        const usersref = collection(db, "users");
        const q1 = query(usersref, where("email", "==", user.email));
        const querysnapshot = await getDocs(q1);
        const userDoc = querysnapshot.docs[0];
         const userData = userDoc.data();
        console.log("User Data from Firestore:", userData);
        
        console.log("User Verifification Status:", userData.verified);
        // If email is not verified, resend verification and sign out
        if (!userData.verified) {
          await sendEmailVerification(user);
          await signOut(auth);
          setError("Your email is not verified. A verification email has been sent again.");
          return;
        }
  
        // If email is verified, update Firestore
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, { 
          lastLogin: serverTimestamp(),
          verified: true  // Mark as verified in Firestore
        }, { merge: true });
  
        navigate('/home');
      } else {
        // Sign up user
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(result.user);
        
        // Save user data in Firestore
        await setDoc(doc(db, 'users', result.user.uid), {
          email,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          verified: false  // Initially false until verification
        });
  
        setError('Verification email sent! Please check your inbox.');
        await signOut(auth);
      }
    } catch (error) {
      if (error.code === 'auth/invalid-credential') {
        setError('Invalid Credentials. Please try again.');
      } else if (error.code === 'auth/user-not-found') {
        setError('No account found. Please sign up first.');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Try again later.');
      } else {
        setError(error.message);
      }
    }
  };
  


return (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md w-full space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-center text-green-600">Plant Care Assistant</h1>
        <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
          {isLogin ? 'Sign in to your account' : 'Create new account'}
        </h2>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <input
              type="email"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
              value={email}
              onChange={handleEmailChange}
            />
            {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
          </div>
          <div>
            <input
              type="password"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        
        {isLogin && (
        <div className="text-right">
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="text-sm text-green-600 hover:text-green-500"
          >
            Forgot Password?
          </button>
        </div>
      )}

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="space-y-4">
          <button
            type="submit"
            disabled={!email || emailError}
            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
              email && !emailError ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
          >
            {isLogin ? 'Sign in' : 'Sign up'}
          </button>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google" 
              className="w-5 h-5 mr-2"
            />
            Continue with Google
          </button>
        </div>
      </form>

      <div className="text-center">
        <button
          className="text-green-600 hover:text-green-500"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  </div>
);
}

export default LoginPage;


  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError('');
    
  //   try {
  //     if (isLogin) {
  //       console.log("Checking email in Firestore:", email);

  //   // Query Firestore to check if the email exists
  //   const usersRef = collection(db, "users");
  //   const q = query(usersRef, where("email", "==", email));
  //   const querySnapshot = await getDocs(q);

  //   if (querySnapshot.empty) {
  //     setError("No account found. Please complete sign-up first.");
  //     return;
  //   }
  //       // Login
  //       const userCredential = await signInWithEmailAndPassword(auth, email, password);
  //       const user = userCredential.user;

  //   // Fetch user data from Firestore
  //   const userRef = doc(db, 'users', email);
  //   const userSnap = await getDoc(userRef);
  //     console.log("User data from Firestore:", userSnap.data());
  //   if (userSnap.exists()) {
  //     //const userData = userSnap.data();

  //     // Check if the user is verified in Firestore
  //     // if (!userData.verified) {
  //     //   setError("Complete Email verification");
  //     //   await sendEmailVerification(user);
  //     //   await signOut(auth); // Logout the user
  //     //   return;
  //     // }

  //     // Update last login timestamp
  //     await setDoc(userRef, {
  //       lastLogin: serverTimestamp()
  //     }, { merge: true });

  //     navigate('/home'); // Navigate to home if verified
  //   } else {
  //     setError("User not found in database.");
  //     await signOut(auth); // Logout user if no Firestore entry found
  //   }
  //     } else {
  //       // Sign up
  //       const result = await createUserWithEmailAndPassword(auth, email, password);
  //       await sendEmailVerification(result.user);
  //     //   const userRef = doc(db, 'users', result.user.uid);
  //     //   const userSnap = await getDoc(userRef);
  //     //   // Mark user as pending verification in Firestore
  //     //   if(!userSnap.exists()){
  //     //   await setDoc(doc(db, 'users', result.user.uid), {
  //     //     email,
  //     //     createdAt: serverTimestamp(),
  //     //     lastLogin: serverTimestamp(),
  //     //     verified: false // Initially false
  //     //   });
  //     // } 
  //       setError('Verification email sent! Please check your inbox.');
  //       await signOut(auth);
  //     }
      
  //   } catch (error) {
  //     setError(error.message);
  //   }
  // };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <h1 className="text-3xl font-bold text-center text-green-600">Plant Care Assistant</h1>
//           <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
//             {isLogin ? 'Sign in to your account' : 'Create new account'}
//           </h2>
//         </div>
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           <div className="rounded-md shadow-sm -space-y-px">
//             <div>
//               <input
//                 type="email"
//                 required
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
//                 placeholder="Email address"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>
//             <div>
//               <input
//                 type="password"
//                 required
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>
//           </div>

//           {error && (
//             <p className="text-red-500 text-sm text-center">{error}</p>
//           )}

//           <div className="space-y-4">
//             <button
//               type="submit"
//               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//             >
//               {isLogin ? 'Sign in' : 'Sign up'}
//             </button>

//             <button
//               type="button"
//               onClick={handleGoogleSignIn}
//               className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//             >
//               <img 
//                 src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
//                 alt="Google" 
//                 className="w-5 h-5 mr-2"
//               />
//               Continue with Google
//             </button>
//           </div>
//         </form>

//         <div className="text-center">
//           <button
//             className="text-green-600 hover:text-green-500"
//             onClick={() => setIsLogin(!isLogin)}
//           >
//             {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default LoginPage;

import './App.css';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import {Routes, Route } from 'react-router-dom';
import PlantPage from './pages/PlantPage';
import Navbar from './components/Navbar';
import ChatbotButton from './components/ChatbotButton';
import Verify from './pages/Verify';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProtectedRoute from './pages/ProtectedRoute';
import ProfilePage from './pages/ProfilePage';
import { useLocation } from 'react-router-dom';
function App() {
  const location = useLocation();
  const hideLayout = location.pathname === '/';
  return (
      <div className="min-h-screen bg-gray-50">
         {!hideLayout && <Navbar />}
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<HomePage />} />
        </Route>
          <Route path="/plant/:id" element={<PlantPage/>} />
          <Route path="/verify" element={<Verify/>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
        {!hideLayout && <ChatbotButton />}
      </div>
  
  );
}

export default App;
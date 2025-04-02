import './App.css';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import { Router, Routes, Route } from 'react-router-dom';
import PlantPage from './pages/PlantPage';
import Navbar from './components/Navbar';
import ChatbotButton from './components/ChatbotButton';
function App() {
  return (
   
      <div className="min-h-screen bg-gray-50">
        <Navbar/>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/plant/:id" element={<PlantPage/>} />
        </Routes>
        <ChatbotButton/>
      </div>
  
  );
}

export default App;

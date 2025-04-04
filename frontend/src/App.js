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


import { useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("");
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const newChat = { role: "user", content: input };
    setChatHistory([...chatHistory, newChat]);

    try {
      const response = await axios.post("http://localhost:5000/api/chat", { prompt: input });
      const botMessage = { role: "bot", content: response.data.response };
      setChatHistory([...chatHistory, newChat, botMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);
    }

    setInput("");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h2>AI Chatbot</h2>
      <div style={{ height: "300px", overflowY: "scroll", border: "1px solid #ccc", padding: "10px" }}>
        {chatHistory.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.role === "user" ? "right" : "left", margin: "5px 0" }}>
            <b>{msg.role === "user" ? "You" : "Bot"}:</b> {msg.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: "80%", padding: "10px", marginTop: "10px" }}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage} style={{ padding: "10px 15px", marginLeft: "5px" }}>Send</button>
    </div>
  );
}

export default App;


import React, { useState } from 'react';

function ChatbotModal({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessages = [
      ...messages,
      { role: "user", content: userInput }
    ];

    setMessages(newMessages);
    setUserInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ messages: newMessages })
      });

      const data = await response.json();
      if (data.reply) {
        setMessages(prev => [
          ...prev,
          { role: "assistant", content: data.reply }
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          { role: "assistant", content: "Sorry, I couldn't generate a response." }
        ]);
      }
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "There was an error talking to the chatbot." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-16 right-4 bg-white w-80 p-4 shadow-lg rounded-lg border border-gray-300 z-50">
      <div className="flex justify-between items-center border-b pb-2">
        <h2 className="text-lg font-semibold">Chatbot</h2>
        <button onClick={onClose} className="text-red-500 font-bold">×</button>
      </div>

      <div className="h-48 overflow-y-auto p-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 my-1 rounded text-sm ${
              msg.role === "user" ? "bg-green-100 text-right" : "bg-gray-100 text-left"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {isLoading && <p className="text-gray-400 text-sm">Typing...</p>}
      </div>

      <div className="flex mt-2 gap-2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask me about your plant..."
          className="w-full border p-2 rounded text-sm"
        />
        <button
          onClick={sendMessage}
          className="bg-green-600 text-white px-3 rounded hover:bg-green-700 text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatbotModal;

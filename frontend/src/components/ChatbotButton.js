import React, { useState } from 'react';
import { FaComments } from 'react-icons/fa';
import ChatbotModal from "./ChatbotModal";

function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700"
      >
        <FaComments size={24} />
      </button>

      {isOpen && <ChatbotModal onClose={() => setIsOpen(false)} />}
    </>
  );
}

export default ChatbotButton;

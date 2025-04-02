import React from 'react';
import { FaComments } from 'react-icons/fa';

function ChatbotButton() {
  return (
    <button className="fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700">
      <FaComments size={24} />
    </button>
  );
}

export default ChatbotButton;
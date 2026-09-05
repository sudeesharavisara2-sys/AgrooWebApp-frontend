import React from 'react';
import { AIChatBox } from './AIChatBox'; // Curly braces සමඟ

export const AIChatPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Agricultural Expert Chat</h1>
        <p className="text-sm text-gray-500 mt-1">Get instant guidance on farming techniques, crop diseases, and market updates.</p>
      </div>
      <AIChatBox />
    </div>
  );
};

export default AIChatPage;
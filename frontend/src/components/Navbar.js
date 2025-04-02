import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-green-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/home" className="text-xl font-bold">
          Plant Care Assistant
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/profile" className="hover:text-green-200">
            Profile
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
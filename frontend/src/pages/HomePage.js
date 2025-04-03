import React, { useState } from "react";
import { Link } from 'react-router-dom';
import UploadModal from "../components/UploadModal";

function HomePage() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const plants = [
    { id: 1, name: 'Plant 1' },
    { id: 2, name: 'Plant 2' },
    { id: 3, name: 'Plant 3' },
    { id: 4, name: 'Plant 4' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <button 
          className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors"
          onClick={() => setIsUploadOpen(true)}
        >
          Upload New Plant
        </button>
        <button className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors">
          Enter New Plant
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-4">Previously Added Plants:</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {plants.map((plant) => (
          <Link
            key={plant.id}
            to={`/plant/${plant.id}`}
            className="bg-green-100 p-4 rounded-lg hover:bg-green-200 transition-colors"
          >
            <div className="aspect-square bg-green-50 rounded-lg mb-2"></div>
            <p className="text-center">{plant.name}</p>
          </Link>
        ))}
      </div>
      {isUploadOpen && <UploadModal onClose={() => setIsUploadOpen(false)} />}
    </div>
  );
}

export default HomePage;
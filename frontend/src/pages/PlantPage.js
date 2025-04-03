import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ReminderForm from '../components/ReminderForm';
function PlantPage() {
  const { id } = useParams();
  const [isReminderFormOpen, setIsReminderFormOpen] = useState(false);
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Plant Name</h1>
        <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Delete Plant Entry
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="bg-blue-100 p-4 rounded-lg mb-4 aspect-video">
            Plant Pictures
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            Plant Identification Details
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="bg-green-100 p-4 rounded-lg mb-2">
              Weather-Based Care Log 1
            </div>
            <p className="text-sm text-gray-600">Updated on dd/mm/yy</p>
            <button className="w-full bg-green-600 text-white p-2 rounded mt-2 hover:bg-green-700">
              Update Weather Care Suggestions
            </button>
          </div>

          <div>
            <div className="bg-green-100 p-4 rounded-lg mb-2">
              Health Monitoring Log 1
            </div>
            <p className="text-sm text-gray-600">Updated on dd/mm/yy</p>
            <button className="w-full bg-green-600 text-white p-2 rounded mt-2 hover:bg-green-700">
              Update Health Monitoring
            </button>
          </div>

          <button 
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={() => setIsReminderFormOpen(true)}
          >
            Add Reminder
          </button>
        </div>
      </div>

      {isReminderFormOpen && (
        <ReminderForm
          isOpen={isReminderFormOpen}
          onClose={() => setIsReminderFormOpen(false)}  // Close modal when onClose is triggered
        />
      )}
    </div>
  );
}

export default PlantPage;
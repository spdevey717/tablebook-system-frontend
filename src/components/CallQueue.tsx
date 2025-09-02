import React, { useState } from 'react';
import { Phone, Clock, Play, Pause, Stop } from 'lucide-react';
import { CallStatus } from '../types';
import type { Booking, Restaurant } from '../types';

interface CallQueueProps {
  restaurant: Restaurant;
  bookings: Booking[];
}

const CallQueue: React.FC<CallQueueProps> = ({ restaurant, bookings }) => {
  const [isActive, setIsActive] = useState(false);
  const [calls, setCalls] = useState(bookings.map((b, i) => ({
    id: i + 1,
    booking: b,
    status: CallStatus.SCHEDULED,
    scheduledTime: '09:30-10:30'
  })));

  const startQueue = () => setIsActive(true);
  const pauseQueue = () => setIsActive(false);
  const stopQueue = () => {
    setIsActive(false);
    setCalls(prev => prev.map(c => ({ ...c, status: CallStatus.SCHEDULED })));
  };

  const triggerCall = (callId: number) => {
    setCalls(prev => prev.map(c => 
      c.id === callId ? { ...c, status: CallStatus.IN_PROGRESS } : c
    ));
    
    // Simulate call completion
    setTimeout(() => {
      setCalls(prev => prev.map(c => 
        c.id === callId ? { ...c, status: CallStatus.COMPLETED } : c
      ));
    }, 5000);
  };

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Call Queue - {restaurant.name}</h3>
          <div className="flex space-x-2">
            {!isActive ? (
              <button onClick={startQueue} className="btn-primary flex items-center">
                <Play className="w-4 h-4 mr-2" /> Start
              </button>
            ) : (
              <>
                <button onClick={pauseQueue} className="btn-secondary flex items-center">
                  <Pause className="w-4 h-4 mr-2" /> Pause
                </button>
                <button onClick={stopQueue} className="px-4 py-2 bg-red-600 text-white rounded-xl">
                  <Stop className="w-4 h-4 mr-2" /> Stop
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold">{calls.length}</p>
            <p className="text-sm text-gray-600">Total</p>
          </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-900">
                {calls.filter(c => c.status === CallStatus.SCHEDULED).length}
              </p>
              <p className="text-sm text-blue-600">Pending</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-900">
                {calls.filter(c => c.status === CallStatus.IN_PROGRESS).length}
              </p>
              <p className="text-sm text-yellow-600">In Progress</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-900">
                {calls.filter(c => c.status === CallStatus.COMPLETED).length}
              </p>
              <p className="text-sm text-green-600">Completed</p>
            </div>
        </div>

        <div className="space-y-3">
          {calls.map(call => (
            <div key={call.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">{call.booking.guest_name}</p>
                <p className="text-sm text-gray-600">{call.booking.phone_e164}</p>
              </div>
              <div className="flex items-center space-x-4">
                                 <span className={`px-2 py-1 rounded-full text-xs ${
                   call.status === CallStatus.SCHEDULED ? 'bg-blue-100 text-blue-800' :
                   call.status === CallStatus.IN_PROGRESS ? 'bg-yellow-100 text-yellow-800' :
                   'bg-green-100 text-green-800'
                 }`}>
                   {call.status}
                 </span>
                 {call.status === CallStatus.SCHEDULED && isActive && (
                  <button
                    onClick={() => triggerCall(call.id)}
                    className="px-3 py-1 bg-primary-100 text-primary-700 rounded hover:bg-primary-200"
                  >
                    Call Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CallQueue;

import React, { useEffect, useState } from 'react';
import { Users, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../../services/api.js';
const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVehicles = async () => {
    try {
      const data = await api.getVehicles();
      setVehicles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  if (loading) return <div className="p-4 text-gray-500">Loading fleet data...</div>;

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">Current Fleet</h3>
        <button onClick={fetchVehicles} className="text-sm text-blue-600 hover:underline">Refresh</button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map(v => (
          <div key={v.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <span className="font-bold text-lg text-gray-800">{v.registrationNumber}</span>
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${v.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {v.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">{v.model} • {v.fuelType}</p>
            <p className="text-sm text-gray-500 mb-3"><Users size={12} className="inline mr-1"/> {v.capacity} Seats</p>
            
            <div className="border-t pt-2 mt-2">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Driver</p>
              {v.assignedDriver ? (
                <div className="flex items-center text-sm text-blue-700">
                  <CheckCircle size={14} className="mr-1"/> {v.assignedDriver.user?.email || 'Assigned'}
                </div>
              ) : (
                <span className="text-sm text-orange-500 flex items-center"><AlertCircle size={14} className="mr-1"/> Unassigned</span>
              )}
            </div>
          </div>
        ))}
        {vehicles.length === 0 && (
          <div className="col-span-full text-center py-10 bg-gray-50 rounded border border-dashed border-gray-300 text-gray-500">
            No vehicles in your fleet yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleList;
import React, { useState } from 'react';
import { Truck } from 'lucide-react';
import api from '../../services/api.js';

const AddVehicleForm = ({ onSuccess }) => {
  const [data, setData] = useState({ registrationNumber: '', model: '', capacity: '', fuelType: 'Diesel' });
  const [status, setStatus] = useState({ type: '', msg: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'info', msg: 'Adding vehicle...' });
    try {
      await api.addVehicle(data);
      setStatus({ type: 'success', msg: 'Vehicle added successfully!' });
      setData({ registrationNumber: '', model: '', capacity: '', fuelType: 'Diesel' });
      if (onSuccess) onSuccess();
    } catch (err) {
      setStatus({ type: 'error', msg: err.message });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center"><Truck className="mr-2 text-blue-600"/> Add New Vehicle</h3>
      
      {status.msg && (
        <div className={`p-3 rounded text-sm mb-4 ${status.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {status.msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Registration No.</label>
          <input type="text" placeholder="e.g. DL-01-AB-1234" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={data.registrationNumber} onChange={e => setData({...data, registrationNumber: e.target.value})} required />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Model</label>
          <input type="text" placeholder="e.g. Toyota Innova" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={data.model} onChange={e => setData({...data, model: e.target.value})} required />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Seating Capacity</label>
          <input type="number" placeholder="4" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={data.capacity} onChange={e => setData({...data, capacity: e.target.value})} required />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Fuel Type</label>
          <select className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={data.fuelType} onChange={e => setData({...data, fuelType: e.target.value})}>
            <option value="Diesel">Diesel</option>
            <option value="Petrol">Petrol</option>
            <option value="Electric">Electric</option>
            <option value="CNG">CNG</option>
          </select>
        </div>
        <div className="md:col-span-2 pt-2">
<button 
  type="submit" 
  className="w-full md:w-auto px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 
             text-white font-semibold shadow-md 
             hover:opacity-70 hover:shadow-lg 
             transition-all duration-300"
>
  Add to Fleet
</button>

        </div>
      </form>
    </div>
  );
};
export default AddVehicleForm;
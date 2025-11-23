import React, { useState } from 'react';
import api from '../../services/api.js';
const AddVendorForm = ({ onClose, onSuccess }) => {
  const [data, setData] = useState({ email: '', password: '', region: '', name: '' });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createSubVendor({ ...data });
      onSuccess();
      onClose();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 bg-white p-4 rounded-lg shadow-inner">
      <h4 className="text-sm font-bold text-blue-800 uppercase tracking-wide">Add SubVendor Under You</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input type="email" placeholder="Vendor Email" className="text-sm border p-2 rounded focus:ring-1 focus:ring-blue-500 outline-none" onChange={e => setData({...data, email: e.target.value})} required />
        <input type="password" placeholder="Password" className="text-sm border p-2 rounded focus:ring-1 focus:ring-blue-500 outline-none" onChange={e => setData({...data, password: e.target.value})} required />
        <input type="text" placeholder="Region Name" className="text-sm border p-2 rounded focus:ring-1 focus:ring-blue-500 outline-none" onChange={e => setData({...data, region: e.target.value})} required />
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onClose} className="text-xs text-gray-600 hover:bg-gray-100 px-3 py-1.5 rounded">Cancel</button>
        <button type="submit" className="text-xs bg-blue-600 text-gray-600 px-3 py-1.5 rounded hover:bg-blue-700 shadow-sm">Create Vendor</button>
      </div>
    </form>
  );
};
export default AddVendorForm;
import { useState } from 'react';
import { Users, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../../services/api.js';

const OnboardDriver = () => {
  const [data, setData] = useState({ password: '', email: '', licenseNumber: '', vehicleRegNumber: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.onboardDriver(data);
      setStatus('Success: Driver Onboarded!');
      setData({ password: '', email: '', licenseNumber: '', vehicleRegNumber: '' });
    } catch (err) {
      setStatus('Error: ' + err.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-4xl">
      <h2 className="text-xl font-bold mb-6 flex items-center text-gray-800 border-b pb-4">
        <Users className="mr-3 text-blue-600"/> Driver Onboarding Form
      </h2>
      
      {status && (
        <div className={`mb-6 p-4 rounded-lg flex items-center ${status.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {status.includes('Error') ? <AlertCircle className="mr-2"/> : <CheckCircle className="mr-2"/>}
          {status}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input type="email" className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" onChange={e => setData({...data, email: e.target.value})} value={data.email} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="text" className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" onChange={e => setData({...data, password: e.target.value})} value={data.password} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Driving License No.</label>
            <input type="text" className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" onChange={e => setData({...data, licenseNumber: e.target.value})} value={data.licenseNumber} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assign Vehicle (Reg No)</label>
            <input type="text" placeholder="Optional" className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" onChange={e => setData({...data, vehicleRegNumber: e.target.value})} value={data.vehicleRegNumber} />
          </div>
        </div>
        
        <div className="flex justify-end pt-4">
          <button type="submit"
             className="w-full md:w-auto px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 
             text-white font-semibold shadow-md 
             hover:opacity-70 hover:shadow-lg 
             transition-all duration-300"
           >
            Submit Application
          </button>
        </div>
      </form>
    </div>
  );
};

export default OnboardDriver;
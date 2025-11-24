import { useState, useEffect } from 'react';
import Sidebar from '../layout/Sidebar.jsx';
import VendorNode from '../Vendor/VendorNode.jsx';
import AddVehicleForm from '../Fleet/AddVehicleForm.jsx';
import VehicleList from '../Fleet/VehicleList.jsx'; 
import OnboardDriver from '../Fleet/OnboardDriver.jsx';
import { AlertCircle, Settings, Plus } from 'lucide-react';
import api from '../../services/api.js';
const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('hierarchy');
  const [hierarchy, setHierarchy] = useState(null);

  const fetchHierarchy = async () => {
    try {
      const data = await api.getHierarchy();
      console.log("Fetched hierarchy:", data);
      setHierarchy(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHierarchy();
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gray-50">
      <Sidebar user={user} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-gray-800">
            {activeTab === 'hierarchy' && 'Network Management'}
            {activeTab === 'fleet' && 'Fleet Operations'}
            {activeTab === 'onboard' && 'Driver Onboarding'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {activeTab === 'hierarchy' && 'Visualize and manage vendor hierarchy and permissions.'}
            {activeTab === 'fleet' && 'Real-time status of your vehicles and drivers.'}
            {activeTab === 'onboard' && 'Register new drivers into the system.'}
          </p>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {/* HIERARCHY TAB */}
          {activeTab === 'hierarchy' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 min-h-[500px]">
              <div className="flex justify-between items-center mb-6 pb-4 border-b">
                <h3 className="text-lg font-semibold text-gray-700">Organization Structure</h3>
                <button onClick={fetchHierarchy} className="text-sm text-blue-600 hover:bg-blue-50 px-3 py-1 rounded transition-colors">Refresh Tree</button>
              </div>
              
              {hierarchy ? (
                <VendorNode vendor={hierarchy} currentUser={user} onRefresh={fetchHierarchy} />
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-400">Loading hierarchy...</div>
              )}
              
              <div className="mt-8 bg-blue-50 p-4 rounded-lg text-sm text-blue-800 border border-blue-100">
                <p className="font-bold mb-2 flex items-center"><AlertCircle size={16} className="mr-2"/> How Delegation Works:</p>
                <ul className="list-disc  pl-5 space-y-1 opacity-90 ">
                  <li><strong>Super Vendors</strong> can click the <Settings size={12} className="inline"/> icon to toggle permissions for sub-vendors.</li>
                  <li><strong>Sub-Vendors</strong> inherit permissions to add drivers or verify documents.</li>
                  <li>Click <Plus size={12} className="inline"/> to add a new vendor to a specific node.</li>
                </ul>
              </div>
            </div>
          )}

          {/* FLEET TAB */}
          {activeTab === 'fleet' && (
            <div className="space-y-8">
              {/* Add Vehicle Section */}
              <AddVehicleForm onSuccess={() => window.location.reload()} /* Simple reload for demo */ />
              
              {/* List Section */}
              <VehicleList />
            </div>
          )}

          {/* ONBOARD TAB */}
          {activeTab === 'onboard' && (
            <div className="flex justify-center">
              <OnboardDriver />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
export default Dashboard;
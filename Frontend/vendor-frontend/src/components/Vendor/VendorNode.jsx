import { useState } from 'react';
import { ChevronDown, ChevronRight, User, Plus, Settings, Users, Shield } from 'lucide-react';
import AddVendorForm from './AddVendorForm.jsx';
import api from '../../services/api.js';
const VendorNode = ({ vendor, currentUser, onRefresh }) => {
  const [expanded, setExpanded] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);
  
  // Permission State (For Delegation Logic)
  const [perms, setPerms] = useState({
    canOnboardDriver: vendor.canOnboardDriver,
    canVerifyDocs: vendor.canVerifyDocs,
    canProcessPayment: vendor.canProcessPayment,
    canEditVehicle: vendor.canEditVehicle
  });

  const handleUpdatePermissions = async () => {
    try {
      await api.delegate({
        targetVendorId: vendor.id,
        canOnboard: perms.canOnboardDriver,
        canVerify: perms.canVerifyDocs,
        canPay: perms.canProcessPayment,
        canEditVehicle: perms.canEditVehicle
      });
      alert("Permissions Updated!");
      onRefresh(); 
      setShowPermissions(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update: " + err.message);
    }
  };

  const isSuper = currentUser.role === 'SUPER_VENDOR';
  const hasChildren = vendor.children && vendor.children.length > 0;

  return (
    <div className="ml-4 md:ml-8 border-l-2 border-gray-200 pl-4 my-3">
      {/* Node Card */}
      <div className={`flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all ${vendor.level === 1 ? 'border-l-4 border-l-purple-500' : ''}`}>
        <div className="flex items-center space-x-4">
          <button onClick={() => setExpanded(!expanded)} className="text-gray-400 hover:text-blue-600 transition-colors">
            {hasChildren ? (expanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />) : <User size={20} />}
          </button>
          
          <div>
            <div className="font-semibold text-gray-800 flex items-center gap-2">
              {vendor.user?.email}
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${vendor.level === 1 ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                {vendor.region}
              </span>
            </div>
            
            {/* Permission Badges */}
            <div className="text-xs text-gray-500 mt-1 flex gap-3">
                {vendor.canOnboardDriver && <span className="flex items-center text-green-600 bg-green-50 px-1.5 rounded"><Users size={12} className="mr-1"/> Onboard</span>}
                {vendor.canVerifyDocs && <span className="flex items-center text-blue-600 bg-blue-50 px-1.5 rounded"><Shield size={12} className="mr-1"/> Verify</span>}
                {vendor.canProcessPayment && <span className="flex items-center text-yellow-600 bg-yellow-50 px-1.5 rounded"><User size={12} className="mr-1"/> Payment</span>}
                {vendor.canEditVehicle && <span className="flex items-center text-purple-600 bg-purple-50 px-1.5 rounded"><User size={12} className="mr-1"/> Edit Vehicle</span>}
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          {/* Add Sub-Vendor Button */}
          <button   
            onClick={() => setShowAddModal(!showAddModal)}
            className={`p-2 rounded-full transition-colors ${showAddModal ? 'bg-blue-100 text-blue-700' : 'text-gray-400 hover:bg-gray-100 hover:text-blue-600'}`}
            title="Add Sub-Vendor"
          >
            <Plus size={18} />
          </button>
          
          {/* Delegate Settings Button (Only for Super Vendor) */}
          {isSuper && vendor.level !== 1 && (
            <button 
              onClick={() => setShowPermissions(!showPermissions)}
              className={`p-2 rounded-full transition-colors ${showPermissions ? 'bg-orange-100 text-orange-700' : 'text-gray-400 hover:bg-gray-100 hover:text-orange-600'}`}
              title="Delegate Permissions"
            >
              <Settings size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Permissions Modal (Inline) */}
      {showPermissions && (
        <div className="bg-orange-50 p-4 mt-2 rounded-lg border border-orange-200 animate-in fade-in slide-in-from-top-2">
          <h4 className="text-xs font-bold text-orange-800 mb-3 uppercase tracking-wider">Delegate Authority</h4>
          <div className="flex flex-wrap gap-4 text-sm mb-4">
            <label className="flex items-center space-x-2 cursor-pointer bg-white px-3 py-1.5 rounded shadow-sm border border-orange-100 hover:border-orange-300">
              <input type="checkbox" className="text-orange-600 focus:ring-orange-500 rounded" checked={perms.canOnboardDriver} onChange={e => setPerms({...perms, canOnboardDriver: e.target.checked})} />
              <span className="text-gray-700">Onboard Drivers</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer bg-white px-3 py-1.5 rounded shadow-sm border border-orange-100 hover:border-orange-300">
              <input type="checkbox" className="text-orange-600 focus:ring-orange-500 rounded" checked={perms.canVerifyDocs} onChange={e => setPerms({...perms, canVerifyDocs: e.target.checked})} />
              <span className="text-gray-700">Verify Documents</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer bg-white px-3 py-1.5 rounded shadow-sm border border-orange-100 hover:border-orange-300">
              <input type="checkbox" className="text-orange-600 focus:ring-orange-500 rounded" checked={perms.canProcessPayment} onChange={e => setPerms({...perms, canProcessPayment: e.target.checked})} />
              <span className="text-gray-700">Process Payments</span>
            </label>
              <label className="flex items-center space-x-2 cursor-pointer bg-white px-3 py-1.5 rounded shadow-sm border border-orange-100 hover:border-orange-300">
              <input type="checkbox" className="text-orange-600 focus:ring-orange-500 rounded" checked={perms.canEditVehicle} onChange={e => setPerms({...perms, canEditVehicle: e.target.checked})} />
              <span className="text-gray-700">Can Edit Vehicle</span>
            </label>
          </div>
          <button onClick={handleUpdatePermissions} 
            className="w-full md:w-auto px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 
             text-white font-semibold shadow-md 
             hover:opacity-70 hover:shadow-lg 
             transition-all duration-300"
          >
            Save Delegations
          </button>
        </div>
      )}

      {/* Add Vendor Form (Inline) */}
      {showAddModal && (
        <div className="mt-2 animate-in fade-in slide-in-from-top-2">
          <AddVendorForm onClose={() => setShowAddModal(false)} onSuccess={onRefresh} />
        </div>
      )}

      {/* Recursive Children Rendering */}
      {expanded && hasChildren && (
        <div className="mt-2">
          {vendor.children.map(child => (
            <VendorNode key={child.id} vendor={child} currentUser={currentUser} onRefresh={onRefresh} />
          ))}
        </div>
      )}
    </div>
  );
};
export default VendorNode;
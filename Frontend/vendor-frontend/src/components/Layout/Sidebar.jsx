import { Truck, Users, FileText, LogOut } from 'lucide-react';

const Sidebar = ({ user, activeTab, setActiveTab, onLogout }) => (
  <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col justify-between shadow-2xl z-20">
    <div className="p-6">
      <div className="flex items-center gap-3 mb-10 text-blue-400">
        <Truck size={32} /> 
        <span className="text-2xl font-bold tracking-tight text-white">MegaCabs</span>
      </div>
      
      <div className="mb-8 px-4 py-3 bg-slate-800 rounded-lg border border-slate-700">
        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">Current User</p>
        <p className="font-medium text-sm truncate">{user.email}</p>
        <p className="text-xs text-blue-400 mt-1 capitalize">{user.role?.toLowerCase().replace('_', ' ')}</p>
      </div>
      
      <nav className="space-y-2">
        <button 
          onClick={() => setActiveTab('hierarchy')}
          className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all duration-200 ${activeTab === 'hierarchy' ? 'bg-blue-600 text-black shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-black'}`}
        >
          <Users size={20} /> Vendor Network
        </button>
        <button 
          onClick={() => setActiveTab('fleet')}
          className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all duration-200 ${activeTab === 'fleet' ? 'bg-blue-600 text-black shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-black'}`}
        >
          <Truck size={20} /> Fleet Management
        </button>
        <button 
          onClick={() => setActiveTab('onboard')}
          className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all duration-200 ${activeTab === 'onboard' ? 'bg-blue-600 text-black shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-black'}`}
        >
          <FileText size={20} /> Onboard Driver
        </button>
      </nav>
    </div>
    <div className="p-6 border-t border-slate-800">
      <button onClick={onLogout} className="flex items-center gap-3 text-slate-400 hover:text-black transition-colors w-full px-4 py-2 hover:bg-slate-800 rounded-lg">
        <LogOut size={18} /> Sign Out
      </button>
    </div>
  </aside>
);
export default Sidebar;
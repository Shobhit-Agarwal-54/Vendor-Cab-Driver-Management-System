import { useState,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './components/Auth/Login.jsx'
import AddVendorForm from './components/Vendor/AddVendorForm.jsx'
import Dashboard from './components/pages/Dashboard.jsx'
import RegisterSuper from './components/Auth/RegisterSuper.jsx'
export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login'); // login | register | dashboard

  useEffect(() => {
    // Auto-login persistence
    const token = localStorage.getItem('token');
    console.log("Token found:", token);
    const storedUser = localStorage.getItem('user');
    console.log("Stored user:", storedUser);
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setView('dashboard');
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setView('login');
  };

  return (
    <div className="font-sans antialiased text-gray-900 bg-gray-100 min-h-screen">
      {view === 'login' && <Login onLogin={handleLogin} onSwitchToRegister={() => setView('register')} />}
      {view === 'register' && <RegisterSuper onSwitchToLogin={() => setView('login')} />}
      {view === 'dashboard' && user && <Dashboard user={user} onLogout={handleLogout} />}
    </div>
  );
}
import React, { useState } from 'react';
import { Truck, AlertCircle } from 'lucide-react';
import api from '../../services/api.js';
const Login = ({ onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await api.login(email, password);
      // Store token for persistence
      console.log(data);
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data));
      onLogin(data);
    } catch (err) {
      setError('Invalid credentials or server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Truck className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">MegaCabs</h1>
          <p className="mt-4 text-gray-700 ">Vendor Portal Login</p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-6 flex items-center text-sm">
            <AlertCircle size={16} className="mr-2" /> {error}
          </div>
        )}

        <form
         onSubmit={handleSubmit}
          className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
             className="w-full md:w-auto px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 
             text-white font-semibold shadow-md 
             hover:opacity-70 hover:shadow-lg 
             transition-all duration-300"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center pt-4 border-t border-gray-100">
          <button onClick={onSwitchToRegister}
             className="w-full md:w-auto px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 
             text-white font-semibold shadow-md 
             hover:opacity-70 hover:shadow-lg 
             transition-all duration-300"
           >
            Setup System (Super Vendor Registration)
          </button>
        </div>
      </div>
    </div>
  );
};
export default Login;
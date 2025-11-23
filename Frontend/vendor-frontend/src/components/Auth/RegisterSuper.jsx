const RegisterSuper = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({ email: '', password: '', region: '' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.registerSuper(formData);
      setMessage('Success! Redirecting to login...');
      setTimeout(onSwitchToLogin, 2000);
    } catch (err) {
      setMessage('Error: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">System Setup</h2>
        <p className="text-center text-gray-500 mb-6">Register the root Super Vendor</p>
        
        {message && (
          <div className={`p-3 rounded-lg mb-4 text-sm ${message.includes('Success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="Admin Email" className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500 outline-none" onChange={e => setFormData({...formData, email: e.target.value})} required />
          <input type="password" placeholder="Password" className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500 outline-none" onChange={e => setFormData({...formData, password: e.target.value})} required />
          <input type="text" placeholder="Region (e.g. Headquarters)" className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500 outline-none" onChange={e => setFormData({...formData, region: e.target.value})} required />
          <button type="submit" className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold shadow-md">Create Root Admin</button>
        </form>
        <button onClick={onSwitchToLogin} className="mt-4 w-full text-sm text-gray-500 hover:text-gray-800">Back to Login</button>
      </div>
    </div>
    );
};
export default RegisterSuper;
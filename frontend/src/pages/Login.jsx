import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://164.92.77.90:9000/api/users/login', credentials);
            const { token } = res.data;
            localStorage.setItem("authToken", token);
            navigate('/');
        } catch(e) {
            setError('Invalid credentials or Authentication server unreachable');
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <form onSubmit={handleLogin} className="bg-slate-800 p-8 rounded-xl shadow-2xl w-96 border border-slate-700">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Login to eCFR Tool</h2>
                {error && <div className="bg-red-500/20 text-red-300 p-3 rounded mb-4 text-sm text-center">{error}</div>}
                
                <input 
                    type="text" 
                    placeholder="Username"
                    value={credentials.username}
                    onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded p-3 mb-4 focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                />
                <input 
                    type="password" 
                    placeholder="Password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded p-3 mb-6 focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                />
                
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded transition-colors mb-4">
                    Secure Login
                </button>
                <div className="text-center">
                    <Link to="/register" className="text-indigo-400 text-sm hover:underline">Don't have an account? Register</Link>
                </div>
            </form>
        </div>
    );
};
export default Login;

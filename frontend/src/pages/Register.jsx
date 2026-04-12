import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:9000/api/users/register', form);
            navigate('/login');
        } catch(e) {
            setError(e.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <form onSubmit={handleRegister} className="bg-slate-800 p-8 rounded-xl shadow-2xl w-96 border border-slate-700">
                <h2 className="text-2xl font-bold text-emerald-400 mb-6 text-center">Register Secure Account</h2>
                {error && <div className="bg-red-500/20 text-red-300 p-3 rounded mb-4 text-sm text-center">{error}</div>}
                
                <input 
                    type="text" 
                    placeholder="Username"
                    value={form.username}
                    onChange={(e) => setForm({...form, username: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded p-3 mb-4 focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                />
                <input 
                    type="email" 
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded p-3 mb-4 focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                />
                <input 
                    type="password" 
                    placeholder="Strong Password"
                    value={form.password}
                    onChange={(e) => setForm({...form, password: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded p-3 mb-6 focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                />
                
                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded transition-colors mb-4">
                    Create Identity
                </button>
                <div className="text-center">
                    <Link to="/login" className="text-emerald-400 text-sm hover:underline">Already registered? Log in</Link>
                </div>
            </form>
        </div>
    );
};
export default Register;

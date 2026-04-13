import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPhoneAlt, FaLock } from 'react-icons/fa';
import toast from 'react-hot-toast';

const LoginPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    const [phone, setPhone] = React.useState('9981345677');
    const [password, setPassword] = React.useState('balu');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('https://nichepay.duckdns.org/api-zomato/api/partners/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, password })
            });

            const result = await response.json();

            if (response.ok) {
                // Store user data in localStorage
                localStorage.setItem('zomatoPartner', JSON.stringify(result.partner));
                toast.success(`Welcome back, ${result.partner.name}!`, {
                    icon: '🥘',
                });
                navigate('/dashboard');
            } else {
                toast.error(result.message || "Login failed");
            }
        } catch (error) {
            toast.error("Connection error! Make sure backend is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-gray-200 overflow-hidden border border-gray-100">
                <div className="p-8 md:p-12">
                    <div className="text-center mb-10">
                        <Link to="/" className="text-4xl font-black italic text-red-500 tracking-tighter">zomato</Link>
                        <h2 className="mt-6 text-2xl font-black text-gray-900">Partner Login</h2>
                        <p className="mt-2 text-gray-500 font-medium">Earn more with India's best fleet</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Mobile Number</label>
                            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 focus-within:border-red-500 transition-all">
                                <FaPhoneAlt className="text-gray-400 mr-3 shrink-0" />
                                <input 
                                    type="tel" 
                                    placeholder="Enter your registered mobile" 
                                    className="bg-transparent border-none outline-none w-full text-gray-700 font-medium" 
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Password</label>
                            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 focus-within:border-red-500 transition-all">
                                <FaLock className="text-gray-400 mr-3 shrink-0" />
                                <input 
                                    type="password" 
                                    placeholder="••••••••" 
                                    className="bg-transparent border-none outline-none w-full text-gray-700 font-medium" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <a href="#" className="underline text-sm font-bold text-red-500 hover:text-red-600">Forgot Password?</a>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`w-full bg-red-500 text-white py-4 rounded-2xl font-black text-lg hover:bg-red-600 transition-all shadow-lg shadow-red-200 active:scale-95 flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Logging in...' : 'Log In'}
                        </button>
                        <p className="mt-4 text-center text-[10px] text-gray-400 font-bold  bg-gray-50 py-2 rounded-xl border border-dashed border-gray-200">
                            Demo Access: <span className="text-red-500 select-all font-black ml-1">9981345677 / balu</span>
                        </p>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-gray-500 font-medium">New to Zomato Delivery?</p>
                        <Link 
                            to="/register" 
                            className="mt-2 inline-block text-red-500 font-black hover:scale-105 transition-transform"
                        >
                            Register as a Partner
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaLock, FaCreditCard } from 'react-icons/fa';
import toast from 'react-hot-toast';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('http://localhost:5000/api/partners/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                toast.success(`Welcome! Your ID is: ${result.partner.partnerId}`, {
                    duration: 5000,
                    icon: '🚀',
                });
                navigate('/login');
            } else {
                toast.error(result.message || "Registration failed");
            }
        } catch (error) {
            toast.error("Connection error! Make sure backend is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4 py-16">
            <div className="max-w-2xl w-full">
                <div className="text-center mb-12">
                    <Link to="/" className="text-4xl font-black italic text-red-500 tracking-tighter">zomato</Link>
                    <h2 className="mt-8 text-3xl font-black text-gray-900 leading-tight">Apply to Deliver <br className="hidden sm:block"/> & Start Earning</h2>
                    <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest text-xs">Join our 300k+ global partner fleet</p>
                </div>

                <div className="bg-white p-8 md:p-12 rounded-3xl border-2 border-gray-100 shadow-2xl shadow-gray-200">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Name */}
                        <div className="space-y-1">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Full Name</label>
                            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 focus-within:border-red-500 transition-all">
                                <FaUser className="text-gray-400 mr-3 shrink-0" />
                                <input name="name" type="text" placeholder="Enter your full name" className="bg-transparent border-none outline-none w-full text-gray-700 font-bold" required />
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="space-y-1">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Phone Number</label>
                            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 focus-within:border-red-500 transition-all">
                                <FaPhoneAlt className="text-gray-400 mr-3 shrink-0" />
                                <input name="phone" type="tel" placeholder="Enter mobile number" className="bg-transparent border-none outline-none w-full text-gray-700 font-bold" required />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Email Address</label>
                            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 focus-within:border-red-500 transition-all">
                                <FaEnvelope className="text-gray-400 mr-3 shrink-0" />
                                <input name="email" type="email" placeholder="Enter your email" className="bg-transparent border-none outline-none w-full text-gray-700 font-bold" required />
                            </div>
                        </div>

                        {/* UPI ID */}
                        <div className="space-y-1">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">UPI ID for Payouts</label>
                            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 focus-within:border-red-500 transition-all">
                                <FaCreditCard className="text-gray-400 mr-3 shrink-0" />
                                <input name="upi" type="text" placeholder="user@upi" className="bg-transparent border-none outline-none w-full text-gray-700 font-bold" required />
                            </div>
                        </div>

                        {/* Address */}
                        <div className="space-y-1 md:col-span-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Full Address</label>
                            <div className="flex items-start bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 focus-within:border-red-500 transition-all">
                                <FaMapMarkerAlt className="text-gray-400 mr-3 mt-1 shrink-0" />
                                <textarea name="address" rows={2} placeholder="Enter your complete address" className="bg-transparent border-none outline-none w-full text-gray-700 font-bold resize-none" required />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1 md:col-span-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Set Password</label>
                            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 focus-within:border-red-500 transition-all">
                                <FaLock className="text-gray-400 mr-3 shrink-0" />
                                <input name="password" type="password" placeholder="••••••••" className="bg-transparent border-none outline-none w-full text-gray-700 font-bold uppercase tracking-widest" required />
                            </div>
                        </div>

                        <div className="md:col-span-2 mt-4">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className={`w-full bg-red-500 text-white py-4 md:py-5 rounded-2xl font-black text-xl hover:bg-red-600 transition-all shadow-2xl shadow-red-200 active:scale-95 flex items-center justify-center gap-3 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Submitting Application...' : 'Submit Application'}
                            </button>
                            <p className="mt-6 text-center text-gray-500 font-medium">Already registered? <Link to="/login" className="text-red-500 font-black hover:underline underline-offset-4">Log in here</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;

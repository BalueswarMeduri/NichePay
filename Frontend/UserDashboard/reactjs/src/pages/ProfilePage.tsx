import { useState } from "react";
import { 
    FiGrid, 
    FiFileText, 
    FiClock, 
    FiBriefcase, 
    FiLogOut,
    FiUser,
    FiSettings,
    FiSmartphone,
    FiLock,
    FiMapPin,
    FiMail,
    FiPhone,
    FiCamera,
    FiCheckCircle,
    FiMenu,
    FiX,
    FiArrowUpRight
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { Logo } from "../components/Logo";

export default function ProfilePage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navLinks = [
        { to: "/dashboard", icon: <FiGrid className="size-4" />, label: "Dashboard" },
        { to: "/policy", icon: <FiFileText className="size-4" />, label: "My Policy" },
        { to: "/claims", icon: <FiClock className="size-4" />, label: "Claims History" },
        { to: "#", icon: <FiBriefcase className="size-4" />, label: "Wallet" },
        { to: "/profile", icon: <FiUser className="size-4" />, label: "Profile", active: true, mt: true },
    ];

    return (
        <div className="flex h-[100dvh] bg-[#f8fafc] overflow-hidden font-poppins">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-[#1e1e24] flex flex-col justify-between transform transition-transform duration-300 ease-in-out shrink-0
                lg:translate-x-0 lg:static lg:w-56
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div>
                    <div className="h-16 flex items-center justify-between px-5 border-b border-white/5">
                        <Link to="/" className="flex items-center gap-2">
                            <Logo className="h-6 text-primary-500" />
                            <span className="text-lg font-bold text-white tracking-tight">NichePay</span>
                        </Link>
                        <button 
                            className="lg:hidden text-white p-1 hover:bg-white/10 rounded-lg transition-colors"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <FiX className="size-5" />
                        </button>
                    </div>

                    <nav className="mt-4 px-3 space-y-1 text-sm">
                        {navLinks.map((link, idx) => (
                            <Link 
                                key={idx}
                                to={link.to} 
                                onClick={() => setIsSidebarOpen(false)}
                                className={`
                                    flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200
                                    ${link.active 
                                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20 font-semibold' 
                                        : 'text-slate-400 hover:text-white hover:bg-white/5 font-medium'}
                                    ${link.mt ? 'mt-4' : ''}
                                `}
                            >
                                {link.icon}
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="p-3 mb-2 text-sm">
                    <a href="/" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-white/5 px-3.5 py-2.5 rounded-xl font-medium transition-colors">
                        <FiLogOut className="size-4" />
                        Log Out
                    </a>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden w-full relative">
                {/* Header */}
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <button 
                            className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-xl border border-slate-200"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <FiMenu className="size-5" />
                        </button>
                        <div>
                            <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">Partner Profile</h1>
                            <p className="hidden md:block text-xs text-slate-500 font-medium">Manage your personal settings and verification IDs</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors">
                            <FiSettings className="size-3.5" /> 
                            <span>Account Settings</span>
                        </button>
                        <button className="size-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors sm:hidden">
                            <FiSettings className="size-4" />
                        </button>
                    </div>
                </header>

                <div className="p-4 md:p-8 flex-1 overflow-y-auto">
                    <div className="max-w-5xl mx-auto space-y-6">
                        
                        {/* Profile Hero Header */}
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
                            <div className="h-32 bg-slate-900 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 blur-[80px] -mr-32 -mt-32 rounded-full"></div>
                                <div className="absolute top-0 right-[20%] w-16 h-full bg-white/5 -skew-x-12"></div>
                                <div className="absolute top-0 right-[40%] w-0.5 h-full bg-white/10"></div>
                            </div>
                            
                            <div className="px-6 md:px-8 pb-8 -mt-16 relative z-10">
                                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                    <div className="flex flex-col md:flex-row items-start md:items-end gap-5">
                                        <div className="size-28 md:size-32 rounded-3xl bg-white p-1.5 shadow-xl relative group">
                                            <div className="w-full h-full rounded-2xl bg-slate-200 overflow-hidden relative">
                                                <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Rahul" className="w-full h-full object-cover" />
                                                <button className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                                    <FiCamera className="size-6 shadow-sm" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="mb-2">
                                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none">Rahul Sharma</h2>
                                            <div className="flex flex-wrap items-center gap-3 mt-3">
                                                <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-emerald-100 italic">verified partner</span>
                                                <span className="flex items-center gap-1 text-xs text-slate-400 font-bold uppercase tracking-widest"><FiMapPin className="size-3" /> Bangalore, IN</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button className="flex-1 md:flex-none px-6 py-3 bg-primary-500 text-white font-bold rounded-2xl hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/25 active:scale-[0.98]">
                                            Edit Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Personal Details Side */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="size-10 bg-primary-50 text-primary-500 rounded-2xl flex items-center justify-center">
                                            <FiUser className="size-5" />
                                        </div>
                                        <h3 className="font-bold text-slate-900 text-lg">Personal Information</h3>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="group">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase mb-2 tracking-widest group-hover:text-primary-500 transition-colors flex items-center gap-2 italic">
                                                <FiMail className="size-3" /> Registered Email
                                            </p>
                                            <p className="text-sm font-bold text-slate-800 bg-slate-50/50 p-3 rounded-xl border border-dashed border-slate-200">rahul.sharma@delivery.in</p>
                                        </div>
                                        <div className="group">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase mb-2 tracking-widest group-hover:text-primary-500 transition-colors flex items-center gap-2 italic">
                                                <FiPhone className="size-3" /> Mobile Number
                                            </p>
                                            <p className="text-sm font-bold text-slate-800 bg-slate-50/50 p-3 rounded-xl border border-dashed border-slate-200">+91 98765 43210</p>
                                        </div>
                                        <div className="group">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase mb-2 tracking-widest group-hover:text-primary-500 transition-colors flex items-center gap-2 italic">
                                                <FiMapPin className="size-3" /> Delivery Zone
                                            </p>
                                            <p className="text-sm font-bold text-slate-800 bg-slate-50/50 p-3 rounded-xl border border-dashed border-slate-200">Zone 1, Bangalore North</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-24 h-full bg-slate-50/50 -skew-x-12 translate-x-12 group-hover:translate-x-8 transition-transform"></div>
                                    <div className="flex justify-between items-center mb-8 relative z-10">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
                                                <FiLock className="size-5" />
                                            </div>
                                            <h3 className="font-bold text-slate-900 text-lg">Security & Privacy</h3>
                                        </div>
                                        <span className="text-[10px] font-black uppercase text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Strong Score</span>
                                    </div>
                                    
                                    <div className="space-y-4 relative z-10">
                                        <button className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors border border-slate-100">
                                            <div className="flex items-center gap-3">
                                                <FiLock className="size-4 text-slate-400" />
                                                <div className="text-left">
                                                    <p className="text-sm font-bold text-slate-900">Change Password</p>
                                                    <p className="text-[10px] text-slate-500 font-medium tracking-tight">Last updated 3 months ago</p>
                                                </div>
                                            </div>
                                            <FiArrowUpRight className="size-4 text-slate-300" />
                                        </button>
                                        <button className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors border border-slate-100">
                                            <div className="flex items-center gap-3">
                                                <FiSmartphone className="size-4 text-slate-400" />
                                                <div className="text-left">
                                                    <p className="text-sm font-bold text-slate-900">2-Factor Authentication</p>
                                                    <p className="text-[10px] text-emerald-500 font-black tracking-widest uppercase italic">Enabled</p>
                                                </div>
                                            </div>
                                            <div className="size-5 bg-emerald-500 rounded-full flex items-center justify-center">
                                                <FiCheckCircle className="size-3 text-white" />
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Zomato Sync Side */}
                            <div className="space-y-6">
                                <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between group">
                                    <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50/50 -skew-x-12 translate-x-1/2 group-hover:translate-x-1/3 transition-transform"></div>
                                    
                                    <div className="flex items-center gap-3 mb-6 relative z-10">
                                        <div className="size-10 bg-orange-50 text-primary-500 rounded-2xl flex items-center justify-center">
                                            <FiSmartphone className="size-5" />
                                        </div>
                                        <h3 className="font-bold text-slate-900 text-lg">Zomato Sync</h3>
                                    </div>
                                    
                                    <p className="text-sm text-slate-500 mb-6 font-medium leading-relaxed tracking-tight relative z-10">
                                        NichePay is linked to your Zomato ID for automated daily payout verification.
                                    </p>
                                    
                                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-4 relative z-10">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-1.5 leading-none tracking-widest">Zomato Partner ID</p>
                                        <p className="text-xl font-black text-slate-900 font-mono tracking-widest leading-none mt-1">ZM-847291</p>
                                        <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
                                            <span className="text-emerald-600 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                                                <FiCheckCircle className="size-3" /> Connected
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-bold">Updated: Today</span>
                                        </div>
                                    </div>
                                    
                                    <button className="w-full py-3 bg-slate-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200">
                                        Sync Status
                                    </button>
                                </div>

                                <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-6 text-white shadow-xl shadow-primary-500/20 relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-full h-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                    <h3 className="text-lg font-bold mb-2">Pro Shield Policy</h3>
                                    <p className="text-xs text-white/70 font-medium mb-5 leading-relaxed">You are currently protected against weather disruptions in Bangalore.</p>
                                    <Link to="/policy" className="w-full py-3 bg-white text-primary-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:shadow-lg transition-all flex items-center justify-center gap-2">
                                        View Details <FiArrowUpRight />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

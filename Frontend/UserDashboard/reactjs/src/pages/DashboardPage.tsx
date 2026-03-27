import React, { useState, cloneElement } from "react";
import { 
    FiGrid, 
    FiFileText, 
    FiClock, 
    FiBriefcase, 
    FiLogOut,
    FiUser,
    FiBell,
    FiShield,
    FiUmbrella,
    FiCreditCard,
    FiMoreVertical,
    FiCheckCircle,
    FiCloudRain,
    FiSun,
    FiMinusCircle,
    FiArrowUpRight,
    FiMenu,
    FiX
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo";

export default function DashboardPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        localStorage.removeItem("partnerId");
        navigate("/");
    };

    const navLinks = [
        { to: "/dashboard", icon: <FiGrid className="size-4" />, label: "Dashboard", active: true },
        { to: "/policy", icon: <FiFileText className="size-4" />, label: "My Policy" },
        { to: "/claims", icon: <FiClock className="size-4" />, label: "Claims History" },
        { to: "#", icon: <FiBriefcase className="size-4" />, label: "Wallet" },
        { to: "/profile", icon: <FiUser className="size-4" />, label: "Profile", mt: true },
    ];

    return (
        <div className="flex h-[100dvh] bg-slate-50 overflow-hidden font-poppins">
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
                    {/* Logo Area */}
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

                    {/* Navigation Links */}
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
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 text-slate-400 hover:text-white hover:bg-white/5 px-3.5 py-2.5 rounded-xl font-medium transition-colors">
                        <FiLogOut className="size-4" />
                        Log Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-[100dvh] overflow-hidden w-full relative">
                {/* Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 shrink-0 sticky top-0 z-10 w-full">
                    <div className="flex items-center gap-4 truncate">
                        <button 
                            className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-xl border border-slate-200 transition-colors shrink-0"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <FiMenu className="size-5" />
                        </button>
                        <div className="truncate">
                            <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">Dashboard</h1>
                            <p className="hidden md:block text-xs text-slate-500 font-medium tracking-tight">Welcome back, Rahul • Zomato ID: #8821</p>
                            <p className="md:hidden text-[10px] text-slate-500 font-medium">Rahul • #8821</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 md:gap-3 shrink-0">
                        <button className="size-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors relative">
                            <FiBell className="size-4" />
                            <div className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white"></div>
                        </button>
                        <Link to="/profile" className="size-9 rounded-full bg-slate-300 overflow-hidden border border-slate-200 ml-1">
                            <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Profile" className="w-full h-full object-cover" />
                        </Link>
                    </div>
                </header>

                {/* Dashboard Scroll Container */}
                <div className="p-4 md:p-6 lg:p-8 flex-1 overflow-y-auto w-full flex flex-col lg:justify-center">
                    {/* The Grid - Removed h-full on mobile for natural scrolling, h-auto ensures boxes don't overflow parent before scroll kicks in */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-4 h-auto lg:h-full">
                        
                        {/* Policy Holder Card - Big Black Box */}
                        <div className="bg-[#1e1e24] rounded-3xl p-6 text-white relative overflow-hidden shadow-xl shadow-slate-200 flex flex-col justify-between min-h-[240px] md:min-h-[220px]">
                            <div className="absolute -top-10 -right-10 size-28 bg-white/5 rounded-full blur-2xl"></div>
                            
                            <div className="flex justify-between items-start relative z-10 mb-4 md:mb-0">
                                <FiShield className="size-5 text-slate-300" />
                                <div className="flex gap-1 opacity-50">
                                    <div className="h-3 w-0.5 rounded-full bg-white"></div>
                                    <div className="h-4 w-0.5 rounded-full bg-white mt-1"></div>
                                    <div className="h-2 w-0.5 rounded-full bg-white mt-2"></div>
                                </div>
                            </div>
                            
                            <div className="relative z-10">
                                <p className="text-[10px] text-slate-400 font-bold tracking-widest mb-1 uppercase">Policy Holder</p>
                                <h2 className="text-xl font-bold leading-tight">Rahul Sharma</h2>
                            </div>

                            <div className="relative z-10 mt-4">
                                <p className="text-[10px] text-slate-400 font-bold tracking-widest mb-1.5 uppercase">Protected Balance (Month)</p>
                                <div className="flex items-end gap-2 flex-wrap">
                                    <span className="text-3xl md:text-4xl font-bold tracking-tight">₹5,200</span>
                                    <span className="text-emerald-400 text-xs font-semibold mb-1.5 flex items-center gap-0.5">
                                        <FiArrowUpRight className="size-3" /> Active
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-between pt-4 border-t border-white/10 relative z-10 mt-5">
                                <div>
                                    <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold mb-0.5 leading-none">Plan</p>
                                    <p className="text-sm font-semibold mt-1">Pro Shield</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold mb-0.5 leading-none">Renewal</p>
                                    <p className="text-sm font-semibold mt-1">Mon, 12 Oct</p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions Grid */}
                        <div className="grid grid-cols-2 gap-4 h-full">
                            {[
                                { to: "/policy", icon: <FiUmbrella />, label: "Check Cover", bg: "bg-orange-50", color: "text-primary-500", border: "hover:border-primary-200" },
                                { to: "/claims", icon: <FiFileText />, label: "Claims", bg: "bg-purple-50", color: "text-purple-500", border: "hover:border-purple-200" },
                                { to: "#", icon: <FiCreditCard />, label: "Withdraw", bg: "bg-blue-50", color: "text-blue-500", border: "hover:border-blue-200" },
                                { to: "/claims", icon: <FiClock />, label: "History", bg: "bg-slate-50", color: "text-slate-600", border: "hover:border-slate-300" }
                            ].map((action, idx) => (
                                <Link 
                                    key={idx}
                                    to={action.to} 
                                    className={`bg-white rounded-3xl p-4 md:p-3 xl:p-4 flex flex-col items-center justify-center gap-3 hover:shadow-lg transition-all border border-slate-100 group ${action.border}`}
                                >
                                    <div className={`size-11 md:size-10 xl:size-12 rounded-full ${action.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                        {cloneElement(action.icon as React.ReactElement<any>, { className: `size-5 md:size-4 xl:size-5 ${action.color}` })}
                                    </div>
                                    <span className="text-sm md:text-xs xl:text-sm font-bold text-slate-700 text-center leading-tight whitespace-normal">{action.label}</span>
                                </Link>
                            ))}
                        </div>

                        {/* Disruption Monitor */}
                        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative flex flex-col justify-between min-h-[240px] md:min-h-[220px]">
                            <div className="flex justify-between items-start">
                                <div className="max-w-[80%] pr-2">
                                    <h3 className="font-bold text-slate-900 tracking-tight text-base mb-0.5 uppercase">Disruption Monitor</h3>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Live Bangalore Zone 1</p>
                                </div>
                                <div className="size-2 bg-red-500 rounded-full animate-pulse border-2 border-white mt-1 shrink-0"></div>
                            </div>

                            <div className="flex justify-between items-end mt-4">
                                <h2 className="text-2xl font-bold text-slate-900 leading-none">Heavy<br/>Rain</h2>
                                <div className="text-right">
                                    <span className="text-primary-500 font-bold text-2xl block leading-none">85%</span>
                                    <span className="text-primary-500 text-[10px] uppercase tracking-wider font-black">Intensity</span>
                                </div>
                            </div>
                            
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mt-4 mb-4 shadow-inner">
                                <div className="h-full bg-primary-500 w-[85%] rounded-full shadow-lg shadow-primary-500/20"></div>
                            </div>

                            <div className="bg-orange-50 border border-primary-100 rounded-2xl p-4 flex gap-3 items-center mt-auto">
                                <div className="text-primary-600 shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                                </div>
                                <p className="text-xs text-primary-800 font-bold leading-none">Payout Active: ₹150 / hr</p>
                            </div>
                        </div>

                        {/* Premium Plan Box */}
                        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between min-h-[240px] md:min-h-[220px]">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-bold text-slate-900 text-base uppercase tracking-tight">Premium Plan</h3>
                                <button className="text-[10px] font-black text-primary-500 hover:text-primary-600 transition-colors uppercase tracking-widest">+ Upgrade</button>
                            </div>

                            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 mb-4 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-16 h-full bg-primary-500/5 -skew-x-12 translate-x-8"></div>
                                <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase mb-1.5">Weekly Auto-Debit</p>
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">₹84.00</h2>
                                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold italic">
                                    <FiClock className="size-3.5 shrink-0" />
                                    <span className="truncate">Next: Tomorrow, 2 PM</span>
                                </div>
                            </div>

                            <div className="border border-slate-100 rounded-2xl p-4 flex items-center gap-4 mt-auto hover:bg-slate-50/50 transition-colors">
                                <div className="size-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                    <FiCheckCircle className="size-5 text-emerald-500" />
                                </div>
                                <div className="truncate">
                                    <p className="text-slate-900 font-bold text-sm truncate">Coverage Active</p>
                                    <p className="text-slate-500 text-[10px] uppercase font-bold mt-0.5 truncate tracking-tighter">Verified Continuous</p>
                                </div>
                            </div>
                        </div>

                        {/* Protection Stats */}
                        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between min-h-[240px] md:min-h-[220px]">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-bold text-slate-900 text-base leading-tight uppercase tracking-tight">Income<br/>Ledger</h3>
                                <button className="flex items-center gap-1 text-[10px] font-black uppercase text-slate-500 hover:text-slate-700 bg-slate-50 px-3 py-1 rounded-xl border border-slate-200 tracking-widest shrink-0">
                                    Month
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                </button>
                            </div>

                            <div className="flex justify-between mb-4 px-1 gap-4">
                                <div className="truncate">
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Lost</p>
                                    <p className="text-xl font-black text-slate-900 tracking-tighter">₹4,800</p>
                                </div>
                                <div className="text-right truncate">
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Saved</p>
                                    <p className="text-xl font-black text-primary-500 tracking-tighter">₹3,500</p>
                                </div>
                            </div>

                            <div className="relative flex-1 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center p-5 min-h-[110px] mt-auto">
                                <div className="relative w-28 h-14 overflow-hidden">
                                    <div className="absolute top-0 left-0 w-28 h-28 rounded-full border-[12px] border-slate-200 border-b-transparent border-r-transparent -rotate-45"></div>
                                    <div className="absolute top-0 left-0 w-28 h-28 rounded-full border-[12px] border-primary-500 border-b-transparent border-r-transparent rotate-[25deg]"></div>
                                </div>
                                <div className="absolute bottom-4 flex flex-col items-center">
                                    <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-0.5">Coverage</span>
                                    <span className="text-3xl font-black text-slate-900 leading-none tracking-tight">72%</span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Payouts */}
                        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between min-h-[240px] md:min-h-[220px]">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-bold text-slate-900 text-base uppercase tracking-tight">Payout History</h3>
                                <button className="text-slate-400 hover:text-slate-600 p-1 shrink-0">
                                    <FiMoreVertical className="size-5" />
                                </button>
                            </div>

                            <div className="flex flex-col gap-4 mt-auto">
                                {/* Item 1 */}
                                <div className="flex items-center justify-between group cursor-pointer overflow-hidden">
                                    <div className="flex gap-4 items-center truncate">
                                        <div className="size-10 rounded-2xl bg-slate-100 shrink-0 flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-all text-slate-500">
                                            <FiCloudRain className="size-5" />
                                        </div>
                                        <div className="truncate">
                                            <p className="font-bold text-slate-900 text-sm leading-tight truncate">Rain: 2hrs</p>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5 truncate">Today • 16:05</p>
                                        </div>
                                    </div>
                                    <span className="font-black text-emerald-500 text-base shrink-0 ml-2">+₹300</span>
                                </div>
                                
                                {/* Item 2 */}
                                <div className="flex items-center justify-between group cursor-pointer overflow-hidden">
                                    <div className="flex gap-4 items-center truncate">
                                        <div className="size-10 rounded-2xl bg-slate-100 shrink-0 flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-all text-slate-500">
                                            <FiSun className="size-5" />
                                        </div>
                                        <div className="truncate">
                                            <p className="font-bold text-slate-900 text-sm leading-tight truncate">Heat Wave</p>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5 truncate">Wed • 13:05</p>
                                        </div>
                                    </div>
                                    <span className="font-black text-emerald-500 text-base shrink-0 ml-2">+₹150</span>
                                </div>

                                {/* Item 3 */}
                                <div className="flex items-center justify-between group cursor-pointer overflow-hidden">
                                    <div className="flex gap-4 items-center truncate">
                                        <div className="size-10 rounded-2xl bg-slate-100 shrink-0 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all text-slate-500">
                                            <FiMinusCircle className="size-5" />
                                        </div>
                                        <div className="truncate">
                                            <p className="font-bold text-slate-900 text-sm leading-tight truncate">Premium</p>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5 truncate">Mon • 13:05</p>
                                        </div>
                                    </div>
                                    <span className="font-black text-slate-900 text-base shrink-0 ml-2">-₹84</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}

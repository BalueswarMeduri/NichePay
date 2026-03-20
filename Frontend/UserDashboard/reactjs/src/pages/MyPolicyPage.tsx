import { useState } from "react";
import { 
    FiGrid, 
    FiFileText, 
    FiClock, 
    FiBriefcase, 
    FiLogOut,
    FiUser,
    FiShield,
    FiDownload,
    FiExternalLink,
    FiCheckCircle,
    FiMenu,
    FiX
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { Logo } from "../components/Logo";

export default function MyPolicyPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navLinks = [
        { to: "/dashboard", icon: <FiGrid className="size-4" />, label: "Dashboard" },
        { to: "/policy", icon: <FiFileText className="size-4" />, label: "My Policy", active: true },
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
                <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary-500/5 blur-[100px] -z-10 rounded-full"></div>
                
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
                            <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">My Policy</h1>
                            <p className="hidden md:block text-xs text-slate-500 font-medium tracking-tight">Detailed breakdown of your active coverage</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] md:text-xs font-semibold hover:bg-slate-800 transition-colors uppercase tracking-widest active:scale-95">
                            <FiDownload className="size-3.5" /> 
                            <span className="hidden sm:inline">Download PDF</span>
                            <span className="sm:hidden">PDF</span>
                        </button>
                    </div>
                </header>

                <div className="p-4 md:p-8 flex-1 overflow-y-auto">
                    <div className="max-w-5xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Main Policy Card */}
                            <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
                                <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200 shadow-sm relative overflow-hidden min-h-[350px] flex flex-col items-center justify-center text-center group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50/50 -mr-16 -mt-16 rounded-full blur-2xl group-hover:bg-primary-100/50 transition-colors"></div>
                                    <div className="size-20 bg-primary-50 text-primary-500 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
                                        <FiShield className="size-10" />
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-3 tracking-tight">Policy Documentation</h2>
                                    <p className="text-slate-500 max-w-md mx-auto mb-8 leading-relaxed font-medium">
                                        Your Pro Shield policy documents (Policy ID #NP-2023-8821) are being finalized and will be available for download within 24 hours.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                                        <button className="px-8 py-3.5 bg-primary-500 text-white font-black rounded-2xl hover:bg-primary-600 transition-all shadow-xl shadow-primary-500/25 active:scale-[0.98] uppercase tracking-widest text-xs">
                                            Refresh Status
                                        </button>
                                        <button className="px-8 py-3.5 bg-slate-100 text-slate-700 font-bold rounded-2xl hover:bg-slate-200 transition-colors active:scale-[0.98] uppercase tracking-widest text-xs">
                                            View Sample
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm hover:border-emerald-200 transition-colors">
                                        <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-3 text-lg">
                                            <FiCheckCircle className="text-emerald-500 size-5" /> Coverage Benefits
                                        </h3>
                                        <ul className="space-y-4 text-sm text-slate-600 font-bold italic">
                                            <li className="flex items-start gap-3">
                                                <div className="mt-1 size-1.5 rounded-full bg-emerald-500 shrink-0"></div>
                                                Disruption from heavy rains
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <div className="mt-1 size-1.5 rounded-full bg-emerald-500 shrink-0"></div>
                                                Medical emergencies during fleet
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <div className="mt-1 size-1.5 rounded-full bg-emerald-500 shrink-0"></div>
                                                Accidental vehicle damage cover
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <div className="mt-1 size-1.5 rounded-full bg-emerald-500 shrink-0"></div>
                                                Income protection (80%)
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm hover:border-primary-200 transition-colors">
                                        <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-3 text-lg tracking-tight">
                                            <FiClock className="text-primary-500 size-5" /> Active Duration
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-dashed border-slate-200">
                                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Effective Date</span>
                                                <span className="font-black text-slate-900">Oct 12, 2023</span>
                                            </div>
                                            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-dashed border-slate-200">
                                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Next Renewal</span>
                                                <span className="font-black text-slate-900">Oct 19, 2023</span>
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-center">
                                                <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-4 py-1.5 rounded-full uppercase tracking-tighter border border-emerald-100 animate-pulse">Status: Auto-Active</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Sidebar Info */}
                            <div className="space-y-6 order-1 lg:order-2">
                                <div className="bg-[#1e1e24] rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-slate-200 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -mr-16 -mt-16 rounded-full blur-3xl"></div>
                                    <h3 className="text-xl font-bold mb-6 tracking-tight">Quick Links</h3>
                                    <div className="space-y-3">
                                        <button className="w-full flex items-center justify-between px-5 py-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5 hover:border-white/20 text-sm font-bold tracking-tight">
                                            <span className="uppercase tracking-widest text-[10px]">Terms & Conditions</span>
                                            <FiExternalLink className="size-4 text-slate-500" />
                                        </button>
                                        <button className="w-full flex items-center justify-between px-5 py-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5 hover:border-white/20 text-sm font-bold tracking-tight">
                                            <span className="uppercase tracking-widest text-[10px]">Privacy Policy</span>
                                            <FiExternalLink className="size-4 text-slate-500" />
                                        </button>
                                        <button className="w-full flex items-center justify-between px-5 py-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5 hover:border-white/20 text-sm font-bold tracking-tight">
                                            <span className="uppercase tracking-widest text-[10px]">Claim Guidelines</span>
                                            <FiExternalLink className="size-4 text-slate-500" />
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="bg-primary-50 border border-primary-100 rounded-3xl p-6 md:p-8 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/50 -mr-12 -mt-12 rounded-full blur-2xl"></div>
                                    <h3 className="font-black text-primary-900 mb-2 uppercase tracking-wide text-lg">Need Help?</h3>
                                    <p className="text-sm text-primary-700 font-bold italic mb-6 leading-relaxed">Our support team is available 24/7 for delivery partners.</p>
                                    <button className="w-full py-4 bg-white text-primary-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-md hover:shadow-lg transition-all active:scale-95">
                                        Contact Support
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

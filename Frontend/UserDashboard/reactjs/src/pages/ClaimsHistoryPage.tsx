import { useState } from "react";
import { 
    FiGrid, 
    FiFileText, 
    FiClock, 
    FiBriefcase, 
    FiLogOut,
    FiUser,
    FiShield,
    FiTrendingUp,
    FiArrowUpRight,
    FiFilter,
    FiDownload,
    FiCheckCircle,
    FiMenu,
    FiX
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { Logo } from "../components/Logo";

export default function ClaimsHistoryPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navLinks = [
        { to: "/dashboard", icon: <FiGrid className="size-4" />, label: "Dashboard" },
        { to: "/policy", icon: <FiFileText className="size-4" />, label: "My Policy" },
        { to: "/claims", icon: <FiClock className="size-4" />, label: "Claims History", active: true },
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
                            <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">Claims Ledger</h1>
                            <p className="hidden md:block text-xs text-slate-500 font-medium">Overview of automated payouts and deductions</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3">
                        <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors">
                            <FiFilter className="size-3.5" /> 
                            <span>Filter</span>
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] md:text-xs font-semibold hover:bg-slate-800 transition-colors uppercase tracking-widest active:scale-95">
                            <FiDownload className="size-3.5" /> 
                            <span className="hidden sm:inline">Export History</span>
                            <span className="sm:hidden">Export</span>
                        </button>
                    </div>
                </header>

                <div className="p-4 md:p-8 flex-1 overflow-y-auto w-full">
                    <div className="max-w-5xl mx-auto space-y-6">
                        
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-50/50 -mr-8 -mt-8 rounded-full blur-xl group-hover:bg-emerald-100/50 transition-colors"></div>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-3 italic">Lifetime Payouts</p>
                                <div className="flex items-center justify-between">
                                    <h2 className="text-3xl font-black text-emerald-500 tracking-tighter">₹8,450</h2>
                                    <div className="size-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 shadow-sm">
                                        <FiTrendingUp className="size-5" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-primary-50/50 -mr-8 -mt-8 rounded-full blur-xl group-hover:bg-primary-100/50 transition-colors"></div>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-3 italic">Active Claims (Month)</p>
                                <div className="flex items-center justify-between">
                                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic">12</h2>
                                    <div className="size-10 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-500 shadow-sm">
                                        <FiCheckCircle className="size-5" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group sm:col-span-2 md:col-span-1">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-orange-50/50 -mr-8 -mt-8 rounded-full blur-xl group-hover:bg-orange-100/50 transition-colors"></div>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-3 italic">Pending Verification</p>
                                <div className="flex items-center justify-between">
                                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic opacity-20">00</h2>
                                    <div className="size-10 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 shadow-sm">
                                        <FiClock className="size-5" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Claims Ledger Table */}
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                <h3 className="font-black text-slate-900 text-[10px] md:text-xs uppercase tracking-widest">Full Payout Transaction History</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-3 py-1.5 rounded-xl uppercase border border-emerald-100 italic tracking-tighter">Live Parametric Ledger</span>
                                </div>
                            </div>
                            
                            <div className="flex-1 overflow-x-auto">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-slate-50/50 text-slate-500 uppercase font-black text-[10px] tracking-[0.2em] border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-5">Trigger Event Description</th>
                                            <th className="px-6 py-5 hidden md:table-cell">Verification Mode</th>
                                            <th className="px-6 py-5">Date & Time</th>
                                            <th className="px-6 py-5 text-right">Amount Change</th>
                                            <th className="px-6 py-5 text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 font-bold text-slate-700 italic">
                                        {[
                                            { title: "Rain Disruption: Bangalore Zone 1", mode: "Auto-Trigger / ZM Sync", date: "Today, 16:05", amount: "+ ₹300", type: "credit", icon: <FiShield />, iconBg: "bg-primary-50", iconColor: "text-primary-500" },
                                            { title: "Heat Wave Allowance (Delhi BCR)", mode: "Parametric Hub", date: "Yesterday, 13:05", amount: "+ ₹150", type: "credit", icon: <FiClock />, iconBg: "bg-orange-50", iconColor: "text-orange-500" },
                                            { title: "Weekly Auto-Debit: Pro Shield", mode: "UPI / NichePay Wallet", date: "12 Oct, 14:00", amount: "- ₹84", type: "debit", icon: <FiLogOut className="rotate-180" />, iconBg: "bg-slate-100", iconColor: "text-slate-900" },
                                            { title: "Bandh / Local Curfew Bonus", mode: "Zone Disruption HUB", date: "08 Oct, 09:15", amount: "+ ₹500", type: "credit", icon: <FiShield />, iconBg: "bg-primary-50", iconColor: "text-primary-500" },
                                            { title: "Weekly Auto-Debit: Pro Shield", mode: "UPI / NichePay Wallet", date: "05 Oct, 14:00", amount: "- ₹84", type: "debit", icon: <FiLogOut className="rotate-180" />, iconBg: "bg-slate-100", iconColor: "text-slate-900" }
                                        ].map((item, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50 transition-all cursor-pointer group uppercase tracking-tight">
                                                <td className="px-6 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`size-10 rounded-2xl ${item.iconBg} ${item.iconColor} flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                                                            {item.icon}
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-slate-900 text-sm whitespace-normal md:whitespace-nowrap">{item.title}</p>
                                                            <p className="md:hidden text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">{item.mode}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 text-slate-400 italic font-black text-[10px] hidden md:table-cell tracking-widest uppercase">{item.mode}</td>
                                                <td className="px-6 py-6 text-slate-500 font-black text-xs uppercase tracking-tighter">{item.date}</td>
                                                <td className={`px-6 py-6 text-right font-black text-base italic tracking-tighter ${item.type === 'credit' ? 'text-emerald-500' : 'text-slate-900 underline decoration-slate-200 underline-offset-4'}`}>
                                                    {item.amount}
                                                </td>
                                                <td className="px-6 py-6 text-center">
                                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border italic tracking-[0.1em] ${item.type === 'credit' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                                                        {item.type === 'credit' ? 'Settled' : 'Paid'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="p-8 border-t border-slate-100 text-center bg-slate-50/30">
                                <button className="text-[10px] font-black text-primary-500 hover:text-primary-600 uppercase tracking-widest flex items-center gap-3 mx-auto shadow-sm bg-white px-6 py-3 rounded-2xl border border-slate-200 transition-all hover:shadow-md active:scale-95">
                                    View Full History (24 more items) <FiArrowUpRight />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

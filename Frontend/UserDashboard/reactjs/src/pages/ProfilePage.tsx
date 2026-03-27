import { useState, useEffect } from "react";
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
    FiArrowUpRight,
    FiShield
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo";

export default function ProfilePage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const partnerId = localStorage.getItem("partnerId");

    useEffect(() => {
        if (!partnerId) {
            navigate("/");
            return;
        }

        const fetchProfile = async () => {
            try {
                const res = await fetch(`http://localhost:5002/api/policy/profile/${partnerId}`);
                if (res.ok) {
                    const data = await res.json();
                    setProfile(data.partner);
                } else {
                    console.error("Failed to fetch profile");
                }
            } catch (err) {
                console.error("Error fetching profile", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [partnerId, navigate]);

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        localStorage.removeItem("partnerId");
        navigate("/");
    };

    const navLinks = [
        { to: "/dashboard", icon: <FiGrid className="size-5" />, label: "Dashboard" },
        { to: "/policy", icon: <FiFileText className="size-5" />, label: "My Policy" },
        { to: "/claims", icon: <FiClock className="size-5" />, label: "Claims History" },
        { to: "#", icon: <FiBriefcase className="size-5" />, label: "Wallet" },
        { to: "/profile", icon: <FiUser className="size-5" />, label: "Profile", active: true, mt: true },
    ];

    return (
        <div className="flex h-[100dvh] bg-black text-white font-poppins relative overflow-hidden">
            {/* Dark Mode Background Effects */}
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary-600/10 blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary-900/20 blur-[150px] pointer-events-none"></div>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 bg-black/40 backdrop-blur-2xl border-r border-white/10 flex flex-col justify-between transform transition-transform duration-300 ease-in-out shrink-0
                lg:translate-x-0 lg:static
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div>
                    <div className="h-20 flex items-center justify-between px-8 border-b border-white/10">
                        <Link to="/" className="flex items-center gap-3 group">
                            <Logo className="h-8 text-primary-500 group-hover:drop-shadow-[0_0_15px_rgba(var(--primary-500),0.8)] transition-all duration-300" />
                            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">NichePay</span>
                        </Link>
                        <button 
                            className="lg:hidden text-slate-400 hover:text-white p-2 hover:bg-white/10 rounded-xl transition-colors"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <FiX className="size-6" />
                        </button>
                    </div>

                    <nav className="mt-8 px-4 space-y-2 text-sm font-medium">
                        {navLinks.map((link, idx) => (
                            <Link 
                                key={idx}
                                to={link.to} 
                                onClick={() => setIsSidebarOpen(false)}
                                className={`
                                    flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 relative overflow-hidden group
                                    ${link.active 
                                        ? 'bg-white/10 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]' 
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'}
                                    ${link.mt ? 'mt-6' : ''}
                                `}
                            >
                                {link.active && (
                                    <div className="absolute inset-y-0 left-0 w-1 bg-primary-500 shadow-[0_0_10px_rgba(var(--primary-500),1)]"></div>
                                )}
                                <span className={`${link.active ? 'text-primary-400' : 'group-hover:text-primary-400 transition-colors'}`}>
                                    {link.icon}
                                </span>
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="p-4 mb-4 text-sm font-medium">
                    <button 
                        onClick={handleLogout} 
                        className="w-full flex items-center gap-4 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 px-4 py-3.5 rounded-2xl transition-all duration-300 group"
                    >
                        <FiLogOut className="size-5 group-hover:-translate-x-1 transition-transform" />
                        Log Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden w-full relative z-10">
                {/* Header */}
                <header className="h-20 bg-black/40 backdrop-blur-2xl border-b border-white/10 flex items-center justify-between px-6 md:px-10 shrink-0 sticky top-0 z-20">
                    <div className="flex items-center gap-5">
                        <button 
                            className="lg:hidden p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <FiMenu className="size-6" />
                        </button>
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 leading-tight">Partner Profile</h1>
                            <p className="hidden md:block text-xs text-slate-400 mt-1 font-medium tracking-wide">Manage your details & security preferences</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl text-xs font-semibold hover:bg-white/10 hover:border-white/20 transition-all duration-300 shadow-lg">
                            <FiSettings className="size-4" /> 
                            <span>Settings</span>
                        </button>
                    </div>
                </header>

                <div className="p-4 md:p-8 flex-1 overflow-y-auto custom-scrollbar">
                    <div className="max-w-5xl mx-auto space-y-8 pb-12">
                        
                        {/* Profile Hero Glass Panel */}
                        <div className="group relative rounded-[2rem] border border-white/10 bg-white/[0.02] shadow-2xl overflow-hidden backdrop-blur-xl transition-all duration-500 hover:bg-white/[0.04] hover:border-white/20">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                            
                            <div className="h-40 bg-gradient-to-r from-slate-900 to-black relative border-b border-white/5 overflow-hidden">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 Mix-blend-overlay"></div>
                                <div className="absolute top-0 right-1/4 w-32 h-full bg-primary-500/10 -skew-x-12 blur-[2px]"></div>
                            </div>
                            
                            <div className="px-6 md:px-10 py-8 relative z-10">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-6">
                                        <div className="text-left">
                                            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-none text-white drop-shadow-md">
                                                {isLoading ? (
                                                    <div className="h-10 w-48 bg-white/10 animate-pulse rounded-lg"></div>
                                                ) : profile?.name || "Partner Name"}
                                            </h2>
                                            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mt-4">
                                                <span className="flex items-center gap-1.5 bg-primary-500/20 text-primary-300 px-3 py-1.5 rounded-full text-xs font-bold uppercase border border-primary-500/40 shadow-[0_0_15px_rgba(var(--primary-500),0.2)]">
                                                    <FiShield size={12} /> Verified
                                                </span>
                                                <span className="flex items-center gap-2 text-sm text-slate-400 font-semibold tracking-wide">
                                                    <FiMapPin className="size-4 text-primary-400" /> 
                                                    {isLoading ? "..." : profile?.address || "Location Unavailable"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-start w-full md:w-auto">
                                        <button className="w-full md:w-auto px-8 py-3.5 bg-white text-black font-bold rounded-2xl hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] active:scale-[0.98]">
                                            Edit Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Personal Info Grid */}
                            <div className="lg:col-span-2 space-y-8">
                                <div className="bg-white/[0.02] rounded-[2rem] p-8 md:p-10 border border-white/10 shadow-xl backdrop-blur-md relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-primary-400 to-primary-600 opacity-50"></div>
                                    
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="size-12 bg-white/5 border border-white/10 text-primary-400 rounded-2xl flex items-center justify-center shadow-inner">
                                            <FiUser className="size-6" />
                                        </div>
                                        <h3 className="font-bold text-xl tracking-tight">Personal Details</h3>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
                                        <div>
                                            <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                                <FiMail className="size-3.5 text-primary-500" /> Registered Email
                                            </p>
                                            {isLoading ? (
                                                <div className="h-6 w-3/4 bg-white/5 animate-pulse rounded"></div>
                                            ) : (
                                                <p className="text-lg font-semibold text-slate-200">{profile?.email || "No Email"}</p>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                                <FiPhone className="size-3.5 text-primary-500" /> Mobile Number
                                            </p>
                                            {isLoading ? (
                                                <div className="h-6 w-3/4 bg-white/5 animate-pulse rounded"></div>
                                            ) : (
                                                <p className="text-lg font-semibold text-slate-200">{profile?.phone || "+91 00000 00000"}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Security Settings */}
                                <div className="bg-white/[0.02] rounded-[2rem] p-8 md:p-10 border border-white/10 shadow-xl backdrop-blur-md relative">
                                    <div className="flex justify-between items-center mb-10">
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 bg-white/5 border border-white/10 text-slate-300 rounded-2xl flex items-center justify-center shadow-inner">
                                                <FiLock className="size-6" />
                                            </div>
                                            <h3 className="font-bold text-xl tracking-tight">Security</h3>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <button className="w-full flex items-center justify-between p-5 bg-black/40 hover:bg-white/5 rounded-2xl transition-colors border border-white/5 group">
                                            <div className="flex items-center gap-4">
                                                <FiLock className="size-5 text-slate-400" />
                                                <div className="text-left">
                                                    <p className="text-sm font-bold text-slate-200">Change Password</p>
                                                    <p className="text-xs text-slate-500 mt-1">Last updated 3 months ago</p>
                                                </div>
                                            </div>
                                            <FiArrowUpRight className="size-5 text-slate-500 group-hover:text-primary-400 transition-colors" />
                                        </button>
                                        <button className="w-full flex items-center justify-between p-5 bg-black/40 hover:bg-white/5 rounded-2xl transition-colors border border-white/5">
                                            <div className="flex items-center gap-4">
                                                <FiSmartphone className="size-5 text-slate-400" />
                                                <div className="text-left">
                                                    <p className="text-sm font-bold text-slate-200">2-Factor Authentication</p>
                                                    <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1"><FiCheckCircle className="size-3" /> Enabled via SMS</p>
                                                </div>
                                            </div>
                                            <div className="w-10 h-6 bg-primary-500 rounded-full relative shadow-[0_0_10px_rgba(var(--primary-500),0.3)]">
                                                <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white shadow-sm"></div>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Integrations & Ads */}
                            <div className="space-y-8">
                                {/* Sync Card */}
                                <div className="bg-white/[0.02] rounded-[2rem] p-8 border border-white/10 border-t-primary-500/50 shadow-xl backdrop-blur-md flex flex-col justify-between group overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 blur-[50px] mix-blend-screen pointer-events-none"></div>

                                    <div>
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="size-12 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex items-center justify-center">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12 16.5C14.4853 16.5 16.5 14.4853 16.5 12C16.5 9.51472 14.4853 7.5 12 7.5C9.51472 7.5 7.5 9.51472 7.5 12C7.5 14.4853 9.51472 16.5 12 16.5Z" fill="currentColor"/>
                                                </svg>
                                            </div>
                                            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20">
                                                <FiCheckCircle className="size-3.5" /> Tagged
                                            </span>
                                        </div>
                                        
                                        <h3 className="text-xl font-bold mb-2">Zomato Sync</h3>
                                        <p className="text-sm text-slate-400 leading-relaxed mb-8">
                                            Linked to Zomato for automated daily payouts and insurance triggers.
                                        </p>
                                        
                                        <div className="bg-black/50 border border-white/5 rounded-2xl p-5 mb-8">
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1.5">Zomato Partner ID</p>
                                            <p className="text-2xl font-black font-mono tracking-wider text-slate-200">ZM-{partnerId || "000000"}</p>
                                        </div>
                                    </div>
                                    
                                    <button className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-2xl text-sm font-bold transition-all hover:bg-white/10 hover:border-white/20 active:scale-[0.98]">
                                        Refresh Data
                                    </button>
                                </div>

                                {/* Dynamic Ad/Upgrade Card */}
                                <div className="rounded-[2rem] p-8 bg-gradient-to-br from-primary-600 to-indigo-800 text-white shadow-[0_10px_40px_rgba(var(--primary-600),0.3)] relative overflow-hidden group">
                                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/20 blur-[50px] rounded-full group-hover:bg-white/30 transition-colors duration-700"></div>
                                    
                                    <h3 className="text-2xl font-black mb-3 leading-tight">Pro Shield<br />Coverage</h3>
                                    <p className="text-sm text-white/80 leading-relaxed mb-8 font-medium">
                                        You are fully protected against extreme weather disruptions in your delivery zone.
                                    </p>
                                    
                                    <Link to="/policy" className="w-full py-4 bg-white text-black rounded-2xl text-sm font-bold flex items-center justify-center gap-3 transition-transform hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] active:scale-[0.98]">
                                        View Coverage <FiArrowUpRight className="size-4" />
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

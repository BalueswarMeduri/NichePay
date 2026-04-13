import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    FiShield, FiCloudRain, FiCheckCircle, FiArrowUpRight,
    FiMapPin, FiX, FiZap, FiAlertTriangle
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import { Toaster, toast } from "react-hot-toast";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const PAYMENT_SERVICE = "https://nichepay.duckdns.org/api-payment";
const POLICY_SERVICE = "https://nichepay.duckdns.org/api-policy";

interface Payout {
    _id: string;
    amount: number;
    disruptedHours: number;
    date: string;
    reason: string;
    status: string;
    createdAt: string;
}

interface PolicyData {
    planName: string;
    dailyWage: number;
    status: string;
}

const spring = { type: "spring" as const, stiffness: 280, damping: 60 };

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
}

export default function DashboardPage() {
    const [showLocationModal, setShowLocationModal] = useState(true);
    const [manualCity, setManualCity] = useState("Mangalagiri");
    const [manualPincode, setManualPincode] = useState("522503");
    const [manualDate, setManualDate] = useState("2026-03-18");
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);
    const [payouts, setPayouts] = useState<Payout[]>([]);
    const [totalPayout, setTotalPayout] = useState(0);
    const [policy, setPolicy] = useState<PolicyData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const userId = localStorage.getItem("partnerId") || "";
    const user = localStorage.getItem("nichePayUser")
        ? JSON.parse(localStorage.getItem("nichePayUser")!)
        : null;
    const firstName = user?.name?.split(" ")[0] || "Driver";

    useEffect(() => {
        if (!userId) { navigate("/login"); return; }
        loadData();
    }, [userId]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [payoutRes, policyRes] = await Promise.allSettled([
                fetch(`${PAYMENT_SERVICE}/api/disruption-payouts/${userId}`),
                fetch(`${POLICY_SERVICE}/api/policy/user/${userId}`),
            ]);
            if (payoutRes.status === "fulfilled" && payoutRes.value.ok) {
                const d = await payoutRes.value.json();
                setPayouts(d.payouts || []);
                setTotalPayout(d.totalAmount || 0);
            }
            if (policyRes.status === "fulfilled" && policyRes.value.ok) {
                setPolicy(await policyRes.value.json());
            }
        } catch (e) { console.error(e); }
        setIsLoading(false);
    };

    const pushLocation = (lat: number, lng: number, dateStr?: string, pc?: string) => {
        fetch("https://nichepay.duckdns.org/api-address/api/address/update", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, lat, lng, date: dateStr, pincode: pc, data: { email: user?.email } })
        }).catch(console.error);
    };

    const handleCurrentLocation = () => {
        navigator.geolocation?.getCurrentPosition(
            (p) => { 
                const initialPayoutCount = payouts.length;
                pushLocation(p.coords.latitude, p.coords.longitude); 
                setShowLocationModal(false); 
                toast.loading("Simulating disruption... checking metrics.", { id: "sim-toast" });
                
                let attempts = 0;
                const pollInterval = setInterval(async () => {
                    attempts++;
                    try {
                        const payoutRes = await fetch(`${PAYMENT_SERVICE}/api/disruption-payouts/${userId}`);
                        if (payoutRes.ok) {
                            const pData = await payoutRes.json();
                            if ((pData.payouts || []).length > initialPayoutCount) {
                                setPayouts(pData.payouts);
                                setTotalPayout(pData.totalAmount || 0);
                                toast.success("Payout is successful! Check your mail for more details.", { id: "sim-toast" });
                                clearInterval(pollInterval);
                            }
                        }
                    } catch (e) {}
                    if (attempts >= 15) {
                        toast.error("No valid disruption found for this location or User is in offline mode.", { id: "sim-toast" });
                        clearInterval(pollInterval);
                    }
                }, 2000);
            },
            console.warn, { enableHighAccuracy: true }
        );
    };

    const handleManualLocation = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsFetchingLocation(true);
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(manualCity)}&format=json&limit=1&addressdetails=1`);
            const d = await res.json();
            if (d?.length > 0) {
                const initialPayoutCount = payouts.length;
                pushLocation(parseFloat(d[0].lat), parseFloat(d[0].lon), manualDate, manualPincode || d[0].address?.postcode);
                setShowLocationModal(false);
                toast.loading("Simulating disruption... checking metrics.", { id: "sim-toast" });

                let attempts = 0;
                const pollInterval = setInterval(async () => {
                    attempts++;
                    try {
                        const payoutRes = await fetch(`${PAYMENT_SERVICE}/api/disruption-payouts/${userId}`);
                        if (payoutRes.ok) {
                            const pData = await payoutRes.json();
                            if ((pData.payouts || []).length > initialPayoutCount) {
                                setPayouts(pData.payouts);
                                setTotalPayout(pData.totalAmount || 0);
                                toast.success("Payout is successful! Check your mail for more details.", { id: "sim-toast", duration: 8000 });
                                clearInterval(pollInterval);
                            }
                        }
                    } catch (e) {}
                    if (attempts >= 15) {
                        toast.error("No valid disruption found for this location.", { id: "sim-toast", duration: 4000 });
                        clearInterval(pollInterval);
                    }
                }, 2000);
            } else alert("City not found.");
        } catch { alert("Network error."); }
        setIsFetchingLocation(false);
    };

    const latestPayout = payouts[0];
    const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" });

    return (
        <AppShell title="Dashboard" subtitle={`${getGreeting()}, ${firstName}`}>
            <Toaster position="top-center" toastOptions={{ style: { background: '#1e293b', color: '#fff' } }} />

            {/* Location Modal */}
            <AnimatePresence>
                {showLocationModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 z-[100] backdrop-blur-xl overflow-y-auto py-10 px-4">
                        <div className="flex min-h-full items-center justify-center">
                            <motion.div
                                initial={{ scale: 0.92, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.92, opacity: 0 }}
                                transition={spring}
                                className="bg-black border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl max-w-4xl w-full text-white relative overflow-hidden my-auto"
                            >
                            <div className="absolute -top-24 -left-24 size-48 bg-primary-600 blur-[100px] opacity-20 pointer-events-none" />
                            
                            <button onClick={() => setShowLocationModal(false)} className="absolute top-6 right-6 text-white/30 hover:text-white p-2 hover:bg-white/5 rounded-xl transition-colors z-20">
                                <FiX size={18} />
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start relative z-10">
                                {/* Left Side: Scenario Info */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-xl bg-primary-600/20 border border-primary-500/30 flex items-center justify-center text-primary-400">
                                            <FiAlertTriangle className="size-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold tracking-tight">Technical Simulation</h2>
                                            <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Demo Sandbox Environment</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                                            <h4 className="text-[11px] font-bold uppercase tracking-wider text-primary-400">Why this simulation exists?</h4>
                                            <p className="text-xs text-slate-400 leading-relaxed italic">
                                                In the real world, NichePay tracks user location <strong>automatically</strong> in the background. For this demo, we provide a manual trigger for judges to verify our parametric model.
                                            </p>
                                        </div>

                                        <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-4">
                                            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Hackathon Test Scenario</h4>
                                            
                                            <div className="space-y-2">
                                                <p className="text-sm text-slate-200 leading-snug">
                                                    On <span className="text-primary-400 font-semibold">18-03-2026</span>, heavy rainfall was recorded in <span className="text-primary-400 font-semibold">Mangalagiri</span> between <span className="text-white font-medium">3:00 PM – 5:00 PM</span>.
                                                </p>
                                                <p className="text-xs text-slate-400">
                                                    Zomato logs confirm the partner was <span className="text-green-400">Online</span> but accepted <span className="text-red-400">Zero Orders</span>, qualifying for a payout.
                                                </p>
                                                <p className="text-[10px] text-slate-500 pt-1">
                                                    Mock logs generated via: <a href="http://nichepay.duckdns.org:3001/" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline">nichepay.duckdns.org:3001</a>
                                                </p>
                                            </div>

                                            <div className="pt-2 border-t border-white/5">
                                                <p className="text-[10px] text-slate-500 italic">
                                                    * Note: Idempotency checks are disabled for testing. You may trigger this same date multiple times to see the chart react.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: The Form */}
                                <div className="bg-white/3 border border-white/10 p-6 rounded-2xl">
                                    <h3 className="text-sm font-semibold mb-6 flex items-center gap-2">
                                        <FiMapPin className="text-primary-500" /> Configure Parameters
                                    </h3>
                                    
                                    <motion.button whileTap={{ scale: 0.97 }} onClick={handleCurrentLocation}
                                        className="w-full py-3 bg-primary-600 hover:bg-primary-500 rounded-xl font-semibold text-sm mb-6 flex justify-center items-center gap-2 transition-all shadow-lg shadow-primary-600/20 active:shadow-none">
                                        <FiMapPin size={15} /> Detect Live Location
                                    </motion.button>

                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="h-px bg-white/5 flex-1" />
                                        <span className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">Manual override</span>
                                        <div className="h-px bg-white/5 flex-1" />
                                    </div>

                                    <form onSubmit={handleManualLocation} className="space-y-4">
                                        {[
                                            { label: "Location / City", val: manualCity, set: setManualCity, ph: "e.g. Mangalagiri", type: "text", req: true },
                                            { label: "Pincode", val: manualPincode, set: setManualPincode, ph: "e.g. 522503", type: "text", req: false },
                                            { label: "Simulation Date", val: manualDate, set: setManualDate, ph: "", type: "date", req: true },
                                        ].map(f => (
                                            <div key={f.label}>
                                                <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2 block ml-1">{f.label}</label>
                                                <input type={f.type} value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph} required={f.req}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 text-white placeholder:text-slate-700 transition-all font-medium" />
                                            </div>
                                        ))}
                                        <button type="submit" disabled={isFetchingLocation}
                                            className="w-full py-3.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold border border-white/20 transition-all disabled:opacity-40 group">
                                            {isFetchingLocation ? "Processing Simulation..." : "Fetch Results"}
                                        </button>
                                    </form>
                                </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Dashboard Content */}
            <div className="p-4 md:p-6 relative">

                {/* ── HERO WELCOME ROW ───────────────────────── */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0, ...spring }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                    <div>
                        <p className="text-[11px] text-slate-600 uppercase tracking-widest mb-1">{today}</p>
                        <h1 className="text-2xl font-semibold text-white tracking-tight">
                            {getGreeting()}, <span className="text-primary-400">{firstName}</span> 👋
                        </h1>
                        <p className="text-[15px] text-slate-500 mt-0.5">Here's your insurance overview for today.</p>
                    </div>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        onClick={() => setShowLocationModal(true)}
                        className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors shadow-lg shadow-primary-600/20 shrink-0">
                        <FiMapPin className="size-4" /> Simulate disruption
                    </motion.button>
                </motion.div>

                {/* ── BENTO GRID ───────────────────────────────── */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

                    {/* Card 1 — Shield / Policy Card (large) */}
                    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, ...spring }}
                        className="md:col-span-1 bg-white/5 border border-white/10 rounded-2xl p-5 relative overflow-hidden hover:bg-white/8 transition-colors group">
                        <div className="absolute -top-12 -right-12 size-36 bg-primary-600 blur-[60px] opacity-25 pointer-events-none" />
                        <div className="relative z-10 flex flex-col h-full min-h-[190px] justify-between">
                            <div className="flex justify-between items-start">
                                <div className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary-500 group-hover:bg-primary-600/20 group-hover:border-primary-500/20 transition-colors">
                                    <FiShield className="size-5" />
                                </div>
                                <span className="text-[10px] font-medium text-primary-400 bg-primary-200/15 px-2.5 py-1 rounded-full">
                                    {isLoading ? "..." : policy ? "● Active" : "● No Plan"}
                                </span>
                            </div>
                            <div className="mt-4">
                                <p className="xs text-slate-500 uppercase tracking-widest font-medium mb-1">Current plan</p>
                                <p className="text-[15px] font-semibold text-white">{isLoading ? "—" : policy?.planName || "No Policy"}</p>
                                <p className="text-[13px] text-slate-500 mt-1">Daily wage protected: <span className="text-white font-medium">₹{policy?.dailyWage || "—"}</span></p>
                            </div>
                            <Link to="/policy" className="mt-4 flex items-center gap-1 text-[11px] text-primary-400 hover:text-primary-300 transition-colors font-medium">
                                View policy details <FiArrowUpRight className="size-3" />
                            </Link>
                        </div>
                    </motion.div>

                    {/* Card 2 — Total Earned (normal theme) */}
                    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, ...spring }}
                        className="md:col-span-1 bg-white/5 border border-white/10 rounded-2xl p-5 relative overflow-hidden group hover:bg-white/8 transition-colors">
                        <div className="relative z-10 flex flex-col min-h-[190px] justify-between">
                            <div className="flex justify-between items-start">
                                <div className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary-500 group-hover:bg-white/10 transition-colors">
                                    <FiZap className="size-5" />
                                </div>
                                <span className="text-[10px] font-medium text-primary-400 bg-primary-200/15 px-2.5 py-1 rounded-full">
                                    {isLoading ? "—" : `${payouts.length} claim${payouts.length !== 1 ? "s" : ""}`}
                                </span>
                            </div>
                            <div className="mt-4">
                                <p className="text-[11px] text-slate-500 uppercase tracking-widest font-medium mb-1">Total Payout Earned</p>
                                <p className="text-3xl font-bold text-white tracking-tight">
                                    {isLoading ? "—" : `₹${totalPayout.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
                                </p>
                                <p className="text-[13px] text-slate-500 mt-2 flex items-center gap-1">
                                    <FiCheckCircle className="size-3 text-primary-500" /> Auto-credited to your account
                                </p>
                            </div>
                            <Link to="/claims" className="mt-4 flex items-center gap-1 text-[11px] text-primary-400 hover:text-primary-300 transition-colors font-medium">
                                Full claim history <FiArrowUpRight className="size-3" />
                            </Link>
                        </div>
                    </motion.div>

                    {/* Card 3 — Latest Payout */}
                    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, ...spring }}
                        className="md:col-span-2 xl:col-span-1 bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/8 transition-colors">
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-[15px] font-semibold text-white">Latest Payout</p>
                            {latestPayout && (
                                <span className="text-[10px] text-primary-400 bg-primary-200/15 px-2.5 py-1 rounded-full font-medium">Processed</span>
                            )}
                        </div>
                        {isLoading ? (
                            <div className="h-28 bg-white/5 rounded-xl animate-pulse" />
                        ) : latestPayout ? (
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary-500 shrink-0">
                                        <FiCloudRain className="size-4" />
                                    </div>
                                    <div>
                                        <p className="text-[15px] font-medium text-white">{latestPayout.reason}</p>
                                        <p className="text-[13px] text-slate-500">{latestPayout.date}</p>
                                    </div>
                                </div>
                                <div className="bg-white/5 border border-white/5 rounded-xl px-4 py-3 flex items-center justify-between">
                                    <div>
                                        <p className="text-[11px] text-slate-500 uppercase tracking-widest mb-0.5">Amount credited</p>
                                        <p className="text-xl font-bold text-primary-400">+₹{latestPayout.amount.toFixed(2)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-0.5">Hours covered</p>
                                        <p className="text-xl font-bold text-white">{latestPayout.disruptedHours}h</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-28 flex flex-col items-center justify-center text-center">
                                <FiAlertTriangle className="size-5 text-slate-600 mb-2" />
                                <p className="text-slate-500 text-sm">No payouts yet</p>
                                <p className="text-slate-600 text-xs mt-0.5">Trigger a disruption to start</p>
                            </div>
                        )}
                    </motion.div>

                    {/* Card 4 — Recent Payouts Graph (wide) */}
                    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, ...spring }}
                        className="md:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/8 transition-colors">
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-[15px] font-semibold text-white">Payout History Trend</p>
                            <Link to="/claims" className="text-[11px] text-primary-400 hover:text-primary-300 flex items-center gap-1 font-medium transition-colors">
                                Detailed Logs <FiArrowUpRight className="size-3" />
                            </Link>
                        </div>
                        {isLoading ? (
                            <div className="h-40 bg-white/5 rounded-xl animate-pulse" />
                        ) : payouts.length > 0 ? (
                            <div className="h-48 w-full mt-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={[...payouts].reverse()}>
                                        <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                                            itemStyle={{ color: 'var(--color-primary-400)' }}
                                        />
                                        <Line type="monotone" dataKey="amount" stroke="var(--color-primary-500)" strokeWidth={3} dot={{ fill: '#0f172a', stroke: 'var(--color-primary-500)', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-40 flex items-center justify-center text-slate-600 text-sm">
                                No payout history found
                            </div>
                        )}
                    </motion.div>

                    {/* Card 5 — Quick Nav (tall narrow) */}
                    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, ...spring }}
                        className="md:col-span-2 xl:col-span-1 bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-2 hover:bg-white/8 transition-colors">
                        <p className="text-[15px] font-semibold text-white mb-2">Quick Access</p>
                        {[
                            { to: "/policy", label: "My Policy", sub: "Coverage details", icon: <FiShield /> },
                            { to: "/claims", label: "Claims History", sub: "All payouts", icon: <FiCloudRain /> },
                            { to: "/profile", label: "Profile", sub: "Account & settings", icon: <FiCheckCircle /> },
                        ].map((item, i) => (
                            <Link key={i} to={item.to}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/8 border border-transparent hover:border-white/10 transition-all group">
                                <div className="size-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary-500 group-hover:bg-primary-600/20 group-hover:border-primary-500/20 transition-colors shrink-0">
                                    <span className="size-3.5">{item.icon}</span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white group-hover:text-primary-400 transition-colors">{item.label}</p>
                                    <p className="text-[10px] text-slate-500">{item.sub}</p>
                                </div>
                                <FiArrowUpRight className="size-3.5 text-slate-600 group-hover:text-primary-400 transition-colors ml-auto" />
                            </Link>
                        ))}
                    </motion.div>

                </div>
            </div>
        </AppShell>
    );
}

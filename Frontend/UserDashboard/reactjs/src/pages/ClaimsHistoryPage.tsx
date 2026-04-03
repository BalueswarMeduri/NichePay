import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { FiCloudRain, FiAlertCircle, FiCheckCircle, FiDownload, FiZap } from "react-icons/fi";
import AppShell from "../components/AppShell";

interface Payout {
    _id: string;
    amount: number;
    disruptedHours: number;
    date: string;
    reason: string;
    status: string;
    createdAt: string;
}

const spring = { type: "spring" as const, stiffness: 300, damping: 70, mass: 1 };

export default function ClaimsHistoryPage() {
    const [payouts, setPayouts] = useState<Payout[]>([]);
    const [totalPayout, setTotalPayout] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const userId = localStorage.getItem("partnerId") || "";

    useEffect(() => {
        if (!userId) return;
        fetch(`http://localhost:5003/api/disruption-payouts/${userId}`)
            .then(r => r.json())
            .then(data => { setPayouts(data.payouts || []); setTotalPayout(data.totalAmount || 0); })
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, [userId]);

    return (
        <AppShell title="Claims History" subtitle="All your insurance payout records">
            <div className="p-4 md:p-6 lg:p-8 relative">
                <div className="absolute top-0 right-1/4 size-64 bg-primary-600 blur-[200px] opacity-10 pointer-events-none" />

                {/* Summary */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6 relative z-10">
                    {[
                        { label: "Total Claimed", value: `₹${totalPayout.toFixed(2)}`, icon: <FiZap /> },
                        { label: "Total Claims", value: payouts.length.toString(), icon: <FiCloudRain /> },
                        { label: "Success Rate", value: "100%", icon: <FiCheckCircle /> },
                    ].map((stat, i) => (
                        <motion.div key={i}
                            initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: i * 0.08, ...spring }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-4 group hover:bg-white/8 transition-colors"
                        >
                            <div className="size-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary-500 mb-3 group-hover:bg-primary-600/20 group-hover:border-primary-500/20 transition-colors">
                                <span className="size-4">{stat.icon}</span>
                            </div>
                            <p className="text-xs text-slate-500 uppercase tracking-widest font-medium mb-1">{stat.label}</p>
                            <p className="text-2xl font-semibold text-white">{isLoading ? "—" : stat.value}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Table */}
                <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.24, ...spring }}
                    className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden relative z-10">
                    <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                        <h2 className="font-semibold text-white text-base tracking-tight">Payout Records</h2>
                        <button className="text-[10px] font-medium text-slate-500 hover:text-white flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg transition-colors hover:bg-white/8">
                            <FiDownload className="size-3" /> Export
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="p-5 flex flex-col gap-3">
                            {[1, 2, 3, 4].map(i => <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />)}
                        </div>
                    ) : payouts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                            <div className="size-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-600 mb-4">
                                <FiAlertCircle className="size-6" />
                            </div>
                            <p className="text-slate-400 font-medium text-sm">No claims yet</p>
                            <p className="text-slate-600 text-xs mt-1 max-w-xs">Once a rain or disruption event triggers, it appears here automatically.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {payouts.map((payout, i) => (
                                <motion.div key={payout._id}
                                    initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.06 + 0.3, ...spring }}
                                    className="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary-500 group-hover:bg-primary-600/20 group-hover:border-primary-500/20 transition-colors shrink-0">
                                            <FiCloudRain className="size-4" />
                                        </div>
                                        <div>
                                            <p className="text-[15px] font-medium text-white">{payout.reason}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <p className="text-[13px] text-slate-500">{payout.date}</p>
                                                <span className="text-[11px] text-primary-400 bg-primary-200/15 px-2 py-0.5 rounded-full font-medium">
                                                    {payout.disruptedHours}hrs covered
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <span className="text-primary-400 font-semibold text-[15px]">+₹{payout.amount.toFixed(2)}</span>
                                        <div className="flex items-center gap-1 justify-end mt-0.5">
                                            <FiCheckCircle className="size-2.5 text-primary-500" />
                                            <span className="text-[9px] text-primary-500 font-medium uppercase tracking-wider">Processed</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </AppShell>
    );
}

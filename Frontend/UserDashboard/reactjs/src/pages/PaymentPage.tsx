import { Link } from "react-router-dom";
import { ArrowLeft, CreditCard } from "lucide-react";
import { motion } from "motion/react";

export default function PaymentPage() {
    return (
        <div className="min-h-screen bg-black flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background glowing effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary-600/10 blur-[100px] pointer-events-none"></div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <Link to="/select-plan" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-12 w-fit mx-auto sm:mx-0">
                    <ArrowLeft size={16} />
                    <span>Back to Plans</span>
                </Link>

                <div className="bg-white/[0.03] border border-white/10 py-12 px-4 shadow-2xl sm:rounded-2xl sm:px-10 backdrop-blur-xl flex flex-col items-center justify-center text-center">
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 320, damping: 70 }}
                    >
                        <div className="size-20 bg-primary-500/10 rounded-full flex items-center justify-center mb-6 text-primary-500 border border-primary-500/20">
                            <CreditCard size={32} />
                        </div>
                    </motion.div>
                    
                    <h2 className="text-2xl font-bold tracking-tight text-white mb-3">
                        Set up Auto-pay
                    </h2>
                    <p className="text-slate-400 text-sm leading-relaxed mb-8">
                        Link your UPI or wallet to enable automated weekly deductions exactly aligned with your Zomato payout cycle.
                    </p>

                    <button className="w-full py-4 rounded-xl font-medium text-white bg-primary-600 hover:bg-primary-500 transition-colors shadow-lg active:scale-[0.98]">
                        Link UPI Account
                    </button>
                    <p className="text-slate-600 text-xs mt-4">
                        Secure connection via Razorpay. We do not store your credentials.
                    </p>
                </div>
            </div>
        </div>
    );
}

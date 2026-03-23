import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

const Hero = () => {
    return (
        <section className="pt-32 pb-20 md:pt-48 md:pb-40 px-4 bg-gray-50 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Graphic elements */}
            <div className="absolute top-20 right-[-10%] w-[30%] h-[60%] opacity-15 pointer-events-none hidden md:block">
                <img src="https://b.zmtcdn.com/delivery/static/f0ae12368ee3a075d564fa267b2d5f0b1580983195.png" alt="" className="w-full h-full object-contain" />
            </div>

            <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-red-100 text-red-600 font-black text-sm uppercase tracking-widest mb-10 shadow-sm border border-red-200">
                    <span className="size-2 bg-red-600 rounded-full animate-pulse"></span>
                    Now Hiring Delivery Partners
                </div>
                
                <h1 className="text-4xl md:text-7xl font-black text-gray-900 mb-8 leading-[1.1] tracking-tighter">
                    Drive with Zomato <br/>
                    <span className="text-red-500 italic">Earn instantly.</span>
                </h1>
                
                <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Join India's leading delivery fleet today. Weekly payouts, complete insurance cover, and total freedom over your work schedule.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-6 justify-center w-full">
                    <Link to="/register" className="w-full sm:w-auto bg-red-500 text-white px-8 py-3.5 rounded-xl font-bold text-lg hover:bg-red-600 hover:scale-105 transition-all shadow-xl shadow-red-200 flex items-center justify-center gap-3">
                        Join Current Batch <FaArrowRight className="text-lg" />
                    </Link>
                    <div className="text-left py-2 px-1">
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Partners Trust Us</p>
                        <div className="flex items-center gap-3">
                            <div className="flex -space-x-3">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className="size-10 rounded-full bg-gray-200 border-2 border-white shadow-md ring-1 ring-gray-100 overflow-hidden">
                                        <div className="w-full h-full bg-slate-300"></div>
                                    </div>
                                ))}
                            </div>
                            <span className="text-lg font-bold text-gray-700">3 Lakh+ Strong Fleet</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;

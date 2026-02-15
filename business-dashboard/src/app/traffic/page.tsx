import Header from "@/components/Header";
import StatCard from "@/components/StatCard";
import { trafficData } from "@/data/mockData";

export default function TrafficPage() {
    return (
        <>
            <Header title="Traffic & Wait Analysis" subtitle="Real-time density tracking" />

            <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard label="Live Occupancy" value="82%" trend="Near Capacity" highlight="pink" />
                    <StatCard label="Avg. Stay Duration" value="1.8h" trend="+15m from last week" />
                    <StatCard label="Entry Velocity" value="12/min" trend="High Flow" highlight="green" />
                </div>

                <div className="bg-[#121212] border border-white/5 p-8 rounded-[32px]">
                    <h3 className="text-xl font-bold mb-8">Hourly Traffic & Wait Times</h3>
                    <div className="space-y-6">
                        {trafficData.map((d, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <span className="w-20 text-xs font-bold text-[#B3B3B3]">{d.time}</span>
                                <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[#8027BA] transition-all"
                                        style={{ width: `${(d.count / 250) * 100}%` }}
                                    ></div>
                                </div>
                                <div className="w-24 text-right">
                                    <span className={`text-xs font-bold ${d.wait > 20 ? 'text-[#d946ef]' : 'text-[#1ed760]'}`}>
                                        {d.wait}m wait
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-[#121212] border border-white/5 p-6 rounded-3xl">
                        <h4 className="font-bold mb-4">Peak Prediction Detail</h4>
                        <p className="text-sm text-[#B3B3B3] mb-6">Based on historical Friday data and tonight's current trend.</p>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-[#B3B3B3]">Predicted Peak</span>
                                <span className="font-bold">12:15 AM</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-[#B3B3B3]">Predicted Capacity Hit</span>
                                <span className="font-bold text-[#d946ef]">11:45 PM</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-[#B3B3B3]">Turnover Rate</span>
                                <span className="font-bold">42 people / hr</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-purple-600/5 border border-purple-500/20 p-6 rounded-3xl">
                        <h4 className="font-bold mb-2">Queue Management Recommendation</h4>
                        <p className="text-sm text-[#B3B3B3] mb-4">AI suggests opening the secondary entrance at 11:00 PM to reduce bottlenecking.</p>
                        <button className="px-4 py-2 bg-white text-black text-[10px] font-black uppercase rounded-lg">
                            Apply Queue Logic
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

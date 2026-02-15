import Header from "@/components/Header";
import { vibeReports, recentFeedback } from "@/data/mockData";

export default function VibeReportsPage() {
    return (
        <>
            <Header title="Vibe Sentiment" subtitle="Venue atmosphere & user feedback" />

            <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {vibeReports.map((v, i) => (
                        <div key={i} className="bg-[#121212] border border-white/5 p-6 rounded-3xl group hover:border-[#8027BA]/50 transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-2xl">{v.emoji}</span>
                                <span className="text-[10px] font-black uppercase text-[#1ed760]">{v.trend}</span>
                            </div>
                            <p className="text-xs font-bold text-[#B3B3B3] uppercase tracking-wider mb-1">{v.metric}</p>
                            <h4 className="text-2xl font-black">{v.value}</h4>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <div className="xl:col-span-2 space-y-6">
                        <div className="bg-[#121212] border border-white/5 rounded-[32px] overflow-hidden">
                            <div className="p-8 border-b border-white/5 flex justify-between items-center">
                                <h3 className="text-xl font-bold">Feedback Feed</h3>
                                <div className="flex gap-2">
                                    <span className="text-[10px] bg-white/5 px-3 py-1 rounded-full font-bold">All</span>
                                    <span className="text-[10px] bg-white/5 px-3 py-1 rounded-full font-bold text-red-400">Issues</span>
                                </div>
                            </div>
                            <div className="divide-y divide-white/5">
                                {recentFeedback.map((f, i) => (
                                    <div key={i} className="p-8 hover:bg-white/2 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center font-bold text-purple-400">
                                                    {f.user[0]}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm">{f.user}</p>
                                                    <p className="text-[10px] text-[#B3B3B3]">{f.time}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i} className={`text-xs ${i < f.rating ? 'text-yellow-500' : 'text-white/10'}`}>★</span>
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-[#B3B3B3] italic text-sm leading-relaxed">"{f.text}"</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-[#121212] border border-white/5 p-8 rounded-3xl">
                            <h4 className="font-bold mb-6">Music Sentiment</h4>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-[#B3B3B3]">Genre Match</span>
                                        <span>88%</span>
                                    </div>
                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500" style={{ width: '88%' }}></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-[#B3B3B3]">Request Volume</span>
                                        <span>High</span>
                                    </div>
                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-pink-500" style={{ width: '75%' }}></div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/5">
                                <p className="text-[10px] text-[#B3B3B3] uppercase font-black mb-2 tracking-[2px]">Trending Tracks</p>
                                <ol className="space-y-3">
                                    <li className="text-xs font-bold">1. Espresso - Sabrina Carpenter</li>
                                    <li className="text-xs font-bold">2. Cruel Summer - Taylor Swift</li>
                                    <li className="text-xs font-bold">3. Starboy - The Weeknd</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

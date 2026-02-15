import Header from "@/components/Header";
import { aiRecommendations } from "@/data/mockData";

export default function AIRecommendationsPage() {
    return (
        <>
            <Header title="AI Insights" subtitle="Predictive intelligence powered by NaviMind" />

            <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {aiRecommendations.map((rec) => (
                        <div key={rec.id} className={`p-8 rounded-[32px] border transition-all ${rec.priority === 'high' ? 'bg-purple-600/5 border-purple-500/30' : 'bg-[#121212] border-white/5'}`}>
                            <div className="flex justify-between items-start mb-6">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${rec.priority === 'high' ? 'bg-[#8027BA]' : 'bg-white/5'}`}>
                                    {rec.type === 'staffing' ? '👥' : '📦'}
                                </div>
                                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${rec.priority === 'high' ? 'bg-purple-500 text-white' : 'bg-white/10 text-[#B3B3B3]'}`}>
                                    {rec.priority} Priority
                                </span>
                            </div>

                            <h3 className="text-xl font-bold mb-2">{rec.title}</h3>
                            <p className="text-sm text-[#B3B3B3] mb-6 leading-relaxed">{rec.description}</p>

                            <div className="flex items-center gap-2 mb-8">
                                <span className="text-[#1ed760] font-bold text-xs">✨ Expected Impact:</span>
                                <span className="text-white text-xs font-medium">{rec.impact}</span>
                            </div>

                            <button className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-wider transition-all ${rec.priority === 'high' ? 'bg-white text-black hover:scale-[1.02]' : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'}`}>
                                {rec.action}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="bg-[#121212] border border-white/5 p-8 rounded-[32px]">
                    <h3 className="font-black text-xs uppercase text-[#B3B3B3] mb-6 tracking-widest">Model Training Accuracy</h3>
                    <div className="flex items-center justify-between gap-8">
                        <div className="flex-1 space-y-2">
                            <div className="flex justify-between text-sm mb-1">
                                <span>Traffic Prediction</span>
                                <span className="text-[#1ed760]">98.2%</span>
                            </div>
                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-[#1ed760]" style={{ width: '98%' }}></div>
                            </div>
                        </div>
                        <div className="flex-1 space-y-2">
                            <div className="flex justify-between text-sm mb-1">
                                <span>Vibe Sentiment</span>
                                <span className="text-purple-400">94.5%</span>
                            </div>
                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-[#8027BA]" style={{ width: '94%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

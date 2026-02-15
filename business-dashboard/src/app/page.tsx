import Header from "@/components/Header";
import StatCard from "@/components/StatCard";
import { venueStats, recentFeedback, vibeReports } from "@/data/mockData";

export default function Home() {
  return (
    <>
      <Header
        title={`${venueStats.name} Dashboard`}
        subtitle={`Live Status: ${venueStats.liveStatus} (${venueStats.litScore}/10)`}
      />

      <div className="p-8 space-y-8 overflow-y-auto">
        {/* Main Hero Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Current Foot Traffic" value={venueStats.currentTraffic.toString()} trend="+12% vs last Friday" />
          <StatCard label="Avg. Wait Time" value={`${venueStats.avgWaitTime} min`} trend="Optimal Staffing" highlight="green" />
          <StatCard label="Live Lit Meter" value={venueStats.litScore.toString()} trend="Peak Atmosphere" highlight="pink" />
          <StatCard label="Skip-Line Sales" value={`$${venueStats.tonightRevenue}`} trend="Tonight's Revenue" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Traffic Chart Area */}
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-[#121212] border border-white/5 p-8 rounded-[32px] relative overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold">Traffic Predictions</h3>
                  <p className="text-sm text-[#B3B3B3]">AI-modeled peak hours for tonight</p>
                </div>
              </div>

              {/* Mock Chart Visualization */}
              <div className="h-64 flex items-end gap-1 px-2">
                {[40, 35, 30, 45, 60, 85, 95, 80, 70, 90, 100, 85, 75, 65, 55, 45].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-500 relative
                        ${h > 80 ? 'bg-[#8027BA] shadow-[0_0_20px_rgba(128,39,186,0.5)]' : 'bg-white/10 group-hover:bg-white/20'}`}
                      style={{ height: `${h}%` }}
                    >
                    </div>
                    <span className="text-[10px] text-[#B3B3B3] font-medium">{9 + i}:00</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insight Bar */}
            <div className="bg-purple-600/5 border border-purple-500/20 p-6 rounded-3xl flex items-center gap-6">
              <div className="w-12 h-12 rounded-2xl bg-[#8027BA] flex items-center justify-center text-xl shadow-[0_0_20px_rgba(128,39,186,0.5)]">
                🤖
              </div>
              <div>
                <h4 className="font-bold">AI Staffing Alert</h4>
                <p className="text-sm text-[#B3B3B3]">Predicted surge at 11:30 PM. We recommend adding <span className="text-white font-bold">1 extra bartender</span>.</p>
              </div>
            </div>
          </div>

          {/* Sidebar Widgets */}
          <div className="space-y-6">
            {/* Liveness Widget */}
            <div className="bg-[#121212] border border-white/5 p-6 rounded-3xl space-y-4">
              <h3 className="font-bold">Vibe Sentiment</h3>
              <div className="space-y-3">
                {vibeReports.map((v, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-2">
                      <span>{v.emoji}</span>
                      <span className="text-xs font-bold text-[#B3B3B3]">{v.metric}</span>
                    </div>
                    <span className="text-[10px] font-black uppercase px-2 py-1 rounded-lg bg-white/10">{v.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Check-ins */}
            <div className="bg-[#121212] border border-white/5 p-6 rounded-3xl">
              <h3 className="font-bold mb-4">Recent Feedback</h3>
              <div className="space-y-4">
                {recentFeedback.map((f, i) => (
                  <div key={i} className="flex gap-3 text-xs">
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-[10px]">
                      {f.user[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between font-bold mb-0.5">
                        <span>{f.user}</span>
                        <span className="text-[#B3B3B3] text-[10px]">{f.time}</span>
                      </div>
                      <p className="text-[#B3B3B3] italic text-[11px]">"{f.text}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

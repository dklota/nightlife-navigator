"use client";

export default function StatCard({ label, value, trend, highlight }: { label: string; value: string; trend: string; highlight?: 'green' | 'pink' | 'default' }) {
    const colorMap = {
        green: 'text-[#1ed760]',
        pink: 'text-[#d946ef]',
        default: 'text-white',
    };

    return (
        <div className="bg-[#121212] border border-white/5 p-6 rounded-[28px] hover:border-purple-500/50 transition-all group relative overflow-hidden">
            <p className="text-xs font-bold text-[#B3B3B3] uppercase tracking-wider mb-2 relative z-10">{label}</p>
            <div className="flex items-baseline gap-2 relative z-10">
                <h4 className={`text-3xl font-black ${colorMap[highlight || 'default']}`}>
                    {value}
                </h4>
            </div>
            <p className="text-[10px] font-bold mt-2 text-[#B3B3B3]/60 group-hover:text-white transition-colors relative z-10">
                {trend}
            </p>
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white/2 blur-2xl group-hover:bg-white/5 transition-all"></div>
        </div>
    );
}

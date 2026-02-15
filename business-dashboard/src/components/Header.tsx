"use client";

export default function Header({ title, subtitle }: { title: string; subtitle?: string }) {
    return (
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-black/50 backdrop-blur-md sticky top-0 z-50">
            <div>
                <h2 className="text-lg font-bold">{title}</h2>
                {subtitle && (
                    <p className="text-xs text-[#B3B3B3] flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[#1ed760] rounded-full shadow-[0_0_8px_#1ed760] animate-pulse"></span>
                        {subtitle}
                    </p>
                )}
            </div>

            <div className="flex items-center gap-4">
                <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                    🔔
                </button>
                <div className="h-10 px-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3 cursor-pointer hover:bg-white/10 transition-all">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-[10px] font-bold text-purple-400">JD</div>
                    <span className="text-sm font-medium">John Doe</span>
                </div>
            </div>
        </header>
    );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    return (
        <aside className="w-64 border-r border-white/5 bg-secondary/50 backdrop-blur-xl hidden lg:flex flex-col h-screen sticky top-0">
            <div className="p-8">
                <Link href="/">
                    <h1 className="text-2xl font-black tracking-tighter text-gradient">WTM</h1>
                    <p className="text-[10px] uppercase tracking-[3px] text-[#B3B3B3] font-bold mt-1 text-white/50">Business Portal</p>
                </Link>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                <NavItem href="/" icon="📊" label="Overview" />
                <NavItem href="/traffic" icon="📈" label="Traffic & Wait" />
                <NavItem href="/ai-recs" icon="🤖" label="AI Recs" badge="New" />
                <NavItem href="/skip-line" icon="🎟️" label="Skip the Line" />
                <NavItem href="/vibe" icon="💬" label="Vibe Reports" />
                <NavItem href="/settings" icon="⚙️" label="Settings" />
            </nav>

            <div className="p-6">
                <div className="bg-purple-600/5 backdrop-blur-2xl p-4 rounded-2xl border border-purple-500/20 relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-xs font-bold text-purple-400 mb-1">PRO PLAN</p>
                        <p className="text-[10px] text-[#B3B3B3] leading-normal text-white/60">Unlocking advanced AI peak predictions.</p>
                    </div>
                    <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/10 blur-2xl group-hover:bg-purple-500/20 transition-all"></div>
                </div>
            </div>
        </aside>
    );
}

function NavItem({ href, icon, label, badge }: { href: string; icon: string; label: string; badge?: string }) {
    const pathname = usePathname();
    const active = pathname === href;

    return (
        <Link href={href} className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-[#8027BA] text-white shadow-[0_0_20px_rgba(128,39,186,0.3)]' : 'text-[#B3B3B3] hover:bg-white/5 hover:text-white'}`}>
            <span className="text-lg">{icon}</span>
            <span className="text-sm font-bold tracking-tight">{label}</span>
            {badge && <span className="ml-auto text-[10px] bg-pink-500 text-white px-2 py-0.5 rounded-full font-black uppercase">{badge}</span>}
        </Link>
    );
}

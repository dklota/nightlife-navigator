import Header from "@/components/Header";
import { venueStats } from "@/data/mockData";

export default function SettingsPage() {
    return (
        <>
            <Header title="Venue Settings" subtitle="Configurations & profile management" />

            <div className="p-8 max-w-4xl space-y-12">
                <section className="space-y-6">
                    <h3 className="text-xl font-bold border-b border-white/5 pb-4">General Profile</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-[#B3B3B3] tracking-widest pl-1">Venue Name</label>
                            <input
                                type="text"
                                defaultValue={venueStats.name}
                                className="w-full bg-[#121212] border border-white/10 p-4 rounded-xl text-sm focus:border-[#8027BA] outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-[#B3B3B3] tracking-widest pl-1">Address</label>
                            <input
                                type="text"
                                defaultValue={venueStats.address}
                                className="w-full bg-[#121212] border border-white/10 p-4 rounded-xl text-sm focus:border-[#8027BA] outline-none transition-all"
                            />
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <h3 className="text-xl font-bold border-b border-white/5 pb-4">Dashboard Configuration</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-6 bg-[#121212] rounded-2xl border border-white/5">
                            <div>
                                <p className="font-bold">AI Staffing Recommendations</p>
                                <p className="text-[11px] text-[#B3B3B3]">Enable proactive alerts for peak hours and staffing surges.</p>
                            </div>
                            <div className="w-12 h-6 bg-[#8027BA] rounded-full relative cursor-pointer shadow-[0_0_10px_rgba(128,39,186,0.3)]">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-6 bg-[#121212] rounded-2xl border border-white/5 opacity-50">
                            <div>
                                <p className="font-bold">Auto-Surge Pricing</p>
                                <p className="text-[11px] text-[#B3B3B3]">Allow AI to automatically adjust Skip-the-Line prices based on density.</p>
                            </div>
                            <div className="w-12 h-6 bg-white/10 rounded-full relative cursor-not-allowed">
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white/20 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <h3 className="text-xl font-bold border-b border-white/5 pb-4">Integrations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-white/2 rounded-2xl border border-white/5 flex flex-col items-center text-center">
                            <span className="text-2xl mb-3">📍</span>
                            <p className="font-bold text-sm">Google Maps</p>
                            <p className="text-[10px] text-green-400 font-bold uppercase mt-1 tracking-wider">Connected</p>
                        </div>
                        <div className="p-6 bg-white/2 rounded-2xl border border-white/5 flex flex-col items-center text-center">
                            <span className="text-2xl mb-3">🔥</span>
                            <p className="font-bold text-sm">Supabase</p>
                            <p className="text-[10px] text-green-400 font-bold uppercase mt-1 tracking-wider">Sync Active</p>
                        </div>
                        <div className="p-6 bg-white/2 rounded-2xl border border-white/5 flex flex-col items-center text-center">
                            <span className="text-2xl mb-3">💎</span>
                            <p className="font-bold text-sm">Stripe</p>
                            <p className="text-[10px] text-[#B3B3B3] font-bold uppercase mt-1 tracking-wider italic">Not Setup</p>
                        </div>
                    </div>
                </section>

                <div className="pt-8 flex justify-end gap-4">
                    <button className="px-8 py-4 bg-white/5 text-white font-black text-xs uppercase rounded-xl border border-white/10">Discard</button>
                    <button className="px-8 py-4 bg-white text-black font-black text-xs uppercase rounded-xl hover:scale-105 transition-transform">Save Changes</button>
                </div>
            </div>
        </>
    );
}

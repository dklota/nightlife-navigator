import Header from "@/components/Header";
import StatCard from "@/components/StatCard";
import { skipLineDeals } from "@/data/mockData";

export default function SkipLinePage() {
    return (
        <>
            <Header title="Skip the Line" subtitle="Priority access & revenue tracking" />

            <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard label="Total Pass Revenue" value="$1,725" trend="+22% tonight" highlight="green" />
                    <StatCard label="Passes Remaining" value="12" trend="Selling Fast" highlight="pink" />
                    <StatCard label="Avg. Pass Upsell" value="$18.50" trend="Stable" />
                </div>

                <div className="bg-[#121212] border border-white/5 rounded-[32px] overflow-hidden">
                    <div className="p-8 border-b border-white/5">
                        <h3 className="text-xl font-bold">Active Pass Tiers</h3>
                    </div>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] uppercase font-black text-[#B3B3B3] bg-white/2 border-b border-white/5">
                                <th className="px-8 py-4">Tier Type</th>
                                <th className="px-8 py-4">Price</th>
                                <th className="px-8 py-4">Sold</th>
                                <th className="px-8 py-4">Total Revenue</th>
                                <th className="px-8 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {skipLineDeals.map((deal) => (
                                <tr key={deal.id} className="hover:bg-white/2 group transition-all">
                                    <td className="px-8 py-6">
                                        <span className="font-bold text-sm block">{deal.type}</span>
                                        <span className="text-[10px] text-[#B3B3B3]">Tonight's inventory</span>
                                    </td>
                                    <td className="px-8 py-6 font-medium text-sm text-[#1ed760]">${deal.price}</td>
                                    <td className="px-8 py-6 font-medium text-sm">{deal.sold} <span className="text-[#B3B3B3] text-xs">/ 50</span></td>
                                    <td className="px-8 py-6 font-bold text-sm">${deal.revenue}</td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="text-[10px] font-black uppercase text-[#8027BA] hover:text-white transition-colors">Adjust Price</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="bg-purple-600/5 border border-purple-500/20 p-8 rounded-[32px] flex items-center justify-between">
                    <div className="max-w-md">
                        <h4 className="text-xl font-bold mb-2">Dynamic Pricing Engine</h4>
                        <p className="text-sm text-[#B3B3B3]">AI has detected high demand. We suggest increasing Individual Pass price to $20 for the next hour to maximize revenue.</p>
                    </div>
                    <button className="px-8 py-4 bg-white text-black font-black text-xs uppercase rounded-2xl hover:scale-105 transition-transform">
                        Accept Surge Pricing
                    </button>
                </div>
            </div>
        </>
    );
}

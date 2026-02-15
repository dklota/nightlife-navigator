export const venueStats = {
    name: "G St Wunderbar",
    address: "228 G St, Davis, CA 95616",
    liveStatus: "LIT",
    litScore: 9.4,
    currentTraffic: 242,
    capacity: 300,
    avgWaitTime: 15,
    tonightRevenue: 1240,
};

export const trafficData = [
    { time: "9:00 PM", count: 42, wait: 0 },
    { time: "10:00 PM", count: 85, wait: 5 },
    { time: "11:00 PM", count: 156, wait: 15 },
    { time: "12:00 AM", count: 242, wait: 25 },
    { time: "1:00 AM", count: 210, wait: 20 },
    { time: "2:00 AM", count: 120, wait: 5 },
];

export const aiRecommendations = [
    {
        id: 1,
        type: "staffing",
        title: "Staffing Surge Alert",
        description: "Predicted surge at 11:30 PM. Add 1 extra bartender to bar A.",
        action: "Accept Recommendation",
        impact: "Saves 8m in wait time",
        priority: "high",
    },
    {
        id: 2,
        type: "inventory",
        title: "Stock Optimization",
        description: "Draft beer consumption is 30% higher than average tonight.",
        action: "Check Inventory",
        impact: "Prevents stockout",
        priority: "medium",
    },
];

export const skipLineDeals = [
    { id: 1, type: "Individual", price: 15, sold: 45, revenue: 675 },
    { id: 2, type: "Group (4+)", price: 50, sold: 12, revenue: 600 },
    { id: 3, type: "VIP Booth", price: 150, sold: 3, revenue: 450 },
];

export const vibeReports = [
    { metric: "Energy Level", value: "Extreme", trend: "Increasing", emoji: "🔥" },
    { metric: "Dance Floor", value: "85%", trend: "Stable", emoji: "💃" },
    { metric: "Music Vibe", value: "Techno/House", trend: "Request Heavy", emoji: "🎵" },
    { metric: "Drink Speed", value: "Fast", trend: "Optimal", emoji: "🍹" },
];

export const recentFeedback = [
    { user: "Sarah K.", text: "The wait was worth it for the music!", rating: 5, time: "2m ago" },
    { user: "James D.", text: "A bit too crowded near the entrance.", rating: 3, time: "10m ago" },
    { user: "Emma W.", text: "Best Friday night in Davis hands down.", rating: 5, time: "25m ago" },
];

import { useAuth } from '../context/AuthContext';
import { Activity, Users } from 'lucide-react';

export default function DashboardPage() {
    const { user } = useAuth();

    return (
        <div className="space-y-8">
            <header className="py-2">
                <h2 className="text-4xl font-bold mb-2">Dashboard</h2>
                <p className="text-gray-400">Welcome back, <span className="text-white font-medium">{user?.username}</span></p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Users"
                    value="1,234"
                    trend="+12%"
                    icon={<Users className="text-blue-400" />}
                />
                <StatCard
                    title="Active Sessions"
                    value="56"
                    trend="+5%"
                    icon={<Activity className="text-green-400" />}
                />
                <StatCard
                    title="Revenue"
                    value="$12,450"
                    trend="+8%"
                    icon={<span className="text-purple-400 font-bold">$</span>}
                />
            </div>

            {/* Content Area */}
            <div className="glass-card p-8 min-h-[400px]">
                <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-4 hover:bg-white/5 rounded-xl transition-colors border border-transparent hover:border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                                    <span className="text-xs font-bold text-gray-400">#{i}</span>
                                </div>
                                <div>
                                    <h4 className="font-medium">System Update</h4>
                                    <p className="text-xs text-gray-500">Successfully deployed patch v2.{i}.0</p>
                                </div>
                            </div>
                            <span className="text-xs text-gray-500">2h ago</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, trend, icon }: { title: string, value: string, trend: string, icon: React.ReactNode }) {
    return (
        <div className="glass-card p-6 flex flex-col justify-between hover:translate-y-[-2px] transition-transform">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-sm text-gray-400 font-medium mb-1">{title}</p>
                    <h3 className="text-3xl font-bold">{value}</h3>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    {icon}
                </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
                <span className="text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">{trend}</span>
                <span className="text-gray-500">vs last month</span>
            </div>
        </div>
    );
}

import { useEffect, useState } from 'react';
import api from '../services/api';
import { User, UserPlus, RefreshCw, AlertCircle, Loader2 } from 'lucide-react';

interface UserData {
    id: number;
    username: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (err) {
            console.error('Failed to fetch users:', err);
            setError('Failed to load users. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="space-y-6 animate-[fadeIn_0.5s_ease-out_forwards]">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
                        Users Management
                    </h2>
                    <p className="text-gray-400 mt-1 text-sm">Manage and monitor system users.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={fetchUsers}
                        className="btn-secondary flex items-center gap-2 py-2 px-4 h-10"
                        title="Refresh List"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button className="btn-primary flex items-center gap-2 py-2 px-4 h-10">
                        <UserPlus className="h-4 w-4" />
                        <span>Add User</span>
                    </button>
                </div>
            </header>

            <div className="glass-card overflow-hidden">
                {loading ? (
                    <div className="p-20 flex flex-col items-center justify-center space-y-4">
                        <Loader2 className="h-10 w-10 text-teal-400 animate-spin" />
                        <p className="text-gray-400">Loading users...</p>
                    </div>
                ) : error ? (
                    <div className="p-20 flex flex-col items-center justify-center space-y-4">
                        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                            <AlertCircle className="h-6 w-6 text-red-400" />
                        </div>
                        <p className="text-red-200">{error}</p>
                        <button onClick={fetchUsers} className="btn-secondary px-6">Retry</button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10">
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Username</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {users.length > 0 ? (
                                    users.map((user) => (
                                        <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4">
                                                <span className="text-gray-400 font-mono text-sm">#{user.id}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500/20 to-blue-500/20 flex items-center justify-center border border-white/10">
                                                        <User className="h-4 w-4 text-teal-400" />
                                                    </div>
                                                    <span className="text-gray-200 font-medium">{user.username}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-teal-400 hover:text-teal-300 text-sm font-medium transition-colors">
                                                    Edit
                                                </button>
                                                <span className="mx-2 text-gray-600">|</span>
                                                <button className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors">
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-12 text-center text-gray-400">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

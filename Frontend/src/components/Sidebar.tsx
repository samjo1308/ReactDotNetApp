import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Search, LogOut, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
    isCollapsed: boolean;
    toggleSidebar: () => void;
}

export default function Sidebar({ isCollapsed, toggleSidebar }: SidebarProps) {
    const { logout } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Users, label: 'Users', path: '/users' },
    ];

    return (
        <aside
            className={`glass-card rounded-none border-y-0 border-l-0 flex flex-col transition-all duration-300 relative z-50 
        ${isCollapsed ? 'w-20' : 'w-64'} h-screen`}
        >
            {/* Header / Toggle */}
            <div className="p-4 flex items-center justify-between border-b border-white/10 h-16">
                {!isCollapsed && (
                    <h1 className="text-xl font-bold tracking-wide animate-fade-in truncate">
                        Nexus<span className="text-teal-400">App</span>
                    </h1>
                )}
                <button
                    onClick={toggleSidebar}
                    className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${isCollapsed ? 'mx-auto' : ''}`}
                >
                    {isCollapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                </button>
            </div>

            {/* Search */}
            <div className="p-4">
                <div className={`bg-black/20 rounded-lg flex items-center transition-all ${isCollapsed ? 'justify-center p-2 cursor-pointer' : 'px-3 py-2'}`}>
                    <Search className={`text-gray-400 h-5 w-5 ${isCollapsed ? '' : 'mr-2'}`} />
                    {!isCollapsed && (
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm text-gray-200 placeholder-gray-500 w-full"
                        />
                    )}
                </div>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 px-2 space-y-2 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
              flex items-center gap-3 px-3 py-3 rounded-xl transition-all group
              ${isActive ? 'bg-teal-500/20 text-teal-400' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}
              ${isCollapsed ? 'justify-center' : ''}
            `}
                    >
                        <item.icon className="h-5 w-5 min-w-[20px]" />
                        {!isCollapsed && <span className="font-medium whitespace-nowrap">{item.label}</span>}

                        {/* Tooltip for collapsed state */}
                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                {item.label}
                            </div>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Footer / Logout */}
            <div className="p-4 border-t border-white/10">
                <button
                    onClick={logout}
                    className={`
            w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-red-400 hover:bg-red-500/10
            ${isCollapsed ? 'justify-center' : ''}
          `}
                >
                    <LogOut className="h-5 w-5 min-w-[20px]" />
                    {!isCollapsed && <span className="font-medium">Logout</span>}
                </button>
            </div>
        </aside>
    );
}


import React from 'react';
import { ViewType, Staff } from '../types';

interface SidebarProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  currentUserRole: Staff['role'];
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, currentUserRole }) => {
  const menuItems: { name: ViewType; icon: string }[] = [
    { name: 'Dashboard', icon: 'fa-chart-line' },
    { name: 'Branches', icon: 'fa-store' },
    { name: 'Inventory', icon: 'fa-boxes-stacked' },
    { name: 'Sales', icon: 'fa-cart-shopping' },
    { name: 'Staff', icon: 'fa-users' },
    { name: 'AI-Insights', icon: 'fa-brain' },
    { name: 'Database', icon: 'fa-database' },
  ];

  return (
    <aside className="w-64 bg-indigo-900 text-white flex-shrink-0 hidden md:flex flex-col shadow-xl">
      <div className="p-6 border-b border-indigo-800">
        <h1 className="text-2xl font-bold tracking-tight">OmniBranch Pro</h1>
        <p className="text-indigo-400 text-xs mt-1 italic uppercase">Management System</p>
      </div>
      <nav className="flex-1 mt-6 px-3 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveView(item.name)}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeView === item.name
                ? 'bg-indigo-700 text-white shadow-inner'
                : 'text-indigo-300 hover:bg-indigo-800 hover:text-white'
            }`}
          >
            <i className={`fas ${item.icon} w-6 text-center mr-3`}></i>
            {item.name}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-indigo-800">
        <div className="flex items-center space-x-3 bg-indigo-800 p-3 rounded-lg">
          <img src={`https://picsum.photos/seed/${currentUserRole}/40/40`} className="w-10 h-10 rounded-full border-2 border-indigo-500" alt="User" />
          <div className="overflow-hidden">
            <p className="text-xs font-semibold truncate">Current User</p>
            <p className="text-[10px] text-indigo-400 uppercase tracking-wider font-bold">{currentUserRole}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;


import React from 'react';
import { Staff } from '../types';

interface HeaderProps {
  activeView: string;
  currentUserRole: Staff['role'];
  setCurrentUserRole: (role: Staff['role']) => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, currentUserRole, setCurrentUserRole }) => {
  const roles: Staff['role'][] = ['Admin', 'Manager', 'Cashier', 'Stock'];

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
      <div className="flex items-center space-x-4">
        <h2 className="text-xl font-semibold text-gray-800">{activeView}</h2>
        <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
          System Live
        </span>
      </div>
      <div className="flex items-center space-x-6">
        <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
          <span className="text-[10px] font-bold text-gray-400 uppercase mr-3">Viewing As:</span>
          <select 
            value={currentUserRole}
            onChange={(e) => setCurrentUserRole(e.target.value as Staff['role'])}
            className="bg-transparent text-sm font-bold text-indigo-600 outline-none cursor-pointer"
          >
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
        
        <div className="relative">
          <i className="far fa-bell text-gray-400 hover:text-indigo-600 cursor-pointer text-xl transition-colors"></i>
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </div>
        <div className="h-8 w-[1px] bg-gray-200"></div>
        <div className="flex items-center space-x-2 cursor-pointer group">
          <span className="text-sm font-medium text-gray-600 group-hover:text-indigo-600 transition-colors">Language: English</span>
          <i className="fas fa-chevron-down text-xs text-gray-400"></i>
        </div>
      </div>
    </header>
  );
};

export default Header;

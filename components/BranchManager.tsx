
import React, { useState } from 'react';
import { Branch } from '../types';

interface Props {
  branches: Branch[];
  setBranches: React.Dispatch<React.SetStateAction<Branch[]>>;
}

const BranchManager: React.FC<Props> = ({ branches, setBranches }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newBranch, setNewBranch] = useState<Partial<Branch>>({});

  const addBranch = () => {
    if (newBranch.name && newBranch.location) {
      setBranches([...branches, {
        id: Math.random().toString(36).substr(2, 9),
        name: newBranch.name,
        location: newBranch.location,
        manager: newBranch.manager || 'Not Assigned',
        revenue: 0
      }]);
      setIsAdding(false);
      setNewBranch({});
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800">Branch Directory</h3>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
        >
          <i className="fas fa-plus mr-2"></i> Add New Branch
        </button>
      </div>

      {isAdding && (
        <div className="p-6 bg-gray-50 border-b border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fadeIn">
          <input 
            className="p-3 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Branch Name (e.g. Uttara Outlet)"
            value={newBranch.name || ''}
            onChange={(e) => setNewBranch({...newBranch, name: e.target.value})}
          />
          <input 
            className="p-3 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Location"
            value={newBranch.location || ''}
            onChange={(e) => setNewBranch({...newBranch, location: e.target.value})}
          />
          <button 
            onClick={addBranch}
            className="bg-green-600 text-white p-3 rounded-xl font-bold hover:bg-green-700 transition-colors"
          >
            Save Branch
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <th className="px-8 py-4 font-bold">Branch Name</th>
              <th className="px-8 py-4 font-bold">Location</th>
              <th className="px-8 py-4 font-bold">Manager</th>
              <th className="px-8 py-4 font-bold text-right">Revenue (৳)</th>
              <th className="px-8 py-4 font-bold text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {branches.map((branch) => (
              <tr key={branch.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-8 py-6">
                  <div className="font-bold text-gray-800">{branch.name}</div>
                  <div className="text-xs text-gray-400">ID: {branch.id}</div>
                </td>
                <td className="px-8 py-6 text-sm text-gray-600">{branch.location}</td>
                <td className="px-8 py-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">
                      {branch.manager.charAt(0)}
                    </div>
                    <span className="text-sm font-medium">{branch.manager}</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right font-mono font-bold text-indigo-600">
                  {branch.revenue.toLocaleString()}
                </td>
                <td className="px-8 py-6 text-center">
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase">
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BranchManager;

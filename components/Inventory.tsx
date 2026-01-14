
import React from 'react';
import { InventoryItem, Branch } from '../types';

interface Props {
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  branches: Branch[];
}

const Inventory: React.FC<Props> = ({ inventory, branches }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Inventory Control</h3>
          <p className="text-gray-500 text-sm">Real-time stock monitoring across all branches</p>
        </div>
        <div className="flex space-x-2">
           <div className="relative">
             <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
             <input className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm w-64 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Search product..." />
           </div>
           <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md">Export Excel</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-[10px] uppercase tracking-widest">
              <th className="px-8 py-4 font-bold">Item Details</th>
              <th className="px-8 py-4 font-bold">Branch</th>
              <th className="px-8 py-4 font-bold">Category</th>
              <th className="px-8 py-4 font-bold text-center">Quantity</th>
              <th className="px-8 py-4 font-bold text-right">Price</th>
              <th className="px-8 py-4 font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {inventory.map((item) => {
              const isLow = item.quantity <= item.lowStockThreshold;
              const branchName = branches.find(b => b.id === item.branchId)?.name || 'Unknown';
              
              return (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="font-bold text-gray-800">{item.name}</div>
                    <div className="text-[10px] text-gray-400 uppercase">Ref: {item.id}</div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-semibold px-2 py-1 bg-gray-100 rounded-lg text-gray-600">{branchName}</span>
                  </td>
                  <td className="px-8 py-5 text-sm text-gray-500">{item.category}</td>
                  <td className="px-8 py-5 text-center">
                    <div className={`font-bold ${isLow ? 'text-red-500' : 'text-gray-700'}`}>
                      {item.quantity}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right font-mono font-bold text-gray-700">
                    ৳{item.price.toLocaleString()}
                  </td>
                  <td className="px-8 py-5">
                    {isLow ? (
                      <span className="flex items-center text-red-600 text-[10px] font-bold uppercase animate-pulse">
                        <i className="fas fa-circle text-[6px] mr-1.5"></i> Restock Needed
                      </span>
                    ) : (
                      <span className="flex items-center text-green-600 text-[10px] font-bold uppercase">
                        <i className="fas fa-circle text-[6px] mr-1.5"></i> Sufficient
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;

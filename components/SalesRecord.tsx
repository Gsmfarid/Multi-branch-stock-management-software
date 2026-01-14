
import React from 'react';
import { Sale, Branch } from '../types';

interface Props {
  sales: Sale[];
  branches: Branch[];
}

const SalesRecord: React.FC<Props> = ({ sales, branches }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800">Transaction History</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
           <i className="fas fa-calendar mr-2"></i> Last 30 Days
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <th className="px-8 py-4 font-bold">Receipt #</th>
              <th className="px-8 py-4 font-bold">Branch</th>
              <th className="px-8 py-4 font-bold">Items Sold</th>
              <th className="px-8 py-4 font-bold">Date & Time</th>
              <th className="px-8 py-4 font-bold text-right">Total Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sales.map((sale) => {
               const branchName = branches.find(b => b.id === sale.branchId)?.name || 'Unknown';
               return (
                <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-5">
                    <span className="font-mono font-bold text-indigo-600">#{sale.id}</span>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium text-gray-700">{branchName}</td>
                  <td className="px-8 py-5">
                    <div className="flex -space-x-2 overflow-hidden">
                      {sale.items.map((_, idx) => (
                        <div key={idx} className="inline-block h-6 w-6 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-indigo-600">
                           {idx + 1}
                        </div>
                      ))}
                    </div>
                    <span className="text-[10px] text-gray-400 ml-2">{sale.items.length} items</span>
                  </td>
                  <td className="px-8 py-5 text-sm text-gray-500">
                    {new Date(sale.timestamp).toLocaleDateString()}
                    <span className="block text-[10px] text-gray-400">{new Date(sale.timestamp).toLocaleTimeString()}</span>
                  </td>
                  <td className="px-8 py-5 text-right font-bold text-gray-800">
                    ৳{sale.total.toLocaleString()}
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

export default SalesRecord;

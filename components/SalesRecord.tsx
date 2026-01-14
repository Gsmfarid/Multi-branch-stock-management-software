
import React from 'react';
import { Sale, Branch } from '../types';

interface Props {
  sales: Sale[];
  branches: Branch[];
}

const SalesRecord: React.FC<Props> = ({ sales, branches }) => {
  const exportToCSV = () => {
    // CSV Headers
    const headers = ['Receipt #', 'Branch', 'Items Count', 'Date', 'Time', 'Total Amount (BDT)'];
    
    // Convert data to CSV rows
    const csvRows = sales.map(sale => {
      const branchName = branches.find(b => b.id === sale.branchId)?.name || 'Unknown';
      const date = new Date(sale.timestamp);
      return [
        `#${sale.id}`,
        `"${branchName}"`,
        sale.items.length,
        date.toLocaleDateString(),
        date.toLocaleTimeString(),
        sale.total
      ].join(',');
    });

    // Combine headers and rows
    const csvContent = [headers.join(','), ...csvRows].join('\n');
    
    // Create Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const filename = `sales_report_${new Date().toISOString().split('T')[0]}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Transaction History</h3>
          <p className="text-xs text-gray-500 mt-0.5">Comprehensive list of all sales processed</p>
        </div>
        
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="flex items-center space-x-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
             <i className="fas fa-calendar text-indigo-400"></i> 
             <span className="font-medium">Last 30 Days</span>
          </div>
          
          <button 
            onClick={exportToCSV}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 hover:shadow-indigo-200 active:scale-95"
          >
            <i className="fas fa-file-csv"></i>
            <span>Export CSV</span>
          </button>
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
            {sales.length > 0 ? (
              sales.map((sale) => {
                 const branchName = branches.find(b => b.id === sale.branchId)?.name || 'Unknown';
                 return (
                  <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-5">
                      <span className="font-mono font-bold text-indigo-600">#{sale.id}</span>
                    </td>
                    <td className="px-8 py-5 text-sm font-medium text-gray-700">{branchName}</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center">
                        <div className="flex -space-x-2 overflow-hidden">
                          {sale.items.map((_, idx) => (
                            <div key={idx} className="inline-block h-6 w-6 rounded-full bg-indigo-50 border-2 border-white flex items-center justify-center text-[8px] font-bold text-indigo-600">
                               {idx + 1}
                            </div>
                          ))}
                        </div>
                        <span className="text-[10px] text-gray-400 ml-2 font-medium">{sale.items.length} items</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm text-gray-500">
                      <div className="font-medium text-gray-700">{new Date(sale.timestamp).toLocaleDateString()}</div>
                      <div className="text-[10px] text-gray-400">{new Date(sale.timestamp).toLocaleTimeString()}</div>
                    </td>
                    <td className="px-8 py-5 text-right font-bold text-gray-800">
                      ৳{sale.total.toLocaleString()}
                    </td>
                  </tr>
                 );
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-8 py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center">
                    <i className="fas fa-inbox text-4xl mb-3 opacity-20"></i>
                    <p>No transaction history found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
        <span>Showing {sales.length} records</span>
        <div className="flex space-x-1">
          <button className="px-2 py-1 bg-white border border-gray-200 rounded text-gray-300 cursor-not-allowed">Previous</button>
          <button className="px-2 py-1 bg-white border border-gray-200 rounded hover:border-indigo-300 hover:text-indigo-500 transition-colors">Next</button>
        </div>
      </div>
    </div>
  );
};

export default SalesRecord;

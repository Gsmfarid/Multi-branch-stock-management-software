
import React from 'react';
import { Branch, InventoryItem, Sale } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area, ReferenceLine } from 'recharts';

interface DashboardProps {
  branches: Branch[];
  inventory: InventoryItem[];
  sales: Sale[];
}

const Dashboard: React.FC<DashboardProps> = ({ branches, inventory, sales }) => {
  const totalRevenue = branches.reduce((acc, curr) => acc + curr.revenue, 0);
  const lowStockItems = inventory.filter(item => item.quantity <= item.lowStockThreshold).length;
  const totalItems = inventory.length;
  const totalSalesCount = sales.length;

  const COLORS = ['#4f46e5', '#818cf8', '#c7d2fe', '#6366f1'];

  // Process sales data for the last 7 days trend
  const getSalesTrendData = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last7Days.push({
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: d.toISOString().split('T')[0],
        total: 0
      });
    }

    sales.forEach(sale => {
      const saleDate = sale.timestamp.split('T')[0];
      const dayData = last7Days.find(d => d.fullDate === saleDate);
      if (dayData) {
        dayData.total += sale.total;
      }
    });

    return last7Days;
  };

  const trendData = getSalesTrendData();

  const stats = [
    { label: 'Total Revenue', value: `৳${totalRevenue.toLocaleString()}`, icon: 'fa-bangladeshi-taka-sign', color: 'bg-emerald-500', trend: '+12.5%' },
    { label: 'Low Stock Alerts', value: lowStockItems, icon: 'fa-triangle-exclamation', color: 'bg-amber-500', trend: lowStockItems > 0 ? 'Action Needed' : 'Normal' },
    { label: 'Active Branches', value: branches.length, icon: 'fa-store', color: 'bg-indigo-500', trend: 'Stable' },
    { label: 'Sales Today', value: totalSalesCount, icon: 'fa-receipt', color: 'bg-rose-500', trend: '+5.2%' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-transform hover:scale-[1.02] duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-xl text-white`}>
                <i className={`fas ${stat.icon} text-xl`}></i>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trend.includes('+') ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Main Trend Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Sales Trend</h3>
            <p className="text-xs text-gray-500">Revenue performance over the last 7 days</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-indigo-500 rounded-full"></span>
            <span className="text-xs font-semibold text-gray-600">Daily Revenue (৳)</span>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 12}} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 12}}
                tickFormatter={(value) => `৳${value}`}
              />
              <Tooltip 
                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                formatter={(value: number) => [`৳${value.toLocaleString()}`, 'Revenue']}
              />
              <Area 
                type="monotone" 
                dataKey="total" 
                stroke="#6366f1" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorTotal)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-gray-800">Branch Revenue Distribution</h3>
            <button className="text-indigo-600 text-xs font-semibold hover:underline">View Full Report</button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={branches}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}} 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  formatter={(value: number) => [`৳${value.toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="revenue" radius={[6, 6, 0, 0]} barSize={40}>
                  {branches.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Recent Activities</h3>
          <div className="space-y-6">
            {sales.length > 0 ? (
              sales.slice(-5).reverse().map((sale, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                    <i className="fas fa-shopping-bag"></i>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Sale of ৳{sale.total.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{new Date(sale.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - Branch #{sale.branchId}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 py-4 text-sm italic">No recent sales</p>
            )}
            
            {lowStockItems > 0 && (
              <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-100">
                <p className="text-amber-800 text-sm font-bold flex items-center">
                  <i className="fas fa-triangle-exclamation mr-2"></i>
                  Inventory Alert
                </p>
                <p className="text-amber-700 text-xs mt-1">{lowStockItems} items are below critical thresholds.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


import React, { useState, useEffect } from 'react';
import { Branch, InventoryItem, Sale, Staff, ViewType } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import BranchManager from './components/BranchManager';
import Inventory from './components/Inventory';
import SalesRecord from './components/SalesRecord';
import StaffList from './components/StaffList';
import AIInsights from './components/AIInsights';
import DatabaseSchema from './components/DatabaseSchema';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('Dashboard');
  const [branches, setBranches] = useState<Branch[]>([
    { id: '1', name: 'Dhaka Main', location: 'Gulshan', manager: 'Rahim Khan', revenue: 45000 },
    { id: '2', name: 'Chittagong Hub', location: 'Agrabad', manager: 'Karim Ahmed', revenue: 32000 },
    { id: '3', name: 'Sylhet Outlet', location: 'Zindabazar', manager: 'Sabina Akter', revenue: 15000 },
  ]);

  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: 'i1', branchId: '1', name: 'Product A', category: 'Electronics', quantity: 50, price: 1200, lowStockThreshold: 10 },
    { id: 'i2', branchId: '1', name: 'Product B', category: 'Clothing', quantity: 5, price: 800, lowStockThreshold: 15 },
    { id: 'i3', branchId: '2', name: 'Product C', category: 'Food', quantity: 100, price: 50, lowStockThreshold: 20 },
  ]);

  const [sales, setSales] = useState<Sale[]>([
    { id: 's1', branchId: '1', timestamp: new Date().toISOString(), total: 2400, items: ['Product A', 'Product A'] },
    { id: 's2', branchId: '2', timestamp: new Date().toISOString(), total: 800, items: ['Product B'] },
  ]);

  const [staff, setStaff] = useState<Staff[]>([
    { id: 'st1', branchId: '1', name: 'Anisur Rahman', role: 'Admin', phone: '01712345678' },
    { id: 'st2', branchId: '1', name: 'Moni Begum', role: 'Cashier', phone: '01812345678' },
    { id: 'st3', branchId: '2', name: 'Farid Uddin', role: 'Manager', phone: '01912345678' },
  ]);

  const renderContent = () => {
    switch (activeView) {
      case 'Dashboard':
        return <Dashboard branches={branches} inventory={inventory} sales={sales} />;
      case 'Branches':
        return <BranchManager branches={branches} setBranches={setBranches} />;
      case 'Inventory':
        return <Inventory inventory={inventory} setInventory={setInventory} branches={branches} />;
      case 'Sales':
        return <SalesRecord sales={sales} branches={branches} />;
      case 'Staff':
        return <StaffList staff={staff} branches={branches} setStaff={setStaff} />;
      case 'AI-Insights':
        return <AIInsights data={{ branches, inventory, sales }} />;
      case 'Database':
        return <DatabaseSchema />;
      default:
        return <Dashboard branches={branches} inventory={inventory} sales={sales} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activeView={activeView} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;

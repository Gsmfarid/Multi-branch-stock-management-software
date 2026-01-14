
import React from 'react';

const DatabaseSchema: React.FC = () => {
  const sqlSchema = `
-- OmniBranch Pro: Full Database Schema
-- Multi-branch Management System

CREATE DATABASE IF NOT EXISTS omni_management;
USE omni_management;

-- 1. Branches Table
CREATE TABLE branches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    manager_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Inventory Table
CREATE TABLE inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    branch_id INT,
    product_name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    quantity INT DEFAULT 0,
    price DECIMAL(10, 2) NOT NULL,
    low_stock_threshold INT DEFAULT 10,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE
);

-- 3. Staff Table
CREATE TABLE staff (
    id INT AUTO_INCREMENT PRIMARY KEY,
    branch_id INT,
    name VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Manager', 'Cashier', 'Stock') NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    password_hash VARCHAR(255),
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL
);

-- 4. Sales Table
CREATE TABLE sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    branch_id INT,
    staff_id INT,
    total_amount DECIMAL(15, 2) NOT NULL,
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id),
    FOREIGN KEY (staff_id) REFERENCES staff(id)
);

-- 5. Sale Items (Details)
CREATE TABLE sale_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sale_id INT,
    product_id INT,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES inventory(id)
);
  `.trim();

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-xl">
        <div className="flex">
          <i className="fas fa-info-circle text-amber-500 text-xl mr-4"></i>
          <div>
            <h4 className="text-amber-800 font-bold mb-1">Developer Notice</h4>
            <p className="text-amber-700 text-sm">
              This React application simulates the management system's frontend logic. To connect it to a real MySQL database, you can use the SQL schema below with a PHP (Laravel/Slim) or Node.js backend.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-4 text-gray-400 text-xs font-mono tracking-tighter">database_schema.sql</span>
          </div>
          <button 
            onClick={() => navigator.clipboard.writeText(sqlSchema)}
            className="text-gray-400 hover:text-white transition-colors text-xs flex items-center"
          >
            <i className="far fa-copy mr-2"></i> Copy SQL
          </button>
        </div>
        <pre className="p-8 overflow-x-auto text-sm leading-relaxed">
          <code className="text-emerald-400 font-mono">
            {sqlSchema}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default DatabaseSchema;

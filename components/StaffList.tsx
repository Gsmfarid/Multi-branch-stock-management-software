
import React from 'react';
import { Staff, Branch } from '../types';

interface Props {
  staff: Staff[];
  branches: Branch[];
  setStaff: React.Dispatch<React.SetStateAction<Staff[]>>;
}

const StaffList: React.FC<Props> = ({ staff, branches }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {staff.map((member) => {
        const branchName = branches.find(b => b.id === member.branchId)?.name || 'N/A';
        const roleColors: Record<string, string> = {
          Admin: 'bg-purple-100 text-purple-700',
          Manager: 'bg-blue-100 text-blue-700',
          Cashier: 'bg-green-100 text-green-700',
          Stock: 'bg-amber-100 text-amber-700',
        };

        return (
          <div key={member.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:shadow-md transition-shadow">
            <div className="relative mb-4">
              <img src={`https://picsum.photos/seed/${member.id}/100/100`} className="w-24 h-24 rounded-full border-4 border-indigo-50 shadow-inner" alt={member.name} />
              <div className={`absolute bottom-0 right-0 px-2 py-1 rounded-lg text-[10px] font-black uppercase shadow-sm ${roleColors[member.role]}`}>
                {member.role}
              </div>
            </div>
            <h4 className="text-lg font-bold text-gray-800">{member.name}</h4>
            <p className="text-sm text-gray-500 mt-1">{branchName}</p>
            
            <div className="mt-6 w-full pt-6 border-t border-gray-50 flex justify-center space-x-4">
              <a href={`tel:${member.phone}`} className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                <i className="fas fa-phone"></i>
              </a>
              <button className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                <i className="fas fa-envelope"></i>
              </a>
              <button className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                <i className="fas fa-edit"></i>
              </a>
            </div>
          </div>
        );
      })}
      
      <button className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-6 hover:bg-white hover:border-indigo-300 transition-all group min-h-[250px]">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors mb-4">
          <i className="fas fa-plus text-xl"></i>
        </div>
        <p className="font-bold text-gray-400 group-hover:text-indigo-600">Hire New Staff</p>
      </button>
    </div>
  );
};

export default StaffList;

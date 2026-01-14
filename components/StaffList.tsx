
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Staff, Branch } from '../types';
import { GoogleGenAI } from "@google/genai";

interface Props {
  staff: Staff[];
  branches: Branch[];
  setStaff: React.Dispatch<React.SetStateAction<Staff[]>>;
  currentUserRole: Staff['role'];
}

const StaffList: React.FC<Props> = ({ staff, branches, setStaff, currentUserRole }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [showOnlyAtRisk, setShowOnlyAtRisk] = useState(false);
  const [newStaff, setNewStaff] = useState<Partial<Staff>>({
    role: 'Cashier',
    branchId: branches[0]?.id || '',
  });

  // UI state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Staff>>({});
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isAdmin = currentUserRole === 'Admin';

  // Threshold for performance alerts
  const PERFORMANCE_THRESHOLD = 75;

  // Check if any filters are currently active
  const isFilterActive = searchQuery.trim() !== '' || showOnlyAtRisk;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const getStaffMetrics = (member: Staff) => {
    if (member.metrics) return member.metrics;
    const seed = member.id.length;
    const performance = 70 + (seed % 25);
    
    switch (member.role) {
      case 'Cashier':
        return {
          performanceScore: performance,
          primaryMetricLabel: 'Sales/Hr',
          primaryMetricValue: 1200 + (seed * 100) % 3000,
          secondaryMetricLabel: 'Efficiency',
          secondaryMetricValue: 80 + (seed % 15)
        };
      case 'Stock':
        return {
          performanceScore: performance - 5,
          primaryMetricLabel: 'Accuracy',
          primaryMetricValue: 90 + (seed % 9),
          secondaryMetricLabel: 'Turnover',
          secondaryMetricValue: 4.5 + (seed % 3)
        };
      case 'Manager':
      case 'Admin':
        return {
          performanceScore: performance + 2,
          primaryMetricLabel: 'Growth',
          primaryMetricValue: 10 + (seed % 12),
          secondaryMetricLabel: 'Team Sat.',
          secondaryMetricValue: 85 + (seed % 12)
        };
      default:
        return {
          performanceScore: 75,
          primaryMetricLabel: 'Rating',
          primaryMetricValue: 4.2,
          secondaryMetricLabel: 'Attendance',
          secondaryMetricValue: 98
        };
    }
  };

  // Identify at-risk staff members
  const atRiskStaff = useMemo(() => {
    return staff.filter(member => {
      const metrics = getStaffMetrics(member);
      return metrics.performanceScore < PERFORMANCE_THRESHOLD;
    });
  }, [staff]);

  const filteredStaff = staff.filter((member) => {
    const metrics = getStaffMetrics(member);
    const isAtRisk = metrics.performanceScore < PERFORMANCE_THRESHOLD;
    
    if (showOnlyAtRisk && !isAtRisk) return false;

    if (!searchQuery.trim()) return true;
    
    const branchName = branches.find(b => b.id === member.branchId)?.name || '';
    const searchableFields = [member.name, member.role, branchName, member.phone].map(f => f.toLowerCase());
    const tokens = searchQuery.toLowerCase().split(/\s+/).filter(t => t.length > 0);
    return tokens.every(token => searchableFields.some(field => field.includes(token)));
  });

  const handleAddStaff = () => {
    if (newStaff.name && newStaff.role && newStaff.branchId && newStaff.phone) {
      const staffMember: Staff = {
        id: `st-${Math.random().toString(36).substr(2, 9)}`,
        name: newStaff.name,
        role: newStaff.role as Staff['role'],
        branchId: newStaff.branchId,
        phone: newStaff.phone,
        avatarUrl: newStaff.avatarUrl,
      };
      setStaff([...staff, staffMember]);
      setIsAdding(false);
      setNewStaff({ role: 'Cashier', branchId: branches[0]?.id || '' });
    }
  };

  const handleDeleteStaff = (id: string) => {
    if (window.confirm("Are you sure you want to delete this staff member? This action cannot be undone.")) {
      setStaff(staff.filter(s => s.id !== id));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, memberId?: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (memberId) {
          setStaff(prev => prev.map(s => s.id === memberId ? { ...s, avatarUrl: base64String } : s));
          if (editingId === memberId) setEditForm(prev => ({ ...prev, avatarUrl: base64String }));
        } else {
          setNewStaff(prev => ({ ...prev, avatarUrl: base64String }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const generateAIAvatar = async (member: Partial<Staff>, memberId: string | 'new') => {
    const name = member.name || "Staff Member";
    const role = member.role || "Employee";
    setIsGenerating(memberId);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `A professional, clean-background profile headshot of a ${role} named ${name}. High quality, photorealistic.`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
      });
      let imageUrl = "";
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) { imageUrl = `data:image/png;base64,${part.inlineData.data}`; break; }
      }
      if (imageUrl) {
        if (memberId === 'new') setNewStaff(prev => ({ ...prev, avatarUrl: imageUrl }));
        else {
          setStaff(prev => prev.map(s => s.id === memberId ? { ...s, avatarUrl: imageUrl } : s));
          if (editingId === memberId) setEditForm(prev => ({ ...prev, avatarUrl: imageUrl }));
        }
      }
    } catch (error) {
      console.error("Failed to generate AI Avatar:", error);
      alert("AI Generation failed.");
    } finally {
      setIsGenerating(null);
    }
  };

  const startEditing = (member: Staff) => {
    setEditingId(member.id);
    setEditForm({ ...member });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEditing = () => {
    if (editingId && editForm.name) {
      setStaff(prev => prev.map(s => s.id === editingId ? { ...s, ...editForm } as Staff : s));
      setEditingId(null);
      setEditForm({});
    }
  };

  const roleConfig: Record<string, { colorClass: string, icon: string }> = {
    Admin: { colorClass: 'bg-purple-100 text-purple-700 border-purple-200', icon: 'fa-shield-halved' },
    Manager: { colorClass: 'bg-blue-100 text-blue-700 border-blue-200', icon: 'fa-user-tie' },
    Cashier: { colorClass: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: 'fa-cash-register' },
    Stock: { colorClass: 'bg-amber-100 text-amber-700 border-amber-200', icon: 'fa-box-open' },
  };

  const handleSimulatedAction = (action: string, name: string) => {
    alert(`${action} for ${name} has been initiated. (Simulation)`);
    setActiveMenuId(null);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setShowOnlyAtRisk(false);
  };

  return (
    <div className="space-y-6">
      <input type="file" className="hidden" ref={fileInputRef} accept="image/*" onChange={(e) => handleFileUpload(e, editingId || undefined)} />

      {/* Performance Summary Banner */}
      {atRiskStaff.length > 0 && !showOnlyAtRisk && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center space-x-3 text-amber-800">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
              <i className="fas fa-triangle-exclamation"></i>
            </div>
            <div>
              <p className="text-sm font-bold">Performance Alert</p>
              <p className="text-xs opacity-90">{atRiskStaff.length} staff members are performing below target ({PERFORMANCE_THRESHOLD}%).</p>
            </div>
          </div>
          <button 
            onClick={() => setShowOnlyAtRisk(true)}
            className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-xl text-xs font-bold transition-colors"
          >
            Review At-Risk Staff
          </button>
        </div>
      )}

      {showOnlyAtRisk && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center justify-between">
           <div className="flex items-center space-x-3 text-indigo-800">
              <i className="fas fa-filter text-indigo-400"></i>
              <span className="text-sm font-bold">Showing At-Risk Staff Only</span>
           </div>
           <button 
             onClick={() => setShowOnlyAtRisk(false)}
             className="text-indigo-600 hover:text-indigo-800 text-xs font-bold underline"
           >
             Clear Filter
           </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex-1 flex items-center">
          <div className="relative flex-1">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Search by name, role, branch, or phone..."
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Clear Filters Button */}
        {isFilterActive && (
          <button 
            onClick={handleClearFilters}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl font-bold text-sm transition-all flex items-center justify-center border border-gray-200 animate-fadeIn whitespace-nowrap"
          >
            <i className="fas fa-filter-circle-xmark mr-2 text-indigo-500"></i>
            Clear Filters
          </button>
        )}

        {isAdmin && (
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all flex items-center justify-center shadow-lg whitespace-nowrap ${isAdding ? 'bg-rose-500 text-white shadow-rose-100' : 'bg-indigo-600 text-white shadow-indigo-100'}`}
          >
            <i className={`fas ${isAdding ? 'fa-times' : 'fa-user-plus'} mr-2`}></i>
            {isAdding ? 'Cancel' : 'Add New Staff'}
          </button>
        )}
      </div>

      {isAdmin && isAdding && (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-indigo-100 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="flex flex-col items-center justify-center border-r border-gray-100 pr-4">
              <div className="relative group">
                <img src={newStaff.avatarUrl || `https://picsum.photos/seed/new/120/120`} className="w-20 h-20 rounded-full object-cover border-2 border-indigo-100" alt="Preview" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-full space-x-2">
                  <button onClick={() => fileInputRef.current?.click()} className="text-white"><i className="fas fa-camera"></i></button>
                  <button onClick={() => generateAIAvatar(newStaff, 'new')} className="text-white"><i className="fas fa-sparkles"></i></button>
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Full Name</label>
              <input type="text" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm" value={newStaff.name || ''} onChange={(e) => setNewStaff({...newStaff, name: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Role</label>
              <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm" value={newStaff.role || 'Cashier'} onChange={(e) => setNewStaff({...newStaff, role: e.target.value as any})}>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Cashier">Cashier</option>
                <option value="Stock">Stock</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Branch</label>
              <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm" value={newStaff.branchId || ''} onChange={(e) => setNewStaff({...newStaff, branchId: e.target.value})}>
                {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Phone</label>
              <div className="flex space-x-2">
                <input type="text" className="flex-1 p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm" value={newStaff.phone || ''} onChange={(e) => setNewStaff({...newStaff, phone: e.target.value})} />
                <button onClick={handleAddStaff} className="bg-indigo-600 text-white px-5 rounded-xl font-bold">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map((member) => {
          const branchName = branches.find(b => b.id === member.branchId)?.name || 'N/A';
          const isEditing = editingId === member.id;
          const metrics = getStaffMetrics(member);
          const isAtRisk = metrics.performanceScore < PERFORMANCE_THRESHOLD;
          const currentRole = isEditing ? editForm.role : member.role;
          const config = roleConfig[currentRole as string] || { colorClass: 'bg-gray-100 text-gray-700 border-gray-200', icon: 'fa-user' };
          const avatarSrc = (isEditing ? editForm.avatarUrl : member.avatarUrl) || `https://picsum.photos/seed/${member.id}/120/120`;
          const isMenuOpen = activeMenuId === member.id;

          return (
            <div 
              key={member.id} 
              className={`bg-white rounded-2xl p-6 shadow-sm border flex flex-col items-center text-center transition-all relative ${
                isEditing ? 'border-indigo-400 ring-2 ring-indigo-50 shadow-lg' : 
                isAtRisk ? 'border-amber-200 border-l-4 border-l-amber-400' : 'border-gray-100 hover:shadow-md'
              }`}
            >
              {/* Performance Badge */}
              {isAtRisk && !isEditing && (
                <div className="absolute top-4 left-4">
                  <span className="bg-amber-100 text-amber-700 text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter shadow-sm border border-amber-200 animate-pulse">
                    Needs Review
                  </span>
                </div>
              )}

              {/* Quick Actions Dropdown */}
              {!isEditing && (
                <div className="absolute top-4 right-4">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setActiveMenuId(isMenuOpen ? null : member.id); }}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
                  >
                    <i className="fas fa-ellipsis-vertical"></i>
                  </button>
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-20 py-2 animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => { startEditing(member); setActiveMenuId(null); }} className="w-full text-left px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 flex items-center">
                        <i className="fas fa-edit w-5 mr-2"></i> Edit Profile
                      </button>
                      <button onClick={() => handleSimulatedAction('Task Assignment', member.name)} className="w-full text-left px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 flex items-center">
                        <i className="fas fa-tasks w-5 mr-2"></i> Assign Task
                      </button>
                      <button onClick={() => handleSimulatedAction('Schedule View', member.name)} className="w-full text-left px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 flex items-center">
                        <i className="fas fa-calendar-days w-5 mr-2"></i> View Schedule
                      </button>
                      {isAdmin && (
                        <>
                          <hr className="my-1 border-gray-50" />
                          <button onClick={() => { handleDeleteStaff(member.id); setActiveMenuId(null); }} className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center">
                            <i className="fas fa-trash-can w-5 mr-2"></i> Delete Staff
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="relative mb-6 w-full flex flex-col items-center">
                <div className="relative overflow-hidden rounded-full group/avatar">
                  <img src={avatarSrc} className={`w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover ring-4 ring-gray-50 transition-transform ${isEditing ? '' : 'hover:scale-105'} duration-300`} alt={member.name} />
                  {isAdmin && (
                    <div className={`absolute inset-0 bg-black/40 flex items-center justify-center space-x-3 transition-opacity duration-200 ${isEditing ? 'opacity-100' : 'opacity-0 group-hover/avatar:opacity-100'}`}>
                      <button onClick={() => { setEditingId(member.id); fileInputRef.current?.click(); }} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-sm"><i className="fas fa-camera text-sm"></i></button>
                      <button onClick={() => generateAIAvatar(isEditing ? editForm : member, member.id)} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-sm"><i className="fas fa-sparkles text-sm"></i></button>
                    </div>
                  )}
                  {isGenerating === member.id && (
                    <div className="absolute inset-0 bg-white/60 flex flex-col items-center justify-center backdrop-blur-[2px]">
                      <i className="fas fa-circle-notch fa-spin text-indigo-600 text-xl mb-1"></i>
                      <span className="text-[8px] font-bold text-indigo-700 uppercase tracking-tighter">Generating</span>
                    </div>
                  )}
                </div>
                <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md border flex items-center space-x-1.5 whitespace-nowrap z-10 ${config.colorClass}`}>
                  <i className={`fas ${config.icon} text-[11px]`}></i>
                  {isEditing ? (
                    <select className="bg-transparent border-none p-0 focus:ring-0 outline-none cursor-pointer" value={editForm.role} onChange={(e) => setEditForm({...editForm, role: e.target.value as Staff['role']})}>
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="Cashier">Cashier</option>
                      <option value="Stock">Stock</option>
                    </select>
                  ) : (<span>{member.role}</span>)}
                </div>
              </div>

              <div className="mt-2 w-full">
                {isEditing ? (
                  <input type="text" className="w-full text-center text-xl font-bold text-gray-800 bg-gray-50 border border-gray-200 rounded-lg py-1 px-2 focus:ring-2 focus:ring-indigo-500 outline-none" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} autoFocus />
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <h4 className="text-xl font-bold text-gray-800 truncate">{member.name}</h4>
                    {isAtRisk && <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.6)]"></span>}
                  </div>
                )}
                <div className="flex items-center justify-center space-x-1.5 mt-2 text-gray-500">
                  <i className="fas fa-location-dot text-xs text-indigo-400"></i>
                  {isEditing ? (
                    <select className="bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium py-1 px-2 outline-none" value={editForm.branchId} onChange={(e) => setEditForm({...editForm, branchId: e.target.value})}>
                      {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  ) : (<p className="text-sm font-medium">{branchName}</p>)}
                </div>
              </div>

              {!isEditing && (
                <div className="mt-6 w-full space-y-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Performance</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${metrics.performanceScore > 85 ? 'bg-green-100 text-green-700' : isAtRisk ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'}`}>
                      {metrics.performanceScore}% Score
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[11px] font-medium">
                        <span className="text-gray-500">{metrics.primaryMetricLabel}</span>
                        <span className="text-gray-800 font-bold">{member.role === 'Cashier' ? `৳${metrics.primaryMetricValue.toLocaleString()}` : `${metrics.primaryMetricValue}%`}</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-1000 ${isAtRisk ? 'bg-amber-500' : member.role === 'Cashier' ? 'bg-indigo-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, (metrics.primaryMetricValue / (member.role === 'Cashier' ? 5000 : 100)) * 100)}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-6 w-full pt-6 border-t border-gray-50 flex justify-center space-x-4">
                {isEditing ? (
                  <>
                    <button onClick={saveEditing} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-sm">Save</button>
                    <button onClick={cancelEditing} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold">Cancel</button>
                  </>
                ) : (
                  <>
                    <a href={`tel:${member.phone}`} className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"><i className="fas fa-phone"></i></a>
                    <button title="Review History" className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all"><i className="fas fa-chart-line"></i></button>
                    {isAtRisk && isAdmin && (
                      <button 
                        onClick={() => handleSimulatedAction('Coaching Invite', member.name)}
                        title="Send Coaching Invite" 
                        className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 hover:text-amber-700 hover:bg-amber-100 transition-all"
                      >
                        <i className="fas fa-graduation-cap"></i>
                      </button>
                    )}
                    <button title="Message" className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"><i className="far fa-comment"></i></button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StaffList;

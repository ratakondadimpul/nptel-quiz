import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Edit, ChevronRight } from 'lucide-react';
import { fetchWeeks, saveWeek, deleteWeek } from '../../lib/store';
import { Week } from '../../types';

const ManageWeeks = () => {
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWeek, setEditingWeek] = useState<Week | null>(null);
  
  const [formData, setFormData] = useState({ weekNumber: 1, title: '' });

  const loadData = async () => {
    setLoading(true);
    const data = await fetchWeeks();
    setWeeks(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveWeek({
      weekNumber: Number(formData.weekNumber),
      title: formData.title
    }, editingWeek?.id);
    
    setIsModalOpen(false);
    setEditingWeek(null);
    setFormData({ weekNumber: weeks.length + 2, title: '' });
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this week? All questions will be lost.')) {
      await deleteWeek(id);
      loadData();
    }
  };

  const openModal = (week?: Week) => {
    if (week) {
      setEditingWeek(week);
      setFormData({ weekNumber: week.weekNumber, title: week.title });
    } else {
      setEditingWeek(null);
      setFormData({ weekNumber: weeks.length + 1, title: '' });
    }
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link to="/admin/dashboard" className="text-slate-500 hover:text-blue-600 text-sm font-bold uppercase tracking-wider mb-2 block">
            &larr; Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">Manage Weeks</h1>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors shadow-sm"
        >
          <Plus size={20} className="mr-1" /> Add Week
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20">Loading...</div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          {weeks.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No weeks found. Add one to get started.</div>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {weeks.map(week => (
                <li key={week.id} className="p-4 sm:p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-1 block">Week {week.weekNumber}</span>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{week.title}</h3>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Link 
                      to={`/admin/weeks/${week.id}/questions`}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium text-sm transition-colors flex items-center"
                    >
                      Questions <ChevronRight size={16} className="ml-1" />
                    </Link>
                    <button 
                      onClick={() => openModal(week)}
                      className="p-2 text-slate-400 hover:text-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(week.id)}
                      className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
            <h2 className="text-xl font-bold mb-4">{editingWeek ? 'Edit Week' : 'Add New Week'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Week Number</label>
                <input 
                  type="number" 
                  required 
                  min="1"
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.weekNumber}
                  onChange={e => setFormData({...formData, weekNumber: Number(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Introduction to React"
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageWeeks;

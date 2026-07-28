import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, HelpCircle, Users, ArrowRight } from 'lucide-react';
import { fetchWeeks } from '../../lib/store';

const AdminDashboard = () => {
  const [weeksCount, setWeeksCount] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      const weeks = await fetchWeeks();
      setWeeksCount(weeks.length);
    };
    loadData();
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between border-l-4 border-blue-500">
          <div>
            <p className="text-slate-500 font-medium mb-1">Total Weeks</p>
            <h3 className="text-3xl font-black text-slate-800 dark:text-white">{weeksCount}</h3>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-500">
            <BookOpen size={32} />
          </div>
        </div>
        
        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between border-l-4 border-orange-500">
          <div>
            <p className="text-slate-500 font-medium mb-1">Questions (Avg/Week)</p>
            <h3 className="text-3xl font-black text-slate-800 dark:text-white">~10</h3>
          </div>
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-orange-500">
            <HelpCircle size={32} />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between border-l-4 border-green-500">
          <div>
            <p className="text-slate-500 font-medium mb-1">Active Learners</p>
            <h3 className="text-3xl font-black text-slate-800 dark:text-white">...</h3>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-green-500">
            <Users size={32} />
          </div>
        </div>
      </div>

      <div className="glass-panel p-8 rounded-3xl">
        <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link to="/admin/weeks" className="p-6 border-2 border-slate-100 dark:border-slate-700 rounded-2xl hover:border-blue-500 dark:hover:border-blue-500 transition group flex flex-col justify-between h-full">
            <div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                <BookOpen size={24} />
              </div>
              <h3 className="text-lg font-bold mb-2">Manage Weeks & Content</h3>
              <p className="text-slate-500 text-sm">Add, edit, or remove weekly modules and upload questions.</p>
            </div>
            <div className="mt-4 flex items-center text-blue-600 font-bold text-sm group-hover:underline">
              Go to Weeks <ArrowRight size={16} className="ml-1" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

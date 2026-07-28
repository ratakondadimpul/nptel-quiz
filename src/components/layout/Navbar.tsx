import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Flame, BookOpen, ShieldCheck } from 'lucide-react';
import { useStats } from '../../contexts/StatsContext';

const Navbar = () => {
  const { stats } = useStats();
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <nav className="glass-panel sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2 rounded-lg">
              <BookOpen size={24} />
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
              NPTEL Quiz Platform
            </span>
          </Link>
          
          <div className="flex items-center space-x-6">
            {!isAdminRoute && (
              <>
                <Link to="/weeks" className="text-slate-600 hover:text-blue-600 dark:text-slate-300 font-medium transition-colors">
                  All Weeks
                </Link>
                <div className="flex items-center space-x-1 bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 px-3 py-1 rounded-full font-bold shadow-sm border border-orange-200 dark:border-orange-800">
                  <Flame size={18} className={stats.streak > 0 ? "animate-pulse" : ""} />
                  <span>{stats.streak} {stats.streak === 1 ? 'Day' : 'Days'}</span>
                </div>
              </>
            )}
            
            {isAdminRoute ? (
              <Link to="/" className="text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400">
                Exit Admin
              </Link>
            ) : (
              <Link to="/admin" className="text-slate-400 hover:text-blue-500 transition-colors" title="Admin Login">
                <ShieldCheck size={20} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

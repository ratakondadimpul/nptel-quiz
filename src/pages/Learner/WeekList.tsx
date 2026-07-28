import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Target, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchWeeks } from '../../lib/store';
import { Week } from '../../types';
import { useStats } from '../../contexts/StatsContext';
import clsx from 'clsx';

const WeekList = () => {
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [loading, setLoading] = useState(true);
  const { stats } = useStats();

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchWeeks();
      setWeeks(data);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Course Content</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">Select a week to review the answer key or start practicing.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {weeks.map((week, index) => {
          const progress = stats.progress[week.id];
          const isCompleted = progress?.score === progress?.totalQuestions && progress?.totalQuestions > 0;
          
          return (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              key={week.id} 
              className={clsx(
                "glass-panel rounded-2xl overflow-hidden flex flex-col transition-all hover:shadow-2xl border-2",
                isCompleted ? "border-green-400/50" : "border-transparent"
              )}
            >
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 text-sm font-bold rounded-full">
                    Week {week.weekNumber}
                  </span>
                  {progress && (
                    <span className="text-sm font-semibold text-slate-500">
                      Score: {progress.score}/{progress.totalQuestions}
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold mb-2 line-clamp-2">{week.title}</h2>
              </div>
              
              <div className="bg-slate-100/50 dark:bg-slate-800/50 p-4 border-t border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-3">
                <Link 
                  to={`/study/${week.id}`}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-white dark:bg-slate-700 shadow-sm hover:bg-blue-50 dark:hover:bg-slate-600 transition-colors group"
                >
                  <BookOpen size={24} className="text-blue-500 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Study Key</span>
                </Link>
                
                <Link 
                  to={`/practice/${week.id}`}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white shadow-sm transition-all group"
                >
                  <Target size={24} className="mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-bold">Practice</span>
                </Link>
              </div>
            </motion.div>
          )
        })}
      </div>
      
      {weeks.length === 0 && (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">No weeks found</h3>
          <p className="text-slate-500">Check back later when the admin adds some content.</p>
        </div>
      )}
    </div>
  );
};

export default WeekList;

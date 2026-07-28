import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BrainCircuit, Target, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl"
      >
        <div className="inline-block mb-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl shadow-sm border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400">
          <BrainCircuit size={48} />
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
          Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Course Material</span>
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          The ultimate companion for NPTEL courses. Practice questions, review weekly answer keys, and build a daily learning habit.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link to="/weeks" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-lg transform hover:-translate-y-1">
            Start Learning <ArrowRight size={20} />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 text-left">
          <FeatureCard 
            icon={<Target className="text-orange-500" />}
            title="Interactive Practice"
            desc="Test your knowledge with instant feedback and explanations to reinforce learning."
          />
          <FeatureCard 
            icon={<BookOpen className="text-blue-500" />}
            title="Study Answer Keys"
            desc="Review all questions with highlighted correct answers and detailed reasoning."
          />
          <FeatureCard 
            icon={<Trophy className="text-yellow-500" />}
            title="Track Progress"
            desc="Maintain daily streaks, track your scores, and bookmark difficult questions."
          />
        </div>
      </motion.div>
    </div>
  );
};

const BookOpen = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
)

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="glass-panel p-6 rounded-2xl">
    <div className="mb-4 bg-slate-100 dark:bg-slate-700/50 w-12 h-12 rounded-xl flex items-center justify-center">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-slate-500 dark:text-slate-400">{desc}</p>
  </div>
);

export default Home;

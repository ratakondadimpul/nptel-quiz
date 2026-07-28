import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, RotateCcw, ArrowRight } from 'lucide-react';
import { fetchWeek, fetchQuestions } from '../../lib/store';
import { Week, Question } from '../../types';
import { useStats } from '../../contexts/StatsContext';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import clsx from 'clsx';

const PracticeMode = () => {
  const { weekId } = useParams();
  const navigate = useNavigate();
  const { updateProgress } = useStats();
  
  const [week, setWeek] = useState<Week | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  
  // Confetti size
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (!weekId) return;
      const w = await fetchWeek(weekId);
      if (w) setWeek(w);
      // Optional: Shuffle questions here if we wanted to
      const q = await fetchQuestions(weekId);
      setQuestions(q);
      setLoading(false);
    };
    loadData();
  }, [weekId]);

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    
    setSelectedOption(idx);
    setIsAnswered(true);
    setUserAnswers(prev => {
      const newArr = [...prev];
      newArr[currentIdx] = idx;
      return newArr;
    });
    
    const isCorrect = idx === questions[currentIdx].correctAnswerIndex;
    if (isCorrect) {
      setScore(prev => prev + 1);
      // Play correct sound
    } else {
      // Play wrong sound
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Finish
      setShowResults(true);
      if (weekId) {
        updateProgress(weekId, {
          weekId,
          score: score,
          totalQuestions: questions.length,
          completedAt: new Date().toISOString()
        });
      }
    }
  };

  const handleRetry = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
    setUserAnswers([]);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!week || questions.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">No practice data available.</h2>
        <Link to="/weeks" className="text-blue-500 hover:underline">Go back</Link>
      </div>
    );
  }

  if (showResults) {
    const finalScore = score;
    const isPerfect = finalScore === questions.length;
    
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto text-center py-12"
      >
        {isPerfect && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={500} />}
        
        <div className="glass-panel p-10 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-pink-500"></div>
          <h2 className="text-4xl font-extrabold mb-6 text-slate-800 dark:text-white">Practice Complete!</h2>
          
          <div className="flex justify-center mb-8">
            <div className="relative">
              <svg className="w-48 h-48 transform -rotate-90">
                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-200 dark:text-slate-700" />
                <circle 
                  cx="96" cy="96" r="88" 
                  stroke="currentColor" 
                  strokeWidth="12" 
                  fill="transparent" 
                  strokeDasharray={2 * Math.PI * 88}
                  strokeDashoffset={2 * Math.PI * 88 * (1 - finalScore / questions.length)}
                  className="text-orange-500 transition-all duration-1000 ease-out" 
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-5xl font-black text-slate-800 dark:text-white">{Math.round((finalScore / questions.length) * 100)}%</span>
                <span className="block text-slate-500 font-bold mt-1">{finalScore} / {questions.length}</span>
              </div>
            </div>
          </div>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
            {isPerfect ? "Flawless! You've mastered this week." : "Great effort! Review your mistakes below."}
          </p>

          {!isPerfect && (
            <div className="text-left mb-8 space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white sticky top-0 bg-white dark:bg-slate-800 py-2">Review Your Answers</h3>
              {questions.map((q, idx) => {
                const userAnswer = userAnswers[idx];
                const isCorrect = userAnswer === q.correctAnswerIndex;
                if (isCorrect) return null;
                
                return (
                  <div key={idx} className="p-4 rounded-xl border border-red-200 bg-red-50/50 dark:border-red-900/50 dark:bg-red-900/10">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
                      Q{idx + 1}. {q.questionText}
                    </p>
                    <div className="text-sm space-y-1">
                      <p className="text-red-600 dark:text-red-400">
                        <span className="font-semibold">Your Answer:</span> {userAnswer !== undefined && userAnswer !== null ? q.options[userAnswer] : 'Skipped/None'}
                      </p>
                      <p className="text-green-600 dark:text-green-400">
                        <span className="font-semibold">Correct Answer:</span> {q.options[q.correctAnswerIndex]}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={handleRetry} className="px-6 py-3 rounded-xl font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition flex items-center justify-center">
              <RotateCcw size={20} className="mr-2" /> Try Again
            </button>
            <Link to={`/study/${week.id}`} className="px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg transition flex items-center justify-center">
              Review Answer Key
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  const currentQ = questions[currentIdx];

  return (
    <div className="max-w-3xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link to="/weeks" className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition">
          <ArrowLeft size={24} className="text-slate-500" />
        </Link>
        <div className="text-center flex-1">
          <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{week.title}</span>
          <div className="font-extrabold text-lg text-slate-800 dark:text-slate-200">
            Question {currentIdx + 1} of {questions.length}
          </div>
        </div>
        <div className="w-10"></div> {/* Spacer for centering */}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full mb-10 overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-orange-400 to-pink-500"
          initial={{ width: 0 }}
          animate={{ width: `${((currentIdx) / questions.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-slate-700"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-slate-800 dark:text-white leading-tight">
            {currentQ.questionText}
          </h2>

          <div className="space-y-4">
            {currentQ.options.map((opt, i) => {
              const isSelected = selectedOption === i;
              const isCorrect = i === currentQ.correctAnswerIndex;
              
              let stateClass = "border-slate-200 hover:border-orange-300 hover:bg-orange-50 dark:border-slate-600 dark:hover:border-orange-500/50 dark:hover:bg-slate-700 bg-white dark:bg-slate-800";
              
              if (isAnswered) {
                if (isCorrect) {
                  stateClass = "border-green-500 bg-green-50 text-green-900 dark:bg-green-900/30 dark:border-green-400 dark:text-green-100";
                } else if (isSelected && !isCorrect) {
                  stateClass = "border-red-500 bg-red-50 text-red-900 dark:bg-red-900/30 dark:border-red-400 dark:text-red-100";
                } else {
                  stateClass = "border-slate-200 opacity-50 dark:border-slate-700 dark:bg-slate-800";
                }
              }

              return (
                <button
                  key={i}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(i)}
                  className={clsx(
                    "w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between group",
                    stateClass
                  )}
                >
                  <span className="text-lg font-medium pr-4">{opt}</span>
                  {isAnswered && isCorrect && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="shrink-0 bg-green-500 text-white p-1 rounded-full">
                      <Check size={20} strokeWidth={3} />
                    </motion.div>
                  )}
                  {isAnswered && isSelected && !isCorrect && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="shrink-0 bg-red-500 text-white p-1 rounded-full">
                      <X size={20} strokeWidth={3} />
                    </motion.div>
                  )}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700"
              >
                {currentQ.explanation && (
                  <div className="mb-6 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl">
                    <p className="text-sm font-bold text-slate-400 uppercase mb-2">Explanation</p>
                    <p className="text-slate-700 dark:text-slate-300">{currentQ.explanation}</p>
                  </div>
                )}
                
                <button 
                  onClick={handleNext}
                  className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-lg rounded-xl flex items-center justify-center hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                >
                  {currentIdx === questions.length - 1 ? 'See Results' : 'Next Question'} 
                  <ArrowRight size={20} className="ml-2" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PracticeMode;

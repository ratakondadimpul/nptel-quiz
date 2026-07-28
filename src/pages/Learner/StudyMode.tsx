import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Bookmark, Lightbulb } from 'lucide-react';
import { fetchWeek, fetchQuestions } from '../../lib/store';
import { Week, Question } from '../../types';
import { useStats } from '../../contexts/StatsContext';
import clsx from 'clsx';

const StudyMode = () => {
  const { weekId } = useParams();
  const [week, setWeek] = useState<Week | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const { isBookmarked, toggleBookmark } = useStats();

  useEffect(() => {
    const loadData = async () => {
      if (!weekId) return;
      const w = await fetchWeek(weekId);
      if (w) setWeek(w);
      const q = await fetchQuestions(weekId);
      setQuestions(q);
      setLoading(false);
    };
    loadData();
  }, [weekId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!week) return <div>Week not found</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-8 flex items-center justify-between">
        <Link to="/weeks" className="flex items-center text-slate-500 hover:text-blue-600 transition-colors font-medium">
          <ArrowLeft size={20} className="mr-1" /> Back to Weeks
        </Link>
        <Link to={`/practice/${week.id}`} className="px-4 py-2 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-lg font-bold text-sm hover:shadow-lg transition-all">
          Switch to Practice
        </Link>
      </div>

      <div className="bg-blue-600 text-white p-8 rounded-2xl shadow-lg mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold mb-2">Week {week.weekNumber}: Answer Key</h1>
          <p className="text-blue-100 text-lg opacity-90">{week.title}</p>
        </div>
        {/* Decorative circle */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
      </div>

      <div className="space-y-8">
        {questions.length === 0 ? (
          <p className="text-center text-slate-500 bg-white p-8 rounded-xl shadow-sm">No questions available for this week yet.</p>
        ) : (
          questions.map((q, index) => {
            const bookmarked = isBookmarked(q.id);
            return (
              <div key={q.id} className="glass-panel p-6 rounded-2xl relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold shrink-0">
                    {index + 1}
                  </span>
                  <button 
                    onClick={() => toggleBookmark(q.id)}
                    className={clsx("p-2 rounded-full transition-colors", bookmarked ? "text-yellow-500 bg-yellow-50" : "text-slate-300 hover:text-slate-500")}
                  >
                    <Bookmark size={20} fill={bookmarked ? "currentColor" : "none"} />
                  </button>
                </div>
                
                <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-6 leading-relaxed">
                  {q.questionText}
                </h3>
                
                <div className="space-y-3 mb-6">
                  {q.options.map((opt, i) => {
                    const isCorrect = i === q.correctAnswerIndex;
                    return (
                      <div 
                        key={i}
                        className={clsx(
                          "p-4 rounded-xl border-2 transition-all flex items-center",
                          isCorrect 
                            ? "bg-green-50 border-green-500 dark:bg-green-900/20 dark:border-green-500/50" 
                            : "bg-slate-50 border-transparent dark:bg-slate-800/50 opacity-60"
                        )}
                      >
                        <div className="w-6 h-6 mr-3 flex items-center justify-center shrink-0">
                          {isCorrect ? (
                            <CheckCircle2 className="text-green-500" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600"></div>
                          )}
                        </div>
                        <span className={clsx("text-base", isCorrect ? "font-bold text-green-900 dark:text-green-100" : "text-slate-600 dark:text-slate-400")}>
                          {opt}
                        </span>
                      </div>
                    )
                  })}
                </div>

                {q.explanation && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl flex items-start">
                    <Lightbulb className="text-blue-500 mt-1 mr-3 shrink-0" size={20} />
                    <div>
                      <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-1 text-sm uppercase tracking-wider">Explanation</h4>
                      <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">{q.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  );
};

export default StudyMode;

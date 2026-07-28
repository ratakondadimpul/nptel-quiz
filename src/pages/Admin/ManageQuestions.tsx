import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, Trash2, Edit, Upload, ArrowLeft } from 'lucide-react';
import { fetchQuestions, fetchWeek, saveQuestion, deleteQuestion } from '../../lib/store';
import { Question, Week } from '../../types';
import Papa from 'papaparse';

const ManageQuestions = () => {
  const { weekId } = useParams();
  const [week, setWeek] = useState<Week | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const initialFormState = {
    questionText: '',
    options: ['', '', '', ''],
    correctAnswerIndex: 0,
    explanation: '',
    difficulty: 'Medium' as 'Easy' | 'Medium' | 'Hard'
  };
  const [formData, setFormData] = useState(initialFormState);

  const loadData = async () => {
    if (!weekId) return;
    setLoading(true);
    const [w, q] = await Promise.all([fetchWeek(weekId), fetchQuestions(weekId)]);
    if (w) setWeek(w);
    setQuestions(q);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [weekId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weekId) return;
    
    // Filter out empty options
    const cleanOptions = formData.options.filter(o => o.trim() !== '');
    if (cleanOptions.length < 2) {
      alert("Please provide at least 2 options.");
      return;
    }

    await saveQuestion({
      weekId,
      questionText: formData.questionText,
      options: cleanOptions,
      correctAnswerIndex: formData.correctAnswerIndex,
      explanation: formData.explanation,
      difficulty: formData.difficulty
    }, editingQuestion?.id);
    
    setIsModalOpen(false);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
      await deleteQuestion(id);
      loadData();
    }
  };

  const openModal = (q?: Question) => {
    if (q) {
      setEditingQuestion(q);
      setFormData({
        questionText: q.questionText,
        options: [...q.options, ...Array(4 - q.options.length).fill('')].slice(0, 4), // Pad to 4
        correctAnswerIndex: q.correctAnswerIndex,
        explanation: q.explanation || '',
        difficulty: q.difficulty || 'Medium'
      });
    } else {
      setEditingQuestion(null);
      setFormData(initialFormState);
    }
    setIsModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !weekId) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        let added = 0;
        for (const row of results.data as any[]) {
          // Expected format: Question, Option1, Option2, Option3, Option4, CorrectIndex, Explanation
          if (row.Question && row.Option1 && row.Option2) {
            const options = [row.Option1, row.Option2, row.Option3, row.Option4].filter(Boolean);
            const correctIndex = parseInt(row.CorrectIndex) || 0;
            
            await saveQuestion({
              weekId,
              questionText: row.Question,
              options,
              correctAnswerIndex: correctIndex,
              explanation: row.Explanation || '',
              difficulty: 'Medium'
            });
            added++;
          }
        }
        alert(`Successfully imported ${added} questions.`);
        loadData();
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    });
  };

  if (!week) return <div>Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-8">
        <Link to="/admin/weeks" className="text-slate-500 hover:text-blue-600 font-medium flex items-center mb-4">
          <ArrowLeft size={16} className="mr-1" /> Back to Weeks
        </Link>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Week {week.weekNumber} Questions</h1>
            <p className="text-slate-500 mt-1">{week.title}</p>
          </div>
          <div className="flex gap-2">
            <input 
              type="file" 
              accept=".csv" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-bold transition-colors shadow-sm text-sm"
            >
              <Upload size={18} className="mr-2" /> Import CSV
            </button>
            <button 
              onClick={() => openModal()}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors shadow-sm text-sm"
            >
              <Plus size={18} className="mr-1" /> Add Question
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">Loading...</div>
      ) : (
        <div className="space-y-4">
          {questions.length === 0 ? (
            <div className="glass-panel p-10 text-center text-slate-500 rounded-2xl">
              No questions found for this week. Add one manually or import via CSV.
            </div>
          ) : (
            questions.map((q, idx) => (
              <div key={q.id} className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded text-xs font-bold">
                      Q{idx + 1}
                    </span>
                    <h3 className="font-bold text-lg">{q.questionText}</h3>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => openModal(q)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(q.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-2 mb-4">
                  {q.options.map((opt, i) => (
                    <div 
                      key={i} 
                      className={`p-3 rounded-xl border text-sm ${
                        i === q.correctAnswerIndex 
                          ? 'border-green-500 bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-100' 
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
                {q.explanation && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-sm text-blue-800 dark:text-blue-200">
                    <span className="font-bold mr-2">Explanation:</span>
                    {q.explanation}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl p-6 sm:p-8 my-8 relative">
            <h2 className="text-2xl font-bold mb-6">{editingQuestion ? 'Edit Question' : 'Add New Question'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Question Text</label>
                <textarea 
                  required 
                  rows={3}
                  className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  value={formData.questionText}
                  onChange={e => setFormData({...formData, questionText: e.target.value})}
                  placeholder="Enter your question here..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Options (Minimum 2)</label>
                <div className="space-y-3">
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="correctAnswer"
                        checked={formData.correctAnswerIndex === i}
                        onChange={() => setFormData({...formData, correctAnswerIndex: i})}
                        className="w-5 h-5 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        required
                      />
                      <input 
                        type="text"
                        placeholder={`Option ${i + 1}`}
                        className={`flex-1 p-3 rounded-xl border outline-none transition-colors ${
                          formData.correctAnswerIndex === i 
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                            : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500'
                        }`}
                        value={formData.options[i]}
                        onChange={e => {
                          const newOpts = [...formData.options];
                          newOpts[i] = e.target.value;
                          setFormData({...formData, options: newOpts});
                        }}
                        required={i < 2} // First two are required
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Explanation (Optional)</label>
                <textarea 
                  rows={2}
                  className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  value={formData.explanation}
                  onChange={e => setFormData({...formData, explanation: e.target.value})}
                  placeholder="Why is this answer correct?"
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
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
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageQuestions;

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserStats, LearnerProgress } from '../types';

interface StatsContextType {
  stats: UserStats;
  updateProgress: (weekId: string, progress: LearnerProgress) => void;
  toggleBookmark: (questionId: string) => void;
  isBookmarked: (questionId: string) => boolean;
}

const defaultStats: UserStats = {
  streak: 0,
  lastPracticeDate: '',
  bookmarkedQuestionIds: [],
  progress: {}
};

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export const StatsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem('nptel_learner_stats');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultStats, ...parsed, progress: parsed.progress || {} };
      }
    } catch (e) {
      console.error('Error parsing stats', e);
    }
    return defaultStats;
  });

  useEffect(() => {
    localStorage.setItem('nptel_learner_stats', JSON.stringify(stats));
  }, [stats]);

  // Update streak on mount
  useEffect(() => {
    const today = new Date().toDateString();
    if (stats.lastPracticeDate !== today) {
      const last = new Date(stats.lastPracticeDate);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - last.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        // Continue streak
        setStats(prev => ({ ...prev, streak: prev.streak + 1, lastPracticeDate: today }));
      } else if (diffDays > 1 || !stats.lastPracticeDate) {
        // Reset streak but only if they practiced today? 
        // Actually, let's not reset immediately until they practice.
        // For simplicity, we just leave it until they submit a practice.
      }
    }
  }, []);

  const updateProgress = (weekId: string, progress: LearnerProgress) => {
    const today = new Date().toDateString();
    setStats(prev => {
      const isNewDay = prev.lastPracticeDate !== today;
      // Simple streak logic: if last practice was yesterday, +1. If older, reset to 1.
      let newStreak = prev.streak;
      if (isNewDay) {
        const last = new Date(prev.lastPracticeDate);
        const diffDays = Math.ceil(Math.abs(new Date().getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1 || !prev.lastPracticeDate) {
          newStreak += 1;
        } else {
          newStreak = 1;
        }
      }

      return {
        ...prev,
        streak: newStreak,
        lastPracticeDate: today,
        progress: {
          ...prev.progress,
          [weekId]: progress
        }
      };
    });
  };

  const toggleBookmark = (questionId: string) => {
    setStats(prev => {
      const isBookmarked = prev.bookmarkedQuestionIds.includes(questionId);
      return {
        ...prev,
        bookmarkedQuestionIds: isBookmarked 
          ? prev.bookmarkedQuestionIds.filter(id => id !== questionId)
          : [...prev.bookmarkedQuestionIds, questionId]
      };
    });
  };

  const isBookmarked = (questionId: string) => stats.bookmarkedQuestionIds.includes(questionId);

  return (
    <StatsContext.Provider value={{ stats, updateProgress, toggleBookmark, isBookmarked }}>
      {children}
    </StatsContext.Provider>
  );
};

export const useStats = () => {
  const context = useContext(StatsContext);
  if (!context) throw new Error('useStats must be used within StatsProvider');
  return context;
};

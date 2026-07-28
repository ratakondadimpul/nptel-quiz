import { collection, getDocs, doc, setDoc, deleteDoc, query, where, orderBy, getDoc } from 'firebase/firestore';
import { db, hasRealFirebaseConfig } from './firebase';
import { Week, Question } from '../types';

// ------------- MOCK DATA FALLBACK -------------
let mockWeeks: Week[] = [
  { id: 'week1', weekNumber: 1, title: 'Introduction to React', createdAt: new Date() },
  { id: 'week2', weekNumber: 2, title: 'State and Props', createdAt: new Date() }
];

let mockQuestions: Question[] = [
  {
    id: 'q1', weekId: 'week1',
    questionText: 'What is the primary function of React?',
    options: ['Building UI', 'Database Management', 'Server side routing', 'CSS Preprocessing'],
    correctAnswerIndex: 0,
    explanation: 'React is a declarative, efficient, and flexible JavaScript library for building user interfaces.',
    difficulty: 'Easy'
  },
  {
    id: 'q2', weekId: 'week1',
    questionText: 'React uses a virtual DOM.',
    options: ['True', 'False'],
    correctAnswerIndex: 0,
    explanation: 'React creates an in-memory data structure cache, computes the resulting differences, and then updates the browser\'s displayed DOM efficiently.',
    difficulty: 'Easy'
  },
  {
    id: 'q3', weekId: 'week2',
    questionText: 'How do you pass data from a parent to a child component in React?',
    options: ['Using State', 'Using Props', 'Using Context', 'Using Redux'],
    correctAnswerIndex: 1,
    explanation: 'Props (short for properties) are used to pass data from a parent component down to a child component.',
    difficulty: 'Medium'
  }
];

// ------------- API -------------

export const fetchWeeks = async (): Promise<Week[]> => {
  if (!hasRealFirebaseConfig) return [...mockWeeks].sort((a, b) => a.weekNumber - b.weekNumber);
  
  const q = query(collection(db, 'weeks'), orderBy('weekNumber', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Week));
};

export const fetchWeek = async (weekId: string): Promise<Week | undefined> => {
  if (!hasRealFirebaseConfig) return mockWeeks.find(w => w.id === weekId);
  
  const d = await getDoc(doc(db, 'weeks', weekId));
  return d.exists() ? { id: d.id, ...d.data() } as Week : undefined;
}

export const saveWeek = async (week: Omit<Week, 'id'>, id?: string): Promise<void> => {
  if (!hasRealFirebaseConfig) {
    if (id) {
      mockWeeks = mockWeeks.map(w => w.id === id ? { ...week, id } : w);
    } else {
      mockWeeks.push({ ...week, id: Date.now().toString(), createdAt: new Date() });
    }
    return;
  }

  const docRef = id ? doc(db, 'weeks', id) : doc(collection(db, 'weeks'));
  await setDoc(docRef, { ...week, createdAt: new Date() }, { merge: true });
};

export const deleteWeek = async (id: string): Promise<void> => {
  if (!hasRealFirebaseConfig) {
    mockWeeks = mockWeeks.filter(w => w.id !== id);
    mockQuestions = mockQuestions.filter(q => q.weekId !== id);
    return;
  }
  await deleteDoc(doc(db, 'weeks', id));
  // Note: in a real app, also delete associated questions or use cloud functions
};

export const fetchQuestions = async (weekId: string): Promise<Question[]> => {
  if (!hasRealFirebaseConfig) return mockQuestions.filter(q => q.weekId === weekId);
  
  const q = query(collection(db, 'questions'), where('weekId', '==', weekId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Question));
};

export const saveQuestion = async (question: Omit<Question, 'id'>, id?: string): Promise<void> => {
  if (!hasRealFirebaseConfig) {
    if (id) {
      mockQuestions = mockQuestions.map(q => q.id === id ? { ...question, id } : q);
    } else {
      mockQuestions.push({ ...question, id: Date.now().toString() });
    }
    return;
  }

  const docRef = id ? doc(db, 'questions', id) : doc(collection(db, 'questions'));
  await setDoc(docRef, question, { merge: true });
};

export const deleteQuestion = async (id: string): Promise<void> => {
  if (!hasRealFirebaseConfig) {
    mockQuestions = mockQuestions.filter(q => q.id !== id);
    return;
  }
  await deleteDoc(doc(db, 'questions', id));
};

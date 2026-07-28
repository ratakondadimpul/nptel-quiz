import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import WeekList from './pages/Learner/WeekList';
import StudyMode from './pages/Learner/StudyMode';
import PracticeMode from './pages/Learner/PracticeMode';
import AdminLogin from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import ManageWeeks from './pages/Admin/ManageWeeks';
import ManageQuestions from './pages/Admin/ManageQuestions';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col font-sans transition-colors duration-300">
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* Learner Routes */}
            <Route path="/weeks" element={<WeekList />} />
            <Route path="/study/:weekId" element={<StudyMode />} />
            <Route path="/practice/:weekId" element={<PracticeMode />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/weeks" element={<ManageWeeks />} />
            <Route path="/admin/weeks/:weekId/questions" element={<ManageQuestions />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

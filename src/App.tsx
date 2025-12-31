import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Game } from './pages/Game';

function App() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/20 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-8">
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game/:operation" element={<Game />} />
          </Routes>
        </Router>
      </div>

      <footer className="relative z-10 py-8 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} MathMaster — Practica tu agilidad mental
      </footer>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Contact from './pages/Contact';
import Anatomy from './pages/Anatomy';

function App() {
  const [page, setPage] = useState('home');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check local storage for theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const newTheme = !prev;
      if (newTheme) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newTheme;
    });
  };

  return (
    <div className="min-h-screen bg-dark-bg dark:bg-dm-bg-primary selection:bg-blue-500/30 selection:text-white-text relative overflow-x-hidden transition-colors duration-500">
      {/* Dynamic Background Orbital Lights */}
      <div className="fixed inset-0 -z-30 overflow-hidden pointer-events-none">
        {/* Clinical Blue Light Top Left */}
        <div 
          className="bg-orb w-[600px] h-[600px] rounded-full bg-blue-500/10 dark:bg-blue-500/10" 
          style={{ top: '-10%', left: '-10%' }} 
        />
        {/* Medical Red Light Center Right */}
        <div 
          className="bg-orb w-[800px] h-[800px] rounded-full bg-red-500/10 dark:bg-red-500/10" 
          style={{ top: '25%', right: '-15%', animationDelay: '-5s' }} 
        />
        {/* Safety Green Light Bottom Left */}
        <div 
          className="bg-orb w-[500px] h-[500px] rounded-full bg-green-500/5 dark:bg-green-500/5" 
          style={{ bottom: '-10%', left: '5%', animationDelay: '-10s' }} 
        />
      </div>

      {/* Floating Clinical Background Particles */}
      <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none opacity-25 dark:opacity-40">
        {[...Array(25)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full animate-pulse transition-colors duration-500"
            style={{
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              backgroundColor: isDark 
                ? (i % 3 === 0 ? '#3B82F6' : i % 3 === 1 ? '#22C55E' : '#EF4444')
                : (i % 3 === 0 ? '#60A5FA' : i % 3 === 1 ? '#4ADE80' : '#F87171'),
              boxShadow: `0 0 10px ${isDark 
                ? (i % 3 === 0 ? '#3B82F6' : i % 3 === 1 ? '#22C55E' : '#EF4444')
                : (i % 3 === 0 ? '#60A5FA' : i % 3 === 1 ? '#4ADE80' : '#F87171')}`,
              animationDuration: Math.random() * 4 + 3 + 's',
              animationDelay: Math.random() * 3 + 's',
            }}
          />
        ))}
      </div>

      {/* Main Layout */}
      <Navbar setPage={setPage} currentPage={page} isDark={isDark} toggleTheme={toggleTheme} />
      
      <main className="relative z-10">
        {page === 'home' && <LandingPage setPage={setPage} isDark={isDark} />}
        {page === 'anatomy' && <Anatomy isDark={isDark} />}
        {page === 'dashboard' && <Dashboard isDark={isDark} />}
        {page === 'contact' && <Contact isDark={isDark} />}
      </main>
    </div>
  );
}

export default App;

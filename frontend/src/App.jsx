import React, { useState } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Contact from './pages/Contact';
import Anatomy from './pages/Anatomy';

function App() {
  const [page, setPage] = useState('home');

  return (
    <div className="min-h-screen bg-dark-bg selection:bg-neon-blue/30 selection:text-white-text relative">
      {/* Dynamic Background Orbital Lights */}
      <div className="fixed inset-0 -z-30 overflow-hidden pointer-events-none">
        {/* Soft Purple Light Top Left */}
        <div 
          className="bg-orb w-[600px] h-[600px] rounded-full bg-soft-purple/10" 
          style={{ top: '-10%', left: '-10%' }} 
        />
        {/* Neon Blue Light Center Right */}
        <div 
          className="bg-orb w-[800px] h-[800px] rounded-full bg-neon-blue/10" 
          style={{ top: '25%', right: '-15%', animationDelay: '-5s' }} 
        />
        {/* Neon Pink Light Bottom Left */}
        <div 
          className="bg-orb w-[500px] h-[500px] rounded-full bg-neon-pink/5" 
          style={{ bottom: '-10%', left: '5%', animationDelay: '-10s' }} 
        />
      </div>

      {/* Floating Neural Background Grid */}
      <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none opacity-25">
        {[...Array(25)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              backgroundColor: i % 3 === 0 ? '#4DA6FF' : i % 3 === 1 ? '#8A7CFF' : '#FF4D9D',
              boxShadow: `0 0 10px ${i % 3 === 0 ? '#4DA6FF' : i % 3 === 1 ? '#8A7CFF' : '#FF4D9D'}`,
              animationDuration: Math.random() * 4 + 3 + 's',
              animationDelay: Math.random() * 3 + 's',
            }}
          />
        ))}
      </div>

      {/* Main Layout */}
      <Navbar setPage={setPage} currentPage={page} />
      
      <main className="relative z-10">
        {page === 'home' && <LandingPage setPage={setPage} />}
        {page === 'anatomy' && <Anatomy />}
        {page === 'dashboard' && <Dashboard />}
        {page === 'contact' && <Contact />}
      </main>
    </div>
  );
}

export default App;

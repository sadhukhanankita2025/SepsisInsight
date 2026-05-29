import React, { useState, useEffect } from 'react';
import { Activity, Menu, X, Sun, Moon } from 'lucide-react';

const Navbar = ({ setPage, currentPage, isDark, toggleTheme }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (pageId, sectionId) => {
    setMobileOpen(false);
    setPage(pageId);
    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navLinks = [
    { label: 'Home',         page: 'home',      section: null },
    { label: 'Clinical Overview', page: 'anatomy', section: null },
    { label: 'How It Works', page: 'home',      section: 'how-it-works' },
    { label: 'Contact',      page: 'contact',   section: null },
  ];

  return (
    <>
      {/* Ambient glow behind navbar */}
      <div
        className="fixed top-0 left-0 right-0 z-40 pointer-events-none h-24 transition-opacity duration-500"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(59,130,246,0.15) 0%, rgba(239,68,68,0.1) 60%, transparent 100%)'
            : 'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(167,199,255,0.15) 0%, rgba(248,113,113,0.1) 60%, transparent 100%)',
          opacity: scrolled ? 0.7 : 1,
        }}
      />

      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 flex items-center justify-center px-4 pt-4"
      >
        {/* Floating Glass Pill */}
        <div
          className={`w-full max-w-6xl flex items-center justify-between px-5 py-3 transition-all duration-500 bg-white/70 dark:bg-dm-nav backdrop-blur-[22px] border border-white dark:border-dm-border ${
            scrolled ? 'rounded-2xl shadow-[0_8px_40px_rgba(59,130,246,0.25)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.5)]' : 'rounded-3xl shadow-[0_4px_30px_rgba(59,130,246,0.15)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
          }`}
          style={{
            boxShadow: isDark 
              ? (scrolled ? '0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)' : '0 4px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)')
              : (scrolled ? '0 8px 40px rgba(59,130,246,0.25), inset 0 1px 0 rgba(255,255,255,1)' : '0 4px 30px rgba(59,130,246,0.15), inset 0 1px 0 rgba(255,255,255,1)'),
          }}
        >
          {/* ─── LOGO ─── */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 group focus:outline-none"
          >
            <span className="text-[20px] font-bold tracking-wide font-outfit select-none flex items-center">
              <span className="text-primary-heading dark:text-dm-text-primary transition-colors duration-300">SepsisAI&nbsp;</span>
              <span
            className="bg-gradient-to-r from-[#A7C7FF] to-[#EF4444] dark:from-[#3B82F6] dark:to-[#DC2626] bg-clip-text text-transparent"
          >
            Care
          </span>
            </span>
          </button>

          {/* ─── DESKTOP LINKS ─── */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ label, page, section }) => {
              const active = currentPage === page && !section;
              return (
                <button
                  key={label}
                  onClick={() => handleNavClick(page, section)}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-250 focus:outline-none group ${active ? 'text-red-600 dark:text-red-400' : 'text-dark-gray-text dark:text-dm-text-secondary'}`}
                >
                  {/* hover bg */}
                  <span
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ background: isDark ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.1)' }}
                  />
                  <span className="relative z-10 group-hover:text-primary-heading dark:group-hover:text-dm-text-primary transition-colors duration-200">
                    {label}
                  </span>
                  {/* active underline */}
                  {active && (
                    <span
                      className="absolute bottom-1 left-3 right-3 h-[2px] rounded-full"
                      style={{
                        background: isDark ? 'linear-gradient(90deg, #3B82F6, #DC2626)' : 'linear-gradient(90deg, #A7C7FF, #EF4444)',
                        boxShadow: isDark ? '0 0 8px #3B82F6' : '0 0 8px #A7C7FF',
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* ─── CTA BUTTON & THEME TOGGLE ─── */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-dark-gray-text dark:text-dm-text-secondary hover:bg-black/5 dark:hover:bg-white/10 transition-colors duration-300 focus:outline-none"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => handleNavClick('dashboard')}
              className="relative px-5 py-2.5 rounded-full text-sm font-semibold text-white-text transition-all duration-300 group focus:outline-none overflow-hidden"
              style={{
                background: isDark ? '#081530' : '#1E40AF', 
                border: isDark ? '1px solid #1B2D5A' : '1px solid #1E3A8A', 
                boxShadow: isDark ? '0 0 14px rgba(59,130,246,0.2)' : '0 0 14px rgba(59,130,246,0.2)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = isDark ? '#0B1736' : '#1D4ED8';
                e.currentTarget.style.boxShadow = isDark ? '0 0 24px rgba(59,130,246,0.4)' : '0 0 24px rgba(59,130,246,0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = isDark ? '#081530' : '#1E40AF';
                e.currentTarget.style.boxShadow = isDark ? '0 0 14px rgba(59,130,246,0.2)' : '0 0 14px rgba(59,130,246,0.2)';
              }}
            >
              {/* gradient shimmer layer */}
              <span
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{
                  background: isDark 
                    ? 'linear-gradient(135deg, rgba(59,130,246,0.2) 0%, rgba(239,68,68,0.2) 100%)' 
                    : 'linear-gradient(135deg, rgba(59,130,246,0.2) 0%, rgba(239,68,68,0.2) 100%)',
                }}
              />
              <span className="relative z-10">Start Screening</span>
            </button>
          </div>

          {/* ─── MOBILE BURGER ─── */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-dark-gray-text dark:text-dm-text-secondary hover:text-primary-heading dark:hover:text-dm-text-primary hover:bg-black/5 dark:hover:bg-white/10 transition-all"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              className="p-2 rounded-xl text-dark-gray-text dark:text-dm-text-secondary hover:text-primary-heading dark:hover:text-dm-text-primary hover:bg-black/5 dark:hover:bg-white/10 transition-all"
              onClick={() => setMobileOpen(o => !o)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ─── MOBILE DRAWER ─── */}
        {mobileOpen && (
          <div
            className="absolute top-full mt-2 left-4 right-4 rounded-2xl overflow-hidden flex flex-col gap-1 p-3 shadow-[0_12px_40px_rgba(59,130,246,0.25)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.6)] bg-white/95 dark:bg-[#06122B]/95 backdrop-blur-[24px] border border-white dark:border-dm-border"
          >
            {navLinks.map(({ label, page, section }) => (
              <button
                key={label}
                onClick={() => handleNavClick(page, section)}
                className={`px-4 py-3 rounded-xl text-sm font-medium text-left transition-all ${
                  currentPage === page && !section
                    ? 'text-red-600 dark:text-red-400 bg-red-500/10 dark:bg-red-500/10'
                    : 'text-dark-gray-text dark:text-dm-text-secondary hover:text-primary-heading dark:hover:text-dm-text-primary hover:bg-black/5 dark:hover:bg-white/10'
                }`}
              >
                {label}
              </button>
            ))}
            <div className="border-t border-black/5 dark:border-white/10 pt-2 mt-1">
              <button
                onClick={() => handleNavClick('dashboard')}
                className="w-full px-4 py-3 rounded-xl text-sm font-semibold text-white-text text-center transition-colors"
                style={{ background: isDark ? '#081530' : '#1E40AF' }}
              >
                Start Screening
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;

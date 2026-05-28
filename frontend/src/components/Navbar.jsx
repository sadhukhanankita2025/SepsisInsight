import React, { useState, useEffect } from 'react';
import { HeartPulse, Menu, X } from 'lucide-react';

const Navbar = ({ setPage, currentPage }) => {
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
    { label: 'Anatomy',      page: 'anatomy',   section: null },
    { label: 'How It Works', page: 'home',      section: 'how-it-works' },
    { label: 'Contact',      page: 'contact',   section: null },
  ];

  return (
    <>
      {/* Ambient glow behind navbar */}
      <div
        className="fixed top-0 left-0 right-0 z-40 pointer-events-none h-24 transition-opacity duration-500"
        style={{
          background:
            'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(77,166,255,0.12) 0%, rgba(138,124,255,0.06) 60%, transparent 100%)',
          opacity: scrolled ? 0.7 : 1,
        }}
      />

      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 flex items-center justify-center px-4 pt-4"
      >
        {/* Floating Glass Pill */}
        <div
          className={`w-full max-w-6xl flex items-center justify-between px-5 py-3 transition-all duration-500 ${
            scrolled ? 'rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.45)]' : 'rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.3)]'
          }`}
          style={{
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(22px)',
            WebkitBackdropFilter: 'blur(22px)',
            border: '1px solid rgba(255,255,255,0.10)',
            boxShadow: '0 4px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          {/* ─── LOGO ─── */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div
              className="p-2 rounded-xl group-hover:scale-105 transition-transform duration-300"
              style={{
                background: 'linear-gradient(135deg, #4DA6FF 0%, #8A7CFF 60%, #FF4D9D 100%)',
                boxShadow: '0 0 18px rgba(77,166,255,0.4)',
              }}
            >
              <HeartPulse className="w-5 h-5 text-white" />
            </div>
            <span className="text-[17px] font-bold tracking-wide font-outfit select-none">
              <span className="text-white/90">AI Neuro&nbsp;</span>
              <span
                style={{
                  background: 'linear-gradient(90deg, #8A7CFF, #4DA6FF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
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
                  className="relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-250 focus:outline-none group"
                  style={{ color: active ? '#4DA6FF' : 'rgba(255,255,255,0.65)' }}
                >
                  {/* hover bg */}
                  <span
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ background: 'rgba(255,255,255,0.06)' }}
                  />
                  <span className="relative z-10 group-hover:text-white transition-colors duration-200">
                    {label}
                  </span>
                  {/* active underline */}
                  {active && (
                    <span
                      className="absolute bottom-1 left-3 right-3 h-[2px] rounded-full"
                      style={{
                        background: 'linear-gradient(90deg, #4DA6FF, #8A7CFF)',
                        boxShadow: '0 0 8px #4DA6FF',
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* ─── CTA BUTTON ─── */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => handleNavClick('dashboard')}
              className="relative px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-300 group focus:outline-none overflow-hidden"
              style={{
                background: 'rgba(77,166,255,0.15)',
                border: '1px solid rgba(77,166,255,0.35)',
                boxShadow: '0 0 14px rgba(77,166,255,0.2)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(77,166,255,0.28)';
                e.currentTarget.style.boxShadow = '0 0 24px rgba(77,166,255,0.45)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(77,166,255,0.15)';
                e.currentTarget.style.boxShadow = '0 0 14px rgba(77,166,255,0.2)';
              }}
            >
              {/* gradient shimmer layer */}
              <span
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{
                  background: 'linear-gradient(135deg, rgba(77,166,255,0.25) 0%, rgba(138,124,255,0.25) 100%)',
                }}
              />
              <span className="relative z-10">Start Analysis</span>
            </button>
          </div>

          {/* ─── MOBILE BURGER ─── */}
          <button
            className="md:hidden p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all"
            onClick={() => setMobileOpen(o => !o)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* ─── MOBILE DRAWER ─── */}
        {mobileOpen && (
          <div
            className="absolute top-full mt-2 left-4 right-4 rounded-2xl overflow-hidden flex flex-col gap-1 p-3 shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
            style={{
              background: 'rgba(7,20,38,0.92)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {navLinks.map(({ label, page, section }) => (
              <button
                key={label}
                onClick={() => handleNavClick(page, section)}
                className={`px-4 py-3 rounded-xl text-sm font-medium text-left transition-all ${
                  currentPage === page && !section
                    ? 'text-neon-blue bg-neon-blue/10'
                    : 'text-white/65 hover:text-white hover:bg-white/5'
                }`}
              >
                {label}
              </button>
            ))}
            <div className="border-t border-white/8 pt-2 mt-1">
              <button
                onClick={() => handleNavClick('dashboard')}
                className="w-full px-4 py-3 rounded-xl text-sm font-semibold text-white text-center"
                style={{ background: 'linear-gradient(135deg, #4DA6FF, #8A7CFF)' }}
              >
                Start Analysis
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;

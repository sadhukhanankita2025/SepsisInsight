import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Cpu, Activity, Zap } from 'lucide-react';

const Anatomy = ({ isDark }) => {
  const regions = [
    { name: 'Frontal Lobe', role: 'Decision making, personality, voluntary movement', color: isDark ? '#3B82F6' : '#A7C7FF' },
    { name: 'Parietal Lobe', role: 'Sensory processing, spatial awareness', color: isDark ? '#8B5CF6' : '#C4B6CE' },
    { name: 'Temporal Lobe', role: 'Memory, language, auditory processing', color: isDark ? '#EC4899' : '#FF8BCB' },
    { name: 'Occipital Lobe', role: 'Visual processing and perception', color: isDark ? '#22D3EE' : '#A7C7FF' },
    { name: 'Cerebellum', role: 'Balance, coordination, fine motor control', color: isDark ? '#8B5CF6' : '#C4B6CE' },
    { name: 'Brain Stem', role: 'Vital functions: breathing, heart rate, sleep', color: isDark ? '#EC4899' : '#FF8BCB' },
    { name: 'Hippocampus', role: 'Memory formation and spatial navigation', color: isDark ? '#3B82F6' : '#A7C7FF' },
    { name: 'Amygdala', role: 'Emotion processing and fear response', color: isDark ? '#8B5CF6' : '#C4B6CE' },
    { name: 'Thalamus', role: 'Relay station for sensory and motor signals', color: isDark ? '#EC4899' : '#FF8BCB' },
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 relative overflow-hidden">
      <div className={`absolute top-[10%] left-[-8%] w-[500px] h-[500px] ${isDark ? 'bg-dm-electric-blue/15' : 'bg-electric-lavender/10'} rounded-full blur-[130px] pointer-events-none -z-10`} />
      <div className={`absolute top-[30%] right-[-8%] w-[400px] h-[400px] ${isDark ? 'bg-dm-cyan-glow/15' : 'bg-cool-blue-glow/10'} rounded-full blur-[110px] pointer-events-none -z-10`} />
      <div className={`absolute bottom-[10%] left-[30%] w-[350px] h-[350px] ${isDark ? 'bg-dm-neon-pink/15' : 'bg-neon-pink/10'} rounded-full blur-[100px] pointer-events-none -z-10`} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center max-w-3xl mx-auto px-6 mb-12 space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest transition-colors duration-300"
          style={{ 
            background: isDark ? 'rgba(59,130,246,0.15)' : 'rgba(167,199,255,0.15)', 
            borderColor: isDark ? 'rgba(59,130,246,0.4)' : 'rgba(167,199,255,0.4)', 
            color: isDark ? '#3B82F6' : '#A38AB2' 
          }}
        >
          <Brain className="w-3.5 h-3.5" />
          Neuroanatomy Explorer
        </div>
        <h1 className="text-5xl lg:text-6xl font-extrabold font-outfit text-primary-heading dark:text-dm-text-primary leading-tight transition-colors duration-300">
          Explore the Human{' '}
          <span className="transition-colors duration-300" style={{ background: isDark ? 'linear-gradient(90deg, #3B82F6 0%, #8B5CF6 55%, #EC4899 100%)' : 'linear-gradient(90deg, #A7C7FF 0%, #A38AB2 55%, #FF8BCB 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Brain
          </span>
        </h1>
        <p className="text-secondary-text dark:text-dm-text-secondary text-base leading-relaxed max-w-xl mx-auto transition-colors duration-300">
          Discover the key regions of the human brain, their functions, and their clinical significance in neurological assessment.
        </p>
      </motion.div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="max-w-4xl mx-auto px-6 mb-10 grid grid-cols-3 gap-4"
      >
        {[
          { icon: <Brain className="w-5 h-5" />, label: '9 Regions', sub: 'Mapped & Labeled', color: isDark ? '#8B5CF6' : '#A38AB2' },
          { icon: <Activity className="w-5 h-5" />, label: 'Clinical Data', sub: 'Function Mapping', color: isDark ? '#3B82F6' : '#A38AB2' },
          { icon: <Zap className="w-5 h-5" />, label: 'AI Linked', sub: 'NeuroAI Integrated', color: isDark ? '#EC4899' : '#FF8BCB' },
        ].map(({ icon, label, sub, color }) => (
          <div key={label} className="rounded-2xl px-6 py-4 flex flex-col items-center gap-1 text-center transition-colors duration-300"
            style={{ 
              background: isDark ? '#0D1B3D' : 'rgba(255,255,255,0.6)', 
              border: isDark ? '1px solid #1B2D5A' : '1px solid rgba(255,255,255,0.9)', 
              boxShadow: isDark ? '0 4px 15px rgba(0,0,0,0.4)' : '0 4px 15px rgba(163,138,178,0.05)' 
            }}
          >
            <span style={{ color }}>{icon}</span>
            <span className="text-lg font-extrabold font-outfit text-primary-heading dark:text-dm-text-primary transition-colors duration-300">{label}</span>
            <span className="text-secondary-text dark:text-dm-text-secondary text-xs font-medium transition-colors duration-300">{sub}</span>
          </div>
        ))}
      </motion.div>

      {/* Brain Regions Grid */}
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {regions.map((region, i) => (
          <motion.div
            key={region.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i, duration: 0.5 }}
            whileHover={{ scale: 1.03, y: -4, borderColor: region.color }}
            className="rounded-2xl p-5 cursor-default transition-colors duration-300"
            style={{
              background: isDark ? '#0D1B3D' : 'rgba(255,255,255,0.5)',
              border: isDark ? `1px solid #1B2D5A` : `1px solid ${region.color}40`,
              boxShadow: isDark ? `0 8px 24px rgba(0,0,0,0.5)` : `0 8px 24px ${region.color}15`,
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-300"
                style={{ background: `${region.color}25`, border: `1px solid ${region.color}50` }}
              >
                <Cpu className="w-4 h-4" style={{ color: region.color }} />
              </div>
              <h3 className="font-bold text-primary-heading dark:text-dm-text-primary text-sm font-outfit transition-colors duration-300">{region.name}</h3>
            </div>
            <p className="text-secondary-text dark:text-dm-text-secondary text-xs leading-relaxed transition-colors duration-300">{region.role}</p>
            <div className="mt-3 h-1 rounded-full transition-colors duration-300" style={{ background: `linear-gradient(90deg, ${region.color}80, transparent)` }} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Anatomy;

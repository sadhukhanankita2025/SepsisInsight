import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Cpu, Activity, Zap } from 'lucide-react';

const regions = [
  { name: 'Frontal Lobe', role: 'Decision making, personality, voluntary movement', color: '#4DA6FF' },
  { name: 'Parietal Lobe', role: 'Sensory processing, spatial awareness', color: '#8A7CFF' },
  { name: 'Temporal Lobe', role: 'Memory, language, auditory processing', color: '#FF4D9D' },
  { name: 'Occipital Lobe', role: 'Visual processing and perception', color: '#4DA6FF' },
  { name: 'Cerebellum', role: 'Balance, coordination, fine motor control', color: '#8A7CFF' },
  { name: 'Brain Stem', role: 'Vital functions: breathing, heart rate, sleep', color: '#FF4D9D' },
  { name: 'Hippocampus', role: 'Memory formation and spatial navigation', color: '#4DA6FF' },
  { name: 'Amygdala', role: 'Emotion processing and fear response', color: '#8A7CFF' },
  { name: 'Thalamus', role: 'Relay station for sensory and motor signals', color: '#FF4D9D' },
];

const Anatomy = () => {
  return (
    <div className="min-h-screen pt-28 pb-20 relative overflow-hidden">
      <div className="absolute top-[10%] left-[-8%] w-[500px] h-[500px] bg-soft-purple/8 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="absolute top-[30%] right-[-8%] w-[400px] h-[400px] bg-neon-blue/8 rounded-full blur-[110px] pointer-events-none -z-10" />
      <div className="absolute bottom-[10%] left-[30%] w-[350px] h-[350px] bg-neon-pink/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center max-w-3xl mx-auto px-6 mb-12 space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest"
          style={{ background: 'rgba(77,166,255,0.08)', borderColor: 'rgba(77,166,255,0.22)', color: '#4DA6FF' }}
        >
          <Brain className="w-3.5 h-3.5" />
          Neuroanatomy Explorer
        </div>
        <h1 className="text-5xl lg:text-6xl font-extrabold font-outfit text-white leading-tight">
          Explore the Human{' '}
          <span style={{ background: 'linear-gradient(90deg, #4DA6FF 0%, #8A7CFF 55%, #FF4D9D 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Brain
          </span>
        </h1>
        <p className="text-white/50 text-base leading-relaxed max-w-xl mx-auto">
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
          { icon: <Brain className="w-5 h-5" />, label: '9 Regions', sub: 'Mapped & Labeled', color: '#4DA6FF' },
          { icon: <Activity className="w-5 h-5" />, label: 'Clinical Data', sub: 'Function Mapping', color: '#8A7CFF' },
          { icon: <Zap className="w-5 h-5" />, label: 'AI Linked', sub: 'NeuroAI Integrated', color: '#FF4D9D' },
        ].map(({ icon, label, sub, color }) => (
          <div key={label} className="rounded-2xl px-6 py-4 flex flex-col items-center gap-1 text-center"
            style={{ background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <span style={{ color }}>{icon}</span>
            <span className="text-lg font-extrabold font-outfit" style={{ color }}>{label}</span>
            <span className="text-white/40 text-xs font-medium">{sub}</span>
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
            whileHover={{ scale: 1.03, y: -4 }}
            className="rounded-2xl p-5 cursor-default"
            style={{
              background: 'rgba(255,255,255,0.035)',
              border: `1px solid ${region.color}22`,
              boxShadow: `0 0 20px ${region.color}10`,
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: `${region.color}18`, border: `1px solid ${region.color}33` }}
              >
                <Cpu className="w-4 h-4" style={{ color: region.color }} />
              </div>
              <h3 className="font-bold text-white text-sm font-outfit">{region.name}</h3>
            </div>
            <p className="text-white/45 text-xs leading-relaxed">{region.role}</p>
            <div className="mt-3 h-1 rounded-full" style={{ background: `linear-gradient(90deg, ${region.color}60, transparent)` }} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Anatomy;

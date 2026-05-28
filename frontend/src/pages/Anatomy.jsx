import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';
import BrainAnatomy3D from '../components/BrainAnatomy3D';

const Anatomy = () => {
  return (
    <div className="min-h-screen pt-28 pb-20 relative overflow-hidden">
      {/* Ambient background orbs */}
      <div className="absolute top-[10%] left-[-8%] w-[500px] h-[500px] bg-soft-purple/8 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="absolute top-[30%] right-[-8%] w-[400px] h-[400px] bg-neon-blue/8 rounded-full blur-[110px] pointer-events-none -z-10" />
      <div className="absolute bottom-[10%] left-[30%] w-[350px] h-[350px] bg-neon-pink/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center max-w-3xl mx-auto px-6 mb-6 space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest"
          style={{
            background: 'rgba(77,166,255,0.08)',
            borderColor: 'rgba(77,166,255,0.22)',
            color: '#4DA6FF',
          }}
        >
          <Brain className="w-3.5 h-3.5" />
          3D Neuroanatomy Explorer
        </div>
        <h1 className="text-5xl lg:text-6xl font-extrabold font-outfit text-white leading-tight">
          Explore the Human{' '}
          <span
            style={{
              background: 'linear-gradient(90deg, #4DA6FF 0%, #8A7CFF 55%, #FF4D9D 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Brain
          </span>
        </h1>
        <p className="text-white/50 text-base leading-relaxed max-w-xl mx-auto">
          Interact with a realistic 3D anatomical model. Hover or click any region to discover its clinical function. Drag freely to rotate 360°.
        </p>
      </motion.div>

      {/* 3D Section */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.15, ease: 'easeOut' }}
      >
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-[600px] text-white/30 text-sm font-mono animate-pulse">
              Loading 3D anatomy model…
            </div>
          }
        >
          <BrainAnatomy3D />
        </Suspense>
      </motion.div>

      {/* Bottom info strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.6 }}
        className="mt-12 max-w-4xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {[
          { label: '9 Regions', sub: 'Labeled & Interactive', color: '#4DA6FF' },
          { label: '360° Rotation', sub: 'Drag freely with inertia', color: '#8A7CFF' },
          { label: 'Realtime Tooltips', sub: 'Clinical function mapping', color: '#FF4D9D' },
        ].map(({ label, sub, color }) => (
          <div
            key={label}
            className="rounded-2xl px-6 py-4 flex flex-col gap-1 text-center"
            style={{
              background: 'rgba(255,255,255,0.035)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <span className="text-xl font-extrabold font-outfit" style={{ color }}>{label}</span>
            <span className="text-white/40 text-xs font-medium">{sub}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Anatomy;

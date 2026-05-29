import React from 'react';
import { motion } from 'framer-motion';
import { Activity, HeartPulse, Thermometer, AlertTriangle, ShieldCheck, FlaskConical } from 'lucide-react';

const Anatomy = ({ isDark }) => {
  const sepsisInfo = [
    {
      title: 'What is Sepsis?',
      items: [
        { name: 'Sepsis', desc: 'The body\'s extreme response to an infection. It starts when an infection you already have triggers a chain reaction throughout your body.' },
        { name: 'Severe Sepsis', desc: 'Sepsis with evidence of organ dysfunction, including acute respiratory distress syndrome, acute kidney injury, or cardiovascular collapse.' },
        { name: 'Septic Shock', desc: 'A subset of severe sepsis with profound circulatory, cellular, and metabolic abnormalities substantially increasing mortality.' }
      ],
      icon: AlertTriangle,
      color: isDark ? '#EF4444' : '#DC2626'
    },
    {
      title: 'Key Biomarkers',
      items: [
        { name: 'Lactate', desc: 'Indicator of tissue hypoperfusion and anaerobic metabolism; elevated levels correlate with severity.' },
        { name: 'Procalcitonin', desc: 'Biomarker for bacterial infection; helps differentiate infectious from non-infectious causes of inflammation.' },
        { name: 'WBC Count', desc: 'Leukocytosis or leukopenia indicates immune system activation or exhaustion.' },
        { name: 'CRP', desc: 'C-reactive protein; an acute phase reactant measuring systemic inflammation.' },
        { name: 'Blood Cultures', desc: 'Gold standard for identifying causative pathogens and guiding targeted antimicrobial therapy.' }
      ],
      icon: FlaskConical,
      color: isDark ? '#3B82F6' : '#1D4ED8'
    },
    {
      title: 'Organ Systems Affected',
      items: [
        { name: 'Cardiovascular', desc: 'Hypotension, vasoplegia, myocardial dysfunction, and arrhythmias.' },
        { name: 'Renal', desc: 'Acute kidney injury (AKI) from hypoperfusion, inflammation, and nephrotoxins.' },
        { name: 'Hepatic', desc: 'Hepatocellular injury, cholestasis, and impaired synthetic function.' },
        { name: 'Respiratory', desc: 'Acute respiratory distress syndrome (ARDS) with refractory hypoxemia.' },
        { name: 'Neurological', desc: 'Encephalopathy, delirium, and altered mental status from hypoperfusion and inflammation.' }
      ],
      icon: HeartPulse,
      color: isDark ? '#22C55E' : '#16A34A'
    },
    {
      title: 'Scoring Systems',
      items: [
        { name: 'qSOFA Score', desc: 'Quick SOFA: Respiratory rate ≥22, altered mental status, systolic BP ≤100 mmHg (1 point each; ≥2 indicates high risk).' },
        { name: 'SOFA Score', desc: 'Sequential Organ Failure Assessment: Measures dysfunction in 6 organ systems; higher scores = higher mortality.' },
        { name: 'SIRS Criteria', desc: 'Systemic Inflammatory Response Syndrome: 2+ of temperature <36 or >38°C, HR >90, RR >20, WBC <4000 or >12000.' }
      ],
      icon: Activity,
      color: isDark ? '#F59E0B' : '#D97706'
    }
  ];

  const stats = [
    { icon: <Activity className="w-5 h-5" />, label: '4 Stages', sub: 'Sepsis Progression', color: isDark ? '#EF4444' : '#DC2626' },
    { icon: <FlaskConical className="w-5 h-5" />, label: '5+ Biomarkers', sub: 'Clinical Indicators', color: isDark ? '#3B82F6' : '#1D4ED8' },
    { icon: <ShieldCheck className="w-5 h-5" />, label: '3 Scores', sub: 'Risk Stratification', color: isDark ? '#22C55E' : '#16A34A' },
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 relative overflow-hidden">
      <div className={`absolute top-[10%] left-[-8%] w-[500px] h-[500px] ${isDark ? 'bg-blue-500/15' : 'bg-blue-100'} rounded-full blur-[130px] pointer-events-none -z-10`} />
      <div className={`absolute top-[30%] right-[-8%] w-[400px] h-[400px] ${isDark ? 'bg-red-500/15' : 'bg-red-100'} rounded-full blur-[110px] pointer-events-none -z-10`} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center max-w-3xl mx-auto px-6 mb-12 space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest transition-colors duration-300"
          style={{ 
            background: isDark ? 'rgba(37, 99, 235, 0.15)' : 'rgba(59, 130, 246, 0.1)', 
            borderColor: isDark ? 'rgba(59, 130, 246, 0.4)' : 'rgba(59, 130, 246, 0.3)', 
            color: isDark ? '#60A5FA' : '#2563EB' 
          }}
        >
          <Thermometer className="w-3.5 h-3.5" />
          Sepsis Science Overview
        </div>
        <h1 className="text-5xl lg:text-6xl font-extrabold font-outfit text-primary-heading dark:text-dm-text-primary leading-tight transition-colors duration-300">
          Understanding{' '}
          <span className="transition-colors duration-300" style={{ background: 'linear-gradient(90deg, #3B82F6 0%, #EF4444 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Sepsis
          </span>
        </h1>
        <p className="text-secondary-text dark:text-dm-text-secondary text-base leading-relaxed max-w-xl mx-auto transition-colors duration-300">
          Learn about sepsis pathophysiology, key biomarkers, organ involvement, and clinical scoring systems used in early detection.
        </p>
      </motion.div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="max-w-4xl mx-auto px-6 mb-10 grid grid-cols-3 gap-4"
      >
        {stats.map(({ icon, label, sub, color }) => (
          <div key={label} className="rounded-2xl px-6 py-4 flex flex-col items-center gap-1 text-center transition-colors duration-300"
            style={{ 
              background: isDark ? '#0D1B3D' : 'rgba(255,255,255,0.6)', 
              border: isDark ? '1px solid #1B2D5A' : '1px solid rgba(59,130,246,0.2)', 
              boxShadow: isDark ? '0 4px 15px rgba(0,0,0,0.4)' : '0 4px 15px rgba(59,130,246,0.08)' 
            }}
          >
            <span style={{ color }}>{icon}</span>
            <span className="text-lg font-extrabold font-outfit text-primary-heading dark:text-dm-text-primary transition-colors duration-300">{label}</span>
            <span className="text-secondary-text dark:text-dm-text-secondary text-xs font-medium transition-colors duration-300">{sub}</span>
          </div>
        ))}
      </motion.div>

      {/* Sepsis Info Grid */}
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sepsisInfo.map((section, i) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i, duration: 0.5 }}
            whileHover={{ scale: 1.01, y: -2 }}
            className="rounded-2xl p-6 cursor-default transition-colors duration-300"
            style={{
              background: isDark ? '#0D1B3D' : 'rgba(255,255,255,0.5)',
              border: isDark ? `1px solid #1B2D5A` : `1px solid ${section.color}40`,
              boxShadow: isDark ? `0 8px 24px rgba(0,0,0,0.5)` : `0 8px 24px ${section.color}15`,
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300"
                style={{ background: `${section.color}25`, border: `1px solid ${section.color}50` }}
              >
                <section.icon className="w-5 h-5" style={{ color: section.color }} />
              </div>
              <h2 className="font-bold text-primary-heading dark:text-dm-text-primary text-lg font-outfit transition-colors duration-300">{section.title}</h2>
            </div>
            <div className="space-y-3">
              {section.items.map((item, j) => (
                <div key={j} className="p-3 rounded-xl" style={{ background: `${section.color}10` }}>
                  <h3 className="font-bold text-primary-heading dark:text-dm-text-primary text-sm font-outfit mb-1" style={{ color: section.color }}>{item.name}</h3>
                  <p className="text-secondary-text dark:text-dm-text-secondary text-xs leading-relaxed transition-colors duration-300">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Anatomy;

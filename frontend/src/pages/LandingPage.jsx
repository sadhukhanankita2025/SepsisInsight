import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  FileText, 
  ShieldCheck, 
  Cpu, 
  TrendingUp, 
  ArrowRight, 
  Heart,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import rbcImage from '../assets/rbc.png';

const LandingPage = ({ setPage, isDark }) => {
  const steps = [
    {
      num: "01",
      title: "Enter Patient Vitals",
      desc: "Input vital signs, lab results, and clinical parameters via our secure entry system.",
      icon: Activity,
      color: "border-blue-500/40 text-blue-600"
    },
    {
      num: "02",
      title: "AI Analyzes Biomarkers",
      desc: "Our model evaluates WBC count, lactate, procalcitonin, and organ function markers.",
      icon: Cpu,
      color: "border-purple-500/40 text-purple-600"
    },
    {
      num: "03",
      title: "Sepsis Risk Score Generated",
      desc: "Advanced algorithms calculate qSOFA, SOFA scores, and classify risk as Low / Medium / High.",
      icon: AlertTriangle,
      color: "border-red-500/40 text-red-600"
    },
    {
      num: "04",
      title: "Downloadable Clinical Report",
      desc: "Instantly export a detailed sepsis risk report with treatment recommendations as a clinical PDF.",
      icon: FileText,
      color: "border-cyan-500/40 text-cyan-600"
    }
  ];

  const features = [
    {
      icon: AlertTriangle,
      title: "Accurate Sepsis Prediction",
      desc: "Pre-trained deep learning models trained on verified ICU patient databases for robust early detection."
    },
    {
      icon: Cpu,
      title: "Fast Biomarker Analysis",
      desc: "Processes and analyzes complex lab values in under 2 seconds utilizing optimized clinical inference pipelines."
    },
    {
      icon: Activity,
      title: "Smart Clinical Insights",
      desc: "Identify high-risk patients and receive actionable, evidence-based recommendations for immediate clinical action."
    },
    {
      icon: ShieldCheck,
      title: "Secure Patient Data Processing",
      desc: "Enterprise-grade encryption protecting patient records with HIPAA-compliant, zero data leakage architecture."
    },
    {
      icon: TrendingUp,
      title: "Real-time Risk Classification",
      desc: "Instantaneous risk stratification classifying patients as High, Medium, or Low sepsis risk dynamically."
    }
  ];

  return (
    <div className="pt-28">
      {/* Hero Section */}
      <section
        className="max-w-7xl mx-auto px-6 items-center min-h-[90vh] grid grid-cols-1 md:grid-cols-[45%_55%] gap-0"
      >
        {/* Left Side Info */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 pr-6 py-10 md:py-0"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-500/10 border border-blue-500/30 dark:border-dm-border text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} /> Advanced Sepsis Analytics
          </div>

          <h1 className="text-5xl lg:text-6xl font-extrabold font-outfit leading-[1.05] text-primary-heading dark:text-dm-text-primary">
            AI-Powered <br />
            <span className="bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">Sepsis Early Detection</span> <br />
            & Risk Scoring
          </h1>

          <p className="text-lg text-secondary-text dark:text-dm-text-secondary font-inter max-w-xl leading-relaxed">
            Our diagnostic platform uses machine learning and clinical biomarker analysis to detect sepsis risk in real time — enabling faster treatment and saving lives.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button 
              onClick={() => setPage('dashboard')}
              className="relative overflow-hidden group gradient-btn px-8 py-4 rounded-full flex items-center gap-2"
              style={{
                background: isDark ? '#081530' : '#1E40AF',
              }}
            >
              <span className="relative z-10 flex items-center gap-2 text-white">
                Start Screening <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-0" />
            </button>
            
            <button 
              onClick={() => {
                const el = document.getElementById('how-it-works');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 rounded-full border border-gray-400/20 dark:border-dm-border text-dark-gray-text dark:text-dm-text-primary font-bold bg-white/40 dark:bg-black/20 hover:bg-white/80 dark:hover:bg-black/40 hover:border-blue-500/40 dark:hover:border-dm-glow-border transition-all shadow-sm"
            >
              How It Works
            </button>
          </div>
          
          <div className="flex gap-10 border-t border-gray-400/20 dark:border-dm-border pt-8 max-w-md">
            <div>
              <p className="text-3xl font-extrabold font-outfit text-blue-600 dark:text-blue-400">96.8%</p>
              <p className="text-xs text-secondary-text dark:text-dm-text-muted uppercase tracking-wider font-semibold">Model Accuracy</p>
            </div>
            <div className="border-l border-gray-400/20 dark:border-dm-border" />
            <div>
              <p className="text-3xl font-extrabold font-outfit text-purple-600 dark:text-purple-400">&lt;2.1s</p>
              <p className="text-xs text-secondary-text dark:text-dm-text-muted uppercase tracking-wider font-semibold">Inference Time</p>
            </div>
            <div className="border-l border-gray-400/20 dark:border-dm-border" />
            <div>
              <p className="text-3xl font-extrabold font-outfit text-red-600 dark:text-red-400">8+ M</p>
              <p className="text-xs text-secondary-text dark:text-dm-text-muted uppercase tracking-wider font-semibold">Patient Records Trained</p>
            </div>
          </div>
        </motion.div>

        {/* Right Side — RBC takes full 55% column (Hidden on Mobile) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative hidden md:flex justify-center items-center min-h-[700px]"
        >
          {/* Glow blobs */}
          <div style={{
            position: 'absolute',
            width: '500px',
            height: '500px',
            background: isDark ? 'rgba(59,130,246,0.2)' : 'rgba(167,199,255,0.15)',
            borderRadius: '50%',
            filter: 'blur(120px)',
            zIndex: 0,
            animation: 'pulse 4s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            background: isDark ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.2)',
            borderRadius: '50%',
            filter: 'blur(100px)',
            zIndex: 0,
            animation: 'pulse 4s ease-in-out infinite',
            animationDelay: '2s',
          }} />

          {/* RBC image container */}
          <div style={{ position: 'relative', width: '460px', zIndex: 1 }} className="flex flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, type: "spring" }}
              className="bg-white/75 dark:bg-black/25 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/80 dark:border-dm-border shadow-2xl"
            >
              <div className="text-center space-y-6">
                <motion.div
                  animate={{ rotate: [0, 2, -2, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-56 h-56 mx-auto rounded-full overflow-hidden shadow-xl relative"
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-red-500 p-1.5">
                    <div className="w-full h-full rounded-full bg-white/80 dark:bg-black/40 overflow-hidden">
                      <img
                        src={rbcImage}
                        alt="Red blood cells - sepsis detection"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Label 1: qSOFA Score */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="absolute glass-card px-4 py-2 text-xs font-semibold flex items-center gap-2 text-primary-heading dark:text-dm-text-primary"
              style={{ top: '14%', left: '-6%' }}
            >
              <span className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 animate-ping" />
              qSOFA Score
            </motion.div>

            {/* Label 2: SIRS Criteria */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="absolute glass-card px-4 py-2 text-xs font-semibold flex items-center gap-2 text-primary-heading dark:text-dm-text-primary"
              style={{ top: '24%', right: '-4%' }}
            >
              <span className="w-2 h-2 rounded-full bg-purple-500 dark:bg-purple-400 animate-pulse" />
              SIRS Criteria
            </motion.div>

            {/* Label 3: Lactate Level */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="absolute glass-card px-4 py-2 text-xs font-semibold flex items-center gap-2 text-primary-heading dark:text-dm-text-primary"
              style={{ bottom: '28%', left: '-4%' }}
            >
              <span className="w-2 h-2 rounded-full bg-red-500 dark:bg-red-400 animate-ping" />
              Lactate Level
            </motion.div>

            {/* Label 4: Organ Dysfunction */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="absolute glass-card px-4 py-2 text-xs font-semibold flex items-center gap-2 text-primary-heading dark:text-dm-text-primary"
              style={{ bottom: '16%', right: '-4%', boxShadow: isDark ? '0 0 20px rgba(34,211,238,0.2)' : '0 0 20px rgba(196,182,206,0.3)' }}
            >
              <span className="w-2 h-2 rounded-full bg-yellow-500 dark:bg-yellow-400 animate-pulse" />
              Organ Dysfunction
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 mt-36 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 dark:bg-blue-500/10 border border-blue-500/20 dark:border-dm-border text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
            Clinical Workflow Pipeline
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold font-outfit text-primary-heading dark:text-dm-text-primary">
            How It Works
          </h2>
          <p className="text-secondary-text dark:text-dm-text-secondary">
            Our system delivers clinical grade sepsis risk forecasting in 4 seamless stages.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="glass-card p-8 relative overflow-hidden flex flex-col justify-between min-h-[300px]"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/60 dark:via-dm-glow-border to-transparent" />
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="text-4xl font-extrabold font-outfit opacity-20 text-blue-600 dark:text-blue-400">{step.num}</div>
                  <div className="p-3 rounded-xl bg-white/60 dark:bg-black/20 border border-white/80 dark:border-dm-border shadow-sm">
                    <step.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <h3 className="text-lg font-bold font-outfit text-primary-heading dark:text-dm-text-primary mb-3">{step.title}</h3>
                <p className="text-sm text-secondary-text dark:text-dm-text-muted leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 mt-36 relative">
        <div className="absolute right-[-10%] top-[20%] w-[350px] h-[350px] bg-red-500/10 dark:bg-red-500/5 rounded-full blur-[90px] -z-10 pointer-events-none" />

        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <div className="inline-block px-3 py-1 rounded-full bg-red-500/10 dark:bg-red-500/10 border border-red-500/20 dark:border-dm-border text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider">
            Engine Capabilities
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold font-outfit text-primary-heading dark:text-dm-text-primary">
            Advanced Clinical Intelligence Features
          </h2>
          <p className="text-secondary-text dark:text-dm-text-secondary">
            Equipped with critical care toolsets for real-time sepsis screening and early intervention.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="glass-card p-8 group flex flex-col justify-between"
            >
              <div>
                <div className="bg-gradient-to-tr from-blue-500/10 to-red-500/10 dark:from-blue-500/10 dark:to-red-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-white/60 dark:border-dm-border shadow-sm group-hover:border-blue-500/30 dark:group-hover:border-dm-glow-border transition-colors">
                  <feat.icon className="text-blue-600 dark:text-blue-400 w-6 h-6 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-xl font-bold font-outfit mb-3 text-primary-heading dark:text-dm-text-primary">{feat.title}</h3>
                <p className="text-sm text-secondary-text dark:text-dm-text-muted leading-relaxed">{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 mt-40">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-panel p-16 relative overflow-hidden text-center pulse-glow"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 dark:from-white/5 via-transparent to-blue-500/10 dark:to-red-500/10 -z-10" />
          <div className="max-w-2xl mx-auto space-y-8 relative z-10">
            <h2 className="text-4xl lg:text-5xl font-extrabold font-outfit text-primary-heading dark:text-dm-text-primary leading-tight">
              Start Your AI Sepsis <br />Screening Today
            </h2>
            <p className="text-secondary-text dark:text-dm-text-secondary max-w-md mx-auto">
              Empower your ICU and emergency care workflow with instant AI-driven sepsis risk analysis.
            </p>
            <div className="flex justify-center">
              <button 
                onClick={() => setPage('dashboard')}
                className="relative overflow-hidden group gradient-btn px-10 py-5 rounded-full flex items-center gap-2"
                style={{
                  background: isDark ? '#081530' : '#1E40AF',
                }}
              >
                <span className="relative z-10 flex items-center gap-2 text-white">
                  Analyze Patient <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-0" />
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="mt-40 bg-white/40 dark:bg-dm-bg-section border-t border-white/60 dark:border-dm-border backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="bg-gradient-to-tr from-blue-500 to-red-500 dark:from-blue-500 dark:to-red-500 p-2 rounded-xl">
                <Activity className="text-white-text w-6 h-6" />
              </div>
              <span className="text-xl font-bold font-outfit tracking-wider text-primary-heading dark:text-dm-text-primary">
                SepsisAI <span className="text-blue-600 dark:text-blue-400 font-light">Care</span>
              </span>
            </div>
            <p className="text-sm text-secondary-text dark:text-dm-text-secondary max-w-sm leading-relaxed">
              Fusing clinical intelligence and machine learning to build transparent, early sepsis detection systems for critical care and emergency medicine.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2.5 rounded-full bg-white/60 dark:bg-black/20 border border-white/80 dark:border-dm-border text-dark-gray-text dark:text-dm-text-muted hover:text-blue-600 dark:hover:text-dm-text-primary hover:border-blue-500/30 dark:hover:border-dm-glow-border transition-all flex items-center justify-center shadow-sm">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" className="p-2.5 rounded-full bg-white/60 dark:bg-black/20 border border-white/80 dark:border-dm-border text-dark-gray-text dark:text-dm-text-muted hover:text-blue-600 dark:hover:text-dm-text-primary hover:border-blue-500/30 dark:hover:border-dm-glow-border transition-all flex items-center justify-center shadow-sm">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z"/></svg>
              </a>
              <a href="#" className="p-2.5 rounded-full bg-white/60 dark:bg-black/20 border border-white/80 dark:border-dm-border text-dark-gray-text dark:text-dm-text-muted hover:text-blue-600 dark:hover:text-dm-text-primary hover:border-blue-500/30 dark:hover:border-dm-glow-border transition-all flex items-center justify-center shadow-sm">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.28-1.56 3.285-1.23 3.285-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg>
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-primary-heading dark:text-dm-text-primary font-bold font-outfit text-sm uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-sm text-secondary-text dark:text-dm-text-secondary">
              <li><button onClick={() => setPage('home')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</button></li>
              <li><button onClick={() => setPage('dashboard')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Analysis Dashboard</button></li>
              <li><button onClick={() => {
                const el = document.getElementById('how-it-works');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">How It Works</button></li>
              <li><button onClick={() => setPage('contact')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact Support</button></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-primary-heading dark:text-dm-text-primary font-bold font-outfit text-sm uppercase tracking-wider">Clinical Standards</h4>
            <ul className="space-y-2 text-sm text-secondary-text dark:text-dm-text-secondary">
              <li className="flex items-center gap-2 text-xs">
                <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                HIPAA Compliant
              </li>
              <li className="flex items-center gap-2 text-xs">
                <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                CE Certified ML Models
              </li>
              <li className="flex items-center gap-2 text-xs">
                <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                AES 256 Encryption
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/60 dark:border-dm-border py-8 text-center text-xs text-secondary-text/80 dark:text-dm-text-muted max-w-7xl mx-auto px-6 space-y-4">
          <p className="max-w-3xl mx-auto leading-relaxed">
            Medical Disclaimer: SepsisAI Care is an advanced AI screening tool for early sepsis risk stratification. It does not replace clinical judgment or a physician's diagnosis.
          </p>
          <p className="flex justify-center items-center gap-1">
            &copy; {new Date().getFullYear()} SepsisAI Care. Built with <Heart className="w-3 h-3 text-red-600 dark:text-red-400 animate-pulse fill-red-600 dark:fill-red-400" /> for critical care medicine.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

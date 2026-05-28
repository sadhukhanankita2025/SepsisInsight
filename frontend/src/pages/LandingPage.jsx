import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  BrainCircuit, 
  FileText, 
  ShieldCheck, 
  Cpu, 
  TrendingUp, 
  ArrowRight, 
  Heart,
  CheckCircle
} from 'lucide-react';
import brainImage from '../assets/brain.png';
import BrainAnatomy3D from '../components/BrainAnatomy3D';

const LandingPage = ({ setPage }) => {
  const steps = [
    {
      num: "01",
      title: "Upload Medical Data",
      desc: "Provide clinical patient data and neurological parameters instantly via our secure entry system.",
      icon: Activity,
      color: "border-neon-blue/30 text-neon-blue"
    },
    {
      num: "02",
      title: "AI Processes Neural Patterns",
      desc: "Our neural preprocessor maps your clinical profile into high-density diagnostic waves.",
      icon: Cpu,
      color: "border-soft-purple/30 text-soft-purple"
    },
    {
      num: "03",
      title: "Model Predicts Risk & Analysis",
      desc: "Advanced neural networks calculate early-stage risk scores and evaluate biomarker limits.",
      icon: BrainCircuit,
      color: "border-neon-pink/30 text-neon-pink"
    },
    {
      num: "04",
      title: "Generate Downloadable Medical Report",
      desc: "Instantly compile detailed diagnostics and medical interpretations into a clinical PDF.",
      icon: FileText,
      color: "border-mint-green/30 text-mint-green"
    }
  ];

  const features = [
    {
      icon: BrainCircuit,
      title: "Accurate AI Prediction",
      desc: "Pre-trained deep learning networks trained on verified patient databases for robust detection outcomes."
    },
    {
      icon: Cpu,
      title: "Fast Neural Analysis",
      desc: "Pre-process and analyze complex biomarkers in under 2 seconds utilizing accelerated model pipelines."
    },
    {
      icon: FileText,
      title: "Downloadable Reports",
      desc: "Export beautiful, print-ready, professional PDF clinical screenings decorated with data charts."
    },
    {
      icon: Activity,
      title: "Smart Clinical Insights",
      desc: "Identify critical limits and receive actionable recommendations tailored for professional consultation."
    },
    {
      icon: ShieldCheck,
      title: "Secure Medical Processing",
      desc: "Enterprise-grade encryption protecting patient anonymity. Local model serving ensures zero data leakage."
    },
    {
      icon: TrendingUp,
      title: "Real-time Risk Detection",
      desc: "Instantaneous alert indicators classing risks into High, Medium, or Low severity dynamically."
    }
  ];

  return (
    <div className="pt-28">
      {/* Hero Section — asymmetric: 45% text / 55% brain */}
      <section
        className="max-w-7xl mx-auto px-6 items-center min-h-[90vh]"
        style={{
          display: 'grid',
          gridTemplateColumns: '45% 55%',
          gap: '0',
        }}
      >
        {/* Left Side Info */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 pr-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon-blue/10 border border-neon-blue/20 text-neon-blue text-xs font-semibold uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} /> Advanced Neural Analytics
          </div>

          <h1 className="text-5xl lg:text-6xl font-extrabold font-outfit leading-[1.05] text-white-text">
            AI-Powered <br />
            <span className="gradient-text">Brain Health</span> <br />
            Analysis
          </h1>

          <p className="text-lg text-sec-text font-inter max-w-xl leading-relaxed">
            Our diagnostic platform uses advanced machine learning and deep neural analysis to predict and analyze neurological health risks accurately and instantly.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button 
              onClick={() => setPage('dashboard')}
              className="relative overflow-hidden group bg-gradient-to-r from-neon-blue to-soft-purple hover:shadow-[0_0_30px_rgba(77,166,255,0.4)] px-8 py-4 rounded-full text-white-text transition-all duration-300 font-bold flex items-center gap-2"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Analysis <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-soft-purple to-neon-pink opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-0" />
            </button>
            
            <button 
              onClick={() => {
                const el = document.getElementById('how-it-works');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 rounded-full border border-white/10 text-white-text font-bold bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur"
            >
              How It Works
            </button>
          </div>
          
          <div className="flex gap-10 border-t border-white/10 pt-8 max-w-md">
            <div>
              <p className="text-3xl font-extrabold font-outfit text-neon-blue">98.4%</p>
              <p className="text-xs text-sec-text uppercase tracking-wider font-semibold">Model Accuracy</p>
            </div>
            <div className="border-l border-white/10" />
            <div>
              <p className="text-3xl font-extrabold font-outfit text-soft-purple">&lt;1.8s</p>
              <p className="text-xs text-sec-text uppercase tracking-wider font-semibold">Inference Time</p>
            </div>
            <div className="border-l border-white/10" />
            <div>
              <p className="text-3xl font-extrabold font-outfit text-neon-pink">12+ M</p>
              <p className="text-xs text-sec-text uppercase tracking-wider font-semibold">Synapses Simulated</p>
            </div>
          </div>
        </motion.div>

        {/* ✅ Right Side — Brain takes full 55% column with real pixel dimensions */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '700px',
          }}
        >
          {/* Glow blobs */}
          <div style={{
            position: 'absolute',
            width: '500px',
            height: '500px',
            background: 'rgba(77,166,255,0.18)',
            borderRadius: '50%',
            filter: 'blur(120px)',
            zIndex: 0,
            animation: 'pulse 4s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            background: 'rgba(139,92,246,0.12)',
            borderRadius: '50%',
            filter: 'blur(100px)',
            zIndex: 0,
            animation: 'pulse 4s ease-in-out infinite',
            animationDelay: '2s',
          }} />

          {/* Brain image container — real fixed size */}
          <div style={{ position: 'relative', width: '420px', zIndex: 1 }}>
            <img 
              src={brainImage} 
              alt="Futuristic holographic neural brain diagram"
              className="floating"
              style={{
                width: '100%',
                height: 'auto',
                filter: 'drop-shadow(0 0 40px rgba(77,166,255,0.7)) drop-shadow(0 0 100px rgba(77,166,255,0.4)) drop-shadow(0 0 160px rgba(139,92,246,0.3))',
              }}
            />

            {/* Label 1: Neural Activity */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="absolute glass-panel px-4 py-2 border border-neon-blue/30 text-xs font-semibold flex items-center gap-2 glow-blue"
              style={{ top: '14%', left: '-6%' }}
            >
              <span className="w-2 h-2 rounded-full bg-neon-blue animate-ping" />
              Neural Activity
            </motion.div>

            {/* Label 2: AI Detection */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="absolute glass-panel px-4 py-2 border border-soft-purple/30 text-xs font-semibold flex items-center gap-2 glow-purple"
              style={{ top: '24%', right: '-4%' }}
            >
              <span className="w-2 h-2 rounded-full bg-soft-purple animate-pulse" />
              AI Detection
            </motion.div>

            {/* Label 3: Signal Mapping */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="absolute glass-panel px-4 py-2 border border-neon-pink/30 text-xs font-semibold flex items-center gap-2 glow-pink"
              style={{ bottom: '28%', left: '-4%' }}
            >
              <span className="w-2 h-2 rounded-full bg-neon-pink animate-ping" />
              Signal Mapping
            </motion.div>

            {/* Label 4: Brain Connectivity */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="absolute glass-panel px-4 py-2 border border-mint-green/30 text-xs font-semibold flex items-center gap-2"
              style={{ bottom: '16%', right: '-4%', boxShadow: '0 0 20px rgba(52,211,153,0.2)' }}
            >
              <span className="w-2 h-2 rounded-full bg-mint-green animate-pulse" />
              Brain Connectivity
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Interactive 3D Anatomy Brain Section */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <BrainAnatomy3D />
      </motion.div>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 mt-36 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <div className="inline-block px-3 py-1 rounded-full bg-soft-purple/10 border border-soft-purple/20 text-soft-purple text-xs font-bold uppercase tracking-wider">
            Workflow Pipeline
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold font-outfit text-white-text">
            How It Works
          </h2>
          <p className="text-sec-text">
            Our system is engineered to provide clinical grade neurological forecasting in 4 seamless stages.
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
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="text-4xl font-extrabold font-outfit opacity-20">{step.num}</div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <step.icon className="w-6 h-6 text-neon-blue" />
                  </div>
                </div>
                <h3 className="text-lg font-bold font-outfit text-white-text mb-3">{step.title}</h3>
                <p className="text-sm text-sec-text leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 mt-36 relative">
        <div className="absolute right-[-10%] top-[20%] w-[350px] h-[350px] bg-neon-pink/5 rounded-full blur-[90px] -z-10 pointer-events-none" />

        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <div className="inline-block px-3 py-1 rounded-full bg-neon-pink/10 border border-neon-pink/20 text-neon-pink text-xs font-bold uppercase tracking-wider">
            Engine Capabilities
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold font-outfit text-white-text">
            Advanced Intelligence Features
          </h2>
          <p className="text-sec-text">
            Equipped with clinical toolsets that assist diagnostics and offer next-generation screening pipelines.
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
                <div className="bg-gradient-to-tr from-neon-blue/10 to-soft-purple/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-white/5 group-hover:border-neon-blue/30 transition-colors">
                  <feat.icon className="text-neon-blue w-6 h-6 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-xl font-bold font-outfit mb-3 text-white-text">{feat.title}</h3>
                <p className="text-sm text-sec-text leading-relaxed">{feat.desc}</p>
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
          <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 via-transparent to-soft-purple/5 -z-10" />
          <div className="max-w-2xl mx-auto space-y-8">
            <h2 className="text-4xl lg:text-5xl font-extrabold font-outfit text-white-text leading-tight">
              Start Your AI Health <br />Analysis Today
            </h2>
            <p className="text-sec-text max-w-md mx-auto">
              Empower your cognitive diagnostic workflow with instant, reliable neural markers predictions.
            </p>
            <div className="flex justify-center">
              <button 
                onClick={() => setPage('dashboard')}
                className="relative overflow-hidden group bg-gradient-to-r from-neon-blue to-soft-purple hover:shadow-[0_0_35px_rgba(77,166,255,0.5)] px-10 py-5 rounded-full text-white-text transition-all duration-300 font-bold flex items-center gap-2"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Analyze Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-soft-purple to-neon-pink opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-0" />
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="mt-40 bg-[#071426]/60 border-t border-white/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="bg-gradient-to-tr from-neon-blue to-soft-purple p-2 rounded-xl">
                <Activity className="text-white-text w-6 h-6" />
              </div>
              <span className="text-xl font-bold font-outfit tracking-wider text-white-text">
                AI Neuro <span className="text-soft-purple font-light">Care</span>
              </span>
            </div>
            <p className="text-sm text-sec-text max-w-sm leading-relaxed">
              Fusing clinical intelligence and machine learning to build transparent, early screening systems for long-term brain health and longevity.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2.5 rounded-full bg-white/5 border border-white/10 text-sec-text hover:text-neon-blue hover:border-neon-blue transition-all flex items-center justify-center">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" className="p-2.5 rounded-full bg-white/5 border border-white/10 text-sec-text hover:text-neon-blue hover:border-neon-blue transition-all flex items-center justify-center">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z"/></svg>
              </a>
              <a href="#" className="p-2.5 rounded-full bg-white/5 border border-white/10 text-sec-text hover:text-neon-blue hover:border-neon-blue transition-all flex items-center justify-center">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.28-1.56 3.285-1.23 3.285-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg>
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-white-text font-bold font-outfit text-sm uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-sm text-sec-text">
              <li><button onClick={() => setPage('home')} className="hover:text-neon-blue transition-colors">Home</button></li>
              <li><button onClick={() => setPage('dashboard')} className="hover:text-neon-blue transition-colors">Analysis Dashboard</button></li>
              <li><button onClick={() => {
                const el = document.getElementById('how-it-works');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }} className="hover:text-neon-blue transition-colors">How It Works</button></li>
              <li><button onClick={() => setPage('contact')} className="hover:text-neon-blue transition-colors">Contact Support</button></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-white-text font-bold font-outfit text-sm uppercase tracking-wider">Clinical Standards</h4>
            <ul className="space-y-2 text-sm text-sec-text">
              <li className="flex items-center gap-2 text-xs">
                <CheckCircle className="w-4 h-4 text-mint-green shrink-0" />
                HIPAA Compliant
              </li>
              <li className="flex items-center gap-2 text-xs">
                <CheckCircle className="w-4 h-4 text-mint-green shrink-0" />
                CE Certified ML Models
              </li>
              <li className="flex items-center gap-2 text-xs">
                <CheckCircle className="w-4 h-4 text-mint-green shrink-0" />
                AES 256 Encryption
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 py-8 text-center text-xs text-sec-text/60 max-w-7xl mx-auto px-6 space-y-4">
          <p className="max-w-3xl mx-auto leading-relaxed">
            Medical Disclaimer: AI Neuro Care is an advanced artificial screening tool engineered for preemptive wellness screening. It does not replace a clinical physician's expert advice or offer a binding diagnosis.
          </p>
          <p className="flex justify-center items-center gap-1">
            &copy; {new Date().getFullYear()} AI Neuro Care. Built with <Heart className="w-3 h-3 text-neon-pink animate-pulse fill-neon-pink" /> for clinical AI progress.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
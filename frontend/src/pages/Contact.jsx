import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; 
import { Mail, Phone, MapPin, Send, HelpCircle, HeartHandshake, RefreshCw } from 'lucide-react';

const Contact = ({ isDark }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height || 450;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particleCount = 35;
    const particles = [];
    const maxDistance = 90;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 3 + 1.5,
        color: isDark 
          ? (i % 3 === 0 ? '#3B82F6' : i % 3 === 1 ? '#8B5CF6' : '#EC4899') 
          : (i % 3 === 0 ? '#A7C7FF' : i % 3 === 1 ? '#C4B6CE' : '#FF8BCB')
      });
    }

    let mouse = { x: null, y: null, active: false };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseEnter = () => { mouse.active = true; };
    const handleMouseLeave = () => { mouse.active = false; mouse.x = null; mouse.y = null; };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        for (let j = index + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const alpha = (1 - dist / maxDistance) * (isDark ? 0.6 : 0.4);
            ctx.strokeStyle = isDark ? `rgba(139, 92, 246, ${alpha})` : `rgba(163, 138, 178, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        if (mouse.active && mouse.x !== null) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

          if (mdist < 140) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            const alpha = (1 - mdist / 140) * (isDark ? 0.7 : 0.5);
            ctx.strokeStyle = isDark ? `rgba(59, 130, 246, ${alpha})` : `rgba(167, 199, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseenter', handleMouseEnter);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [isDark]); // Re-run effect when theme changes to update particle colors

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-6 relative">
      <div className="absolute left-[-5%] top-[15%] w-[400px] h-[400px] bg-electric-lavender/10 dark:bg-dm-electric-blue/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-soft-purple/10 dark:bg-dm-neural-purple/10 border border-soft-purple/30 dark:border-dm-neural-purple/30 text-electric-lavender dark:text-dm-neural-purple text-xs font-bold uppercase tracking-wider">
          <HeartHandshake className="w-3.5 h-3.5" /> Support Channel
        </div>
        <h1 className="text-4xl lg:text-5xl font-extrabold font-outfit text-primary-heading dark:text-dm-text-primary">
          Connect With Us
        </h1>
        <p className="text-secondary-text dark:text-dm-text-secondary">
          Have queries about model accuracies, integrations, or operational compliance? Drop us a line.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side */}
        <div className="lg:col-span-7 space-y-8">

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card p-5 border border-white/60 dark:border-dm-border hover:border-cool-blue-glow/50 dark:hover:border-dm-electric-blue/50 transition-all flex flex-col items-center text-center shadow-sm">
              <div className="w-10 h-10 bg-cool-blue-glow/10 dark:bg-dm-electric-blue/10 border border-cool-blue-glow/30 dark:border-dm-electric-blue/30 rounded-xl flex items-center justify-center mb-3">
                <Mail className="text-cool-blue-glow dark:text-dm-electric-blue w-5 h-5" />
              </div>
              <p className="text-[10px] text-secondary-text dark:text-dm-text-muted uppercase font-bold">Mail Support</p>
              <p className="text-sm font-bold text-primary-heading dark:text-dm-text-primary mt-1 select-all">care@neuro.ai</p>
            </div>

            <div className="glass-card p-5 border border-white/60 dark:border-dm-border hover:border-electric-lavender/50 dark:hover:border-dm-neural-purple/50 transition-all flex flex-col items-center text-center shadow-sm">
              <div className="w-10 h-10 bg-electric-lavender/10 dark:bg-dm-neural-purple/10 border border-electric-lavender/30 dark:border-dm-neural-purple/30 rounded-xl flex items-center justify-center mb-3">
                <Phone className="text-electric-lavender dark:text-dm-neural-purple w-5 h-5" />
              </div>
              <p className="text-[10px] text-secondary-text dark:text-dm-text-muted uppercase font-bold">Call Center</p>
              <p className="text-sm font-bold text-primary-heading dark:text-dm-text-primary mt-1 select-all">+1 (800) NEURO</p>
            </div>

            <div className="glass-card p-5 border border-white/60 dark:border-dm-border hover:border-neon-pink/50 dark:hover:border-dm-neon-pink/50 transition-all flex flex-col items-center text-center shadow-sm">
              <div className="w-10 h-10 bg-neon-pink/10 dark:bg-dm-neon-pink/10 border border-neon-pink/30 dark:border-dm-neon-pink/30 rounded-xl flex items-center justify-center mb-3">
                <MapPin className="text-neon-pink dark:text-dm-neon-pink w-5 h-5" />
              </div>
              <p className="text-[10px] text-secondary-text dark:text-dm-text-muted uppercase font-bold">Location</p>
              <p className="text-sm font-bold text-primary-heading dark:text-dm-text-primary mt-1">San Francisco, CA</p>
            </div>
          </div>

          {/* Form Panel */}
          <div className="glass-panel p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/80 dark:via-dm-border to-transparent" />

            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleFormSubmit}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        placeholder=" "
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="floating-input w-full bg-white/50 dark:bg-[#0B1020]/40 border border-white/80 dark:border-dm-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-electric-lavender dark:focus:border-dm-electric-blue focus:shadow-[0_0_15px_rgba(163,138,178,0.15)] dark:focus:shadow-[0_0_15px_rgba(59,130,246,0.15)] text-primary-heading dark:text-dm-text-primary transition-all duration-300 text-sm shadow-inner dark:shadow-none"
                      />
                      <label className="absolute left-4 top-3.5 text-secondary-text dark:text-dm-text-muted pointer-events-none transition-all duration-300 transform scale-100 origin-[0] text-sm">
                        Full Name
                      </label>
                    </div>

                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        placeholder=" "
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="floating-input w-full bg-white/50 dark:bg-[#0B1020]/40 border border-white/80 dark:border-dm-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-electric-lavender dark:focus:border-dm-electric-blue focus:shadow-[0_0_15px_rgba(163,138,178,0.15)] dark:focus:shadow-[0_0_15px_rgba(59,130,246,0.15)] text-primary-heading dark:text-dm-text-primary transition-all duration-300 text-sm shadow-inner dark:shadow-none"
                      />
                      <label className="absolute left-4 top-3.5 text-secondary-text dark:text-dm-text-muted pointer-events-none transition-all duration-300 transform scale-100 origin-[0] text-sm">
                        Email Address
                      </label>
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      name="subject"
                      placeholder=" "
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="floating-input w-full bg-white/50 dark:bg-[#0B1020]/40 border border-white/80 dark:border-dm-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-electric-lavender dark:focus:border-dm-electric-blue focus:shadow-[0_0_15px_rgba(163,138,178,0.15)] dark:focus:shadow-[0_0_15px_rgba(59,130,246,0.15)] text-primary-heading dark:text-dm-text-primary transition-all duration-300 text-sm shadow-inner dark:shadow-none"
                    />
                    <label className="absolute left-4 top-3.5 text-secondary-text dark:text-dm-text-muted pointer-events-none transition-all duration-300 transform scale-100 origin-[0] text-sm">
                      Subject Matter
                    </label>
                  </div>

                  <div className="relative">
                    <textarea
                      rows="4"
                      name="message"
                      placeholder=" "
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      className="floating-input w-full bg-white/50 dark:bg-[#0B1020]/40 border border-white/80 dark:border-dm-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-electric-lavender dark:focus:border-dm-electric-blue focus:shadow-[0_0_15px_rgba(163,138,178,0.15)] dark:focus:shadow-[0_0_15px_rgba(59,130,246,0.15)] text-primary-heading dark:text-dm-text-primary transition-all duration-300 text-sm resize-none shadow-inner dark:shadow-none"
                    />
                    <label className="absolute left-4 top-3.5 text-secondary-text dark:text-dm-text-muted pointer-events-none transition-all duration-300 transform scale-100 origin-[0] text-sm">
                      Message details...
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full relative overflow-hidden group gradient-btn py-4 rounded-xl flex items-center justify-center gap-2"
                  >
                    <span className="relative z-10 flex items-center gap-2 text-white-text">
                      {submitting ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" /> Verifying Connection...
                        </>
                      ) : (
                        <>
                          Send Message <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-deep-charcoal to-rich-black opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-0" />
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="text-center py-12 space-y-6"
                >
                  <div className="w-16 h-16 bg-mint-green/10 border border-mint-green/30 rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(52,211,153,0.2)]">
                    <Send className="text-mint-green w-7 h-7" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold font-outfit text-primary-heading dark:text-dm-text-primary">Message Transmitted</h3>
                    <p className="text-secondary-text dark:text-dm-text-secondary text-sm max-w-xs mx-auto">
                      Thank you. Your clinical inquiry has been encrypted and sent to our diagnostic support team.
                    </p>
                  </div>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 rounded-full border border-dark-gray-text/20 dark:border-dm-border hover:bg-white/40 dark:hover:bg-white/10 hover:border-dark-gray-text/40 dark:hover:border-dm-glow-border transition-all text-xs font-semibold text-dark-gray-text dark:text-dm-text-secondary shadow-sm"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: Neural Canvas */}
        <div className="lg:col-span-5 h-[480px] glass-panel relative overflow-hidden flex flex-col justify-between group bg-white/30 dark:bg-dm-bg-section/30">
          <div className="absolute top-4 left-6 z-20 pointer-events-none">
            <span className="text-[10px] text-electric-lavender dark:text-dm-neural-purple uppercase font-bold tracking-widest bg-electric-lavender/10 dark:bg-dm-neural-purple/10 border border-electric-lavender/20 dark:border-dm-neural-purple/20 px-2.5 py-1 rounded-full flex items-center gap-1.5 glow-purple">
              <HelpCircle className="w-3.5 h-3.5 animate-pulse" /> Interactive Neural Net
            </span>
          </div>

          <canvas ref={canvasRef} className="absolute inset-0 z-10 w-full h-full cursor-crosshair" />

          <div className="absolute inset-0 bg-gradient-to-t from-soft-lavender/40 dark:from-dm-bg-secondary/80 via-transparent to-transparent z-15 pointer-events-none opacity-60 dark:opacity-80" />

          <div className="absolute bottom-6 left-6 z-20 pointer-events-none pr-6">
            <p className="text-xs font-mono text-secondary-text dark:text-dm-text-muted opacity-60 group-hover:opacity-100 transition-opacity">
              &gt; Move cursor over canvas to stimulate synapse connectors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileDown, 
  Activity, 
  Thermometer, 
  RefreshCw, 
  Stethoscope, 
  UserCheck, 
  Sparkles,
  AlertTriangle,
  CheckCircle,
  FileCheck
} from 'lucide-react';
import axios from 'axios';
import jsPDF from 'jspdf';
import { API_BASE } from '../config/api';

const Dashboard = ({ isDark }) => {
  const [formData, setFormData] = useState({
    age: '',
    gender: 'Male',
    heartRate: '',
    systolicBP: '',
    diastolicBP: '',
    temperature: '', // in °C
    respiratoryRate: '',
    mentalStatus: 'Alert',
    lactate: '',
    wbcCount: '',
    procalcitonin: '',
    infectionSource: 'Unknown'
  });

  const [analyzing, setAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const loadPreset = (type) => {
    if (type === 'healthy') {
      setFormData({
        age: '32', gender: 'Female', heartRate: '72',
        systolicBP: '120', diastolicBP: '80', temperature: '37.0',
        respiratoryRate: '14', mentalStatus: 'Alert',
        lactate: '1.2', wbcCount: '7500',
        procalcitonin: '0.05', infectionSource: 'Unknown'
      });
    } else {
      setFormData({
        age: '68', gender: 'Male', heartRate: '115',
        systolicBP: '95', diastolicBP: '60', temperature: '39.2',
        respiratoryRate: '26', mentalStatus: 'Confused',
        lactate: '4.5', wbcCount: '16000',
        procalcitonin: '2.8', infectionSource: 'Lung'
      });
    }
    setResult(null);
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { age, heartRate, systolicBP, diastolicBP, temperature, respiratoryRate, lactate, wbcCount, procalcitonin } = formData;
    if (!age || !heartRate || !systolicBP || !diastolicBP || !temperature || !respiratoryRate || !lactate || !wbcCount || !procalcitonin) {
      setError("All clinical parameters are required for sepsis risk assessment.");
      return false;
    }
    if (age <= 0 || age > 120) { setError("Please specify a valid patient age (1 - 120)."); return false; }
    if (heartRate < 30 || heartRate > 250) { setError("Heart Rate must be between 30 and 250 BPM."); return false; }
    if (systolicBP < 50 || systolicBP > 250) { setError("Systolic Blood Pressure must be between 50 and 250 mmHg."); return false; }
    if (diastolicBP < 30 || diastolicBP > 180) { setError("Diastolic Blood Pressure must be between 30 and 180 mmHg."); return false; }
    if (temperature < 30 || temperature > 42) { setError("Body Temperature must be in standard Celsius range (30 - 42°C)."); return false; }
    if (respiratoryRate < 5 || respiratoryRate > 60) { setError("Respiratory Rate must be between 5 and 60 breaths/min."); return false; }
    if (lactate < 0 || lactate > 20) { setError("Lactate level must be valid (0 - 20 mmol/L)."); return false; }
    if (wbcCount < 1000 || wbcCount > 50000) { setError("WBC Count must be between 1,000 and 50,000 cells/µL."); return false; }
    if (procalcitonin < 0 || procalcitonin > 100) { setError("Procalcitonin must be valid (0 - 100 ng/mL)."); return false; }
    setError(null);
    return true;
  };

  // Calculate qSOFA score for display
  const calculateQSOFA = () => {
    let qSOFA = 0;
    if (parseInt(formData.respiratoryRate) >= 22) qSOFA++;
    if (parseInt(formData.systolicBP) <= 100) qSOFA++;
    if (formData.mentalStatus === 'Confused') qSOFA++;
    return qSOFA;
  };

  const triggerAnalysis = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setAnalyzing(true);
    setResult(null);
    setLoadingStep(0);

    const interval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev >= 3) { clearInterval(interval); return 3; }
        return prev + 1;
      });
    }, 850);

    try {
      // Simulate backend call (we can still call your existing endpoint, but let's adjust the input to match what it expects)
      // First, convert temperature to Fahrenheit for the existing endpoint:
      const tempF = (parseFloat(formData.temperature) * 9/5 + 32).toFixed(1);
      
      const response = await axios.post(`${API_BASE}/predict-clinical`, {
        age: parseInt(formData.age),
        gender: formData.gender,
        heart_rate: parseFloat(formData.heartRate),
        systolic_bp: parseFloat(formData.systolicBP),
        diastolic_bp: parseFloat(formData.diastolicBP),
        temperature: parseFloat(tempF),
        respiratory_rate: parseFloat(formData.respiratoryRate),
        wbc_count: parseFloat(formData.wbcCount)
      });

      // Now add our own qSOFA to the result
      const qSOFA = calculateQSOFA();

      clearInterval(interval);
      setTimeout(() => {
        setResult({ ...response.data, qSOFA });
        setAnalyzing(false);
      }, 500);

    } catch (err) {
      clearInterval(interval);
      console.error(err);
      setError(err.response?.data?.error || "Failed to establish model connection. Please ensure the backend is running.");
      setAnalyzing(false);
    }
  };

  // ─── PDF Generator ───────────────
  const downloadPDFReport = () => {
    if (!result) return;

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentW = pageW - margin * 2;
    let y = 0;

    const setFont = (style = 'normal', size = 10) => {
      doc.setFont('helvetica', style);
      doc.setFontSize(size);
    };

    const setColor = (r, g, b) => {
      doc.setTextColor(r, g, b);
    };

    const drawRect = (x, ry, w, h, r, g, b, filled = true) => {
      if (filled) {
        doc.setFillColor(r, g, b);
        doc.rect(x, ry, w, h, 'F');
      } else {
        doc.setDrawColor(r, g, b);
        doc.rect(x, ry, w, h, 'S');
      }
    };

    const drawLine = (x1, ly, x2, ly2, r = 200, g = 200, b = 200) => {
      doc.setDrawColor(r, g, b);
      doc.setLineWidth(0.3);
      doc.line(x1, ly, x2, ly2);
    };

    const scorePercent = Math.round(result.score * 100);

    const getRiskLabel = () => {
      if (result.score >= 0.7) return 'HIGH SEPSIS RISK';
      if (result.score >= 0.35) return 'MODERATE SEPSIS RISK';
      return 'LOW SEPSIS RISK';
    };

    const getInfectionState = () => {
      if (parseFloat(formData.procalcitonin) >= 2) return 'High Probability of Bacterial Infection';
      if (parseFloat(formData.procalcitonin) >= 0.5) return 'Possible Bacterial Infection';
      return 'Low Probability of Bacterial Infection';
    };

    const getLactateState = () => {
      if (parseFloat(formData.lactate) > 4) return 'Elevated Lactate (Indicates Hypoperfusion)';
      if (parseFloat(formData.lactate) > 2) return 'Borderline Elevated Lactate';
      return 'Normal Lactate Level';
    };

    const getClinicalAdvice = () => {
      if (result.score >= 0.7) return 'Immediate clinical assessment required. Initiate sepsis bundle within 1 hour: obtain cultures, start broad-spectrum antibiotics, fluid resuscitation, and lactate monitoring. Consider ICU admission.';
      if (result.score >= 0.35) return 'Close monitoring and further diagnostic evaluation indicated. Serial lactate measurements, complete blood count, and infectious workup recommended.';
      return 'Continue standard clinical care. Monitor for any changes in vital signs or clinical status. Routine follow-up as clinically indicated.';
    };

    const timestamp = result.timestamp || new Date().toLocaleString();

    // ─── HEADER BANNER ────────────────────────────────────────────────────
    drawRect(0, 0, pageW, 38, 30, 64, 175); // Clinical Blue

    // White title text
    setFont('bold', 16);
    setColor(255, 255, 255);
    doc.text('SepsisAI Care: Sepsis Risk Assessment Report', margin, 16);

    setFont('normal', 9);
    setColor(200, 220, 255); // Light Blue
    doc.text(`Generated: ${timestamp}`, margin, 24);
    doc.text(`Report ID: SEPSIS-AI-${scorePercent}-${Date.now().toString().slice(-6)}`, margin, 30);

    // Score badge top-right
    const badgeX = pageW - margin - 28;
    const scoreColor = result.score >= 0.7 ? [239, 68, 68] : result.score >= 0.35 ? [245, 158, 11] : [34, 197, 94];
    doc.setFillColor(...scoreColor);
    doc.roundedRect(badgeX, 8, 28, 22, 3, 3, 'F');
    setFont('bold', 14);
    setColor(255, 255, 255);
    doc.text(`${scorePercent}%`, badgeX + 14, 18, { align: 'center' });
    setFont('normal', 7);
    doc.text('RISK', badgeX + 14, 25, { align: 'center' });

    y = 46;

    // ─── PATIENT INFO BAR ──────────────────────────────────────────────────────
    setFont('normal', 9);
    setColor(80, 80, 80);
    doc.text(`Patient Gender: ${formData.gender}   |   Age: ${formData.age} Years   |   Analysis Date: ${new Date().toLocaleDateString()}`, margin, y);
    y += 8;
    drawLine(margin, y, pageW - margin, y);
    y += 8;

    // ─── SECTION 1: Risk Classification ──────────────────────────────────
    drawRect(margin, y, contentW, 8, 30, 64, 175); // Clinical Blue
    setFont('bold', 10);
    setColor(255, 255, 255);
    doc.text('1. Sepsis Risk Classification', margin + 3, y + 5.5);
    y += 14;

    const riskBg = result.score >= 0.7 ? [255, 242, 242] : result.score >= 0.35 ? [255, 251, 235] : [240, 253, 244];
    const riskBorder = scoreColor;
    drawRect(margin, y, contentW, 12, ...riskBg);
    doc.setDrawColor(...riskBorder);
    doc.setLineWidth(0.5);
    doc.rect(margin, y, contentW, 12, 'S');

    setFont('bold', 11);
    setColor(...riskBorder);
    doc.text(`EVALUATION: ${getRiskLabel()} (${scorePercent}%)`, margin + 5, y + 8);
    y += 18;

    // ─── SECTION 2: Clinical Parameters ────────────────────────────────────
    drawRect(margin, y, contentW, 8, 30, 64, 175);
    setFont('bold', 10);
    setColor(255, 255, 255);
    doc.text('2. Clinical Parameters and qSOFA', margin + 3, y + 5.5);
    y += 12;

    drawRect(margin, y, contentW, 8, 59, 130, 246); // Light Blue
    setFont('bold', 9);
    setColor(255, 255, 255);
    doc.text('Parameter', margin + 4, y + 5.5);
    doc.text('Value', margin + 95, y + 5.5);
    doc.text('Reference Range', margin + 135, y + 5.5);
    y += 8;

    const tableRows = [
      ['Patient Age', `${formData.age} Years`, 'Adult'],
      ['Heart Rate (HR)', `${formData.heartRate} bpm`, '60 - 100 bpm'],
      ['Body Temperature', `${formData.temperature}°C`, '36.1 - 37.8°C'],
      ['Systolic BP (SBP)', `${formData.systolicBP} mmHg`, '90 - 120 mmHg'],
      ['Diastolic BP (DBP)', `${formData.diastolicBP} mmHg`, '60 - 80 mmHg'],
      ['Respiratory Rate', `${formData.respiratoryRate} breaths/min`, '12 - 20 breaths/min'],
      ['Mental Status', formData.mentalStatus, 'Alert'],
      ['Lactate', `${formData.lactate} mmol/L`, '0.5 - 1.6 mmol/L'],
      ['WBC Count', `${parseInt(formData.wbcCount).toLocaleString()} cells/µL`, '4,500 - 11,000 cells/µL'],
      ['Procalcitonin', `${formData.procalcitonin} ng/mL`, '< 0.05 ng/mL'],
      ['Suspected Source', formData.infectionSource, ''],
      ['qSOFA Score', result.qSOFA + ' / 3', '≤ 1 Low Risk']
    ];

    tableRows.forEach((row, i) => {
      const rowBg = i % 2 === 0 ? [248, 250, 255] : [255, 255, 255];
      drawRect(margin, y, contentW, 7.5, ...rowBg);
      drawLine(margin, y + 7.5, pageW - margin, y + 7.5);

      setFont('normal', 8.5);
      setColor(40, 40, 60);
      doc.text(row[0], margin + 4, y + 5);

      setFont('bold', 8.5);
      setColor(30, 80, 160);
      doc.text(row[1], margin + 95, y + 5);

      setFont('normal', 8.5);
      setColor(100, 100, 120);
      doc.text(row[2], margin + 135, y + 5);

      y += 7.5;
    });

    doc.setDrawColor(180, 190, 210);
    doc.setLineWidth(0.4);
    doc.rect(margin, y - (tableRows.length * 7.5), contentW, tableRows.length * 7.5, 'S');

    y += 10;

    // ─── SECTION 3: Clinical Interpretation ─────────────────────────────────────────
    drawRect(margin, y, contentW, 8, 30, 64, 175);
    setFont('bold', 10);
    setColor(255, 255, 255);
    doc.text('3. Clinical Interpretation & Recommendations', margin + 3, y + 5.5);
    y += 12;

    drawRect(margin, y, contentW, 4, 240, 245, 255);
    const interpLines = doc.splitTextToSize(getClinicalAdvice(), contentW - 8);
    const interpH = interpLines.length * 5.5 + 8;
    drawRect(margin, y, contentW, interpH, 245, 248, 255);
    doc.setDrawColor(180, 190, 230);
    doc.setLineWidth(0.3);
    doc.rect(margin, y, contentW, interpH, 'S');

    setFont('normal', 9);
    setColor(40, 40, 80);
    doc.text(interpLines, margin + 4, y + 6);
    y += interpH + 8;

    // ─── SECTION 4: Key Markers Summary ───────────────────────────────────────
    if (y < pageH - 60) {
      drawRect(margin, y, contentW, 8, 30, 64, 175);
      setFont('bold', 10);
      setColor(255, 255, 255);
      doc.text('4. Key Marker Summary', margin + 3, y + 5.5);
      y += 12;

      const flagData = [
        { label: 'Lactate Status', value: getLactateState(), ok: parseFloat(formData.lactate) <= 2 },
        { label: 'Infection Probability', value: getInfectionState(), ok: parseFloat(formData.procalcitonin) < 0.5 },
        { label: 'Heart Rate', value: `${formData.heartRate} BPM`, ok: formData.heartRate >= 60 && formData.heartRate <= 100 },
        { label: 'Respiratory Rate', value: `${formData.respiratoryRate}/min`, ok: formData.respiratoryRate >= 12 && formData.respiratoryRate <= 20 }
      ];

      const colW = contentW / 2 - 3;
      flagData.forEach((flag, i) => {
        const fx = margin + (i % 2) * (colW + 6);
        const fy = y + Math.floor(i / 2) * 18;

        const flagColor = flag.ok ? [230, 248, 235] : [255, 235, 240];
        const flagBorder = flag.ok ? [34, 197, 94] : [239, 68, 68];
        drawRect(fx, fy, colW, 14, ...flagColor);
        doc.setDrawColor(...flagBorder);
        doc.setLineWidth(0.4);
        doc.rect(fx, fy, colW, 14, 'S');

        doc.setFillColor(...flagBorder);
        doc.rect(fx, fy, 3, 14, 'F');

        setFont('bold', 8);
        setColor(40, 40, 60);
        doc.text(flag.label, fx + 7, fy + 5.5);

        setFont('normal', 8);
        setColor(...flagBorder);
        doc.text(flag.value, fx + 7, fy + 10.5);
      });
    }

    // ─── FOOTER ────────────────────────────────────────────────────────────────
    const footerY = pageH - 20;
    drawLine(margin, footerY - 4, pageW - margin, footerY - 4, 180, 190, 210);

    setFont('normal', 7.5);
    setColor(130, 130, 150);
    doc.text(
      'Medical Disclaimer: SepsisAI Care is an advanced AI screening tool for early sepsis risk stratification. It does not replace clinical judgment or a physician\'s diagnosis.',
      margin,
      footerY,
      { maxWidth: contentW - 30 }
    );
    doc.text(`Page 1 of 1`, pageW - margin, footerY, { align: 'right' });

    doc.save(`SepsisAI-Care-Report-${formData.age}-${formData.gender}-${Date.now()}.pdf`);
  };

  const resetForm = () => {
    setFormData({ age: '', gender: 'Male', heartRate: '', systolicBP: '', diastolicBP: '', temperature: '', respiratoryRate: '', mentalStatus: 'Alert', lactate: '', wbcCount: '', procalcitonin: '', infectionSource: 'Unknown' });
    setResult(null);
    setError(null);
  };

  const radius = 70;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const scorePercent = result ? Math.round(result.score * 100) : 0;
  const strokeDashoffset = circumference - (scorePercent / 100) * circumference;

  const getRiskTheme = () => {
    if (!result) return { text: '', color: '', glow: '', border: '' };
    const score = result.score;
    if (score >= 0.7) return { text: 'High Risk', color: isDark ? 'text-red-400' : 'text-red-600', bg: isDark ? 'bg-red-500/10' : 'bg-red-100', border: isDark ? 'border-red-400/30' : 'border-red-600/30', glow: isDark ? 'shadow-[0_0_30px_rgba(239,68,68,0.3)]' : 'shadow-[0_0_30px_rgba(239,68,68,0.3)]', colorHex: isDark ? '#EF4444' : '#DC2626' };
    if (score >= 0.35) return { text: 'Medium Risk', color: isDark ? 'text-amber-400' : 'text-amber-600', bg: isDark ? 'bg-amber-500/10' : 'bg-amber-100', border: isDark ? 'border-amber-400/30' : 'border-amber-600/30', glow: isDark ? 'shadow-[0_0_30px_rgba(245,158,11,0.3)]' : 'shadow-[0_0_30px_rgba(245,158,11,0.3)]', colorHex: isDark ? '#F59E0B' : '#D97706' };
    return { text: 'Low Risk', color: isDark ? 'text-green-400' : 'text-green-600', bg: isDark ? 'bg-green-500/10' : 'bg-green-100', border: isDark ? 'border-green-400/30' : 'border-green-600/30', glow: isDark ? 'shadow-[0_0_30px_rgba(34,197,94,0.3)]' : 'shadow-[0_0_30px_rgba(34,197,94,0.3)]', colorHex: isDark ? '#22C55E' : '#16A34A' };
  };

  const riskTheme = getRiskTheme();

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-6 relative">
      
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-blue-500/10 border border-blue-500/30 dark:border-dm-border text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
          <Activity className="w-3.5 h-3.5 animate-pulse" /> Sepsis Forecast Engine
        </div>
        <h1 className="text-4xl lg:text-5xl font-extrabold font-outfit text-primary-heading dark:text-dm-text-primary">Sepsis Risk Assessment</h1>
        <p className="text-secondary-text dark:text-dm-text-secondary">Input patient parameters below to evaluate sepsis risk and generate a downloadable clinical report.</p>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="bg-red-500/10 dark:bg-red-500/10 border border-red-500/30 dark:border-red-400/30 text-primary-heading dark:text-dm-text-primary p-4 rounded-2xl flex items-center gap-3 mb-8 shadow-[0_0_20px_rgba(239,68,68,0.15)] dark:shadow-[0_0_20px_rgba(239,68,68,0.15)]"
          >
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
            <span className="text-sm font-medium">{error}</span>
            <button onClick={() => setError(null)} className="ml-auto text-secondary-text dark:text-dm-text-muted hover:text-primary-heading dark:hover:text-dm-text-primary transition-colors">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/40 dark:via-blue-500/40 to-transparent" />
            
            <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
              <h2 className="text-xl font-bold font-outfit text-primary-heading dark:text-dm-text-primary flex items-center gap-2">
                <Stethoscope className="text-blue-600 dark:text-blue-400 w-5 h-5" /> Patient Clinical Vitals
              </h2>
              <div className="flex gap-2.5">
                <button type="button" onClick={() => loadPreset('healthy')}
                  className="px-3.5 py-1.5 rounded-full border border-green-500/40 dark:border-green-500/40 bg-white/60 dark:bg-black/20 text-xs text-green-600 dark:text-green-400 font-semibold hover:bg-white/80 dark:hover:bg-black/40 transition-all flex items-center gap-1 shadow-sm"
                >
                  <UserCheck className="w-3.5 h-3.5" /> Low Risk Demo
                </button>
                <button type="button" onClick={() => loadPreset('risk')}
                  className="px-3.5 py-1.5 rounded-full border border-red-500/40 dark:border-red-500/40 bg-white/60 dark:bg-black/20 text-xs text-red-600 dark:text-red-400 font-semibold hover:bg-white/80 dark:hover:bg-black/40 transition-all flex items-center gap-1 shadow-sm"
                >
                  <AlertTriangle className="w-3.5 h-3.5" /> High Risk Demo
                </button>
              </div>
            </div>

            <form onSubmit={triggerAnalysis} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { name: 'age', label: 'Age (Years)', type: 'number' },
                ].map(field => (
                  <div key={field.name} className="relative">
                    <input type={field.type} name={field.name} placeholder=" " value={formData[field.name]} onChange={handleInputChange}
                      className="floating-input w-full bg-white/50 dark:bg-[#0B1020]/40 border border-white/80 dark:border-dm-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:shadow-[0_0_15px_rgba(59,130,246,0.15)] dark:focus:shadow-[0_0_15px_rgba(59,130,246,0.15)] text-primary-heading dark:text-dm-text-primary transition-all duration-300 shadow-inner dark:shadow-none"
                    />
                    <label className="absolute left-4 top-3.5 text-secondary-text dark:text-dm-text-muted pointer-events-none transition-all duration-300 text-sm">{field.label}</label>
                  </div>
                ))}

                <div className="relative">
                  <select name="gender" value={formData.gender} onChange={handleInputChange}
                    className="w-full bg-white/50 dark:bg-[#0B1020]/40 border border-white/80 dark:border-dm-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-primary-heading dark:text-dm-text-primary transition-all duration-300 text-sm shadow-inner dark:shadow-none"
                  >
                    <option className="bg-white dark:bg-dm-bg-navy" value="Male">Male</option>
                    <option className="bg-white dark:bg-dm-bg-navy" value="Female">Female</option>
                    <option className="bg-white dark:bg-dm-bg-navy" value="Other">Other</option>
                  </select>
                  <span className="absolute -top-2.5 left-4 bg-white/90 dark:bg-dm-bg-navy backdrop-blur px-2 rounded text-xs text-blue-600 dark:text-blue-400 font-semibold">Gender</span>
                </div>

                {[
                  { name: 'heartRate', label: 'Heart Rate (BPM)' },
                  { name: 'systolicBP', label: 'Systolic BP (mmHg)' },
                  { name: 'diastolicBP', label: 'Diastolic BP (mmHg)' },
                  { name: 'temperature', label: 'Body Temperature (°C)', step: '0.1' },
                  { name: 'respiratoryRate', label: 'Respiratory Rate (/min)' },
                ].map(field => (
                  <div key={field.name} className="relative">
                    <input type="number" step={field.step} name={field.name} placeholder=" " value={formData[field.name]} onChange={handleInputChange}
                      className="floating-input w-full bg-white/50 dark:bg-[#0B1020]/40 border border-white/80 dark:border-dm-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:shadow-[0_0_15px_rgba(59,130,246,0.15)] dark:focus:shadow-[0_0_15px_rgba(59,130,246,0.15)] text-primary-heading dark:text-dm-text-primary transition-all duration-300 text-sm shadow-inner dark:shadow-none"
                    />
                    <label className="absolute left-4 top-3.5 text-secondary-text dark:text-dm-text-muted pointer-events-none transition-all duration-300 text-sm">{field.label}</label>
                  </div>
                ))}

                <div className="relative">
                  <select name="mentalStatus" value={formData.mentalStatus} onChange={handleInputChange}
                    className="w-full bg-white/50 dark:bg-[#0B1020]/40 border border-white/80 dark:border-dm-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-primary-heading dark:text-dm-text-primary transition-all duration-300 text-sm shadow-inner dark:shadow-none"
                  >
                    <option className="bg-white dark:bg-dm-bg-navy" value="Alert">Alert</option>
                    <option className="bg-white dark:bg-dm-bg-navy" value="Confused">Confused</option>
                  </select>
                  <span className="absolute -top-2.5 left-4 bg-white/90 dark:bg-dm-bg-navy backdrop-blur px-2 rounded text-xs text-blue-600 dark:text-blue-400 font-semibold">Mental Status</span>
                </div>

                {[
                  { name: 'lactate', label: 'Lactate (mmol/L)', step: '0.1' },
                  { name: 'wbcCount', label: 'WBC Count (cells/µL)' },
                  { name: 'procalcitonin', label: 'Procalcitonin (ng/mL)', step: '0.01' },
                ].map(field => (
                  <div key={field.name} className="relative">
                    <input type="number" step={field.step} name={field.name} placeholder=" " value={formData[field.name]} onChange={handleInputChange}
                      className="floating-input w-full bg-white/50 dark:bg-[#0B1020]/40 border border-white/80 dark:border-dm-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:shadow-[0_0_15px_rgba(59,130,246,0.15)] dark:focus:shadow-[0_0_15px_rgba(59,130,246,0.15)] text-primary-heading dark:text-dm-text-primary transition-all duration-300 text-sm shadow-inner dark:shadow-none"
                    />
                    <label className="absolute left-4 top-3.5 text-secondary-text dark:text-dm-text-muted pointer-events-none transition-all duration-300 text-sm">{field.label}</label>
                  </div>
                ))}

                <div className="relative">
                  <select name="infectionSource" value={formData.infectionSource} onChange={handleInputChange}
                    className="w-full bg-white/50 dark:bg-[#0B1020]/40 border border-white/80 dark:border-dm-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-primary-heading dark:text-dm-text-primary transition-all duration-300 text-sm shadow-inner dark:shadow-none"
                  >
                    <option className="bg-white dark:bg-dm-bg-navy" value="Lung">Lung</option>
                    <option className="bg-white dark:bg-dm-bg-navy" value="Urinary">Urinary</option>
                    <option className="bg-white dark:bg-dm-bg-navy" value="Abdominal">Abdominal</option>
                    <option className="bg-white dark:bg-dm-bg-navy" value="Unknown">Unknown</option>
                  </select>
                  <span className="absolute -top-2.5 left-4 bg-white/90 dark:bg-dm-bg-navy backdrop-blur px-2 rounded text-xs text-blue-600 dark:text-blue-400 font-semibold">Suspected Source</span>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" disabled={analyzing}
                  className="flex-1 relative overflow-hidden group gradient-btn py-4 rounded-xl flex items-center justify-center gap-2 shadow-sm"
                  style={{ background: isDark ? '#081530' : '#1E40AF' }}
                >
                  <span className="relative z-10 text-white">{analyzing ? 'Analyzing Vitals...' : 'Start Sepsis Screening'}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-0" />
                </button>
                <button type="button" onClick={resetForm}
                  className="px-6 py-4 rounded-xl border border-white/80 dark:border-dm-border bg-white/60 dark:bg-black/20 hover:bg-white/80 dark:hover:bg-black/40 transition-all font-bold text-dark-gray-text dark:text-dm-text-secondary flex items-center gap-2 shadow-sm"
                >
                  <RefreshCw className="w-5 h-5" /> Reset
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-5 h-full">
          <div className="glass-panel p-8 relative overflow-hidden h-full flex flex-col justify-between min-h-[500px]">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/40 dark:via-blue-500/40 to-transparent" />
            
            <AnimatePresence mode="wait">
              {!result && !analyzing && (
                <motion.div key="waiting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center text-center py-16 h-full flex-grow space-y-6"
                >
                  <div className="w-20 h-20 bg-white/60 dark:bg-black/20 rounded-full border border-white/80 dark:border-dm-border flex items-center justify-center shadow-inner">
                    <Activity className="text-blue-500/50 dark:text-blue-400/50 w-10 h-10 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold font-outfit text-primary-heading dark:text-dm-text-primary opacity-70">Awaiting Vitals</h3>
                  <p className="text-secondary-text dark:text-dm-text-secondary text-sm max-w-xs leading-relaxed">Select a sample demo preset or manually input vitals to trigger sepsis risk assessment.</p>
                </motion.div>
              )}

              {analyzing && (
                <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center text-center py-12 h-full flex-grow space-y-8"
                >
                  <div className="relative">
                    <div className="w-36 h-36 border-2 border-blue-500/40 dark:border-blue-400/40 rounded-full animate-ping" />
                    <div className="absolute inset-0 w-36 h-36 border-2 border-t-blue-500 dark:border-t-blue-400 border-transparent rounded-full animate-spin" style={{ animationDuration: '1s' }} />
                    <div className="absolute inset-0 m-auto w-28 h-28 bg-white/60 dark:bg-dm-bg-section border border-white/90 dark:border-dm-border rounded-full flex items-center justify-center shadow-lg">
                      <Activity className="text-blue-600 dark:text-blue-400 w-12 h-12 floating" />
                    </div>
                  </div>
                  <div className="space-y-3 w-full max-w-xs">
                    <h3 className="text-xl font-bold font-outfit text-primary-heading dark:text-dm-text-primary">Sepsis Risk Screening</h3>
                    <div className="space-y-1 bg-white/60 dark:bg-black/20 border border-white/80 dark:border-dm-border p-3.5 rounded-xl text-left text-xs font-mono text-secondary-text dark:text-dm-text-muted leading-relaxed shadow-inner dark:shadow-none">
                      <p className={loadingStep >= 0 ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''}>{loadingStep >= 0 ? '✓' : '○'} Preprocessing clinical vitals...</p>
                      <p className={loadingStep >= 1 ? 'text-purple-600 dark:text-purple-400 font-semibold' : ''}>{loadingStep >= 1 ? '✓' : '○'} Calculating qSOFA score...</p>
                      <p className={loadingStep >= 2 ? 'text-red-600 dark:text-red-400 font-semibold' : ''}>{loadingStep >= 2 ? '✓' : '○'} Evaluating biomarkers...</p>
                      <p className={loadingStep >= 3 ? 'text-green-600 dark:text-green-400 font-semibold animate-pulse' : ''}>{loadingStep >= 3 ? '✓' : '○'} Generating risk report...</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {result && !analyzing && (
                <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
                  className="space-y-6 py-4 flex-grow flex flex-col justify-between"
                >
                  
                  <div className={`p-6 rounded-2xl border ${riskTheme.border} ${riskTheme.bg} bg-white/60 dark:bg-transparent relative overflow-hidden flex items-center justify-between flex-wrap gap-6 shadow-sm`}>
                    <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="72" cy="72" r={radius} stroke="rgba(255,255,255,0.3)" strokeWidth={strokeWidth} fill="transparent" />
                        <motion.circle cx="72" cy="72" r={radius} stroke={riskTheme.colorHex} strokeWidth={strokeWidth} fill="transparent"
                          strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset }}
                          transition={{ duration: 1.2, ease: 'easeOut' }} strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-3xl font-extrabold font-outfit text-primary-heading dark:text-dm-text-primary leading-none">{scorePercent}%</span>
                        <span className="text-[10px] text-secondary-text dark:text-dm-text-muted uppercase tracking-widest font-semibold mt-1">Risk</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${riskTheme.color} bg-white/80 dark:bg-black/20 border border-white/100 dark:border-white/10 ${riskTheme.glow}`}>
                        {riskTheme.text}
                      </span>
                      <h3 className="text-xl font-bold font-outfit text-primary-heading dark:text-dm-text-primary leading-tight">Sepsis Screening Complete</h3>
                      <p className="text-xs text-secondary-text dark:text-dm-text-muted">qSOFA Score: <span className="font-mono text-blue-600 dark:text-blue-400">{result.qSOFA} / 3</span></p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold text-secondary-text dark:text-dm-text-muted uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Clinical Interpretation
                    </h4>
                    <p className="text-sm text-primary-heading dark:text-dm-text-primary leading-relaxed bg-white/60 dark:bg-black/20 border border-white/90 dark:border-dm-border p-4 rounded-xl shadow-inner dark:shadow-none">
                      {result.score >= 0.7 
                        ? 'High sepsis risk detected. Immediate clinical assessment is strongly recommended. Initiate sepsis protocol if not already done.'
                        : result.score >= 0.35 
                          ? 'Moderate sepsis risk. Close monitoring and further diagnostic evaluation are indicated.'
                          : 'Low sepsis risk. Continue standard care and monitor for any clinical deterioration.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/60 dark:bg-black/20 border border-white/90 dark:border-dm-border px-3 py-2 rounded-xl text-left shadow-sm">
                      <p className="text-[10px] text-secondary-text dark:text-dm-text-muted uppercase font-bold">Lactate Level</p>
                      <p className="text-xs font-bold text-primary-heading dark:text-dm-text-primary mt-0.5">
                        {parseFloat(formData.lactate) > 4 ? <span className="text-red-600 dark:text-red-400">Elevated (Over 4)</span>
                        : parseFloat(formData.lactate) > 2 ? <span className="text-amber-600 dark:text-amber-400">Borderline (2–4)</span>
                        : <span className="text-green-600 dark:text-green-400">Normal (Under 2)</span>}
                      </p>
                    </div>
                    <div className="bg-white/60 dark:bg-black/20 border border-white/90 dark:border-dm-border px-3 py-2 rounded-xl text-left shadow-sm">
                      <p className="text-[10px] text-secondary-text dark:text-dm-text-muted uppercase font-bold">Procalcitonin</p>
                      <p className="text-xs font-bold text-primary-heading dark:text-dm-text-primary mt-0.5">
                        {parseFloat(formData.procalcitonin) >= 2 ? <span className="text-red-600 dark:text-red-400">High Probability</span>
                        : parseFloat(formData.procalcitonin) >= 0.5 ? <span className="text-amber-600 dark:text-amber-400">Possible</span>
                        : <span className="text-green-600 dark:text-green-400">Low Probability</span>}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button onClick={downloadPDFReport}
                      className="w-full bg-white/80 dark:bg-black/20 border border-white/100 dark:border-dm-border hover:bg-white/100 dark:hover:bg-black/40 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] dark:hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] py-3 rounded-xl font-bold flex items-center justify-center gap-2.5 transition-all text-primary-heading dark:text-dm-text-primary shadow-md"
                    >
                      <FileDown className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Download Clinical PDF Report
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

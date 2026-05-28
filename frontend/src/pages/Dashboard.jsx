import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileDown, 
  Activity, 
  BrainCircuit, 
  HeartPulse, 
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

const API_BASE = window.location.port === '5173' ? 'http://localhost:5000' : '';

const Dashboard = () => {
  const [formData, setFormData] = useState({
    age: '',
    gender: 'Male',
    heartRate: '',
    systolicBP: '',
    diastolicBP: '',
    temperature: '',
    respiratoryRate: '',
    wbcCount: ''
  });

  const [analyzing, setAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const loadPreset = (type) => {
    if (type === 'healthy') {
      setFormData({
        age: '32', gender: 'Female', heartRate: '68',
        systolicBP: '118', diastolicBP: '76', temperature: '98.2',
        respiratoryRate: '14', wbcCount: '6200'
      });
    } else {
      setFormData({
        age: '74', gender: 'Male', heartRate: '94',
        systolicBP: '158', diastolicBP: '94', temperature: '99.8',
        respiratoryRate: '22', wbcCount: '12400'
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
    const { age, heartRate, systolicBP, diastolicBP, temperature, respiratoryRate, wbcCount } = formData;
    if (!age || !heartRate || !systolicBP || !diastolicBP || !temperature || !respiratoryRate || !wbcCount) {
      setError("All physiological and demographic parameters are required for medical alignment.");
      return false;
    }
    if (age <= 0 || age > 120) { setError("Please specify a valid patient age (1 - 120)."); return false; }
    if (heartRate < 30 || heartRate > 250) { setError("Heart Rate must be between 30 and 250 BPM."); return false; }
    if (systolicBP < 50 || systolicBP > 250) { setError("Systolic Blood Pressure must be between 50 and 250 mmHg."); return false; }
    if (diastolicBP < 30 || diastolicBP > 180) { setError("Diastolic Blood Pressure must be between 30 and 180 mmHg."); return false; }
    if (temperature < 90 || temperature > 110) { setError("Body Temperature must be in standard Fahrenheit range (90 - 110°F)."); return false; }
    if (respiratoryRate < 5 || respiratoryRate > 60) { setError("Respiratory Rate must be between 5 and 60 breaths/min."); return false; }
    if (wbcCount < 1000 || wbcCount > 50000) { setError("WBC Count must be between 1,000 and 50,000 cells/µL."); return false; }
    setError(null);
    return true;
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
      const response = await axios.post(`${API_BASE}/predict-clinical`, {
        age: parseInt(formData.age),
        gender: formData.gender,
        heart_rate: parseFloat(formData.heartRate),
        systolic_bp: parseFloat(formData.systolicBP),
        diastolic_bp: parseFloat(formData.diastolicBP),
        temperature: parseFloat(formData.temperature),
        respiratory_rate: parseFloat(formData.respiratoryRate),
        wbc_count: parseFloat(formData.wbcCount)
      });

      clearInterval(interval);
      setTimeout(() => {
        setResult(response.data);
        setAnalyzing(false);
      }, 500);

    } catch (err) {
      clearInterval(interval);
      console.error(err);
      setError(err.response?.data?.error || "Failed to establish model connection. Please ensure the Flask engine is loaded.");
      setAnalyzing(false);
    }
  };

  // ─── PDF Generator — matches your SepsisAI PDF format exactly ───────────────
  const downloadPDFReport = () => {
    if (!result) return;

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentW = pageW - margin * 2;
    let y = 0;

    // ── Helper functions ──────────────────────────────────────────────────────
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
    const tempC = ((parseFloat(formData.temperature) - 32) * 5 / 9).toFixed(1);

    const getRiskLabel = () => {
      if (result.score >= 0.7) return 'HIGH RISK';
      if (result.score >= 0.35) return 'MODERATE MONITORING RISK';
      return 'LOW RISK';
    };

    const getHypertensiveState = () => {
      if (parseInt(formData.systolicBP) >= 140 || parseInt(formData.diastolicBP) >= 90) return 'Severe Hypertensive';
      if (parseInt(formData.systolicBP) >= 120) return 'Elevated State';
      return 'Optimal Range';
    };

    const getWBCState = () => {
      if (parseInt(formData.wbcCount) > 11000) return 'Elevated WBC Count';
      if (parseInt(formData.wbcCount) < 4000) return 'Mild Leukopenia';
      return 'Normal Bio-count';
    };

    const getDietAdvice = () => {
      if (result.score >= 0.7) return 'High-protein, easily digestible nutrient-dense liquids. Maintain aggressive hydration monitoring. Restrict sodium and processed carbohydrates. Consider nutritional supplement IV support.';
      if (result.score >= 0.35) return 'Balanced diet with moderate protein intake. Ensure adequate hydration (2–3L/day). Limit salt and saturated fats. Monitor caloric intake.';
      return 'Maintain a well-balanced nutritious diet. Regular hydration and moderate exercise diet plan. No specific dietary restrictions required.';
    };

    const getMedicineAdvice = () => {
      if (result.score >= 0.7) return 'Proactive prophylactic antibiotic reviews, antipyretics (Acetaminophen) for fever management. Consider vasopressor support if hemodynamic instability observed. Immediate escalation to ICU if sepsis confirmed.';
      if (result.score >= 0.35) return 'Monitor vitals every 4 hours. Review current medications for contraindications. Consider preventive anti-inflammatory protocol. Consult specialist within 24 hours.';
      return 'No immediate pharmacological intervention required. Routine follow-up recommended. Continue any existing prescribed medication protocols.';
    };

    const getActivityAdvice = () => {
      if (result.score >= 0.7) return 'Restricted minimal mobility. Zero exertion exercises; limited positioning movements to prevent pressure injury. Strict bed rest protocol enforced.';
      if (result.score >= 0.35) return 'Limit physical exertion. Light walking permitted under supervision. Avoid strenuous activities. Rest periods every 2 hours recommended.';
      return 'Normal physical activity permitted. Regular moderate exercise encouraged. No restrictions on daily activities.';
    };

    const timestamp = result.timestamp || new Date().toLocaleString();

    // ── DARK HEADER BANNER ────────────────────────────────────────────────────
    drawRect(0, 0, pageW, 38, 10, 15, 35);

    // White title text
    setFont('bold', 16);
    setColor(255, 255, 255);
    doc.text('AI NeuroCare Fusion Workstation: Diagnostic Output', margin, 16);

    setFont('normal', 9);
    setColor(160, 185, 220);
    doc.text(`Generated: ${timestamp}`, margin, 24);
    doc.text(`Report ID: AI-NEURO-${scorePercent}-${Date.now().toString().slice(-6)}`, margin, 30);

    // Score badge top-right
    const badgeX = pageW - margin - 28;
    const scoreColor = result.score >= 0.7 ? [220, 50, 80] : result.score >= 0.35 ? [130, 100, 220] : [50, 150, 220];
    doc.setFillColor(...scoreColor);
    doc.roundedRect(badgeX, 8, 28, 22, 3, 3, 'F');
    setFont('bold', 14);
    setColor(255, 255, 255);
    doc.text(`${scorePercent}%`, badgeX + 14, 18, { align: 'center' });
    setFont('normal', 7);
    doc.text('RISK SCORE', badgeX + 14, 25, { align: 'center' });

    y = 46;

    // ── PATIENT NAME BAR ──────────────────────────────────────────────────────
    setFont('normal', 9);
    setColor(80, 80, 80);
    doc.text(`Patient Gender: ${formData.gender}   |   Age: ${formData.age} Years   |   Analysis Date: ${new Date().toLocaleDateString()}`, margin, y);
    y += 8;
    drawLine(margin, y, pageW - margin, y);
    y += 8;

    // ── SECTION 1: Inference Classification ──────────────────────────────────
    // Section header bar
    drawRect(margin, y, contentW, 8, 25, 50, 100);
    setFont('bold', 10);
    setColor(255, 255, 255);
    doc.text('1. Inference Classification Diagnostics', margin + 3, y + 5.5);
    y += 14;

    // Risk classification box
    const riskBg = result.score >= 0.7 ? [255, 235, 240] : result.score >= 0.35 ? [240, 235, 255] : [230, 245, 255];
    const riskBorder = result.score >= 0.7 ? [220, 50, 80] : result.score >= 0.35 ? [130, 100, 220] : [50, 150, 220];
    drawRect(margin, y, contentW, 12, ...riskBg);
    doc.setDrawColor(...riskBorder);
    doc.setLineWidth(0.5);
    doc.rect(margin, y, contentW, 12, 'S');

    setFont('bold', 11);
    setColor(...riskBorder);
    doc.text(`EVALUATED CONDITION TARGET: ${getRiskLabel()} (${scorePercent}%)`, margin + 5, y + 8);
    y += 18;

    // ── SECTION 2: Input Parameter Matrix ────────────────────────────────────
    drawRect(margin, y, contentW, 8, 25, 50, 100);
    setFont('bold', 10);
    setColor(255, 255, 255);
    doc.text('2. Input Parameter Matrix Captured', margin + 3, y + 5.5);
    y += 12;

    // Table Header
    drawRect(margin, y, contentW, 8, 45, 70, 120);
    setFont('bold', 9);
    setColor(255, 255, 255);
    doc.text('Physiological Biomarker Sign', margin + 4, y + 5.5);
    doc.text('Value Recorded', margin + 95, y + 5.5);
    doc.text('Baseline Reference Range', margin + 135, y + 5.5);
    y += 8;

    // Table rows
    const tableRows = [
      ['Patient Age Factor', `${formData.age} Years`, 'General Demographics'],
      ['Heart Rate (HR)', `${formData.heartRate} bpm`, '60 - 100 bpm'],
      ['Body Temperature', `${tempC} °C`, '36.5 - 37.5 °C'],
      ['Systolic Blood Pressure (SBP)', `${formData.systolicBP} mmHg`, '90 - 120 mmHg'],
      ['Diastolic Blood Pressure (DBP)', `${formData.diastolicBP} mmHg`, '60 - 80 mmHg'],
      ['Respiration Rate (Resp)', `${formData.respiratoryRate} breaths/min`, '12 - 20 breaths/min'],
      ['WBC Count (Leukocytes)', `${parseInt(formData.wbcCount).toLocaleString()} cells/µL`, '4,000 - 11,000 cells/µL'],
      ['Hypertensive Status', getHypertensiveState(), 'Optimal Range'],
      ['Inflammatory Marker', getWBCState(), 'Normal Bio-count'],
    ];

    tableRows.forEach((row, i) => {
      const rowBg = i % 2 === 0 ? [248, 250, 255] : [255, 255, 255];
      drawRect(margin, y, contentW, 7.5, ...rowBg);
      drawLine(margin, y + 7.5, pageW - margin, y + 7.5, 220, 220, 230);

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

    // Table outer border
    doc.setDrawColor(180, 190, 210);
    doc.setLineWidth(0.4);
    doc.rect(margin, y - (tableRows.length * 7.5), contentW, tableRows.length * 7.5, 'S');

    y += 10;

    // ── SECTION 3: AI Interpretation ─────────────────────────────────────────
    drawRect(margin, y, contentW, 8, 25, 50, 100);
    setFont('bold', 10);
    setColor(255, 255, 255);
    doc.text('3. AI Model Interpretation', margin + 3, y + 5.5);
    y += 12;

    drawRect(margin, y, contentW, 4, 240, 245, 255);
    const interpLines = doc.splitTextToSize(result.interpretation || 'No interpretation available.', contentW - 8);
    const interpH = interpLines.length * 5.5 + 8;
    drawRect(margin, y, contentW, interpH, 245, 248, 255);
    doc.setDrawColor(180, 190, 230);
    doc.setLineWidth(0.3);
    doc.rect(margin, y, contentW, interpH, 'S');

    setFont('normal', 9);
    setColor(40, 40, 80);
    doc.text(interpLines, margin + 4, y + 6);
    y += interpH + 8;

    // ── SECTION 4: Clinical Management ───────────────────────────────────────
    drawRect(margin, y, contentW, 8, 25, 50, 100);
    setFont('bold', 10);
    setColor(255, 255, 255);
    doc.text('4. Prescribed Clinical Management Guidance', margin + 3, y + 5.5);
    y += 12;

    // Management table header
    drawRect(margin, y, contentW, 8, 45, 70, 120);
    setFont('bold', 9);
    setColor(255, 255, 255);
    doc.text('Management Category', margin + 4, y + 5.5);
    doc.text('Prescribed Clinical Directives', margin + 70, y + 5.5);
    y += 8;

    const managementRows = [
      ['■  Diet Regime', getDietAdvice()],
      ['■  Clinical Medicine', getMedicineAdvice()],
      ['■  Workout & Activity', getActivityAdvice()],
    ];

    managementRows.forEach((row, i) => {
      const textLines = doc.splitTextToSize(row[1], contentW - 75);
      const rowH = Math.max(textLines.length * 5 + 8, 14);

      const rowBg = i % 2 === 0 ? [248, 250, 255] : [255, 255, 255];
      drawRect(margin, y, contentW, rowH, ...rowBg);
      doc.setDrawColor(210, 215, 230);
      doc.setLineWidth(0.3);
      doc.rect(margin, y, contentW, rowH, 'S');

      setFont('bold', 8.5);
      setColor(40, 40, 80);
      doc.text(row[0], margin + 4, y + 7);

      setFont('normal', 8.5);
      setColor(60, 60, 80);
      doc.text(textLines, margin + 70, y + 5.5);

      y += rowH;
    });

    y += 12;

    // ── SECTION 5: Vitals Summary Flags ──────────────────────────────────────
    if (y < pageH - 60) {
      drawRect(margin, y, contentW, 8, 25, 50, 100);
      setFont('bold', 10);
      setColor(255, 255, 255);
      doc.text('5. Quick Vitals Flag Summary', margin + 3, y + 5.5);
      y += 12;

      const flagData = [
        { label: 'Blood Pressure Status', value: getHypertensiveState(), ok: getHypertensiveState() === 'Optimal Range' },
        { label: 'WBC / Inflammatory', value: getWBCState(), ok: getWBCState() === 'Normal Bio-count' },
        { label: 'Heart Rate', value: `${formData.heartRate} BPM`, ok: formData.heartRate >= 60 && formData.heartRate <= 100 },
        { label: 'Temperature', value: `${tempC}°C`, ok: parseFloat(tempC) >= 36.5 && parseFloat(tempC) <= 37.5 },
      ];

      const colW = contentW / 2 - 3;
      flagData.forEach((flag, i) => {
        const fx = margin + (i % 2) * (colW + 6);
        const fy = y + Math.floor(i / 2) * 18;

        const flagColor = flag.ok ? [230, 248, 235] : [255, 235, 240];
        const flagBorder = flag.ok ? [80, 180, 100] : [220, 60, 80];
        drawRect(fx, fy, colW, 14, ...flagColor);
        doc.setDrawColor(...flagBorder);
        doc.setLineWidth(0.4);
        doc.rect(fx, fy, colW, 14, 'S');

        // Color indicator bar on left
        doc.setFillColor(...flagBorder);
        doc.rect(fx, fy, 3, 14, 'F');

        setFont('bold', 8);
        setColor(40, 40, 60);
        doc.text(flag.label, fx + 7, fy + 5.5);

        setFont('normal', 8);
        setColor(...flagBorder);
        doc.text(flag.value, fx + 7, fy + 10.5);
      });

      y += Math.ceil(flagData.length / 2) * 18 + 10;
    }

    // ── FOOTER ────────────────────────────────────────────────────────────────
    const footerY = pageH - 20;
    drawLine(margin, footerY - 4, pageW - margin, footerY - 4, 180, 190, 210);

    setFont('normal', 7.5);
    setColor(130, 130, 150);
    doc.text(
      'Medical Disclaimer: AI NeuroCare is an advanced AI screening tool for preemptive wellness analysis. This report does not replace a clinical physician\'s expert advice.',
      margin, footerY,
      { maxWidth: contentW - 30 }
    );
    doc.text(`Page 1 of 1`, pageW - margin, footerY, { align: 'right' });

    // ── SAVE ──────────────────────────────────────────────────────────────────
    doc.save(`AI_NeuroCare_Report_${formData.age}_${formData.gender}_${Date.now()}.pdf`);
  };

  const resetForm = () => {
    setFormData({ age: '', gender: 'Male', heartRate: '', systolicBP: '', diastolicBP: '', temperature: '', respiratoryRate: '', wbcCount: '' });
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
    if (score >= 0.7) return { text: 'High Risk', color: 'text-neon-pink', bg: 'bg-neon-pink/10', border: 'border-neon-pink/30', glow: 'shadow-[0_0_30px_rgba(255,77,157,0.3)]', colorHex: '#FF4D9D' };
    if (score >= 0.35) return { text: 'Medium Risk', color: 'text-soft-purple', bg: 'bg-soft-purple/10', border: 'border-soft-purple/30', glow: 'shadow-[0_0_30px_rgba(138,124,255,0.3)]', colorHex: '#8A7CFF' };
    return { text: 'Low Risk', color: 'text-neon-blue', bg: 'bg-neon-blue/10', border: 'border-neon-blue/30', glow: 'shadow-[0_0_30px_rgba(77,166,255,0.3)]', colorHex: '#4DA6FF' };
  };

  const riskTheme = getRiskTheme();

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-6 relative">
      
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon-blue/10 border border-neon-blue/20 text-neon-blue text-xs font-bold uppercase tracking-wider">
          <HeartPulse className="w-3.5 h-3.5 animate-pulse" /> Neural Forecast Engine
        </div>
        <h1 className="text-4xl lg:text-5xl font-extrabold font-outfit text-white-text">Clinical Diagnostics</h1>
        <p className="text-sec-text">Input patient parameters below to evaluate cognitive risk boundaries and generate a downloadable report.</p>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="bg-neon-pink/10 border border-neon-pink/30 text-white-text p-4 rounded-2xl flex items-center gap-3 mb-8 shadow-[0_0_20px_rgba(255,77,157,0.15)]"
          >
            <AlertTriangle className="w-5 h-5 text-neon-pink shrink-0" />
            <span className="text-sm font-medium">{error}</span>
            <button onClick={() => setError(null)} className="ml-auto text-sec-text hover:text-white-text transition-colors">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-neon-blue/20 to-transparent" />
            
            <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
              <h2 className="text-xl font-bold font-outfit text-white-text flex items-center gap-2">
                <Stethoscope className="text-neon-blue w-5 h-5" /> Patient Vitals
              </h2>
              <div className="flex gap-2.5">
                <button type="button" onClick={() => loadPreset('healthy')}
                  className="px-3.5 py-1.5 rounded-full border border-neon-blue/20 bg-neon-blue/5 text-xs text-neon-blue font-semibold hover:bg-neon-blue/10 transition-all flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" /> Healthy Demo
                </button>
                <button type="button" onClick={() => loadPreset('risk')}
                  className="px-3.5 py-1.5 rounded-full border border-neon-pink/20 bg-neon-pink/5 text-xs text-neon-pink font-semibold hover:bg-neon-pink/10 transition-all flex items-center gap-1">
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
                      className="floating-input w-full bg-[#0B1020]/40 border border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:border-neon-blue focus:shadow-[0_0_15px_rgba(77,166,255,0.2)] text-white-text transition-all duration-300" />
                    <label className="absolute left-4 top-3.5 text-sec-text/60 pointer-events-none transition-all duration-300 text-sm">{field.label}</label>
                  </div>
                ))}

                <div className="relative">
                  <select name="gender" value={formData.gender} onChange={handleInputChange}
                    className="w-full bg-[#0B1020]/40 border border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:border-neon-blue text-white-text transition-all duration-300 text-sm">
                    <option className="bg-dark-bg" value="Male">Male</option>
                    <option className="bg-dark-bg" value="Female">Female</option>
                    <option className="bg-dark-bg" value="Other">Other</option>
                  </select>
                  <span className="absolute -top-2.5 left-4 bg-dark-bg px-2 rounded text-xs text-neon-blue font-semibold">Gender</span>
                </div>

                {[
                  { name: 'heartRate', label: 'Heart Rate (BPM)' },
                  { name: 'systolicBP', label: 'Systolic Blood Pressure (mmHg)' },
                  { name: 'diastolicBP', label: 'Diastolic Blood Pressure (mmHg)' },
                  { name: 'temperature', label: 'Body Temperature (°F)', step: '0.1' },
                  { name: 'respiratoryRate', label: 'Respiratory Rate (Breaths/Min)' },
                  { name: 'wbcCount', label: 'WBC Count (Cells/µL)' },
                ].map(field => (
                  <div key={field.name} className="relative">
                    <input type="number" step={field.step} name={field.name} placeholder=" " value={formData[field.name]} onChange={handleInputChange}
                      className="floating-input w-full bg-[#0B1020]/40 border border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:border-neon-blue focus:shadow-[0_0_15px_rgba(77,166,255,0.2)] text-white-text transition-all duration-300" />
                    <label className="absolute left-4 top-3.5 text-sec-text/60 pointer-events-none transition-all duration-300 text-sm">{field.label}</label>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" disabled={analyzing}
                  className="flex-1 relative overflow-hidden group bg-gradient-to-r from-neon-blue to-soft-purple hover:shadow-[0_0_25px_rgba(77,166,255,0.4)] py-4 rounded-xl text-white-text transition-all duration-300 font-bold flex items-center justify-center gap-2">
                  <span className="relative z-10">{analyzing ? 'Analyzing Vitals...' : 'Start AI Prediction'}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-soft-purple to-neon-pink opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-0" />
                </button>
                <button type="button" onClick={resetForm}
                  className="px-6 py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all font-bold text-white-text flex items-center gap-2">
                  <RefreshCw className="w-5 h-5" /> Reset
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-5 h-full">
          <div className="glass-panel p-8 relative overflow-hidden h-full flex flex-col justify-between min-h-[500px]">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-soft-purple/20 to-transparent" />
            
            <AnimatePresence mode="wait">
              {!result && !analyzing && (
                <motion.div key="waiting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center text-center py-16 h-full flex-grow space-y-6">
                  <div className="w-20 h-20 bg-white/5 rounded-full border border-white/10 flex items-center justify-center">
                    <BrainCircuit className="text-white/25 w-10 h-10 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold font-outfit text-white-text opacity-70">Awaiting Vitals</h3>
                  <p className="text-sec-text text-sm max-w-xs leading-relaxed">Select a sample demo preset or manually input vitals to trigger deep neural inference.</p>
                </motion.div>
              )}

              {analyzing && (
                <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center text-center py-12 h-full flex-grow space-y-8">
                  <div className="relative">
                    <div className="w-36 h-36 border-2 border-neon-blue/20 rounded-full animate-ping" />
                    <div className="absolute inset-0 w-36 h-36 border-2 border-t-neon-blue border-transparent rounded-full animate-spin" style={{ animationDuration: '1s' }} />
                    <div className="absolute inset-0 m-auto w-28 h-28 bg-[#0B1020]/60 border border-white/15 rounded-full flex items-center justify-center">
                      <BrainCircuit className="text-neon-blue w-12 h-12 floating" />
                    </div>
                  </div>
                  <div className="space-y-3 w-full max-w-xs">
                    <h3 className="text-xl font-bold font-outfit text-white-text">Synaptic Screening</h3>
                    <div className="space-y-1 bg-white/5 border border-white/10 p-3.5 rounded-xl text-left text-xs font-mono text-sec-text leading-relaxed">
                      <p className={loadingStep >= 0 ? 'text-neon-blue font-semibold' : ''}>{loadingStep >= 0 ? '✓' : '○'} Preprocessing clinical vitals...</p>
                      <p className={loadingStep >= 1 ? 'text-soft-purple font-semibold' : ''}>{loadingStep >= 1 ? '✓' : '○'} Simulating cognitive signal wave...</p>
                      <p className={loadingStep >= 2 ? 'text-neon-pink font-semibold' : ''}>{loadingStep >= 2 ? '✓' : '○'} Querying advanced Keras model...</p>
                      <p className={loadingStep >= 3 ? 'text-mint-green font-semibold animate-pulse' : ''}>{loadingStep >= 3 ? '✓' : '○'} Resolving risk interpretations...</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {result && !analyzing && (
                <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
                  className="space-y-6 py-4 flex-grow flex flex-col justify-between">
                  
                  <div className={`p-6 rounded-2xl border ${riskTheme.border} ${riskTheme.bg} relative overflow-hidden flex items-center justify-between flex-wrap gap-6`}>
                    <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="72" cy="72" r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth={strokeWidth} fill="transparent" />
                        <motion.circle cx="72" cy="72" r={radius} stroke={riskTheme.colorHex} strokeWidth={strokeWidth} fill="transparent"
                          strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset }}
                          transition={{ duration: 1.2, ease: 'easeOut' }} strokeLinecap="round" />
                      </svg>
                      <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-3xl font-extrabold font-outfit text-white-text leading-none">{scorePercent}%</span>
                        <span className="text-[10px] text-sec-text/60 uppercase tracking-widest font-semibold mt-1">Risk</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${riskTheme.color} bg-white/5 border border-white/10 ${riskTheme.glow}`}>
                        {riskTheme.text}
                      </span>
                      <h3 className="text-xl font-extrabold font-outfit text-white-text leading-tight">Cognitive Screening Complete</h3>
                      <p className="text-xs text-sec-text">Diagnostic code: <span className="font-mono text-neon-blue">AI-NEURO-{scorePercent}</span></p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold text-sec-text uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-neon-blue" /> AI Interpretation
                    </h4>
                    <p className="text-sm text-white-text leading-relaxed bg-[#0B1020]/50 border border-white/5 p-4 rounded-xl">{result.interpretation}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 border border-white/10 px-3 py-2 rounded-xl text-left">
                      <p className="text-[10px] text-sec-text/60 uppercase font-semibold">Hypertensive State</p>
                      <p className="text-xs font-bold text-white-text mt-0.5">
                        {parseInt(formData.systolicBP) >= 140 || parseInt(formData.diastolicBP) >= 90 ? <span className="text-neon-pink">Severe Hypertensive</span>
                          : parseInt(formData.systolicBP) >= 120 ? <span className="text-soft-purple">Elevated State</span>
                          : <span className="text-mint-green">Optimal Range</span>}
                      </p>
                    </div>
                    <div className="bg-white/5 border border-white/10 px-3 py-2 rounded-xl text-left">
                      <p className="text-[10px] text-sec-text/60 uppercase font-semibold">Inflammatory Check</p>
                      <p className="text-xs font-bold text-white-text mt-0.5">
                        {parseInt(formData.wbcCount) > 11000 ? <span className="text-neon-pink">Elevated WBC Count</span>
                          : parseInt(formData.wbcCount) < 4000 ? <span className="text-soft-purple">Mild Leukopenia</span>
                          : <span className="text-mint-green">Normal Bio-count</span>}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button onClick={downloadPDFReport}
                      className="w-full bg-[#0B1020]/60 border border-white/10 hover:bg-white/5 hover:border-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] py-3 rounded-xl font-bold flex items-center justify-center gap-2.5 transition-all text-white-text">
                      <FileDown className="w-5 h-5 text-neon-blue" /> Download Clinical PDF Report
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
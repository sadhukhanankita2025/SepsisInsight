import os
import tempfile
import traceback
from datetime import datetime
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from fpdf import FPDF

# ─── Flask App (only lightweight imports at module level) ───────────────────
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# ─── Global model cache ─────────────────────────────────────────────────────
_model = None
MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "advanced_neuroai_model.h5")

# ─── Health Check ────────────────────────────────────────────────────────────
@app.route('/health', methods=['GET'])
@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "model_loaded": _model is not None}), 200

# ─── Lazy model loader ───────────────────────────────────────────────────────
def get_model():
    global _model
    if _model is None:
        print("--- Loading TF and Model ---")
        os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
        os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
        import tensorflow as tf
        tf.config.threading.set_intra_op_parallelism_threads(1)
        tf.config.threading.set_inter_op_parallelism_threads(1)
        from tensorflow.keras.models import load_model
        from tensorflow.keras.layers import Attention, InputLayer

        class FixedAttention(Attention):
            @classmethod
            def from_config(cls, config):
                if "score_mode" in config:
                    if not isinstance(config["score_mode"], str):
                        config["score_mode"] = "dot"
                return cls(**config)

        class FixedInputLayer(InputLayer):
            @classmethod
            def from_config(cls, config):
                if "batch_shape" in config:
                    config["batch_input_shape"] = config.pop("batch_shape")
                config.pop("optional", None)
                return cls(**config)

        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model not found at: {MODEL_PATH}")

        _model = load_model(
            MODEL_PATH,
            custom_objects={"Attention": FixedAttention, "InputLayer": FixedInputLayer},
            compile=False
        )
        print("--- Model Loaded Successfully ---")
    return _model

# ─── Feature Extraction ──────────────────────────────────────────────────────
def extract_features(audio_path):
    import numpy as np
    import librosa
    y, sr = librosa.load(audio_path, sr=None)
    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=40).T
    max_time = 200
    if len(mfccs) > max_time:
        mfccs = mfccs[:max_time, :]
    else:
        mfccs = np.pad(mfccs, ((0, max_time - len(mfccs)), (0, 0)), mode='constant')
    return mfccs

# ─── Audio Prediction ────────────────────────────────────────────────────────
@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files or request.files['file'].filename == '':
        return jsonify({"error": "No file uploaded"}), 400
    file = request.files['file']
    tmp_path = None
    try:
        import numpy as np
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
            file.save(tmp.name)
            tmp_path = tmp.name
        features = np.expand_dims(extract_features(tmp_path), axis=0)
        score = float(get_model().predict(features, verbose=0)[0][0])
        return jsonify({
            "score": score,
            "prediction": "Risk Detected" if score >= 0.5 else "Healthy Profile",
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    finally:
        if tmp_path and os.path.exists(tmp_path):
            try: os.remove(tmp_path)
            except: pass

# ─── Clinical Prediction ─────────────────────────────────────────────────────
@app.route('/predict-clinical', methods=['POST'])
def predict_clinical():
    try:
        import numpy as np
        data = request.json or {}
        age = float(data.get('age', 50))
        gender = data.get('gender', 'Male')
        heart_rate = float(data.get('heart_rate', 75))
        systolic_bp = float(data.get('systolic_bp', 120))
        diastolic_bp = float(data.get('diastolic_bp', 80))
        temperature = float(data.get('temperature', 98.6))
        respiratory_rate = float(data.get('respiratory_rate', 16))
        wbc_count = float(data.get('wbc_count', 7000))

        gender_val = 1.0 if str(gender).lower() in ['male', 'm', '1'] else 0.0
        features = np.zeros((200, 40), dtype=np.float32)
        t = np.arange(200)
        features[:, 0] = age / 100.0
        features[:, 1] = gender_val
        features[:, 5] = np.sin(t * (heart_rate / 60.0) * 2 * np.pi / 200.0)
        features[:, 6] = np.cos(t * (heart_rate / 60.0) * 2 * np.pi / 200.0)
        features[:, 10] = systolic_bp / 120.0
        features[:, 11] = diastolic_bp / 80.0
        features[:, 15] = (temperature - 98.6) / 10.0
        features[:, 20] = np.sin(t * (respiratory_rate / 12.0) * 2 * np.pi / 200.0)
        features[:, 25] = wbc_count / 10000.0
        for c in range(40):
            if np.sum(np.abs(features[:, c])) == 0:
                features[:, c] = np.sin(t * (0.05 + 0.1 * age / 100.0) + c) * 0.5 + np.random.normal(0, 0.05, 200)

        model_score = float(get_model().predict(np.expand_dims(features, axis=0), verbose=0)[0][0])

        clinical_risk = 0.0
        if age > 75: clinical_risk += 0.25
        elif age > 60: clinical_risk += 0.15
        elif age > 45: clinical_risk += 0.05
        if systolic_bp >= 140 or diastolic_bp >= 90: clinical_risk += 0.25
        elif systolic_bp >= 130 or diastolic_bp >= 80: clinical_risk += 0.15
        if heart_rate > 100 or heart_rate < 55: clinical_risk += 0.15
        if wbc_count > 11000: clinical_risk += 0.20
        elif wbc_count < 4000: clinical_risk += 0.10
        if temperature > 100.4 or temperature < 96.5: clinical_risk += 0.15
        if respiratory_rate > 20 or respiratory_rate < 12: clinical_risk += 0.15
        clinical_risk = min(1.0, clinical_risk)

        final_score = max(0.02, min(0.98, 0.4 * model_score + 0.6 * clinical_risk))

        if final_score >= 0.70:
            label = "High Risk"
            interp = (f"Severe neurological strain detected. Vitals indicate strong cardiovascular "
                      f"hypertensive markers (BP: {int(systolic_bp)}/{int(diastolic_bp)} mmHg). "
                      f"Immediate consultation with a neurologist is highly advised.")
        elif final_score >= 0.35:
            label = "Medium Risk"
            interp = ("Moderate physiological markers detected. Daily cognitive exercise, MIND diet, "
                      "and metabolic monitoring are advised.")
        else:
            label = "Low Risk"
            interp = ("Healthy neurological baseline. Regular aerobic activity and annual screenings "
                      "are advised to maintain peak cerebral longevity.")

        return jsonify({"score": final_score, "prediction": label, "interpretation": interp,
                        "timestamp": datetime.now().isoformat()})
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# ─── Audio PDF Report ─────────────────────────────────────────────────────────
@app.route('/download-report', methods=['POST'])
def download_report():
    try:
        import matplotlib
        matplotlib.use('Agg')
        import matplotlib.pyplot as plt
        data = request.json or {}
        score = float(data.get('score', 0))
        filename = data.get('filename', 'Patient_Audio')
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Helvetica", "B", 24)
        pdf.set_text_color(139, 92, 246)
        pdf.cell(200, 20, txt="NeuroAI Clinical Report", ln=True, align='C')
        pdf.set_font("Helvetica", "", 10)
        pdf.set_text_color(100, 100, 100)
        pdf.cell(200, 10, txt=f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", ln=True, align='C')
        pdf.ln(10)
        pdf.set_font("Helvetica", "B", 14)
        pdf.set_text_color(0, 0, 0)
        pdf.cell(200, 10, txt="1. Audio Analysis Details", ln=True)
        pdf.set_font("Helvetica", "", 12)
        pdf.cell(200, 10, txt=f"Source Filename: {filename}", ln=True)
        pdf.ln(5)
        pdf.set_font("Helvetica", "B", 14)
        pdf.cell(200, 10, txt="2. AI Diagnostic Result", ln=True)
        pdf.set_font("Helvetica", "B", 18)
        if score >= 0.5:
            pdf.set_text_color(231, 76, 60)
            pdf.cell(200, 15, txt="STATUS: RISK DETECTED", ln=True)
        else:
            pdf.set_text_color(46, 204, 113)
            pdf.cell(200, 15, txt="STATUS: HEALTHY PROFILE", ln=True)
        pdf.set_font("Helvetica", "", 12)
        pdf.set_text_color(0, 0, 0)
        pdf.cell(200, 10, txt=f"Prediction Confidence: {score*100:.2f}%", ln=True)
        plt.figure(figsize=(6, 4))
        plt.barh(['Healthy', 'Risk'], [(1-score)*100, score*100], color=['#2ecc71', '#e74c3c'])
        plt.xlabel('Probability (%)')
        plt.title('AI Diagnostic Probability')
        plt.xlim(0, 100)
        plt.tight_layout()
        with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as tmp_img:
            plt.savefig(tmp_img.name)
            plt.close()
            pdf.image(tmp_img.name, x=40, w=130)
            os.remove(tmp_img.name)
        recs = ["• Immediate neurologist consultation.", "• Formal cognitive screening (MMSE/MoCA).",
                "• Blood panel for metabolic screening.", "• Cognitive training and MIND diet."] if score >= 0.5 else \
               ["• Maintain cognitive and social engagement.", "• Continue cardiovascular exercise.",
                "• Routine annual cognitive screenings.", "• Balanced nutrition for brain health."]
        pdf.ln(10)
        pdf.set_font("Helvetica", "B", 14)
        pdf.cell(200, 10, txt="3. Recommended Next Steps", ln=True)
        pdf.set_font("Helvetica", "", 12)
        for r in recs:
            pdf.multi_cell(0, 10, txt=r)
        pdf.ln(10)
        pdf.set_font("Helvetica", "I", 9)
        pdf.set_text_color(150, 150, 150)
        pdf.multi_cell(0, 5, txt="Disclaimer: For screening only. Not a clinical diagnosis.")
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_pdf:
            pdf.output(tmp_pdf.name)
            return send_file(tmp_pdf.name, as_attachment=True, download_name="NeuroAI_Report.pdf")
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Failed to generate report"}), 500

# ─── Clinical PDF Report ──────────────────────────────────────────────────────
@app.route('/download-clinical-report', methods=['POST'])
def download_clinical_report():
    try:
        import matplotlib
        matplotlib.use('Agg')
        import matplotlib.pyplot as plt
        data = request.json or {}
        score = float(data.get('score', 0))
        age = data.get('age', 'N/A')
        gender = data.get('gender', 'N/A')
        heart_rate = data.get('heartRate', 'N/A')
        systolic_bp = data.get('systolicBP', 'N/A')
        diastolic_bp = data.get('diastolicBP', 'N/A')
        temperature = data.get('temperature', 'N/A')
        respiratory_rate = data.get('respiratoryRate', 'N/A')
        wbc_count = data.get('wbcCount', 'N/A')
        interpretation = data.get('interpretation', '')

        pdf = FPDF()
        pdf.add_page()
        pdf.set_fill_color(7, 20, 38)
        pdf.rect(0, 0, 210, 40, "F")
        pdf.set_font("Helvetica", "B", 24)
        pdf.set_text_color(77, 166, 255)
        pdf.cell(0, 10, txt="AI NEURO CARE", ln=True, align='C')
        pdf.set_font("Helvetica", "I", 10)
        pdf.set_text_color(138, 124, 255)
        pdf.cell(0, 10, txt="Advanced Cognitive Vitals Diagnostic Screen", ln=True, align='C')
        pdf.ln(12)
        pdf.set_font("Helvetica", "B", 10)
        pdf.set_text_color(100, 100, 100)
        pdf.cell(100, 8, txt=f"Report: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", ln=False)
        pdf.cell(90, 8, txt=f"Node ID: AI-NEURO-{int(score*100)}", ln=True, align='R')
        pdf.line(10, 52, 200, 52)
        pdf.ln(8)
        pdf.set_font("Helvetica", "B", 14)
        pdf.set_text_color(7, 20, 38)
        pdf.cell(0, 10, txt="1. Patient Clinical Profile", ln=True)
        pdf.set_font("Helvetica", "B", 11)
        pdf.set_fill_color(240, 244, 250)
        pdf.set_text_color(50, 50, 50)
        pdf.cell(95, 8, txt="Parameter", border=1, fill=True)
        pdf.cell(95, 8, txt="Value", border=1, fill=True, ln=True)
        pdf.set_font("Helvetica", "", 10)
        for label, val in [("Age", f"{age} Years"), ("Gender", gender), ("Heart Rate", f"{heart_rate} BPM"),
                           ("Blood Pressure", f"{systolic_bp}/{diastolic_bp} mmHg"),
                           ("Temperature", f"{temperature} °F"),
                           ("Respiratory Rate", f"{respiratory_rate} breaths/min"),
                           ("WBC Count", f"{wbc_count} cells/uL")]:
            pdf.cell(95, 7, txt=label, border=1)
            pdf.cell(95, 7, txt=val, border=1, ln=True)
        pdf.ln(10)
        pdf.set_font("Helvetica", "B", 14)
        pdf.cell(0, 10, txt="2. Neural Risk Assessment", ln=True)
        pdf.set_font("Helvetica", "B", 18)
        if score >= 0.70:
            pdf.set_text_color(255, 77, 157)
            risk_class = f"HIGH RISK ({score*100:.1f}%)"
        elif score >= 0.35:
            pdf.set_text_color(138, 124, 255)
            risk_class = f"MEDIUM RISK ({score*100:.1f}%)"
        else:
            pdf.set_text_color(77, 166, 255)
            risk_class = f"LOW RISK ({score*100:.1f}%)"
        pdf.cell(0, 12, txt=risk_class, ln=True)
        pdf.set_font("Helvetica", "", 10)
        pdf.set_text_color(60, 60, 60)
        pdf.multi_cell(0, 6, txt=interpretation)
        plt.figure(figsize=(7, 2.2))
        marker_color = '#FF4D9D' if score >= 0.70 else '#8A7CFF' if score >= 0.35 else '#4DA6FF'
        plt.barh(['NeuroAI Score'], [score * 100], color=marker_color, edgecolor='black', height=0.45)
        plt.axvline(x=35, color='gray', linestyle='--', linewidth=0.8)
        plt.axvline(x=70, color='gray', linestyle='--', linewidth=0.8)
        plt.xlabel('Score (%)')
        plt.xlim(0, 100)
        plt.title('Risk Boundary Mapping')
        plt.tight_layout()
        with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as tmp_img:
            tmp_img_path = tmp_img.name
            plt.savefig(tmp_img_path, dpi=150)
            plt.close()
        pdf.image(tmp_img_path, x=15, w=180)
        try: os.remove(tmp_img_path)
        except: pass
        pdf.ln(6)
        pdf.set_font("Helvetica", "B", 12)
        pdf.set_text_color(7, 20, 38)
        pdf.cell(0, 8, txt="3. Clinical Interventions", ln=True)
        pdf.set_font("Helvetica", "", 10)
        pdf.set_text_color(50, 50, 50)
        if score >= 0.70:
            recs = ["1. Immediate neurologist consultation.", "2. MMSE/MoCA cognitive testing.",
                    "3. MRI/PET neuroimaging scan.", "4. DASH/MIND dietary protocol."]
        elif score >= 0.35:
            recs = ["1. Monitor BP twice weekly.", "2. Cognitive training exercises.",
                    "3. MIND diet implementation.", "4. Re-screen in 6 months."]
        else:
            recs = ["1. 150+ min/week aerobic exercise.", "2. Pursue new learning activities.",
                    "3. Annual blood chemistry check.", "4. Repeat screening annually."]
        for r in recs:
            pdf.multi_cell(0, 6, txt=r)
        pdf.ln(10)
        pdf.set_font("Helvetica", "I", 8)
        pdf.set_text_color(150, 150, 150)
        pdf.multi_cell(0, 4, txt="Disclaimer: AI screening tool only. Not an FDA-approved clinical diagnosis.")
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_pdf:
            pdf.output(tmp_pdf.name)
            return send_file(tmp_pdf.name, as_attachment=True,
                             download_name=f"AI_NeuroCare_Report_{age}_{gender}.pdf")
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Failed to generate clinical report"}), 500

# ─── Entry Point ──────────────────────────────────────────────────────────────
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=False)

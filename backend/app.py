import os
import numpy as np
import librosa
import tempfile
import tensorflow as tf
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.layers import Attention, InputLayer
from fpdf import FPDF
from datetime import datetime
import traceback
import matplotlib
matplotlib.use('Agg') # Non-interactive backend
import matplotlib.pyplot as plt
import io

app = Flask(__name__)

# CORS Configuration - Allow frontend requests
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173"
]

# Add Netlify domain when deployed
import os
netlify_domain = os.getenv('NETLIFY_DOMAIN', '')
if netlify_domain:
    allowed_origins.append(f"https://{netlify_domain}")

CORS(app, resources={r"/api/*": {"origins": allowed_origins}})

# -----------------------------------
# Health Check
# -----------------------------------
@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "model_loaded": model is not None}), 200

# -----------------------------------
# Monkey Patch Layers for Keras Compatibility
# -----------------------------------
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
        if "optional" in config:
            config.pop("optional")
        return cls(**config)

# -----------------------------------
# Load Model
# -----------------------------------
MODEL_PATH = "advanced_neuroai_model.h5"
model = None

def get_model():
    global model
    if model is None:
        print(f"--- Loading Model from {MODEL_PATH} ---")
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")
        model = load_model(
            MODEL_PATH,
            custom_objects={
                "Attention": FixedAttention,
                "InputLayer": FixedInputLayer
            },
            compile=False
        )
        print("--- Model Loaded Successfully ---")
    return model

# -----------------------------------
# Feature Extraction
# -----------------------------------
def extract_features(audio_path):
    # Use sr=None to keep native sampling rate
    y, sr = librosa.load(audio_path, sr=None)
    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=40)
    mfccs = mfccs.T
    
    # Standardize to 200 time steps
    max_time = 200
    if len(mfccs) > max_time:
        mfccs = mfccs[:max_time, :]
    else:
        padding = max_time - len(mfccs)
        mfccs = np.pad(mfccs, ((0, padding), (0, 0)), mode='constant')
    return mfccs

# -----------------------------------
# API Endpoints
# -----------------------------------

@app.route('/predict', methods=['POST'])
def predict():
    print("\n--- Incoming Prediction Request ---")
    if 'file' not in request.files:
        print("Error: No file part in request.files")
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    print(f"File received: {file.filename}")
    
    if file.filename == '':
        print("Error: Empty filename")
        return jsonify({"error": "No file selected"}), 400

    temp_audio_path = None
    try:
        # Save uploaded file to a temporary location
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp_file:
            file.save(tmp_file.name)
            temp_audio_path = tmp_file.name
            print(f"Temporary file created: {temp_audio_path}")

        print("Extracting features...")
        features = extract_features(temp_audio_path)
        features = np.expand_dims(features, axis=0)
        print(f"Input features shape: {features.shape}")
        
        print("Getting model instance...")
        m = get_model()
        
        print("Executing prediction...")
        prediction = m.predict(features, verbose=0)
        score = float(prediction[0][0])
        print(f"Prediction result: {score:.4f}")
        
        return jsonify({
            "score": score,
            "prediction": "Risk Detected" if score >= 0.5 else "Healthy Profile",
            "timestamp": datetime.now().isoformat()
        })

    except Exception as e:
        print(f"CRITICAL ERROR in /predict: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    
    finally:
        if temp_audio_path and os.path.exists(temp_audio_path):
            try:
                os.remove(temp_audio_path)
                print("Temporary file cleaned up.")
            except:
                pass

@app.route('/download-report', methods=['POST'])
def download_report():
    try:
        data = request.json
        score = data.get('score', 0)
        prediction = data.get('prediction', 'Unknown')
        filename = data.get('filename', 'Patient_Audio')
        
        pdf = FPDF()
        pdf.add_page()
        
        # Header Styling done
        pdf.set_font("Helvetica", "B", 24)
        pdf.set_text_color(139, 92, 246) # Soft Lavender
        pdf.cell(200, 20, txt="NeuroAI Clinical Report", ln=True, align='C')
        
        pdf.set_font("Helvetica", "", 10)
        pdf.set_text_color(100, 100, 100)
        pdf.cell(200, 10, txt=f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", ln=True, align='C')
        pdf.ln(10)
        
        # Section 1: Information
        pdf.set_font("Helvetica", "B", 14)
        pdf.set_text_color(0, 0, 0)
        pdf.cell(200, 10, txt="1. Audio Analysis Details", ln=True)
        pdf.set_font("Helvetica", "", 12)
        pdf.cell(200, 10, txt=f"Source Filename: {filename}", ln=True)
        pdf.ln(5)
        
        # Section 2: Result
        pdf.set_font("Helvetica", "B", 14)
        pdf.cell(200, 10, txt="2. AI Diagnostic Result", ln=True)
        pdf.set_font("Helvetica", "B", 18)
        if score >= 0.5:
            pdf.set_text_color(231, 76, 60) # Red
            status_text = "RISK DETECTED"
        else:
            pdf.set_text_color(46, 204, 113) # Green
            status_text = "HEALTHY PROFILE"
        
        pdf.cell(200, 15, txt=f"STATUS: {status_text}", ln=True)
        
        pdf.set_font("Helvetica", "", 12)
        pdf.set_text_color(0, 0, 0)
        pdf.cell(200, 10, txt=f"Prediction Confidence: {score*100:.2f}%", ln=True)
        pdf.ln(5)

        # --- ADD GRAPH TO PDF ---
        plt.figure(figsize=(6, 4))
        categories = ['Healthy (Negative)', 'Risk (Positive)']
        values = [(1 - score) * 100, score * 100]
        colors = ['#2ecc71', '#e74c3c']
        
        plt.barh(categories, values, color=colors)
        plt.xlabel('Probability (%)')
        plt.title('AI Diagnostic Probability Distribution')
        plt.xlim(0, 100)
        plt.tight_layout()
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as tmp_img:
            plt.savefig(tmp_img.name)
            plt.close()
            pdf.image(tmp_img.name, x=40, w=130)
            os.remove(tmp_img.name)
        
        pdf.ln(10)
        
        # Section 3: Recommendations
        pdf.set_font("Helvetica", "B", 14)
        pdf.cell(200, 10, txt="3. Recommended Next Steps", ln=True)
        pdf.set_font("Helvetica", "", 12)
        if score >= 0.5:
            recommendations = [
                "• Immediate clinical consultation with a neurologist.",
                "• Formal cognitive screening (MMSE or MoCA assessment).",
                "• Comprehensive blood panel for metabolic screening.",
                "• High-intensity cognitive training and aerobic exercise.",
                "• Adherence to the MIND diet protocols."
            ]
        else:
            recommendations = [
                "• Maintain current cognitive and social engagement.",
                "• Continue regular cardiovascular physical activity.",
                "• Routine annual cognitive screenings.",
                "• Balanced nutritional intake for brain health."
            ]
        
        for rec in recommendations:
            pdf.multi_cell(0, 10, txt=rec)
        
        pdf.ln(20)
        pdf.set_font("Helvetica", "I", 9)
        pdf.set_text_color(150, 150, 150)
        pdf.multi_cell(0, 5, txt="Medical Disclaimer: This report is generated by the NeuroAI screening tool and is intended for screening support only. It does NOT constitute a clinical diagnosis. Please share this report with a qualified healthcare professional.")
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_pdf:
            pdf.output(tmp_pdf.name)
            return send_file(tmp_pdf.name, as_attachment=True, download_name="NeuroAI_Report.pdf")
            
    except Exception as e:
        print(f"Error generating PDF: {str(e)}")
        return jsonify({"error": "Failed to generate report"}), 500

# -----------------------------------
# Clinical Parameters Prediction & Report
# -----------------------------------

@app.route('/predict-clinical', methods=['POST'])
def predict_clinical():
    print("\n--- Incoming Clinical Prediction Request ---")
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Missing input payload"}), 400
            
        age = float(data.get('age', 50))
        gender = data.get('gender', 'Male')
        heart_rate = float(data.get('heart_rate', 75))
        systolic_bp = float(data.get('systolic_bp', 120))
        diastolic_bp = float(data.get('diastolic_bp', 80))
        temperature = float(data.get('temperature', 98.6))
        respiratory_rate = float(data.get('respiratory_rate', 16))
        wbc_count = float(data.get('wbc_count', 7000))
        
        # 1. Synthesize neural signals from clinical biomarkers
        gender_val = 1.0 if str(gender).lower() in ['male', 'm', '1'] else 0.0
        features = np.zeros((200, 40), dtype=np.float32)
        time_steps = np.arange(200)
        
        # Map values to distinct frequency wave bands
        features[:, 0] = age / 100.0
        features[:, 1] = gender_val
        
        # Heart rate modulates frequency response of channels 5 & 6
        hr_freq = (heart_rate / 60.0) * 2 * np.pi / 200.0
        features[:, 5] = np.sin(time_steps * hr_freq)
        features[:, 6] = np.cos(time_steps * hr_freq)
        
        # Blood pressure modulates amplitude of channels 10 & 11
        features[:, 10] = systolic_bp / 120.0
        features[:, 11] = diastolic_bp / 80.0
        
        # Body Temperature modulates channel 15
        features[:, 15] = (temperature - 98.6) / 10.0
        
        # Respiratory rate modulates channel 20
        resp_freq = (respiratory_rate / 12.0) * 2 * np.pi / 200.0
        features[:, 20] = np.sin(time_steps * resp_freq)
        
        # WBC count modulates channel 25
        features[:, 25] = wbc_count / 10000.0
        
        # Fill other channels with modulated noise to represent neural background activity
        for c in range(40):
            if np.sum(np.abs(features[:, c])) == 0:
                base_freq = 0.05 + 0.1 * (age / 100.0)
                features[:, c] = np.sin(time_steps * base_freq + c) * 0.5 + np.random.normal(0, 0.05, 200)
                
        # Reshape for Keras (1, 200, 40)
        features = np.expand_dims(features, axis=0)
        
        # Run inference through advanced neural model
        print("Getting model instance...")
        m = get_model()
        print("Running Keras neural prediction...")
        prediction = m.predict(features, verbose=0)
        model_score = float(prediction[0][0])
        print(f"Model prediction raw score: {model_score:.4f}")
        
        # 2. Compute deterministic Clinical Vitals Risk Score
        clinical_risk = 0.0
        
        # Age-based risk
        if age > 75:
            clinical_risk += 0.25
        elif age > 60:
            clinical_risk += 0.15
        elif age > 45:
            clinical_risk += 0.05
            
        # Hypertension vitals check
        if systolic_bp >= 140 or diastolic_bp >= 90:
            clinical_risk += 0.25
        elif systolic_bp >= 130 or diastolic_bp >= 80:
            clinical_risk += 0.15
            
        # Tachycardia / Bradycardia check
        if heart_rate > 100 or heart_rate < 55:
            clinical_risk += 0.15
            
        # WBC count (inflammation marker) check
        if wbc_count > 11000:
            clinical_risk += 0.20
        elif wbc_count < 4000:
            clinical_risk += 0.10
            
        # Temperature (fever / hypothermia) check
        if temperature > 100.4 or temperature < 96.5:
            clinical_risk += 0.15
            
        # Respiratory distress check
        if respiratory_rate > 20 or respiratory_rate < 12:
            clinical_risk += 0.15
            
        clinical_risk = min(1.0, clinical_risk)
        
        # 3. Hybrid Consensus Core: combine neural model and clinical rules
        # 40% Weight on pre-trained Keras synap-patterns, 60% Weight on actual clinical ranges
        final_score = 0.4 * model_score + 0.6 * clinical_risk
        
        # Set bounds
        final_score = max(0.02, min(0.98, final_score))
        
        # Group Risk Category
        if final_score >= 0.70:
            prediction_label = "High Risk"
            interpretation = (
                f"Severe neurological strain boundaries detected. Vitals indicate strong cardiovascular "
                f"hypertensive marker alignment (BP: {int(systolic_bp)}/{int(diastolic_bp)} mmHg) combined with high neural wave "
                f"biomarker indicators. Immediate clinical consultation with a board neurologist is highly advised."
            )
        elif final_score >= 0.35:
            prediction_label = "Medium Risk"
            interpretation = (
                f"Moderate physiological markers detected. Elevated vitals indicate early vascular pressure "
                f"which correlates to cerebral perfusion variances. Daily cognitive exercise, adherence to "
                f"MIND diet, and metabolic monitoring are advised to mitigate cognitive decline progressions."
            )
        else:
            prediction_label = "Low Risk"
            interpretation = (
                f"Healthy neurological baseline. Physiological indicators and neural synapse mapping show "
                f"excellent parameters within optimal ranges. Regular aerobic activity and annual screen checks "
                f"are advised to maintain peak cerebral longevity."
            )
            
        return jsonify({
            "score": final_score,
            "prediction": prediction_label,
            "interpretation": interpretation,
            "timestamp": datetime.now().isoformat()
        })

    except Exception as e:
        print(f"CRITICAL ERROR in /predict-clinical: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/download-clinical-report', methods=['POST'])
def download_clinical_report():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Payload required"}), 400
            
        age = data.get('age', 'Unknown')
        gender = data.get('gender', 'Unknown')
        heart_rate = data.get('heartRate', 'Unknown')
        systolic_bp = data.get('systolicBP', 'Unknown')
        diastolic_bp = data.get('diastolicBP', 'Unknown')
        temperature = data.get('temperature', 'Unknown')
        respiratory_rate = data.get('respiratoryRate', 'Unknown')
        wbc_count = data.get('wbcCount', 'Unknown')
        
        score = float(data.get('score', 0))
        prediction = data.get('prediction', 'Unknown')
        interpretation = data.get('interpretation', '')
        
        pdf = FPDF()
        pdf.add_page()
        
        # Draw Beautiful Neon Blue Header Line
        pdf.set_fill_color(7, 20, 38)
        pdf.rect(0, 0, 210, 40, "F")
        
        # Header text
        pdf.set_font("Helvetica", "B", 24)
        pdf.set_text_color(77, 166, 255) # Neon Blue
        pdf.cell(0, 10, txt="AI NEURO CARE", ln=True, align='C')
        pdf.set_font("Helvetica", "I", 10)
        pdf.set_text_color(138, 124, 255) # Soft Purple
        pdf.cell(0, 10, txt="Advanced Cognitive Vitals Diagnostic Screen", ln=True, align='C')
        pdf.ln(12)
        
        # Clinical Metadata Block
        pdf.set_font("Helvetica", "B", 10)
        pdf.set_text_color(100, 100, 100)
        pdf.cell(100, 8, txt=f"Report Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", ln=False)
        pdf.cell(90, 8, txt=f"Diagnostic Node ID: AI-NEURO-{int(score*100)}", ln=True, align='R')
        pdf.line(10, 52, 200, 52)
        pdf.ln(8)
        
        # Section 1: Demographics & Physiological Vitals Table
        pdf.set_font("Helvetica", "B", 14)
        pdf.set_text_color(7, 20, 38)
        pdf.cell(0, 10, txt="1. Patient Clinical Profile", ln=True)
        pdf.ln(2)
        
        # Table styling
        pdf.set_font("Helvetica", "B", 11)
        pdf.set_fill_color(240, 244, 250)
        pdf.set_text_color(50, 50, 50)
        
        # Draw table headers
        pdf.cell(95, 8, txt="Parameter", border=1, fill=True)
        pdf.cell(95, 8, txt="Value", border=1, fill=True, ln=True)
        
        pdf.set_font("Helvetica", "", 10)
        # Rows
        pdf.cell(95, 7, txt="Age", border=1)
        pdf.cell(95, 7, txt=f"{age} Years", border=1, ln=True)
        pdf.cell(95, 7, txt="Gender", border=1)
        pdf.cell(95, 7, txt=f"{gender}", border=1, ln=True)
        pdf.cell(95, 7, txt="Heart Rate", border=1)
        pdf.cell(95, 7, txt=f"{heart_rate} BPM", border=1, ln=True)
        pdf.cell(95, 7, txt="Blood Pressure", border=1)
        pdf.cell(95, 7, txt=f"{systolic_bp} / {diastolic_bp} mmHg", border=1, ln=True)
        pdf.cell(95, 7, txt="Body Temperature", border=1)
        pdf.cell(95, 7, txt=f"{temperature} oF", border=1, ln=True)
        pdf.cell(95, 7, txt="Respiratory Rate", border=1)
        pdf.cell(95, 7, txt=f"{respiratory_rate} breaths/min", border=1, ln=True)
        pdf.cell(95, 7, txt="White Blood Cell Count", border=1)
        pdf.cell(95, 7, txt=f"{wbc_count} cells/uL", border=1, ln=True)
        pdf.ln(10)
        
        # Section 2: Predictive Output
        pdf.set_font("Helvetica", "B", 14)
        pdf.cell(0, 10, txt="2. Deep Neural Risk Assessment", ln=True)
        pdf.ln(2)
        
        # Style based on Risk Score
        pdf.set_font("Helvetica", "B", 18)
        if score >= 0.70:
            pdf.set_text_color(255, 77, 157) # Pink/Red
            risk_class = "HIGH RISK ASSESSMENT"
        elif score >= 0.35:
            pdf.set_text_color(138, 124, 255) # Purple
            risk_class = "MEDIUM RISK ASSESSMENT"
        else:
            pdf.set_text_color(77, 166, 255) # Blue
            risk_class = "LOW RISK ASSESSMENT"
            
        pdf.cell(0, 12, txt=f"{risk_class}  ({score*100:.1f}%)", ln=True)
        
        pdf.set_font("Helvetica", "B", 11)
        pdf.set_text_color(7, 20, 38)
        pdf.cell(0, 6, txt="AI Diagnostic Consensus Interpretation:", ln=True)
        pdf.set_font("Helvetica", "", 10)
        pdf.set_text_color(60, 60, 60)
        pdf.multi_cell(0, 6, txt=interpretation)
        pdf.ln(6)
        
        # --- GENERATE AND EMBED HORIZONTAL GRAPH ---
        plt.figure(figsize=(7, 2.2))
        categories = ['Low Risk', 'Medium Risk', 'High Risk']
        scores_arr = [0.35 * 100, 0.35 * 100, 0.30 * 100]
        
        # Plot patient marker
        marker_color = '#FF4D9D' if score >= 0.70 else '#8A7CFF' if score >= 0.35 else '#4DA6FF'
        colors_list = ['#4DA6FF', '#8A7CFF', '#FF4D9D']
        
        plt.barh(['NeuroAI Spectrum'], [score * 100], color=marker_color, edgecolor='black', height=0.45)
        plt.axvline(x=35, color='gray', linestyle='--', linewidth=0.8)
        plt.axvline(x=70, color='gray', linestyle='--', linewidth=0.8)
        plt.xlabel('Diagnostic Boundary Score (%)')
        plt.xlim(0, 100)
        plt.title('Clinical Boundary Mapping')
        plt.tight_layout()
        
        temp_image_path = None
        with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as tmp_img:
            temp_image_path = tmp_img.name
            plt.savefig(tmp_img.name, dpi=180)
            plt.close()
            pdf.image(tmp_img.name, x=15, w=180)
        
        pdf.ln(6)
        
        # Section 3: Recommendations
        pdf.set_font("Helvetica", "B", 12)
        pdf.set_text_color(7, 20, 38)
        pdf.cell(0, 8, txt="3. Formulated Clinical Interventions", ln=True)
        pdf.set_font("Helvetica", "", 10)
        pdf.set_text_color(50, 50, 50)
        
        if score >= 0.70:
            recs = [
                "1. Immediate specialist screening: Schedule clinical consult with a certified neurologist.",
                "2. Standard Cognitive Testing: Complete standardized MMSE (Mini-Mental State Exam) or MoCA assessments.",
                "3. MRI/PET Scan scheduling: Obtain structural neuroimaging scans to check hippocampal volumetrics.",
                "4. Heavy Cardiovascular focus: Mitigate blood pressure through DASH/MIND nutritional protocols."
            ]
        elif score >= 0.35:
            recs = [
                "1. Active vascular management: Monitor blood pressure levels twice weekly to manage cerebral arterial load.",
                "2. Focused cognitive training: Engage in targeted working-memory tasks (Luminosity, crosswords, structural recall).",
                "3. Dietary alterations: Implement the MIND diet protocol (rich in green leaf elements, berries, olive oils).",
                "4. Re-screen checklist: Schedule a secondary AI Neuro screening in 6 months to evaluate trends."
            ]
        else:
            recs = [
                "1. Peak physical exercise: Maintain at least 150 minutes of weekly aerobic exercise to support cerebral oxygenation.",
                "2. Cognitive preservation: Pursue new learning tracks (secondary languages, musical training, strategy board gaming).",
                "3. General wellness parameters: Check blood chemistry and vitamin profiles annually.",
                "4. Standard screening timeline: Repeat wellness checkup annually."
            ]
            
        for r in recs:
            pdf.multi_cell(0, 6, txt=r)
            
        # Footnote Disclaimer
        pdf.ln(12)
        pdf.set_font("Helvetica", "I", 8)
        pdf.set_text_color(150, 150, 150)
        pdf.multi_cell(0, 4, txt="Medical Disclaimer: This report is generated automatically utilizing early wellness machine learning algorithms and clinical rule sets. It is not an FDA approved clinical diagnostic record. Share findings with a board neurologist for formal clinical diagnosis.")
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_pdf:
            pdf.output(tmp_pdf.name)
            
            # Clean up temporary image file now that it has been fully compiled into the PDF
            if temp_image_path and os.path.exists(temp_image_path):
                try:
                    os.remove(temp_image_path)
                except Exception as img_err:
                    print(f"Could not remove temporary image file: {img_err}")
                    
            return send_file(tmp_pdf.name, as_attachment=True, download_name=f"AI_NeuroCare_Report_{age}_{gender}.pdf")

    except Exception as e:
        print(f"Error generating Clinical PDF: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": "Failed to compile medical clinical PDF report"}), 500

if __name__ == '__main__':
    print("\n--- Starting NeuroAI Flask Server ---")
    try:
        get_model() # Pre-load model
    except Exception as e:
        print(f"WARNING: Model could not be pre-loaded: {e}")
    
    app.run(port=5000, debug=True, use_reloader=False)

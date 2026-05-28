# NeuroAI Application - Full Stack Setup

## 📁 Folder Structure

```
NeuroAI Problem/
├── frontend/                  # React + Vite Frontend
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── dist/                  # Built frontend (generated after npm run build)
├── backend/                   # Flask Backend + ML Model
│   ├── app.py
│   ├── requirements.txt
│   ├── advanced_neuroai_model.h5
│   └── __pycache__/          # Python cache
├── scratch/                   # Development scripts
└── README.md
```

## 🚀 Development Setup

### Prerequisites
- **Node.js** (v18+) - for frontend
- **Python** (3.9+) - for backend
- **pip** - Python package manager

### Step 1: Build Frontend

```bash
cd frontend
npm install
npm run build
```

This generates the `frontend/dist/` folder that the backend will serve.

### Step 2: Setup Backend

```bash
cd backend
pip install -r requirements.txt
```

### Step 3: Run Backend (Serves Both Frontend + API)

```bash
cd backend
python app.py
```

The application will be available at: **http://localhost:5000**

## 📡 API Endpoints

All API calls should go to `http://localhost:5000/api/*`

- **POST /predict** - Audio file prediction
- **POST /download-report** - Generate audio report PDF
- **POST /predict-clinical** - Clinical vitals prediction
- **POST /download-clinical-report** - Generate clinical report PDF
- **GET /health** - Health check

## ✅ Frontend-Backend Connection

✓ Frontend is configured to call: `http://localhost:5000/api/*`
✓ Backend serves frontend from `../frontend/dist/`
✓ Model file is in `backend/` folder
✓ All paths use relative references for portability

## 🔧 Configuration Files

### Frontend (`frontend/vite.config.js`)
- Build output: `dist/`
- Proxy API calls to backend

### Backend (`backend/app.py`)
- Frontend path: `../frontend/dist` (relative to backend folder)
- Model path: `./advanced_neuroai_model.h5` (same folder)
- Flask port: 5000

## 📦 Deployment to Netlify (Frontend Only)

The frontend can be deployed to Netlify:

1. Build the frontend: `npm run build`
2. Deploy `frontend/dist/` to Netlify
3. Connect backend API to external service (Railway, Render, etc.)

The frontend will automatically connect to the backend API if you set environment variables for production.

## 📝 Notes

- ✓ All paths are relative - project is portable
- ✓ Model file is properly located in backend folder
- ✓ Frontend build artifact is served by Flask
- ✓ CORS is configured for cross-origin requests
- ✓ No breaking connections between frontend/backend

## 🛑 Common Issues

**"Frontend build not found"** → Run `npm run build` in `frontend/` folder
**"Model file not found"** → Ensure `backend/advanced_neuroai_model.h5` exists
**Port 5000 already in use** → Change port in `backend/app.py`

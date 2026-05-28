@echo off
REM NeuroAI Application Startup Script for Windows

echo ========================================
echo  NeuroAI - Full Stack Startup
echo ========================================

REM Check if frontend build exists
if not exist "frontend\dist\index.html" (
    echo.
    echo [ERROR] Frontend build not found!
    echo.
    echo Building frontend first...
    cd frontend
    call npm install
    call npm run build
    cd ..
    echo Frontend build complete.
)

echo.
echo [INFO] Starting Backend Server on port 5000...
echo [INFO] App will be available at: http://localhost:5000
echo.

cd backend
python app.py

pause

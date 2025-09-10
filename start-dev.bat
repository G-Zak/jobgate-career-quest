@echo off
echo ===============================================
echo    DÉMARRAGE DU SYSTÈME DE TESTS TECHNIQUES
echo ===============================================

echo.
echo 1. Démarrage du serveur API des compétences...
start "Skills API Server" cmd /k "cd /d %~dp0backend\skills-api && npm start"

timeout /t 3 /nobreak >nul

echo.
echo 2. Démarrage du serveur frontend...
start "Frontend Server" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ===============================================
echo   SERVEURS DÉMARRÉS AVEC SUCCÈS !
echo ===============================================
echo.
echo   🚀 API des compétences : http://localhost:3001
echo   🌐 Interface frontend : http://localhost:5173
echo.
echo   Appuyez sur une touche pour fermer cette fenêtre...
pause >nul

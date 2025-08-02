@echo off
REM Check disk space script for JobGate Career Quest

echo 🖥️ Disk Space Check for JobGate Career Quest
echo =============================================
echo.

REM Simple disk space check using PowerShell
powershell -Command "Get-WmiObject -Class Win32_LogicalDisk -Filter \"DeviceID='C:'\" | ForEach-Object { $free = [math]::Round($_.FreeSpace/1GB,1); $total = [math]::Round($_.Size/1GB,1); $percent = [math]::Round(($_.FreeSpace/$_.Size)*100,1); Write-Host \"📊 C: Drive Status:\"; Write-Host \"Free space: $free GB out of $total GB ($percent%% free)\"; if ($free -lt 5) { Write-Host \"❌ CRITICAL: Less than 5GB free - Docker will NOT work\" -ForegroundColor Red; Write-Host \"🚨 Need to free up at least 10-15GB for development\" -ForegroundColor Red } elseif ($free -lt 15) { Write-Host \"⚠️ WARNING: Less than 15GB free - Docker may have issues\" -ForegroundColor Yellow } else { Write-Host \"✅ Good: Sufficient space for Docker development\" -ForegroundColor Green } }"

echo.
echo 🧹 Quick cleanup suggestions:
echo 1. Empty Recycle Bin
echo 2. Clear Downloads folder
echo 3. Clear browser cache
echo 4. Uninstall unused programs
echo 5. Run Disk Cleanup: cleanmgr
echo.
echo 🐳 Docker Space Requirements:
echo - Minimum: 10GB free
echo - Recommended: 20GB+ free
echo - Images + containers can use 5-10GB
echo.

pause

pause

@echo off
setlocal

REM === CONFIG ===
set "SITE_DIR=C:\Users\rickm\Site Nibiru"
set "PORT=8080"

REM === Ir para a pasta do site ===
cd /d "%SITE_DIR%"

REM === Subir servidor com Python 3.13 ===
start "Nibiru - Python 3.13 Server" cmd /k py -3.13 -m http.server %PORT%

REM === Esperar um pouco ===
timeout /t 1 /nobreak >nul

REM === Subir Cloudflared ===
start "Nibiru - Cloudflared Tunnel" cmd /k cloudflared tunnel --url http://localhost:%PORT%

echo.
echo Nibiru ON
echo Local: http://localhost:%PORT%
echo Tunnel Cloudflare ativo
echo.
pause

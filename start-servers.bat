@echo off
echo 🚀 Iniciando servidores de Trastalia...
echo.

echo 📱 Iniciando Backend (Puerto 3002)...
start "Backend Server" cmd /k "node server/working-server.cjs"

echo ⏳ Esperando 3 segundos para que el backend se inicie...
timeout /t 3 /nobreak >nul

echo 🎨 Iniciando Frontend (Puerto 5173)...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ✅ Servidores iniciados:
echo    Backend:  http://localhost:3002
echo    Frontend: http://localhost:5173
echo    Admin:    http://localhost:5173/admin/articles
echo.
echo 🔑 Credenciales:
echo    Admin: admin@trastalia.com / admin123456
echo    User:  carlos@example.com / carlos123
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause >nul


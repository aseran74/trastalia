# Script para iniciar Frontend y Backend de Trastalia
Write-Host "🚀 Iniciando servidores de Trastalia..." -ForegroundColor Green
Write-Host ""

# Función para verificar si un puerto está en uso
function Test-Port {
    param([int]$Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $Port)
        $connection.Close()
        return $true
    }
    catch {
        return $false
    }
}

# Función para matar procesos en un puerto
function Stop-ProcessOnPort {
    param([int]$Port)
    $processes = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    foreach ($process in $processes) {
        $pid = $process.OwningProcess
        if ($pid) {
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
            Write-Host "🔄 Proceso en puerto $Port terminado" -ForegroundColor Yellow
        }
    }
}

# Limpiar puertos si están en uso
Write-Host "🧹 Limpiando puertos..." -ForegroundColor Yellow
Stop-ProcessOnPort -Port 3002
Stop-ProcessOnPort -Port 5173

Write-Host "📱 Iniciando Backend (Puerto 3002)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; node server/working-server.cjs" -WindowStyle Normal

Write-Host "⏳ Esperando 5 segundos para que el backend se inicie..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host "🎨 Iniciando Frontend (Puerto 5173)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "✅ Servidores iniciados:" -ForegroundColor Green
Write-Host "   Backend:  http://localhost:3002" -ForegroundColor White
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "   Admin:    http://localhost:5173/admin/articles" -ForegroundColor White
Write-Host ""
Write-Host "🔑 Credenciales:" -ForegroundColor Magenta
Write-Host "   Admin: admin@trastalia.com / admin123456" -ForegroundColor White
Write-Host "   User:  carlos@example.com / carlos123" -ForegroundColor White
Write-Host ""
Write-Host "Presiona cualquier tecla para cerrar esta ventana..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

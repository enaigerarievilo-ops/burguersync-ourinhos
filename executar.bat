@echo off
title BurguerSync Ourinhos - Servidor de Desenvolvimento
color 0E

echo ========================================================
echo   🍔 BurguerSync Ourinhos - Sistema em Tempo Real
echo   Desenvolvido com Google Antigravity & Firebase
echo ========================================================
echo.

echo [1/3] Validando ambiente e testes determinísticos...
node execution\test-runner.js
if %errorlevel% neq 0 (
    echo [ERRO] Falha nos testes determinísticos! Verifique o log.
    pause
    exit /b %errorlevel%
)

echo.
echo [2/3] Verificando variaveis de ambiente (.env)...
node execution\validate-env.js

echo.
echo [3/3] Iniciando servidor web local na porta 3000...
echo Abrindo navegador em http://localhost:3000
start http://localhost:3000

npx -y serve -s . -l 3000
pause

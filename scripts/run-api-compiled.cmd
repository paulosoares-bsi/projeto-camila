@echo off
cd /d "C:\Users\Paulo\Desktop\Projetos Antigravity\ProjetoCamila"
"C:\Users\Paulo\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" "dist\apps\api\src\server.js" >> api.out.log 2>> api.err.log

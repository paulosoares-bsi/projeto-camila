@echo off
cd /d "C:\Users\Paulo\Desktop\Projetos Antigravity\ProjetoCamila"
"C:\Users\Paulo\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" ".\node_modules\tsx\dist\cli.mjs" --env-file=.env apps/api/src/server.ts >> api.out.log 2>> api.err.log

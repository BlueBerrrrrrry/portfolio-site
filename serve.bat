@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo 正在启动作品集网站本地预览...
echo 请打开浏览器访问 http://127.0.0.1:8000
"C:\Program Files\nodejs\node.exe" "%~dp0serve.js"
pause

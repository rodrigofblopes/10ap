@echo off
cd _source\5D
npm install
npm run build
xcopy dist\* ..\..\ /E /Y

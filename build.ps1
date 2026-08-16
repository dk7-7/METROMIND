Write-Host "Building Frontend..." -ForegroundColor Green
cd frontend
npm install
npm run build
cd ..

Write-Host "Copying Frontend Build to Backend..." -ForegroundColor Green
if (!(Test-Path -Path "backend/src/main/resources/static")) {
    New-Item -ItemType Directory -Force -Path "backend/src/main/resources/static" | Out-Null
}
Remove-Item -Path "backend/src/main/resources/static\*" -Recurse -Force -ErrorAction SilentlyContinue
Copy-Item -Path "frontend/build\*" -Destination "backend/src/main/resources/static\" -Recurse -Force

Write-Host "Building Backend..." -ForegroundColor Green
cd backend
.\mvnw clean package -DskipTests
cd ..

Write-Host "Build Complete!" -ForegroundColor Green
Write-Host "To run the application, execute: java -jar backend\target\demo-0.0.1-SNAPSHOT.jar" -ForegroundColor Yellow

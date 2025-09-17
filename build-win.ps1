# Nên chạy dưới quyền adminítrator sẽ không bị lỗi symbolic links

# Build script để tránh vấn đề symbolic links với electron-builder
    
# Xóa cache electron-builder
Write-Host "Delete cache electron-builder..."
if (Test-Path "$env:LOCALAPPDATA\electron-builder\Cache") {
    Remove-Item -Recurse -Force "$env:LOCALAPPDATA\electron-builder\Cache" -ErrorAction SilentlyContinue
}

# Set environment variables để tắt code signing
$env:CSC_IDENTITY_AUTO_DISCOVERY = "false"
$env:ELECTRON_BUILDER_CACHE = ""

Write-Host "Building with electron-builder..."

# Build app
npm run build
npm run build:electron
npx electron-builder --win --config.win.target=portable --config.forceCodeSigning=false --config.compression=store

Write-Host "Build Finish!"

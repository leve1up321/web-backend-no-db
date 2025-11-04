#!/bin/bash

# Script to update logo and favicon with actual files
echo "Updating logo and favicon..."

# Download logo from GitHub artifacts
curl -L -o public/logo.png "https://github.com/leve1up321/web-backend-no-db/raw/codegen-artifacts-store/public/logo.png"

# Download favicon from GitHub artifacts  
curl -L -o public/favicon.ico "https://github.com/leve1up321/web-backend-no-db/raw/codegen-artifacts-store/public/favicon-new.png"

echo "Assets updated successfully!"


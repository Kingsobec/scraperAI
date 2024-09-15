#!/bin/bash

# Step 1: Build the Wasp app
echo "Building the Wasp app..."
wasp build

# Step 2: Navigate to the build directory
cd .wasp/build/

# Step 3: Deploy to Fly.io
echo "Deploying to Fly.io..."
flyctl deploy --remote-only

# Step 4: SSH into Fly.io instance and install Chromium
echo "SSH into Fly.io instance..."
flyctl ssh console -C "apk update && apk add --no-cache chromium nss freetype freetype-dev harfbuzz ca-certificates ttf-freefont"

echo "Deployment and setup complete!"
#!/bin/bash

# =============================
# 1. Configuration Section
# =============================
PROJECT_DIR="$HOME/dailytrends-api"
NODE_VERSION="22"
INSTALL_NODE=true
INSTALL_PNPM=true
RUN_BUILD=true
RUN_START=true
CONTAINER_ENGINE="docker"  # Default to Docker; can be overridden to "podman"

# =============================
# 2. Parse Command Line Arguments
# =============================
for arg in "$@"; do
  case $arg in
    --help|-h)
      echo "📖 Setup Script Help for dailytrends-api"
      echo ""
      echo "This script sets up the dailytrends-api project by installing dependencies (Node.js, pnpm, Docker or Podman), starting MongoDB and Redis containers, and building/running the application."
      echo ""
      echo "Usage: ./setup.sh [options]"
      echo ""
      echo "Options:"
      echo "  --help          Display this help message and exit."
      echo "  --no-build      Skip the project build step (pnpm run build)."
      echo "  --no-start      Skip the application start step (pnpm run start)."
      echo "  --use-docker    Use Docker and Docker Compose for container management (default)."
      echo "  --use-podman    Use Podman and podman-compose for container management."
      echo ""
      echo "Steps Performed:"
      echo "  1. Update system packages using apt."
      echo "  2. Install container engine:"
      echo "     - Docker: Installs docker.io, docker-compose, and adds user to docker group."
      echo "     - Podman: Installs podman, podman-compose, and configures rootless operation."
      echo "  3. Install nvm (Node Version Manager) if not present."
      echo "  4. Install Node.js v$NODE_VERSION.x via nvm if not installed."
      echo "  5. Install pnpm globally if not installed."
      echo "  6. Navigate to project directory ($PROJECT_DIR)."
      echo "  7. Start MongoDB and Redis containers using docker-compose or podman-compose."
      echo "  8. Install project dependencies using pnpm."
      echo "  9. Build the project (optional, skipped with --no-build)."
      echo "  10. Start the application (optional, skipped with --no-start)."
      echo ""
      echo "Notes:"
      echo "  - Requires Ubuntu/Debian (uses apt)."
      echo "  - Docker requires logging out/in after adding user to docker group (or run 'newgrp docker')."
      echo "  - Podman runs rootless, avoiding permission issues."
      echo "  - Ensure $PROJECT_DIR exists and contains docker-compose.yml."
      echo "  - The script assumes MongoDB (port 27018) and Redis (port 6379) services are defined."
      echo ""
      echo "Example Commands:"
      echo "  ./setup.sh                  # Run all steps with Docker"
      echo "  ./setup.sh --use-podman     # Use Podman instead of Docker"
      echo "  ./setup.sh --no-build       # Skip build step"
      echo "  ./setup.sh --no-start       # Skip start step"
      echo ""
      exit 0
      ;;
    --no-build)
      RUN_BUILD=false
      ;;
    --no-start)
      RUN_START=false
      ;;
    --use-podman)
      CONTAINER_ENGINE="podman"
      ;;
    --use-docker)
      CONTAINER_ENGINE="docker"
      ;;
    *)
      echo "⚠️ Unknown argument: $arg"
      echo "Valid options are: --help --no-build --no-start --use-podman --use-docker"
      exit 1
      ;;
  esac
done

# =============================
# 3. Update System Packages
# =============================
echo "🔄 Step 1: Updating system packages..."
sudo apt update -y
echo "✅ System updated."

# =============================
# 4. Install Container Engine (Docker or Podman)
# =============================
if [ "$CONTAINER_ENGINE" = "docker" ]; then
  echo "🔧 Step 2: Setting up Docker..."
  if ! command -v docker &>/dev/null; then
    echo "⬇️ Installing Docker..."
    sudo apt install -y docker.io
    sudo systemctl enable docker
    sudo systemctl start docker
    # Add user to docker group to avoid permission issues
    sudo usermod -aG docker "$USER"
    echo "⚠️ Added user to docker group. Please log out and back in after script completion, or run 'newgrp docker'."
  else
    echo "🟢 Docker already installed: $(docker --version)"
  fi

  if ! command -v docker-compose &>/dev/null; then
    echo "⬇️ Installing Docker Compose..."
    sudo apt install -y docker-compose
  else
    echo "🟢 Docker Compose already installed: $(docker-compose --version)"
  fi
else
  echo "🔧 Step 2: Setting up Podman..."
  if ! command -v podman &>/dev/null; then
    echo "⬇️ Installing Podman..."
    sudo apt install -y podman
    # Configure Podman for rootless operation
    echo "net.ipv4.ping_group_range = 0 2000" | sudo tee -a /etc/sysctl.conf
    sudo sysctl -p
  else
    echo "🟢 Podman already installed: $(podman --version)"
  fi
  # Podman uses podman-compose for compatibility
  if ! command -v podman-compose &>/dev/null; then
    echo "⬇️ Installing podman-compose..."
    pip3 install podman-compose
  else
    echo "🟢 podman-compose already installed: $(podman-compose --version)"
  fi
fi

# =============================
# 5. Install nvm if not already installed
# =============================
export NVM_DIR="$HOME/.nvm"
if [ ! -d "$NVM_DIR" ]; then
  echo "⬇️ Step 3: Installing nvm..."
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
fi

# Load nvm
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# =============================
# 6. Check Existing Node.js
# =============================
if command -v node &>/dev/null; then
  CURRENT_NODE=$(node -v)
  echo "🟢 Node.js already installed: $CURRENT_NODE"
  INSTALL_NODE=false
else
  echo "🟡 Node.js not found. Will install v$NODE_VERSION.x..."
fi

# =============================
# 7. Install Node.js via nvm (if needed)
# =============================
if [ "$INSTALL_NODE" = true ]; then
  echo "⬇️ Step 4: Installing Node.js v$NODE_VERSION.x via nvm..."
  nvm install "$NODE_VERSION"
  nvm use "$NODE_VERSION"
  echo "✅ Node.js installed: $(node -v)"
  echo "npm version: $(npm -v)"
fi

# =============================
# 8. Check Existing pnpm
# =============================
if command -v pnpm &>/dev/null; then
  echo "🟢 pnpm already installed: $(pnpm -v)"
  INSTALL_PNPM=false
else
  echo "🟡 pnpm not found. Installing..."
fi

# =============================
# 9. Install pnpm (if needed)
# =============================
if [ "$INSTALL_PNPM" = true ]; then
  echo "⬇️ Step 5: Installing pnpm globally..."
  corepack enable pnpm || npm install -g pnpm
  echo "✅ pnpm installed: $(pnpm -v)"
fi

# =============================
# 10. Navigate to Project Folder
# =============================
echo "📁 Step 6: Navigating to project directory: $PROJECT_DIR"
cd "$PROJECT_DIR" || { echo "❌ ERROR: Project directory not found: $PROJECT_DIR"; exit 1; }

# =============================
# 11. Start Container Services
# =============================
echo "🐳 Step 7: Starting container services for MongoDB and Redis..."
if [ "$CONTAINER_ENGINE" = "docker" ]; then
  docker-compose up -d mongo redis || { echo "❌ ERROR: Failed to start Docker services"; exit 1; }
  echo "✅ Docker services started."
else
  podman-compose up -d mongo redis || { echo "❌ ERROR: Failed to start Podman services"; exit 1; }
  echo "✅ Podman services started."
fi

# =============================
# 12. Install Dependencies
# =============================
echo "🧩 Step 8: Installing dependencies using pnpm..."
pnpm install --frozen-lockfile
echo "✅ Dependencies installed."

# =============================
# 13. Build the Project (Optional)
# =============================
if [ "$RUN_BUILD" = true ]; then
  echo "🛠️ Step 9: Building project..."
  pnpm run build
  echo "✅ Build complete."
else
  echo "⏭️ Step 9: Skipping build as requested."
fi

# =============================
# 14. Start the Application (Optional)
# =============================
if [ "$RUN_START" = true ]; then
  echo "🚀 Step 10: Starting application..."
  pnpm run start
else
  echo "⏭️ Step 10: Skipping start as requested."
fi
#!/bin/bash

# OmniCode Platform Setup Script
# Run this script to bootstrap the entire project environment

echo "================================================="
echo "🚀 Starting OmniCode Platform Setup..."
echo "================================================="

# 1. Start Database
echo -e "\n[1/5] Starting PostgreSQL database via Docker..."
if command -v docker-compose &> /dev/null || command -v docker &> /dev/null; then
    docker compose up -d 2>/dev/null || docker-compose up -d
else
    echo "❌ Docker is not installed. Please install Docker to run the database."
    exit 1
fi

# Wait for DB to be ready
echo "Waiting for database to initialize..."
sleep 3

# 2. Set up Backend
echo -e "\n[2/5] Setting up Python Backend..."
cd backend || exit

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

echo "Installing backend dependencies..."
source venv/bin/activate
pip install fastapi uvicorn sqlalchemy psycopg2-binary pydantic python-dotenv requests alembic

echo "Seeding the database with problems..."
python3 seed_more.py
cd ..

# 3. Set up Frontend
echo -e "\n[3/5] Setting up Next.js Frontend..."
cd frontend || exit
echo "Installing frontend dependencies..."
npm install
cd ..

# 4. Set up AI Model (Ollama)
echo -e "\n[4/5] Checking Ollama AI service..."
if command -v ollama &> /dev/null; then
    echo "Pulling llama3.2:1b model (this might take a moment if not cached)..."
    ollama pull llama3.2:1b
else
    echo "⚠️ Ollama is not installed! The AI Analysis feature will fallback to a default message."
    echo "To fix this, install Ollama from https://ollama.com/"
fi

# 5. Check compilers
echo -e "\n[5/5] Checking C++ Compiler..."
if ! command -v g++ &> /dev/null; then
    echo "⚠️ g++ is not installed! C++ code execution will fail."
    echo "Please run: sudo apt install g++"
else
    echo "✅ g++ is installed."
fi

echo -e "\n================================================="
echo "✅ Setup Complete! OmniCode is fully configured."
echo "================================================="
echo ""
echo "To start the platform, run these commands in TWO separate terminals:"
echo ""
echo "💻 Terminal 1 (Backend API):"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"
echo ""
echo "🌐 Terminal 2 (Next.js Frontend):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "Access the platform at: http://localhost:3000"
echo "================================================="

# AquaPulse AI 🌊

AquaPulse AI is a state-of-the-art, AI-powered intelligence and decision-support platform tailored for modern aquaculture. By leveraging advanced language models, computer vision, and real-time data feeds, AquaPulse AI equips farmers and aquaculture businesses with actionable insights to mitigate risks, optimize yields, and track market dynamics.

---

## 🚀 Key Features

*   **Mithrama AI Advisory (Conversational Agent)**: An interactive aquaculture expert capable of answering complex farming questions, diagnosing water quality issues, and advising on best practices.
*   **Disease Scanning & Image Analysis**: A computer vision diagnostic tool that checks shrimp/fish health and pond conditions using uploaded images.
*   **Pond PDF Report Analyzer**: An automated document analysis tool to parse water quality reports, lab results, and feed logs.
*   **Live Market Intelligence**: Live farm-gate price ticker, market sentiment analysis, and bias evaluation (Bullish/Bearish) for key culture sizes.
*   **Weather Risk Telemetry**: Real-time localized weather risk monitoring to alert farmers to sudden shifts in temperature, wind, or rainfall.
*   **Automated News Signal Feeds**: Curated aquaculture news feeds with AI-analyzed impact and confidence scores.

---

## 🛠️ Architecture & Tech Stack

AquaPulse AI is split into a decoupled frontend and backend:

*   **Frontend**: Built with **Next.js 15 (TypeScript)**, **Tailwind CSS**, and **React**.
*   **Backend**: Powered by **FastAPI (Python)**, integrated with **OpenRouter AI (LLMs/Vision)**, and utilizing **Supabase** for database operations and structured telemetry.

---

## 💻 Local Setup & Development

### Prerequisites
*   Node.js (v18+)
*   Python 3.10+
*   Git

---

### 1. Backend Setup

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Create and activate a virtual environment:
    ```bash
    python -m venv .venv
    # On Windows (PowerShell):
    .venv\Scripts\Activate.ps1
    # On macOS/Linux:
    source .venv/bin/activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Configure Environment Variables:
    Create a `.env` file in the `backend/` directory:
    ```env
    OPENROUTER_API_KEY=your_openrouter_api_key
    SUPABASE_URL=your_supabase_url
    SUPABASE_KEY=your_supabase_anon_or_service_key
    OPENWEATHER_API_KEY=your_openweather_api_key
    ```
5.  Start the backend server:
    ```bash
    uvicorn main:app --reload --port 8000
    ```
    The API will be available at `http://localhost:8000`.

---

### 2. Frontend Setup

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure Environment Variables:
    Create a `.env.local` file in the `frontend/` directory:
    ```env
    NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
    ```
4.  Run the Next.js development server:
    ```bash
    npm run dev
    ```
    The application will be accessible at `http://localhost:3000`.

---

## ☁️ Free Deployment Guide

Here is how you can host the entire stack **100% for free** using standard cloud platforms.

### 🌌 Step 1: Push Project to GitHub

Make sure your latest codebase is pushed to your GitHub repository:
```bash
git add .
git commit -m "Configure project for deployment"
git push origin main
```

---

### 🐍 Step 2: Deploy the FastAPI Backend to Render (Free Tier)

[Render](https://render.com) offers free web services that can run FastAPI.

1.  **Sign Up / Log In**: Connect your GitHub account to Render.
2.  **Create a New Web Service**:
    *   Click **New +** -> **Web Service**.
    *   Select your repository (`aquapulse-ai`).
3.  **Configure Service Settings**:
    *   **Name**: `aquapulse-api` (or any unique name)
    *   **Environment**: `Python 3`
    *   **Region**: Select the closest region to your users
    *   **Branch**: `main`
    *   **Root Directory**: `backend` (⚠️ *Very Important: Tell Render the backend is in the backend subdirectory*)
    *   **Build Command**: `pip install -r requirements.txt`
    *   **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
    *   **Instance Type**: `Free`
4.  **Add Environment Variables**:
    Under the **Environment** tab, add your secrets:
    *   `OPENROUTER_API_KEY` = `(your api key)`
    *   `SUPABASE_URL` = `(your supabase project url)`
    *   `SUPABASE_KEY` = `(your supabase key)`
    *   `OPENWEATHER_API_KEY` = `(your weather api key)`
5.  **Deploy**: Click **Create Web Service**. Once deployed, Render will provide a URL like `https://aquapulse-api.onrender.com`.
    > [!NOTE]
    > Render's free tier services spin down after 15 minutes of inactivity. The first request after a sleep period may take 30-50 seconds to boot up.

---

### ⚛️ Step 3: Deploy the Next.js Frontend to Vercel (Free Tier)

[Vercel](https://vercel.com) provides native, zero-configuration hosting for Next.js.

1.  **Sign Up / Log In**: Login to Vercel using your GitHub account.
2.  **Import Project**:
    *   Click **Add New...** -> **Project**.
    *   Import your repository (`aquapulse-ai`).
3.  **Configure Project Settings**:
    *   **Framework Preset**: `Next.js`
    *   **Root Directory**: `frontend` (⚠️ *Very Important: Tell Vercel the frontend code is in the frontend subdirectory*)
    *   **Build & Development Settings**: Keep defaults.
4.  **Add Environment Variables**:
    Expand the **Environment Variables** section and add:
    *   **Key**: `NEXT_PUBLIC_API_BASE_URL`
    *   **Value**: `https://aquapulse-api.onrender.com` (Use the actual backend URL generated by Render in Step 2)
5.  **Deploy**: Click **Deploy**. Vercel will build the frontend and provide a production domain (e.g., `https://aquapulse-ai.vercel.app`).

---

## 🔒 Security Best Practices
*   Never remove `.env` or `.env.local` files from the `.gitignore`.
*   Ensure all API keys (OpenRouter, Supabase, OpenWeather) are only stored as production environment variables on Vercel and Render.
*   CORS settings in the backend (`backend/main.py`) allow communication from client applications. Ensure CORS origins are configured properly if restrictions are needed.
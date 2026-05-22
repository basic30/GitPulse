# ⚡ GitPulse

> **Your codebase is hiding dead weight. We find it.**

GitPulse connects directly to your GitHub account and utilizes AI to analyze your repositories. It finds dead code, unused functions, and zombie dependencies, grades your repository's health, and provides a step-by-step deletion plan to help you clean up your codebase safely.

[![Live Demo](https://img.shields.io/badge/Watch-Live_Demo-red?style=for-the-badge&logo=youtube)](https://youtu.be/lpjvCJ21cmI)
[![Beta](https://img.shields.io/badge/Status-Public_Beta-success?style=for-the-badge)]()

---

## ✨ Features

- **🧠 AI-Powered Code Analysis**: Uses Puter.js and OpenAI to detect risky patterns, dead paths, and code duplication.
- **📦 Zombie Dependency Detection**: Identifies unused packages cluttering your `package.json` or equivalent configuration files.
- **📊 Health Scoring System**: Automatically calculates comprehensive scores for overall health, dead code, dependencies, and complexity.
- **🗺️ Safe Deletion Plans**: Generates phased, step-by-step instructions on what to safely delete and why.
- **🔗 Seamless GitHub Integration**: Direct OAuth login and automatic repository syncing.
- **🌍 Multi-Language Support**: Scans JS, TS, Python, Rust, Go, Java, C++, and more.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript / React 19
- **Styling**: Tailwind CSS 4 + Framer Motion
- **Components**: Radix UI
- **Database & Auth**: [Supabase](https://supabase.com/)
- **AI Integration**: Puter.js API / Vercel AI SDK
- **State Management**: Zustand
- **Schema Validation**: Zod

---

## 📂 Project Structure

```text
gitpulse/
├── app/                      # Next.js App Router root
│   ├── analyze/              # Real-time AI analysis views
│   ├── api/                  # API routes (GitHub sync, AI analysis, auth)
│   ├── auth/                 # Authentication pages (Login, OAuth callback)
│   ├── dashboard/            # User dashboard, settings, and repo grid
│   └── report/               # Detailed code health reports & issue lists
├── components/               # Modular React components
│   ├── analyze/              # Analysis UI (Live logs, AI visuals)
│   ├── dashboard/            # Dashboard UI (Sidebar, stat bars, repo cards)
│   ├── landing/              # Landing page UI (Hero, features, pricing)
│   ├── report/               # Report UI (Deletion plans, issue cards)
│   └── ui/                   # Reusable Radix UI components (Buttons, Dialogs)
├── hooks/                    # Custom React hooks (use-mobile, use-toast)
├── lib/                      # Utilities, configurations, and clients
│   ├── auth/                 # Auth actions
│   ├── supabase/             # Supabase clients (Server, SSR, Middleware)
│   └── store.ts              # Zustand global state store
├── public/                   # Static assets (Logos, icons, placeholders)
├── scripts/                  # SQL scripts for Supabase DB setup
│   ├── 001_create_tables.sql
│   └── 002_profile_trigger.sql
├── middleware.ts             # Next.js middleware for Supabase session routing
├── package.json              # Project dependencies and scripts
└── tailwind.config.ts        # Tailwind CSS configuration
```
## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- A Supabase account
- A GitHub OAuth Application (for authentication)
- A Puter.js API Token

### 1. Clone the repository
git clone https://github.com/yourusername/gitpulse.git
cd gitpulse

### 2. Install dependencies
npm install
## or
pnpm install
## or
yarn install

### 3. Configure Environment Variables
Create a .env.local file in the root directory and add the following keys:

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Configuration
PUTER_AUTH_TOKEN=your_puter_api_token

### 4. Setup the Database
Execute the SQL scripts located in the /scripts directory in your Supabase SQL Editor to set up the required tables, user profiles, and triggers:
- Run 001_create_tables.sql
- Run 001_profiles.sql
- Run 002_profile_trigger.sql

### 5. Run the Development Server
npm run dev

Open http://localhost:3000 in your browser to see the result.

---

## 💡 How it Works

- Authenticate: Users log in via GitHub OAuth using Supabase Auth. GitPulse requests read-only access to repositories.
- Select & Sync: The user selects a repository from their personalized dashboard. GitPulse syncs the repository metadata.
- Analyze: The backend API fetches the raw code files from GitHub, ignoring non-essential directories (like node_modules or .git).
- AI Processing: The code context is sent to the AI model alongside a strict grading rubric to calculate accurate scores and formulate a targeted deletion plan.
- Report: The user is presented with a detailed report outlining critical vulnerabilities, dead code blocks, and the suggested steps to safely clean their repository.

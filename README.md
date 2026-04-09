# Event Requirement System

A robust, full-stack Multi-Step Form application designed to collect and manage event requirements. The frontend is built with Next.js & React, featuring a dynamic UI with step-by-step validation. The backend relies on Node.js, Express, and MongoDB to persistently store structured data with a strict Mongoose schema.

## 🚀 Technologies Used

**Frontend (Client Directory)**
- **Framework**: Next.js (App Router)
- **Library**: React 19
- **Styling**: Vanilla CSS (Premium, modern, glassmorphism design approach)

**Backend (Root Directory)**
- **Runtime**: Node.js
- **Server**: Express.js
- **Database**: MongoDB Atlas
- **ODM**: Mongoose

## 📁 Project Structure

This is a **monorepo** layout. The Express server resides at the root level, while the Next.js frontend is located centrally in the `/client` directory.

```text
├── api/                  # Vercel Serverless entrypoint
├── client/               # Next.js Frontend Application
│   ├── app/              # Next.js Pages & Routing
│   ├── components/       # Reusable React components (MultiStepForm, etc.)
│   └── services/         # API fetching logic
├── config/               # Database connection settings
├── controllers/          # Express route handler logic
├── models/               # Mongoose Database Schemas
├── routes/               # Express API routing definition
├── app.js                # Express Application setup
├── server.js             # Local Backend Entrypoint
└── vercel.json           # Vercel Deployment Configuration
```

## 💻 Running Locally

### 1. Environment Variables
Create a `.env` file in the **root** of the repository and add your MongoDB connection string using the following format:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/mydb?retryWrites=true&w=majority
PORT=5000
```

### 2. Install Dependencies
You need to install packages for **both** the backend and the frontend separately.
```bash
# Install backend dependencies
npm install

# Navigate to client and install frontend dependencies
cd client
npm install
```

### 3. Start the Development Servers
You will need two terminal windows open to run the full stack locally.

**Terminal 1 (Backend Controller):**
```bash
# From the root directory
npm run dev
# The Express API will start on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
# From the /client directory
npm run dev
# The Next.js app will start on http://localhost:3000
```

## ☁️ Deploying on Vercel

This repository is uniquely configured to deploy **both** the Next.js frontend and Express backend simultaneously on Vercel using Serverless Functions.

1. **Import the Repository** into Vercel.
2. In the Vercel **Project Settings > General**, ensure the **Root Directory** field is left **completely empty** (Do not set it to `client`). 
3. Go to **Environment Variables** and add your `MONGO_URI`. (Make sure you include the database name, e.g., `/mydb`, in the connection string).
4. **Important**: Go to your MongoDB Atlas Dashboard -> **Network Access** -> Add IP Address, and choose **Allow Access From Anywhere (`0.0.0.0/0`)**. Since Vercel uses dynamic IPs, this is required for Vercel to save data without being blocked by MongoDB's firewall. 
5. Hit **Deploy**. Vercel will automatically read `vercel.json` and deploy both tiers correctly.

## 📝 API Endpoints

- `GET /api/health` - Check if the Express server is running.
- `POST /api/requirements` - Submits a new event form. Expects a JSON payload adhering to the Category Schema rules.
- `GET /api/requirements` - Fetches all submitted requests.

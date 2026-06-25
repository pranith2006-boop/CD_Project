# LexiParse Studio

An educational web application that visualizes each stage of a compiler pipeline.

## Features
- Write C‑like code in a web editor
- Step‑by‑step visualisation of lexer, parser, semantic analysis, intermediate code, optimisation, and target code generation
- Export results, dark‑mode, history, and more

## Tech Stack
- **Frontend**: React (Vite), HTML5, CSS3, JavaScript
- **Backend (Local)**: Node.js, Express.js (runs python child processes)
- **Backend (Production/Vercel)**: Python serverless functions (Flask, flask-cors)
- **Compiler Engine**: Python scripts (lexer, parser, semantic, optimiser, etc.)

## Setup & Running Locally

### Option A: Running with Node.js Express Backend
```bash
# 1. Install and run frontend
cd client
npm install
npm run dev   # runs on http://localhost:5173

# 2. Install and run Node backend
cd ../server
npm install
node app.js    # runs on http://localhost:5000
```

### Option B: Running with Python Flask Backend (Vercel-like environment)
```bash
# 1. Install Flask dependencies
pip install -r requirements.txt

# 2. Run the Flask server
python api/index.py   # runs on http://localhost:5000

# 3. Run client
cd client
npm install
npm run dev   # runs on http://localhost:5173
```

## Deployment (Vercel)
This project is configured to run fully on Vercel using **Python Serverless Functions** for the backend API and static web hosting for the React frontend.

1. **Import the repository** into Vercel.
2. In the project setup, expand the **Build and Development Settings**:
   - **Build Command**: Toggle Override and enter: `npm run vercel-build`
   - **Output Directory**: Toggle Override and enter: `client/dist`
3. Click **Deploy**. Vercel will build the frontend, package your python functions in `api/index.py`, and link them under `/api/*`.

## License
MIT

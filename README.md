# LexiParse Studio

An educational web application that visualizes each stage of a compiler pipeline.

## Features
- Write C‑like code in a web editor
- Step‑by‑step visualisation of lexer, parser, semantic analysis, intermediate code, optimisation, and target code generation
- Export results, dark‑mode, history, and more

## Tech Stack
- **Frontend**: React (Vite), HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express.js
- **Compiler Engine**: Python scripts (lexer, parser, semantic, optimiser, etc.)
- **Communication**: REST API between Node and Python

## Setup
```bash
# Clone repo
git clone <repo-url>
cd compiler-demo

# Frontend
cd client
npm install
npm run dev   # http://localhost:5173

# Backend
cd ../server
npm install
node app.js    # http://localhost:5000

# Python environment
cd ../python
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## License
MIT

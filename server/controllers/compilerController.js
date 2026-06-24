// server/controllers/compilerController.js
const { spawn } = require('child_process');
const path = require('path');

// Helper to run a python script and return JSON response
function runPythonScript(scriptName, inputData, res) {
  const scriptPath = path.join(__dirname, '../../python', scriptName);
  const py = spawn('python', [scriptPath]);

  let stdout = '';
  let stderr = '';

  py.stdout.on('data', (data) => {
    stdout += data.toString();
  });

  py.stderr.on('data', (data) => {
    stderr += data.toString();
  });

  py.on('close', (code) => {
    if (code !== 0) {
      console.error(`Python script ${scriptName} exited with code ${code}`);
      console.error(stderr);
      return res.status(500).json({ error: 'Internal server error', details: stderr });
    }
    try {
      const result = JSON.parse(stdout);
      return res.json(result);
    } catch (e) {
      console.error('Failed to parse JSON from Python script:', e);
      return res.status(500).json({ error: 'Invalid JSON from script', raw: stdout });
    }
  });

  // Send input data to python via stdin as JSON string
  py.stdin.write(JSON.stringify(inputData));
  py.stdin.end();
}

exports.runLexer = (req, res) => {
  runPythonScript('lexer.py', req.body, res);
};

exports.runParser = (req, res) => {
  runPythonScript('parser.py', req.body, res);
};

exports.runSemantic = (req, res) => {
  runPythonScript('semantic.py', req.body, res);
};

exports.runIntermediate = (req, res) => {
  runPythonScript('intermediate.py', req.body, res);
};

exports.runOptimization = (req, res) => {
  runPythonScript('optimizer.py', req.body, res);
};

exports.runTarget = (req, res) => {
  runPythonScript('targetcode.py', req.body, res);
};

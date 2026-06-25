from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os
import json
import io

# Setup path to import python files from the root python directory
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'python'))

# Import the original python files
import lexer
import parser
import semantic
import intermediate
import optimizer
import targetcode

app = Flask(__name__)
CORS(app)

def run_script_with_stdin(main_fn, payload):
    # Backup original stdin and stdout
    old_stdin = sys.stdin
    old_stdout = sys.stdout
    
    # Redirect stdin to read from the JSON payload and stdout to buffer
    sys.stdin = io.StringIO(json.dumps(payload))
    sys.stdout = io.StringIO()
    
    try:
        main_fn()
        output = sys.stdout.getvalue()
        # Parse output as JSON if possible
        return json.loads(output)
    except SystemExit as se:
        # SystemExit (from sys.exit) is raised when the script exits
        output = sys.stdout.getvalue()
        try:
            return json.loads(output)
        except Exception:
            return {"error": "SystemExit", "code": se.code, "raw_output": output}
    except Exception as e:
        return {"error": "Script execution failed", "details": str(e)}
    finally:
        # Always restore original stdin and stdout
        sys.stdin = old_stdin
        sys.stdout = old_stdout

@app.route('/api/lexer', methods=['POST'])
def run_lexer():
    data = request.json or {}
    res = run_script_with_stdin(lexer.main, data)
    return jsonify(res)

@app.route('/api/parser', methods=['POST'])
def run_parser():
    data = request.json or {}
    res = run_script_with_stdin(parser.main, data)
    return jsonify(res)

@app.route('/api/semantic', methods=['POST'])
def run_semantic():
    data = request.json or {}
    res = run_script_with_stdin(semantic.main, data)
    return jsonify(res)

@app.route('/api/intermediate', methods=['POST'])
def run_intermediate():
    data = request.json or {}
    res = run_script_with_stdin(intermediate.main, data)
    return jsonify(res)

@app.route('/api/optimization', methods=['POST'])
def run_optimization():
    data = request.json or {}
    res = run_script_with_stdin(optimizer.main, data)
    return jsonify(res)

@app.route('/api/target', methods=['POST'])
def run_target():
    data = request.json or {}
    res = run_script_with_stdin(targetcode.main, data)
    return jsonify(res)

# This enables running locally for testing
if __name__ == '__main__':
    app.run(port=5000, debug=True)

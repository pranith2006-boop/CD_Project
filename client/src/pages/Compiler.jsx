import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { cpp } from '@codemirror/lang-cpp';
import './Compiler.css';

const phases = [
  'Lexical',
  'Syntax',
  'Semantic',
  'Intermediate',
  'Optimization',
  'Target Code',
];

const API_BASE = import.meta.env.DEV ? 'http://localhost:5000' : '';

const Compiler = () => {
  const [code, setCode] = useState(`int main() {\n    int a = 10;\n    int b = 20;\n    int c = a + b;\n    return c;\n}`);
  const [activePhase, setActivePhase] = useState('Lexical');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({
    'Lexical': null,
    'Syntax': null,
    'Semantic': null,
    'Intermediate': null,
    'Optimization': null,
    'Target Code': null,
  });
  const [error, setError] = useState(null);

  const handleRun = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Lexical Analysis
      const lexerRes = await fetch(`${API_BASE}/api/lexer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      if (!lexerRes.ok) throw new Error('Lexical Analysis failed');
      const lexerData = await lexerRes.json();
      
      // 2. Syntax Analysis (Parser)
      const parserRes = await fetch(`${API_BASE}/api/parser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokens: lexerData.tokens }),
      });
      if (!parserRes.ok) throw new Error('Syntax Analysis failed');
      const parserData = await parserRes.json();

      // 3. Semantic Analysis
      const semanticRes = await fetch(`${API_BASE}/api/semantic`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      if (!semanticRes.ok) throw new Error('Semantic Analysis failed');
      const semanticData = await semanticRes.json();

      // 4. Intermediate Code Gen
      const intermediateRes = await fetch(`${API_BASE}/api/intermediate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokens: lexerData.tokens }),
      });
      if (!intermediateRes.ok) throw new Error('Intermediate Code Gen failed');
      const intermediateData = await intermediateRes.json();

      // 5. Optimization
      const optRes = await fetch(`${API_BASE}/api/optimization`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tac: intermediateData.tac }),
      });
      if (!optRes.ok) throw new Error('Optimization failed');
      const optData = await optRes.json();

      // 6. Target Code Gen
      const targetRes = await fetch(`${API_BASE}/api/target`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optimized_tac: optData.optimized_tac }),
      });
      if (!targetRes.ok) throw new Error('Target Code Gen failed');
      const targetData = await targetRes.json();

      setResults({
        'Lexical': lexerData,
        'Syntax': parserData,
        'Semantic': semanticData,
        'Intermediate': intermediateData,
        'Optimization': optData,
        'Target Code': targetData,
      });
    } catch (e) {
      console.error(e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper to classify token types for lexical badges
  const getTokenBadgeClass = (lexeme, type) => {
    const keywords = ['int', 'float', 'char', 'double', 'void', 'return', 'if', 'else', 'while', 'for', 'main'];
    if (keywords.includes(lexeme)) return 'badge-keyword';
    if (type === 'identifier') return 'badge-identifier';
    if (!isNaN(lexeme) || lexeme.startsWith('"') || lexeme.startsWith("'")) return 'badge-literal';
    if (['+', '-', '*', '/', '=', '==', '<', '>', '!=', '<=', '>='].includes(lexeme)) return 'badge-operator';
    return 'badge-symbol';
  };

  // Helper to extract a symbol table dynamically from code tokens
  const buildSymbolTable = () => {
    const tokens = results['Lexical']?.tokens;
    if (!tokens) return [];
    
    const table = [];
    let currentType = null;
    
    for (let i = 0; i < tokens.length; i++) {
      const lexeme = tokens[i].lexeme;
      if (['int', 'float', 'char', 'double', 'void'].includes(lexeme)) {
        currentType = lexeme;
      } else if (currentType && tokens[i].type === 'identifier') {
        let val = 'N/A';
        if (i + 2 < tokens.length && tokens[i + 1].lexeme === '=') {
          val = tokens[i + 2].lexeme;
        }
        table.push({
          name: lexeme,
          type: currentType,
          scope: 'main',
          line: tokens[i].line || 1,
          value: val,
        });
        currentType = null;
      } else {
        if (tokens[i].type !== 'symbol') {
          currentType = null;
        }
      }
    }
    return table;
  };

  // Recursive AST renderer
  const renderASTNode = (node, index = 0) => {
    if (!node) return null;
    return (
      <div key={index} className="tree-node">
        <div className="tree-node-title">
          <span className="tree-node-tag">{node.type}</span>
          {node.lexeme && <span className="tree-node-lexeme">"{node.lexeme}"</span>}
        </div>
        {node.children && node.children.map((child, idx) => renderASTNode(child, idx))}
        {node.tokens && node.tokens.map((tok, idx) => (
          <div key={idx} className="tree-node">
            <div className="tree-node-title">
              <span className="tree-node-tag">Token</span>
              <span className="tree-node-lexeme">"{tok.lexeme}" ({tok.type})</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderActivePhase = () => {
    const data = results[activePhase];
    if (!data) {
      return (
        <div className="placeholder">
          <span className="placeholder-icon">🚀</span>
          <p>Click the "Run" button to execute compilation and analyze results.</p>
        </div>
      );
    }

    switch (activePhase) {
      case 'Lexical':
        return (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Lexeme</th>
                  <th>Classification</th>
                  <th>Line</th>
                </tr>
              </thead>
              <tbody>
                {data.tokens?.map((tok, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td><code>{tok.lexeme}</code></td>
                    <td>
                      <span className={`token-badge ${getTokenBadgeClass(tok.lexeme, tok.type)}`}>
                        {tok.type.toUpperCase()}
                      </span>
                    </td>
                    <td>{tok.line}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'Syntax':
        return (
          <div className="ast-explorer" style={{ padding: '0.5rem', overflow: 'auto', maxHeight: '430px' }}>
            {renderASTNode(data.parse_tree)}
          </div>
        );

      case 'Semantic':
        const symbols = buildSymbolTable();
        return (
          <div>
            <div className={`semantic-status ${data.semantic?.status === 'ok' ? 'success' : 'error'}`}>
              <strong>Scoping & Scans:</strong> {data.semantic?.status === 'ok' ? 'Verified Successfully (0 Issues)' : 'Issues Detected'}
            </div>
            <h3>Symbol Table</h3>
            <div className="data-table-wrapper" style={{ marginTop: '0.75rem' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Identifier</th>
                    <th>Type</th>
                    <th>Scope</th>
                    <th>Value</th>
                    <th>Line</th>
                  </tr>
                </thead>
                <tbody>
                  {symbols.map((sym, idx) => (
                    <tr key={idx}>
                      <td><code>{sym.name}</code></td>
                      <td><span className="token-badge badge-keyword">{sym.type}</span></td>
                      <td>{sym.scope}</td>
                      <td><code>{sym.value}</code></td>
                      <td>{sym.line}</td>
                    </tr>
                  ))}
                  {symbols.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No identifier declarations found in source.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'Intermediate':
        return (
          <pre className="code-output">
            {data.tac?.map((line, idx) => (
              <span key={idx} className="code-line">
                <span style={{ color: '#64748b', marginRight: '1rem', userSelect: 'none' }}>{idx + 1}</span>
                {line}
              </span>
            ))}
            {(!data.tac || data.tac.length === 0) && "No intermediate code generated."}
          </pre>
        );

      case 'Optimization':
        const originalTAC = results['Intermediate']?.tac || [];
        return (
          <div className="comparison-container">
            <div className="comparison-box">
              <h4>Original TAC</h4>
              <pre className="code-output">
                {originalTAC.map((line, idx) => (
                  <span key={idx} className="code-line">{line}</span>
                ))}
              </pre>
            </div>
            <div className="comparison-box">
              <h4>Optimized TAC</h4>
              <pre className="code-output">
                {data.optimized_tac?.map((line, idx) => (
                  <span key={idx} className="code-line">{line}</span>
                ))}
              </pre>
            </div>
          </div>
        );

      case 'Target Code':
        return (
          <pre className="code-output">
            {data.assembly?.map((line, idx) => (
              <span key={idx} className="code-line">
                <span style={{ color: '#64748b', marginRight: '1rem', userSelect: 'none' }}>{idx + 1}</span>
                {line}
              </span>
            ))}
          </pre>
        );

      default:
        return null;
    }
  };

  return (
    <div className="compiler-page page">
      <div className="editor-panel">
        <h2>
          <span>📝</span> Source Code Editor
        </h2>
        <div className="editor-container">
          <CodeMirror
            value={code}
            height="450px"
            extensions={[cpp()]}
            onChange={(val) => setCode(val)}
          />
        </div>
        <div className="editor-controls">
          <button className="btn btn-clear" onClick={() => setCode('')} disabled={loading}>
            Clear
          </button>
          <button className="btn btn-run" onClick={handleRun} disabled={loading}>
            {loading ? 'Compiling...' : 'Run Pipeline'}
          </button>
        </div>
      </div>

      <div className="phases-panel">
        <h2>
          <span>⚙️</span> Compiler Pipeline Visualizer
        </h2>
        <ul className="phase-tabs">
          {phases.map((ph) => (
            <li
              key={ph}
              className={ph === activePhase ? 'active' : ''}
              onClick={() => setActivePhase(ph)}
            >
              {ph}
            </li>
          ))}
        </ul>
        <div className="phase-content">
          {loading ? (
            <div className="loader-container">
              <div className="spinner"></div>
              <p style={{ color: 'var(--text-secondary)' }}>Processing compilation pipeline...</p>
            </div>
          ) : error ? (
            <div className="semantic-status error" style={{ margin: 'auto' }}>
              <strong>Execution Error:</strong> {error}
            </div>
          ) : (
            renderActivePhase()
          )}
        </div>
      </div>
    </div>
  );
};

export default Compiler;

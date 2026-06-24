import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <section className="home page">
      <div className="hero">
        <h1>LexiParse Studio</h1>
        <p>An interactive, educational platform designed to visualize and inspect every stage of compilation for a simple, C‑like language.</p>
        <div className="buttons">
          <a href="/compiler" className="btn btn-primary">Launch Compiler Studio</a>
          <a href="/documentation" className="btn btn-secondary">Read Documentation</a>
        </div>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <span className="icon">🔍</span>
          <h3>Lexical Analysis</h3>
          <p>Scan source code into individual tokens. Visualize the stream of lexical tokens classified by their types.</p>
        </div>
        <div className="feature-card">
          <span className="icon">🌲</span>
          <h3>Syntax Analysis</h3>
          <p>Parse tokens using context-free grammars and visualize the syntax tree representation of the code.</p>
        </div>
        <div className="feature-card">
          <span className="icon">🛡️</span>
          <h3>Semantic Analysis</h3>
          <p>Verify identifier declarations, track scoping rules, and build a type-checked symbol table.</p>
        </div>
        <div className="feature-card">
          <span className="icon">⚙️</span>
          <h3>Intermediate Representation</h3>
          <p>Translate AST into linearized Three-Address Code (TAC), laying the groundwork for optimizations.</p>
        </div>
        <div className="feature-card">
          <span className="icon">⚡</span>
          <h3>Optimization</h3>
          <p>Apply optimization techniques like constant folding and dead code elimination to improve performance.</p>
        </div>
        <div className="feature-card">
          <span className="icon">💾</span>
          <h3>Code Generation</h3>
          <p>Generate target pseudo-assembly code tailored to a simplified virtual stack machine architecture.</p>
        </div>
      </div>
    </section>
  );
};

export default Home;

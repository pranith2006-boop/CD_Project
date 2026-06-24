import React from 'react';
import './Documentation.css';

const Documentation = () => {
  return (
    <section className="page documentation">
      <h1>Documentation & Theory</h1>
      <p className="doc-intro">
        This interactive tool visualizes the sequential phases of a modern language compiler.
        Write a simple C-like script in the compiler workspace and trace how it is scanned, parsed, checked, optimized, and translated.
      </p>

      <div className="doc-section">
        <h2>
          <span className="step-number">1</span>
          Lexical Analysis (Scanning)
        </h2>
        <p>
          The lexical analyzer reads the input source code characters, groups them into logical sequences called lexemes, and classifies them into tokens (e.g. keywords, identifiers, operators, literals, and delimiters).
        </p>
        <ul>
          <li><strong>Keywords:</strong> Reserved terms like <code>int</code>, <code>float</code>, <code>return</code>, <code>if</code>, and <code>while</code>.</li>
          <li><strong>Identifiers:</strong> User-defined names for variables and functions.</li>
          <li><strong>Literals:</strong> Constant numeric values (integer or float).</li>
          <li><strong>Operators:</strong> Operations such as <code>+</code>, <code>-</code>, and <code>=</code>.</li>
        </ul>
      </div>

      <div className="doc-section">
        <h2>
          <span className="step-number">2</span>
          Syntax Analysis (Parsing)
        </h2>
        <p>
          The parser processes tokens and verifies them against the Context-Free Grammar (CFG) rules of the language. It structures tokens into a hierarchical representation called the Parse Tree or Abstract Syntax Tree (AST).
        </p>
        <ul>
          <li><strong>Grammar validation:</strong> Ensures brackets match and assignment expressions are grammatically correct.</li>
          <li><strong>Hierarchy creation:</strong> Builds logical execution hierarchies (e.g. Program contains Statements; Statements contain Expressions).</li>
        </ul>
      </div>

      <div className="doc-section">
        <h2>
          <span className="step-number">3</span>
          Semantic Analysis
        </h2>
        <p>
          Semantic analysis inspects the AST to ensure the code follows semantic constraints of the language. This includes tracking declared names (scoping rules) and checking operations for type correctness.
        </p>
        <ul>
          <li><strong>Symbol Table Generation:</strong> Stores declared variables, types, scope levels, and line numbers.</li>
          <li><strong>Scoping Validation:</strong> Verifies that every identifier is declared before it is referenced.</li>
          <li><strong>Type Checking:</strong> Confirms expressions have matching types (e.g. assigning an int to an int).</li>
        </ul>
      </div>

      <div className="doc-section">
        <h2>
          <span className="step-number">4</span>
          Intermediate Code Generation
        </h2>
        <p>
          A compiler translates the AST into a machine-independent intermediate language. A common form is Three-Address Code (TAC), which consists of instructions with at most three operands.
        </p>
        <ul>
          <li><strong>Linearization:</strong> Flattens nested expressions into sequence lines.</li>
          <li><strong>Temporaries:</strong> Creates temporary variables (e.g. <code>t0</code>, <code>t1</code>) to store intermediate operations.</li>
        </ul>
      </div>

      <div className="doc-section">
        <h2>
          <span className="step-number">5</span>
          Code Optimization
        </h2>
        <p>
          Optimizers analyze intermediate code to make it run faster and consume fewer resources, without altering the program's final output. Common techniques include:
        </p>
        <ul>
          <li><strong>Constant Folding:</strong> Evaluates constant operations at compile-time (e.g., <code>10 + 20</code> becomes <code>30</code>).</li>
          <li><strong>Dead Code Elimination:</strong> Removes instructions that calculate values that are never used.</li>
        </ul>
      </div>

      <div className="doc-section">
        <h2>
          <span className="step-number">6</span>
          Target Code Generation
        </h2>
        <p>
          The final compiler stage maps the optimized intermediate representation into machine instructions or assembly code for a specific target machine architecture.
        </p>
        <ul>
          <li><strong>Instruction Selection:</strong> Chooses appropriate processor instructions.</li>
          <li><strong>Register Allocation:</strong> Determines which CPU registers hold variables.</li>
        </ul>
      </div>
    </section>
  );
};

export default Documentation;

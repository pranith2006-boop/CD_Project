import React from 'react';
import './About.css';

const About = () => (
  <section className="page about">
    <h1>About This Tool</h1>
    <p>This educational web application was developed by engineering students to demonstrate the inner workings of a compiler. It visualises each phase of the compilation process for a simple C‑like language.</p>
    <p><strong>Why compiler phases matter?</strong> Understanding lexical analysis, parsing, semantic checks, optimisation and code generation is essential for any systems or language‑design course.</p>
  </section>
);

export default About;

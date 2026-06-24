import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar__logo">LexiParse Studio</div>
      <ul className="navbar__links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/compiler">Compiler</Link></li>
        <li><Link to="/documentation">Documentation</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>
    </nav>
  );
};

export default NavBar;

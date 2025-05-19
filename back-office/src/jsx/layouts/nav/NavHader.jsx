import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/// images
import logo from '../../../assets/images/logo-officiel-menufy-long.png';

export function NavMenuToggle() {
  setTimeout(() => {
    let mainwrapper = document.querySelector('#main-wrapper');
    if (mainwrapper.classList.contains('menu-toggle')) {
      mainwrapper.classList.remove('menu-toggle');
    } else {
      mainwrapper.classList.add('menu-toggle');
    }
  }, 200);
export function NavMenuToggle() {
  setTimeout(() => {
    let mainwrapper = document.querySelector('#main-wrapper');
    if (mainwrapper.classList.contains('menu-toggle')) {
      mainwrapper.classList.remove('menu-toggle');
    } else {
      mainwrapper.classList.add('menu-toggle');
    }
  }, 200);
}

const NavHader = () => {
  const [toggle, setToggle] = useState(false);
  return (
    <div className="nav-header">
      <Link to="/" className="brand-logo">
        <img className="logo-abbr" src={logo} alt="Logo MenuFy" />
      </Link>
  const [toggle, setToggle] = useState(false);
  return (
    <div className="nav-header">
      <Link to="/" className="brand-logo">
        <img className="logo-abbr" src={logo} alt="Logo MenuFy" />
      </Link>

      <div
        className="nav-control"
        onClick={() => {
          setToggle(!toggle);
          NavMenuToggle();
        }}
      >
        <div className={`hamburger ${toggle ? 'is-active' : ''}`}>
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
        </div>
      </div>
    </div>
  );
      <div
        className="nav-control"
        onClick={() => {
          setToggle(!toggle);
          NavMenuToggle();
        }}
      >
        <div className={`hamburger ${toggle ? 'is-active' : ''}`}>
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
        </div>
      </div>
    </div>
  );
};

export default NavHader;

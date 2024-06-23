import React, { useState, useCallback } from 'react';
import './SideMenu.css';
import HelpModal from './HelpModal';
import { debounce } from 'lodash';

const SideMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsOpen((prevState) => !prevState);
  }, []); 

  const toggleHelp = useCallback(() => {
    setIsHelpOpen((prevState) => !prevState);
  }, []);

  // Apply debounce to the actual click handlers (with immediate execution)
  const handleMenuClick = debounce(toggleMenu, 300, { leading: true }); 
  const handleHelpClick = debounce(toggleHelp, 300, { leading: true }); 

  return (
    <div>
      <div className={`side-menu ${isOpen ? 'open' : ''}`}>
        <div className="menu-icon" onClick={handleMenuClick}>
          <React.Suspense fallback={<div>Loading...</div>}>
            <LazyFaBars />
          </React.Suspense>
        </div>
        <div className="menu-content">
          <h2>Help & Contacts</h2>
          <ul>
            <li>
              <React.Suspense fallback={<div>Loading...</div>}>
                <LazyFaPhone /> <a href="tel:+263771420909">+263771420909</a>
              </React.Suspense>
            </li>
            <li>
              <React.Suspense fallback={<div>Loading...</div>}>
                <LazyFaWhatsapp /> <a href="https://wa.me/263771420909" target="_blank" rel="noopener noreferrer">WhatsApp</a>
              </React.Suspense>
            </li>
            <li>
              <React.Suspense fallback={<div>Loading...</div>}>
                <LazyFaEnvelope /> <a href="mailto:faraih68@gmail.com">faraih68@gmail.com</a>
              </React.Suspense>
            </li>
            <li>
              <React.Suspense fallback={<div>Loading...</div>}>
                <LazyFaQuestionCircle /> <button onClick={handleHelpClick}>Help</button>
              </React.Suspense>
            </li>
          </ul>
        </div>
      </div>

      {isHelpOpen && <HelpModal toggleHelp={toggleHelp} />}
    </div>
  );
};

// Lazy load icons
const LazyFaBars = React.lazy(() => import('react-icons/fa').then(module => ({ default: module.FaBars })));
const LazyFaPhone = React.lazy(() => import('react-icons/fa').then(module => ({ default: module.FaPhone })));
const LazyFaWhatsapp = React.lazy(() => import('react-icons/fa').then(module => ({ default: module.FaWhatsapp })));
const LazyFaEnvelope = React.lazy(() => import('react-icons/fa').then(module => ({ default: module.FaEnvelope })));
const LazyFaQuestionCircle = React.lazy(() => import('react-icons/fa').then(module => ({ default: module.FaQuestionCircle })));

export default SideMenu;
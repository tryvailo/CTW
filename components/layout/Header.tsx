'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// Menu Icon
const MenuIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

// X Icon
const XIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" x2="6" y1="6" y2="18" />
    <line x1="6" x2="18" y1="6" y2="18" />
  </svg>
);

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const navigationLinks = [
    { label: 'Home', href: '/' },
    { label: 'Procedures', href: '/procedures' },
    { label: 'FAQ', href: '/faq' },
    { label: 'About', href: '/about' },
  ];

  return (
    <header className="bg-white border-b-2 border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link 
          href="/"
          className="flex items-center space-x-2 cursor-pointer"
        >
          <div className="bg-elderly-primary text-white font-bold p-2 rounded text-xl">CW</div>
          <span className="text-elderly-xl font-bold text-elderly-text">Compare The Wait</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          {navigationLinks.map(link => (
            <Link 
              key={link.label} 
              href={link.href}
              className="text-elderly-base font-medium text-gray-700 hover:text-elderly-primary hover:underline underline-offset-4"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-elderly-primary min-h-touch"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <XIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 shadow-lg">
          <nav className="flex flex-col p-4 space-y-2">
            {navigationLinks.map(link => (
              <Link 
                key={link.label} 
                href={link.href}
                className="block px-4 py-4 text-elderly-lg font-medium text-gray-800 hover:bg-blue-50 hover:text-elderly-primary rounded-lg transition-colors border-b border-gray-50 last:border-0 min-h-touch flex items-center"
                onClick={handleLinkClick}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};


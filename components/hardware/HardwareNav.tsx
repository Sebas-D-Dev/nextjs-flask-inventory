'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import './HardwareNav.css';

export default function HardwareNav() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="hardware-nav-container">
      <button onClick={toggleMenu} className="hardware-nav-toggle">
        Navigation ☰
      </button>
      <nav className={`hardware-nav-menu ${isOpen ? 'open' : ''}`}>
        <Link href="/home/hardware" className="hardware-nav-link" onClick={() => setIsOpen(false)}>All Hardware</Link>
        <Link href="/home/hardware/computers" className="hardware-nav-link" onClick={() => setIsOpen(false)}>Computers</Link>
        <Link href="/home/hardware/devices" className="hardware-nav-link" onClick={() => setIsOpen(false)}>Devices</Link>
        <Link href="/home/hardware/printers" className="hardware-nav-link" onClick={() => setIsOpen(false)}>Printers</Link>
        <Link href="/home/hardware/audio" className="hardware-nav-link" onClick={() => setIsOpen(false)}>Audio</Link>
        <Link href="/home/hardware/video" className="hardware-nav-link" onClick={() => setIsOpen(false)}>Video</Link>
        <div className="hardware-nav-separator"></div>
        <Link href="/home/software" className="hardware-nav-link" onClick={() => setIsOpen(false)}>Software</Link>
        <Link href="/home/assignments" className="hardware-nav-link" onClick={() => setIsOpen(false)}>Assignments</Link>
        <Link href="/home/loaned-devices" className="hardware-nav-link" onClick={() => setIsOpen(false)}>Loaned Devices</Link>
        <Link href="/home/pending-removals" className="hardware-nav-link" onClick={() => setIsOpen(false)}>Pending Removals</Link>
      </nav>
    </div>
  );
}

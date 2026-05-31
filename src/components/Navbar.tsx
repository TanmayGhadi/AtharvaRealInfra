"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoGold}>ATHARVA</span> REAL INFRA
        </Link>
        
        <nav className={`${styles.navLinks} ${mobileMenuOpen ? styles.mobileOpen : ""}`}>
          <Link href="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link href="/properties" onClick={() => setMobileMenuOpen(false)}>Properties</Link>
          <div className={styles.dropdown}>
            <span>Locations ▼</span>
            <div className={styles.dropdownContent}>
              <Link href="/locations/dodamarg" onClick={() => setMobileMenuOpen(false)}>Dodamarg</Link>
              <Link href="/locations/sawantwadi" onClick={() => setMobileMenuOpen(false)}>Sawantwadi</Link>
              <Link href="/locations/vengurla" onClick={() => setMobileMenuOpen(false)}>Vengurla</Link>
              <Link href="/locations/kudal" onClick={() => setMobileMenuOpen(false)}>Kudal</Link>
              <Link href="/locations/kankavli" onClick={() => setMobileMenuOpen(false)}>Kankavli</Link>
            </div>
          </div>
          <Link href="/about" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
          <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
        </nav>

        <div className={styles.navActions}>
          <a href="tel:+910000000000" className={styles.callBtn}>Call Us</a>
          <button 
            className={styles.mobileToggle} 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}

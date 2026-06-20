"use client";

import Link from "next/link";
import Image from "next/image";
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
          <Image src="/logo.jpg" alt="Atharva Real Infra Logo" width={50} height={50} className={styles.logoImage} />
          <span style={{ marginLeft: '10px' }}><span className={styles.logoGold}>ATHARVA</span> REAL INFRA</span>
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
              <Link href="/locations/malvan" onClick={() => setMobileMenuOpen(false)}>Malvan</Link>
              <Link href="/locations/vaibhavwadi" onClick={() => setMobileMenuOpen(false)}>Vaibhavwadi</Link>
            </div>
          </div>
          <Link href="/about" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
          <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
        </nav>

        <div className={styles.navActions}>
          <a href={`tel:${process.env.NEXT_PUBLIC_CONTACT_PHONE || '+918788818163'}`} className={styles.callBtn}>Call Us</a>
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

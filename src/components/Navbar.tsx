"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const isActive = (path: string) => pathname === path;
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <>
      {mobileMenuOpen && (
        <div 
          className={styles.backdrop} 
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
      <header className={`${styles.navbar} ${scrolled || isAdmin ? styles.scrolled : ""}`}>
        <div className={styles.navContainer}>
          <Link href="/" className={styles.logo}>
            <Image src="/logo.jpg" alt="Atharva Real Infra Logo" width={42} height={42} className={styles.logoImage} />
            <span><span className={styles.logoGold}>ATHARVA</span> REAL INFRA</span>
          </Link>
          
          <nav className={`${styles.navLinks} ${mobileMenuOpen ? styles.mobileOpen : ""}`}>
            <Link href="/" className={isActive("/") ? styles.active : ""} onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link href="/properties" className={isActive("/properties") ? styles.active : ""} onClick={() => setMobileMenuOpen(false)}>Properties</Link>
            
            <div className={styles.dropdown}>
              <span className={pathname.startsWith("/locations") ? styles.active : ""}>Locations ▼</span>
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
            
            <Link href="/about" className={isActive("/about") ? styles.active : ""} onClick={() => setMobileMenuOpen(false)}>About Us</Link>
            <Link href="/contact" className={isActive("/contact") ? styles.active : ""} onClick={() => setMobileMenuOpen(false)}>Contact</Link>
          </nav>

          <div className={styles.navActions}>
            <a href="tel:+918788818163" className={styles.callBtn}>Call Us</a>
            <button 
              className={styles.mobileToggle} 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

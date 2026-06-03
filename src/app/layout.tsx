import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIConsultant from "@/components/AIConsultant";
import ScrollReveal from "@/components/ScrollReveal";
import FloatingContacts from "@/components/FloatingContacts";

export const metadata: Metadata = {
  title: "Atharva Real Infra | Premium Real Estate & Land Opportunities",
  description: "Luxury real estate, premium agricultural land, and investment opportunities in Sindhudurg (Dodamarg, Sawantwadi, Vengurla, Kudal, Kankavli).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning>
        <Navbar />
        <main className="page-enter">{children}</main>
        <Footer />
        <FloatingContacts />
        <AIConsultant />
        <ScrollReveal />
      </body>
    </html>
  );
}


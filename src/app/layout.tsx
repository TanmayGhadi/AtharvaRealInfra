import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIConsultant from "@/components/AIConsultant";
import ScrollReveal from "@/components/ScrollReveal";
import FloatingContacts from "@/components/FloatingContacts";

export const metadata: Metadata = {
  title: {
    template: "%s | Atharva Real Infra",
    default: "Premium Agricultural Land Investment | Atharva Real Infra",
  },
  description: "Invest in premium agricultural and NA plots near Sindhudurg, Mopa Airport and Goa. Trusted land investment opportunities.",
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


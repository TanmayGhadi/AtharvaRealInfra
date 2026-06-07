import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIConsultant from "@/components/AIConsultant";
import ScrollReveal from "@/components/ScrollReveal";
import FloatingContacts from "@/components/FloatingContacts";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.atharvarealinfra.com'),
  title: {
    template: "%s | Atharva Real Infra",
    default: "Premium Agricultural Land Investment | Atharva Real Infra",
  },
  description: "Invest in premium agricultural and NA plots near Sindhudurg, Mopa Airport and Goa. Trusted land investment opportunities in Maharashtra.",
  keywords: ["Agricultural land near Goa", "Land investment near Goa", "Mopa Airport investment plots", "Agricultural plots in Sindhudurg", "NA plots near Goa", "Farm land for sale in Konkan", "Real estate investment in Sindhudurg", "Premium land investment Maharashtra", "Property near Mopa Airport"],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.atharvarealinfra.com',
    title: 'Premium Agricultural Land Investment | Atharva Real Infra',
    description: 'Invest in premium agricultural and NA plots near Sindhudurg, Mopa Airport and Goa. Trusted land investment opportunities.',
    siteName: 'Atharva Real Infra',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Premium Agricultural Land Investment | Atharva Real Infra',
    description: 'Invest in premium agricultural and NA plots near Sindhudurg, Mopa Airport and Goa. Trusted land investment opportunities.',
  },
  alternates: {
    canonical: 'https://www.atharvarealinfra.com',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-KTMGRHQJ');
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              "name": "Atharva Real Infra",
              "url": "https://www.atharvarealinfra.com",
              "logo": "https://www.atharvarealinfra.com/logo.jpg",
              "description": "Premium agricultural and NA plots near Sindhudurg, Mopa Airport, and Goa.",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Sindhudurg",
                "addressRegion": "Maharashtra",
                "addressCountry": "IN"
              },
              "telephone": "+917843097793",
              "email": "info@atharvarealinfra.com"
            })
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KTMGRHQJ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
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


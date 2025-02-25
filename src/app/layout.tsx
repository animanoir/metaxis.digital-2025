import type { Metadata } from "next";
import { Geist, Geist_Mono, Courier_Prime, Montserrat, Lora, Karla } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import NewsletterForm from "@/components/newsletterForm/NewsletterForm";
import { ReactLenis } from "lenis/react";
import amalgalmasImg from '@/app/assets/images/amalgalmas.jpg';

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

const courierPrime = Courier_Prime({
  variable: "--font-courier-prime",
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  ),
  title: {
    default: 'metaxis.digital',
    template: '%s | metaxis.digital',
  },
  description: 'Biblioteca de pdfs/epubs sobre artes, ciencias y filosofías y blog enfocado en lo meta(moderno), futurista y el qualiadigma.',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: '/',
    siteName: 'metaxis.digital',
    images: [{ url: amalgalmasImg.src }]

  },
  twitter: {
    card: 'summary_large_image',
    site: '@metaxis_digital',
    images: [{ url: amalgalmasImg.src }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} ${courierPrime.variable} ${lora.variable} ${karla.variable}  antialiased  bg-gray-50`}
      >
        <ReactLenis root>
          <Navbar />

          <main className="mb-48" >
            <div className="vertical-line-left border-black" />
            {children}
            <div className="vertical-line-right border-black" />

          </main>
          <NewsletterForm />
          <Footer />
        </ReactLenis>
      </body>
    </html >
  );
}

import type { Metadata } from "next";
import { Space_Grotesk, Manrope } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { SmoothScrollProvider } from "@/providers/SmoothScrollProvider";
import { CartProvider } from "@/providers/CartProvider";
import { CartDrawer } from "@/components/ui/CartDrawer";
import { Preloader } from "@/components/ui/Preloader";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

/* ── HUSTLERS type system ── "MONO" minimal
   Space Grotesk = clean geometric display (AI-product feel)
   Manrope = premium body/UI · Space Grotesk = tracked micro-labels.
   CSS exposes legacy aliases (--font-bebas-neue / -oswald / -inter)
   that point at these, so existing inline styles keep working. */
const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const condensed = Space_Grotesk({
  variable: "--font-condensed",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Hustlers Gym Lahore — Best Gym in Johar Town",
    template: "%s | Hustlers Gym Lahore",
  },
  description:
    "Hustlers Gym is the best gym in Johar Town, Lahore — elite coaching, championship-grade equipment, ladies section, and affordable gym memberships in Lahore. Join today.",
  keywords: [
    "best gym in Lahore",
    "Hustlers gym Lahore",
    "gym in Johar Town Lahore",
    "best gym in Johar Town",
    "gym membership Lahore",
    "personal trainer Lahore",
    "fitness center Lahore",
    "Hustlers gym pk",
    "ladies gym Lahore",
    "gym near me Lahore",
  ],
  authors: [{ name: "Hustlers Gym" }],
  creator: "Hustlers Gym",
  publisher: "Hustlers Gym",
  metadataBase: new URL("https://hustlersgym.pk"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: "https://hustlersgym.pk",
    siteName: "Hustlers Gym Lahore",
    title: "Hustlers Gym — Best Gym in Johar Town, Lahore",
    description:
      "Hustlers Gym is Lahore's top fitness club in Johar Town — elite coaching, championship equipment, ladies section & flexible gym memberships.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Hustlers Gym — Best Gym in Johar Town, Lahore",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hustlers Gym — Best Gym in Johar Town, Lahore",
    description:
      "Elite coaching, championship-grade equipment & ladies section at Johar Town's best gym. Affordable gym memberships in Lahore.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${condensed.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground m-0 p-0">
        <ThemeProvider>
          <CartProvider>
            <SmoothScrollProvider>
              <Preloader />
              {children}
              <CartDrawer />
              <WhatsAppButton />
            </SmoothScrollProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

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
  title: "HUSTLERS — Premium Fitness Club",
  description:
    "Outwork everyone. Train at HUSTLERS — Pakistan's premium fitness club with elite coaching, championship-grade equipment, supplements and two premium locations in Lahore.",
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

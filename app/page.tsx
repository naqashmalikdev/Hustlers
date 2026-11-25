import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
// import { Trainers } from "@/components/sections/Trainers";
// import { FatLossClasses } from "@/components/sections/FatLossClasses";
// import { SteamSauna } from "@/components/sections/SteamSauna";
import { Supplements } from "@/components/sections/Supplements";
import { Branches } from "@/components/sections/Branches";
import { Timetable } from "@/components/sections/Timetable";
import { Contact } from "@/components/sections/Contact";
import { SeoContent } from "@/components/sections/SeoContent";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "HealthClub",
  name: "Hustlers Gym",
  alternateName: "Hustlers Gym Johar Town Lahore",
  url: "https://hustlersgym.pk",
  logo: "https://hustlersgym.pk/logo.png",
  image: "https://hustlersgym.pk/images/og-image.jpg",
  description:
    "Hustlers Gym is the best gym in Johar Town, Lahore — elite coaching, championship-grade equipment, ladies section, and affordable gym memberships.",
  telephone: "+92-336-4404573",
  email: "lakecity@hustlers.pk",
  address: {
    "@type": "PostalAddress",
    streetAddress: "876 & 877 R1, Johar Town",
    addressLocality: "Lahore",
    addressRegion: "Punjab",
    postalCode: "54000",
    addressCountry: "PK",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 31.4550032,
    longitude: 74.275349,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "00:00",
      closes: "23:59",
    },
  ],
  priceRange: "PKR 6,000 – PKR 13,000/month",
  currenciesAccepted: "PKR",
  paymentAccepted: "Cash",
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Ladies Section", value: true },
    { "@type": "LocationFeatureSpecification", name: "Personal Training", value: true },
    { "@type": "LocationFeatureSpecification", name: "Group Classes", value: true },
    { "@type": "LocationFeatureSpecification", name: "Parking", value: true },
    { "@type": "LocationFeatureSpecification", name: "Locker Rooms", value: true },
    { "@type": "LocationFeatureSpecification", name: "Supplement Store", value: true },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "800",
    bestRating: "5",
  },
  sameAs: [
    "https://www.instagram.com/hustlers.pk",
    "https://www.facebook.com/hustlers.pk",
  ],
};

export const metadata = {
  title: "Hustlers Gym Lahore — Best Gym in Johar Town",
  description:
    "Hustlers Gym is the best gym in Johar Town, Lahore — elite coaching, championship-grade equipment, ladies section & affordable memberships. Join today.",
  alternates: {
    canonical: "https://hustlersgym.pk",
  },
  openGraph: {
    title: "Hustlers Gym Lahore — Best Gym in Johar Town",
    description:
      "Lahore's top fitness club in Johar Town — elite coaches, championship equipment, ladies section & flexible memberships.",
    url: "https://hustlersgym.pk",
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <Navbar />
      <main>
        <Hero />
        {/* <Trainers /> */}
        {/* <FatLossClasses /> */}
        {/* <SteamSauna /> */}
        <Branches />
        <Timetable />
        <SeoContent />
        <Supplements />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

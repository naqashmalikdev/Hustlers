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

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        {/* <Trainers /> */}
        {/* <FatLossClasses /> */}
        {/* <SteamSauna /> */}
        <Branches />
        <Timetable />
        <Supplements />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

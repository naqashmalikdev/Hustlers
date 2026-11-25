export function SeoContent() {
  return (
    <section
      className="border-t border-border bg-background"
      aria-label="About Hustlers Gym"
    >
      <div className="max-w-screen-2xl mx-auto px-6 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">

          {/* Left — headline block */}
          <div className="lg:col-span-4">
            <span className="chip mb-6 inline-flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 bg-primary" />
              About Hustlers Gym
            </span>
            <h2
              className="text-foreground uppercase leading-[0.88] tracking-[-0.02em]"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(2rem, 4vw, 3.25rem)",
              }}
            >
              The Best<br />
              <span className="text-primary">Gym in</span><br />
              Lahore
            </h2>
            <p className="mt-6 text-sm text-muted-foreground leading-relaxed">
              Hustlers Gym, Johar Town — built for athletes, beginners, and everyone in between.
            </p>

            <ul className="mt-8 flex flex-col gap-3 text-sm text-muted-foreground">
              {[
                "2,000+ active gym members",
                "12+ certified coaches & personal trainers",
                "Dedicated ladies-only section",
                "Championship-grade equipment",
                "In-house supplement store",
                "Flexible gym membership plans",
              ].map((fact) => (
                <li key={fact} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {fact}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — body copy */}
          <div className="lg:col-span-8 flex flex-col gap-5 text-[15px] text-muted-foreground leading-[1.85]">
            <p>
              <strong className="text-foreground">Hustlers Gym</strong> is Lahore&rsquo;s premier fitness
              centre, located in the heart of{" "}
              <strong className="text-foreground">Johar Town, Lahore</strong>. Whether you are a first-time
              gym-goer or a seasoned athlete, our facility is designed to push your limits and deliver real
              results. With over 2,000 active members and a team of 12+ elite coaches, we have earned the
              reputation as the{" "}
              <strong className="text-foreground">best gym in Lahore</strong> — and we intend to keep it
              that way.
            </p>

            <p>
              Our <strong className="text-foreground">gym membership in Lahore</strong> is one of the most
              affordable in the city, with flexible plans starting at PKR 6,000/month for ladies and PKR
              7,000/month for regular members. Couple plans and multi-month packages are also available, and
              registration is 100% free — walk in any day Monday through Saturday, we are open 24 hours.
            </p>

            <p>
              What sets us apart from every other{" "}
              <strong className="text-foreground">fitness centre in Lahore</strong> is our commitment to
              the complete fitness experience. Our facility houses championship-grade free weights,
              resistance machines, functional training zones, and a fully equipped cardio floor. We also
              offer a{" "}
              <strong className="text-foreground">dedicated ladies section</strong> with daily co-ed
              morning and evening timings, plus an exclusive ladies-only block from 11:00 AM to 4:00 PM,
              complete with a free group fitness class every day.
            </p>

            <p>
              Our certified{" "}
              <strong className="text-foreground">personal trainers in Lahore</strong> create custom
              workout and nutrition plans tailored to your specific goals — whether that is fat loss,
              muscle gain, strength building, or overall wellness. Group classes including HIIT, circuit
              training, and cardio burn sessions run daily, giving every member access to professional
              coaching regardless of their membership tier.
            </p>

            <p>
              Located at{" "}
              <strong className="text-foreground">
                876 &amp; 877 R1, Johar Town, Lahore — near KIPS Academy
              </strong>
              , Hustlers Gym is easily accessible from Garden Town, Model Town, Gulberg, Faisal Town, and
              Township. Ample parking is available on-site. We also stock a premium in-house{" "}
              <strong className="text-foreground">supplement store</strong> with protein, pre-workout,
              recovery, and vitamins so you never have to shop elsewhere.
            </p>

            <p>
              If you are searching for the{" "}
              <strong className="text-foreground">best gym in Johar Town Lahore</strong>, look no further.
              Visit us for a free tour, and see why thousands of Lahoris choose Hustlers Gym as their
              fitness home. Call us at{" "}
              <a href="tel:+923364404573" className="text-primary hover:underline">
                +92 336 4404573
              </a>{" "}
              or message us on WhatsApp to get started today.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

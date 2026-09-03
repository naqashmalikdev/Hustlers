"use client";

import Link from "next/link";
import { Phone, MapPin, Clock } from "@/components/ui/animated-icons";

const WA_NUMBER = "923364404573";
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hello! I'd like to know more about joining Hustlers Gym.")}`;
const MAPS_URL = "https://maps.app.goo.gl/YvQWJ9SyqYCsg1sh7";

function WhatsAppIcon() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

const infoItems = [
  { icon: Phone,  label: "Phone",    value: "+92 336 4404573" },
  { icon: MapPin, label: "Location", value: "876 & 877 R1, Johar Town, Lahore", href: MAPS_URL },
  { icon: Clock,  label: "Hours",    value: "Mon–Sat: 6:00 AM – 12:00 AM | Closed Sunday" },
];

export function Contact() {
  return (
    <section id="contact" className="border-t border-border" aria-label="Contact Us">
      <div className="max-w-screen-2xl mx-auto px-6 pt-24 pb-24">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <span className="chip">
            <span className="inline-block h-1.5 w-1.5 bg-primary" />
            Get in Touch
          </span>
          <span className="font-mono text-[11px] text-muted-foreground">[ JOHAR TOWN, LAHORE ]</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 pt-10 pb-10 items-end">
          <h2
            className="lg:col-span-8 text-foreground uppercase leading-[0.82] tracking-[-0.03em]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(56px, 11vw, 150px)" }}
          >
            Contact<span style={{ color: "transparent", WebkitTextStroke: "1.5px var(--primary)" }}>Us</span>
          </h2>
          <p className="lg:col-span-4 text-muted-foreground text-[15px] leading-relaxed lg:pb-3">
            Questions about membership or classes? Reach out — we reply fast on WhatsApp.
          </p>
        </div>

        {/* Card */}
        <div className="border border-border rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* Info */}
            <div className="flex flex-col divide-y divide-border border-b lg:border-b-0 lg:border-r border-border">
              {infoItems.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4 px-7 py-6">
                  <span className="w-9 h-9 rounded-lg border border-border flex items-center justify-center shrink-0 text-foreground mt-0.5">
                    <Icon size={14} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-muted-foreground text-[9px] tracking-[0.25em] uppercase mb-1.5" style={{ fontFamily: "var(--font-oswald)" }}>
                      {label}
                    </p>
                    {href ? (
                      <Link
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground text-sm leading-snug underline underline-offset-2 decoration-border hover:decoration-foreground transition-colors duration-200"
                      >
                        {value}
                      </Link>
                    ) : (
                      <p className="text-foreground text-sm leading-snug">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <div className="flex flex-col items-center justify-center gap-6 px-10 py-14 text-center">
              <div className="w-16 h-16 rounded-full bg-[#25D366]/10 border border-[#25D366]/30 flex items-center justify-center text-[#25D366]">
                <WhatsAppIcon />
              </div>

              <div>
                <p
                  className="text-foreground uppercase tracking-widest mb-2"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(22px, 3vw, 32px)" }}
                >
                  Message Us Here
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
                  Tap below to chat with us on WhatsApp. Ask about membership, pricing, or anything else.
                </p>
              </div>

              <Link
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#25D366] text-white font-bold text-[13px] tracking-[0.15em] uppercase rounded-xl hover:-translate-y-0.5 hover:brightness-110 transition-all duration-200 shadow-[0_8px_28px_-6px_rgba(37,211,102,0.5)] cursor-pointer"
                style={{ fontFamily: "var(--font-condensed)" }}
              >
                <WhatsAppIcon />
                Chat on WhatsApp
              </Link>

              <p className="text-muted-foreground text-xs">+92 336 4404573</p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

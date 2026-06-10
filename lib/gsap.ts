import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// SplitText is a GSAP Club plugin — use a safe dynamic import guard
// so the build doesn't break if not licensed.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

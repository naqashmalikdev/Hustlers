/**
 * Page scroll lock shared by overlays (cart drawer, etc.). Adds `.scroll-locked`
 * to <html> to stop the page scrolling while an overlay is open. The native
 * scrollbar is already hidden site-wide (see globals.css), so there's nothing to
 * compensate for. Ref-counted so two overlays open at once don't unlock early.
 */
let locks = 0;

export function lockScroll() {
  if (typeof document === "undefined") return;
  locks += 1;
  if (locks === 1) document.documentElement.classList.add("scroll-locked");
}

export function unlockScroll() {
  if (typeof document === "undefined") return;
  locks = Math.max(0, locks - 1);
  if (locks === 0) document.documentElement.classList.remove("scroll-locked");
}

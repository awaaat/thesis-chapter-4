// src/components/ScrollToTop/ScrollToTop.jsx
// Ensures every route change starts at the top of the page, regardless of
// which page the user is navigating from or how far they had scrolled.
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // "instant" (not "smooth") so the jump happens before the next page paints —
    // matches default browser navigation behavior instead of animating past content.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

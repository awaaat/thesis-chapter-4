// Drop-in replacement for the parts of framer-motion this site used.
// Renders plain elements and ignores every animation prop, so the UI is static.
import { createElement, forwardRef, Fragment } from "react";

const STRIP = new Set([
  "initial", "animate", "exit", "variants", "transition", "whileInView", "whileHover",
  "whileTap", "whileFocus", "whileDrag", "viewport", "layout", "layoutId", "custom",
  "onAnimationComplete", "onViewportEnter", "onViewportLeave", "drag",
]);
const cache = {};
function make(tag) {
  return forwardRef(function Plain(props, ref) {
    const clean = {};
    for (const k in props) if (!STRIP.has(k)) clean[k] = props[k];
    return createElement(tag, { ...clean, ref });
  });
}

export const motion = new Proxy({}, { get: (_, tag) => (cache[tag] ||= make(tag)) });
export const AnimatePresence = ({ children }) => createElement(Fragment, null, children);
export const useReducedMotion = () => true;
export const useInView = () => true;

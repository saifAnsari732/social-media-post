"use client";

import { useEffect, useState, useRef } from "react";

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  // Position references for smooth 60fps lerp
  const mousePos = useRef({ x: -100, y: -100 });
  const cursorDotPos = useRef({ x: -100, y: -100 });
  const cursorRingPos = useRef({ x: -100, y: -100 });

  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const rafId = useRef(null);

  useEffect(() => {
    // Only enable on desktop with fine mouse pointer (disable on touch screens)
    if (typeof window === "undefined") return;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    setMounted(true);

    const onMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);

      // Check if hovering over clickable / interactive elements
      const target = e.target;
      if (target) {
        const interactive = target.closest(
          'a, button, input, select, textarea, [role="button"], [role="switch"], .cursor-pointer, .interactive-hover'
        );
        setIsHovering(Boolean(interactive));
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setVisible(false);
    const onMouseEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown, { passive: true });
    window.addEventListener("mouseup", onMouseUp, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    // Smooth Lerp Animation Loop
    const animate = () => {
      // Dot moves fast (instant tracking)
      cursorDotPos.current.x += (mousePos.current.x - cursorDotPos.current.x) * 0.45;
      cursorDotPos.current.y += (mousePos.current.y - cursorDotPos.current.y) * 0.45;

      // Ring moves with smooth trailing inertia
      cursorRingPos.current.x += (mousePos.current.x - cursorRingPos.current.x) * 0.18;
      cursorRingPos.current.y += (mousePos.current.y - cursorRingPos.current.y) * 0.18;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${cursorDotPos.current.x}px, ${cursorDotPos.current.y}px, 0)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${cursorRingPos.current.x}px, ${cursorRingPos.current.y}px, 0)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [visible]);

  if (!mounted) return null;

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-50 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden="true"
    >
      {/* Outer Soft Trailing Aura Ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 -ml-5 -mt-5 rounded-full transition-all duration-200 ease-out will-change-transform ${
          isClicking
            ? "w-8 h-8 -ml-4 -mt-4 bg-indigo-500/25 border border-indigo-400/50 scale-90"
            : isHovering
            ? "w-14 h-14 -ml-7 -mt-7 bg-indigo-600/15 border border-indigo-500/40 backdrop-blur-[1px] shadow-lg shadow-indigo-500/20 scale-110"
            : "w-10 h-10 -ml-5 -mt-5 bg-indigo-500/10 border border-indigo-400/30 shadow-md shadow-indigo-500/10"
        }`}
      />

      {/* Inner Precision Dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 -ml-1 -mt-1 rounded-full will-change-transform transition-all duration-150 ${
          isClicking
            ? "w-2.5 h-2.5 -ml-1.25 -mt-1.25 bg-pink-500 shadow-sm shadow-pink-500"
            : isHovering
            ? "w-2 h-2 -ml-1 -mt-1 bg-indigo-600 shadow-sm shadow-indigo-600 ring-2 ring-white/60 scale-125"
            : "w-2 h-2 bg-indigo-600 shadow-sm shadow-indigo-600/80"
        }`}
      />
    </div>
  );
}

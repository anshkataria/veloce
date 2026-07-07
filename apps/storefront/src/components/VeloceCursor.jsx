import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import VeloceArrow from "./VeloceArrow";

const MotionDiv = motion.div;

export default function VeloceCursor() {
  const shouldReduceMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [pointerInside, setPointerInside] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [hoverMode, setHoverMode] = useState("default");
  const pointerInsideRef = useRef(false);
  const hoverModeRef = useRef("default");
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const ringX = useSpring(mouseX, { stiffness: 300, damping: 34, mass: 0.55 });
  const ringY = useSpring(mouseY, { stiffness: 300, damping: 34, mass: 0.55 });

  useEffect(() => {
    if (shouldReduceMotion) return undefined;

    const query = window.matchMedia("(pointer: fine)");
    const updateEnabled = () => setEnabled(query.matches);
    updateEnabled();
    query.addEventListener("change", updateEnabled);

    const handleMove = (event) => {
      if (!pointerInsideRef.current) {
        pointerInsideRef.current = true;
        setPointerInside(true);
      }

      const target = event.target instanceof Element ? event.target : null;
      const explicitCursor = target?.closest("[data-cursor]");
      const interactive = target?.closest("a,button,input,select,textarea");
      const nextMode = explicitCursor?.dataset.cursor || (interactive ? "link" : "default");

      if (hoverModeRef.current !== nextMode) {
        hoverModeRef.current = nextMode;
        setHoverMode(nextMode);
      }

      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
    };

    const handleLeave = () => {
      pointerInsideRef.current = false;
      hoverModeRef.current = "default";
      setPointerInside(false);
      setHoverMode("default");
    };
    const handleVisibilityChange = () => {
      if (document.hidden) handleLeave();
    };
    const handleDown = () => setIsPressed(true);
    const handleUp = () => setIsPressed(false);

    document.addEventListener("pointermove", handleMove, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("pointerdown", handleDown);
    document.addEventListener("pointerup", handleUp);
    window.addEventListener("blur", handleLeave);

    return () => {
      query.removeEventListener("change", updateEnabled);
      document.removeEventListener("pointermove", handleMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("pointerdown", handleDown);
      document.removeEventListener("pointerup", handleUp);
      window.removeEventListener("blur", handleLeave);
    };
  }, [mouseX, mouseY, shouldReduceMotion]);

  if (!enabled || shouldReduceMotion || typeof document === "undefined") return null;

  const active = hoverMode !== "default";
  const visible = pointerInside;
  const ringSize =
    hoverMode === "explore" || hoverMode === "expand"
      ? 76
      : hoverMode === "view"
        ? 70
        : hoverMode === "search"
          ? 34
          : active
            ? 54
            : 40;
  const ringOffset = ringSize / 2;
  const cursorColor = active ? "var(--oxblood)" : "var(--ink)";
  const cursorSurface = active
    ? "color-mix(in srgb, var(--surface) 78%, var(--oxblood) 22%)"
    : "color-mix(in srgb, var(--surface) 82%, var(--ink) 18%)";

  return createPortal(
    <>
      <MotionDiv
        aria-hidden="true"
        className="pointer-events-none fixed left-[-4px] top-[-4px] z-[9999] hidden h-2 w-2 rounded-full border border-[var(--surface)] shadow-[0_0_0_1px_rgba(33,26,22,0.34),0_2px_10px_rgba(33,26,22,0.24)] md:block"
        style={{ x: mouseX, y: mouseY }}
        animate={{
          opacity: visible ? 1 : 0,
          backgroundColor: cursorColor,
        }}
        transition={{ duration: 0.12 }}
      />
      <MotionDiv
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9997] hidden rounded-full md:block"
        style={{
          x: ringX,
          y: ringY,
          marginLeft: -(ringOffset + 5),
          marginTop: -(ringOffset + 5),
        }}
        animate={{
          width: ringSize + 10,
          height: ringSize + 10,
          opacity: visible ? 1 : 0,
          scale: isPressed ? 0.9 : 1,
          backgroundColor: active
            ? "color-mix(in srgb, var(--oxblood) 20%, transparent)"
            : "color-mix(in srgb, var(--surface) 34%, transparent)",
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />
      <MotionDiv
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9998] hidden items-center justify-center rounded-full border text-[9px] font-semibold uppercase tracking-[0.17em] shadow-[0_0_0_1px_rgba(248,245,239,0.82),0_10px_28px_rgba(33,26,22,0.24)] backdrop-blur-[5px] md:flex"
        style={{
          x: ringX,
          y: ringY,
          marginLeft: -ringOffset,
          marginTop: -ringOffset,
        }}
        animate={{
          width: ringSize,
          height: ringSize,
          opacity: visible ? 1 : 0,
          scale: isPressed ? 0.87 : 1,
          borderColor: cursorColor,
          backgroundColor: cursorSurface,
          color: cursorColor,
        }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        {hoverMode === "view" && <VeloceArrow className="w-7" />}
        {hoverMode === "explore" && "Explore"}
        {hoverMode === "expand" && "Expand"}
      </MotionDiv>
    </>,
    document.body,
  );
}

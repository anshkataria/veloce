import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";

const MotionMain = motion.main;

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, search]);

  return null;
}

export default function MainLayout() {
  const location = useLocation();
  const [showIntro, setShowIntro] = useState(() => {
    return sessionStorage.getItem("veloce_intro_seen") !== "true";
  });

  useEffect(() => {
    if (!showIntro) return;

    const timer = window.setTimeout(() => {
      sessionStorage.setItem("veloce_intro_seen", "true");
      setShowIntro(false);
    }, 950);

    return () => window.clearTimeout(timer);
  }, [showIntro]);

  return (
    <div className="min-h-screen flex flex-col text-gray-900">
      {showIntro && (
        <div className="veloce-intro" aria-hidden="true">
          <div className="veloce-intro__line" />
          <div className="veloce-intro__word">VELOCE</div>
        </div>
      )}
      <ScrollToTop />
      <Navbar />
      <AnimatePresence mode="wait" initial={false}>
        <MotionMain
          key={`${location.pathname}${location.search}`}
          className="flex-1"
          initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        >
          <Outlet />
        </MotionMain>
      </AnimatePresence>
      <Footer />
    </div>
  );
}

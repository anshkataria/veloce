import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, search]);

  return null;
}

export default function MainLayout() {
  const [showIntro, setShowIntro] = useState(() => {
    return sessionStorage.getItem("veloce_intro_seen") !== "true";
  });

  useEffect(() => {
    if (!showIntro) return;

    const timer = window.setTimeout(() => {
      sessionStorage.setItem("veloce_intro_seen", "true");
      setShowIntro(false);
    }, 2100);

    return () => window.clearTimeout(timer);
  }, [showIntro]);

  return (
    <div className="min-h-screen flex flex-col text-gray-900">
      {showIntro && (
        <div className="veloce-intro" aria-hidden="true">
          <div className="veloce-intro__line" />
          <div className="veloce-intro__word">VELOCE</div>
          <div className="veloce-intro__caption">Private Motor Atelier</div>
        </div>
      )}
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

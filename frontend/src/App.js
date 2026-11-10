import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Lenis from "lenis";
import { Toaster } from "sonner";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Programme from "@/pages/Programme";
import Speakers from "@/pages/Speakers";
import Exposants from "@/pages/Exposants";
import Partenaires from "@/pages/Partenaires";
import Inscription from "@/pages/Inscription";
import Media from "@/pages/Media";
import Editions from "@/pages/Editions";
import Contact from "@/pages/Contact";
import Legal from "@/pages/Legal";

function ScrollManager() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    let raf;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <LanguageProvider>
      <BrowserRouter>
        <ScrollManager />
        <div className="App min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/a-propos" element={<About />} />
              <Route path="/programme" element={<Programme />} />
              <Route path="/intervenants" element={<Speakers />} />
              <Route path="/exposants" element={<Exposants />} />
              <Route path="/partenaires" element={<Partenaires />} />
              <Route path="/inscription" element={<Inscription />} />
              <Route path="/confirmation/*" element={<Navigate to="/inscription" replace />} />
              <Route path="/media" element={<Media />} />
              <Route path="/editions" element={<Editions />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/mentions-legales" element={<Legal type="legal" />} />
              <Route path="/confidentialite" element={<Legal type="privacy" />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster position="top-center" richColors />
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;

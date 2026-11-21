import { useEffect } from "react";
import { HashRouter, Route, Routes, useLocation } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { BookingProvider } from "@/lib/store";
import Chrome from "@/components/Chrome";
import Home from "@/pages/Home";
import Experiences from "@/pages/Experiences";
import ExperienceDetail from "@/pages/ExperienceDetail";
import Transfers from "@/pages/Transfers";
import CruiseExcursions from "@/pages/CruiseExcursions";
import BuildYourTour from "@/pages/BuildYourTour";
import Booking from "@/pages/Booking";
import Confirmation from "@/pages/Confirmation";
import MyBooking from "@/pages/MyBooking";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import { Btn, Eyebrow } from "@/components/ui";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}

function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-40 text-center">
      <Eyebrow className="justify-center">404 · Off the map</Eyebrow>
      <h1 className="display-lg mt-5">This road doesn't go anywhere.</h1>
      <p className="mt-4 text-cocoa-2">The page you asked for is not part of the site — but the island is full of good routes.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Btn to="/" variant="solid">Back to home</Btn>
        <Btn to="/experiences" variant="outline">See experiences</Btn>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
    <BookingProvider>
      <HashRouter>
        <ScrollToTop />
        <Chrome>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/experiences" element={<Experiences />} />
            <Route path="/experiences/:slug" element={<ExperienceDetail />} />
            <Route path="/transfers" element={<Transfers />} />
            <Route path="/cruise-excursions" element={<CruiseExcursions />} />
            <Route path="/build-your-tour" element={<BuildYourTour />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/booking/confirmation" element={<Confirmation />} />
            <Route path="/my-booking" element={<MyBooking />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Chrome>
      </HashRouter>
    </BookingProvider>
    </MotionConfig>
  );
}

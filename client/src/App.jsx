import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import HomePage from "@/pages/HomePage";
import ShowsPage from "@/pages/ShowsPage";
import ScreensPage from "@/pages/ScreensPage";
import SeatsPage from "@/pages/SeatsPage";
import CustomersPage from "@/pages/CustomersPage";
import BookingsPage from "@/pages/BookingsPage";
import ReviewsPage from "@/pages/ReviewsPage";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
      <div className="text-8xl font-display font-black text-nb-ink">404</div>
      <p className="text-nb-ink/60 text-lg">Page not found</p>
      <a href="/" className="px-6 py-2.5 bg-nb-accent border-2 border-nb-ink rounded-xl font-bold hover:-translate-y-0.5 transition-all"
        style={{ boxShadow: "var(--shadow-nb-sm)" }}>
        Go Home
      </a>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/shows" element={<ShowsPage />} />
          <Route path="/screens" element={<ScreensPage />} />
          <Route path="/seats" element={<SeatsPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

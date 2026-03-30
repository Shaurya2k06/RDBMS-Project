import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-nb-bg">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t-2 border-nb-ink bg-nb-ink text-white/60 text-xs text-center py-4 font-body">
        <span className="text-white font-semibold">CineDB</span> · Cinema Booking Management System · RDBMS Project 2026
      </footer>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            border: "2px solid #111",
            boxShadow: "4px 4px 0 0 rgba(0,0,0,0.9)",
            borderRadius: "12px",
            fontFamily: "Inter, system-ui, sans-serif",
          },
        }}
      />
    </div>
  );
}

"use client";  // This tells Next.js that this is a client component.

import { useAuth } from "../components/AuthContext"
import Navbar from "./navBar";
import Backgrounds from "./(pages)/backgrounds/backgrounds";
import Footer from "./footer";

export default function ClientLayout({ children }) {
  const { loading } = useAuth(); // Access loading state from AuthContext

  if (loading) {
    return;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="min-h-screen flex flex-col relative overflow-hidden">
        <Backgrounds />
        {children}
      </main>
      <Footer />
    </div>
  );
}

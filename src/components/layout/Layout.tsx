import type { ReactNode } from "react";
import { Navbar } from "../navigation/Navbar";
import { Footer } from "./Footer";
import { PageTransition } from "../ui/PageTransition";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <main>
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </div>
  );
}

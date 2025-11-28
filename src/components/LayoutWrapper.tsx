"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./navbar/Navbar";
import Footer from "./footer/Footer";

interface LayoutWrapperProps {
  children: ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();

  // Pages where Navbar and Footer should be hidden
  const hideLayoutPaths = ["/login", "/register", "/create"];

  const shouldHideLayout = hideLayoutPaths.includes(pathname);

  return (
    <>
      {!shouldHideLayout && <Navbar />}
      {/* add top padding so fixed navbar doesn't overlap page content (only when navbar is shown) */}
      <main className={!shouldHideLayout ? "pt-24" : ""}>{children}</main>
      {!shouldHideLayout && <Footer />}
    </>
  );
}

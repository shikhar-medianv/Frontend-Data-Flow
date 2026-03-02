import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import StoreProvider from "./StoreProvider";

export const metadata: Metadata = {
  title: "Routing Example",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav style={{ display: "flex", gap: "15px", padding: "20px" }}>
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/contact/info">Contact Info</Link>
          <Link href="/todo">Todo</Link>
        </nav>
        <hr />
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ARCH // PORTFOLIO",
  description: "Brutalist architectural portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${robotoMono.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col selection:bg-foreground selection:text-background">
        <header className="fixed top-0 w-full flex justify-between p-4 mix-blend-difference z-50 text-background">
          <div className="font-bold text-xl uppercase tracking-tighter">ARCH // STUDIO</div>
          <nav className="font-mono text-sm uppercase flex gap-6">
            <a href="#work" className="hover:line-through">Work</a>
            <a href="#about" className="hover:line-through">About</a>
            <a href="#contact" className="hover:line-through">Contact</a>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t-2 border-foreground p-8 flex justify-between font-mono text-xs uppercase">
          <div>&copy; {new Date().getFullYear()} ARCH // STUDIO</div>
          <div>EST. 2026</div>
        </footer>
      </body>
    </html>
  );
}

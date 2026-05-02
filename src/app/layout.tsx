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
        <header className="fixed top-0 w-full flex flex-col md:flex-row justify-between p-4 md:p-5 z-50 text-foreground bg-background/90 backdrop-blur-md border-b-4 border-foreground shadow-sm items-center gap-4 md:gap-0">
          <div className="font-bold text-xl md:text-2xl uppercase tracking-tighter flex items-center gap-2">
            <span className="bg-foreground text-background px-2 py-1">ARCH</span> // STUDIO
          </div>
          <nav className="font-mono text-xs md:text-sm font-bold uppercase flex flex-wrap justify-center gap-4 md:gap-8 items-center">
            <a href="#work" className="hover:bg-foreground hover:text-background px-2 py-1 transition-colors border-2 border-transparent hover:border-foreground">Work</a>
            <a href="#about" className="hover:bg-foreground hover:text-background px-2 py-1 transition-colors border-2 border-transparent hover:border-foreground">About</a>
            <a href="#contact" className="hover:bg-foreground hover:text-background px-2 py-1 transition-colors border-2 border-transparent hover:border-foreground">Contact</a>
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

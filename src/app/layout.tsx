import type { Metadata } from "next";
import { Newsreader, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "The Investigation | Global News Intelligence",
  description: "Connecting global truths through AI-powered investigative journalism with relationship mapping and impact analysis",
  keywords: ["investigation", "news", "geopolitics", "supply chain", "global intelligence"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${newsreader.variable} ${inter.variable} antialiased min-h-screen`}
      >
        <Header />
        <main className="max-w-7xl mx-auto px-6 py-10">
          {children}
        </main>
        <Sidebar />
        <Footer />
      </body>
    </html>
  );
}

function Footer() {
  return (
    <footer className="bg-white border-t border-[var(--border)] mt-20 py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="col-span-1">
          <h2 className="text-2xl font-black italic mb-4">THE INVESTIGATION</h2>
          <p className="text-sm text-[var(--muted-foreground)] font-sans leading-relaxed">
            A specialized news hub dedicated to uncovering the intricate threads that connect global power, finance, and conflict.
          </p>
        </div>
        <div>
          <h5 className="text-xs font-bold uppercase font-sans mb-4 tracking-widest">Desk</h5>
          <ul className="text-sm text-[var(--muted-foreground)] space-y-2 font-sans">
            <li><a className="hover:text-[var(--primary)]" href="#">Global Security</a></li>
            <li><a className="hover:text-[var(--primary)]" href="#">Financial Crimes</a></li>
            <li><a className="hover:text-[var(--primary)]" href="#">Climate Impact</a></li>
            <li><a className="hover:text-[var(--primary)]" href="#">Technology Bridge</a></li>
          </ul>
        </div>
        <div>
          <h5 className="text-xs font-bold uppercase font-sans mb-4 tracking-widest">The Board</h5>
          <ul className="text-sm text-[var(--muted-foreground)] space-y-2 font-sans">
            <li><a className="hover:text-[var(--primary)]" href="#">Master Timeline</a></li>
            <li><a className="hover:text-[var(--primary)]" href="#">Evidence Vault</a></li>
            <li><a className="hover:text-[var(--primary)]" href="#">Impact Mapping</a></li>
            <li><a className="hover:text-[var(--primary)]" href="#">Source Material</a></li>
          </ul>
        </div>
        <div>
          <h5 className="text-xs font-bold uppercase font-sans mb-4 tracking-widest">Intelligence</h5>
          <p className="text-xs text-[var(--muted-foreground)] mb-4 font-sans">
            Sign up for the daily Impact Briefing.
          </p>
          <div className="flex">
            <input
              className="flex-grow border border-[var(--border)] text-xs px-3 py-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] border-r-0 outline-none"
              placeholder="Email address"
              type="email"
            />
            <button className="bg-[var(--foreground)] text-white px-4 py-2 text-[10px] font-bold uppercase tracking-wider font-sans hover:bg-[var(--primary)]">
              Join
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 pt-10 mt-10 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold font-sans uppercase tracking-widest text-[var(--muted-foreground)]">
        <div>© 2024 The Investigation Global News Portal</div>
        <div className="flex gap-8">
          <a className="hover:text-[var(--primary)]" href="#">Ethics Policy</a>
          <a className="hover:text-[var(--primary)]" href="#">Privacy</a>
          <a className="hover:text-[var(--primary)]" href="#">Contact the Desk</a>
        </div>
      </div>
    </footer>
  );
}

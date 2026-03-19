import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BracketSim',
  description: '2026 March Madness Bracket Simulator',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full flex flex-col bg-gray-50">
        <header className="border-b border-gray-200 bg-white shrink-0 z-50">
          <div className="px-5 h-11 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-[15px] font-black tracking-tight text-gray-900">BracketSim</span>
              <span className="text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded uppercase tracking-wider">
                2026
              </span>
            </div>
            <nav className="flex items-center gap-5">
              <span className="text-[12px] font-medium text-gray-500 hover:text-gray-800 cursor-pointer transition-colors">Bracket</span>
              <span className="text-[12px] font-medium text-gray-400 hover:text-gray-800 cursor-pointer transition-colors">About</span>
            </nav>
          </div>
        </header>
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}

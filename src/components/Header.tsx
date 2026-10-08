import React from 'react';
import { ShieldCheck, Eye, Sparkles } from 'lucide-react';
import logoImg from '../assets/images/pixel_detector_logo_1791483019123.jpg';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'scanner', label: 'Scanner & Analizzatore' },
    { id: 'guide', label: 'Guida Rilevamento' },
    { id: 'simulator', label: 'Simulatore Spia' },
    { id: 'tools', label: 'Script & DevTools' }
  ];

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-slate-800/30 bg-slate-950 flex items-center justify-center shrink-0">
              <img
                src={logoImg}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/pixel_detector_logo.jpg';
                }}
                alt="PixelDetector Logo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">PixelDetector</span>
                <span className="text-slate-400">·</span>
                <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Privacy Lab</span>
              </div>
              <p className="text-xs text-slate-500">Rilevatore forense di tracking pixel e web beacon</p>
            </div>
          </div>

          {/* Navigation Controls & App Version */}
          <div className="flex items-center gap-3">
            <nav className="flex items-center p-1 bg-slate-100 rounded-lg">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                      isActive
                        ? 'bg-white text-slate-900 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Version Badge in top-right */}
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500 bg-slate-50 border border-slate-200/90 px-2 py-1 rounded-md shadow-2xs select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" title="Build verificata" />
              <span className="font-semibold text-slate-700">V.1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

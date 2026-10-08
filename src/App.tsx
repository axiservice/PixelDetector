import React, { useState } from 'react';
import { Header } from './components/Header';
import { ScannerTab } from './components/ScannerTab';
import { GuideTab } from './components/GuideTab';
import { SimulatorTab } from './components/SimulatorTab';
import { ToolsTab } from './components/ToolsTab';
import { ShieldCheck, Heart } from 'lucide-react';
import logoImg from './assets/images/pixel_detector_logo_1791483019123.jpg';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('scanner');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-sky-500 selection:text-white">
      {/* Top Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Tab Content */}
      <main className="flex-1">
        {activeTab === 'scanner' && <ScannerTab />}
        {activeTab === 'guide' && <GuideTab />}
        {activeTab === 'simulator' && <SimulatorTab />}
        {activeTab === 'tools' && <ToolsTab />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <img
              src={logoImg}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/pixel_detector_logo.jpg';
              }}
              alt="PixelDetector Logo"
              className="w-5 h-5 rounded-md object-cover border border-slate-200 shadow-2xs"
              referrerPolicy="no-referrer"
            />
            <span>PixelDetector: Elaborazione 100% Locale e Riservata. Nessun dato inviato a server esterni.</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Standard GDPR & ePrivacy</span>
            <span>·</span>
            <span>Zero Tracking Pixels Inclusi</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

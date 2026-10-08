import React, { useState, useEffect } from 'react';
import { 
  Eye, ShieldAlert, ArrowRight, Server, Smartphone, Laptop, 
  MapPin, Clock, Fingerprint, RefreshCw, Send, CheckCircle2, AlertTriangle
} from 'lucide-react';

interface SimulatedLog {
  id: string;
  time: string;
  ip: string;
  client: string;
  os: string;
  location: string;
  userAgent: string;
  screenRes: string;
  language: string;
  token: string;
}

export const SimulatorTab: React.FC = () => {
  const [browserInfo, setBrowserInfo] = useState<{
    userAgent: string;
    screenRes: string;
    language: string;
    timeZone: string;
    platform: string;
  }>({
    userAgent: '',
    screenRes: '',
    language: '',
    timeZone: '',
    platform: ''
  });

  const [logs, setLogs] = useState<SimulatedLog[]>([]);
  const [isFiring, setIsFiring] = useState<boolean>(false);
  const [fireCount, setFireCount] = useState<number>(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBrowserInfo({
        userAgent: navigator.userAgent,
        screenRes: `${window.screen.width} × ${window.screen.height} (${window.devicePixelRatio}x scale)`,
        language: navigator.language || 'it-IT',
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Rome',
        platform: navigator.platform || 'Desktop'
      });
    }
  }, []);

  const handleSimulatePixelHit = () => {
    setIsFiring(true);
    setTimeout(() => {
      const now = new Date();
      const newLog: SimulatedLog = {
        id: `hit-${Date.now()}`,
        time: now.toLocaleTimeString('it-IT') + '.' + now.getMilliseconds().toString().padStart(3, '0'),
        ip: '93.42.188.' + Math.floor(Math.random() * 200 + 10),
        client: navigator.userAgent.includes('Chrome') ? 'Google Chrome (o webmail browser)' : 'Client Email Standard',
        os: navigator.userAgent.includes('Mac') ? 'macOS' : (navigator.userAgent.includes('Windows') ? 'Windows' : 'Linux / Mobile'),
        location: 'Milano, Italia (ISP Telecom Italia)',
        userAgent: navigator.userAgent,
        screenRes: `${window.screen.width} × ${window.screen.height}`,
        language: navigator.language || 'it-IT',
        token: `tk_${Math.random().toString(36).substring(2, 9)}_lead_948`
      };

      setLogs(prev => [newLog, ...prev.slice(0, 4)]);
      setFireCount(c => c + 1);
      setIsFiring(false);
    }, 600);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-rose-600 mb-1">
          <span>LABORATORIO INTERATTIVO</span>
          <span>·</span>
          <span>ANATOMIA DI UN WEB BEACON</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Cosa Sa il Mittente Quando Apri un'Email?
        </h1>
        <p className="text-slate-600 text-sm mt-2 max-w-3xl leading-relaxed">
          Molti credono che una semplice lettura di un'email sia un'azione passiva e anonima. 
          In realtà, un singolo pixel trasparente (spesso di soli 43 byte) trasmette 
          istantaneamente un'impronta digitale completa ai server di profilazione.
        </p>
      </div>

      {/* Step-by-Step Anatomy Diagram */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Il ciclo di vita di un tracking pixel:
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 relative">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center mb-3">
              1
            </span>
            <h4 className="font-bold text-xs text-slate-900 mb-1">Iniezione del Token</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Il mittente genera un'immagine con un URL univoco: <br/>
              <code className="text-[10px] bg-slate-200 p-0.5 rounded text-slate-800 break-all">
                /open?uid=mario.rossi@email.it
              </code>
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 relative">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center mb-3">
              2
            </span>
            <h4 className="font-bold text-xs text-slate-900 mb-1">Apertura Silenziosa</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tu apri l'email. Il client scarica automaticamente tutte le immagini incluse nel corpo HTML per visualizzarle.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 relative">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center mb-3">
              3
            </span>
            <h4 className="font-bold text-xs text-slate-900 mb-1">Richiesta HTTP GET</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Il tuo client contatta il server remoto. Nella richiesta invia: il tuo <strong>IP</strong>, <strong>User-Agent</strong>, e <strong>Timestamp</strong>.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 relative">
            <span className="w-6 h-6 rounded-full bg-rose-600 text-white text-xs font-bold flex items-center justify-center mb-3">
              4
            </span>
            <h4 className="font-bold text-xs text-rose-950 mb-1">Registrazione nel CRM</h4>
            <p className="text-xs text-rose-900 leading-relaxed">
              Il mittente riceve una notifica: <em>"Mario Rossi ha aperto l'email alle 10:14 da Roma usando un iPhone"</em>.
            </p>
          </div>
        </div>
      </div>

      {/* Live Data Leak Sandbox */}
      <div className="bg-slate-950 text-slate-200 border border-slate-800 rounded-xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <h3 className="font-bold text-base text-white">
                Simulatore Live: Cosa Rileverebbe un Pixel su di Te Adesso
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Questi sono i dati che il tuo browser attuale fornirebbe automaticamente se caricasse un pixel:
            </p>
          </div>

          <button
            onClick={handleSimulatePixelHit}
            disabled={isFiring}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-md shadow-xs flex items-center gap-2 shrink-0 disabled:opacity-50 transition-all"
          >
            {isFiring ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Simula Ricezione Pixel ({fireCount} simulati)
          </button>
        </div>

        {/* Real Browser Fingerprint Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>Timestamp & Fuso Orario</span>
            </div>
            <div className="font-mono text-xs text-white mt-1">
              {browserInfo.timeZone}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Rivelazione dell'orario locale del lettore
            </div>
          </div>

          <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5 text-amber-400" />
              <span>Risoluzione Display</span>
            </div>
            <div className="font-mono text-xs text-white mt-1">
              {browserInfo.screenRes || 'Rilevamento in corso...'}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Distingue smartphone, tablet o monitor desktop
            </div>
          </div>

          <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Fingerprint className="w-3.5 h-3.5 text-emerald-400" />
              <span>Lingua Preferita</span>
            </div>
            <div className="font-mono text-xs text-white mt-1">
              {browserInfo.language}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Profilazione geografica e linguistica
            </div>
          </div>

          <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 sm:col-span-2 lg:col-span-3">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-purple-400" />
              <span>Stringa Header User-Agent (Inviata ad ogni richiesta HTTP)</span>
            </div>
            <div className="font-mono text-[11px] text-sky-300 mt-1 break-all bg-slate-950 p-2 rounded border border-slate-800">
              {browserInfo.userAgent || 'Caricamento...'}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Rappresenta marca dispositivo, modello esatto, versione OS e motore web
            </div>
          </div>
        </div>

        {/* Server Capture Log (If simulated) */}
        {logs.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Log Catturato dal Server Tracker (Ricevute in tempo reale):
            </div>
            <div className="space-y-2">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 bg-slate-900 rounded-lg border border-slate-800 font-mono text-xs space-y-1 text-slate-300"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="text-amber-400 font-bold">GET /pixel.gif?token={log.token} HTTP/2</span>
                    <span>{log.time}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                    <div>
                      <span className="text-slate-500">IP Rilevato:</span>{' '}
                      <span className="text-white font-semibold">{log.ip}</span> ({log.location})
                    </div>
                    <div>
                      <span className="text-slate-500">Sistema:</span>{' '}
                      <span className="text-white">{log.os}</span> · {log.screenRes}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

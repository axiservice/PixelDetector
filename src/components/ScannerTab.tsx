import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, ShieldCheck, AlertTriangle, Eye, EyeOff, 
  Upload, Copy, Check, Download, RefreshCw, FileText, Globe, 
  Sparkles, Code, ExternalLink, HelpCircle, ArrowRight
} from 'lucide-react';
import { analyzeContent } from '../lib/detector';
import { SAMPLES, SampleData } from '../lib/samples';
import { AnalysisResult, DetectedPixel } from '../lib/types';
import logoImg from '../assets/images/pixel_detector_logo_1791483019123.jpg';

export const ScannerTab: React.FC = () => {
  const [inputType, setInputType] = useState<'email' | 'web'>('email');
  const [inputContent, setInputContent] = useState<string>(SAMPLES[0].content);
  const [activeSampleId, setActiveSampleId] = useState<string>(SAMPLES[0].id);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [copiedClean, setCopiedClean] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  // Sandbox preview options
  const [highlightPixels, setHighlightPixels] = useState<boolean>(true);
  const [blockExternalImages, setBlockExternalImages] = useState<boolean>(false);
  const [activeViewTab, setActiveViewTab] = useState<'details' | 'preview' | 'sanitized'>('details');

  // URL input state for Web mode
  const [webUrl, setWebUrl] = useState<string>('');
  const [isFetchingUrl, setIsFetchingUrl] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Perform initial analysis on load
  useEffect(() => {
    handleAnalyze(inputContent, inputType);
  }, []);

  const handleAnalyze = (content: string, mode: 'email' | 'web') => {
    setIsScanning(true);
    setTimeout(() => {
      const res = analyzeContent(content, mode);
      setResult(res);
      setIsScanning(false);
    }, 150);
  };

  const handleSelectSample = (sample: SampleData) => {
    setActiveSampleId(sample.id);
    setInputType(sample.type);
    setInputContent(sample.content);
    handleAnalyze(sample.content, sample.type);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setInputContent(text);
        setActiveSampleId('');
        handleAnalyze(text, inputType);
      }
    };
    reader.readAsText(file);
  };

  const handleFetchUrl = async () => {
    if (!webUrl.trim()) return;
    setIsFetchingUrl(true);
    setFetchError(null);

    let targetUrl = webUrl.trim();
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = 'https://' + targetUrl;
    }

    try {
      // Attempt client-side fetch (or proxy if blocked by CORS)
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const htmlText = await response.text();

      setInputContent(htmlText);
      setInputType('web');
      setActiveSampleId('');
      handleAnalyze(htmlText, 'web');
    } catch (err) {
      setFetchError(
        'Impossibile scaricare la pagina direttamente a causa delle restrizioni CORS del browser. Prova ad aprire la pagina nel browser, cliccare destro > "Visualizza sorgente pagina" (Ctrl+U) e incollare il codice HTML qui sotto.'
      );
    } finally {
      setIsFetchingUrl(false);
    }
  };

  const handleCopyCleanHtml = () => {
    if (!result?.summary.sanitizedHtml) return;
    navigator.clipboard.writeText(result.summary.sanitizedHtml);
    setCopiedClean(true);
    setTimeout(() => setCopiedClean(false), 2000);
  };

  const handleDownloadSanitized = () => {
    if (!result?.summary.sanitizedHtml) return;
    const blob = new Blob([result.summary.sanitizedHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email_sanificata_senza_pixel.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filter suspects
  const filteredSuspects = (result?.suspects || []).filter(s => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'img') return s.category === 'image_pixel';
    if (activeFilter === 'css') return s.category === 'css_beacon';
    if (activeFilter === 'script') return s.category === 'script_tracker';
    return true;
  });

  // Prepare iframe preview content with optional pixel highlighting
  const generatePreviewHtml = () => {
    if (!result) return '';
    let html = inputContent;

    // Check if input is EML with headers
    if (result.headers && Object.keys(result.headers).length > 0) {
      const match = inputContent.match(/\r?\n\r?\n([\s\S]*)$/);
      if (match && match[1]) html = match[1];
    }

    let injectionStyles = `
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 16px; margin: 0; }
        ${highlightPixels ? `
          img[width="1"], img[width="0"], img[height="1"], img[height="0"], 
          img[style*="display:none"], img[style*="visibility:hidden"], img[style*="opacity:0"],
          img[src*="track"], img[src*="open"], img[src*="beacon"], img[src*="pixel"] {
            display: inline-block !important;
            visibility: visible !important;
            opacity: 1 !important;
            width: 32px !important;
            height: 32px !important;
            border: 3px solid #dc2626 !important;
            background-color: #fee2e2 !important;
            box-shadow: 0 0 12px rgba(220, 38, 38, 0.8) !important;
            position: relative !important;
            z-index: 99999 !important;
            animation: pulse-beacon 1.5s infinite !important;
          }
          @keyframes pulse-beacon {
            0% { transform: scale(1); }
            50% { transform: scale(1.15); }
            100% { transform: scale(1); }
          }
        ` : ''}
        ${blockExternalImages ? `
          img { display: none !important; }
          .pixeldetector-blocked-banner { display: block; background: #f1f5f9; padding: 8px 12px; font-size: 12px; color: #475569; margin-bottom: 12px; border-radius: 4px; }
        ` : ''}
      </style>
    `;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        ${injectionStyles}
      </head>
      <body>
        ${blockExternalImages ? '<div class="pixeldetector-blocked-banner">🛡️ <strong>Immagini Esterne Bloccate:</strong> Nessuna risorsa remota è stata caricata. La tua apertura non è stata notificata.</div>' : ''}
        ${html}
      </body>
      </html>
    `;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner / Explanation */}
      <div className="bg-slate-900 text-white rounded-xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400 mb-2">
            <span>FORENSIC ANALYSIS ENGINE</span>
            <span>·</span>
            <span>ISPEZIONE RETE E DOM</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            Rileva se un'email o pagina web ti sta spiando
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            I tracking pixel sono immagini trasparenti di <strong>1×1 pixel</strong> o sfondi CSS invisibili. 
            Appena apri l'email, il client richiede l'immagine al server del mittente rivelando il tuo <strong>IP</strong>, 
            <strong>orario esatto</strong>, <strong>città</strong> e <strong>dispositivo</strong>. 
            Incolla la sorgente qui sotto o testa uno dei nostri casi reali.
          </p>
        </div>
        <div className="hidden md:flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-xl shrink-0">
          <img
            src={logoImg}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/pixel_detector_logo.jpg';
            }}
            alt="PixelDetector Logo"
            className="w-24 h-24 rounded-xl object-cover shadow-inner"
            referrerPolicy="no-referrer"
          />
          <span className="mt-2 text-[10px] font-mono uppercase tracking-wider text-sky-400 font-semibold">PixelDetector Core</span>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Casi di Studio Reali (Seleziona per testare subito)
          </span>
          <span className="text-xs text-slate-400">5 campioni precaricati</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {SAMPLES.map((sample) => {
            const isSelected = activeSampleId === sample.id;
            const isClean = sample.id === 'sample-clean';
            return (
              <button
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                className={`text-left p-3.5 rounded-lg border transition-all ${
                  isSelected 
                    ? 'border-sky-500 bg-sky-50/50 shadow-xs ring-1 ring-sky-500' 
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-xs font-semibold ${isClean ? 'text-emerald-700' : 'text-slate-800'}`}>
                    {sample.title}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 line-clamp-2">
                  {sample.subtitle}
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 uppercase font-mono">{sample.type}</span>
                  <span className={isClean ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}>
                    {sample.riskLabel}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        {/* Input Switch and Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">Tipo di contenuto:</span>
            <div className="flex items-center p-0.5 bg-slate-100 rounded-lg">
              <button
                onClick={() => { setInputType('email'); handleAnalyze(inputContent, 'email'); }}
                className={`px-3 py-1 text-xs font-medium rounded-md flex items-center gap-1.5 transition-all ${
                  inputType === 'email' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Email (HTML / EML)
              </button>
              <button
                onClick={() => { setInputType('web'); handleAnalyze(inputContent, 'web'); }}
                className={`px-3 py-1 text-xs font-medium rounded-md flex items-center gap-1.5 transition-all ${
                  inputType === 'web' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                Pagina Web (URL / HTML)
              </button>
            </div>
          </div>

          {/* Upload Button */}
          <div className="flex items-center gap-2">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept=".eml,.html,.htm,.txt" 
              className="hidden" 
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              Carica file (.eml / .html)
            </button>
            <button
              onClick={() => { setInputContent(''); setResult(null); setActiveSampleId(''); }}
              className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800"
            >
              Pulisci
            </button>
          </div>
        </div>

        {/* Web URL Fetcher (If Web mode selected) */}
        {inputType === 'web' && (
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="text-xs font-medium text-slate-700 mb-2">
              Opzione: Inserisci l'URL di un sito web per scaricare ed esaminare l'HTML:
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={webUrl}
                onChange={(e) => setWebUrl(e.target.value)}
                placeholder="https://example.com/checkout o https://negozio-online.it"
                className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-md focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-mono"
              />
              <button
                onClick={handleFetchUrl}
                disabled={isFetchingUrl || !webUrl}
                className="px-4 py-2 text-xs font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 disabled:opacity-50 flex items-center gap-1.5"
              >
                {isFetchingUrl ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
                Scarica & Analizza
              </button>
            </div>
            {fetchError && (
              <p className="mt-2 text-xs text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
                {fetchError}
              </p>
            )}
          </div>
        )}

        {/* Textarea for Raw HTML / EML */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Sorgente da analizzare (Incolla l'HTML dell'email o il file .eml):
          </label>
          <textarea
            value={inputContent}
            onChange={(e) => {
              setInputContent(e.target.value);
              setActiveSampleId('');
            }}
            placeholder="Incolla qui il codice HTML dell'email, l'intero messaggio .eml (con intestazioni) oppure la sorgente di una pagina web..."
            rows={8}
            className="w-full font-mono text-xs p-3 bg-slate-950 text-slate-200 rounded-lg border border-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500 resize-y"
          />
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {inputContent ? `${inputContent.length} caratteri inseriti` : 'In attesa di input'}
          </div>
          <button
            onClick={() => handleAnalyze(inputContent, inputType)}
            disabled={isScanning || !inputContent.trim()}
            className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-md shadow-xs transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Scansione in corso...
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Analizza Tracking Pixel
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Results View */}
      {result && (
        <div className="space-y-6">
          {/* Result Summary Bar */}
          <div className={`p-5 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
            result.summary.totalSuspects > 0
              ? 'bg-rose-50/70 border-rose-200 text-rose-950'
              : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
          }`}>
            <div className="flex items-start gap-3.5">
              <div className={`p-2.5 rounded-lg shrink-0 ${
                result.summary.totalSuspects > 0 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {result.summary.totalSuspects > 0 ? (
                  <ShieldAlert className="w-6 h-6" />
                ) : (
                  <ShieldCheck className="w-6 h-6" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base sm:text-lg">
                    {result.summary.totalSuspects > 0
                      ? `Rilevati ${result.summary.totalSuspects} Tracking Pixel & Beacon Sospetti`
                      : 'Nessun Tracking Pixel Rilevato (Pulito)'}
                  </h3>
                  <span className="text-xs">·</span>
                  <span className="text-xs font-mono uppercase tracking-wider font-semibold">
                    Rischio: {result.summary.highestRisk.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs sm:text-sm mt-0.5 opacity-90">
                  {result.summary.totalSuspects > 0
                    ? `Questo messaggio include elementi invisibili che notificheranno il mittente appena visualizzato.`
                    : `Il messaggio non contiene pixel 1x1, sfondi CSS traccianti né script di telemetria noti.`}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            {result.summary.totalSuspects > 0 && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setActiveViewTab('sanitized')}
                  className="px-3.5 py-2 text-xs font-semibold bg-white border border-rose-300 text-rose-900 rounded-md hover:bg-rose-100 transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                  Visualizza Versione Sanificata
                </button>
              </div>
            )}
          </div>

          {/* Metrics Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 font-medium">Elementi Esaminati</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">
                {result.summary.totalAnalyzedElements}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Tag img, script, css</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 font-medium">Spie 1×1 Rilevate</div>
              <div className={`text-2xl font-bold mt-1 ${result.summary.totalSuspects > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {result.summary.totalSuspects}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Richieste HTTP furtive</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 font-medium">Servizi Traccianti Noti</div>
              <div className="text-lg font-bold text-slate-900 mt-1 truncate">
                {result.summary.detectedProviders.length > 0
                  ? result.summary.detectedProviders.join(', ')
                  : 'Nessuno rilevato'}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">ESP / CRM / Ad Network</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 font-medium">Tecniche Utilizzate</div>
              <div className="text-xs font-semibold text-slate-800 mt-1 line-clamp-2">
                {result.summary.techniquesUsed.length > 0
                  ? result.summary.techniquesUsed.join(' · ')
                  : 'Nessun trucco rilevato'}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Metodi di occultamento</div>
            </div>
          </div>

          {/* Email Header Info (if EML) */}
          {result.headers && (result.headers.sender || result.headers.mailer || result.headers.espDetected) && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Intestazioni Email (EML Forensics)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {result.headers.sender && (
                  <div>
                    <span className="text-slate-400">Mittente:</span>{' '}
                    <span className="font-mono text-slate-800">{result.headers.sender}</span>
                  </div>
                )}
                {result.headers.mailer && (
                  <div>
                    <span className="text-slate-400">Software / X-Mailer:</span>{' '}
                    <span className="font-semibold text-rose-700">{result.headers.mailer}</span>
                  </div>
                )}
                {result.headers.espDetected && (
                  <div>
                    <span className="text-slate-400">Piattaforma ESP:</span>{' '}
                    <span className="font-semibold text-sky-700">{result.headers.espDetected}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tabs for Results View: Details vs Sandbox Preview vs Sanitized HTML */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="flex items-center justify-between px-6 pt-4 border-b border-slate-200 bg-slate-50/50">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveViewTab('details')}
                  className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-all ${
                    activeViewTab === 'details'
                      ? 'border-sky-600 text-sky-700 font-semibold'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Dettaglio Spie Rilevate ({result.suspects.length})
                </button>
                <button
                  onClick={() => setActiveViewTab('preview')}
                  className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-all ${
                    activeViewTab === 'preview'
                      ? 'border-sky-600 text-sky-700 font-semibold'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Anteprima Sandbox (Visualizzatore Email)
                </button>
                <button
                  onClick={() => setActiveViewTab('sanitized')}
                  className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-all ${
                    activeViewTab === 'sanitized'
                      ? 'border-sky-600 text-sky-700 font-semibold'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Codice Sanificato (Pixel Rimosso)
                </button>
              </div>

              {activeViewTab === 'details' && result.suspects.length > 0 && (
                <div className="hidden sm:flex items-center gap-1 text-xs pb-2">
                  <button
                    onClick={() => setActiveFilter('all')}
                    className={`px-2.5 py-1 rounded text-xs ${activeFilter === 'all' ? 'bg-slate-200 font-semibold' : 'text-slate-500'}`}
                  >
                    Tutti
                  </button>
                  <button
                    onClick={() => setActiveFilter('img')}
                    className={`px-2.5 py-1 rounded text-xs ${activeFilter === 'img' ? 'bg-slate-200 font-semibold' : 'text-slate-500'}`}
                  >
                    1×1 Img
                  </button>
                  <button
                    onClick={() => setActiveFilter('css')}
                    className={`px-2.5 py-1 rounded text-xs ${activeFilter === 'css' ? 'bg-slate-200 font-semibold' : 'text-slate-500'}`}
                  >
                    CSS
                  </button>
                  <button
                    onClick={() => setActiveFilter('script')}
                    className={`px-2.5 py-1 rounded text-xs ${activeFilter === 'script' ? 'bg-slate-200 font-semibold' : 'text-slate-500'}`}
                  >
                    Script
                  </button>
                </div>
              )}
            </div>

            {/* Content of Tab 1: Detailed Suspects List */}
            {activeViewTab === 'details' && (
              <div className="p-6">
                {result.suspects.length === 0 ? (
                  <div className="py-12 text-center">
                    <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                    <h4 className="text-base font-semibold text-slate-800">Nessuna minaccia trovata</h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                      Non sono state rilevate immagini 1x1, gif trasparenti o sfondi CSS con URL esterni associati a tracker noti.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredSuspects.map((pixel, index) => (
                      <div
                        key={pixel.id}
                        className="border border-slate-200 rounded-lg p-4 bg-white hover:border-slate-300 transition-all space-y-3"
                      >
                        {/* Header of Item */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 text-xs font-bold flex items-center justify-center">
                              {index + 1}
                            </span>
                            <span className="font-semibold text-sm text-slate-900">
                              {pixel.provider || 'Tracking Pixel non associato ad ESP noto'}
                            </span>
                            <span className="text-slate-400">·</span>
                            <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                              {pixel.elementName}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-slate-500 font-mono">Regola: {pixel.matchedRule}</span>
                          </div>
                        </div>

                        {/* Explanation */}
                        <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded border border-slate-100">
                          {pixel.explanation}
                        </p>

                        {/* URL and Raw Snippet */}
                        <div className="space-y-2">
                          <div>
                            <span className="text-[11px] font-semibold text-slate-500 uppercase">URL Sorgente Chiamato:</span>
                            <div className="mt-1 flex items-center gap-2 bg-slate-900 text-slate-200 p-2 rounded text-xs font-mono break-all">
                              <span className="flex-1">{pixel.sourceUrl}</span>
                              <button
                                onClick={() => navigator.clipboard.writeText(pixel.sourceUrl)}
                                className="text-slate-400 hover:text-white shrink-0 p-1"
                                title="Copia URL"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Extracted Parameters */}
                          {Object.keys(pixel.extractedParams).length > 0 && (
                            <div>
                              <span className="text-[11px] font-semibold text-slate-500 uppercase">
                                Parametri Tracciati Estratti dall'URL:
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                                {Object.entries(pixel.extractedParams).map(([k, v]) => (
                                  <div key={k} className="text-[11px] font-mono bg-amber-50/70 border border-amber-200/70 p-2 rounded text-amber-900 flex items-center justify-between">
                                    <span className="font-bold text-amber-800">{k}:</span>
                                    <span className="truncate max-w-[180px]">{v}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Privacy Leaks */}
                          <div>
                            <span className="text-[11px] font-semibold text-rose-700 uppercase">
                              Cosa trasmette al mittente se caricato:
                            </span>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-1 text-xs text-slate-600">
                              {pixel.leakInfo.map((leak, li) => (
                                <li key={li} className="flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                                  <span>{leak}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Content of Tab 2: Sandbox Preview */}
            {activeViewTab === 'preview' && (
              <div className="p-6 space-y-4">
                {/* Controls for Sandbox */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-4 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                      <input
                        type="checkbox"
                        checked={highlightPixels}
                        onChange={(e) => setHighlightPixels(e.target.checked)}
                        className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                      />
                      <span>Evidenzia Pixel Invisibili con Target Rosso Lampeggiante</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                      <input
                        type="checkbox"
                        checked={blockExternalImages}
                        onChange={(e) => setBlockExternalImages(e.target.checked)}
                        className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                      />
                      <span>Simula Blocco Risorse Esterne (Privacy Shield)</span>
                    </label>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Iframe protetto con sandbox isolata
                  </div>
                </div>

                {/* The Iframe */}
                <div className="border border-slate-300 rounded-lg overflow-hidden bg-white shadow-inner">
                  <iframe
                    title="Email Sandbox Preview"
                    srcDoc={generatePreviewHtml()}
                    sandbox="allow-same-origin"
                    className="w-full h-[450px] border-0"
                  />
                </div>
                <p className="text-xs text-slate-500">
                  💡 <strong>Come notarlo:</strong> Quando l'opzione "Evidenzia Pixel" è attiva, qualsiasi immagine con dimensioni 1×1 o nascosta viene ingrandita a 32×32 pixel rossi lampeggianti. In questo modo puoi vedere esattamente la posizione dove il mittente l'ha piazzata!
                </p>
              </div>
            )}

            {/* Content of Tab 3: Sanitized HTML */}
            {activeViewTab === 'sanitized' && (
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">
                      Versione Sanificata (Tracciatori Rimossi)
                    </h4>
                    <p className="text-xs text-slate-500">
                      Questo codice HTML è stato depurato da tutti i tag 1x1, GIF trasparenti e sfondi traccianti. Puoi usarlo per inoltrare o archiviare la mail in sicurezza.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyCleanHtml}
                      className="px-3 py-1.5 text-xs font-medium bg-slate-900 text-white rounded-md hover:bg-slate-800 flex items-center gap-1.5"
                    >
                      {copiedClean ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedClean ? 'Copiato!' : 'Copia HTML Pulito'}
                    </button>
                    <button
                      onClick={handleDownloadSanitized}
                      className="px-3 py-1.5 text-xs font-medium border border-slate-200 text-slate-700 rounded-md hover:bg-slate-50 flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Scarica .html
                    </button>
                  </div>
                </div>

                <textarea
                  readOnly
                  value={result.summary.sanitizedHtml}
                  rows={12}
                  className="w-full font-mono text-xs p-3 bg-slate-900 text-emerald-300 rounded-lg border border-slate-800"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Terminal, Code, Copy, Check, Download, ExternalLink, 
  Bookmark, CheckCircle2, AlertCircle, Sparkles
} from 'lucide-react';
import { BROWSER_CONSOLE_SNIPPET, BOOKMARKLET_CODE, PYTHON_SCANNER_SCRIPT } from '../lib/devtools-script';

export const ToolsTab: React.FC = () => {
  const [copiedSnippet, setCopiedSnippet] = useState<boolean>(false);
  const [copiedBookmarklet, setCopiedBookmarklet] = useState<boolean>(false);
  const [copiedPython, setCopiedPython] = useState<boolean>(false);

  const handleCopy = (text: string, type: 'snippet' | 'bookmarklet' | 'python') => {
    navigator.clipboard.writeText(text);
    if (type === 'snippet') {
      setCopiedSnippet(true);
      setTimeout(() => setCopiedSnippet(false), 2000);
    } else if (type === 'bookmarklet') {
      setCopiedBookmarklet(true);
      setTimeout(() => setCopiedBookmarklet(false), 2000);
    } else {
      setCopiedPython(true);
      setTimeout(() => setCopiedPython(false), 2000);
    }
  };

  const handleDownloadPython = () => {
    const blob = new Blob([PYTHON_SCANNER_SCRIPT], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pixeldetector_scanner.py';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-sky-600 mb-1">
          <span>STRUMENTI PER SVILUPPATORI & AUDITING</span>
          <span>·</span>
          <span>SNIPPET E SCRIPT PRONTI ALL'USO</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Strumenti e Script di Rilevamento Rapido
        </h1>
        <p className="text-slate-600 text-sm mt-2 max-w-3xl leading-relaxed">
          Usa questi script per scansionare istantaneamente qualsiasi pagina web attiva 
          direttamente dal tuo browser o per analizzare massivamente file di posta (.eml) tramite terminale.
        </p>
      </div>

      {/* Tool 1: DevTools Browser Console Script */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-sky-600" />
              <h3 className="font-bold text-base text-slate-900">
                Script DevTools Console (Chrome, Firefox, Safari, Edge)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Evidenzia sul posto tutti i pixel microscopici della pagina con un bordo rosso lampeggiante e stampa una tabella nei log.
            </p>
          </div>

          <button
            onClick={() => handleCopy(BROWSER_CONSOLE_SNIPPET, 'snippet')}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md flex items-center gap-1.5 shrink-0 transition-colors"
          >
            {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedSnippet ? 'Copiato negli appunti!' : 'Copia Script Console'}
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-3">
          <div className="font-semibold text-slate-900">Come usarlo su qualsiasi sito:</div>
          <ol className="list-decimal list-inside space-y-1 text-slate-600">
            <li>Apri qualsiasi pagina web (o la tua webmail su browser, es. Gmail).</li>
            <li>Premi <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono text-[11px]">F12</kbd> (o clicca con il tasto destro &gt; <em>Ispeziona</em>).</li>
            <li>Seleziona la scheda <strong>Console</strong> in alto.</li>
            <li>Incolla il codice sottostante e premi <strong>Invio</strong>.</li>
          </ol>

          {/* Chrome Self-XSS Warning Explainer */}
          <div className="mt-3 p-3.5 bg-amber-50/80 border border-amber-200 rounded-md text-amber-950 space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Ti appare il messaggio: &quot;Warning: Don’t paste code... Type 'allow pasting'&quot;?</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-900">
              È una <strong>protezione di sicurezza integrata di Google Chrome</strong> contro gli attacchi <em>Self-XSS</em>. Serve a proteggere gli utenti da truffatori che chiedono di incollare script dannosi per rubare password o account.
            </p>
            <div className="text-[11px] font-medium text-amber-950 space-y-1">
              <div><strong>Come sbloccare l&apos;incollatura in 2 secondi:</strong></div>
              <ol className="list-decimal list-inside text-amber-900 pl-1 space-y-0.5">
                <li>Nella riga di comando della Console di Chrome, digita esattamente: <code className="bg-amber-100 text-amber-950 px-1.5 py-0.5 rounded font-mono font-bold select-all">allow pasting</code></li>
                <li>Premi il tasto <kbd className="px-1 bg-white border border-amber-300 rounded font-mono text-[10px]">Invio</kbd>.</li>
                <li>Ora incolla normalmente lo script di PixelDetector e premi di nuovo <kbd className="px-1 bg-white border border-amber-300 rounded font-mono text-[10px]">Invio</kbd>.</li>
              </ol>
            </div>
            <div className="pt-2 border-t border-amber-200 text-[11px] text-amber-950 space-y-1">
              <strong>💡 Metodo alternativo permanente (Senza digitare &quot;allow pasting&quot;):</strong>
              <p className="text-amber-900">
                Nei DevTools vai nella scheda <strong>Sorgenti (Sources)</strong> &gt; colonna a sinistra clicca su <strong>Frammenti (Snippets)</strong> &gt; <strong>+ Nuovo frammento</strong> &gt; incolla il codice &gt; premi <kbd className="px-1 bg-white border border-amber-300 rounded font-mono text-[10px]">Ctrl + Invio</kbd> (o <kbd className="px-1 bg-white border border-amber-300 rounded font-mono text-[10px]">Cmd + Invio</kbd> su Mac). Lo script rimarrà salvato per sempre nel tuo browser.
              </p>
            </div>
            <div className="pt-1 border-t border-amber-200 text-[10px] text-amber-800">
              🛡️ <strong>Trasparenza del codice:</strong> Il nostro script esegue solo letture del DOM (trova le immagini e ne legge le dimensioni con <code>getBoundingClientRect</code>) e applica un contorno rosso per renderle visibili. Non accede a cookie, password o token e non invia alcuna informazione su Internet.
            </div>
          </div>
        </div>

        {/* Code View */}
        <div className="bg-slate-950 text-slate-200 p-4 rounded-lg font-mono text-xs overflow-x-auto max-h-72">
          <pre>{BROWSER_CONSOLE_SNIPPET}</pre>
        </div>
      </div>

      {/* Tool 2: Bookmarklet */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-base text-slate-900">
                Bookmarklet 1-Click per la Barra dei Preferiti
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Un pulsante rapido da salvare nei segnalibri del browser per scansionare qualsiasi pagina con un solo clic.
            </p>
          </div>

          <button
            onClick={() => handleCopy(BOOKMARKLET_CODE, 'bookmarklet')}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md flex items-center gap-1.5 shrink-0 transition-colors"
          >
            {copiedBookmarklet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedBookmarklet ? 'Copiato!' : 'Copia Codice Bookmarklet'}
          </button>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-2">
          <p>
            <strong>Come installarlo:</strong> Crea un nuovo segnalibro nei preferiti del tuo browser, chiamalo <em>"PixelDetector Scanner"</em> e incolla il codice JavaScript nel campo <strong>URL / Indirizzo</strong>.
          </p>
          <div className="p-2 bg-white rounded border border-slate-200 font-mono text-[11px] text-slate-600 break-all">
            {BOOKMARKLET_CODE}
          </div>
        </div>
      </div>

      {/* Tool 3: Python CLI Script */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-base text-slate-900">
                Script Python per Analisi Email (.eml / .html)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Script da riga di comando ideale per analisti di sicurezza, SOC e sysadmin che devono ispezionare messaggi salvati.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(PYTHON_SCANNER_SCRIPT, 'python')}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors"
            >
              {copiedPython ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedPython ? 'Copiato' : 'Copia'}
            </button>
            <button
              onClick={handleDownloadPython}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Scarica .py
            </button>
          </div>
        </div>

        <div className="bg-slate-950 text-slate-200 p-4 rounded-lg font-mono text-xs overflow-x-auto max-h-72">
          <pre>{PYTHON_SCANNER_SCRIPT}</pre>
        </div>
      </div>
    </div>
  );
};

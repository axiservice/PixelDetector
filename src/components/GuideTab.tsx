import React, { useState } from 'react';
import { 
  Mail, Globe, Shield, Terminal, Search, CheckCircle2, 
  ExternalLink, AlertCircle, Copy, Check, ChevronDown, ChevronUp, Lock
} from 'lucide-react';

export const GuideTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'email' | 'web'>('email');
  const [copiedShortcut, setCopiedShortcut] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedShortcut(id);
    setTimeout(() => setCopiedShortcut(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-sky-600 mb-1">
          <span>GUIDA TECNICA OPERATIVA</span>
          <span>·</span>
          <span>ANALISI E CONTROMISURE</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Come Rilevare Manualmente i Tracking Pixel
        </h1>
        <p className="text-slate-600 text-sm mt-2 max-w-3xl leading-relaxed">
          I tracking pixel sfruttano il fatto che quando apri un'email o navighi su un sito, 
          il client deve effettuare una richiesta HTTP per scaricare i file multimediali. 
          Ecco la guida passo-passo per individuarli e bloccarli sia nella posta elettronica che sul web.
        </p>
      </div>

      {/* Segmented Switcher */}
      <div className="flex items-center p-1 bg-slate-100 rounded-lg max-w-sm">
        <button
          onClick={() => setActiveSubTab('email')}
          className={`flex-1 px-4 py-2 text-xs font-semibold rounded-md flex items-center justify-center gap-2 transition-all ${
            activeSubTab === 'email'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Mail className="w-4 h-4 text-sky-600" />
          Nelle Email
        </button>
        <button
          onClick={() => setActiveSubTab('web')}
          className={`flex-1 px-4 py-2 text-xs font-semibold rounded-md flex items-center justify-center gap-2 transition-all ${
            activeSubTab === 'web'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Globe className="w-4 h-4 text-indigo-600" />
          Nelle Pagine Web
        </button>
      </div>

      {/* SECTION 1: NELLE EMAIL */}
      {activeSubTab === 'email' && (
        <div className="space-y-6">
          {/* Metodo 1: Ispezione Sorgente */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono text-sky-600 font-bold uppercase tracking-wider">
                  Metodo 1 (Forense & Diretto)
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  Ispezionare la Sorgente Grezza dell'Email ("Mostra originale")
                </h3>
              </div>
              <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded">
                100% Affidabile
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Il modo più sicuro per trovare un pixel spia senza rischiare di farlo attivare è leggere 
              il codice sorgente originale dell'email prima che il client visualizzi le immagini.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="border border-slate-100 bg-slate-50 p-4 rounded-lg space-y-2">
                <h4 className="font-semibold text-xs text-slate-800 uppercase tracking-wider">
                  Come aprire la sorgente nei principali client:
                </h4>
                <ul className="text-xs text-slate-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-slate-800 shrink-0">Gmail:</span>
                    <span>Apri l'email &gt; clicca sui tre puntini verticali <code>⋮</code> in alto a destra &gt; seleziona <strong>"Mostra originale"</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-slate-800 shrink-0">Thunderbird:</span>
                    <span>Seleziona l'email &gt; premi la scorciatoia <code>Ctrl + U</code> (oppure Visualizza &gt; Sorgente messaggio).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-slate-800 shrink-0">Outlook (Desktop):</span>
                    <span>Apri il messaggio &gt; File &gt; Proprietà &gt; casella <strong>"Intestazioni Internet"</strong> o Salva con nome (.eml / .msg).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-slate-800 shrink-0">Apple Mail (Mac):</span>
                    <span>Menu Vista &gt; Messaggio &gt; <strong>Sorgente</strong> (oppure <code>Option + Command + U</code>).</span>
                  </li>
                </ul>
              </div>

              <div className="border border-slate-100 bg-slate-50 p-4 rounded-lg space-y-2">
                <h4 className="font-semibold text-xs text-slate-800 uppercase tracking-wider">
                  Cosa cercare con <code>Ctrl + F</code> nella sorgente:
                </h4>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between p-2 bg-white rounded border border-slate-200 font-mono text-[11px]">
                    <code>width="1"</code>
                    <button
                      onClick={() => copyToClipboard('width="1"', 'q1')}
                      className="text-slate-400 hover:text-slate-800 text-[10px]"
                    >
                      {copiedShortcut === 'q1' ? 'Copiato' : 'Copia'}
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded border border-slate-200 font-mono text-[11px]">
                    <code>height="1"</code>
                    <button
                      onClick={() => copyToClipboard('height="1"', 'q2')}
                      className="text-slate-400 hover:text-slate-800 text-[10px]"
                    >
                      {copiedShortcut === 'q2' ? 'Copiato' : 'Copia'}
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded border border-slate-200 font-mono text-[11px]">
                    <code>/open?</code> oppure <code>/track</code>
                    <button
                      onClick={() => copyToClipboard('/open', 'q3')}
                      className="text-slate-400 hover:text-slate-800 text-[10px]"
                    >
                      {copiedShortcut === 'q3' ? 'Copiato' : 'Copia'}
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded border border-slate-200 font-mono text-[11px]">
                    <code>display:none</code> o <code>visibility:hidden</code>
                    <button
                      onClick={() => copyToClipboard('display:none', 'q4')}
                      className="text-slate-400 hover:text-slate-800 text-[10px]"
                    >
                      {copiedShortcut === 'q4' ? 'Copiato' : 'Copia'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Code example */}
            <div className="bg-slate-900 text-slate-200 p-4 rounded-lg font-mono text-xs space-y-1 overflow-x-auto">
              <span className="text-slate-500">// Tipico pixel trovato nel footer del messaggio:</span>
              <div className="text-rose-400">
                &lt;img src="https://sendgrid.net/wf/open?upn=..." width="1" height="1" style="display:none;" alt="" /&gt;
              </div>
            </div>
          </div>

          {/* Metodo 2: Blocco Automatico Immagini */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <div>
              <span className="text-xs font-mono text-emerald-600 font-bold uppercase tracking-wider">
                Metodo 2 (Prevenzione Attiva)
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                Disattivare il Download Automatico delle Immagini
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Se il tuo programma di posta non scarica automaticamente le immagini remote, 
                il pixel non viene mai caricato e il mittente non saprà mai che hai aperto il messaggio.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 border border-slate-200 rounded-lg space-y-1.5">
                <span className="font-bold text-slate-900">Gmail (Web)</span>
                <p className="text-slate-600">
                  Icona Ingranaggio ⚙️ &gt; <strong>Visualizza tutte le impostazioni</strong> &gt; Scheda <strong>Generali</strong> &gt; Sezione <strong>Immagini</strong> &gt; Seleziona <em>"Chiedi prima di visualizzare immagini esterne"</em> &gt; Salva modifiche in fondo.
                </p>
              </div>

              <div className="p-3.5 border border-slate-200 rounded-lg space-y-1.5">
                <span className="font-bold text-slate-900">Apple Mail (iPhone / iPad / Mac)</span>
                <p className="text-slate-600">
                  Impostazioni di sistema &gt; <strong>Mail</strong> &gt; <strong>Protezione della privacy</strong> &gt; Attiva <em>"Proteggi l'attività di Mail"</em>. Apple instraderà il traffico tramite proxy anonimizzati mascherando l'IP e il timestamp reale.
                </p>
              </div>

              <div className="p-3.5 border border-slate-200 rounded-lg space-y-1.5">
                <span className="font-bold text-slate-900">Microsoft Outlook (Windows/Mac)</span>
                <p className="text-slate-600">
                  File &gt; Opzioni &gt; Centro protezione &gt; Impostazioni Centro protezione &gt; <strong>Download automatico</strong> &gt; Spunta la casella <em>"Non scaricare automaticamente immagini nei messaggi e-mail HTML standard"</em>.
                </p>
              </div>

              <div className="p-3.5 border border-slate-200 rounded-lg space-y-1.5">
                <span className="font-bold text-slate-900">Mozilla Thunderbird</span>
                <p className="text-slate-600">
                  È attivo di fabbrica: quando ricevi un messaggio con immagini esterne, Thunderbird mostra un avviso in alto: <em>"Thunderbird ha bloccato il contenuto remoto in questo messaggio"</em>.
                </p>
              </div>
            </div>
          </div>

          {/* Metodo 3: Estensioni Browser Anti-Pixel */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <div>
              <span className="text-xs font-mono text-indigo-600 font-bold uppercase tracking-wider">
                Metodo 3 (Automatizzazione con Estensioni)
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                Estensioni Browser per Rilevare ed Evidenziare i Pixel
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 border border-slate-200 rounded-lg space-y-2">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>Trocker</span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">Chrome / Firefox</span>
                </div>
                <p className="text-slate-600">
                  Blocca tutte le immagini di tracciamento nelle webmail (Gmail, Outlook.com, Yahoo) e le sostituisce con un'icona cliccabile che rivela l'URL spia.
                </p>
              </div>

              <div className="p-4 border border-slate-200 rounded-lg space-y-2">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>PixelBlock</span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">Chrome</span>
                </div>
                <p className="text-slate-600">
                  Aggiunge un'icona con un <strong>occhio rosso</strong> nell'intestazione di ogni email che tenta di tracciare la tua apertura, indicando il nome della piattaforma mittente.
                </p>
              </div>

              <div className="p-4 border border-slate-200 rounded-lg space-y-2">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>Ugly Email</span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">Chrome / Firefox</span>
                </div>
                <p className="text-slate-600">
                  Mostra un'icona a forma di occhio direttamente nell'elenco della posta in arrivo prima ancora che tu apra l'email, avvertendoti in anticipo.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: NELLE PAGINE WEB */}
      {activeSubTab === 'web' && (
        <div className="space-y-6">
          {/* Metodo 1: DevTools Network Tab */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <div>
              <span className="text-xs font-mono text-sky-600 font-bold uppercase tracking-wider">
                Metodo 1 (DevTools Browser)
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                Monitorare il Pannello Rete (Network Tab) di Chrome / Firefox / Safari
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Tutti i pixel su una pagina web inviano una richiesta HTTP al server pubblicitario o di analisi. 
                I DevTools del browser catturano ogni singolo byte trasmesso.
              </p>
            </div>

            <ol className="space-y-3 text-xs sm:text-sm text-slate-700 list-decimal list-inside bg-slate-50 p-4 rounded-lg border border-slate-200">
              <li>
                <strong>Apri gli Strumenti per sviluppatori:</strong> Premi <code>F12</code> oppure <code>Ctrl + Shift + I</code> (su Mac: <code>Cmd + Option + I</code>).
              </li>
              <li>
                <strong>Vai alla scheda "Rete" (Network):</strong> Ricarica la pagina web (F5).
              </li>
              <li>
                <strong>Filtra per tipologia:</strong> Clicca sul filtro <code>Img</code> (Immagini) o <code>Fetch/XHR</code>.
              </li>
              <li>
                <strong>Usa la casella di ricerca (Filtro URL):</strong> Digita parole chiave tipiche:
                <div className="flex flex-wrap gap-2 mt-2 font-mono text-xs">
                  <span className="bg-white px-2 py-1 border rounded">pixel</span>
                  <span className="bg-white px-2 py-1 border rounded">collect</span>
                  <span className="bg-white px-2 py-1 border rounded">tr?id=</span>
                  <span className="bg-white px-2 py-1 border rounded">beacon</span>
                  <span className="bg-white px-2 py-1 border rounded">analytics</span>
                </div>
              </li>
              <li>
                <strong>Guarda la colonna "Dimensioni" (Size):</strong> I tracking pixel restituiscono risposte microscopiche, in genere <strong>35-120 byte</strong> (una GIF da 1x1 trasparente) o codice di stato <code>204 No Content</code>.
              </li>
              <li>
                <strong>Clicca sulla richiesta:</strong> Nella sotto-scheda <em>Payload</em> o <em>Query String Parameters</em> vedrai tutti i parametri trasmessi (ID utente, referrer, risoluzione, eventi di click o aggiunta al carrello).
              </li>
            </ol>
          </div>

          {/* Metodo 2: Ispezione Elementi DOM */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <div>
              <span className="text-xs font-mono text-purple-600 font-bold uppercase tracking-wider">
                Metodo 2 (Ispezione Strutturale DOM)
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                Cercare Immagini Microscopiche o Nascoste nel Codice HTML
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Molti script di tracciamento (es. Meta Pixel, TikTok, Criteo) inseriscono nel DOM un tag <code>&lt;noscript&gt;</code> contenente un'immagine 1x1 come fallback per utenti senza JavaScript.
              </p>
            </div>

            <div className="bg-slate-900 text-slate-200 p-4 rounded-lg font-mono text-xs space-y-2">
              <span className="text-slate-400">// Premi Ctrl+F dentro la scheda "Elementi" (Elements) e cerca:</span>
              <div className="text-emerald-400">img[width="1"]</div>
              <div className="text-emerald-400">img[style*="display: none"]</div>
              <div className="text-emerald-400">img[src*="facebook.com/tr"]</div>
            </div>
          </div>

          {/* Metodo 3: Blocco Globale Tracker Web */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <div>
              <span className="text-xs font-mono text-emerald-600 font-bold uppercase tracking-wider">
                Metodo 3 (Strumenti di Difesa Globale)
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                Come Bloccare Automaticamente i Pixel durante la Navigazione
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 border border-slate-200 rounded-lg space-y-1">
                <span className="font-bold text-slate-900">uBlock Origin</span>
                <p className="text-slate-600">
                  L'estensione open-source più potente. Ha liste integrate (EasyPrivacy, Peter Lowe) che bloccano alla radice tutte le connessioni verso domini di pixel noti (Facebook, Google, TikTok, Criteo).
                </p>
              </div>

              <div className="p-3.5 border border-slate-200 rounded-lg space-y-1">
                <span className="font-bold text-slate-900">Privacy Badger (EFF)</span>
                <p className="text-slate-600">
                  Sviluppata dalla Electronic Frontier Foundation. Impara dinamicamente quali domini ti seguono attraverso siti diversi e blocca automaticamente le richieste di tracciamento invisibili.
                </p>
              </div>

              <div className="p-3.5 border border-slate-200 rounded-lg space-y-1">
                <span className="font-bold text-slate-900">Brave Browser / Firefox Protezione Avanzata</span>
                <p className="text-slate-600">
                  Integrano di serie la protezione antitracciamento con partizionamento dei cookie e blocco dei pixel di terze parti senza bisogno di estensioni esterne.
                </p>
              </div>

              <div className="p-3.5 border border-slate-200 rounded-lg space-y-1">
                <span className="font-bold text-slate-900">DNS Sinkhole (Pi-hole / NextDNS)</span>
                <p className="text-slate-600">
                  Blocca i pixel a livello di router domestico o DNS su tutti i dispositivi (smartphone, smart TV, computer), impedendo la risoluzione dell'IP del server tracciante.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

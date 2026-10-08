# 🛡️ PixelDetector — Rilevatore e Analizzatore Forense di Tracking Pixel

![PixelDetector Logo](/public/pixel_detector_logo.jpg)

[![Version](https://img.shields.io/badge/version-V.1.0.0-blue.svg)](https://github.com)
[![React](https://img.shields.io/badge/React-19.0.1-61dafb.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-3178c6.svg)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8.3-646cff.svg)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.3-38bdf8.svg)](https://tailwindcss.com)
[![Privacy](https://img.shields.io/badge/Privacy-100%25%20Local-emerald.svg)](#privacy--gdpr-compliance)
[![License](https://img.shields.io/badge/license-Apache--2.0-green.svg)](LICENSE)

**PixelDetector** è un'applicazione web open-source per la **cybersecurity e la tutela della privacy digitale**. Progettata per individuare, isolare e neutralizzare **tracking pixel**, **web beacon**, **ricevute di lettura spia** e tracciatori invisibili incorporati all'interno di email (HTML / EML) e pagine web.

L'elaborazione viene eseguita interamente **in locale nel browser (client-side)**: nessun frammento delle tue email o dei tuoi dati viene mai trasmesso a server esterni.

---

## 📑 Indice

1. [Descrizione Funzionale](#-descrizione-funzionale)
2. [Cosa Sono i Tracking Pixel](#-cosa-sono-i-tracking-pixel)
3. [Funzionalità Principali](#-funzionalità-principali)
4. [Architettura Tecnica](#-architettura-tecnica)
5. [Struttura del Progetto](#-struttura-del-progetto)
6. [Prerequisiti e Installazione](#-prerequisiti-e-installazione)
7. [Comandi Utili (Build & Sviluppo)](#-comandi-utili-build--sviluppo)
8. [Guida al Deploy](#-guida-al-deploy)
9. [Privacy & GDPR Compliance](#-privacy--gdpr-compliance)
10. [Licenza](#-licenza)

---

## 🔍 Descrizione Funzionale

I tracking pixel (noti anche come *web beacon* o *GIF da 1 pixel*) sono minuscoli elementi grafici trasparenti invisibili a occhio nudo (spesso $1 \times 1\text{ px}$ o $0 \times 0\text{ px}$) inseriti all'interno di comunicazioni email promozionali, messaggi CRM o siti web.

Quando il destinatario apre l'email o la pagina web, il client tenta automaticamente di scaricare l'immagine contattando il server remoto del mittente, comunicando:
* **Indirizzo IP pubblico reale** e geolocalizzazione stimata (città/ISP).
* **Timestamp esatto al secondo** dell'apertura del messaggio.
* **User-Agent completo:** sistema operativo, modello del dispositivo, browser o client di posta (es. Thunderbird, Outlook, Apple Mail).
* **Conferma di recapito:** convalida che la casella email è attiva e monitorata.
* **Frequenza di lettura:** quante volte e a che intervalli il messaggio viene riaperto.

**PixelDetector** fornisce una suite completa per analizzare il codice sorgente, visualizzare dove sono nascosti questi elementi, rimuoverli con un clic e imparare a difendersi.

---

## 🚀 Funzionalità Principali

### 1. 🔬 Scanner Forense Interattivo (Email & Web)
* **Supporto Multiformato:** Incolla codice HTML puro, testo sorgente o carica file `.eml`, `.html`, `.htm`, `.txt`.
* **Download Remoto Web:** Possibilità di inserire l'URL di un sito web per esaminarne l'HTML.
* **Casi di Studio Precaricati:** 5 campioni reali inclusi con un clic (Newsletter SendGrid/Mailchimp, Email Spia Streak CRM, Trucco CSS con sfondo nascosto, Landing E-Commerce con Meta Pixel & Google Beacon, Email Pulita Privacy-First).
* **Database di 50+ Tracker Riconosciuti:** Identificazione automatica di provider ESP e marketing:
  * *Email ESP / CRM:* Mailchimp, Mandrill, SendGrid, HubSpot, Klaviyo, Streak, Mailtrack, Mixmax, Superhuman, Salesforce Marketing Cloud, ActiveCampaign, Brevo (Sendinblue), Campaign Monitor, Substack, Beehiiv, Yesware, Intercom, Postmark.
  * *Web Ad / Analytics:* Meta / Facebook Pixel (`fbevents.js`, `tr?id=`), Google Tag & Analytics (`collect`, `gtag`), TikTok Pixel, LinkedIn Insight Tag, X (Twitter) Ads, Pinterest, Criteo.
* **Analisi Parametri Query:** Estrazione dei token identificativi univoci (`uid`, `mc_eid`, `open`, `trk`, `lead`).

### 2. 🛡️ Anteprima Sandbox con "Evidenzia Pixel"
* Renderizza l'email in un iframe con attributi di isolamento di sicurezza (`sandbox="allow-same-origin"`).
* **Modalità Evidenziazione:** Trasforma qualsiasi pixel invisibile in un vistoso quadrato rosso lampeggiante con bordo neon da $32 \times 32\text{ px}$, permettendo all'utente di vedere **in quale punto esatto dell'email il mittente ha inserito la spia**.
* **Simulatore Privacy Shield:** Mostra l'email simulando il blocco totale dei contenuti remoti come avviene in Mozilla Thunderbird o Google Workspace.

### 3. 🧹 Sanificatore HTML (Email Cleaner)
* Rimuove istantaneamente tutti i tag `<img>` sospetti, le immagini GIF in base64, gli sfondi `background-image: url(...)` e i preload beacon.
* Sostituisce i tracker con commenti sicuri `<!-- [PixelDetector: Tracking Pixel rimosso] -->`.
* Consente di **copiare l'HTML sanificato** con un clic o di **scaricarlo come file `.html`** pronto per essere inoltrato o archiviato senza rischi.

### 4. 🧪 Simulatore Interattivo "Anatomia di una Spia"
* Schema visivo del ciclo di vita di un pixel (Generazione Token $\rightarrow$ Apertura $\rightarrow$ Richiesta HTTP GET $\rightarrow$ Log nel CRM).
* **Fingerprint Live del tuo Browser:** Mostra in tempo reale quali dati il tuo dispositivo attuale trasmetterebbe se caricasse un pixel in questo momento (risoluzione schermo, fuso orario, lingua, User-Agent).
* **Simulatore Ricezione Beacon:** Genera richieste di test e visualizza il log del server simulato in tempo reale.

### 5. 📚 Guida Pratica & Manuale Operativo
* Istruzioni passo-passo per attivare il blocco immagini automatico in **Gmail**, **Apple Mail** (con la funzione "Proteggi l'attività di Mail" su iOS/macOS), **Outlook** e **Thunderbird**.
* Come leggere la sorgente "Mostra originale" e quali stringhe cercare con `Ctrl + F`.
* Guida all'uso dei **DevTools del Browser (F12)**: schede Rete/Network, Elementi/DOM e filtri di ricerca.

### 6. 💻 Suite Strumenti & Script Pronti all'Uso
* **Script DevTools Console:** Snippet JavaScript con guida per la protezione *Self-XSS* (`allow pasting`) o per l'uso tramite *Frammenti/Snippets* di Chrome.
* **Bookmarklet 1-Click:** Script JavaScript eseguibile dalla barra dei preferiti del browser.
* **Script CLI Python:** Script da terminale (`pixeldetector_scanner.py`) basato su `BeautifulSoup` per scansionare archivi di file `.eml` da linea di comando.

---

## 🏗️ Architettura Tecnica

Il progetto è sviluppato come **Single Page Application (SPA)** reattiva, moderna e leggera, progettata per prestazioni massime e zero overhead.

```
┌─────────────────────────────────────────────────────────────┐
│                    PixelDetector Client SPA                 │
├───────────────────────────────┬─────────────────────────────┤
│        Interfaccia UI         │     Motore di Rilevamento   │
│  • React 19 (Hooks)           │  • DOMParser (Sandboxed)    │
│  • Tailwind CSS v4            │  • Regex Signature DB       │
│  • Lucide React Icons         │  • CSS Style Inspector      │
│  • Anteprima Sandbox (iFrame) │  • HTML Sanitizer Engine    │
└───────────────────────────────┴─────────────────────────────┘
                               ▲
               Elaborazione 100% Client-Side
                   Nessun dato esce dal browser
```

### Stack Tecnologico
* **Framework:** [React 19](https://react.dev/)
* **Linguaggio:** [TypeScript 5+](https://www.typescriptlang.org/)
* **Bundler & Dev Server:** [Vite 8](https://vitejs.dev/)
* **Styling Engine:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Icone:** [Lucide React](https://lucide.dev/)
* **Parser DOM:** Browser Native `DOMParser` + AST Traversal

---

## 📁 Struttura del Progetto

```text
├── index.html                     # Entry point HTML con metadati, favicon e OpenGraph
├── metadata.json                  # Metadati dell'applet AI Studio
├── package.json                   # Dipendenze e script npm
├── tsconfig.json                  # Configurazione TypeScript ES2022
├── vite.config.ts                 # Configurazione Vite e alias di percorso
├── public/                        # Asset statici serviti alla radice
│   ├── favicon.jpg                # Favicon dell'applicazione
│   └── pixel_detector_logo.jpg    # Logo ufficiale pubblico ad alta risoluzione
└── src/
    ├── main.tsx                   # Inizializzazione React DOM
    ├── App.tsx                    # Componente radice, navigazione schede e footer
    ├── index.css                  # Foglio di stile globale (Tailwind v4)
    ├── assets/
    │   └── images/
    │       └── pixel_detector_logo_*.jpg  # Asset logo originale
    ├── components/
    │   ├── Header.tsx             # Navbar, logo brand e badge versione V.1.0.0
    │   ├── ScannerTab.tsx         # Scanner forense, campioni, sandbox e sanificatore
    │   ├── GuideTab.tsx           # Guida per email (client) e pagine web (DevTools)
    │   ├── SimulatorTab.tsx       # Simulatore di impronta digitale e log di ricezione
    │   └── ToolsTab.tsx           # Snippet console DevTools, bookmarklet e script Python
    └── lib/
        ├── types.ts               # Tipi TypeScript (DetectedPixel, AnalysisResult, ecc.)
        ├── detector.ts            # Motore euristico di rilevamento, firme ESP e sanificazione
        ├── samples.ts             # Dataset dei casi di studio reali precaricati
        └── devtools-script.ts     # Script per la console di Chrome e CLI Python
```

---

## 🛠️ Prerequisiti e Installazione

Assicurati di avere installato sul tuo sistema:
* **Node.js**: versione `18.0.0` o superiore (consigliata `20.x` LTS)
* **npm**: versione `9.x` o superiore (o in alternativa `pnpm` o `bun`)

### 1. Clona il repository
```bash
git clone https://github.com/tuo-username/pixel-detector.git
cd pixel-detector
```

### 2. Installa le dipendenze
```bash
npm install
```

### 3. Avvia il server di sviluppo locale
```bash
npm run dev
```
L'applicazione sarà accessibile all'indirizzo:
`http://localhost:3000` (o la porta visualizzata nel terminale).

---

## ⌨️ Comandi Utili (Build & Sviluppo)

Tutti i comandi disponibili in `package.json`:

| Comando | Descrizione |
| :--- | :--- |
| `npm run dev` | Avvia il server di sviluppo locale con Hot Module Replacement (HMR). |
| `npm run build` | Compila l'applicazione per la produzione ottimizzando asset e bundle nella cartella `dist/`. |
| `npm run preview` | Avvia un server locale per testare la build di produzione generata in `dist/`. |
| `npm run lint` | Esegue il controllo dei tipi TypeScript senza generare file (`tsc --noEmit`). |
| `npm run clean` | Rimuove le directory di build precedenti (`dist/`). |

---

## 🚢 Guida al Deploy

La build di PixelDetector genera file statici puri HTML, CSS e JavaScript nella directory `dist/`. Può essere distribuita gratuitamente su qualsiasi piattaforma di hosting statico o container.

### A. Deploy su Vercel
1. Installa la CLI di Vercel: `npm i -g vercel`
2. Esegui il comando di deploy nella cartella del progetto:
   ```bash
   vercel
   ```
   * *Build Command:* `npm run build`
   * *Output Directory:* `dist`

### B. Deploy su Netlify
1. Installa la CLI di Netlify: `npm i -g netlify-cli`
2. Esegui:
   ```bash
   netlify deploy --prod --dir=dist
   ```

### C. Deploy su GitHub Pages
1. Aggiungi il campo `base` in `vite.config.ts`:
   ```ts
   export default defineConfig({
     base: '/pixel-detector/',
     // ...
   });
   ```
2. Compila con `npm run build` e pubblica il contenuto di `dist/` sul branch `gh-pages`.

### D. Deploy con Docker / Nginx
Puoi usare questo semplice `Dockerfile` per servire l'applicazione con Nginx:

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Esegui la build e il run del container:
```bash
docker build -t pixeldetector:latest .
docker run -d -p 8080:80 pixeldetector:latest
```
L'applicazione risponderà su `http://localhost:8080`.

---

## 🔒 Privacy & GDPR Compliance

* **Nessun Dato Trasmesso:** Tutti i messaggi email incollati o caricati vengono analizzati esclusivamente nella memoria RAM del browser tramite l'API standard `DOMParser`. Nessuna richiesta di rete invia il corpo del testo a server terzi.
* **Nessun Cookie di Tracciamento:** L'applicazione non utilizza cookie di terze parti, pixel pubblicitari né telemetria di analytics.
* **Isolamento della Sandbox:** L'anteprima visuale delle email è confinata all'interno di un `<iframe>` isolato con restrizioni di sicurezza per evitare l'esecuzione di script non autorizzati o il caricamento silente di tracker esterni.

---

## 📄 Licenza

Distribuito sotto licenza **Apache-2.0**. Consulta il file `LICENSE` o le intestazioni del codice per ulteriori dettagli.

---

<p align="center">
  Sviluppato con dedizione per la privacy e la sicurezza digitale · <strong>PixelDetector</strong>
</p>

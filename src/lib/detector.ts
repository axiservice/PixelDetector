import { DetectedPixel, AnalysisSummary, AnalysisResult, EmailHeaderAnalysis, RiskLevel, DetectionCategory } from './types';

// Known tracking services with signatures and descriptions
export const KNOWN_TRACKERS: {
  pattern: RegExp;
  name: string;
  category: 'esp' | 'crm' | 'ad_web' | 'analytics';
  description: string;
}[] = [
  // Email ESPs & Marketing
  {
    pattern: /(list-manage\.com\/track\/open|mandrillapp\.com\/track)/i,
    name: 'Mailchimp / Mandrill',
    category: 'esp',
    description: 'Pixel di apertura campagna Mailchimp. Registra istantaneamente l\'apertura, timestamp e client email.'
  },
  {
    pattern: /(sendgrid\.net\/wf\/open|ct\.sendgrid\.net\/wf\/open)/i,
    name: 'SendGrid',
    category: 'esp',
    description: 'Pixel di tracciamento SendGrid (Twilio). Monitora l\'avvenuta consegna e la visualizzazione del messaggio.'
  },
  {
    pattern: /(t\.hubspotemail\.com|hs-analytics\.net|track\.hubspot\.com)/i,
    name: 'HubSpot Marketing',
    category: 'esp',
    description: 'Pixel CRM HubSpot. Associa l\'apertura della mail al profilo del lead nel database di marketing.'
  },
  {
    pattern: /(klaviyo\.com\/track|trk\.klaviyo\.com|manage\.kmail-lists\.com)/i,
    name: 'Klaviyo',
    category: 'esp',
    description: 'Pixel e-commerce Klaviyo. Segnala apertura email e orari di lettura per segmentazione vendite.'
  },
  {
    pattern: /(mailtrack\.io\/trace|mltrk\.io|mlt01\.com)/i,
    name: 'Mailtrack',
    category: 'crm',
    description: 'Spia di lettura Mailtrack (doppia spunta per Gmail). Registra orario esatto, dispositivo e riaperture.'
  },
  {
    pattern: /(mailfoogae\.appspot\.com|streak\.com\/api)/i,
    name: 'Streak CRM',
    category: 'crm',
    description: 'Pixel spia invisibile di Streak per Gmail. Notifica al mittente quando e da dove leggi la mail in tempo reale.'
  },
  {
    pattern: /(mixmax\.com\/api\/track|email\.mixmax\.com)/i,
    name: 'Mixmax',
    category: 'crm',
    description: 'Tracker di lettura Mixmax. Invia ricevuta silenziosa al mittente appena il client carica l\'immagine.'
  },
  {
    pattern: /(superhuman\.com\/api\/read-receipt|superhuman\.com\/m\/)/i,
    name: 'Superhuman Read Receipt',
    category: 'crm',
    description: 'Conferma di lettura invisibile di Superhuman.'
  },
  {
    pattern: /(exacttarget\.com|click\.exacttarget\.com|salesforce\.com|pardot\.com)/i,
    name: 'Salesforce Marketing Cloud / Pardot',
    category: 'esp',
    description: 'Tracker aziendale Salesforce per lead scoring e automazioni B2B.'
  },
  {
    pattern: /(activehosted\.com\/lt\.php|acems1\.com)/i,
    name: 'ActiveCampaign',
    category: 'esp',
    description: 'Pixel di automazione ActiveCampaign.'
  },
  {
    pattern: /(sendinblue\.com|brevo\.com\/track|mailin-a\.com)/i,
    name: 'Brevo (ex Sendinblue)',
    category: 'esp',
    description: 'Pixel di tracciamento newsletter Brevo.'
  },
  {
    pattern: /(createsend\.com\/t\/|cmail\d+\.com)/i,
    name: 'Campaign Monitor',
    category: 'esp',
    description: 'Tracker email di Campaign Monitor.'
  },
  {
    pattern: /(constantcontact\.com|rs6\.net)/i,
    name: 'Constant Contact',
    category: 'esp',
    description: 'Pixel di reportistica Constant Contact.'
  },
  {
    pattern: /(substack\.com\/api\/v1\/email\/open)/i,
    name: 'Substack Newsletter',
    category: 'esp',
    description: 'Pixel nativo di Substack per calcolare il tasso di apertura degli abbonati.'
  },
  {
    pattern: /(beehiiv\.com\/track)/i,
    name: 'Beehiiv',
    category: 'esp',
    description: 'Pixel di lettura piattaforma Beehiiv.'
  },
  {
    pattern: /(yesware\.com\/t\/)/i,
    name: 'Yesware',
    category: 'crm',
    description: 'Ricevuta spia invisibile per vendite aziendali Yesware.'
  },
  {
    pattern: /(pstmrk\.it|postmarkapp\.com)/i,
    name: 'Postmark (ActiveCampaign)',
    category: 'esp',
    description: 'Pixel transazionale Postmark.'
  },
  {
    pattern: /(intercom-mail\.com|via\.intercom\.io)/i,
    name: 'Intercom',
    category: 'crm',
    description: 'Tracker di conversazione e onboarding Intercom.'
  },
  // Web Trackers (Web pages)
  {
    pattern: /(facebook\.com\/tr|connect\.facebook\.net\/.*\/fbevents\.js)/i,
    name: 'Meta / Facebook Pixel',
    category: 'ad_web',
    description: 'Pixel pubblicitario Meta. Traccia conversioni, visite e associa l\'utente al suo profilo Facebook/Instagram.'
  },
  {
    pattern: /(google-analytics\.com\/(collect|g\/collect)|googletagmanager\.com)/i,
    name: 'Google Analytics / GTM Beacon',
    category: 'analytics',
    description: 'Endpoint di telemetria Google Analytics. Invia eventi di pagina, browser, risoluzione e referrer.'
  },
  {
    pattern: /(analytics\.tiktok\.com|analytics\.tiktok\.com\/api\/v2\/)/i,
    name: 'TikTok Pixel',
    category: 'ad_web',
    description: 'Pixel di conversione e targeting per la piattaforma annunci TikTok.'
  },
  {
    pattern: /(px\.ads\.linkedin\.com|snap\.licdn\.com)/i,
    name: 'LinkedIn Insight Tag',
    category: 'ad_web',
    description: 'Pixel B2B LinkedIn. Monitora conversioni e associa la visita al profilo professionale.'
  },
  {
    pattern: /(analytics\.twitter\.com|t\.co\/1\/i\/adsct)/i,
    name: 'X (Twitter) Ads Pixel',
    category: 'ad_web',
    description: 'Pixel di conversione Twitter / X per campagne promozionali.'
  },
  {
    pattern: /(ct\.pinterest\.com)/i,
    name: 'Pinterest Conversion Tag',
    category: 'ad_web',
    description: 'Tag pixel di Pinterest per retargeting pubblicitario.'
  },
  {
    pattern: /(criteo\.com\/delivery\/lg\.php|static\.criteo\.net)/i,
    name: 'Criteo Retargeting',
    category: 'ad_web',
    description: 'Pixel per banner di remarketing dinamico.'
  }
];

// Helper to extract query parameters from URL
function extractQueryParams(urlStr: string): Record<string, string> {
  const result: Record<string, string> = {};
  try {
    const qIndex = urlStr.indexOf('?');
    if (qIndex === -1) return result;
    const query = urlStr.slice(qIndex + 1);
    const searchParams = new URLSearchParams(query);
    searchParams.forEach((val, key) => {
      // Don't expose extremely long tokens truncated
      result[key] = val.length > 50 ? `${val.slice(0, 47)}...` : val;
    });
  } catch {
    // ignore
  }
  return result;
}

// Check if image data URI is a 1x1 GIF or PNG
function isTransparentDataUri(src: string): boolean {
  if (!src.startsWith('data:image/')) return false;
  // 1x1 transparent GIF signature: R0lGODlhAQABA...
  if (src.includes('R0lGODlhAQABA') || src.includes('R0lGODlhAQABAI')) return true;
  // 1x1 transparent PNG signature
  if (src.includes('iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB')) return true;
  return false;
}

// Parse EML headers if input looks like an EML file
export function parseEmlHeaders(rawText: string): { headers: EmailHeaderAnalysis; body: string } {
  const headers: EmailHeaderAnalysis = {};
  let body = rawText;

  // Split headers and body at first double line break
  const headerMatch = rawText.match(/^([\s\S]*?)\r?\n\r?\n([\s\S]*)$/);
  if (headerMatch && (rawText.includes('From:') || rawText.includes('Subject:') || rawText.includes('Received:'))) {
    const rawHeaders = headerMatch[1];
    body = headerMatch[2];

    const lines = rawHeaders.split(/\r?\n/);
    for (const line of lines) {
      if (/^From:/i.test(line)) headers.sender = line.replace(/^From:\s*/i, '').trim();
      if (/^X-Mailer:/i.test(line)) headers.mailer = line.replace(/^X-Mailer:\s*/i, '').trim();
      if (/^Feedback-ID:/i.test(line)) headers.feedbackId = line.replace(/^Feedback-ID:\s*/i, '').trim();
      if (/^Message-ID:/i.test(line)) headers.messageId = line.replace(/^Message-ID:\s*/i, '').trim();
      if (/^List-Unsubscribe:/i.test(line)) headers.hasListUnsubscribe = true;
    }

    // Identify ESP from headers
    if (rawHeaders.includes('sendgrid.net') || /X-SG-EID/i.test(rawHeaders)) {
      headers.espDetected = 'SendGrid';
    } else if (rawHeaders.includes('mailchimpapp.net') || /X-MC-User/i.test(rawHeaders)) {
      headers.espDetected = 'Mailchimp';
    } else if (rawHeaders.includes('mailgun.org') || /X-Mailgun/i.test(rawHeaders)) {
      headers.espDetected = 'Mailgun';
    } else if (rawHeaders.includes('mailtrack.io')) {
      headers.espDetected = 'Mailtrack';
    } else if (rawHeaders.includes('mailfoogae.appspot.com')) {
      headers.espDetected = 'Streak';
    }
  }

  return { headers, body };
}

// Core Detection Function
export function analyzeContent(rawInput: string, mode: 'email' | 'web' = 'email'): AnalysisResult {
  const suspects: DetectedPixel[] = [];
  const providersSet = new Set<string>();
  const techniquesSet = new Set<string>();

  // Check if EML format
  const { headers, body } = parseEmlHeaders(rawInput);
  const htmlToAnalyze = body.trim() ? body : rawInput;

  // Parse DOM in a browser-safe or mock environment
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlToAnalyze, 'text/html');

  let totalAnalyzed = 0;

  // 1. Inspect all <img> tags
  const images = Array.from(doc.querySelectorAll('img'));
  totalAnalyzed += images.length;

  images.forEach((img, idx) => {
    const src = img.getAttribute('src') || '';
    if (!src) return;

    const widthAttr = (img.getAttribute('width') || '').trim();
    const heightAttr = (img.getAttribute('height') || '').trim();
    const styleAttr = (img.getAttribute('style') || '').toLowerCase();
    const altAttr = img.getAttribute('alt');

    // Dimension checks
    const isWZeroOrOne = widthAttr === '0' || widthAttr === '1' || widthAttr === '0px' || widthAttr === '1px';
    const isHZeroOrOne = heightAttr === '0' || heightAttr === '1' || heightAttr === '0px' || heightAttr === '1px';
    const isDimensionSuspect = isWZeroOrOne && isHZeroOrOne;

    // Style concealment checks
    const isHiddenByStyle = 
      styleAttr.includes('display:none') ||
      styleAttr.includes('display: none') ||
      styleAttr.includes('visibility:hidden') ||
      styleAttr.includes('visibility: hidden') ||
      styleAttr.includes('opacity:0') ||
      styleAttr.includes('opacity: 0') ||
      (styleAttr.includes('width:0') && styleAttr.includes('height:0')) ||
      (styleAttr.includes('width: 0') && styleAttr.includes('height: 0')) ||
      (styleAttr.includes('width:1px') && styleAttr.includes('height:1px')) ||
      (styleAttr.includes('width: 1px') && styleAttr.includes('height: 1px')) ||
      styleAttr.includes('position:absolute') && styleAttr.includes('-9999px') ||
      styleAttr.includes('position: absolute') && styleAttr.includes('-9999px');

    const isTransparentGif = isTransparentDataUri(src);

    // Known tracker match
    let matchedTracker = KNOWN_TRACKERS.find(t => t.pattern.test(src));
    
    // Check suspicious filename or paths
    const isBeaconPath = /(pixel|beacon|track|trace|open|wf\/open|ping|spacer\.gif|blank\.gif|clear\.gif|1x1\.gif)/i.test(src);
    const hasTrackingParams = /(\?|&)(open|trk|track|mc_eid|uid|recipient|lead|user_id|guid)=/i.test(src);

    // Criteria to flag as a pixel
    const isFlagged = 
      isDimensionSuspect || 
      isHiddenByStyle || 
      isTransparentGif || 
      !!matchedTracker || 
      (isBeaconPath && (isWZeroOrOne || isHZeroOrOne || !altAttr));

    if (isFlagged) {
      const extractedParams = extractQueryParams(src);
      const leakInfo: string[] = [
        'Timestamp esatto di apertura',
        'Indirizzo IP pubblico e posizione approssimativa (città/ISP)',
        'User-Agent: tipo di dispositivo, sistema operativo, client email',
        'Conferma che la casella email è attiva ed esiste'
      ];

      if (Object.keys(extractedParams).length > 0) {
        leakInfo.push(`Identificatore univoco destinatario (${Object.keys(extractedParams).join(', ')})`);
      }

      let risk: RiskLevel = 'alto';
      if (matchedTracker) {
        providersSet.add(matchedTracker.name);
      } else if (isBeaconPath || isTransparentGif) {
        risk = 'medio';
      }

      let explanation = '';
      if (isDimensionSuspect && matchedTracker) {
        explanation = `Immagine con dimensioni 1×1 px associata a ${matchedTracker.name}. È un classico tracking pixel progettato per essere invisibile agli occhi dell'utente ma scaricato automaticamente per notificare il mittente.`;
        techniquesSet.add('Pixel invisibile 1×1 px');
      } else if (isDimensionSuspect) {
        explanation = `Immagine con dimensioni 1×1 px (o 0×0 px). Non ha alcuna funzione visiva ed è usata come web beacon di tracciamento.`;
        techniquesSet.add('Pixel invisibile 1×1 px');
      } else if (isHiddenByStyle) {
        explanation = `Immagine nascosta tramite CSS (${styleAttr}). Questa tecnica maschera il pixel dall'interfaccia rendendolo invisibile all'utente.`;
        techniquesSet.add('Pixel nascosto via CSS (display:none/opacity:0)');
      } else if (isTransparentGif) {
        explanation = `GIF trasparente microscopica (1×1 trasparente in base64 o spacer). Usata come falso elemento decorativo per mascherare il tracciamento.`;
        techniquesSet.add('GIF trasparente 1×1');
      } else if (matchedTracker) {
        explanation = `URL appartenente al servizio tracciante noto ${matchedTracker.name}.`;
        techniquesSet.add('Dominio tracciatore noto');
      } else {
        explanation = `URL sospetto con parametri di monitoraggio aperture o percorsi dedicati (/open, /track, /beacon).`;
        techniquesSet.add('Beacon URL con parametri');
      }

      suspects.push({
        id: `pixel-img-${idx}-${Date.now()}`,
        category: 'image_pixel',
        rawSnippet: img.outerHTML,
        sourceUrl: src,
        elementName: '<img>',
        width: widthAttr || (isDimensionSuspect ? '1' : undefined),
        height: heightAttr || (isDimensionSuspect ? '1' : undefined),
        isDimensionSuspect,
        isHiddenByStyle,
        isTransparentGif,
        provider: matchedTracker?.name,
        matchedRule: matchedTracker ? `Regola: ${matchedTracker.name}` : (isDimensionSuspect ? 'Dimensioni 1×1 / 0×0' : 'Attributi di occultamento'),
        extractedParams,
        risk,
        leakInfo,
        explanation
      });
    }
  });

  // 2. Inspect CSS Background URL tracking (inline styles and <style> blocks)
  const elementsWithStyle = Array.from(doc.querySelectorAll('[style*="url("], [style*="url (\'"], style'));
  elementsWithStyle.forEach((el, idx) => {
    let cssText = '';
    let outerSnippet = '';
    if (el.tagName.toLowerCase() === 'style') {
      cssText = el.textContent || '';
      outerSnippet = `<style>...</style>`;
    } else {
      cssText = el.getAttribute('style') || '';
      outerSnippet = (el as HTMLElement).outerHTML.slice(0, 150) + '...';
    }

    const urlMatches = cssText.match(/url\s*\(\s*['"]?([^'")]+)['"]?\s*\)/gi);
    if (urlMatches) {
      urlMatches.forEach((matchStr, matchIdx) => {
        const cleanUrl = matchStr.replace(/url\s*\(\s*['"]?/i, '').replace(/['"]?\s*\)/i, '').trim();
        if (!cleanUrl || cleanUrl.startsWith('data:image/svg')) return;

        const matchedTracker = KNOWN_TRACKERS.find(t => t.pattern.test(cleanUrl));
        const isBeaconUrl = /(track|trace|open|beacon|pixel|ping)/i.test(cleanUrl);

        if (matchedTracker || isBeaconUrl) {
          techniquesSet.add('CSS Background Image Beacon');
          if (matchedTracker) providersSet.add(matchedTracker.name);

          suspects.push({
            id: `pixel-css-${idx}-${matchIdx}`,
            category: 'css_beacon',
            rawSnippet: outerSnippet,
            sourceUrl: cleanUrl,
            elementName: el.tagName.toLowerCase() === 'style' ? '<style>' : `<${el.tagName.toLowerCase()} style="...">`,
            isDimensionSuspect: false,
            isHiddenByStyle: true,
            isTransparentGif: false,
            provider: matchedTracker?.name,
            matchedRule: 'CSS background-image URL beacon',
            extractedParams: extractQueryParams(cleanUrl),
            risk: 'alto',
            leakInfo: [
              'Timestamp di rendering del blocco CSS',
              'Indirizzo IP e Geolocation',
              'User-Agent del client',
              'Bypassa alcuni filtri basati solo su tag <img>'
            ],
            explanation: `Tracciatore iniettato come sfondo CSS (background-image: url(...)). Molti vecchi filtri anti-pixel controllano solo i tag <img>, per questo i marketer usano gli stili CSS per tracciare furtivamente il rendering.`
          });
        }
      });
    }
  });

  // 3. Inspect <script> tags for web pages (e.g. Meta Pixel fbevents.js, gtag, sendBeacon)
  const scripts = Array.from(doc.querySelectorAll('script'));
  totalAnalyzed += scripts.length;

  scripts.forEach((script, idx) => {
    const src = script.getAttribute('src') || '';
    const content = script.textContent || '';

    let matchedTracker = KNOWN_TRACKERS.find(t => t.pattern.test(src) || t.pattern.test(content));
    
    const isAnalyticsScript = 
      /fbq\s*\(\s*['"]track/i.test(content) ||
      /gtag\s*\(\s*['"]event/i.test(content) ||
      /google-analytics\.com\/analytics\.js/i.test(src) ||
      /googletagmanager\.com\/gtag\/js/i.test(src) ||
      /fbevents\.js/i.test(src) ||
      /tiktok\.com/i.test(src) ||
      /navigator\.sendBeacon/i.test(content);

    if (matchedTracker || isAnalyticsScript) {
      const providerName = matchedTracker?.name || (content.includes('fbq') ? 'Meta Pixel' : 'Google Tag / Analytics');
      providersSet.add(providerName);
      techniquesSet.add('Script tracciatore client-side');

      suspects.push({
        id: `pixel-script-${idx}`,
        category: 'script_tracker',
        rawSnippet: script.outerHTML.slice(0, 200) + (script.outerHTML.length > 200 ? '...' : ''),
        sourceUrl: src || 'Script inline',
        elementName: '<script>',
        isDimensionSuspect: false,
        isHiddenByStyle: false,
        isTransparentGif: false,
        provider: providerName,
        matchedRule: `Script di tracciamento (${providerName})`,
        extractedParams: src ? extractQueryParams(src) : {},
        risk: 'alto',
        leakInfo: [
          'Tracciamento eventi (click, scorrimento, acquisti, carrello)',
          'Cookie di terze parti e identificatori pubblicitari',
          'Fingerprinting del browser (canvas, risoluzione, estensioni)',
          'Associazione account social network'
        ],
        explanation: `Script attivo per tracciare comportamenti su pagina web e inviare beacon asincroni (${providerName}).`
      });
    }
  });

  // 4. Inspect <link rel="prefetch" | "preload"> or <meta>
  const links = Array.from(doc.querySelectorAll('link[rel="prefetch"], link[rel="preload"]'));
  links.forEach((link, idx) => {
    const href = link.getAttribute('href') || '';
    if (!href) return;
    const matchedTracker = KNOWN_TRACKERS.find(t => t.pattern.test(href));
    if (matchedTracker || /(pixel|track|beacon)/i.test(href)) {
      techniquesSet.add('Link Prefetch / Preload Beacon');
      suspects.push({
        id: `pixel-link-${idx}`,
        category: 'link_prefetch',
        rawSnippet: link.outerHTML,
        sourceUrl: href,
        elementName: '<link>',
        isDimensionSuspect: false,
        isHiddenByStyle: true,
        isTransparentGif: false,
        provider: matchedTracker?.name,
        matchedRule: 'Link prefetch pre-caricamento',
        extractedParams: extractQueryParams(href),
        risk: 'medio',
        leakInfo: ['Pre-caricamento automatico dal browser/client con conseguente leak IP'],
        explanation: `Tag <link> con prefetch che ordina al browser di effettuare una richiesta HTTP preventiva.`
      });
    }
  });

  // Determine Overall Highest Risk
  let highestRisk: RiskLevel = 'pulito';
  if (suspects.some(s => s.risk === 'alto')) {
    highestRisk = 'alto';
  } else if (suspects.some(s => s.risk === 'medio')) {
    highestRisk = 'medio';
  } else if (suspects.some(s => s.risk === 'basso')) {
    highestRisk = 'basso';
  }

  // Generate Sanitized HTML
  const sanitizedHtml = sanitizeHtml(htmlToAnalyze, suspects);

  const summary: AnalysisSummary = {
    totalAnalyzedElements: totalAnalyzed,
    totalSuspects: suspects.length,
    highestRisk,
    detectedProviders: Array.from(providersSet),
    techniquesUsed: Array.from(techniquesSet),
    sanitizedHtml,
    hasCssBeacons: suspects.some(s => s.category === 'css_beacon'),
    hasHiddenImages: suspects.some(s => s.category === 'image_pixel' && (s.isDimensionSuspect || s.isHiddenByStyle)),
    hasThirdPartyScripts: suspects.some(s => s.category === 'script_tracker')
  };

  return {
    suspects,
    summary,
    headers,
    rawInput,
    mode
  };
}

// Generate sanitized HTML without tracking pixels
export function sanitizeHtml(html: string, suspects: DetectedPixel[]): string {
  if (suspects.length === 0) return html;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Strip flagged image tags
  const suspectUrls = new Set(suspects.map(s => s.sourceUrl));
  const images = Array.from(doc.querySelectorAll('img'));

  images.forEach(img => {
    const src = img.getAttribute('src') || '';
    const w = img.getAttribute('width');
    const h = img.getAttribute('height');
    const style = (img.getAttribute('style') || '').toLowerCase();

    const is1x1 = (w === '1' || w === '0') && (h === '1' || h === '0');
    const isHidden = style.includes('display:none') || style.includes('visibility:hidden') || style.includes('opacity:0');
    const isKnownSuspect = suspectUrls.has(src);

    if (is1x1 || isHidden || isKnownSuspect || isTransparentDataUri(src)) {
      // Replace with neutral comment or a clear privacy banner in development
      const commentNode = doc.createComment(`[PixelDetector: Tracking Pixel rimosso (${src.slice(0, 60)})]`);
      img.parentNode?.replaceChild(commentNode, img);
    }
  });

  // Strip background: url(...) from inline styles
  const allElements = Array.from(doc.querySelectorAll('*'));
  allElements.forEach(el => {
    const style = el.getAttribute('style');
    if (style && /url\s*\(/i.test(style)) {
      const sanitizedStyle = style.replace(/background(-image)?\s*:\s*url\s*\([^)]*\);?/gi, '');
      if (sanitizedStyle.trim()) {
        el.setAttribute('style', sanitizedStyle);
      } else {
        el.removeAttribute('style');
      }
    }
  });

  // Strip tracking scripts
  const scripts = Array.from(doc.querySelectorAll('script'));
  scripts.forEach(script => {
    const src = script.getAttribute('src') || '';
    const content = script.textContent || '';
    if (KNOWN_TRACKERS.some(t => t.pattern.test(src) || t.pattern.test(content))) {
      const commentNode = doc.createComment(`[PixelDetector: Script tracciatore rimosso]`);
      script.parentNode?.replaceChild(commentNode, script);
    }
  });

  return doc.body.innerHTML || doc.documentElement.outerHTML;
}

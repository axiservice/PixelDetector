export const BROWSER_CONSOLE_SNIPPET = `// ============================================================
// PIXELDETECTOR: TROVA TUTTI I TRACKING PIXEL NELLA PAGINA CORRENTE
// Incolla questo script nella Console dei DevTools (F12 > Console)
// ============================================================
(function detectTrackingPixels() {
  console.group('%c🔍 [PixelDetector] Scansione Tracking Pixel in corso...', 'color: #0284c7; font-weight: bold; font-size: 13px;');
  
  const suspects = [];
  const allImages = Array.from(document.querySelectorAll('img'));
  
  allImages.forEach((img, i) => {
    const rect = img.getBoundingClientRect();
    const wAttr = parseInt(img.getAttribute('width') || '-1', 10);
    const hAttr = parseInt(img.getAttribute('height') || '-1', 10);
    const style = window.getComputedStyle(img);
    const src = img.src || img.getAttribute('src') || '';
    
    const isTinyRect = (rect.width <= 1 && rect.height <= 1);
    const isTinyAttr = (wAttr === 1 || wAttr === 0) && (hAttr === 1 || hAttr === 0);
    const isHidden = style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0;
    const isOffscreen = rect.left < -500 || rect.top < -500;
    const isTrackerUrl = /(pixel|beacon|track|open|wf\\/open|tr\\?|collect|analytics)/i.test(src);

    if (isTinyRect || isTinyAttr || isHidden || isOffscreen || isTrackerUrl) {
      // Evidenzia visivamente l'elemento nella pagina con un bordo rosso lampeggiante
      img.style.outline = '4px solid #ef4444';
      img.style.outlineOffset = '2px';
      img.style.position = 'relative';
      img.style.zIndex = '999999';
      img.title = '⚠️ TRACKING PIXEL IDENTIFICATO DA PIXELDETECTOR';

      suspects.push({
        '#': i + 1,
        'Dimensioni': \`\${rect.width}x\${rect.height}px (Attr: \${wAttr}x\${hAttr})\`,
        'Nascosto': isHidden ? 'Sì (CSS)' : (isOffscreen ? 'Sì (Offscreen)' : 'No'),
        'URL Sorgente': src.slice(0, 80) + (src.length > 80 ? '...' : ''),
        'Elemento': img
      });
    }
  });

  if (suspects.length > 0) {
    console.warn(\`⚠️ Trovati \${suspects.length} potenziali Tracking Pixel / Web Beacon!\`);
    console.table(suspects);
    console.log('%c💡 Suggerimento: Gli elementi sospetti sono stati evidenziati in rosso nella pagina.', 'color: #10b981;');
  } else {
    console.log('%c✅ Nessun tracking pixel o immagine microscopica rilevata nel DOM attuale.', 'color: #10b981; font-weight: bold;');
  }

  console.groupEnd();
})();`;

export const BOOKMARKLET_CODE = `javascript:(function(){const s=Array.from(document.querySelectorAll('img')).filter(i=>{const r=i.getBoundingClientRect(),st=window.getComputedStyle(i);return(r.width<=1&&r.height<=1)||st.display==='none'||st.visibility==='hidden'||parseFloat(st.opacity)===0||/(pixel|track|beacon|open)/i.test(i.src);});s.forEach(i=>{i.style.outline='4px solid red';i.style.display='inline-block';i.style.width='24px';i.style.height='24px';i.style.background='red';});alert('PixelDetector: Trovati '+s.length+' possibili tracking pixel.');})();`;

export const PYTHON_SCANNER_SCRIPT = `#!/usr/bin/env python3
"""
PixelDetector CLI - Rilevatore di Tracking Pixel per Email (.eml / .html)
Uso: python pixel_scanner.py messaggio.eml
"""
import sys
import re
from bs4 import BeautifulSoup
from email import policy
from email.parser import BytesParser

KNOWN_TRACKERS = [
    r'sendgrid\\.net/wf/open',
    r'list-manage\\.com/track/open',
    r'mailtrack\\.io',
    r'mailfoogae\\.appspot\\.com',
    r'hubspot.*track',
    r'klaviyo\\.com/track',
    r'facebook\\.com/tr',
    r'google-analytics\\.com/collect',
]

def scan_html(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    detected = []

    for img in soup.find_all('img'):
        src = img.get('src', '')
        w = img.get('width', '')
        h = img.get('height', '')
        style = img.get('style', '').lower()

        is_1x1 = (w in ['0', '1', '0px', '1px']) and (h in ['0', '1', '0px', '1px'])
        is_hidden = any(term in style for term in ['display:none', 'visibility:hidden', 'opacity:0'])
        is_known = any(re.search(pat, src, re.I) for pat in KNOWN_TRACKERS)

        if is_1x1 or is_hidden or is_known:
            detected.append({
                'src': src,
                'width': w,
                'height': h,
                'is_1x1': is_1x1,
                'is_hidden': is_hidden,
                'is_known_tracker': is_known
            })
    return detected

def main():
    if len(sys.argv) < 2:
        print("Uso: python pixel_scanner.py <file.eml|file.html>")
        sys.exit(1)

    filepath = sys.argv[1]
    with open(filepath, 'rb') as f:
        raw_bytes = f.read()

    # Tentativo parsing EML o HTML diretto
    if filepath.endswith('.eml'):
        msg = BytesParser(policy=policy.default).parsebytes(raw_bytes)
        body = msg.get_body(preferencelist=('html',))
        html = body.get_content() if body else ""
        print(f"[*] Da: {msg.get('From', 'N/A')}")
        print(f"[*] Oggetto: {msg.get('Subject', 'N/A')}")
        print(f"[*] X-Mailer: {msg.get('X-Mailer', 'N/A')}")
    else:
        html = raw_bytes.decode('utf-8', errors='ignore')

    results = scan_html(html)
    print(f"\\n--- RISULTATO ANALISI PIXELDETECTOR ---")
    print(f"Totale pixel sospetti trovati: {len(results)}\\n")

    for i, p in enumerate(results, 1):
        print(f"[{i}] Dimensioni: {p['width']}x{p['height']} | Nascosto: {p['is_hidden']}")
        print(f"    URL: {p['src']}")
        if p['is_known_tracker']:
            print("    ⚠️ IDENTIFICATO DOMINIO TRACCIATORE NOTO")
        print()

if __name__ == '__main__':
    main()
`;

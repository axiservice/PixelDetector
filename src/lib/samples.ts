export interface SampleData {
  id: string;
  title: string;
  subtitle: string;
  type: 'email' | 'web';
  riskLabel: string;
  content: string;
}

export const SAMPLES: SampleData[] = [
  {
    id: 'sample-newsletter',
    title: 'Newsletter Marketing (SendGrid / Mailchimp)',
    subtitle: 'Campagna promozionale tipica con pixel 1×1 nascosto nel footer',
    type: 'email',
    riskLabel: 'Alto Rischio',
    content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Offerta Speciale Primavera</title>
</head>
<body style="font-family: -apple-system, sans-serif; margin: 0; padding: 24px; background-color: #f8fafc; color: #1e293b;">
  <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden;">
    <div style="background-color: #0284c7; padding: 24px; text-align: center; color: white;">
      <h1 style="margin: 0; font-size: 22px;">Sconto Esclusivo del 30%</h1>
      <p style="margin: 8px 0 0; opacity: 0.9;">Solo per i nostri iscritti più fedeli</p>
    </div>
    
    <div style="padding: 24px;">
      <p>Ciao Marco,</p>
      <p>Abbiamo riservato per te una promozione a tempo limitato valida su tutto il nostro catalogo software.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://ct.sendgrid.net/ls/click?upn=xyz789promo" style="display: inline-block; background-color: #0284c7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Riscatta il tuo Voucher
        </a>
      </div>
      <p style="color: #64748b; font-size: 13px;">Se non desideri più ricevere queste comunicazioni, puoi disiscriverti in qualsiasi momento.</p>
    </div>

    <div style="background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
      © 2026 TechCorp SpA - Via Roma 42, Milano
    </div>

    <!-- TRACKING PIXEL SENDGRID INVISIBILE 1x1 PX -->
    <img src="https://sendgrid.net/wf/open?upn=u1X9zKbLa87QjA984Klmn_UserToken9941_ कैंप" width="1" height="1" alt="" style="display:none; width:1px; height:1px; overflow:hidden;" />
    
    <!-- TRACKING PIXEL MAILCHIMP FALLBACK -->
    <img src="https://list-manage.com/track/open.php?u=a1b2c3d4e5&id=9876543210&e=marco.rossi@example.it" width="1" height="1" alt="" border="0" />
  </div>
</body>
</html>`
  },
  {
    id: 'sample-crm-spy',
    title: 'Email Spia Personale CRM (Streak / Mailtrack)',
    subtitle: 'Messaggio 1-to-1 da commerciale con conferma di lettura segreta',
    type: 'email',
    riskLabel: 'Alto Rischio',
    content: `From: Luca Bianchi <luca.commerciale@agenziaweb.it>
To: Alessandro Verdi <alessandro@azienda.it>
Subject: Re: Preventivo rifacimento portale e-commerce
Date: Thu, 8 Oct 2026 09:15:22 +0200
X-Mailer: Streak for Gmail
Message-ID: <CAB98x21a_streak_tracker@mail.gmail.com>

<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <p>Buongiorno Alessandro,</p>
  <p>Ti ringrazio per il tempo dedicato alla nostra call di ieri.</p>
  <p>In allegato trovi il documento riassuntivo con i dettagli tecnici e la stima economica che avevamo concordato.</p>
  <p>Resto a disposizione per qualsiasi approfondimento.</p>
  <br>
  <p>Cordiali saluti,<br>
  <strong>Luca Bianchi</strong><br>
  Key Account Manager<br>
  Agenzia Web Solutions</p>

  <!-- RICEVUTA SILENZIOSA INVISIBILE STREAK -->
  <img src="https://mailfoogae.appspot.com/t?sender=luca.commerciale@agenziaweb.it&recipient=alessandro@azienda.it&msg_id=7492841&timestamp=1760001840" width="1" height="1" style="position: absolute; left: -9999px;" alt="" />

  <!-- SPIA MAILTRACK SECONDARIA -->
  <img src="https://mailtrack.io/trace/mail/783921.png?u=94821&msg=9821" width="1" height="1" style="display:none;" />
</body>
</html>`
  },
  {
    id: 'sample-css-beacon',
    title: 'Trucco CSS Evoluto (Sfondo Nascosto)',
    subtitle: 'Tracciamento senza tag <img> che elude i vecchi filtri anti-pixel',
    type: 'email',
    riskLabel: 'Alto Rischio',
    content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    /* Il pixel viene richiesto appena il client scarica i fogli di stile */
    .stealth-beacon {
      background-image: url('https://trk.klaviyo.com/track/open?k=99281&email=target@dominio.it&source=css_bypass');
      width: 1px;
      height: 1px;
    }
  </style>
</head>
<body style="font-family: sans-serif; padding: 20px;">
  <div style="max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px;">
    <h2>Promemoria Appuntamento</h2>
    <p>Gentile utente, ti ricordiamo la tua visita fissata per lunedì alle ore 10:00.</p>
    
    <!-- Elemento fittizio con trigger di background invisibile -->
    <div class="stealth-beacon" style="display: none;"></div>

    <div style="background-image: url('https://t.hubspotemail.com/v1/track?portalId=84920&email=target@dominio.it'); height: 0; width: 0; opacity: 0;"></div>
    
    <p>Grazie,<br>Il team medico</p>
  </div>
</body>
</html>`
  },
  {
    id: 'sample-web-ecommerce',
    title: 'Pagina Web E-Commerce (Meta Pixel + Google Beacon)',
    subtitle: 'Sorgente HTML di una pagina con tracker pubblicitari e pixel noscript',
    type: 'web',
    riskLabel: 'Alto Rischio',
    content: `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <title>Negozio Online - Scarpe Sportive</title>
  
  <!-- SCRIPT META PIXEL (FACEBOOK) -->
  <script>
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '987654321098765');
    fbq('track', 'PageView');
    fbq('track', 'ViewContent', { content_name: 'Scarpa Running Pro', value: 89.90, currency: 'EUR' });
  </script>

  <!-- GOOGLE TAG MANAGER / ANALYTICS BEACON -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-ABC123XYZ"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-ABC123XYZ');
  </script>
</head>
<body>
  <!-- NOSCRIPT FALLBACK CON TRACKING PIXEL PURO (1x1 GIF) -->
  <noscript>
    <img height="1" width="1" style="display:none" 
         src="https://www.facebook.com/tr?id=987654321098765&ev=PageView&noscript=1" alt="" />
  </noscript>

  <header>
    <h1>Sneaker Pro Ultra</h1>
    <p>Prezzo: €89.90</p>
  </header>
  
  <main>
    <p>Spedizione gratuita in tutta Italia.</p>
    <button>Aggiungi al Carrello</button>
  </main>

  <!-- BEACON CRITEO RETARGETING -->
  <img src="https://criteo.com/delivery/lg.php?zoneid=8841&uid=usr_xyz123" width="1" height="1" style="opacity:0" alt="" />
</body>
</html>`
  },
  {
    id: 'sample-clean',
    title: 'Email Pulita (Zero Tracciatori / Privacy)',
    subtitle: 'Comunicazione essenziale senza immagini esterne né spie',
    type: 'email',
    riskLabel: 'Pulito',
    content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Notifica di Sicurezza Account</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.5; padding: 24px; color: #2d3748; background-color: #f7fafc;">
  <div style="max-width: 520px; margin: 0 auto; background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px;">
    <h2 style="color: #2b6cb0; margin-top: 0;">Accesso completato con successo</h2>
    <p>Gentile utente,</p>
    <p>Ti confermiamo che il tuo account ha effettuato l'accesso oggi alle 11:24 da un dispositivo autorizzato.</p>
    <p>Se sei stato tu, non è richiesta alcuna azione.</p>
    <p style="margin-top: 24px; font-size: 13px; color: #718096; border-top: 1px solid #edf2f7; padding-top: 16px;">
      Questa notifica transazionale non include tracker di profilazione nel rispetto del GDPR e della privacy.
    </p>
  </div>
</body>
</html>`
  }
];

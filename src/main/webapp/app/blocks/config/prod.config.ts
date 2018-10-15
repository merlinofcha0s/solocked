import { enableProdMode } from '@angular/core';
import { DEBUG_INFO_ENABLED } from 'app/app.constants';

export function ProdConfig() {
    // disable debug data on prod profile to improve performance
    if (!DEBUG_INFO_ENABLED) {
        enableProdMode();
        initMatomo();
        initLivezilla();
    }
}

export function initMatomo() {
    const matomoScript = document.createElement('script');
    matomoScript.type = 'text/javascript';
    matomoScript.innerHTML =
        'var _paq = _paq || [];\n' +
        "  _paq.push(['trackPageView']); \n" +
        "  _paq.push(['requireConsent']);\n" +
        "  _paq.push(['enableLinkTracking']);\n" +
        '  (function() {\n' +
        '    let u="//piwik.solocked.com/";\n' +
        "    _paq.push(['setTrackerUrl', u+'piwik.php']);\n" +
        "    _paq.push(['setSiteId', '1']);\n" +
        "    let d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];\n" +
        "    g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);\n" +
        '  })();';

    document.getElementsByTagName('head')[0].appendChild(matomoScript);
}

export function initLivezilla() {
    const livezillaScript = document.createElement('script');
    livezillaScript.type = 'text/javascript';
    livezillaScript.id = '6ae2139652f33ef6a074dc241e169b76';
    livezillaScript.src = 'https://support.solocked.com/script.php?id=6ae2139652f33ef6a074dc241e169b76';
    document.getElementsByTagName('head')[0].appendChild(livezillaScript);
}

import type { Plugin } from '@docusaurus/types';

export default function matomoHeadPlugin(): Plugin {
    const isProd = process.env.NODE_ENV === 'production';

    return {
        name: 'matomo-plugin',
        injectHtmlTags() {
            if (!isProd) {
                return {};
            }
            return {
                headTags: [
                    {
                        tagName: 'script',
                        attributes: {
                            id: 'matomo-tracking',
                            strategy: 'afterInteractive',
                        },
                        innerHTML: `var _paq = window._paq = window._paq || [];
_paq.push(['trackPageView']);
_paq.push(['enableLinkTracking']);
(function() {
var u="https://psedev.matomo.cloud/";
_paq.push(['setTrackerUrl', u+'matomo.php']);
_paq.push(['setSiteId', '16']);
var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
g.async=true; g.src='//cdn.matomo.cloud/psedev.matomo.cloud/matomo.js'; s.parentNode.insertBefore(g,s);
})();`,
                    },
                ],
            };
        },
    };
}
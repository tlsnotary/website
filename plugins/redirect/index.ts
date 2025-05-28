// import type { RedirectItem } from '@docusaurus/plugin-client-redirects/lib/types';

type RedirectItem = {
    /** Pathname of the new page we should create */
    from: string | string[];
    /** Pathname of an existing Docusaurus page */
    to: string;
};

export const redirects: RedirectItem[] = [
    {
        to: '/docs/faq',
        from: '/faq', // we do not need to add '/faq.html' because it is already handled by the plugin
    },
    {
        to: '/docs/intro',
        from: '/intro'
    },
    {
        to: '/docs/motivation',
        from: '/motivation',
    },
    {
        to: '/docs/quick_start',
        from: '/quick_start',
    },
    {
        to: '/docs/quick_start/tlsn-js',
        from: '/quick_start/tlsn-js',
    },
];
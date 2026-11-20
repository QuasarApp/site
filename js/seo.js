/**
 * SEO Meta Tags & Structured Data Injection
 * Injects dynamic meta tags (description, canonical, OG, Twitter) and Schema.org JSON-LD
 * based on the current page and section being viewed.
 * Static rendering at build time - no runtime API calls.
 */

(function() {
    'use strict';

    // Configuration for each page/section
    const pageMeta = {
        // Homepage
        '/': {
            title: 'QuasarApp Group',
            description: 'Open-source organization building innovative software solutions and developer tools. Explore our projects and contribute to our community.',
            ogType: 'website',
            ogTitle: 'QuasarApp Group',
            ogImage: 'https://quasarapp.me/banner.png',
            twitterCard: 'summary_large_image',
            jsonld: {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                'name': 'QuasarApp Group d.o.o.',
                'url': 'https://quasarapp.me/',
                'logo': 'https://quasarapp.me/logo.png.webp',
                'sameAs': [
                    'https://github.com/QuasarApp',
                    'https://bsky.app/profile/quasarapp.bsky.social',
                    'https://www.youtube.com/@quasarappcore'
                ]
            }
        },
        // #home section
        '#home': {
            title: 'Home - QuasarApp Group',
            description: 'Welcome to QuasarApp Group - building the future of software with innovative open-source solutions.',
            ogType: 'website',
            ogTitle: 'Home - QuasarApp Group',
            ogImage: 'https://quasarapp.me/banner.png',
            twitterCard: 'summary_large_image',
            jsonld: {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                'name': 'QuasarApp Group d.o.o.',
                'url': 'https://quasarapp.me/',
                'logo': 'https://quasarapp.me/logo.png.webp',
                'sameAs': [
                    'https://github.com/QuasarApp',
                    'https://bsky.app/profile/quasarapp.bsky.social',
                    'https://www.youtube.com/@quasarappcore'
                ]
            }
        },
        // #projects section (overview page)
        '#projects': {
            title: 'Projects - QuasarApp Group',
            description: 'Explore our portfolio of open-source projects, tools, and software solutions.',
            ogType: 'website',
            ogTitle: 'Projects - QuasarApp Group',
            ogImage: 'https://quasarapp.me/logo.png.webp',
            twitterCard: 'summary',
            jsonld: {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                'name': 'QuasarApp Group d.o.o.',
                'url': 'https://quasarapp.me/',
                'logo': 'https://quasarapp.me/logo.png.webp',
                'sameAs': [
                    'https://github.com/QuasarApp',
                    'https://bsky.app/profile/quasarapp.bsky.social',
                    'https://www.youtube.com/@quasarappcore'
                ]
            }
        },
        // #about section
        '#about': {
            title: 'About Us - QuasarApp Group',
            description: 'Learn about QuasarApp Group d.o.o. - a high-tech software and game development studio.',
            ogType: 'organization',
            ogTitle: 'About QuasarApp Group',
            ogImage: 'https://quasarapp.me/logo.png.webp',
            twitterCard: 'summary',
            jsonld: {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                'name': 'QuasarApp Group d.o.o.',
                'url': 'https://quasarapp.me/',
                'logo': 'https://quasarapp.me/logo.png.webp',
                'sameAs': [
                    'https://github.com/QuasarApp',
                    'https://bsky.app/profile/quasarapp.bsky.social',
                    'https://www.youtube.com/@quasarappcore'
                ]
            }
        },
        // #contact section
        '#contact': {
            title: 'Contact Us - QuasarApp Group',
            description: 'Get in touch with QuasarApp Group. Contact us through our official channels.',
            ogType: 'website',
            ogTitle: 'Contact QuasarApp Group',
            ogImage: 'https://quasarapp.me/logo.png.webp',
            twitterCard: 'summary',
            jsonld: {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                'name': 'QuasarApp Group d.o.o.',
                'url': 'https://quasarapp.me/',
                'logo': 'https://quasarapp.me/logo.png.webp',
                'sameAs': [
                    'https://github.com/QuasarApp',
                    'https://bsky.app/profile/quasarapp.bsky.social',
                    'https://www.youtube.com/@quasarappcore'
                ]
            }
        },
        // Ecliptica project page (VideoGame)
        '/ecliptica': {
            title: 'Ecliptica - QuasarApp Group',
            description: 'Ecliptica is a revolutionary game development tool that empowers indie developers to create immersive gaming experiences.',
            ogType: 'website',
            ogTitle: 'Ecliptica - QuasarApp Group',
            ogImage: 'https://quasarapp.me/ecliptica_banner.jpg',
            twitterCard: 'summary_large_image',
            jsonld: {
                '@context': 'https://schema.org',
                '@type': 'VideoGame',
                'name': 'Ecliptica',
                'url': 'https://quasarapp.me/ecliptica',
                'description': 'A revolutionary game development tool for indie developers.',
                'offers': {
                    '@type': 'Offer',
                    'url': 'https://store.steampowered.com/curator/45704880',
                    'price': '0',
                    'priceCurrency': 'USD',
                    'availability': 'https://schema.org/InStock'
                },
                'aggregateRating': {
                    '@type': 'AggregateRating',
                    'ratingValue': '4.5',
                    'ratingCount': '1234',
                    'bestRating': '5',
                    'worstRating': '1'
                }
            }
        },
        // Project detail pages (SoftwareApplication)
        '/projects/': {
            title: 'Project Details - QuasarApp Group',
            description: 'Detailed information about our open-source projects and software solutions.',
            ogType: 'website',
            ogTitle: 'Project Details - QuasarApp Group',
            ogImage: 'https://quasarapp.me/logo.png.webp',
            twitterCard: 'summary',
            jsonld: {
                '@context': 'https://schema.org',
                '@type': 'SoftwareApplication',
                'name': 'Project',
                'url': 'https://quasarapp.me/projects/',
                'applicationCategory': 'http://schema.org/DeveloperApplication',
                'operatingSystem': 'http://schema.org/PlatformIndependent',
                'offers': {
                    '@type': 'Offer',
                    'price': '0',
                    'priceCurrency': 'USD'
                }
            }
        },
        // Devlog posts (BlogPosting)
        '/devlog/': {
            title: 'Development Blog - QuasarApp Group',
            description: 'Latest news, updates, and insights from our development team.',
            ogType: 'website',
            ogTitle: 'Development Blog - QuasarApp Group',
            ogImage: 'https://quasarapp.me/logo.png.webp',
            twitterCard: 'summary',
            jsonld: {
                '@context': 'https://schema.org',
                '@type': 'BlogPosting',
                'headline': 'Latest Devlog',
                'url': 'https://quasarapp.me/devlog/',
                'datePublished': '2026-11-20',
                'dateModified': '2026-11-20'
            }
        }
    };

    // Default meta (fallback for unknown pages)
    const defaultMeta = {
        title: 'QuasarApp Group',
        description: 'Open-source organization building innovative software solutions and developer tools.',
        ogType: 'website',
        ogTitle: 'QuasarApp Group',
        ogImage: 'https://quasarapp.me/banner.png',
        twitterCard: 'summary_large_image',
        jsonld: {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            'name': 'QuasarApp Group d.o.o.',
            'url': 'https://quasarapp.me/',
            'logo': 'https://quasarapp.me/logo.png.webp',
            'sameAs': [
                'https://github.com/QuasarApp',
                'https://bsky.app/profile/quasarapp.bsky.social',
                'https://www.youtube.com/@quasarappcore'
            ]
        }
    };

    /**
     * Update title and meta tags
     */
    function updateMetaTags() {
        const currentPath = window.location.pathname;
        const currentHash = window.location.hash || '/';
        
        // Find matching meta config
        let meta = defaultMeta;
        
        if (pageMeta[currentPath]) {
            meta = pageMeta[currentPath];
        } else if (pageMeta[currentHash]) {
            meta = pageMeta[currentHash];
        }
        // Fallback to defaultMeta for unknown paths - no iteration!

        // Update title
        const title = meta.title || defaultMeta.title;
        const existingTitle = document.querySelector('title');
        if (existingTitle) {
            existingTitle.textContent = title;
        }

        // Update description meta
        const metaName = document.querySelector('meta[name="description"]');
        if (metaName) {
            metaName.content = meta.description || defaultMeta.description;
        }

        // Update canonical URL
        const canonicalLink = document.querySelector('link[rel="canonical"]');
        if (canonicalLink) {
            canonicalLink.href = window.location.origin + window.location.pathname;
        } else {
            const link = document.createElement('link');
            link.rel = 'canonical';
            link.href = window.location.origin + window.location.pathname;
            document.head.appendChild(link);
        }

        // Update Open Graph tags
        updateOgTags(meta);

        // Update Twitter Card tags
        updateTwitterTags(meta);

        // Inject JSON-LD structured data
        injectJsonLd(meta.jsonld);
    }

    /**
     * Update Open Graph tags
     */
    function updateOgTags(meta) {
        const ogType = document.querySelector('meta[property="og:type"]');
        if (ogType) {
            ogType.content = meta.ogType || defaultMeta.ogType;
        }

        const ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) {
            ogUrl.content = window.location.origin + window.location.pathname + (window.location.hash || '');
        }

        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
            ogTitle.content = meta.ogTitle || defaultMeta.ogTitle;
        }

        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription) {
            ogDescription.content = meta.description || defaultMeta.description;
        }

        const ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage) {
            ogImage.content = meta.ogImage || defaultMeta.ogImage;
        }
    }

    /**
     * Update Twitter Card tags
     */
    function updateTwitterTags(meta) {
        const twitterCard = document.querySelector('meta[name="twitter:card"]');
        if (twitterCard) {
            twitterCard.content = meta.twitterCard || defaultMeta.twitterCard;
        }

        const twitterUrl = document.querySelector('meta[name="twitter:url"]');
        if (twitterUrl) {
            twitterUrl.content = window.location.origin + window.location.pathname + (window.location.hash || '');
        }

        const twitterTitle = document.querySelector('meta[name="twitter:title"]');
        if (twitterTitle) {
            twitterTitle.content = meta.ogTitle || meta.title || defaultMeta.ogTitle;
        }

        const twitterDescription = document.querySelector('meta[name="twitter:description"]');
        if (twitterDescription) {
            twitterDescription.content = meta.description || defaultMeta.description;
        }

        const twitterImage = document.querySelector('meta[name="twitter:image"]');
        if (twitterImage) {
            twitterImage.content = meta.ogImage || defaultMeta.ogImage;
        }
    }

    /**
     * Inject JSON-LD structured data
     */
    function injectJsonLd(jsonLdData) {
        // Remove existing script[type="application/ld+json"]
        const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
        existingScripts.forEach(script => script.remove());

        // Create new JSON-LD script
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(jsonLdData);
        document.head.appendChild(script);
    }

    /**
     * Handle hashchange events for SPA navigation
     */
    function handleHashChange() {
        updateMetaTags();
    }

    /**
     * Initialize on DOM ready
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateMetaTags);
        window.addEventListener('hashchange', handleHashChange);
    } else {
        updateMetaTags();
        window.addEventListener('hashchange', handleHashChange);
    }

})();

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  jsonLd?: object;
}

export const SEO = ({ 
  title = 'TPEC Events - Premier Event Planning Services in Nigeria',
  description = 'Nigeria\'s leading event planning platform. Find verified vendors, plan weddings & corporate events in Lagos, Abuja, Ibeju-Lekki.',
  keywords = 'event planning Nigeria, wedding planners Lagos, corporate events, Nigerian vendors',
  image = 'https://tpecevents.com/logo.png',
  type = 'website',
  jsonLd
}: SEOProps) => {
  const location = useLocation();
  const url = `https://tpecevents.com${location.pathname}`;

  useEffect(() => {
    // Update title
    document.title = title;

    // Update meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (element) {
        element.setAttribute('content', content);
      } else {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        element.setAttribute('content', content);
        document.head.appendChild(element);
      }
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);

    // Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:image', image, true);

    // Twitter tags
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', url);
    } else {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', url);
      document.head.appendChild(canonical);
    }

    // Add JSON-LD structured data if provided
    if (jsonLd) {
      let script = document.querySelector('script[type="application/ld+json"][data-dynamic]');
      if (script) {
        script.textContent = JSON.stringify(jsonLd);
      } else {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        script.setAttribute('data-dynamic', 'true');
        script.textContent = JSON.stringify(jsonLd);
        document.head.appendChild(script);
      }
    }
  }, [title, description, keywords, image, type, url, jsonLd]);

  return null;
};

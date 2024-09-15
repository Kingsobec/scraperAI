import { DocsUrl, BlogUrl } from '../shared/common';
import { routes } from 'wasp/client/router';

// Navigation links for the header
export const navigation = [
  { name: 'My Services', href: '#features' },
  { name: 'Free AI Tools', href: '/scrape-ai' },
  { name: 'Free Resources', href: DocsUrl },
  { name: 'Blog', href: BlogUrl },
  { name: 'My Links & Social Media', href: 'https://linktr.ee/thenovakai' },
];

// Feature sections for the main part of the landing page
export const features = [
  {
    name: 'Consulting',
    description: 'Maximize productivity, automate workflows, and leverage AI for smarter decisions.',
    icon: '💼',
    href: DocsUrl,
  },
  {
    name: 'Custom AI Development',
    description: 'Secure, private AI models tailored to your needs — apps, tools, dashboards, forecasts and integrations.',
    icon: '🧩',
    href: DocsUrl,
  },
  {
    name: 'R&D and Strategy Planning',
    description: 'Stay ahead with our guides, tools, and the latest insights from our blog.',
    icon: '🧠',
    href: DocsUrl,
  },
  {
    name: 'Process Automation & Optimization',
    description: 'Eliminate manual tasks or roles and streamline your operations with AI-powered automation.',
    icon: '⚙️',
    href: DocsUrl,
  },
];

// Footer navigation links
export const footerNavigation = {
  app: [
    { name: 'Explore Our Tools', href: DocsUrl },
    { name: 'Read Our Insights', href: BlogUrl },
    { name: 'Join Our Newsletter', href: '/signup' },
  ],
  company: [
    { name: 'About THE Novak AI', href: 'https://thenovakai.com/' },
  ],
};
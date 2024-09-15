import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightBlog from 'starlight-blog';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://thenovakai.com',
  trailingSlash: 'always',
  integrations: [
    starlight({
      title: 'THE Novak AI',
      customCss: ['./src/styles/tailwind.css'],
      description: 'Master AI with expert guidance, custom solutions, and an innovative community. Elevate your skills and lead the AI revolution.',
      logo: {
        src: '/public/logo.png',
        alt: 'THE Novak AI',
        link: 'https://thenovakai.com',
      },
      head: [
        { tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
        { tag: 'meta', attrs: { property: 'og:title', content: 'Master AI with THE Novak AI | Empower Your AI Skills Today' } },
        { tag: 'meta', attrs: { property: 'og:url', content: 'https://thenovakai.com' } },
        { tag: 'meta', attrs: { property: 'og:description', content: 'Unlock your potential in AI with THE Novak AI. Access personalized AI tools, comprehensive guides, learning resources, and a vibrant community.' } },
        { tag: 'meta', attrs: { property: 'og:image', content: '/public/logo.png' } },
        { tag: 'meta', attrs: { name: 'twitter:title', content: 'Master AI with THE Novak AI | Personalized Tools & Expert Guides' } },
        { tag: 'meta', attrs: { name: 'twitter:description', content: 'Join THE Novak AI to explore advanced AI learning paths, custom AI tools, and thrive in our expert community. Start mastering AI today.' } },
        { tag: 'meta', attrs: { name: 'twitter:image', content: '/public/logo.png' } },
        { tag: 'meta', attrs: { name: 'twitter:image:width', content: '800' } },
        { tag: 'meta', attrs: { name: 'twitter:image:height', content: '400' } },
        { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
        { tag: 'meta', attrs: { name: 'description', content: 'Join THE Novak AI to access structured learning paths, essential AI tools, and detailed guides designed for leaders, developers, and AI enthusiasts.' } },
        { tag: 'script', attrs: { defer: true, 'data-domain': 'docs.thenovakai.com', src: 'https://plausible.io/js/script.outbound-links.js' } },
        { tag: 'link', attrs: { rel: 'icon', href: '/favicon.ico' } },
    ],
      editLink: {
        baseUrl: 'https://github.com/Cubs-Capital/cubsAI-SAAS/tree/master/cubsAI/blog',
      },
      sidebar: [
        {
          label: 'Introduction',
          items: [
            { link: '/introduction/my-services', label: 'My Services' },
            { link: '/introduction/welcome', label: 'Welcome' },
            { link: '/introduction/getting-started', label: 'Getting Started' },
          ],
        },
        {
          label: 'Guides',
          items: [
            { link: '/guides/guides', label: 'Our Guides' },
            { link: '/guides/for-developers', label: 'For Developers' },
            { link: '/guides/for-innovators', label: 'For Innovators' },
            { link: '/guides/for-leaders', label: 'For Leaders' },
          ],
        },
        {
          label: 'Learning Paths',
          items: [
            { link: '/learning-paths/learning-paths', label: 'Learning Paths' },
            { link: '/learning-paths/fundamentals', label: 'Fundamentals' },
            { link: '/learning-paths/intermediate', label: 'Intermediate' },
            { link: '/learning-paths/advanced', label: 'Advanced' },
          ],
        },
        /* {
          label: 'Case Studies',
          items: [
            { link: '/case-studies/developer-spotlight', label: 'Developer Spotlight' },
            { link: '/case-studies/leadership', label: 'Leadership Insights' },
          ],
        },
        {
          label: 'Additional Content',
          items: [
            { link: '/additional/books', label: 'Recommended Books' },
            { link: '/additional/videos', label: 'Videos' },
            { link: '/additional/faq', label: 'FAQ' },
          ],
        }, */
        {
          label: 'Tools & Resources',
          items: [
            //{ link: '/tools/tools', label: 'Tools' },
            { link: '/tools/scrape-ai', label: 'AI Tool - Web Scraper Summary' },
            { link: '/tools/demo-app', label: 'AI Tool - Course Builder' },
            //{ link: '/tools/ai-tools', label: 'AI Tools' },
           // { link: '/tools/cheatsheets', label: 'Cheat Sheets' },
          //  { link: '/tools/community', label: 'Community Resources' },
          //  { link: '/tools/favorite-links', label: 'Favorite Links' },
          ],
        },
      ],
      plugins: [
        starlightBlog({
          title: 'Blog',
          customCss: ['./src/styles/tailwind.css'],
          authors: {
            cubs: {
              name: 'Ryan Novak',
              title: 'Founder @ The Novak AI',
              picture: '/logo.png',
            },
          },
        }),
      ],
    }),
    tailwind({ applyBaseStyles: false }),
  ],
});
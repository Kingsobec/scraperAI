import React from 'react';
import { Link } from 'wasp/client/router';
import { DocsUrl, BlogUrl } from '../../shared/common';

export default function Footer() {
  return (
    <footer className="dark:bg-gray-900 bg-[#eee] dark:text-gray-100 pt-8 pb-4 w-full transition-all duration-300">
      <div className="max-w-screen-3xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-3 sm:grid-cols-3 md:gap-8 gap-4 text-[14px]">

          {/* Explore Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/scrape-ai" className="hover:text-blue-400 transition-colors duration-300">
                  Free AI Tools
                </Link>
              </li>
              <li>
                <a href="https://docs.thenovakai.com/introduction/my-services/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors duration-300">
                  My Services 20+
                </a>
              </li>
              <li>
                <a href={DocsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors duration-300">
                  Free Resources & Content
                </a>
              </li>
              <li>
                <a href={BlogUrl} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors duration-300">
                  Blog
                </a>
              </li>
            </ul>
          </div>
          
          {/* Services Section */}
          <div className='hidden'>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-3">
              <li>
                <a href="/#features" className="hover:text-blue-400 transition-colors duration-300">
                  Consulting
                </a>
              </li>
              <li>
                <a href="/#features" className="hover:text-blue-400 transition-colors duration-300">
                  Custom AI Development
                </a>
              </li>
              <li>
                <a href="/#features" className="hover:text-blue-400 transition-colors duration-300">
                  R&D and Strategy Planning
                </a>
              </li>
              <li>
                <a href="/#features" className="hover:text-blue-400 transition-colors duration-300">
                  Process Automation & Optimization
                </a>
              </li>
            </ul>
          </div>
          
          {/* Follow Us Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <ul className="space-y-3">
              <li>
                <a href="https://twitter.com/thenovakai" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors duration-300">
                  Twitter
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/company/thenovakai" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors duration-300">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/profile.php?id=61564820597146" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors duration-300">
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://instagram.com/thenovak_ai" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors duration-300">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/@THEnovak_AI" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors duration-300">
                  YouTube
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact Us Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="dark:text-gray-400 text-gray-900">
              Schedule: <a href="https://calendly.com/ryannovak/the-novak-ai-free-consultation" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors duration-300">Let's Meet 🤝</a>
            </p>
            <p className="mt-2 dark:text-gray-400 text-gray-900">
              Message: <a href="https://linktr.ee/thenovakai" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors duration-300">DM me on socials</a>
            </p>
          </div>

        </div>
        
        {/* Footer Bottom */}
        <div className="mt-8 border-t border-gray-800 pt-2 text-center">
          <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} THENovakAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
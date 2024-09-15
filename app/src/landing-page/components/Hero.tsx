import React from 'react';
import { Link } from 'wasp/client/router';
import { useAuth } from 'wasp/client/auth';
import heroImage from '../../client/static/hero-image.png';
import { DocsUrl } from '../../shared/common';

export default function Hero() {
  const { data: user, isLoading: isUserLoading } = useAuth();

  return (
    <div className="relative w-full pt-24 pb-16 flex items-center justify-center min-h-[100vh]">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <img 
          src={heroImage} 
          alt="AI tools illustration" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-black dark:opacity-75 opacity-40"></div>
      </div>
      
      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 w-full max-w-screen-xl mx-auto">
        <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl tracking-tight">
          AI Solutions for Leaders, Developers, and Innovators
        </h1>
        <p className="mt-4 text-lg leading-8 text-gray-200 max-w-2xl mx-auto">
          Explore our services, free AI tools, and resources to enhance your productivity and decision-making.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {/* Services Button */}
          <a
            href="/#features"
            className="inline-block bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow hover:bg-indigo-700 transition-all duration-300"
          >
            Explore Our Services
          </a>
          {/* Free AI Tools Button */}
          <Link
            to="/scrape-ai"
            className="inline-block bg-transparent border-2 border-indigo-600  font-semibold py-3 px-6 rounded-lg hover:bg-indigo-600 text-white transition-all duration-300"
          >
            Try Free AI Tools
          </Link>
          {/* Free Resources Button */}
          <a
            href={DocsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-transparent border-2 border-white text-white font-semibold py-3 px-6 rounded-lg hover:bg-white hover:text-indigo-600 transition-all duration-300"
          >
            Free Resources & Content
          </a>
        </div>
      </div>
    </div>
  );
}
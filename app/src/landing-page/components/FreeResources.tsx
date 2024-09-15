import React from 'react';

export default function FreeResources() {
  return (
    <div className="mt-16 bg-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Free Resources</h2>
        <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-white">AI Starter Pack for Leaders</h3>
            <p className="mt-2 text-base text-gray-300">Comprehensive guides on integrating AI into your company strategy.</p>
            <a href="/resources" target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-blue-400 hover:underline">Get Started</a>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-white">Ultimate Prompt Engineering Guide</h3>
            <p className="mt-2 text-base text-gray-300">Practical tips and examples for developers to optimize AI models.</p>
            <a href="/resources" target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-blue-400 hover:underline">Download Now</a>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-white">AI Innovator’s Toolkit</h3>
            <p className="mt-2 text-base text-gray-300">Curated tools, forums, books, and insider resources for AI enthusiasts.</p>
            <a href="/resources" target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-blue-400 hover:underline">Explore Tools</a>
          </div>
        </div>
      </div>
    </div>
  );
}
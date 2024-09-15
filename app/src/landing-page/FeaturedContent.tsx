import React from 'react';

export default function FeaturedContent() {
  return (
    <div className="mt-16 bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Featured Content</h2>
        <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-white">How Leaders Can Lead AI Adoption Successfully</h3>
            <p className="mt-2 text-base text-gray-300">Insights on integrating AI into your leadership strategy.</p>
            <a href="/blog" target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-blue-400 hover:underline">Read More</a>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-white">Top Tricks to Master Prompt Engineering</h3>
            <p className="mt-2 text-base text-gray-300">Techniques to enhance your prompt engineering skills.</p>
            <a href="/blog" target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-blue-400 hover:underline">Read More</a>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-white">The Future of Custom AI Solutions: GPTs, Art Models, and More</h3>
            <p className="mt-2 text-base text-gray-300">Explore emerging trends and innovations in custom AI development.</p>
            <a href="/blog" target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-blue-400 hover:underline">Read More</a>
          </div>
        </div>
      </div>
    </div>
  );
}
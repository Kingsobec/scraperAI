import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Footer from './components/Footer';
import { navigation, features } from './contentSections';

const LandingPage = () => {
  return (
    <div className='min-h-screen flex flex-col'>
      <Header navigation={navigation} />
      <main className='flex-grow'>
        <Hero />
        <Features features={features} />
      </main>
      <Footer /> {/* Remove the footerNavigation prop */}
    </div>
  );
};

export default LandingPage;
import React, { useState } from 'react';
import { HiBars3 } from 'react-icons/hi2';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Dialog } from '@headlessui/react';
import { Link } from 'wasp/client/router';
import { useAuth } from 'wasp/client/auth';
import logo from '../../client/static/logo.png';
import accountIcon from '../../client/static/account-icon.png';
import DarkModeSwitcher from '../../client/components/DarkModeSwitcher';

interface NavigationItem {
  name: string;
  href: string;
}

export default function Header({ navigation }: { navigation: NavigationItem[] }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: user, isLoading: isUserLoading } = useAuth();

  const filteredNavigation = navigation.filter(item => {
    if (user) {
      return !['Sign Up', 'Log In'].includes(item.name);
    }
    return true;
  });

  const NavLogo = () => (
    <img className="h-8 w-auto rounded-md" src={logo} alt="THE Novak AI" />
  );

  const AccountIcon = () => (
    <img className="h-8 w-8" src={accountIcon} alt="My Account" />
  );

  return (
    <header className='dark:bg-gray-900 text-black md:py-4 py-2 w-full shadow-md fixed top-0 z-20 bg-[#eee] transition-all duration-300 dark:text-white'>
      <nav className='flex items-center justify-between px-4 lg:px-8 w-full max-w-screen-3xl mx-auto'>
        {/* Logo and Brand Name */}
        <Link to='/' className='flex items-center'>
          <NavLogo />
          <span className='ml-3 text-xl font-bold'>THE Novak AI</span>
        </Link>

        {/* Desktop Navigation */}
        <div className='hidden lg:flex lg:items-center lg:gap-8'>
          {filteredNavigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target={item.href.startsWith('http') ? '_blank' : '_self'}
              rel={item.href.startsWith('http') ? 'noopener noreferrer' : ''}
              className='text-sm font-semibold text-black hover:text-gray-300 transition-all duration-300 dark:text-white'
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Account and Auth Buttons */}
        <div className='hidden lg:flex lg:items-center lg:gap-4'>
          <DarkModeSwitcher />
          {isUserLoading ? null : !user ? (
            <Link to='/signup'>
              <div className='bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300 rounded-lg py-2 px-4 text-sm font-semibold'>
                Apps Login
              </div>
            </Link>
          ) : (
            <Link to='/account' className='hover:text-gray-300 transition-all duration-300'>
              <AccountIcon />
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className='lg:hidden flex gap-4 items-center'>
          <DarkModeSwitcher />

          <button type='button' onClick={() => setMobileMenuOpen(true)} className='text-white'>
            <HiBars3 className='text-black dark:text-white w-10 h-10 ' />
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <Dialog as='div' className='lg:hidden' open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className='fixed inset-0 z-50' />
        <div className='w-screen h-screen fixed top-0 bg-black opacity-40 lg-hidden'></div>
        <Dialog.Panel className='fixed inset-y-0 right-0 z-50 min-w-[250px] dark:bg-gray-900 bg-white text-gray-100 p-3 overflow-y-auto'>
          <div className='flex justify-between items-center mb-6'>
            <p className='font-semibold text-black dark:text-white'>MENU</p>
            <button onClick={() => setMobileMenuOpen(false)} className='text-blue-500'>
              <AiFillCloseCircle className='h-6 w-6' />
            </button>
          </div>
          <div className='space-y-4'>
            {filteredNavigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : '_self'}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : ''}
                onClick={() => setMobileMenuOpen(false)}
                className='block p-2 pt-4 uppercase text-lg text-gray-900 font-semibold border-b-2 border-blue-500 border-dashed dark:text-gray-100 hover:text-blue-500 transition-all duration-300'
              >
                {item.name}
              </a>
            ))}
            <div className='pt-4'>
              {isUserLoading ? null : !user ? (
                <Link
                  to='/signup'
                  onClick={() => setMobileMenuOpen(false)}
                  className='block w-full py-2 text-center text-base font-medium bg-blue-500 hover:bg-blue-600 transition-all duration-300 rounded-lg'
                >
                  Apps Login
                </Link>
              ) : (
                <Link
                  to='/account'
                  onClick={() => setMobileMenuOpen(false)}
                  className='flex items-center py-2 text-base font-medium hover:text-gray-300 transition-all duration-300'
                >
                  <AccountIcon />
                  <span className='ml-2'>My Account</span>
                </Link>
              )}
            </div>
            {/* <div className='pt-4'>
              <DarkModeSwitcher />
            </div> */}
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
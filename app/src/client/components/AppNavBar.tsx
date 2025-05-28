import { Link, routes } from 'wasp/client/router';
import { useAuth } from 'wasp/client/auth';
import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { BiLogIn } from 'react-icons/bi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { HiBars3 } from 'react-icons/hi2';
import logo from '../static/logo.png';
import DropdownUser from '../../user/DropdownUser';
import { UserMenuItems } from '../../user/UserMenuItems';
import { DocsUrl, BlogUrl } from '../../shared/common';
import DarkModeSwitcher from './DarkModeSwitcher';

// Navigation items
const navigation = [
  { name: 'AI Scraper', href: routes.ScrapeAiAppRoute.build() },
  { name: 'AI Courses', href: routes.DemoAppRoute.build() },
  { name: 'Free Resources', href: DocsUrl, target: '_blank' },
  { name: 'Blog', href: BlogUrl, target: '_blank' },
  { name: 'Links', href: 'https://linktr.ee/kingsobecNovak', target: '_blank' },
];

// Component for displaying the logo
const NavLogo = () => <img className='h-8 w-8 rounded-md' src={logo} alt='THE Novak AI' />;

export default function AppNavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: user, isLoading: isUserLoading } = useAuth();

  return (
    <header className='bg-[#f5f5f5] fixed top-0 dark:bg-gray-900 text-yellow-500 py-3 w-full shadow-md'>
      <nav className='flex items-center justify-between px-4 lg:px-8 w-full max-w-screen-2xl mx-auto'>
        {/* Logo and Branding */}
        <div className='flex lg:flex-1'>
          <a href='/' className='flex items-center'>
            <NavLogo />
            <span className='md:ml-3 md:text-xl ml-2 font-bold text-yellow-500'>THE Novak AI</span>
          </a>
        </div>
        {/* Mobile Menu Button */}
        <div className='flex lg:hidden gap-4 items-center'>
          <DarkModeSwitcher />

          <button type='button' className='text-yellow-500' onClick={() => setMobileMenuOpen(true)}>
            <HiBars3 className='h-8 w-8' aria-hidden='true' />
          </button>
        </div>
        {/* Desktop Navigation */}
        <div className='hidden lg:flex lg:gap-x-12'>
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target={item.target ? item.target : undefined}
              className='text-lg font-semibold text-yellow-500 hover:text-gray-300 transition-all duration-300'
              rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
            >
              {item.name}
            </a>
          ))}
        </div>
        {/* User Authentication and Settings */}
        <div className='hidden lg:flex lg:flex-1 gap-3 justify-end items-center'>
          <ul className='flex justify-center items-center gap-2 sm:gap-4'>
            <DarkModeSwitcher />
          </ul>

          {isUserLoading ? null : !user ? (
            <a
              href={!user ? routes.LoginRoute.build() : routes.AccountRoute.build()}
              className='text-lg font-semibold leading-6 ml-4'
            >
              <div className='flex items-center text-yellow-500 hover:text-gray-300 transition-all duration-300'>
                Log in <BiLogIn size='1.1rem' className='ml-1 mt-[0.1rem]' />
              </div>
            </a>
          ) : (
            <div className='ml-4'>
              <DropdownUser user={user} />
            </div>
          )}
        </div>
      </nav>
      {/* Mobile Navigation */}

      <Dialog as='div' className='lg:hidden' open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className='fixed inset-0 z-50' />
        <div className='w-screen h-screen fixed top-0 bg-black opacity-40 lg-hidden'></div>
        <Dialog.Panel className='fixed inset-y-0 right-0 z-50 dark:bg-gray-900 bg-white p-3 min-w-[250px]'>
          <div className='flex items-center justify-between'>
            <p className='font-semibold text-black dark:text-white'>MENU</p>
            <button type='button' className='text-yellow-500' onClick={() => setMobileMenuOpen(false)}>
              <AiFillCloseCircle className='h-6 w-6' aria-hidden='true' />
            </button>
          </div>
          <div className='mt-6'>
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                target={item.target ? item.target : undefined}
                className='block p-2 pt-4 uppercase text-lg text-gray-900 font-semibold border-b-2 border-yellow-500 border-dashed dark:text-gray-100 hover:text-yellow-500 transition-all duration-300'
                rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
              >
                {item.name}
              </a>
            ))}
            <div className='mt-6 bg-yellow-500 text-center'>
              {isUserLoading ? null : !user ? (
                <a
                  href={routes.LoginRoute.build()}
                  onClick={() => setMobileMenuOpen(false)}
                  className='block py-2 text-lg text-black font-bold hover:text-gray-300 transition-all duration-300'
                >
                  Log in
                </a>
              ) : (
                <UserMenuItems user={user} setMobileMenuOpen={setMobileMenuOpen} />
              )}
            </div>
            {/* <div className='mt-6'>
              <DarkModeSwitcher />
            </div> */}
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}

import { ReactNode } from 'react';

export function AuthPageLayout({children} : {children: ReactNode }) {
  return (
    <div className='flex min-h-screen flex-col justify-center py-16 lg:py-20 bg-gradient-to-b from-gray-900 via-gray-800 to-black'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <div className=' bg-white py-8 px-4 dark:shadow-xl shadow-2xl ring-1 ring-gray-900/10 sm:rounded-lg sm:px-10'>
          <div className='-mt-8 '>{children}</div>
        </div>
      </div>
    </div>
  );
}
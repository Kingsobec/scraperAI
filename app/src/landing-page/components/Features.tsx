interface Feature {
  name: string;
  description: string;
  icon: string;
  href: string;
}

export default function Features({ features }: { features: Feature[] }) {
  return (
    <div
      id='features'
      className='dark:bg-gray-900 bg-[#eee] dark:text-gray-100 text-black py-24 transition-all duration-300'
    >
      <div className='max-w-screen-3xl mx-auto px-4 lg:px-8'>
        {/* Section Header */}
        <div className='text-center mb-16'>
          <h2 className='text-4xl font-extrabold mb-4'>Services</h2>
          <p className='text-lg leading-8 dark:text-gray-400'>Explore our professional AI services and solutions</p>
        </div>

        {/* Features Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10'>
          {features.map((feature) => (
            <a
              href={feature.href}
              target='_blank'
              rel='noopener noreferrer'
              className='dark:bg-gray-800 bg-gray-100 rounded-lg p-6 text-center shadow-lg hover:shadow-xl dark:hover:bg-gray-700 transition-all duration-300 hover:bg-white hover:scale-[1.02] cursor-pointer'
            >
              <div key={feature.name} className=''>
                <div className='text-5xl mb-4 text-gray-100'>{feature.icon}</div>
                <h3 className='text-2xl font-bold mb-3'>{feature.name}</h3>
                <p className='dark:text-gray-400 text-gray-700 mb-6'>{feature.description}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Call to Actions */}
        <div className='mt-16 flex flex-col sm:flex-row items-center justify-center gap-6'>
          <a
            href='https://calendly.com/ryannovak/the-novak-ai-free-consultation'
            target='_blank'
            rel='noopener noreferrer'
            className='inline-block bg-indigo-600 text-white font-semibold py-3 px-8 rounded-full shadow-md hover:bg-indigo-700 transition-all duration-300'
          >
            Book Your Free Consultation
          </a>

          {/* See All Services Button */}
          <a
            href='https://docs.thenovakai.com/introduction/my-services/'
            target='_blank'
            rel='noopener noreferrer'
            className='inline-block bg-yellow-500 text-white font-semibold py-3 px-8 rounded-full shadow-md hover:bg-yellow-600 transition-all duration-300'
          >
            See All 20+ Services
          </a>
        </div>
      </div>
    </div>
  );
}
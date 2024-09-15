import {
    generateScrapeGptResponse, // Correct action name
  } from 'wasp/client/operations';
  
  import { useState } from 'react';
  import { CgSpinner } from 'react-icons/cg';
  import ReactMarkdown from 'react-markdown';
  import remarkGfm from 'remark-gfm';
  
  export default function ScrapeAIPage() {
    return (
      <div className='py-16 lg:pb-20 bg-gradient-to-b dark:from-gray-900 dark:via-gray-800 dark:to-black from-[#f5f5f5] via-[#fff] to-gray-200 text-white min-h-screen transition-all duration-300 pt-30'>
        <div className='container mx-auto px-4 lg:px-8'>
          <div className='text-center'>
            <h2 className='md:text-5xl text-4xl font-bold tracking-tight dark:text-white text-gray-900'>
              <span className='text-yellow-500'>Scrape</span>  and Summarize with AI
            </h2>
            <p className='mt-6 md:text-lg md:leading-8 dark:text-gray-400 text-gray-700'>
              Enter the URLs you want to scrape and a prompt for context. Let AI summarize the content and combine it
              for you!
            </p>

            {/* Help link section */}
            <div className='text-center mt-8'>
              <a
                href='https://docs.thenovakai.com/tools/scrape-ai/'
                target='_blank'
                rel='noopener noreferrer'
                className='text-yellow-500 underline hover:text-yellow-600 font-semibold'
              >
                Need help? Read our docs on this tool
              </a>
              <p className='dark:text-gray-400 text-gray-700 mt-2 max-sm:text-sm'>(Opens in a new tab for your convenience)</p>
            </div>
          </div>
          <div className='my-12 dark:bg-gray-800 bg-white rounded-3xl md:p-8 p-4 shadow-xl'>
            <ScrapeForm />
          </div>
        </div>
      </div>
    );
  }
  
  function ScrapeForm() {
    const [urls, setUrls] = useState<string>('');
    const [userPrompt, setUserPrompt] = useState<string>('');
    const [response, setResponse] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
  
    const handleGenerateSummary = async () => {
      try {
        setIsGenerating(true);
        const result: string = await generateScrapeGptResponse({ urls, userPrompt }); // Result is of type string
  
        if (result) { // Directly check the result as a string
          setResponse(result);
        } else {
          throw new Error('No content returned from the AI model.');
        }
      } catch (err: any) {
        window.alert('Error: ' + (err.message || 'Something went wrong'));
      } finally {
        setIsGenerating(false);
      }
    };
  
    return (
      <div className='flex flex-col justify-center gap-10'>
        <div className='flex flex-col gap-3 w-full md:max-w-[70%] lg:max-w-[50%] mx-auto'>
          <div className='flex flex-col gap-3'>
            <textarea
              id='urls'
              className='text-sm text-gray-300 w-full rounded-lg border dark:border-gray-600 border-yellow-500 dark:bg-gray-800 shadow-md focus:outline-none focus:border-transparent focus:shadow-lg duration-200 ease-in-out hover:shadow-lg p-3 break-words'
              placeholder='Enter URLs (comma-separated)'
              value={urls}
              onChange={(e) => setUrls(e.currentTarget.value)}
            />
            <textarea
              id='userPrompt'
              className='text-sm text-gray-300 w-full rounded-lg border dark:border-gray-600 border-yellow-500 dark:bg-gray-800 shadow-md focus:outline-none focus:border-transparent focus:shadow-lg duration-200 ease-in-out hover:shadow-lg p-3 break-words'
              placeholder='Enter your prompt'
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.currentTarget.value)}
            />
          </div>
          <button
            type='button'
            onClick={handleGenerateSummary}
            disabled={isGenerating || urls.trim() === ''}
            className='flex items-center justify-center min-w-[7rem] font-medium text-gray-900 bg-yellow-500 shadow-lg ring-1 ring-inset ring-yellow-600 py-3 px-5 rounded-lg hover:bg-yellow-600 duration-200 ease-in-out focus:outline-none focus:shadow-none hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed'
          >
            {isGenerating ? (
              <>
                <CgSpinner className='inline-block mr-2 animate-spin' />
                Generating...
              </>
            ) : (
              'Generate Summary'
            )}
          </button>
        </div>
  
        {!!response && (
          <div className='flex flex-col w-full mt-8'>
            <h3 className='text-lg font-semibold text-gray-100'>Combined AI Summary</h3>
            <SummaryDisplay response={response} />
          </div>
        )}
      </div>
    );
  }
  
  function SummaryDisplay({ response }: { response: string }) {
    return (
      <div className='w-full bg-gray-800 rounded-xl p-4 shadow-lg'>
        <ReactMarkdown
          className='text-gray-300 text-lg break-words'
          remarkPlugins={[remarkGfm]}
        >
          {response}
        </ReactMarkdown>
      </div>
    );
  }
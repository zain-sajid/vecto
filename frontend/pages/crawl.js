import { useState } from 'react';
import axios from 'axios';

import { Bars3Icon } from '@heroicons/react/24/outline';

import Sidebar from '@/components/Sidebar';
import ProtectedRoute from '@/components/routes/ProtectedRoute';
import Loader from '@/components/Loader';
import WebsiteList from '@/components/crawl/WebsiteList';

export default function Chat() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [url, setUrl] = useState('');
  const [urls, setUrls] = useState([]);

  function fetchCrawledUrls() {
    if (!url) {
      alert('Please enter a url!');
      return;
    }

    setIsLoading(true);
    setUrls([]);

    axios
      .post('/api/crawl', {
        url,
      })
      .then((res) => {
        console.log('Crawled website successfully!', res);
        setUrls(res.data.urls);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }

  return (
    <ProtectedRoute>
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeLink={5}
      />

      <div className="flex flex-1 flex-col md:pl-64 bg-gray-100">
        <div className="sticky top-0 z-10 bg-gray-100 pl-1 pt-1 sm:pl-3 sm:pt-3 md:hidden">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <main className="flex-1">
          <div className="py-8 min-h-screen">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
              {/* Replace with your content */}
              <div>
                <label
                  htmlFor="company-website"
                  className="block text-base font-medium text-gray-900"
                >
                  Enter the URL to crawl
                </label>

                <div className="flex gap-2 mt-1">
                  <div className="w-full">
                    <input
                      type="text"
                      name="url"
                      id="url"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                      placeholder="www.example.com"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                  </div>

                  <button
                    type="button"
                    className="inline-flex items-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    onClick={fetchCrawledUrls}
                  >
                    {!isLoading ? (
                      'Crawl'
                    ) : (
                      <div className="w-5 h-5">
                        <Loader />
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {urls.length > 0 && <WebsiteList urls={urls} />}

              {isLoading && (
                <div className="bg-white shadow sm:rounded-lg mt-5">
                  <div className="flex justify-center px-4 py-5 sm:p-6">
                    <div className="w-6 h-6">
                      <Loader />
                    </div>
                  </div>
                </div>
              )}

              {/* /End replace */}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

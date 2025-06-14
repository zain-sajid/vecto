import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import axios from 'axios';

import Sidebar from '@/components/Sidebar';
import TemplateCards from '@/components/scan/TemplateCards';
import SearchInput from '@/components/scan/SearchInput';
import WebsiteInput from '@/components/scan/WebsiteInput';
import Filters from '@/components/scan/Filters';
import Loader from '@/components/Loader';
import ProtectedRoute from '@/components/routes/ProtectedRoute';

import { Bars3Icon } from '@heroicons/react/24/outline';

export default function Scan() {
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [isScanning, setIsScanning] = useState(false);

  const [url, setUrl] = useState('');
  const [selectedTemplates, setSelectedTemplates] = useState([]);

  function fetchTemplates() {
    axios.get('/api/templates').then((res) => {
      setTemplates(res.data);
    });
  }

  function handleScan() {
    if (selectedTemplates.length === 0 || !url) {
      alert('Please select a template and specify a website');
      return;
    }

    setIsScanning(true);

    axios
      .post('/api/scan', {
        template_id: selectedTemplates,
        url,
        name: 'Test scan',
        description: 'A test scan of the example website',
      })
      .then((res) => {
        console.log(res);
        router.push(`/report/${res.data.scan_id}`);
      })
      .catch((err) => {
        console.log(err);
        alert('Something went wrong!');
        setIsScanning(false);
      });
  }

  useEffect(() => {
    fetchTemplates();
  }, []);

  return (
    <ProtectedRoute>
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeLink={0}
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
              <div className="py-4">
                <WebsiteInput type="scan" url={url} setUrl={setUrl} />

                <div className="text-base font-medium text-gray-900">
                  Select a template to run
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <SearchInput />
                  <Filters />
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    onClick={handleScan}
                    disabled={isScanning}
                  >
                    {!isScanning ? (
                      'Scan'
                    ) : (
                      <div className="w-5 h-5">
                        <Loader />
                      </div>
                    )}
                  </button>
                </div>
                <TemplateCards
                  templates={templates}
                  selectedTemplates={selectedTemplates}
                  setSelectedTemplates={setSelectedTemplates}
                />
              </div>
              {/* /End replace */}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

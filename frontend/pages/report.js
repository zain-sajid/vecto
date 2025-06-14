import { useState } from 'react';

import Sidebar from '@/components/Sidebar';
import Details from '@/components/report/ResultDetails';
import MoreTemplates from '@/components/report/MoreTemplates';
import GenerateReport from '@/components/report/GenerateReport';
import ProtectedRoute from '@/components/routes/ProtectedRoute';

import { Bars3Icon } from '@heroicons/react/24/outline';

export default function Example() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeLink={3}
      />

      <div className="flex flex-1 flex-col md:pl-64 bg-gray-100">
        <div className="sticky top-0 z-10 bg-gray-100 pl-1 pt-1 sm:pl-3 sm:pt-3 md:hidden">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <main className="flex-1">
          <div className="py-6 min-h-screen">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
              {/* Replace with your content */}
              <div className="py-4">
                <Details />

                <div className="flex flex-col gap-4 mt-4 lg:flex-row">
                  <MoreTemplates />
                  <GenerateReport />
                </div>
              </div>
              {/* /End replace */}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

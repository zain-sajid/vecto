import { useEffect, useState } from 'react';
import Link from 'next/link';

import axios from 'axios';

import { useAuth } from '@/context/authContext';

import Sidebar from '@/components/Sidebar';
import SeverityBadge from '@/components/SeverityBadge';
import ProtectedRoute from '@/components/routes/ProtectedRoute';

import { Bars3Icon } from '@heroicons/react/24/outline';
import { PencilSquareIcon } from '@heroicons/react/20/solid';

export default function Templates() {
  const { user } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [templates, setTemplates] = useState([]);

  console.log(templates);

  useEffect(() => {
    axios.get(`/api/templates/user/${user.uid}`).then((res) => {
      setTemplates(res.data);
    });
  }, []);

  return (
    <ProtectedRoute>
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeLink={1}
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
              <div className="text-lg font-medium mb-4">My Templates</div>
              {/* Replace with your content */}
              <ul role="list" className="flex flex-col gap-4">
                {templates.map((template) => (
                  <li
                    key={template.template_id}
                    className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow"
                  >
                    <div className="flex w-full items-center justify-between space-x-6 p-6">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="truncate text-sm font-medium text-gray-900">
                            {template.name}
                          </h3>
                          <SeverityBadge>{template.severity}</SeverityBadge>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          {template.description}
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="-mt-px flex divide-x divide-gray-200">
                        <div className="-ml-px flex w-0 flex-1">
                          <Link
                            href={`/edit/${template.template_id}`}
                            className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                          >
                            <PencilSquareIcon
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                            Edit
                          </Link>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              {/* /End replace */}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

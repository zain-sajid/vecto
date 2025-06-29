import { Fragment } from 'react';

import Link from 'next/link';

import { Dialog, Transition } from '@headlessui/react';

import {
  ChartBarIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  XMarkIcon,
  ChatBubbleLeftEllipsisIcon,
  DocumentPlusIcon,
  UserCircleIcon,
  GlobeAltIcon,
  CalculatorIcon,
} from '@heroicons/react/24/outline';

import { useAuth } from '../context/authContext';

const navigation = [
  { index: 0, name: 'Dashboard', href: '/scan', icon: HomeIcon },
  {
    index: 1,
    name: 'Templates',
    href: '/templates',
    icon: DocumentDuplicateIcon,
  },
  {
    index: 2,
    name: 'Create',
    href: '/create',
    icon: DocumentPlusIcon,
  },
  {
    index: 3,
    name: 'Reports',
    href: '/report',
    icon: ChartBarIcon,
  },
  {
    index: 4,
    name: 'Chat',
    href: '/chat',
    icon: ChatBubbleLeftEllipsisIcon,
  },
  {
    index: 5,
    name: 'Crawl',
    href: '/crawl',
    icon: GlobeAltIcon,
  },
  {
    index: 6,
    name: 'Calculate',
    href: '/calculate',
    icon: CalculatorIcon,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Sidebar({ sidebarOpen, setSidebarOpen, activeLink }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Sidebar for mobile */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40 md:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                <div className="h-0 flex-1 overflow-y-auto pt-5 pb-4">
                  <div className="flex flex-shrink-0 items-center px-4">
                    <Link href="/scan">
                      <img
                        className="h-8 w-auto cursor-pointer"
                        src="/vecto.svg"
                        alt="Your Company"
                      />
                    </Link>
                  </div>
                  <nav className="mt-5 space-y-1 px-2">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                          'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                        )}
                      >
                        <item.icon
                          className={classNames(
                            item.current
                              ? 'text-gray-500'
                              : 'text-gray-400 group-hover:text-gray-500',
                            'mr-4 flex-shrink-0 h-6 w-6'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </div>
                <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
                  <a href="#" className="group block flex-shrink-0">
                    <div className="flex items-center">
                      <div>
                        <UserCircleIcon className="w-8 h-8 text-gray-700" />
                      </div>
                      <div className="ml-2">
                        <p className="text-base font-medium text-gray-700 group-hover:text-gray-900">
                          Tom Cook
                        </p>
                        <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                          Logout
                        </p>
                      </div>
                    </div>
                  </a>
                </div>
              </Dialog.Panel>
            </Transition.Child>
            <div className="w-14 flex-shrink-0">
              {/* Force sidebar to shrink to fit close icon */}
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <Link href="/scan">
                <img
                  className="h-8 w-auto cursor-pointer"
                  src="/vecto.svg"
                  alt="Your Company"
                />
              </Link>
            </div>
            <nav className="mt-5 flex-1 space-y-1 bg-white px-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    activeLink === item.index
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                  )}
                >
                  <item.icon
                    className={classNames(
                      activeLink === item.index
                        ? 'text-gray-500'
                        : 'text-gray-400 group-hover:text-gray-500',
                      'mr-3 flex-shrink-0 h-6 w-6'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
            <div className="group block w-full flex-shrink-0">
              <div className="flex items-center">
                <div>
                  <UserCircleIcon className="w-8 h-8 text-gray-700" />
                </div>
                <div className="ml-2">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {user?.displayName ? user.displayName : 'Anonymous'}
                  </p>
                  <p
                    className="text-xs font-medium text-gray-500 group-hover:text-gray-700 cursor-pointer"
                    onClick={handleLogout}
                  >
                    Logout
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

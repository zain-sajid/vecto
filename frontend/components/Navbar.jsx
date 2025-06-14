import { useState, useEffect } from 'react';

function NavbarTransparent() {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
  }, []);

  function handleScroll() {
    const nav = document.querySelector('.navbar');
    if (window.scrollY > nav.offsetHeight) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  }

  return (
    <nav
      className={`${
        isScrolled ? 'bg-neutral-700/10' : 'bg-[#121212]'
      } navbar sticky top-0 z-40 backdrop-blur border-b border-slate-50/[0.06] transition-colors duration-500`}
      onScroll={handleScroll}
    >
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between h-14">
          <div className=" flex grow items-center justify-between">
            <a className="flex-shrink-0" href="/">
              <img
                className="h-8 w-16 pb-1"
                src="/vecto-type.svg"
                alt="Workflow"
              />
            </a>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4 text-slate-200 font-semibold text-sm">
                <a className=" hover:text-purple-600 px-3 py-2" href="/scan">
                  Scan
                </a>
                <a className=" hover:text-purple-600 px-3 py-2" href="/login">
                  Login
                </a>
                <a
                  className=" hover:text-purple-600 px-3 py-2"
                  href="/register"
                >
                  Register
                </a>
              </div>
            </div>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              className="text-gray-800 dark:text-white inline-flex items-center justify-center p-2 focus:outline-none"
              onClick={() => {
                setIsNavExpanded(!isNavExpanded);
              }}
            >
              <svg
                width="20"
                height="20"
                fill="currentColor"
                className="h-8 w-8"
                viewBox="0 0 1792 1792"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M1664 1344v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className={isNavExpanded ? 'md:hidden' : 'hidden'}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a
            className="text-gray-300 dark:text-slate-200 block px-3 py-2 rounded-md text-base font-medium"
            href="/scan"
            onClick={() => {
              setIsNavExpanded(!isNavExpanded);
            }}
          >
            Scan
          </a>
          <a
            className="text-gray-300 dark:text-slate-200 block px-3 py-2 rounded-md text-base font-medium"
            href="/login"
            onClick={() => {
              setIsNavExpanded(!isNavExpanded);
            }}
          >
            Login
          </a>
          <a
            className="text-gray-300 dark:text-slate-200 block px-3 py-2 rounded-md text-base font-medium"
            href="/register"
            onClick={() => {
              setIsNavExpanded(!isNavExpanded);
            }}
          >
            Register
          </a>
        </div>
      </div>
    </nav>
  );
}

export default NavbarTransparent;

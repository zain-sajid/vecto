import Link from 'next/link';
import { useState } from 'react';

import { useAuth } from '../context/authContext';
import AuthenticationRoute from '@/components/routes/AuthenticationRoute';

export default function Register() {
  const { user, register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    register(name, email, password);
  };

  return (
    <AuthenticationRoute>
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href="/scan">
            <img
              className="mx-auto h-12 w-auto"
              src="/vecto.svg"
              alt="Your Company"
            />
          </Link>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign up for a new account
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" action="#" method="POST">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="name"
                    autoComplete="name"
                    value={name}
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md border border-transparent bg-purple-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  onClick={handleRegister}
                >
                  Register
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3">
                <div>
                  <a
                    href="#"
                    className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
                  >
                    <span className="sr-only">Sign in with GitHub</span>
                    <svg
                      className="h-5 w-5"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticationRoute>
  );
}

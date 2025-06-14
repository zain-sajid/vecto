import { Space_Grotesk } from '@next/font/google';

import styles from '@/styles/Home.module.css';

import Navbar from '../components/Navbar';

import {
  LockClosedIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

export default function Home() {
  return (
    <div className="bg-[#121212]">
      <Navbar />
      <main className="flex flex-col items-center text-white">
        <div
          className={`relative flex flex-col justify-center items-center h-[92vh] gap-8 ${styles.center}`}
        >
          <h1
            className={`${spaceGrotesk.className} text-4xl max-w-xl text-center z-10 px-4`}
          >
            The next-generation of web vulnerabilities scanner is here
          </h1>

          <a href="/scan" className={styles.card}>
            <h2 className="font-semibold">
              Scan your website <span>-&gt;</span>
            </h2>
          </a>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-24">
          <div className="flex justify-center items-center w-20 h-20 rounded-full bg-[#646464]/10 border border-[#c8c8c8]/10">
            <MagnifyingGlassIcon className="w-12 text-purple-700" />
          </div>
          <h2 className="mt-8 font-semibold text-purple-500 dark:text-purple-400">
            Vulnerabilities
          </h2>
          <p
            className={`${spaceGrotesk.className} mt-4 text-3xl sm:text-4xl text-slate-900 font-extrabold tracking-tight dark:text-slate-50`}
          >
            Search for vulnerabilities easily
          </p>
          <p className="mt-4 max-w-3xl space-y-6 ">
            Vecto helps you find vulnerabilities in your website. You can search
            for vulnerabilities by name, category, or even by the type of
            vulnerability. You can also search for vulnerabilities by the
            severity of the vulnerability.
          </p>
          <a className="group inline-flex items-center h-9 rounded-full text-sm font-semibold whitespace-nowrap px-3 focus:outline-none focus:ring-2 bg-slate-700 text-slate-100 hover:bg-slate-600 hover:text-white focus:ring-slate-500 mt-8 cursor-pointer">
            Get started
            <span className="ml-2">-&gt;</span>
          </a>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-24">
          <div className="flex justify-center items-center w-20 h-20 rounded-full bg-[#646464]/10 border border-[#c8c8c8]/10">
            <LockClosedIcon className="w-12 text-purple-700" />
          </div>
          <h2 className="mt-8 font-semibold text-purple-500 dark:text-purple-400">
            Security
          </h2>
          <p
            className={`${spaceGrotesk.className} mt-4 text-3xl sm:text-4xl text-slate-900 font-extrabold tracking-tight dark:text-slate-50`}
          >
            Secure your website
          </p>
          <p className="mt-4 max-w-3xl space-y-6 ">
            Vecto helps you secure your website by searching for the latest
            vulnerabilities and helping you to fix them.
          </p>
          <a className="group inline-flex items-center h-9 rounded-full text-sm font-semibold whitespace-nowrap px-3 focus:outline-none focus:ring-2 bg-slate-700 text-slate-100 hover:bg-slate-600 hover:text-white focus:ring-slate-500 mt-8 cursor-pointer">
            Get started
            <span className="ml-2">-&gt;</span>
          </a>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-24">
          <div className="flex justify-center items-center w-20 h-20 rounded-full bg-[#646464]/10 border border-[#c8c8c8]/10">
            <img src="/icons/ui.svg" className="w-12" />
          </div>
          <h2 className="mt-8 font-semibold text-purple-500 dark:text-purple-400">
            User Interface
          </h2>
          <p
            className={`${spaceGrotesk.className} mt-4 text-3xl sm:text-4xl text-slate-900 font-extrabold tracking-tight dark:text-slate-50`}
          >
            Provides a user-friendly experience
          </p>
          <p className="mt-4 max-w-3xl space-y-6 ">
            Most web vulnerability scanners are not user-friendly. They are
            difficult to use and require a lot of technical knowledge. We
            designed our web vulnerability scanner to be easy to use and
            understand. We also provide a detailed report of the vulnerabilities
            found.
          </p>
          <a className="group inline-flex items-center h-9 rounded-full text-sm font-semibold whitespace-nowrap px-3 focus:outline-none focus:ring-2 bg-slate-700 text-slate-100 hover:bg-slate-600 hover:text-white focus:ring-slate-500 mt-8 cursor-pointer">
            Get started
          </a>
        </div>
      </main>
    </div>
  );
}

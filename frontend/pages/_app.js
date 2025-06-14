import Head from 'next/head';
import '@/styles/globals.css';
import { AuthContextProvider } from '../context/authContext';

export default function App({ Component, pageProps }) {
  return (
    <AuthContextProvider>
      <Head>
        <title>Vecto</title>
        <meta name="description" content="Vecto - Web Vulnerabilities Scanner" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </AuthContextProvider>
  );
}

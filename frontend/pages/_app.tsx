// pages/_app.tsx
import 'bootstrap/dist/css/bootstrap.min.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';   // <-- import SessionProvider
import Script from 'next/script';

import AppNavbar from '../components/Navbar';
import Footer from '../components/Footer';

// We extend AppProps to accept a 'session' prop if you use SSR
// If you're not using SSR, leaving AppProps as-is works, but this is more explicit.
function MyApp({
  Component,
  pageProps: { session, ...pageProps }, // destructure 'session'
}: AppProps) {
  return (
    <>
      {/* Load the Paystack inline script after the page has hydrated */}
      <Script src="https://js.paystack.co/v1/inline.js" strategy="afterInteractive" />

      <SessionProvider session={session}>
        {/* Global Navbar */}
        <AppNavbar />

        {/* Main page content */}
        <Component {...pageProps} />

        {/* Global Footer */}
        <Footer />
      </SessionProvider>
    </>
  );
}

export default MyApp;

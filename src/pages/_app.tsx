import './../styles/global.scss';

import { SessionProvider as NextAuthProvider } from 'next-auth/react';
import { AppProps } from 'next/app';

import { Header } from '../components/Header';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextAuthProvider session={pageProps.session}>
      <Header />
      <Component {...pageProps} />
    </NextAuthProvider>
  )
}

export default MyApp

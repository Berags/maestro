//import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { ChakraProvider } from '@chakra-ui/react'
import Head from 'next/head'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <ChakraProvider>
      <SessionProvider session={session}>
        <Head>
          <title>Maestro</title>
        </Head>
        <Component {...pageProps} />
      </SessionProvider>
    </ChakraProvider>
  )
}

export default MyApp

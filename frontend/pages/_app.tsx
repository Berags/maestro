//import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider, useSession } from 'next-auth/react'
import { ChakraProvider } from '@chakra-ui/react'
import Head from 'next/head'
import Layout from '../components/Layout'
import { useRouter } from 'next/router'
import axios from 'axios'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const { asPath } = useRouter()

  return (
    <ChakraProvider>
      <SessionProvider session={session}>
        <Head>
          <title>Maestro</title>
        </Head>
        {asPath == '/' ? (
          <Component {...pageProps} />
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
      </SessionProvider>
    </ChakraProvider>
  )
}

export default MyApp

//import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { ChakraProvider } from '@chakra-ui/react'
import Head from 'next/head'
import Layout from '../components/Layout'
import { useRouter } from 'next/router'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const { asPath } = useRouter()

  const noLayoutRoutes = ['/', '/admin/dashboard']
  return (
    <ChakraProvider>
      <SessionProvider session={session}>
        <Head>
          <title>Maestro</title>
        </Head>
        {noLayoutRoutes.includes(asPath) ? (
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

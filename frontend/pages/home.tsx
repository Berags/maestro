import { GetServerSidePropsContext, NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useWindowSize } from '../utils/useWindowSize'
import Layout from '../components/Layout'
import NotLoggedIn from '../components/auth/NotLoggedIn'
import { Button } from '@chakra-ui/react'
import LoginButton from '../components/LoginButton'
import Separator from '../components/Separator'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]'

const Home: NextPage = () => {
  const router = useRouter()
  const size = useWindowSize()
  const { data }: any = useSession()

  if (!data) return <NotLoggedIn />

  return <Separator text="Recently played" />
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)

  // If the user is already logged in, redirect.
  if (!session) {
    return { redirect: { destination: '/' } }
  }

  return {
    props: { session: session ?? [] },
  }
}

export default Home

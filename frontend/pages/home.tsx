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
import backend from '../axios.config'
import RecentListen from '../components/RecentListen'

const Home: NextPage = ({ last_listened }: any) => {
  const router = useRouter()
  const size = useWindowSize()
  const { data }: any = useSession()

  if (!data) return <NotLoggedIn />

  return (
    <>
      <Separator text="Recently played" />
      <RecentListen listen={last_listened} />
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)

  // If the user is already logged in, redirect.
  if (!session) {
    return { redirect: { destination: '/' } }
  }

  const last_listened = await backend.get('/recording/last-listened', {
    headers: {
      Authorization: session.token,
    },
  })

  console.log(last_listened.data)

  return {
    props: { session: session ?? [], last_listened: last_listened.data },
  }
}

export default Home

import { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useWindowSize } from '../utils/useWindowSize'
import Layout from '../components/Layout'
import NotLoggedIn from '../components/auth/NotLoggedIn'
import { Button } from '@chakra-ui/react'
import LoginButton from '../components/LoginButton'

const Home: NextPage = () => {
  const router = useRouter()
  const size = useWindowSize()
  const { data: session } = useSession()

  if (!session) return <NotLoggedIn />

  return <Layout><LoginButton /></Layout>
}

export default Home

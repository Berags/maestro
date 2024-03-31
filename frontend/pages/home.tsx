import { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useWindowSize } from '../utils/useWindowSize'
import Layout from '../components/Layout'
import NotLoggedIn from '../components/auth/NotLoggedIn'
import { Button } from '@chakra-ui/react'
import LoginButton from '../components/LoginButton'
import Separator from '../components/Separator'

const Home: NextPage = () => {
  const router = useRouter()
  const size = useWindowSize()
  const { data }: any = useSession()

  if (!data) return <NotLoggedIn />

  return (
    <Layout>
      <Separator text="Recently played" />
    </Layout>
  )
}

export default Home

import { GetServerSidePropsContext, NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useWindowSize } from '../utils/useWindowSize'
import NotLoggedIn from '../components/auth/NotLoggedIn'
import { Button, chakra, Container, SimpleGrid } from '@chakra-ui/react'
import Separator from '../components/Separator'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]'
import backend from '../axios.config'
import RecentListen from '../components/RecentListen'
import PlaylistCard from '../components/PlaylistCard'

const Home: NextPage = ({ last_listened, playlists, random }: any) => {
  const router = useRouter()
  const size = useWindowSize()
  const { data }: any = useSession()

  if (!data) return <NotLoggedIn />

  return (
    <>
      <Separator text="Recently played" />
      <RecentListen listen={last_listened} />
      <Separator text="Playlists" />
      <Container maxW={'8xl'}>
        <SimpleGrid columns={[1, 1, 3, 3]} spacingY={4} spacingX={2}>
          {playlists.length === 0 ? (
            <chakra.h2 textAlign={'center'}>No playlist found!</chakra.h2>
          ) : (
            <>
              {playlists.slice(0, 3).map((value: any, id: any) => (
                <PlaylistCard key={id} playlist={value} variant="home" />
              ))}
            </>
          )}
        </SimpleGrid>
      </Container>
      <Separator text="You may like" />
      <RecentListen listen={random} />
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

  const playlists = await backend.get('/playlist/my-playlists', {
    headers: {
      Authorization: session.token,
    },
  })

  const res_random = await backend.get('/recording/random', {
    headers: {
      Authorization: session.token,
    },
  })

  return {
    props: {
      session: session ?? [],
      last_listened: last_listened.data,
      playlists: playlists.data,
      random: res_random.data,
    },
  }
}

export default Home

import { Container, SimpleGrid } from '@chakra-ui/react'
import PlaylistCard from '../../components/PlaylistCard'
import Separator from '../../components/Separator'
import backend from '../../axios.config'
import { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]'

const Playlist = () => {
  return (
    <>
      <Separator text="My playlists" />
      <Container maxW={'8xl'}>
        <SimpleGrid minChildWidth="350px">
          <PlaylistCard />
          <PlaylistCard />
          <PlaylistCard />
          <PlaylistCard />
        </SimpleGrid>
      </Container>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)

  // If the user is already logged in, redirect.
  if (!session) {
    return { redirect: { destination: '/' } }
  }

  return {
    props: {
      session: session ?? [],
    },
  }
}

export default Playlist

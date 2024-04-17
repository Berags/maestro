import { Container, SimpleGrid, chakra } from '@chakra-ui/react'
import { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth'
import backend from '../../axios.config'
import PlaylistCard from '../../components/PlaylistCard'
import Separator from '../../components/Separator'
import { authOptions } from '../api/auth/[...nextauth]'

const Playlist = ({ playlists }: any) => {
  return (
    <>
      <Separator text="My playlists" />
      <Container maxW={'8xl'}>
        <SimpleGrid minChildWidth="18em" spacingY={4}>
          {playlists.length === 0 ? (
            <chakra.h2 textAlign={'center'}>No playlist found!</chakra.h2>
          ) : (
            <>
              {playlists.map((value: any, id: any) => (
                <PlaylistCard key={id} playlist={value} />
              ))}
            </>
          )}
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

  const res = await backend.get('/playlist/my-playlists', {
    headers: {
      Authorization: session.token,
    },
  })

  return {
    props: {
      session: session ?? [],
      playlists: res.data,
    },
  }
}

export default Playlist

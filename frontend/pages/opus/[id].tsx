import { useSession } from 'next-auth/react'
import { Box, Flex, IconButton, SimpleGrid, Text } from '@chakra-ui/react'
import axios from 'axios'
import { getServerSession } from 'next-auth'
import { GetServerSidePropsContext } from 'next'
import { authOptions } from '../api/auth/[...nextauth]'
import Separator from '../../components/Separator'
import PieceCard from '../../components/search/PieceCard'
import backend from '../../axios.config'
import { FaPlay } from 'react-icons/fa6'
import useAudioPlayer from '../../utils/useAudioPlayer'

const Opus: any = ({ recordings, opus }: any) => {
  const { data }: any = useSession()
  const audioPlayer = useAudioPlayer()

  if (!data) {
    return <>loading</>
  }

  return (
    <Box px={4} pt={4}>
      <Flex px={6} verticalAlign={'center'}>
        <IconButton
          isRound={true}
          variant="ghost"
          icon={<FaPlay />}
          fontSize="2em"
          colorScheme="grey"
          aria-label={'Play all'}
          onClick={() => {
            audioPlayer.setQueue(recordings)
          }}
        />
        <Text as="b" fontSize={'3xl'} ml={4}>
          {opus.title}
        </Text>
      </Flex>
      <Separator text="Recordings" />
      <SimpleGrid
        spacing={5}
        mb={5}
        justifyItems={'center'}
        columns={[1, 1, 2, 3, 4, 5]}
      >
        {recordings.map((rec: any) => (
          <PieceCard pieceData={rec} />
        ))}
      </SimpleGrid>
    </Box>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)

  // If the user is already logged in, redirect.
  if (!session || !context.params) {
    return { redirect: { destination: '/' } }
  }

  const id = context.params.id // Get ID from slug

  const res_opus = await backend.get(`/opus/` + id, {
    headers: {
      Authorization: session.token,
    },
  })

  const res = await backend.get(`/recording/by-opus/` + id, {
    headers: {
      Authorization: session.token,
    },
  })

  console.log(res.data)

  return {
    props: {
      session: session ?? [],
      recordings: res.data,
      opus: res_opus.data,
    },
  }
}

export default Opus

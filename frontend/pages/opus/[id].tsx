import { useSession } from 'next-auth/react'
import { Box, SimpleGrid } from '@chakra-ui/react'
import axios from 'axios'
import { getServerSession } from 'next-auth'
import { GetServerSidePropsContext } from 'next'
import { authOptions } from '../api/auth/[...nextauth]'
import Separator from '../../components/Separator'
import PieceCard from '../../components/search/PieceCard'

const Opus: any = ({ recordings, backend_api }: any) => {
  const { data }: any = useSession()

  if (!data) {
    return <>loading</>
  }

  return (
    <Box px={4}>
      <Separator text="Composers" />
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

  const res = await axios.get(
    process.env.BACKEND_API + `/recording/by-opus/` + id,
    {
      headers: {
        session: session.backend_session,
      },
    }
  )

  console.log(res.data)

  return {
    props: {
      session: session ?? [],
      recordings: res.data,
      backend_api: process.env.BACKEND_API,
    },
  }
}

export default Opus

import { Box, SimpleGrid, Skeleton } from '@chakra-ui/react'
import { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import backend from '../../axios.config'
import Pagination from '../../components/Pagination'
import RecentListen from '../../components/RecentListen'
import PieceCard from '../../components/PieceCard'
import Separator from '../../components/Separator'
import { authOptions } from '../api/auth/[...nextauth]'

const Recordings: any = ({
  nOfPages,
  top_recordings,
  last_listened,
  random_recording,
}: any) => {
  const session: any = useSession()
  const [page, setPage] = useState<number>(0)
  const [recordings, setRecordings] = useState([])
  const [updated, setUpdated] = useState(false)

  if (!session) return <Skeleton />

  useEffect(() => {
    const getComposers = async () => {
      if (session.data) {
        const res_pages = await backend({
          method: 'get',
          url: '/recording/liked?page=' + page,
          headers: {
            Authorization: session.data.token,
          },
        })
        setRecordings(res_pages.data)
        setUpdated(false)
      }
    }

    getComposers()
  }, [page, updated])

  return (
    <Box px={4}>
      <Separator text="You last listened recording" />
      <RecentListen listen={last_listened} />
      {recordings.length > 0 && (
        <>
          <Separator text="Your liked recordings" />
          <SimpleGrid
            columns={[1, 1, 2, 3, 4, 5]}
            spacing={5}
            mb={5}
            justifyItems={'center'}
          >
            {recordings.map((val: any, i: number) => (
              <PieceCard request setUpdated={setUpdated} pieceData={val} />
            ))}
          </SimpleGrid>
        </>
      )}
      <Separator text="Randomly selected recording you may like" />
      <RecentListen listen={random_recording} />
      <Separator text="Top Recordings" />
      <SimpleGrid
        columns={[1, 1, 2, 3, 4, 5]}
        spacing={5}
        mb={5}
        justifyItems={'center'}
      >
        {top_recordings.map((val: any, i: number) => (
          <PieceCard request setUpdated={setUpdated} pieceData={val} />
        ))}
      </SimpleGrid>
      <Pagination index={page} nOfPages={nOfPages} setPage={setPage} />
    </Box>
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

  const res = await backend.get(`/recording/top`, {
    headers: {
      Authorization: session.token,
    },
  })

  const res_liked = await backend.get('/recording/liked/pages', {
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
      nOfPages: res_liked.data.n_of_pages,
      top_recordings: res.data,
      last_listened: last_listened.data,
      random_recording: res_random.data,
    },
  }
}

export default Recordings

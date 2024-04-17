import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { Box, Center, Flex, SimpleGrid, Skeleton } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { getServerSession } from 'next-auth'
import { GetServerSidePropsContext } from 'next'
import { authOptions } from '../api/auth/[...nextauth]'
import Pagination from '../../components/Pagination'
import ComposerCard from '../../components/search/ComposerCard'
import Separator from '../../components/Separator'
import backend from '../../axios.config'

const Composers: any = ({ nOfPages, liked_composers }: any) => {
  const session: any = useSession()
  const [page, setPage] = useState<number>(0)
  const [composers, setComposers] = useState([])

  if (!session) return <Skeleton />

  useEffect(() => {
    const getComposers = async () => {
      if (session.data) {
        const res_pages = await backend({
          method: 'get',
          url: '/composer/?page=' + page,
          headers: {
            Authorization: session.data.token,
          },
        })
        setComposers(res_pages.data)
      }
    }

    getComposers()
  }, [page, session])

  return (
    <Box px={4}>
      {liked_composers.length > 0 && (
        <>
          <Separator text="Your liked composers" />
          <SimpleGrid
            columns={[1, 1, 2, 3, 4, 5]}
            spacing={5}
            mb={5}
            justifyItems={'center'}
          >
            {liked_composers.map((val: any, i: number) => (
              <ComposerCard composerData={val} />
            ))}
          </SimpleGrid>
        </>
      )}
      <Separator text="Top Trending Composers" />
      <SimpleGrid
        columns={[1, 1, 2, 3, 4, 5]}
        spacing={5}
        mb={5}
        justifyItems={'center'}
      >
        {composers.map((val, i) => (
          <ComposerCard composerData={val} />
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

  const res = await backend.get(`/composer/pages`, {
    headers: {
      Authorization: session.token,
    },
  })

  const res_liked = await backend.get('/composer/liked', {
    headers: {
      Authorization: session.token,
    },
  })

  return {
    props: {
      session: session ?? [],
      nOfPages: res.data.n_of_pages,
      liked_composers: res_liked.data,
    },
  }
}

export default Composers

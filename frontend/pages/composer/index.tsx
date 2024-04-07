import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { Box, Center, Flex, SimpleGrid } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { getServerSession } from 'next-auth'
import { GetServerSidePropsContext } from 'next'
import { authOptions } from '../api/auth/[...nextauth]'
import Pagination from '../../components/Pagination'
import ComposerCard from '../../components/search/ComposerCard'
import Separator from '../../components/Separator'

const Composers: any = ({ nOfPages, backend_api }: any) => {
  const { data }: any = useSession()
  const [page, setPage] = useState<number>(0)
  const [composers, setComposers] = useState([])
  useEffect(() => {
    const getComposers = async () => {
      const res = await axios.get(backend_api + '/composer/?page=' + page, {
        headers: {
          session: data.backend_session,
        },
      })
      setComposers(res.data)
    }

    getComposers()
  }, [page])

  if (!data) {
    return <>loading</>
  }

  return (
    <Box px={4}>
      <Separator text="Composers" />
      <SimpleGrid minChildWidth="250px" spacing={5} mb={5}>
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

  const res = await axios.get(process.env.BACKEND_API + `/composer/pages`, {
    headers: {
      session: session.backend_session,
    },
  })

  return {
    props: {
      session: session ?? [],
      nOfPages: res.data.n_of_pages,
      backend_api: process.env.BACKEND_API,
    },
  }
}

export default Composers

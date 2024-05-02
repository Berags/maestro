import {
  Box, SimpleGrid
} from '@chakra-ui/react'
import { GetServerSidePropsContext, NextPage } from 'next'
import { getServerSession } from 'next-auth'
import { useSession } from 'next-auth/react'
import NotLoggedIn from '../components/auth/NotLoggedIn'
import PieceCard from '../components/PieceCard'
import AutocompleteSearchBox from '../components/search/AutocompleteSearchBox'
import Separator from '../components/Separator'
import { authOptions } from './api/auth/[...nextauth]'

const Search: NextPage = () => {
  const { data }: any = useSession()

  if (!data) return <NotLoggedIn />

  return (
    <Box px={4}>
      <AutocompleteSearchBox />
      <Separator text="Composers" />
      <SimpleGrid minChildWidth="250px" spacing={5}>
      </SimpleGrid>
      <Separator text="Pieces" />
      <SimpleGrid minChildWidth={'250px'} spacing={5}>
        <PieceCard />
        <PieceCard />
        <PieceCard />
      </SimpleGrid>
    </Box>
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

export default Search

import { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useWindowSize } from '../utils/useWindowSize'
import Layout from '../components/Layout'
import NotLoggedIn from '../components/auth/NotLoggedIn'
import {
  AbsoluteCenter,
  Box,
  Button,
  Center,
  Divider,
  SimpleGrid,
} from '@chakra-ui/react'
import LoginButton from '../components/LoginButton'
import ComposerCard from '../components/search/ComposerCard'
import PieceCard from '../components/search/PieceCard'
import Separator from '../components/Separator'

const Search: NextPage = () => {
  const router = useRouter()
  const size = useWindowSize()
  const { data }: any = useSession()

  if (!data) return <NotLoggedIn />

  return (
    <Box px={4}>
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

export default Search

import {
  Box, SimpleGrid
} from '@chakra-ui/react'
import { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import NotLoggedIn from '../../components/auth/NotLoggedIn'
import PieceCard from '../../components/PieceCard'
import PerformerCard from '../../components/search/PerformerCard'
import Separator from '../../components/Separator'

const Search: NextPage = () => {
  const { data }: any = useSession()

  if (!data) return <NotLoggedIn />

  return (
    <Box px={4}>
      <Separator text="Performers" />
      <SimpleGrid minChildWidth="250px" spacing={5}>
        <PerformerCard
          performerData={{
            name: 'Vladimir Horowitz',
            period: 'Classical',
            shortDescription:
              'Vladimir Horowitz was a legendary pianist, famous for his dazzling technique, unique tone, and ability to electrify audiences with his passionate performances.',
            img: 'https://is1-ssl.mzstatic.com/image/thumb/Features126/v4/87/ef/3b/87ef3b2a-7aa0-53e2-ddf1-239210ddec31/mzl.lbtyycfj.jpg/2400x933vf-60.jpg',
          }}
        />
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

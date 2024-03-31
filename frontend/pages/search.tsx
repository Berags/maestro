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
    <Layout>
      <Separator text="Composers" />
      <SimpleGrid minChildWidth="250px" spacing={5}>
        <ComposerCard
          composerData={{
            name: 'Wolfgang A. Mozart',
            period: 'Classical',
            shortDescription:
              'A musical prodigy who lived a brief life, this composer left a huge mark with hundreds of pieces.  Their work is celebrated even today.',
            img: 'https://is1-ssl.mzstatic.com/image/thumb/Features116/v4/64/1a/c9/641ac929-d0a2-d900-d14c-167af9015640/57d4e234-8f22-4a54-8e14-44f981d1c4f0.png/2400x933ea-60.jpg',
          }}
        />
        <ComposerCard
          composerData={{
            name: 'Fryderyk Chopin',
            period: 'Romanticism',
            shortDescription:
              "Poetic piano master, Chopin's works are known for their beauty and emotional depth.",
            img: 'https://is1-ssl.mzstatic.com/image/thumb/Features116/v4/5f/06/23/5f0623fa-49a3-6c2d-d23d-095d89ed5f07/d2cb58f7-f760-4e7c-bffa-37ac125cfe95.png/2400x933ea-60.jpg',
          }}
        />
        <ComposerCard
          composerData={{
            name: 'Sergei Rachmaninoff',
            period: 'Post-Romanticism',
            shortDescription:
              "Romantic giant, this composer/pianist's music lives on. Known for both passion and power.",
            img: 'https://is1-ssl.mzstatic.com/image/thumb/Features116/v4/0d/00/c2/0d00c230-e27d-ea05-95fe-d167f98ec6b8/d7d70437-c2b6-4a48-b8ae-9ad7aaf6f873.png/2400x933ea-60.jpg',
          }}
        />
      </SimpleGrid>
      <Separator text="Pieces" />
      <SimpleGrid minChildWidth={'250px'} spacing={5}>
        <PieceCard />
        <PieceCard />
        <PieceCard />
      </SimpleGrid>
    </Layout>
  )
}

export default Search

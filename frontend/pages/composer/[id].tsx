import {
  chakra,
  Stack,
  useColorModeValue,
  Box,
  SimpleGrid,
} from '@chakra-ui/react'
import Layout from '../../components/Layout'
import { useRouter } from 'next/router'
import { GetServerSidePropsContext } from 'next'
import { authOptions } from '../api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import OpusCard from '../../components/composers/OpusCard'

const Composer = () => {
  const router = useRouter()
  const composerId = router.query.id

  //TODO: query from backend
  const composerData = {
    name: 'Wolfgang A. Mozart',
    period: 'Classical',
    shortDescription:
      'A musical prodigy who lived a brief life, this composer left a huge mark with hundreds of pieces.  Their work is celebrated even today.',
    birthday: '27 January 1756',
    death: '5 December 1791',
    birthPlace: 'Saltzburg',
    deathPlace: 'Wien',
    img: 'https://is1-ssl.mzstatic.com/image/thumb/Features116/v4/64/1a/c9/641ac929-d0a2-d900-d14c-167af9015640/57d4e234-8f22-4a54-8e14-44f981d1c4f0.png/2400x933ea-60.jpg',
  }

  return (
    <>
      <Box>
        <Stack
          pos="relative"
          bgImage={composerData.img}
          bgPosition={'center'}
          w="100%"
          h={500}
        ></Stack>
        <Box
          maxW="3xl"
          p={4}
          isolation="isolate"
          zIndex={3}
          mt="-10rem"
          marginInline="auto"
        >
          <Box
            boxShadow={useColorModeValue(
              '0 4px 6px rgba(160, 174, 192, 0.6)',
              '0 4px 6px rgba(9, 17, 28, 0.9)'
            )}
            bg={useColorModeValue('white', 'gray.800')}
            p={{ base: 4, sm: 8 }}
            overflow="hidden"
            rounded="2xl"
          >
            <Stack
              pos="relative"
              zIndex={1}
              direction="column"
              spacing={5}
              textAlign="left"
            >
              <chakra.h1
                fontSize="4xl"
                lineHeight={1.2}
                fontWeight="bold"
                alignSelf={'center'}
              >
                {composerData.name}
              </chakra.h1>
              <chakra.h3 color={'grey.600'} alignSelf={'center'}>
                {composerData.period}
              </chakra.h3>
              <chakra.h1
                color="gray.400"
                fontSize="xl"
                maxW="600px"
                lineHeight={1.2}
                alignSelf={'center'}
              >
                {composerData.shortDescription}
              </chakra.h1>

              <Stack
                direction={{ base: 'column', md: 'row' }}
                spacing={3}
                alignSelf={'center'}
              >
                <chakra.h5>
                  {composerData.birthPlace}, {composerData.birthday} -{' '}
                  {composerData.deathPlace}, {composerData.death}
                </chakra.h5>
              </Stack>
            </Stack>
          </Box>
        </Box>
      </Box>
      <SimpleGrid minChildWidth={'350px'} spacing={5} mb={'10%'}>
        <OpusCard
          opusData={{
            name: 'Don Giovanni',
            type: 'Opera',
            shortDescription:
              'Don Giovanni is a dramatic opera by Mozart about a charming but arrogant nobleman who gets his comeuppance for a life of treating women badly.',
            duration: '3 hours and 20 minutes',
            image: 'https://picsum.photos/seed/picsum/300',
          }}
        />
        <OpusCard
          opusData={{
            name: 'Così fan tutte',
            type: 'Opera',
            shortDescription:
              "Così fan tutte is a playful Mozart opera about two engaged couples who get tricked into doubting each other's fidelity, with hilarious (and ultimately heartwarming) results.              ",
            duration: '3 hours',
            image: 'https://picsum.photos/seed/picsum/300',
          }}
        />
        <OpusCard
          opusData={{
            name: 'Piano concerto No. 20 in D Minor',
            type: 'Concerto',
            shortDescription:
              "Mozart's Piano Concerto No. 20 in D minor is a dramatic and powerful work, known for its dark and stormy moods contrasted with moments of lightness.",
            duration: '35 minutes',
            image: 'https://picsum.photos/seed/picsum/300',
          }}
        />
      </SimpleGrid>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)

  // If the user is already logged in, redirect.
  if (!session) {
    return { redirect: { destination: '/' } }
  }

  return {
    props: { session: session ?? [] },
  }
}

export default Composer

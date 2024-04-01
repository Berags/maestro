import {
  chakra,
  Stack,
  useColorModeValue,
  Box,
  SimpleGrid,
  Text,
  Flex,
  Link,
  Button,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'
import Layout from '../../components/Layout'
import { useRouter } from 'next/router'
import { GetServerSidePropsContext } from 'next'
import { authOptions } from '../api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import PieceCard from '../../components/search/PieceCard'

const Performer = () => {
  const router = useRouter()
  const composerId = router.query.id
  const { isOpen, onOpen, onClose } = useDisclosure()

  //TODO: query from backend
  const composerData = {
    name: 'Vladimir Horowitz',
    period: 'Classical',
    shortDescription:
      'Vladimir Horowitz was a legendary pianist, famous for his dazzling technique, unique tone, and ability to electrify audiences with his passionate performances.',
    longDescription:
      "Born between 1903 and 1904 (sources differ on the exact year) in either Kiev or Berdichev, Ukraine (then part of the Russian Empire), Vladimir Horowitz (d. 1989) became a piano icon. Nurtured by his pianist mother, his talent blossomed early, leading him to the prestigious Kiev Conservatory at 12. Despite early recognition in Russia, war and revolution forced a 1922 debut. Emigrating in 1925, he took Europe by storm with his virtuosity, rich sound, and ability to ignite audiences with his passionate interpretations. However, stage fright led to a performance hiatus in the mid-1930s. A triumphant return to the stage in the late 1930s, now a U.S. citizen, solidified his place among the greats. He continued to captivate audiences for decades, his later years marked by prolific recordings.  Horowitz died in New York in 1989, leaving behind a legacy of brilliance and a reputation as one of history's most captivating pianists.",
    birthday: '1 October 1903',
    death: '5 November 1989',
    birthPlace: 'Kiev',
    deathPlace: 'New York',
    img: 'https://is1-ssl.mzstatic.com/image/thumb/Features126/v4/87/ef/3b/87ef3b2a-7aa0-53e2-ddf1-239210ddec31/mzl.lbtyycfj.jpg/2400x933vf-60.jpg',
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
            </Stack>
          </Box>
        </Box>
      </Box>
      <SimpleGrid minChildWidth={'350px'} spacing={5} px={4}>
        <PieceCard />
        <PieceCard />
        <PieceCard />
      </SimpleGrid>
      <Flex
        p={50}
        w="full"
        alignItems="center"
        justifyContent="center"
        mb={'5%'}
      >
        <Box
          bg="white"
          _dark={{ bg: 'gray.800' }}
          mx={{ lg: 8 }}
          display={{ lg: 'flex' }}
          maxW={{ lg: '5xl' }}
          shadow={{ lg: 'lg' }}
          rounded={{ lg: 'lg' }}
        >
          <Box w={{ lg: '50%' }}>
            <Box
              h={{ base: 64, lg: 'full' }}
              rounded={{ lg: 'lg' }}
              bgSize="cover"
              bgPosition={"center"}
              style={{
                backgroundImage: `url('${composerData.img}')`,
              }}
            ></Box>
          </Box>

          <Box
            py={12}
            px={6}
            maxW={{ base: 'xl', lg: '5xl' }}
            w={{ lg: '50%' }}
          >
            <chakra.h2
              fontSize={{ base: '2xl', md: '3xl' }}
              color="gray.800"
              _dark={{ color: 'white' }}
              fontWeight="bold"
            >
              {composerData.name}
            </chakra.h2>
            <chakra.h4 color={'grey.100'}>
              {composerData.birthPlace}, {composerData.birthday} -{' '}
              {composerData.deathPlace}, {composerData.death}
            </chakra.h4>
            <Text
              noOfLines={[1, 2, 3]}
              mt={4}
              color="gray.600"
              _dark={{ color: 'gray.400' }}
            >
              {composerData.longDescription}
            </Text>

            <Box mt={8}>
              <Button onClick={onOpen} variant="link">
                More
              </Button>
            </Box>
          </Box>
        </Box>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{composerData.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{composerData.longDescription}</ModalBody>
        </ModalContent>
      </Modal>
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

export default Performer

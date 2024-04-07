import {
  chakra,
  Stack,
  useColorModeValue,
  Box,
  SimpleGrid,
  Flex,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Text,
  IconButton,
  Divider,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { GetServerSidePropsContext } from 'next'
import { authOptions } from '../api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import OpusCard from '../../components/composers/OpusCard'
import { FaHeart } from 'react-icons/fa6'
import Separator from '../../components/Separator'
import axios from 'axios'

const Composer = ({ composerData }: any) => {
  const router = useRouter()
  const composerId = router.query.id
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Box>
        <Stack
          pos="relative"
          bgImage={composerData.portrait}
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
                {composerData.epoch}
              </chakra.h3>
              <chakra.h1
                color="gray.400"
                fontSize="xl"
                maxW="600px"
                lineHeight={1.2}
                alignSelf={'center'}
              >
                {composerData.short_description}
              </chakra.h1>

              <Stack
                direction={{ base: 'column', md: 'row' }}
                spacing={3}
                alignSelf={'center'}
              >
                <IconButton
                  icon={<FaHeart />}
                  aria-label={'Like'}
                  variant={'link'}
                  color={composerData.isLiked ? 'red.500' : 'grey.600'}
                />
              </Stack>
            </Stack>
          </Box>
        </Box>
      </Box>
      <Separator text={'Opuses'} />
      <SimpleGrid minChildWidth={'350px'} spacing={5} px={5}>
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
              bgPosition={'center'}
              style={{
                backgroundImage: `url('${composerData.portrait}')`,
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
              {composerData.birth_place},{' '}
              {new Date(composerData.birth_date).getFullYear()} -{' '}
              {composerData.death_place},{' '}
              {new Date(composerData.death_date).getFullYear()}
            </chakra.h4>
            <Text
              noOfLines={[1, 2, 3]}
              mt={4}
              color="gray.600"
              _dark={{ color: 'gray.400' }}
            >{composerData.long_description}</Text>

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
          <ModalBody>
            {composerData.long_description.map((p: string) => 
              <Text mb={2}>{p}</Text>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)

  // If the user is already logged in, redirect.
  if (!session || !context.params) {
    return { redirect: { destination: '/' } }
  }

  const id = context.params.id // Get ID from slug

  const res = await axios.get(process.env.BACKEND_API + `/composer/id/${id}`, {
    headers: {
      session: session.backend_session,
    },
  })

  res.data.long_description = res.data.long_description.split("\n")

  return {
    props: { session: session ?? [], composerData: res.data },
  }
}

export default Composer

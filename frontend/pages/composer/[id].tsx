import {
  Box,
  Button,
  Center,
  chakra,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react'
import { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaHeart } from 'react-icons/fa6'
import backend from '../../axios.config'
import OpusCard from '../../components/composers/OpusCard'
import Pagination from '../../components/Pagination'
import Separator from '../../components/Separator'
import { authOptions } from '../api/auth/[...nextauth]'

const Composer = ({ composerData, nOfPages }: any) => {
  const router = useRouter()
  const { data }: any = useSession()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [page, setPage] = useState<number>(0)
  const [liked, setLiked] = useState<boolean>(composerData.is_liked)
  const [opuses, setOpuses] = useState(composerData.opuses)

  useEffect(() => {
    const getComposers = async () => {
      const res = await backend.get(
        '/composer/id/' + router.query.id + '?page=' + page,
        {
          headers: {
            Authorization: data.token,
          },
        }
      )
      setOpuses(res.data.opuses)
    }

    getComposers()
  }, [page])

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
                textAlign={'center'}
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
                  color={liked ? 'red.500' : 'grey.100'}
                  onClick={async () => {
                    const res = await backend.post(
                      '/composer/like/' + composerData.id,
                      {},
                      {
                        headers: {
                          Authorization: data.token,
                        },
                      }
                    )
                    if (res.status === 200) {
                      setLiked(!liked)
                      toast.success('Added to liked composers!')
                    } else {
                      toast.error('Unable to add!')
                    }
                  }}
                />
              </Stack>
            </Stack>
          </Box>
        </Box>
      </Box>
      <Box px={5}>
        <Separator text={'Opuses'} />
        <SimpleGrid minChildWidth={'15em'} spacing={5}>
          {opuses.map((op: any) => (
            <OpusCard opusData={op} />
          ))}
        </SimpleGrid>
        <Center mt={2}>
          <Pagination index={page} nOfPages={nOfPages} setPage={setPage} />
        </Center>
      </Box>
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
            >
              {composerData.long_description}
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
          <ModalBody textAlign={'justify'}>
            {composerData.long_description.map((p: string) => (
              <Text mb={2}>{p}</Text>
            ))}
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

  const res = await backend.get(`/composer/id/${id}?page=0`, {
    headers: {
      Authorization: session.token,
    },
  })

  res.data.long_description = res.data.long_description.split('\n')

  return {
    props: {
      session: session ?? [],
      composerData: res.data,
      nOfPages: res.data.n_of_pages,
    },
  }
}

export default Composer

import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next'
import { useWindowSize } from '../utils/useWindowSize'
import { getProviders, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { Box, Button, chakra, Stack, Text } from '@chakra-ui/react'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]'

const Home: any = ({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const size = useWindowSize()
  const router = useRouter()

  return (
    <Box px={8} py={24} mx="auto">
      <Box
        w={{ base: 'full', md: 11 / 12, xl: 9 / 12 }}
        mx="auto"
        textAlign={{ base: 'left', md: 'center' }}
      >
        <chakra.h1
          mb={6}
          fontSize={{ base: '4xl', md: '6xl' }}
          fontWeight="bold"
          lineHeight="none"
          letterSpacing={{ base: 'normal', md: 'tight' }}
          color="gray.900"
          _dark={{ color: 'gray.100' }}
        >
          welcome to project{' '}
          <Text
            display={{ base: 'block', lg: 'inline' }}
            w="full"
            bgClip="text"
            bgGradient="linear(to-r, green.400,purple.500)"
            fontWeight="extrabold"
          >
            maestro
          </Text>
        </chakra.h1>
        <chakra.p
          px={{ base: 0, lg: 24 }}
          mb={6}
          fontSize={{ base: 'lg', md: 'xl' }}
          color="gray.600"
          _dark={{ color: 'gray.300' }}
        >
          maestro is the next generation classical music player
        </chakra.p>
        <Stack
          direction={{ base: 'column', sm: 'row' }}
          mb={{ base: 4, md: 8 }}
          spacing={2}
          justifyContent={{ sm: 'left', md: 'center' }}
        >
          {Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <Button
                as="a"
                colorScheme="gray"
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                w={{ base: 'full', sm: 'auto' }}
                mb={{ base: 2, sm: 0 }}
                size="lg"
                cursor="pointer"
                onClick={() => signIn(provider.id, { redirect: false })}
              >
                Sign in with {provider.name}
              </Button>
            </div>
          ))}
        </Stack>
      </Box>
      <Box
        w={{ base: 'full', md: 10 / 12 }}
        mx="auto"
        mt={20}
        textAlign="center"
      ></Box>
    </Box>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)

  // If the user is already logged in, redirect.
  if (session) {
    return { redirect: { destination: '/home' } }
  }

  const providers = await getProviders()

  return {
    props: { providers: providers ?? [] },
  }
}

export default Home

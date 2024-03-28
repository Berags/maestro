import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Center,
  Stack,
} from '@mantine/core'
import Link from 'next/link'

const NotLoggedIn = () => {
  return (
    <Stack h={300} mt={40} bg="var(--mantine-color-body)" gap="lg">
        <Title
          order={2}
          mt="sm"
          tw={'wrap'}
          sx={{
            color: '#0070f3',
            fontSize: '2rem',
            '@media (min-width: 800px)': {
              fontSize: '2rem',
            },
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          unauthorized
        </Title>
        <Text sx={{
            textAlign: 'center'
        }}>
          please go to <Link color="var(--mantine-color-body)" href={'/api/auth/signin'}>login</Link> page!
        </Text>
    </Stack>
  )
}

export default NotLoggedIn

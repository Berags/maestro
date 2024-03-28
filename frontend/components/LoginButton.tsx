import { Button } from '@mantine/core'
import { useSession, signIn, signOut } from 'next-auth/react'

export default function Component() {
  const { data: session } = useSession()
  if (session) {
    console.table(session)
    return (
      <>
        Signed in as {session.user!.name} <br />
        <Button onClick={() => signOut()}>Sign out</Button>
      </>
    )
  }
  return (
    <>
      <Button onClick={() => signIn()}>Sign in</Button>
    </>
  )
}

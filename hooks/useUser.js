import { useSession, signOut } from 'next-auth/react'

// One place to ask "who is signed in?", whether they came in through Google, Apple or an email link.
// A thin wrapper over the NextAuth session. Apple and email sign-ins often carry no name.
export default function useUser() {
  const { data: session, status } = useSession()
  const user = session?.user
    ? { name: session.user.name, email: session.user.email, image: session.user.image || null }
    : null

  return {
    user,
    loading: status === 'loading',
    logout: () => signOut({ callbackUrl: '/' }),
  }
}

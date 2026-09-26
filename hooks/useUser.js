import { useSession, signOut } from 'next-auth/react'

// One place to ask "who is signed in?". Google is the only way in, so this is a thin wrapper over
// the NextAuth session that keeps pages from each knowing that.
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

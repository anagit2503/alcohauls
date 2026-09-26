// Whether Google sign-in is switched on. Kept apart from the NextAuth route so pages can ask the
// question in getStaticProps without pulling NextAuth's server code into the browser bundle.
export const authConfigured = () =>
  Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.NEXTAUTH_SECRET)

import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import backend from '../../../axios.config'

export const authOptions = {
  secret: process.env.AUTH_SECRET,
  // Auth Providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token to the token right after signin
      if (account && profile) {
        const body = {
          id: account.providerAccountId,
          username: profile.login,
          name: profile.name,
          email: profile.email,
          image: profile.avatar_url,
          provider: account.provider,
          previous_session: null,
        }
        const res = await backend
          .post('/auth/login', body)
          .catch((e) => console.log(e))

        token.accountId = account.providerAccountId
        token.provider = account.provider
        token.session_token = res.data.token
        if (account.email) token.email = account.email
      }
      return token
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.
      if (token.email) session.user.email = token.email
      session.accountId = token.accountId
      session.provider = token.provider
      session.token = token.session_token
      return session
    },
  },
}

export default NextAuth(authOptions)

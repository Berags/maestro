import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import DiscordProvider from 'next-auth/providers/discord'
import axios from 'axios'
const scopes = ['identify'].join(' ')

export const authOptions = {
  secret: process.env.AUTH_SECRET,
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorization: { params: { scope: scopes } },
    }),
    // ...add more providers here
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        const body = {
          id: account.providerAccountId,
          username: profile.login,
          name: profile.name,
          email: profile.email,
          image: profile.avatar_url,
          provider: account.provider,
          previous_session: null,
        }
        const res = await axios.post(
          process.env.BACKEND_API + '/auth/login',
          body
        )
       
        token.accountId = account.providerAccountId
        token.provider = account.provider
        token.backend_session = res.data.token
        token.valid_until = new Date(Date.now() + 1000 * 60 * 5)
        if (account.email) token.email = account.email
      }
      return token
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.backend_session = token.backend_session

      if (new Date(Date.now()).getTime() >= token.valid_until) {
        // Token is expired
        const body = {
          id: token.accountId,
          username: token.email,
          name: token.name,
          email: token.email,
          image: token.picture,
          provider: token.provider,
          previous_session: token.backend_session,
        }
        const res = await axios.post(
          process.env.BACKEND_API + '/auth/login',
          body
        )

        session.backend_session = res.data.token
      }
 
      if (token.email) session.user.email = token.email
      session.accountId = token.accountId
      session.provider = token.provider
      // session.backend_session = token.backend_session
      return session
    },
  },
}

export default NextAuth(authOptions)

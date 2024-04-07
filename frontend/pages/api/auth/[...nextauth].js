import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import DiscordProvider from 'next-auth/providers/discord'
import axios from "axios";
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
    async signIn({ user, account, profile, email, credentials }) {
      const body = {
        id: profile.id,
        username: profile.login,
        name: user.name,
        email: user.email,
        image: user.image,
        provider: account.provider,
      }
      const res = await axios.post(process.env.BACKEND_API + '/auth/login', body)
      return true
    },
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accountId = account.providerAccountId
        token.provider = account.provider
        if(account.email)
          token.email = account.email
      }
      return token
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      if(token.email)
        session.user.email = token.email
      session.accountId = token.accountId
      session.provider = token.provider
      return session
    },
  },
}

export default NextAuth(authOptions)

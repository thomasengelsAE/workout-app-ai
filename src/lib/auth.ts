import NextAuth from 'next-auth';
import Keycloak from 'next-auth/providers/keycloak';
import { prisma } from '@/lib/prisma';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Keycloak({
      clientId: process.env.AUTH_KEYCLOAK_ID ?? '',
      clientSecret: process.env.AUTH_KEYCLOAK_SECRET ?? '',
      issuer: process.env.AUTH_KEYCLOAK_ISSUER ?? '',
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!profile?.sub) return false;

      await prisma.user.upsert({
        where: { keycloakId: profile.sub },
        update: {
          email: profile.email ?? user.email ?? '',
          username:
            (profile as { preferred_username?: string }).preferred_username ??
            user.name ??
            profile.sub,
        },
        create: {
          keycloakId: profile.sub,
          email: profile.email ?? user.email ?? '',
          username:
            (profile as { preferred_username?: string }).preferred_username ??
            user.name ??
            profile.sub,
        },
      });

      return true;
    },
    async session({ session, token }) {
      if (token.sub) {
        const dbUser = await prisma.user.findUnique({
          where: { keycloakId: token.sub },
          select: { id: true, username: true },
        });
        if (dbUser) {
          session.user.id = dbUser.id;
          session.user.name = dbUser.username;
        }
      }
      return session;
    },
    async jwt({ token, profile }) {
      if (profile?.sub) token.sub = profile.sub;
      return token;
    },
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
});

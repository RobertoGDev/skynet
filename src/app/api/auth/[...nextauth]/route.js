import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { verifyUser } from '../../../../db/dbInit';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Skynet Access Portal',
      credentials: {
        username: { 
          label: "Identificador", 
          type: "text", 
          placeholder: "TECH-COM ID" 
        },
        password: { 
          label: "Código de acceso", 
          type: "password",
          placeholder: "CÓDIGO DE ACCESO" 
        }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        // Verificar credenciales contra la base de datos
        const user = verifyUser(credentials.username, credentials.password);
        
        if (!user) {
          console.log('Credenciales inválidas');
          return null;
        }
        
        return {
          id: user.id.toString(),
          name: user.username,
          rank: user.rank,
          accessLevel: user.accessLevel
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Si el usuario acaba de iniciar sesión, añadir datos adicionales al token
      if (user) {
        token.rank = user.rank;
        token.accessLevel = user.accessLevel;
      }
      return token;
    },
    async session({ session, token }) {
      // Añadir datos adicionales al objeto de sesión
      session.user.id = token.sub;
      session.user.rank = token.rank;
      session.user.accessLevel = token.accessLevel;
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 60, // 30 minutos
  },
  secret: process.env.NEXTAUTH_SECRET || 'skynet-terminator-resistance-secret-key',
})

export { handler as GET, handler as POST };
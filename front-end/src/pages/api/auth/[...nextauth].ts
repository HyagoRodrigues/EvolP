import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

// Banco de dados temporário
const users = [
  {
    id: '1',
    email: 'admin@evolp.com',
    password: bcrypt.hashSync('123456', 10),
    name: 'Administrador',
    role: 'admin'
  }
]

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Credenciais incompletas')
          }

          const user = users.find(user => user.email === credentials.email)
          
          if (!user) {
            throw new Error('Usuário não encontrado')
          }

          const isValid = await bcrypt.compare(credentials.password, user.password)
          
          if (!isValid) {
            throw new Error('Senha incorreta')
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          }
        } catch (error) {
          throw new Error(error.message)
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub
        session.user.role = token.role
        session.user.email = token.email
      }
      return session
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  }
}

export default NextAuth(authOptions)
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (credentials?.email === "admin@evolp.com" && credentials?.password === "123456") {
          return {
            id: "1",
            email: credentials.email,
            name: "Administrador"
          };
        }
        return null; // Retorna null em caso de falha
      }
    })
  ],
  pages: {
    signIn: '/login', // Página de login personalizada
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Redireciona para /dashboard após o login
      if (url.startsWith("/dashboard")) return url;
      return baseUrl;
    },
  },
});
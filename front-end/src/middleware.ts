import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export const config = {
  matcher: [
    "/cadastrar-paciente",
    "/pacientes/:path*",
    "/evolucoes/:path*",
    "/dashboard",
  ],
};
import { SessionProvider, useSession } from 'next-auth/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import type { AppProps } from 'next/app';
import { theme } from '../styles/theme';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { NursingProvider } from '../contexts/NursingContext';

function MyApp({ Component, pageProps: { session: pageSession, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={pageSession}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NursingProvider>
          <AuthWrapper>
            <Component {...pageProps} />
          </AuthWrapper>
        </NursingProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}

// Componente de wrapper para usar o `useSession` corretamente
function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    const publicRoutes = ['/login', '/register'];
    const isPublicRoute = publicRoutes.includes(router.pathname);

    if (!session && !isPublicRoute) {
      router.push('/login');
    } else if (session && isPublicRoute) {
      router.push('/pacientes');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <div>Carregando...</div>; // Você pode criar um componente de loading mais elaborado
  }

  return <>{children}</>;
}

export default MyApp;
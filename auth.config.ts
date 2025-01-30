import { NextAuthConfig } from 'next-auth';
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }): any {
      const isLoogedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnLoginPage = nextUrl.pathname === '/login';

      // Avoid infinite loop if on login page and not logged in
      if (isOnLoginPage && !isLoogedIn) {
        return true;
      }

      // Logged in and on dashboard
      if (isLoogedIn && isOnDashboard) {
        return true;
        // Logged in and not on dashboard
      } else if (isLoogedIn && !isOnDashboard) {
        // Whenever logged, should redirect to dashboard
        return Response.redirect(new URL('/dashboard', nextUrl).toString());
        // RUns whenerver not logged in
      } else if (!isLoogedIn && isOnDashboard) {
        return Response.redirect(new URL('/login', nextUrl).toString());
      }

      // Other cases, continue to the page requested
      return true;
    },
  },
} satisfies NextAuthConfig;

import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

// .auth: Accesses the auth property of the object returned by NextAuth(). As we know, this property is a function that allows you to get the current session on the server.

export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};

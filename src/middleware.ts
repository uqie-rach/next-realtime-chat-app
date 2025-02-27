import { getToken } from 'next-auth/jwt';
import { NextRequestWithAuth, withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

/**
 * Middleware to protect routes
 */
export default withAuth(
  // Middleware function to run before the request is processed
  async function middleware(req: NextRequestWithAuth) {
    const pathname = req.nextUrl?.pathname;

    // Route protection
    const isAuth = await getToken({ req })

    console.log('[middleware] isAuth', isAuth)
    const isLoginPage = pathname === '/login' || pathname.startsWith('/login')

    const protectedRoutes = ['/dashboard']
    const isAccessingProtectedRoute = protectedRoutes.some(route => pathname?.startsWith(route))

    /**
     * When accessing login page, redirect to dashboard
     */
    if (isLoginPage) {

      // When authenticated, redirect to dashboard
      if (isAuth)
        return NextResponse.redirect(new URL('/dashboard', req.url))

      // When accessing protected routes and not authenticated,
      return NextResponse.next()
    }

    /**
     * When accessing protected routes and not authenticated,
     * redirect to login page
     */
    if (!isAuth && isAccessingProtectedRoute)
      return NextResponse.redirect(new URL('/login', req.url))

    /**
     * WHen authenticated and accessing root path,
     * redirect to dashboard
     */
    if (pathname === '/')
      return NextResponse.redirect(new URL('/dashboard', req.url))
  },
  {
    callbacks: {
      async authorized() {
        return true
      }
    }
  }
)

export const config = {
  matcher: ['/', '/login', '/dashboard/:path*']
}

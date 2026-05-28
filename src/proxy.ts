import { NextRequest, NextResponse } from 'next/server';

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect /admin routes (except /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const auth = req.cookies.get('rokko_admin')?.value;
    if (auth !== process.env.ADMIN_PASSWORD) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = '/admin/login';
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect admin API routes (except the auth route itself)
  if (pathname.startsWith('/api/admin') && pathname !== '/api/admin/auth') {
    const auth =
      req.cookies.get('rokko_admin')?.value ??
      req.headers.get('x-admin-key') ?? '';
    if (auth !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const proxyConfig = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};

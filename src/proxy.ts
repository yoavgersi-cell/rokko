import { NextRequest, NextResponse } from 'next/server';

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Admin protection temporarily disabled

  return NextResponse.next();
}

export const proxyConfig = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};

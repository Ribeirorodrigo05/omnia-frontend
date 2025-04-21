import { NextResponse, type NextRequest } from "next/server";

const publicRoutes = [
  {
    path: "/login",
  },
  {
    path: "/sign-up",
  },
];

export function middleware(request: NextRequest) {
  const isPublicRoute = publicRoutes.find(
    (route) => request.nextUrl.pathname === route.path
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get("auth_token")?.value;

  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

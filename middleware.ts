import { NextResponse, type NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

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

  try {
    const decoded: { exp?: number } = jwtDecode(token);
    if (!decoded.exp || Date.now() >= decoded.exp * 1000) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      const response = NextResponse.redirect(url);
      response.cookies.set("auth_token", "", {
        expires: new Date(0),
        path: "/",
      });
      return response;
    }
    // Se o usuário acessar / e estiver autenticado com token válido, redireciona para /home
    if (request.nextUrl.pathname === "/") {
      const url = request.nextUrl.clone();
      url.pathname = "/home";
      return NextResponse.redirect(url);
    }
  } catch (error) {
    console.error("Token inválido:", error);
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    const response = NextResponse.redirect(url);
    response.cookies.set("auth_token", "", { expires: new Date(0), path: "/" });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

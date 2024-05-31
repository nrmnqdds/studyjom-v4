import { type NextRequest, NextResponse } from "next/server";

const unauthenticatedRoutes = ["/", "/browse"];

export async function middleware(request: NextRequest) {
  const cookie = request.cookies.get("studyjom-session");

  if (!cookie && !unauthenticatedRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

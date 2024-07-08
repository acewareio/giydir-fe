import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import acceptLanguage from "accept-language";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  cookieName,
  fallbackLanguage,
  languages,
} from "./services/i18n/config";

acceptLanguage.languages([...languages]);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)"],
};

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  if (
    req.nextUrl.pathname.indexOf("icon") > -1 ||
    req.nextUrl.pathname.indexOf("chrome") > -1
  ) {
    return NextResponse.next();
  }

  let language;
  if (req.cookies.has(cookieName)) {
    language = acceptLanguage.get(req.cookies.get(cookieName)?.value);
  }
  if (!language) {
    language = acceptLanguage.get(req.headers.get("Accept-Language"));
  }
  if (!language) {
    language = fallbackLanguage;
  }

  // Redirect if language in path is not supported
  if (
    !languages.some((loc) => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
    !req.nextUrl.pathname.startsWith("/_next")
  ) {
    return NextResponse.redirect(
      new URL(
        `/${language}${req.nextUrl.pathname}${req.nextUrl.search}`,
        req.url
      )
    );
  }

  if (req.headers.has("referer")) {
    const refererUrl = new URL(req.headers.get("referer") ?? "");
    const languageInReferer = languages.find((l) =>
      refererUrl.pathname.startsWith(`/${l}`)
    );
    const response = NextResponse.next();
    if (languageInReferer) {
      response.cookies.set(cookieName, languageInReferer);
    }

    return response;
  }

  const supabase = createMiddlewareClient({ req, res });

  const session = await supabase.auth.getUser();

  if (req.nextUrl.pathname.includes("/app") && !session) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if (req.nextUrl.pathname === `/${language}` && session) {
    return NextResponse.redirect(new URL("/app", req.url));
  }

  if (
    (req.nextUrl.pathname.includes("/sign-in") ||
      req.nextUrl.pathname.includes("/sign-up") ||
      req.nextUrl.pathname.includes("/forgot-password") ||
      req.nextUrl.pathname.includes("/password-change")) &&
    session
  ) {
    return NextResponse.redirect(new URL("/app", req.url));
  }

  return NextResponse.next();
}

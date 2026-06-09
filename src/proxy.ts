import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Exclude /cms, Next.js internals, and static files
  matcher: ["/((?!cms|_next|_vercel|opengraph-image|.*\\..*).*)"],
};

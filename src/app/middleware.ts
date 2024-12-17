
import { NextResponse, NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // The middleware can be used to log or handle the request, 
  // but we don't modify `bodyUsed` as it is read-only.
  if (req.nextUrl.pathname === "/webhook") {
    // Log request or perform any other necessary checks
    console.log("Webhook request received", req.method, req.url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/webhook",
};

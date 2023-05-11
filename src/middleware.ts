import { NextRequest, NextResponse } from "next/server";
import { ratelimit } from "./lib/rate-limiter";

export async function middleware() {

  try {
    const { success } =  await ratelimit.limit("Cache_token")
    if(!success) return new Response("You type tooo fast")
  } catch (error) {
    
  }
}

export const config = {
  matcher: '/api/message/:path*'
}
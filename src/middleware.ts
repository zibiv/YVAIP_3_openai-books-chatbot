import rateLimit from "@/utils/rate-limit"
import { APILimiterStream } from "@/lib/api-stream"
import { NextResponse } from "next/server"

const limiter = rateLimit({
  interval: 60 * 1000, // 60 секунд 
})

export async function middleware() {
    try {
      await limiter.check(4, 'CACHE_TOKEN') // на эти 60 секунд дается сделать 3 запроса
      //четвертый будет превышением и вернет rejected промис
      return NextResponse.next()
    } catch(err) {
      //генерируем поток чтения для имитации ответа OpenAI
      const stream = APILimiterStream()
      return new Response(stream)
    }
}

export const config = {
  matcher: '/api/message/:path*',
};
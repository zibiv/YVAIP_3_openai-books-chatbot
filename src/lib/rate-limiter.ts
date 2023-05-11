import { Ratelimit } from "@upstash/ratelimit"
import { redis } from "./redis";
export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(3, '70 s')
})
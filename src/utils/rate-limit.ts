import { LRUCache } from 'lru-cache'

type Options = {
  uniqueTokenPerInterval?: number
  interval?: number
}

export default function rateLimit(options?: Options) {
  //создаем объект кэша, который будет следить за числом запросов сделанным токеном, токе будет один единственный для всех запросов
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval ?? 1,
    ttl: options?.interval ?? 60000,
  })

  return {
    check: (limit: number, token: string) =>
      //получаем кол-во запросов которые можно обрабатывать и токен который будет использоваться как ключ при установки кэша
      new Promise<void>((resolve, reject) => {
        //пытаемся получить из кэша значение для этого токена
        const tokenCount = (tokenCache.get(token) as number[]) ?? [0]

        if (tokenCount[0] === 0) tokenCache.set(token, tokenCount)

        //увеличиваем кол-во полученных запросов по этому токену
        tokenCount[0] += 1

        //сравниваем превышен ли лимит
        const [currentUsage] = tokenCount
        const isRateLimited = currentUsage >= limit

        //если лимит превышен, то будет возвращен reject() который стригерит catch в route.ts
        return isRateLimited ? reject() : resolve()
      }),
  }
}
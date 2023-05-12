import { answers } from "@/helpers/constants/tooManyReq";

export function APILimiterStream() {
  const encoder = new TextEncoder()
  const indexForAnswer = Math.floor(Math.random() * answers.length)
  //используем рандомный индекс для получения ответа из массива ответов бота и ставим сигнал о том что поток сгенерирован нашим сервером
  const botAnswer = "💛" + answers[indexForAnswer]

  const stream = new ReadableStream({
    async start(controller) {
      await new Promise((resolve) => setTimeout(()=>resolve(""), 1000))
      for (const char of botAnswer) {
        //отправляем буквы из предложения с задержкой в поток чтения
        await new Promise((resolve) => setTimeout(()=>resolve(""), 80))
        controller.enqueue(encoder.encode(char))
      }

      controller.close()
    }
  })

  return stream
}
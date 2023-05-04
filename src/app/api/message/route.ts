import { chatbotPrompt } from "@/helpers/constants/chatbot-prompt"
import { ChatGPTMessage } from "@/lib/openai-stream"
import { MessageArray } from "@/lib/validators/message"

export async function POST(req: Request) {
  const { messages } = await req.json()
  //проверяем сообщение на соответствие схемы
  const parsedMessages = MessageArray.parse(messages)

  //формируем массив сообщений для ChatGPT
  const outboundMessages: ChatGPTMessage[] = parsedMessages.map(
    (parsedMessage) => ({
      role: parsedMessage.isUserMessage ? "user" : "system",
      content: parsedMessage.text,
    })
  )
  //сообщения идут в обратном порядке от самого нового с самому старому, поэтому сообщение с которого начнется диалог с ChatGPT должно идти первым
  outboundMessages.unshift({
    role: "system",
    //chatbotPrompt включает в себя начальное сообщение в котором перечислены настройки и контекст
    content: chatbotPrompt
  })
  //таймер, если время не прошло то выставить предупреждение и не направлять в чат бот сообщение

  console.log(outboundMessages)

  return new Response("Hello, Next.js!")
}

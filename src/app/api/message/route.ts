import { chatbotPrompt } from "@/helpers/constants/chatbot-prompt"
import { ChatGPTMessage, OpenAIStream, OpenAIStreamInterface } from "@/lib/openai-stream"
import { MessageArray } from "@/lib/validators/message"

export async function POST(req: Request) {
  const { messages } = await req.json()

  //проверяем сообщение на соответствие схемы
  try {
    var parsedMessages= MessageArray.parse(messages)
  } catch {
    return new Response("wrong schema", {status: 404})
  }

  // console.log("СООБЩЕНИЕ ОТ КЛИЕНТА", messages)

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

  // console.log("СООБЩЕНИЕ ДЛЯ OPENAI", outboundMessages)

  const payload: OpenAIStreamInterface = {
    model: "gpt-3.5-turbo",
    messages: outboundMessages,
    temperature: 0.3,
    frequency_penalty: 0.1,
    presence_penalty: -1,
    max_tokens: 500,
    //отправка потока данных
    stream: true,
    n: 1
  }

  const stream = await OpenAIStream(payload) //функция помощник которая возвращает поток данных  

  return new Response(stream)

}

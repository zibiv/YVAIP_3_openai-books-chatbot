import {createParser, ParsedEvent, ReconnectInterval} from 'eventsource-parser'

//тип описывающий кто является автором сообщения 
export type ChatGPTAgent = "user" | "system" | "assistant"

//формат сообщения которое получает OpenIA
export interface ChatGPTMessage {
  role: ChatGPTAgent,
  content: string 
}

export interface OpenAIStreamInterface {
  model: "gpt-3.5-turbo";
  messages: ChatGPTMessage[];
  temperature: number;
  frequency_penalty: number;
  presence_penalty: number;
  max_tokens: number;
  stream: boolean;
  n: number;
}

export async function OpenAIStream(payload: OpenAIStreamInterface) {
  //необходимо подготовить текст для того что бы отправить его в OpenAI API, текс должен быть перекодирован, а результат декодирован обратно в текст
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  let counter = 0

  //отправляет запрос в OpenAI API с сообщением
  const result = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify(payload),
  })

  //мы хотим создать поток чтения который мы отправим клиенту
  const stream = new ReadableStream({
    async start(controller) {
      //прасим результат ответа API через обработчик который передадим при создании парсера
      function onParse(event: ParsedEvent | ReconnectInterval) {
        if (event.type === "event") {
          const { data } = event

          //проверка что были получены все чанки - API присылает строку "[DONE]"
          if (data === "[DONE]") return controller.close()
          //пытаемся получить необходимые данные из чанка
          try {
            const json = JSON.parse(data)

            //получаем доступ к дельте чанка которая содержит часть сообщения
            const text = json.choices[0].delta?.content || " "

            //для того что бы не кодировать неполные строки, дожидаемся что бы было как минимум три чанка, либо имеющиеся два чанка не содержали символа начала новой строки
            if (counter < 2 && (text.match(/\n/) || []).length) return

            //кодируем чанк в массив целых чисел
            const queue = encoder.encode(text)
            //отправляем кодированный чанк в поток чтения
            controller.enqueue(queue)

            //увеличиваем счетчик чанков
            counter++
          } catch (error) {
            controller.error(error)
          }
        }
      }

      const parser = createParser(onParse)
      //получаем данные из потока чтения который представляет собой тело ответа
      for await (const chunk of result.body as any) {
        //передаем в парсер декодированные данные
        parser.feed(decoder.decode(chunk))
      }
    },
  })

  //возвращаем поток который представляет текст ответа в нашу API которая отправит поток клиенту
  return stream
}

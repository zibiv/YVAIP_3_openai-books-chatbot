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
  const stream = fetch('https://api.openai.com/v1/completions', {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    }
  })
}

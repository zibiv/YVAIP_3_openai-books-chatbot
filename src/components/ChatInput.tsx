"use client"
import { useMutation } from "@tanstack/react-query"
import { FC, HTMLAttributes, useState, useContext, useRef, Dispatch, SetStateAction } from "react"
import { cn } from "@/lib/utils"
import { Message } from "@/lib/validators/message"


import { nanoid } from "nanoid"
import TextareaAutosize from "react-textarea-autosize"
import { MessagesContext } from "@/context/messagesContext"
import Loader from "./ui/Loader"
import { CornerDownLeft } from "lucide-react"
import { toast } from "react-hot-toast"

interface ChatInputProps extends HTMLAttributes<HTMLDivElement> {
  statusLight: "green" | "yellow",
  setStatusLight: Dispatch<SetStateAction<"green" | "yellow">>
}

const ChatInput: FC<ChatInputProps> = ({ className, statusLight, setStatusLight, ...props }) => {
  const [input, setInput] = useState<string>("")
  const {
    messages,
    addMessage,
    removeMessage,
    updateMessage,
    isMessageUpdating,
    setIsMessageUpdating } = useContext(MessagesContext)
  const textAreaRef = useRef<null | HTMLTextAreaElement>(null)

  const toasterErrorId = "toasterErrorId"

  const {
    mutate: sendMessage,
    isLoading,
    isError,
    error,
  } = useMutation({
    mutationFn: async (message: Message) => {
      const reqController = new AbortController()
      const timeout = setTimeout(() => reqController.abort(), 30000);

      const response = await fetch("/api/message", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ messages: messages }),
        signal: reqController.signal
      })
      
      clearTimeout(timeout);

      if (response.ok) return response.body
      throw new Error('С ответом сервера что то не так.')
    },

    onMutate: (message) => {
      //оптимистическое добавление сообщения пользователя
      addMessage(message)
    },

    onError: (error: Error, message) => {
      if(error.name === "AbortError") {
        toast.error("Время ожидания ответа нашего сервера превышено. Попробуйте перезагрузить страницу или отправьте запрос позже.", {
          duration: 10000
        })
      } else {
        toast.error(error.message + " Обратитесь к администратору")
      }
      
      removeMessage(message.id)
      textAreaRef.current?.focus()
    },

    onSuccess: async (stream) => {
      if (!stream) return console.error("No stream found!")

      //принят ответ чат бота надо создать сообщение для нашего чата
      //присвоение id
      const id = nanoid()
      const responseMessage: Message = {
        id,
        isUserMessage: false,
        text: "",
      }

      addMessage(responseMessage)
      setIsMessageUpdating(true)

      const decoder = new TextDecoder()
      const reader = stream.getReader()

      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          break
        }
        //декодируя чанки добавляем их в текст сообщения бота
        const textChunk = decoder.decode(value)
        //💛 обозначает что ответ посылает наш сервер,а не передает ответ от OpenAI, меняем статус чата и ставим таймер что бы уведомить пользователя о том что он может продолжать общение с AI
        if(textChunk === "💛" ) {
          if( statusLight === "green"){
            setStatusLight("yellow")
            setTimeout(()=>setStatusLight("green"), 58000)
          }
        } else {
          updateMessage(id, (prevText) => prevText + textChunk)
        }
      }

      //после загрузки сообщения целиком
      setIsMessageUpdating(false)
      setInput("")

      setTimeout(() => {
        textAreaRef.current?.focus()
      }, 10)
    },
  })

  //функция формирования и передачи сообщения на отправку, используется по нажатию ввода + нажатию на значок клавиши в input сообщения 
  function handleSendingMessage() {
    //предотвращение отправки пустых сообщений, вывод оповещения в одном "тосте"
    if (input.trim() === "") return toast.error("Вы отправили пустое сообщение... Напишите что-то.", { id: toasterErrorId })
    const message = {
      id: nanoid(),
      isUserMessage: true,
      text: input,
    }
    
    if (!navigator.onLine) {
      toast.error("Вы находитесь офлайн, отправить сообщение боту не получится, проверьте свое соединение")
    }

    sendMessage(message)
  }

  return (
    <div className={cn("border-t border-zinc-300 ", className)} {...props}>
      <div className="relative mt-4 overflow-hidden rounded-lg border-none outline-none">
        <TextareaAutosize
          ref={textAreaRef}
          disabled={isLoading}
          rows={2}
          maxRows={4}
          autoFocus
          placeholder="введите вопрос..."
          className="peer disabled:opacity-50 pr-14 pl-4 resize-none block w-full border-0 bg-zinc-100 py-1.5 text-gray-800 focus:ring-0 text-sm sm:leading-6"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            //сообщение отправляется при нажатии одной клавиши enter, без нажатого шифта.
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()

              handleSendingMessage()
            }
          }}
        />

        <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5 items-end">
          <kbd className="inline-flex items-center rounded border bg-white border-gray-200 px-1 font-sans text-sx text-gray-400 shadow-sm h-6 w-6">
            {isLoading ? <Loader />  : <CornerDownLeft className="w-3 h-3 cursor-pointer" onClick={handleSendingMessage}/>}
          </kbd>
        </div>
        <div
          className="absolute inset-x-0 bottom-0 border-t border-gray-200 peer-focus:border-t-2 peer-focus:border-t-green-200"
          aria-hidden="true"
        />
      </div>
    </div>
  )
}
export default ChatInput

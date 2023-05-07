"use client"
import { useMutation } from "@tanstack/react-query"
import { FC, HTMLAttributes, useState, useContext, useRef } from "react"
import { cn } from "@/lib/utils"
import { Message } from "@/lib/validators/message"


import { nanoid } from "nanoid"
import TextareaAutosize from "react-textarea-autosize"
import { MessagesContext } from "@/context/messagesContext"

interface ChatInputProps extends HTMLAttributes<HTMLDivElement> {}

const ChatInput: FC<ChatInputProps> = ({ className, ...props }) => {
  const [input, setInput] = useState<string>("")
  const {
    messages,
    addMessage,
    removeMessage,
    updateMessage,
    isMessageUpdating,
    setIsMessageUpdating } = useContext(MessagesContext)
  const textAreaRef = useRef<null | HTMLTextAreaElement>(null)

  const {
    mutate: sendMessage,
    isLoading,
    isError,
    error,
  } = useMutation({
    mutationFn: async (message: Message) => {
      const response = await fetch("/api/message", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ messages: messages }),
      })
      if (response.ok) return response.body
    },

    onError: () => {
      console.log("Error")
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
        updateMessage(id, (prevText) => prevText + textChunk)
      }

      //после загрузки сообщения целиком
      setIsMessageUpdating(false)
      setInput("")

      setTimeout(() => {
        textAreaRef.current?.focus
      }, 10)
    },
  })

  return (
    <div className={cn("border-t border-zinc-300 ", className)} {...props}>

      <div className="relative mt-4 overflow-hidden rounded-lg border-none outline-none">
        <TextareaAutosize
          ref={textAreaRef}
          disabled={isMessageUpdating}
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

              const message = {
                id: nanoid(),
                isUserMessage: true,
                text: input,
              }

              sendMessage(message)
              addMessage(message)
            }

          }}
        />
      </div>
    </div>

  )
}

export default ChatInput

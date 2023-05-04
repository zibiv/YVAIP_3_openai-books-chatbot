"use client"
import { useMutation, useQuery } from "@tanstack/react-query"
import { FC, HTMLAttributes, useState } from "react"
//генерация уникальных id
import { nanoid } from "nanoid"
import { cn } from "@/lib/utils"
//инпут который может изменять свои размеры в зависимости от кол-ва текста
import TextareaAutosize from "react-textarea-autosize"
import { Message } from "@/lib/validators/message"

interface ChatInputProps extends HTMLAttributes<HTMLDivElement> {}

const ChatInput: FC<ChatInputProps> = ({ className, ...props }) => {
  const [input, setInput] = useState<string>("")

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
        body: JSON.stringify({ messages: [message] }),
      })
      if (response.ok) return response.body
    },
    onError: () => {

      console.log("Error")
    },
    onSuccess: () => {
      console.log("Success")
      setInput("")
    },

  })

  return (
    <div className={cn("border-t border-zinc-300 ", className)} {...props}>
      <div className="relative mt-4 overflow-hidden rounded-lg border-none outline-none">
        <TextareaAutosize
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
            }
          }}
        />
      </div>
    </div>
  )
}

export default ChatInput

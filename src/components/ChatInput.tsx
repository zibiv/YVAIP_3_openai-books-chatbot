"use client"
import { cn } from "@/lib/utils"
import { FC, HTMLAttributes, useState } from "react"
//инпут который может изменять свои размеры в зависимости от кол-ва текста
import TextareaAutosize from "react-textarea-autosize"

interface ChatInputProps extends HTMLAttributes<HTMLDivElement> {}

const ChatInput: FC<ChatInputProps> = ({ className, ...props }) => {
  const [input, setInput] = useState<string>("")
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
        />
      </div>
    </div>
  )
}

export default ChatInput

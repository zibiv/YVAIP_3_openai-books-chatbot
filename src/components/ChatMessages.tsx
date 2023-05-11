'use client'

import { MessagesContext } from "@/context/messagesContext"
import { cn } from "@/lib/utils"
import { FC, HTMLAttributes, useContext } from "react"
import MarkdownLite from "./MarkdownLite"

interface ChatMessagesProps extends HTMLAttributes<HTMLDivElement> {}

const ChatMessages: FC<ChatMessagesProps> = ({ className, ...props }) => {
  const { messages } = useContext(MessagesContext)
  
  //сообщения идут от самого старого, к самому новому, для рендеринга нам надо поменять все местами и начинать с самых свежих сообщений
  const invertedMessages = messages;

  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-3 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200",
        className
      )}
      {...props}
    >
      <div className="messagesFromChatMessages flex-1 space-y-2">
        {invertedMessages.map((message) => (
          <div key={message.id} className="chat-message">
            <div
              className={cn("flex items-center", {
                //сообщения от пользователя будут находится в крайнем правом положении
                "justify-end": message.isUserMessage,
              })}
            >
              <div
                className={cn(
                  "flex flex-col text-sm max-w-sm mx-2 overflow-x-hidden px-4 py-2 rounded-lg",
                  {
                    //сообщения от пользователя и чата будут иметь различный стиль
                    "bg-green-100 text-gray-900":
                      message.isUserMessage,
                    "bg-amber-100 text-gray-900":
                      !message.isUserMessage,
                  }
                )}
              >
                <MarkdownLite key={message.id} text={message.text}/>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ChatMessages

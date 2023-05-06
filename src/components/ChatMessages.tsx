'use client'

import { MessagesContext } from "@/context/messagesContext"
import { cn } from "@/lib/utils"
import { FC, HTMLAttributes, useContext } from "react"
import MarkdownLite from "./MarkdownLite"

interface ChatMessagesProps extends HTMLAttributes<HTMLDivElement> {}

const ChatMessages: FC<ChatMessagesProps> = ({ className, ...props }) => {
  const {
    messages,
    addMessage,
    removeMessage,
    updateMessage,
    isMessageUpdating,
    setIsMessageUpdating } = useContext(MessagesContext)
  
  //сообщения идут от самого старого, к самому новому, для рендеринга нам надо поменять все местами и начинать с самых свежих сообщений
  const invertedMessages = [...messages].reverse();

  //TODO зачем делать двойной реверс списка сообщений?
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-3 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-green-200",
        className
      )}
      {...props}
    >
      <div className="flex-1">
        {invertedMessages.map((message) => (
          <div key={message.id} className="chat-message">
            <div
              className={cn("flex items-center", {
                "justify-end": message.isUserMessage,
              })}
            >
              <div
                className={cn(
                  "flex flex-col space-y-2 text-sm max-w-xs mx-2 overflow-x-hidden rounded-lg p-2",
                  {
                    "bg-green-600 text-white":
                      message.isUserMessage,
                    "bg-blue-200 text-gray-900":
                      !message.isUserMessage,
                  }
                )}
              >
                <MarkdownLite text={message.text}/>
              </div>
            </div>
          </div>
        ))}
      </div>
      ChatMessages
    </div>
  )
}

export default ChatMessages

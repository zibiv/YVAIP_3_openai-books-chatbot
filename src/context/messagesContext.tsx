import { Message } from "@/lib/validators/message"
import { nanoid } from "nanoid"
import { createContext, useState, Dispatch, SetStateAction, FC, ReactNode } from "react"

interface MessageContextType {

    messages: Message[],
    isMessageUpdating: boolean,
    addMessage: (message: Message) => void,
    removeMessage: (id: string) => void,
    updateMessage: (id: string, updateFn: (prevText: string) => string) => void,
    setIsMessageUpdating: (isMessageUpdating: boolean) => void

}

export const MessagesContext = createContext<MessageContextType>({

  messages: [],
  isMessageUpdating: false,
  addMessage: () => {},
  removeMessage: () => {},
  updateMessage: () => {},
  setIsMessageUpdating: () => {}
  
})


export const MessagesArea: FC<{children: ReactNode}> = ({children}) => {
  const [isMessageUpdating, setIsMessageUpdating] = useState<boolean>(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: nanoid(),
      isUserMessage: false,
      text: "Как я могу вам помочь?",
    }
  ])

  //добавление сообщения из input, добавляет сообщение в массив сообщений который хранится в состоянии
  const addMessage: MessageContextType["addMessage"] = (message) => {
    setMessages([...messages, message])
  }

  //добавление сообщения пользователя происходит оптиместически, если что то пойдет не так сообщение надо удалить по id
  const removeMessage: MessageContextType["removeMessage"] = (id) => {
    setMessages(messages.filter((message) => message.id !== id)) //❌
  }

  //обновление сообщения когда мы получаем данные из OpenAI, данные будут постпуать по паре букв, таким образом их надо добавлять к имеющемуся сообщению, что бы получить целую строку
  const updateMessage: MessageContextType["updateMessage"] = (id, updateFn) => {
    setMessages((prev) =>
      prev.map((message) => {

        if (message.id === id) {
          //при совпадении id мы пересобираем объект и для свойства text запускаем CB с переданным действующим значением, которое и будет обновлено
          return {
            ...message,
            text: updateFn(message.text),
          }
        } 

        return message
      })
    )
  }

  return (
    <MessagesContext.Provider value={{
      messages,
      addMessage,
      removeMessage,
      updateMessage,
      isMessageUpdating,
      setIsMessageUpdating
    }}>
      {children}
    </MessagesContext.Provider>
  )

}

import { FC } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import ChatHeader from "./ChatHeader"
import ChatInput from "./ChatInput"
import ChatMessages from "./ChatMessages"

const Chat: FC = () => {
  return (
    <Accordion type="single" collapsible className=" z-50 shadow-sm fixed right-8 w-80 bottom-8 bg-white border border-gray-200 rounded-md overflow-hidden">
      <AccordionItem value="item-1">
        <div className="flex flex-col">
          <AccordionContent >
            <div className="flex flex-col h-80">
              <ChatMessages className="px-2 py-3 flex-1"/>
              <ChatInput className="px-4" />
            </div>
          </AccordionContent>
          {/* нижняя часть чата которая остается когда чат сворачивается */}
          <AccordionTrigger className="px-6 border-b border-zinc-300">
            <ChatHeader />
          </AccordionTrigger>
        </div>
      </AccordionItem>
    </Accordion>
    // </div>
  )
}

export default Chat

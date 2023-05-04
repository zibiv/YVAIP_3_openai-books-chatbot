import { FC } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import ChatHeader from "./ChatHeader"

const Chat: FC = () => {
  return (
    // <div className="fixed bottom-0 right-[5vw] w-[500px]">
    <Accordion type="single" collapsible className=" z-50 shadow-sm fixed right-8 w-80 bottom-8 bg-white border border-gray-200 rounded-md overflow-hidden">
      <AccordionItem value="item-1">
        <div className="flex flex-col">
          <AccordionContent >
            <div className="flex flex-col h-80 px-6">sadf</div>
            
          </AccordionContent>
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

'use client'

import { FC, useEffect, useState, useCallback } from "react"
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
  const [isDragging, setIsDragging] = useState(false)
  const [startY, setStartY] = useState(0)
  const [height, setHeight] = useState(320) // начальная высота чата

  //при отпускании мышки происходит выход из режима изменения размеров
  const handleMouseUp = useCallback (() => {
    setIsDragging(false)
  }, [])

  const handleMouseMove = useCallback((event: MouseEvent) => {
    console.log("🤓", height)
    if (isDragging) {
      //высота считается с верхней части окна вниз, если мы уменьшили размер окна то дельта будет положительной
      const deltaY = event.clientY - startY
      //новая высота считается как высота элемента - дельта, так как положительная дельта означает уменьшение окна
      const newHeight = height - deltaY
      //держим высоту чата в рамках
      if (newHeight >= 320 && newHeight <= window.innerHeight - 200) {
        setHeight(newHeight)
      } else if (newHeight < 320) {
        setHeight(320)
      } else {
        setHeight(window.innerHeight - 200)
      }
    } 
  }, [isDragging])

  useEffect(() => {
    
    if(!isDragging) return; //если мы выши из режима изменения размеров то ничего делать не надо
    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("mousemove", handleMouseMove)

    return () => {
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("mousemove", handleMouseMove)
    }
  }, [isDragging])

  const handleMouseDown = (event:  React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    //при нажатии мышкой на верхушку чата включается режим изменения размера и записывает высота на странице где произошло нажатие
    setIsDragging(true)
    setStartY(event.clientY)
  }

  //FIXME убрать подсветку при свернутом чате
  
  return (
    <Accordion type="single" collapsible className=" z-50 shadow-sm fixed right-8 w-80 bottom-8 bg-white border border-gray-200 rounded-md overflow-hidden">
      <AccordionItem value="item-1">
        <div className="top_dragger border-t-2 cursor-row-resize rounded-sm hover:border-t-green-200 " onMouseDown={handleMouseDown}/>
        <div className="flex flex-col">
        <AccordionContent >
            <div className="flex flex-col" style={{ height }}> 
              <ChatMessages className="px-2 py-3 flex-1" />
              <ChatInput className="px-4" />
            </div>
          </AccordionContent>
          {/* нижняя часть чата которая остается когда чат сворачивается */}
          <AccordionTrigger className="px-6 border-b border-zinc-300" onClick={() => setHeight(320)} >
            <ChatHeader />
          </AccordionTrigger>
        </div>
      </AccordionItem>
    </Accordion>
    // </div>
  )
}

export default Chat

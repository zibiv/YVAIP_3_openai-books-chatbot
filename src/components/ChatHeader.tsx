import { cn } from "@/lib/utils"
import { FC } from "react"

interface ChatHeaderProps {
  statusLight: "green"|"yellow"
}

const ChatHeader: FC<ChatHeaderProps> = ({ statusLight }) => {
  
  return (
    <div  className="flex flex-col items-start text-md">
      <div className="text-sm text-zinc-500">Чат</div>
      <div className="flex items-center  gap-2">
        <p className={cn("w-2 h-2 rounded-full", {
          "bg-green-500": statusLight === "green",
          "bg-yellow-200": statusLight === "yellow"
        })}/>
        <p className="font-medium">Bookwise поддержка</p>
      </div>
    </div>
  )
}

export default ChatHeader
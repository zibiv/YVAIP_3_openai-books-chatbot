import { FC } from "react"

const ChatHeader: FC = () => {
  
  return (
    <div  className="flex flex-col items-start text-md">
      <div className="text-sm text-zinc-500">Чат</div>
      <div className="flex items-center gap-2">
        <p className="w-2 h-2 bg-green-500 rounded-full"/>
        <p className="font-medium">Bookwise поддержка</p>

      </div>
    </div>
  )
}

export default ChatHeader
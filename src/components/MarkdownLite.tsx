//компонент рендерит контент сообщения используя разметку
import { FC } from "react"

interface MarkdownLiteProps {
  text: string
}

const MarkdownLite: FC<MarkdownLiteProps> = ({ text }) => {
  return <div>{text}</div>
}

export default MarkdownLite

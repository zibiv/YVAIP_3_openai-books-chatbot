//компонент рендерит контент сообщения используя разметку
import { FC } from "react"

interface MarkdownLiteProps {
  text: string
}

const MarkdownLite: FC<MarkdownLiteProps> = ({ text }) => {
  //чат бот использует markdown для формирования ссылки в виде [текст](сслыка), например [этой странице](https://books.toscrape.com/catalogue)
  //нам надо найти такую запись в тексте ответа и превратить ее в ссылку

  const linkRegex = /\[(.+?)\]\((.+?)\)/g
  const parts = []

  //индекс на котором находится последний элемент найденной разметки ссылки
  let lastIndex = 0
  let match

  //В цикле для каждого совпадения добавлются две части в массив под названием parts: часть свойства text до ссылки (если есть) и саму ссылку в виде элемента JSX, 
  //обернутого в тег <a> с соответствующими атрибутами. В цикле также обновляется переменная lastIndex, чтобы отслеживать, 
  //где закончилось последнее совпадение.
  while ((match = linkRegex.exec(text)) !== null) {
    //получаем массив в котором нас интересует значения двух групп захвата из текста который совпадает с искомым regex
    const [fullMatch, linkText, linkUrl] = match

    const matchStart = match.index //это индекс с которого началось совпадение с regex в строке
    const matchEnd = linkRegex.lastIndex //индекс на котором закончилась строка совпадающая с regex

    if (lastIndex < matchStart) {
      parts.push(text.slice(lastIndex, matchStart))
    }
    
    //так как этот чат эксперементальный ссылка находится за пределами нашего домена, поэтому используется <a>, а не <Link/>
    parts.push(
      <a
        rel="noopener noreferrer"
        href={linkUrl}
        target="_blank"
        className="text-green-500 hover:text-green-700"
      >
        {linkText}
      </a>
    )

    lastIndex = matchEnd
  }

  //остались ли какие-либо части свойства text после последней ссылки. Если да, то он добавляет их в массив parts.
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  //компонент возвращает элемент <div>, содержащий либо массив parts (если он не пуст), либо исходное свойство text (если ссылки не были найдены).
  return <div>{parts.length > 0 ? parts.map((part) => part) : text}</div>
}

export default MarkdownLite

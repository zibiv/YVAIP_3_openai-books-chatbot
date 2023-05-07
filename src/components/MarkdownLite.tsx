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

  let lastIndex = 0
  let match

  console.log(text)

  // TODO при обновлении сообщения этот компонент вызывается несколько раз, что приведет к вызову этого цикла так же несколько раз если в тексте будет ссылка в данном формате, можно прокинуть сюда состояние обновления сообщения, если оно перестало обновляться то вызывать цикл
  while ((match = linkRegex.exec(text)) !== null) {
      
      const [fullMatch, linkText, linkUrl] = match
      const matchStart = match.index //это индекс с которого началось совпадение с regex в строке
      const matchEnd = linkRegex.lastIndex//индекс на котором закончилась строка совпадающая с regex
      if(lastIndex < matchStart) {
        parts.push(text.slice(lastIndex, matchStart))
        // parts.push(<a href={linkUrl} target="_blank" className="text-gray-500">{linkText}</a>)
        // parts.push(text.slice(matchEnd,text.length))
      }
      //так как этот чат эксперементальный ссылка находится за пределами нашего домена, поэтому используется <a>, а не <Link/>
      parts.push(<a rel="noopener noreferrer" href={linkUrl} target="_blank" className="text-green-500 hover:text-green-700">{linkText}</a>)
      //обновляем индекс последнего совпадения, если у нас будет несколько ссылок в сообщении
      
      lastIndex = matchEnd
  }

  //оставшийся текст после последней ссылки добавляется в массив
  if(lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }
  
  const textResult = parts.length > 0 || text
  return <div>{parts.length > 0 ? parts.map(part => part) : text}</div>
}

export default MarkdownLite

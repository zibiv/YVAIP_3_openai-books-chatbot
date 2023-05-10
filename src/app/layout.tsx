import Chat from "@/components/Chat"
import "./globals.css"
import { Inter } from "next/font/google"
import Providers from "@/components/Providers"
import { Toaster } from "react-hot-toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Bookwise: Искусственный интеллект для книголюбов",
  description:
    "Открой для себя новые миры литературы - задавай вопросы нашему чат-боту с нейросетью!",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Chat />
          {children}
          <Toaster position="bottom-right"/>
        </Providers>
      </body>
    </html>
  )
}

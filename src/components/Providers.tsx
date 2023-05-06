"use client"

import { FC, ReactNode } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { MessagesArea, MessagesContext } from "@/context/messagesContext"

const queryClient = new QueryClient()

interface ProvidersProps {
  children?: ReactNode
}

const Providers: FC<ProvidersProps> = ({ children }) => {
  return (
    <MessagesArea>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools />
      </QueryClientProvider>
    </MessagesArea>
      

      
  )
}

export default Providers

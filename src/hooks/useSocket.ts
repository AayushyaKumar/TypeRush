"use client"
import { useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"

// singleton — one connection for the whole app
let globalSocket: Socket | null = null

function getSocket(): Socket {
  if (!globalSocket) {
    globalSocket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000",
      {
        transports: ["websocket"],
        autoConnect: true,
      }
    )
  }
  return globalSocket
}

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const socket = getSocket()

    const onConnect    = () => setIsConnected(true)
    const onDisconnect = () => setIsConnected(false)

    socket.on("connect",    onConnect)
    socket.on("disconnect", onDisconnect)

    // Defer synchronization to avoid cascading renders inside the effect body
    if (socket.connected !== isConnected) {
      const timer = setTimeout(() => {
        setIsConnected(socket.connected)
      }, 0)
      return () => {
        clearTimeout(timer)
        socket.off("connect",    onConnect)
        socket.off("disconnect", onDisconnect)
      }
    }

    return () => {
      socket.off("connect",    onConnect)
      socket.off("disconnect", onDisconnect)
    }
  }, [isConnected])

  return { socket: getSocket(), isConnected }
}
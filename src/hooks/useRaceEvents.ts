"use client"
import { useEffect } from "react"
import { Socket } from "socket.io-client"
import { useRaceStore } from "@/store/raceStore"

export function useRaceEvents(socket: Socket | null) {
  const {
    setPlayers, setStatus, setPassage,
    setCountdown, setRoomCode, setFinalResults,
    setClosedReason, setInfoMessage,
  } = useRaceStore()

  useEffect(() => {
    if (!socket) return

    // full room state on join
    socket.on("room_state", ({ roomCode, passage, status, players }) => {
      setRoomCode(roomCode)
      setPassage(passage)
      setStatus(status)
      setPlayers(players)
    })

    // someone joined or updated their ready state
    socket.on("room_update", ({ players }) => {
      setPlayers(players)
    })

    // 3..2..1 countdown ticks
    socket.on("countdown", ({ secondsLeft }) => {
      setStatus("countdown")
      setCountdown(secondsLeft)
    })

    // race is live
    socket.on("race_start", ({ passage, startedAt }) => {
      setPassage(passage)
      setStatus("active")
      setCountdown(null)
      setInfoMessage(null)
    })

    // a player crossed the finish line
    socket.on("player_finished", ({ userId, placement, wpm }) => {
      // room_update follows immediately with updated players
    })

    // race over — all results
    socket.on("race_end", ({ results }) => {
      setStatus("finished")
      setFinalResults(results)
      setPlayers(results)
      setInfoMessage(null)
    })

    // room was closed by server (idle timeout, etc.)
    socket.on("room_closed", ({ reason }) => {
      setClosedReason(reason)
    })

    // informational messages (player disconnected, you win, etc.)
    socket.on("room_info", ({ message }) => {
      setInfoMessage(message)

      // auto-clear after 8 seconds
      setTimeout(() => {
        setInfoMessage(null)
      }, 8000)
    })

    // server error
    socket.on("error", ({ code, message }) => {
      console.error(`Socket error [${code}]: ${message}`)
      // For room-level errors, close the room on client
      if (code === "RACE_IN_PROGRESS" || code === "ROOM_FULL") {
        setClosedReason(message)
      }
    })

    return () => {
      socket.off("room_state")
      socket.off("room_update")
      socket.off("countdown")
      socket.off("race_start")
      socket.off("player_finished")
      socket.off("race_end")
      socket.off("room_closed")
      socket.off("room_info")
      socket.off("error")
    }
  }, [socket])
}
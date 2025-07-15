import React, { useEffect, useState } from 'react'
import Square from './square'
import patterns from '../resources/winningPatterns'
import { useChannelStateContext, useChatContext } from 'stream-chat-react'

const Board = () => {
  const { channel } = useChannelStateContext()
  const { client } = useChatContext()
  const [gameState, setGameState] = useState({state: "valid", winner: "none"});
  const [values, setValues] = useState(Array(9).fill(" "))
  const [player, setPlayer] = useState("X")
  const [turn, setTurn] = useState("X");

  const handleClick = async (idx) => {
    if(player === turn && values[idx] === " " && gameState.state === "valid"){
      // If the move is valid, change the turn to other player
      const nextPlayer = turn === "X" ? "O" : "X";
      setTurn(nextPlayer)

      // Send the event to other player
      await channel.sendEvent({
        type: "game-move",
        data: {idx, player}
      })

      // Change the board for us
      setValues(values.map((value, index) => {
        if(index === idx && value === " "){
          return player
        }
        return value
      }))
    }
  }

  // When the other player make a move, an event is triggered
  channel.on((event) => {
    if(event.type === "game-move" && event.user.id !== client.userID){
      const currentPlayer = event.data.player === "X" ? "O" : "X"
      setPlayer(currentPlayer)
      setTurn(currentPlayer)

      setValues(values.map((value, index) => {
        if(index === event.data.idx && value === " "){
          return event.data.player 
        }
        return value
      }))
    }
  })

  // When a player wins, an event is triggered by them
  channel.on((event) => {
    if(event.type === "game-status" && event.user.id !== client.userID){
      setGameState({state: event.state, winner: event.player})
    }
  })

  const checkWinPattern = () => {
    for(const pattern of patterns){
      if(
        (values[pattern[0]] === player &&
        values[pattern[1]] === player &&
        values[pattern[2]] === player
        )
      ) {
        return true
      }
    }
    return false
  }
  const checkTied = () => {
    for (const value of values) {
      if (value === " ") {
        return false;
      }
    }
    return true;
  }

  // Every time the values change (we made a move or did the other player), re-render the component
  useEffect(() => {
    if(checkWinPattern()){
      setGameState({state: "won", winner: player})
      const setGameStatus = async () => {
        await channel.sendEvent({
          type: "game-status",
          state: "won",
          player: player
        })
      }
      setGameStatus()
    } else if (checkTied()) {
      setGameState({state: "tied", winner: "none"})
    }
  }, [values])

  return (
    <div className='flex flex-col items-center'>
        {gameState.state === "won" && gameState.winner === player ? (
          <h1 className='text-3xl'>You Won, Congratulations!!</h1>
        ) : gameState.state === "won" ? (
          <h1 className='text-3xl'>Best luck next time, try your revenge</h1>
        ) : gameState.state === "tied" ? (
          <h1 className='text-3xl'>The game is Tied, play again</h1>
        ) : (
          null
        )}
        <br />
        <div className='flex'>
            {
              values.slice(0, 3).map((value, idx) => (
                <Square key={idx} value={value} onClick={() => handleClick(idx)} />
              ))
            }
        </div>

        <div className='flex'>
            {
              values.slice(3, 6).map((value, idx) => (
                <Square key={idx} value={value} onClick={() => handleClick(idx + 3)} />
              ))
            }
        </div>

        <div className='flex'>
            {
              values.slice(6, 9).map((value, idx) => (
                <Square key={idx} value={value} onClick={() => handleClick(idx + 6)} />
              ))
            }
        </div>
    </div>
  )
}

export default Board

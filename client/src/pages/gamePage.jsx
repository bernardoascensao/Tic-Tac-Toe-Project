import React, { useState } from 'react'
import Board from '../components/board'
import ChatComponent from '../components/chatComponent'


const GamePage = () => {

  return (
    <div className='flex gap-3'>
        <Board />
        {/* <ChatComponent /> */}
    </div>
  )
}

export default GamePage
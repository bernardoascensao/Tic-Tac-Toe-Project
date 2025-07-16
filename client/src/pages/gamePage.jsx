import React, { useState } from 'react'
import Board from '../components/board'
import ChatComponent from '../components/chatComponent'


const GamePage = () => {

  return (
    <div className='flex flex-col md:flex-row items-center justify-center gap-4 p-4 h-[64vh]'>
        <Board />
        <ChatComponent />
    </div>
  )
}

export default GamePage
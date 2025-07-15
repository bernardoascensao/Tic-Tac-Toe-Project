import React from 'react'
import { Window, MessageList, MessageInput  } from 'stream-chat-react'

const ChatComponent = () => {
  return (
    <div className='bg-red-700'>
        <Window>
            {<MessageList disableDateSeparator hideDeletedMessages closeReactionSelectorOnClick messageActions={["react"/* , "delete"*/]}/> }
            <MessageInput noFiles/>
        </Window>
    </div>
  )
}


export default ChatComponent
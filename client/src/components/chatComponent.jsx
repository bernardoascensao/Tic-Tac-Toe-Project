import React from 'react'
import { Window, MessageList, MessageInput, ChannelHeader  } from 'stream-chat-react'
import { CustomInputComponent } from './costumMessageInput'


const ChatComponent = () => {
  return (
        <div className='w-96 h-full'> 
          <Window>
                <ChannelHeader />
                <MessageList hideDeletedMessages />

                <MessageInput noFiles />
          </Window>
        </div>
  )
}


export default ChatComponent
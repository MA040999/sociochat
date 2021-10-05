import React from 'react'
import './Chat.css'
import Message from './Message'
function Chat() {
    return (
        <div className='chat-container'>
            <Message/>
            <Message/>
            <Message/>
            <Message/>
            
            <input className='message-creator' type="text" placeholder='Message...' />
            
        </div>
    )
}

export default Chat

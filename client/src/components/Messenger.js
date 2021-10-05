import './Messenger.css'
import React, { useRef } from 'react'
import { io } from 'socket.io-client'
import Chat from './Chat'

function Messenger() {
    const socket = useRef(io('http://localhost:4000'))
    
    
    return (
        <div className='container'>
            <div style={{flex: 0.5, backgroundColor: 'black', color: 'white'}}>
                asdasdasd
            </div>
            <Chat/>
            <div style={{flex: 0.5, backgroundColor: 'black', color: 'white'}}>
                asd
            </div>
        </div>
        
    )
}

export default Messenger

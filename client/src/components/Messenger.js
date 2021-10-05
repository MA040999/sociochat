import './Messenger.css'
import React, { useRef } from 'react'
import { io } from 'socket.io-client'

function Messenger() {
    const socket = useRef(io('http://localhost:4000'))
    
    
    return (
        <div className='container'>
            <div>
                asd
            </div>
            <div>
                asd
            </div>
            <div>
                asd
            </div>
        </div>
        
    )
}

export default Messenger

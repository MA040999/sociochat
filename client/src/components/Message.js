import React from 'react'

function Message({own}) {
    return (
        <div className={`message ${own === true ? 'own' : ''}`}>
            <div className='line-one'>
                <img src="/logo192.png" alt="" />
                <div className='message-container'>
                    ashdkjsa hakjsdjkahs hdashdkjsa hakjsdjkahs hdaskjdaskjdhsa asdahsd ajkhdssadash kjahsdkjahs kjahsdaskjdaskjdhsa asdahsd ajkhdssadash kjahsdkjahs kjahsdkhas j jahsdsjdkjsahdkjsahd kjasakjhdsjsadj hakjsdkjasdkjsajhdaskjdasj
                </div>
            </div>
            <div className='date'>3 hours ago</div>
        </div>
    )
}

export default Message

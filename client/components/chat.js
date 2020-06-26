import io from 'socket.io-client'
import { useState, useEffect } from 'react';

function useSocket(url) {
    const [socket, setSocket] = useState(null)
    useEffect(() => {
      const socketIo = io(url)
      setSocket(socketIo)
      function cleanup() {
        socketIo.disconnect()
      }
      return cleanup
    }, [])
    return socket
  }

export default function Chat(){
    const socket = useSocket('http://localhost:3030')
    useEffect(() => {
        function handleEvent(data) {
            console.log(data) 
          }
        if (socket) {
            socket.on('chat', handleEvent)
            socket.emit('chat message', {chat: 'data'})
          }
        }, [socket])
    return(
        <></>
    );
}
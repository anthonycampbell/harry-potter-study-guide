//import io from 'socket.io-client'
import { useState, useEffect } from 'react';
/*
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
  }*/

export default function Chat({friend}){
    //const socket = useSocket('http://localhost:3030')
    const [showChatBox, setChatBox] = useState(false)
    /*useEffect(() => {
        function handleEvent(data) {
            console.log(data) 
          }
        if (socket) {
            socket.on('chat', handleEvent)
            //socket.emit('chat message', {chat: 'data'})
          }
        }, [socket])*/
    function toggleChatBox(e){
      setChatBox(!showChatBox)
    }
    function send(){
      //socket.emit('chat message', {chat: 'data'})
    }
    const ChatBox = () => (
      <div>
        <button onClick={toggleChatBox}></button>
        <textarea>
        </textarea>
      </div>
    )
    return(
      <>
        <button onClick={toggleChatBox}>{friend}</button>
        { showChatBox ? <ChatBox /> : null}
      </>
    );
}
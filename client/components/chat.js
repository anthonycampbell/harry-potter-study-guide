import { useState, useEffect, useRef } from 'react';
import { auth } from '../utils/authenticate';
import io from 'socket.io-client'

function useSocket(url, friend) {
  const [socket, setSocket] = useState(null)
  useEffect(() => {
    const socketIo = io(url)
    socketIo.emit('newChat', friend.id)
    setSocket(socketIo)
    function cleanup() {
      socketIo.disconnect()
    }
    return cleanup
  }, [])
  return socket
}

function ChatBox({socket, friend, chat}){
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const messagesEndRef = useRef(null)
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView()
  }

  useEffect(() => {
    function handleEvent(data) {
      setMessages(oldMessages => [...oldMessages, data])
    }
    if (socket) {
        socket.on('newMessage', handleEvent)
      }
    }, [socket])

  useEffect(scrollToBottom)

  function send(e){
    e.preventDefault()
    console.log(friend)
    console.log(chat.id)
    var msg = {message: message, id: friend, chat: chat.id}
    socket.emit('message', msg)
    setMessage("")
  }
  return (
    <div>
      <div style={{ height: '250px',
                    width: '200px',
                    border: '1px solid black',
                    overflow: 'auto'}} >
        {messages.map((v,i) => {
          return  <div key={i}>{v}</div>
        })}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={send} >
        <input type='text' value={message} onChange={e => setMessage(e.target.value)}/>
        <input type='submit' value='send'/>
      </form>
    </div>
  );
}

export default function Chat({friend}){
    const [showChatBox, setChatBox] = useState(false)
    const [chat, setChat] = useState({})
    const socket = useSocket('http://localhost:3030', friend)

    useEffect(() => {
      if (socket){
        socket.on('chat', (data) => setChat(data))
      }
    })
    
    async function toggleChatBox(e){
      setChatBox(!showChatBox)
      if (!showChatBox){
        let messages
        try {
          let res = await fetch('http://localhost:3030/chat',{
            method: 'POST',
            credentials: 'include',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({friend: friend.id})
          })
          messages = await res.text()
        } catch(error) {
          console.error(error)
        }
      }
    }
    return(
      <>
        <button onClick={toggleChatBox}>{friend.username}</button>
        { showChatBox ? <ChatBox socket={socket} friend={friend.id} chat={chat}/> : null}
      </>
    );
}
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
  
  useEffect(() => {
        async function getMessages(){
          try {
            let res = await fetch('http://localhost:3030/chat',{
              method: 'POST',
              credentials: 'include',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({friend: friend})
            })
            let json = await res.json()
            console.log(json.messages)
            setMessages(json.messages)
          } catch(error) {
            console.error(error)
          }
      }
      getMessages()
  }, [])

  useEffect( () => {if(messagesEndRef.current){messagesEndRef.current.scrollIntoView()}})

  function send(e){
    e.preventDefault()
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
          if (v.writer == friend){
            return <p style={{ maxWidth: '70%',
                               margin: '2px',
                               paddingLeft: '10px',
                               paddingRight: '10px',
                               paddingTop: '4px',
                               paddingBottom: '4px',
                               borderRadius: '10px',
                               backgroundColor: '#e6e6e6',
                               clear: 'both',
                               float: 'left'}} key={i}>
                                 {v.data}
                   </p>
          } else {
            return <p style={{ maxWidth: '70%',
                               margin: '2px',
                               paddingLeft: '10px',
                               paddingRight: '10px',
                               paddingTop: '4px',
                               paddingBottom: '4px',
                               borderRadius: '10px',
                               backgroundColor: 'dodgerblue',
                               color: 'white',
                               clear: 'both',
                               float: 'right'}}
                               key={i}>
                                 {v.data}
                   </p>
          }
        })}
        <div style={{clear: 'both'}} ref={messagesEndRef} ></div>
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
    const [messages, setMessages] = useState([]);

    useEffect(() => {
      if (socket){
        socket.on('chat', (data) => setChat(data))
      }
    })
    
    function toggleChatBox(e){
      setChatBox(!showChatBox)
    }
    return(
      <>
        <button onClick={toggleChatBox}>{friend.username}</button>
        { showChatBox ? <ChatBox socket={socket} friend={friend.id} chat={chat}/> : null}
      </>
    );
}
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

function ChatBox({socket, friend, chat, openChats, index, setOpenChats}){
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const messagesEndRef = useRef(null)
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView()
  }

  useEffect(() => {
    function handleEvent(data) {
      console.log('data', data)
      setMessages(oldMessages => [...oldMessages, data])
    }
    if (socket) {
        socket.on('newMessage', handleEvent)
      }
  }, [socket])
  
  useEffect(() => { 
        let mounted = true
        async function getMessages(){
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
            let json = await res.json()
            if (mounted){
              setMessages(json.messages)
            }
          } catch(error) {
            console.error(error)
          }
      }
      getMessages()
      return () => mounted = false
  }, [])

  useEffect( () => {if(messagesEndRef.current){messagesEndRef.current.scrollIntoView()}})

  function send(e){
    e.preventDefault()
    var msg = {message: message, id: friend.id, chat: chat.id}
    socket.emit('message', msg)
    setMessage("")
  }
  function chatBoxOff(e) {
    var swap = [... openChats].fill(false)
    swap.splice(index, 1, false)
    setOpenChats(swap)
  }
  return (
    <div style={{position: 'fixed', 
                 left: '0',
                 bottom: '0',
                 margin: '5px',
                 textAlign: 'center'}}>
      <button style={{width: '200px'}}
              onClick={chatBoxOff}>
                     {friend.username}
      </button>
      <div style={{ height: '250px',
                    width: '200px',
                    border: '1px solid black',
                    overflow: 'auto'}} >
        {messages.map((v,i) => {
          if (v.writer == friend.id){
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
        <input style={{width: '152px'}} type='text' value={message} onChange={e => setMessage(e.target.value)}/>
        <input style={{width: '40px'}} type='submit' value='send'/>
      </form>
    </div>
  );
}

export default function Chat({friend, openChats, index, setOpenChats}){
    const [chat, setChat] = useState({})
    const socket = useSocket('http://localhost:3030', friend)

    useEffect(() => {
      if (socket){
        socket.on('chat', (data) => setChat(data))
      }
    })
    
    function toggleChatBox(e){
      var swap = [... openChats].fill(false)
      swap.splice(index, 1, true)
      setOpenChats(swap)
    }
    return(
      <>
        <button style={{width:'100%',
                        paddingTop: '5px',
                        paddingBottom: '5px'}}
                        onClick={toggleChatBox}>
                          {friend.username}
        </button>
        { openChats[index] ? <ChatBox socket={socket} friend={friend} chat={chat} openChats={openChats} index={index} setOpenChats={setOpenChats}/> : null}
      </>
    );
}
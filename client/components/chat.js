import { useState, useEffect } from 'react';

function ChatBox({socket}){
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])

  useEffect(() => {
    function handleEvent(data) {
      setMessages(oldMessages => [...oldMessages, data])
    }
    if (socket) {
        socket.on('chat', handleEvent)
      }
    }, [socket])

  function send(e){
    e.preventDefault()
    socket.emit('message', message)
    setMessage("")
  }
  return (
    <form onSubmit={send}>
      {messages.map((v,i) => {
        return  <li key={i}>{v}</li>
        })}
      <input type='text' value={message} onChange={e => setMessage(e.target.value)}/>
      <input type='submit' value='send'/>
    </form>
  );
}

export default function Chat({friend, socket}){
    const [showChatBox, setChatBox] = useState(false)
    
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
        { showChatBox ? <ChatBox socket={socket}/> : null}
      </>
    );
}
import Link from 'next/link'
import Router from 'next/router';
import Chat from './chat';

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

export default function Friends({ friends, friendRequests }){
    const [input, setInput] = useState({})
    const socket = useSocket('http://localhost:3030')
    const [showChatBox, setChatBox] = useState(false)
    useEffect(() => {
        function handleEvent(data) {
            console.log(data) 
          }
        if (socket) {
            socket.on('chat', handleEvent)
            //socket.emit('chat message', {chat: 'data'})
          }
        }, [socket])

    function handleChange(event){
        setInput({ ...input, [event.target.name]: event.target.value })
    }

    async function addFriend(event){
        event.preventDefault()
        fetch('http://localhost:3030/friendRequests', {
            method: 'POST',
            headers: { 
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(input)
        }).then(res => res.text())
          .catch(err => console.error(err))
          .then(data =>{
              console.log(data)
          })
        Router.reload()
    }

    async function processRequest(event, id){
        let response = {'answer': event.target.innerText, 'requester': id}
        fetch('http://localhost:3030/processFriendRequest', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(response)
        }).then(res => res.text())
          .catch(err => console.error(err))
          .then(data => {
              console.log(data)
          })
          Router.reload()
    }
    
    return (
        <>
            <form onSubmit={addFriend}>
                <input type='text' name='friend' placeholder='email' required onChange={handleChange}/>
                <input type='submit' value='Add Friend'/>
            </form>
            Friends:
            {friends.map((v, i) => {
                return (
                    <div key={i}>
                        <Chat friend={v}/>
                    </div>
                )
            })}
            Friend Requests:
            { friendRequests.map((v,i) => {
                return (
                    <div key={i}>
                        {v.username}
                        <button onClick={(e) => processRequest(e, v.id)}>Accept</button>
                        <button onClick={(e) => processRequest(e, v.id)}>Decline</button>
                    </div>
                )
            }) }
        </>
    );
}
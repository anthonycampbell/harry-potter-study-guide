import Link from 'next/link';
import Router from 'next/router';
import Chat from './chat';
import { useState, useEffect } from 'react';

export default function Friends({ friends, friendRequests }){
    const [openChats, setOpenChats] = useState(new Array(Object.keys(friends).length).fill(false))
    const [input, setInput] = useState({})

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

            <div style={{ position: 'fixed',
                          height: '100%',
                          backgroundColor: '#e6e6e6',
                          right: '0',
                          top: '0',
                          width: '250px'
                          }}>
                <div style={{ borderBottom: 'solid black 1px'}}>
                    <h4 style={{ textAlign: 'center' }}>Friend Requests</h4>
                    { friendRequests.map((v,i) => {
                        return (
                            <div key={i}>
                                {v.username}
                                <button onClick={(e) => processRequest(e, v.id)}>Accept</button>
                                <button onClick={(e) => processRequest(e, v.id)}>Decline</button>
                            </div>
                        )
                    }) }
                </div>
                <h4 style={{ textAlign: 'center' }}>Friends</h4>
                {Object.keys(friends).map((id, i) => {
                    return (
                        <div key={i}>
                            <Chat friend={{ 'username': friends[id],
                                            'id': id }} openChats={openChats} index={i} setOpenChats={setOpenChats}/>
                        </div>
                    )
                })}
            </div>
        </>
    );
}
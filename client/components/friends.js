import Link from 'next/link'
import { useState } from 'react';
import Router from 'next/router';
export default function Friends({ friends, friendRequests }){
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
            Friends:
            { friends.map((v,i) => {
                return <div key={i}>{v}</div>
            }) }
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
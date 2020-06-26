import Link from 'next/link'
import { useState } from 'react';
export default function Friends({ friends }){
    const [input, setInput] = useState({})

    function handleChange(event){
        setInput({ ...input, [event.target.name]: event.target.value })
    }

    async function addFriend(event){
        event.preventDefault()
        fetch('http://localhost:3030/friends', {
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

    return (
        <>
            <form onSubmit={addFriend}>
                <input type='text' name='friend' placeholder='email' required onChange={handleChange}/>
                <input type='submit' value='Add Friend'/>
            </form>
            { friends.map((v,i) => {
                return <div key={i}>{v}</div>
            }) }
        </>
    );
}
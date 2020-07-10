import Logout from '../components/logout'
import Chat from '../components/chat'
import Friends from '../components/friends'
import Link from 'next/link'
import { auth } from '../utils/authenticate'

export default function Index({ friends, friendRequests }){
  return (
    <>
      <h1>You are logged in!</h1>
      <Link href='/subject'><a>Subjects</a></Link>
      <Friends friends={friends} friendRequests={friendRequests}/>
      <Logout />
    </>
  );
}

export async function getServerSideProps(ctx){
  auth(ctx, '/', '/login')
  let friends = null
  let friendRequests = []
  try{
    let res = await fetch('http://localhost:3030/friends', {
      credentials: 'include',
      headers: ctx.req ? {cookie: ctx.req.headers.cookie} : undefined
    })
    let json = await res.json()
    friends = json.friends
  } catch(error) {
    console.error(error)
  }
  try{
    let res = await fetch('http://localhost:3030/friendRequests', {
      credentials: 'include',
      headers: ctx.req ? {cookie: ctx.req.headers.cookie} : undefined
    })
    let json = await res.json()
    friendRequests = json.requests
  } catch(error) {
    console.error(error)
  }
  return { props: {friendRequests: friendRequests, friends: friends } }
}
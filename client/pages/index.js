import Logout from '../components/logout'
import Link from 'next/link'
import { auth } from '../components/authenticate'

export default function Index(){
  return(
    <>
        <h1>You are logged in!</h1>
        <Link href='/subject'><a>Subjects</a></Link>
        <Logout />
    </>
  );
}

export async function getServerSideProps(ctx){ 
  return auth(ctx, '/login') 
}

/*export const getServerSideProps = async (ctx) => {
  let isLoggedIn
  try{
    let res = await fetch('http://localhost:3030/verify', {
      credentials: 'include',
      headers: ctx.req ? {cookie: ctx.req.headers.cookie} : undefined
    })
    isLoggedIn = await res.text()
  } catch(error) {
    console.error(error)
  }
  return { props: {isLoggedIn: isLoggedIn }}
}*/
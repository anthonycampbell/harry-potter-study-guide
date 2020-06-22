import Logout from '../components/logout'
import Link from 'next/link'
import { auth } from '../utils/authenticate'

export default function Index(){
  return (
    <>
      <h1>You are logged in!</h1>
      <Link href='/subject'><a>Subjects</a></Link>
      <Logout />
    </>
  );
}

export function getServerSideProps(ctx){
  auth(ctx, '/', '/login')
  return { props: { } }
}
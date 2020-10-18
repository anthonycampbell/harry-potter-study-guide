import Link from 'next/link'
import { auth } from '../utils/authenticate'
import { fetchUserData } from '../utils/fetchUserData'

export default function Index({ friends, friendRequests }){
  return (
    <>
      <Link href='/subject'><a>Subjects</a></Link>
    </>
  );
} 

export async function getServerSideProps(ctx){
  if (!auth(ctx, '/', '/login')){
    return { props: {}}
  }
  let userData = await fetchUserData(ctx)
  return { props: {friendRequests: userData.friendRequests, friends: userData.friends } }
}
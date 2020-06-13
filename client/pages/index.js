import Login from '../components/login'
import Home from '../components/home'

export default function Index({isLoggedIn}){
  return <Home />
}

export const getServerSideProps = async (ctx) => {
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
}
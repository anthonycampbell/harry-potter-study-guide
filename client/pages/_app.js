import Login from '../components/login'
import { useRouter } from 'next/router'
import Index from './index'

export default function App({ Component, pageProps }){
    const isLoggedIn = false
    const router = useRouter()
    const isRegister = router.pathname.startsWith('/register')
    return isLoggedIn ? 
        isRegister ? 
            <Index /> 
            :
             <Component {...pageProps} /> 
        : isRegister ?
            <Component {...pageProps} /> 
            :
            <Login />
}
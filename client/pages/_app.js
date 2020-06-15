import { useRouter } from 'next/router'
import Index from './index'
import AppContextProvider from '../components/appState'
import { parse } from 'cookie'
import App from 'next/app'
import Layout from '../components/layout'

export default function MyApp({ Component, pageProps }){
    return( 
        <Component {...pageProps} /> 
    );
}
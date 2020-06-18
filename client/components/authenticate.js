import { parse } from 'cookie'
import { Router } from 'next/router'

export function auth(ctx, location){
  const cookies = ctx.req.headers.cookie
  const parsedCookies = parse(cookies || '')
  const isLoggedIn = Boolean(parsedCookies['jwt'])
  const path = ctx.req.url
  if (!isLoggedIn && path != '/login' && path != '/register'){
    typeof window !== 'undefined'
      ? Router.push(location)
      : ctx.res.writeHead(302, { Location: location }).end()  
  } else if(isLoggedIn && (path == '/login' || path == '/register')){
    typeof window !== 'undefined'
      ? Router.push(location)
      : ctx.res.writeHead(302, { Location: location }).end()
  }
  return { props: { } }
}
  
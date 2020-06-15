import Link from 'next/link'
export default function Nav(){
    return (
        <div>
            <Link href="/login"><a>Login</a></Link>
            <br/>
            <Link href="/index"><a>Home</a></Link>
            <br/>
            <Link href="/register"><a>Register</a></Link>
        </div>
    );
}
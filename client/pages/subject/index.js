import Head from 'next/head'
import Link from 'next/link'
import useSWR from 'swr'
import React, {useState, useEffect} from 'react'

export default function Subject(){
    const [newFields, setNewFields] = useState([])
    const {data, error} = useSWR("http://localhost:3030/harry_potter_study_guide", fetcher)
    if (error) return <div>Error loading page{error}</div>
    if (!data) return <div>Loading ...</div>
    let subjects = getSubjects(data.subjects)
    return(
        <>
            <Head>
                <title>Subject</title>
            </Head>
            <div>
                <h1>{data.title}</h1>
                <ul>
                    {subjects}
                </ul>
            </div>
            <div className='newTable'>
            <form onSubmit={saveSubject}>
                    <table>
                        <tbody>
                            {newFields.length > 0 &&
                                    <tr><th><input type= 'text' placeholder='Enter Title' /></th></tr>
                            } 
                            <tr>
                                {newFields.map((v,i)=>{
                                    return (
                                        <td key={i}><input type='text' placeholder='Enter Field' /></td>
                                    )
                                })}
                                <td>
                                    <button type='button' onClick={newTable}>
                                        {newFields.length < 1 ? 
                                            'New Table' : 'Another Field'}
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    {newFields.length > 0 && <input type='submit' value='Save New Table'/> }
                </form>
            </div>
            <form onSubmit={logout}>
                <input type='submit' value = 'Logout'/>
            </form>
        </>
    );

    async function logout(event){
        event.preventDefault()
        try{
            let res = await fetch('http://localhost:3030/logout', {
                method: 'POST',
                credentials: 'include'
              })
            let json = await res.text()
            console.log(json)
        } catch(error) {
            console.error(error)
        }
    }
    function saveSubject(event){
        event.preventDefault()
        console.log(event.target)
    }
    function newTable(){
        setNewFields(newFields => [...newFields, null])
    }
    async function fetcher(url){
        try{
            let res = await fetch(url, {
                credentials: 'include'
              })
            let json = await res.json()
            return json
        } catch(error) {
            console.error(error)
        }
    }
    function getSubjects(subjects){
        let elements = []
        for (let i = 0; i < subjects.length; i++){
            elements[i] = 
            <li key={subjects[i]._id}>
                    <Link href='/subject/[id]' as={`/subject/${subjects[i]._id}`} >
                        <a>{subjects[i].title}</a>
                    </Link>
                </li>
        }
        return elements
    }
}
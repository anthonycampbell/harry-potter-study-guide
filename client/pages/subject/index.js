import Head from 'next/head'
import Link from 'next/link'
import useSWR from 'swr'
import React, {useState, useEffect} from 'react'

export default function Subject(){
    const {data, error} = useSWR("http://localhost:3030/", fetcher)
    if (error) return <div>Error loading page{error}</div>
    if (!data) return <div>Loading ...</div>
    let subjects = getSomething(data.subjects)
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
        </>
    );    
    async function fetcher(url){
        try{
            let res = await fetch(url)
            let json = await res.json()
            return json
        } catch(error) {
            console.error(error)
        }
    }
    function getSsubjects(subjects){
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
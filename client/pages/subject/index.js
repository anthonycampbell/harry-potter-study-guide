import Head from 'next/head'
import Link from 'next/link'
import useSWR from 'swr'
import React, {useState, useEffect} from 'react'

export default function Subject(){
    const [newFields, setNewFields] = useState([])
    const {data, error} = useSWR("http://localhost:3030/", fetcher)
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
                <table>
                    <tbody>
                        <tr>
                            <th>
                                {
                                    newFields.map((v,i)=>{
                                            if (i == 0){ 
                                                return <input type= 'text' placeholder='Enter Title' /> 
                                            } 
                                            return <input key={i} type='text' placeholder='Enter Field' />
                                    })
                                }
                            </th>
                        </tr>
                    </tbody>
                </table>
                <button type='button' onClick={newTable}>
                    {newFields.length < 1 ? 'New Table' : newFields.length < 2 ? 'Add Field' : 'Another Field'}
                </button>
                {/*<form onSubmit={onSubmit}>
                    {
                        newFields.map((v, i) => {
                            return(
                                <label key={i}>
                                    <input type='number'
                                        step='1'
                                        min='0'
                                        max='100' 
                                        name='numFields' 
                                        placeholder='Number of Fields' />
                                </label>
                            )
                        })
                    }
                    <input type="submit" value="New Table"/>
                </form>*/}
            </div>
        </>
    );
    function newTable(){
        setNewFields(newFields => [...newFields, null])
        //<input type='text' placeholder='Enter Title' />
    }
    function newField(){
        <input type='text' placeholder='Enter Field' />
    }
    async function fetcher(url){
        try{
            let res = await fetch(url)
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
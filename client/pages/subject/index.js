import React, { useState } from 'react'
import NewSubject, { formatSubjects } from '../../components/newSubject'
import { auth } from '../../utils/authenticate'
import { fetchUserData } from '../../utils/fetchUserData'

export default function Subject({ data }){
    const emptyTable = {
        title: null,
        fields: []
    }
    const [tables, setTables] = useState([emptyTable])
    let subjects = formatSubjects(data.subjects)

    function saveSubject(event, i){
        event.preventDefault()
        console.log(tables[i])
        discardTable(i)
    }
    
    function newTable(){
        setTables([...tables, {title: '', fields: ['']}])
    }
    function addField(i){
        setTables(tables => {
            tables[i].fields.push('')
            return [...tables]
        })
    }
    function removeField(i){
        setTables(tables => {
                tables[i].fields.pop()
                return [...tables]
            })
    }

    function discardTable(i){
        setTables(tables => {
            if (tables.length <= 1){
                return [emptyTable]
            }
            tables.splice(i, 1)
            return [...tables]
        })
    }

   return (
        <>
            <div>
                <h1>{data.title}</h1>
                <ul>
                    {subjects}
                </ul>
            </div>
            <div className='newTable'>
                
                {tables.map((v,i)=>{
                    return <NewSubject saveSubject = {saveSubject} 
                            table = {tables[i]} 
                            i = {i}
                            addField = {addField}
                            removeField = {removeField}
                            discardTable = {discardTable}
                            key={i}/>
                })}
            </div>
            <button type='button' onClick={ newTable }>New Table</button>
        </>
    
   );
}

export async function getServerSideProps(ctx){
    auth(ctx, '/subject/index', '/login')
    let userData = await fetchUserData(ctx)
    let data
    try{
        let res = await fetch('http://localhost:3030/harry_potter_study_guide', {
            credentials: 'include',
            headers: ctx.req ? {cookie: ctx.req.headers.cookie} : undefined
          })
        data = await res.json()
    } catch(error) {
        console.error(error)
    }
    return { props: {friendRequests: userData.friendRequests, friends: userData.friends,  data: data } }
  }
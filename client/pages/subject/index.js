import React, { useState } from 'react'
import NewSubject, { formatSubjects } from '../../components/newSubject'
import { auth } from '../../utils/authenticate'
import { fetchUserData } from '../../utils/fetchUserData'

export default function Subject({ data }){
    const [newFields, setNewFields] = useState([])
    let subjects = formatSubjects(data.subjects)

    function saveSubject(event){
        event.preventDefault()
        console.log(event.target)
    }
    
    function newTable(){
        setNewFields(newFields => [...newFields, null])
    }

    function removeField(){
        setNewFields(newFields => newFields.splice(-1,1))
    }

    function discardTable(){
        setNewFields(newFields => [])
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
                <NewSubject saveSubject={saveSubject} 
                            newFields={newFields} 
                            removeField={removeField}
                            discardTable={discardTable}
                            newTable={newTable} />
            </div>
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
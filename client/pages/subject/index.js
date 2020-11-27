import React, { useState, useEffect } from 'react'
import NewSubject, { formatSubjects } from '../../components/newSubject'
import { auth } from '../../utils/authenticate'
import { fetchUserData } from '../../utils/fetchUserData'
import ShareDB from 'sharedb/lib/client'

export default function Subject({ data }){
    const [nc, setNC] = useState(0);
    var socket = null
    var connection = null
    var doc = null
    useEffect(()=>{
        var socket = new WebSocket('ws://localhost:3030')
        var connection = new ShareDB.Connection(socket)
        doc = connection.get('examples', 'counter')
        doc.subscribe(showNumbers)
        doc.on('op', showNumbers)
    })
    function showNumbers() {
        setNC(doc.data.numClicks)
    };
    function increment() {
        doc.submitOp([{p: ['numClicks'], na: 1}])
    }
    
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
            you clicked {nc} times
            
            <button type='button' onClick={increment} >+1</button>
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
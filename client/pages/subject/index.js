import React, { useState, useEffect } from 'react'
import NewSubject, { formatSubjects } from '../../components/newSubject'
import { auth } from '../../utils/authenticate'
import { fetchUserData } from '../../utils/fetchUserData'
import ShareDB from 'sharedb/lib/client'

function useForceUpdate(){
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => ++value); // update the state to force render
}

export default function Subject({ data }){
    const emptyTable = {title: null,fields: []}
    const [tables, setTables] = useState([emptyTable])
    const connection = getConn()
    const forceUpdate = useForceUpdate();
    let subjects = formatSubjects(data.subjects)

    function getConn(){
        const [conn, setConn] = useState(null)
        useEffect(()=>{
            var socket = new WebSocket('ws://localhost:3030')
            var connection = new ShareDB.Connection(socket)
            let doc = connection.get('examples', 'subjects')
            doc.subscribe()
            doc.on('load', call)
            doc.on('op', call)
            setConn(connection)
            function call(){
                setTables(doc.data.tables)
                forceUpdate()
            }
            return () => connection.close()
        },[])
        return conn
    }
    
    function newTable(){
        let doc = connection.get('examples', 'subjects')
        let l = doc.data.tables.length
        doc.submitOp([{p: ['tables', l+1], li:{title: '', fields: ['']} }])
    }

    function discardTable(i){
        let doc = connection.get('examples', 'subjects')
        let l = doc.data.tables.length
        let s = doc.data.tables[i]
        if (l <= 1){
            doc.submitOp([ {p: ['tables'], ld: s, li: [emptyTable]}])
        } else {
            doc.submitOp([ {p: ['tables', i], ld: s }])
        }
        /*setTables(tables => {
            if (tables.length <= 1){
                return [emptyTable]
            }
            tables.splice(i, 1)
            return [...tables]
        })*/
    }

    function addField(i){
        let doc = connection.get('examples', 'subjects')
        let fl = doc.data.tables[i].fields.length
        doc.submitOp([{p:['tables', i, 'fields', fl], li: ''}])
        /*setTables(tables => {
            tables[i].fields.push('')
            return [...tables]
        })*/
    }
    function removeField(i){
        let doc = connection.get('examples', 'subjects')
        let l = doc.data.tables.length
        let fl = doc.data.tables[i].fields.length
        doc.submitOp([{p:['tables', i, 'fields', fl-1], ld: ''}])
        /*setTables(tables => {
                tables[i].fields.pop()
                return [...tables]
        })*/
    }

    function handleChange(e, i){
        /*let doc = connection.get('examples', 'subjects')
        let o = Math.max(e.target.selectionStart - 1, 0)
        console.log(o)
        doc.submitOp([{p:['tables', i, 'title', o], si: e.target.value[o]}])*/
    }

    function onKeyDown(e, i){
        /*let doc = connection.get('examples', 'subjects')
        let o = e.target.selectionStart
        console.log(e.target.value)
        console.log(o)
        console.log(e.key)
        console.log(doc.data.tables[i].title[o-1])
        if (e.key === 'Backspace' && o > 0){
            doc.submitOp([{p:['tables', i, 'title', o-1], sd: doc.data.tables[i].title[o-1]}])
        } */
    }

    function saveSubject(event, i){
        event.preventDefault()
        console.log(tables[i])
        discardTable(i)
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
                            key={i}
                            handleChange= {handleChange}
                            onKeyDown = {onKeyDown}/>
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
import Head from 'next/head'
import useSWR from 'swr'
import { useState } from 'react'

function Entries({ path }){
    const api = useState("http://localhost:3030/harry_potter_study_guide"+path)
    const {data, error} = useSWR(api , fetcher)
    if (error) return <div>Error fetching data</div>
    if (!data) return <div>Loading ...</div>
    return(
        <>
            <Head>
                <title>Entries</title>
            </Head>
            <table>
                <tbody>
                    <tr>
                        {
                            data.subject.fields.map((field, i) => {
                                return <th key={i}>{field}</th>
                            })
                        }
                    </tr>
                    {
                        data.entries.map((entry) => {
                            return <tr key={entry._id}>
                                {
                                    entry.values.map((value, i) => {
                                        return <td key={i}>{ value }</td>
                                    })
                                }
                            </tr>
                        })
                    }
                </tbody>
            </table>
            <form onSubmit={onSubmit}>
                {
                    data.subject.fields.map((v,i) => {
                        return (
                            <label key={i}>
                                <input type="text" name={v} placeholder={v} />
                            </label>
                        )
                    })
                }
                <input type='submit' value={'add to '+ data.title}/>
            </form>
        </>
    );
    async function fetcher(url){
        try{
            let res = await fetch(url)
            let json = await res.json()
            return json
        } catch(error){
            console.error(error)
        }
    }
    function onSubmit(event) {
        /*event.preventDefault()
        console.log(event.target)
        const newEntry = new FormData(event.target)
        console.log(event.target.children)
        fetch(api, {
            method: 'POST',
            body: newEntry
        })*/
    }
}

Entries.getInitialProps = async ctx => {
    return {path : ctx.asPath}
}

export default Entries
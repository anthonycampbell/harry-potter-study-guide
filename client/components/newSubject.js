import Link from 'next/link'

export default function NewSubject({saveSubject, newFields, newTable}){
    return(
        <form onSubmit={saveSubject}>
            <table>
                <tbody>
                    { newFields.length > 0 
                    && <tr><th><input type= 'text' placeholder='Enter Title' /></th></tr> } 
                    <tr>
                        { newFields.map((v,i) => {
                            return (<td key={i}><input type='text' placeholder='Enter Field' /></td>)
                        }) }
                        <td>
                            <button type='button' onClick={ newTable }>
                                { newFields.length < 1 ? 
                                    'New Table' : 'Another Field' }
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            { newFields.length > 0 && <input type='submit' value='Save New Table'/> }
        </form>
    );
}

export function formatSubjects(subjects){
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
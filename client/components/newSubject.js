import Link from 'next/link'

function TableDeterminationButtons({discardTable, i}){
    return (
        <div>
            <input type='submit' value='Save New Table'/> 
            <button type='button' onClick={() => discardTable(i) }>Discard table</button>
        </div> 
    )
}
function THead({handleChange, table, i, onKeyDown}){
    return <tr><th><input onChange={(e) => handleChange(e,i)}
                          type='text' 
                          placeholder='Enter Title' 
                          value={table.title}
                          onKeyDown={(e) => onKeyDown(e,i)}/></th></tr>
}

export default function NewSubject({saveSubject, table, i, addField, removeField, discardTable, handleChange, onKeyDown}){
    return(
        <form onSubmit={(event) => saveSubject(event, i)}>
            <table>
                <tbody>
                    { table.title != null && <THead handleChange={handleChange}
                                                    table={table}
                                                    i={i}
                                                    onKeyDown={onKeyDown}/> } 
                    <tr>
                        {table.fields.map((v,i) => {
                            return <td key={i}><input type='text' placeholder='Enter Field' /></td>
                            })}
                        <td>
                            {table.title != null && <button type='button' onClick={() => addField(i) }>+</button>}
                            { table.fields.length > 0 ? 
                                <button type='button' onClick={() => removeField(i) }>-</button> 
                                : null }
                        </td>
                    </tr>
                </tbody>
            </table>
            { table.title != null && <TableDeterminationButtons discardTable={discardTable} i={i}/>}
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
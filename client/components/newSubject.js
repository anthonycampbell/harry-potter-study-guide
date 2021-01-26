import Link from 'next/link'
import styles from './newSubject.module.css'
import TextAreaAutoSize from 'react-textarea-autosize'
import React, { useRef, useState } from 'react'


function TableDeterminationButtons({discardTable, i}){
    return (
        <div>
            <button type='button' onClick={() => discardTable(i) }>Discard table</button>
        </div> 
    )
}
function THead({handleChange, table, i}){
    return <tr><th className={styles.t}><input onChange={(e) => handleChange(e,i)}
                          type='text' 
                          placeholder='Title' 
                          value={table.title}/></th></tr>
}
function Wrap({handleChange, i, j, table, active, setSelected}){
    const inputElement = useRef(null)
    function handleClick(e){
        inputElement.current.focus();
        setSelected(j)
    }
    return (
        <td key={j} onClick={handleClick} className={ active? styles.tds : styles.td}>
            <TextAreaAutoSize onChange={(e) => handleChange(e,i,j)}
                              ref={inputElement} 
                              placeholder='Enter Field'
                              value={table.fields[j]}
                              className={styles.ta}/>
        </td>
    )
}

export default function NewSubject({table, i, addField, removeField, discardTable, handleChange}){
    const [isSelected, setSelected] = useState()
    return(
        <div className={styles.d}>
            { table.title != null && 
            <table className={styles.t}>
                <tbody>
                    <THead handleChange={handleChange} table={table} i={i}/>
                    <tr>
                        {table.fields.map((v,j) =>  <Wrap key={j}
                                                          handleChange={handleChange}
                                                          i={i} 
                                                          j={j} 
                                                          table={table}
                                                          active={isSelected === j}
                                                          setSelected={setSelected}/>)}
                        <td className={styles.td} style={{height: '24px'}}>
                            <button type='button' onClick={() => addField(i) }>+</button>
                            { table.fields.length > 0 ? 
                                <button type='button' onClick={() => removeField(i) }>-</button> 
                                : null }
                        </td>
                    </tr>
                </tbody>
            </table> }
            { table.title != null && <TableDeterminationButtons discardTable={discardTable} i={i}/>}
        </div>
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
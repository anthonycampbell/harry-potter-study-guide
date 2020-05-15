import Head from 'next/head'
import React from 'react'
import Link from 'next/link'

class Subject extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            d: {}
        };
    }

    fetchSubjects(){
        fetch("http://localhost:3030/")
            .then(response => response.json())
            .then(data => this.setState({d: data}));
    }

    componentDidMount(){
        this.fetchSubjects();
    }

    render(){
        let subjects = this.state.d.subjects
        let elements = []
        if (subjects){
            for (let i = 0; i < subjects.length; i++){
                elements[i] = 
                    <li key={subjects[i]._id}>
                        <Link href='/subject/[id]' as={`/subject/${subjects[i]._id}`} >
                            <a>{subjects[i].title}</a>
                        </Link>
                    </li>
            }
        }
        return(
            <>
                <Head>
                    <title>Subject</title>
                </Head>
                <div>
                    <h1>{this.state.d.title}</h1>
                    <ul>
                        {elements}
                    </ul>
                </div>
            </>
        );
    }
}

export default Subject
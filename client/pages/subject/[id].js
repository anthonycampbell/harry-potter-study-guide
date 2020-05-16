import Head from 'next/head'
import React from 'react'

export default class Entries extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            context: {}
        }
    }

    fetchContext(){
        fetch('http://localhost:3030/harry_potter_study_guide/subject/')
            .then(res => res.json())
            .then(data => this.setState({context: data}));
    }

    componentDidMount(){
        this.fetchContext();
    }

    render(){
        if (this.state.context[0]){
            console.log(this.state.context);
        }
        return(
            <>
                <Head>
                    <title>Entries</title>
                </Head>
                <div>
                </div>
            </>
        );
    }
}
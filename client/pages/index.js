import Head from 'next/head'
import Link from 'next/link'
import React from 'react'

export default class Home extends React.Component {
  render(){
    const elements = [];
    for (let i = 0; i < 10; i++){
      elements[i] = <li>
                      <Link href=''>
                        <a>{i.toString()}
                        </a>
                      </Link>
                    </li>
    }
    return(
      <>
        <Head>
          <title>Joy</title>
        </Head>
        <div>
          <ul>
            {elements}
          </ul>
        </div>
      </>
    );
  }
}

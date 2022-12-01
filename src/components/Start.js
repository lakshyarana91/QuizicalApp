import React from 'react'



export default function Start(props) {

    return (
        <div className='start'  >
            <h1>Quizzical</h1>
            <p>Some Description if needed</p>
            <button className='btn'  onClick={() => props.setStarted(true)} >Start Quiz</button>
        </div>
    )

}
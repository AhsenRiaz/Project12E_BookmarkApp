import React from 'react'
import {SpinnerRoundFilled} from "spinners-react"
import "./component.css"


const Loading = () => {
    return (
        <div className = "spinner" >
            <SpinnerRoundFilled size={50} thickness={180} speed={180} color="rgba(57, 62, 172, 1)" />
        </div>
    )
}

export default Loading

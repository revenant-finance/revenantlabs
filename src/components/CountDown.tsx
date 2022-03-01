import dayjs from 'dayjs'
import React from 'react'
import ReactCountdown from 'react-countdown'

const Countdown = ({ date }) => {
    return (
        <>
            <ReactCountdown date={dayjs.unix(date).toString()} />
        </>
    )
}

export default Countdown

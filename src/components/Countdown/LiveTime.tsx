import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

export default function LiveTime({ date }) {
    const [currentDate, setCurrentDate] = useState(Date.now())

    useEffect(() => {
        const timer = setInterval(() => setCurrentDate(Date.now()), 1000)
        return () => clearInterval(timer)
    }, [])

    // return date
    return `${dayjs(currentDate).diff(dayjs.unix(date), 'second')}`
}

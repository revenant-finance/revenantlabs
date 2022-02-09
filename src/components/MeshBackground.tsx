import classNames from 'classnames'
import { nanoid } from 'nanoid'
import { useEffect } from 'react'
import { Gradient } from '../lib/gradient'

export default function MeshBackground({ id }) {
    let gradient

    useEffect(() => {
        try {
            if (gradient) return
            gradient = new Gradient()
            gradient.initGradient(`#${id}`)
        } catch (error) {
            console.log(error)
        }
    }, [])

    return <canvas id={id} className={classNames('absolute h-full w-full inset-0')} data-transition-in></canvas>
}

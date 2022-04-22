import classNames from 'classnames'
import { useEffect } from 'react'
import { Gradient } from '../../lib/gradient'

export default function MeshBackground({ id, className }) {
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

    return (
        <canvas
            id={id}
            className={classNames('fixed h-full w-full inset-0 filter blur-xl', className)}
            data-transition-in
        />
    )
}

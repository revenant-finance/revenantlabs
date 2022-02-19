import classNames from 'classnames'
import { useRef } from 'react'

interface Input {
    value: string | number
    loading?: boolean
    label?: any
    children?: any
    type?: string
    className?: string
    // disabled?: boolean
    onChange?: (any) => any
    onMax?: (any) => any
}

export default function Input(props: Input) {
    const { children, loading, className, onMax, label } = props

    return (
        <div>
            {label && <p className="text-xs font-medium mb-1">{label}</p>}
            <div className="w-full bg-white rounded bg-opacity-10 overflow-hidden flex items-stretch">
                <input {...props} type={props.type || 'text'} className="w-full px-4 py-2 h-full outline-none bg-transparent" />
                {onMax && (
                    <button onClick={onMax} className="text-xs font-medium px-2">
                        Max
                    </button>
                )}
            </div>
        </div>
        // <button {...props} className={classNames(className, 'w-full relative px-4 py-2 font-medium rounded', disabled && 'cursor-not-allowed opacity-50')}>
        //     {loading && (
        //         <div className="absolute inset-0 text-0 flex items-center justify-center w-full h-full">
        //             <i className="fas fa-circle-notch fa-spin" />
        //         </div>
        //     )}
        //     <div className={classNames(loading && 'opacity-10')}>{children}</div>
        // </button>
    )
}

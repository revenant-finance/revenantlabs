import classNames from 'classnames'

interface Button {
    loading?: boolean
    children: any
    className?: string
    disabled?: boolean
}

export default function Button(props: Button) {
    const { children, loading, className, disabled: disbaledFromProps } = props
    const disabled = loading || disbaledFromProps
    return (
        <button {...props} className={classNames(className, 'w-full relative px-4 py-2 font-medium', disabled && 'cursor-not-allowed opacity-50')}>
            {loading && (
                <div className="absolute inset-0 text-0 flex items-center justify-center w-full h-full">
                    <i className="fas fa-circle-notch fa-spin" />
                </div>
            )}
            <div className={classNames(loading && 'opacity-10')}>{children}</div>
        </button>
    )
}

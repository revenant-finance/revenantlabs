import classNames from 'classnames'

interface Button {
    loading?: boolean
    children: any
    className?: string
    disabled?: boolean
    onClick?: (any) => any
}

export default function Button(props: Button) {
    const { children, onClick, loading, className, disabled: disabledFromProps } = props
    const disabled = disabledFromProps

    return (
        <button {...{ disabled, onClick }} type="button" className={classNames(className, 'w-full relative px-4 py-2 font-medium rounded', disabled && 'cursor-not-allowed opacity-50')}>
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center w-full h-full text-0">
                    <i className="fas fa-circle-notch fa-spin" />
                </div>
            )}
            <div className={classNames(loading && 'opacity-10')}>{children}</div>
        </button>
    )
}

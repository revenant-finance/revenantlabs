import classNames from 'classnames'

interface Button {
    loading?: boolean
    children: any
    className?: string
}

export default function Button(props: Button) {
    const { children, loading, className } = props
    return (
        <button {...props} className={classNames(className, 'relative px-4 py-2 font-medium')}>
            {loading && (
                <div className="absolute inset-0 text-0 flex items-center justify-center w-full h-full">
                    <i className="fas fa-circle-notch fa-spin" />
                </div>
            )}
            <div className={classNames(loading && 'opacity-50')}>{children}</div>
        </button>
    )
}
